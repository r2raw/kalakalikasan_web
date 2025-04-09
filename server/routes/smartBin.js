const express = require("express");
const { db } = require('../data/firebase.js');
const router = express.Router();
const { uid } = require('uid')
const multer = require('multer');
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const _ = require('lodash');
const { lowerCaseTrim } = require("../util/myFunctions.js");
const { type } = require("os");
const { Timestamp } = require("firebase-admin/firestore");
const { error } = require("console");


router.post('/smart-bin', async (req, res, next) => {
    const errors = [];
    const { transaction_id, claim_type, materials, total_points } = req.body;
    const { material_name, points_collected, total_grams } = materials[0]
    const batch = db.batch();
    let claiming_status = 'pending'

    try {


        const trans_id = transaction_id.substring(0, 12);

        if (claim_type == 'direct_to_bin') {
            claiming_status = 'completed'
        }

        if (!transaction_id ||
            !claim_type || claim_type == '' ||
            !materials ||
            materials.length == 0 ||
            !total_points ||
            !material_name || material_name == ''
        ) {
            errors.push('Invalid data')
        }

        if (errors.length > 0) {
            return res.status(501).json({ message: 'error', errors: errors })
        }
        const binData = {
            transaction_id: trans_id,
            claim_type,
            total_points,
            claiming_status,
            transaction_date: admin.firestore.FieldValue.serverTimestamp(),
            claiming_date: claim_type == 'direct_to_bin' ? admin.firestore.FieldValue.serverTimestamp() : null,
            claimed_by: null,
            transaction_officer: null,
        }

        const smartBinRef = db.collection('smart_bin').doc(trans_id);

        batch.set(smartBinRef, binData, { merge: true });

        materials.forEach(material => {
            const materialRef = smartBinRef.collection('materials').doc();
            batch.set(materialRef, material, { merge: true })
        });



        const saveData = batch.commit()
        return res.status(200).json({ message: 'success', data: binData, materials })
        // admin.firestore.FieldValue.serverTimestamp()
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })

    }
})


router.post('/direct-cash', async (req, res, next) => {
    try {
        const batch = db.batch();
        const { transaction_id, materials, total_points, collecting_officer } = req.body;

        if (!transaction_id ||
            !materials ||
            materials.length == 0 ||
            !total_points
        ) {
            return res.status(501).json({ message: 'error', error: 'invalid data' })
        }

        const trans_id = transaction_id.substring(0, 12);
        const binData = {
            transaction_id: trans_id,
            claim_type: 'cash',
            total_points,
            claiming_status: 'completed',
            transaction_date: admin.firestore.FieldValue.serverTimestamp(),
            claiming_date: admin.firestore.FieldValue.serverTimestamp(),
            claimed_by: null,
            transaction_officer: collecting_officer,
        }



        const officerRef = db.collection('users').doc(collecting_officer)
        const officerSnapshot = await officerRef.get()


        if (!officerSnapshot.exists) {
            return res.status(404).json({ message: 'error', error: 'Officer not found' })
        }


        const officerTransactionRef = officerRef.collection('transactions').doc()
        const officerTransactionData = {
            transactionId: trans_id,
            type: "collect",
            transactionDate: admin.firestore.FieldValue.serverTimestamp(),
        };


        const smartBinRef = db.collection('smart_bin').doc(trans_id);

        batch.set(smartBinRef, binData, { merge: true })
        materials.forEach(material => {
            const materialRef = smartBinRef.collection('materials').doc();
            batch.set(materialRef, material, { merge: true })
        });

        batch.set(officerTransactionRef, officerTransactionData, { merge: true })

        await batch.commit()
        return res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message)
        return res.status(501).json({ message: error.message, error: 'Internal server error' })
    }
})


router.post('/officer-cashout', async (req, res, next) => {
    try {
        const { officerId, userId, amount } = req.body;

        const userRef = db.collection('users').doc(userId)
        const userSnapshot = await userRef.get()
        const notifRef = db.collection('notifications').doc()

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User does not exist!' })
        }

        if (userSnapshot.data().status == 'deactivated') {
            return res.status(409).json({ error: 'this account has been deactivated already!' })
        }

        const userData = userSnapshot.data()

        if (userData.points < parseInt(amount)) {
            return res.status(409).json({ error: 'Insufficient points' })
        }



        const paymentData = {
            acceptance_image: null,
            amount,
            approved_by: officerId,
            date_approved: admin.firestore.FieldValue.serverTimestamp(),
            date_requested: admin.firestore.FieldValue.serverTimestamp(),
            rejected_date: null,
            rejected_reason: null,
            status: 'approved',
            store_id: null,
            type: 'cash',
            userId: userId,
        }

        const id = uid(16)

        const residentNotif = {
            title: "Cashout Successful! 💰",
            message: `Your cashout request of ${amount} Eco-Coins has been processed. ${amount} points have been deducted from your balance. Thank you for your continued support! 🌱`,
            send_type: "direct",
            notif_type: "transactions",
            redirect_type: "payment",
            redirect_id: id,
            userId: userId,
            readBy: [],
            notif_date: admin.firestore.FieldValue.serverTimestamp(),
        };

        const postNotif = await notifRef.set(residentNotif, { merge: true })
        const paymentRef = db.collection('payment_request').doc(id)
        const currentPoints = userData.points - parseInt(amount);

        const updatePoints = await userRef.set({ points: currentPoints }, { merge: true })
        const saveTransaction = await paymentRef.set(paymentData, { merge: true })

        return res.status(200).json({ message: 'success' })

    } catch (error) {
        return res.status(501).json({ message: error.message, error: error.message })
    }
})
router.patch('/officer-receipt', async (req, res, next) => {
    try {
        const { claimed_by, transaction_officer, points, transactionId, } = req.body;
        const notifRef = db.collection('notifications').doc()
        const binRef = db.collection('smart_bin').doc(transactionId)

        const binData = {
            claimed_by,
            transaction_officer,
            claiming_status: 'completed',
            claiming_date: admin.firestore.FieldValue.serverTimestamp(),
        }


        const residentRef = db.collection('users').doc(claimed_by);
        const residentSnapshot = await residentRef.get()


        if (!residentSnapshot.exists) {
            return res.status(200).json({ error: 'User not found!' })
        }
        const residentNotif = {
            title: "Thanks for Recycling!",
            message: `Congratulations! 🎉 You’ve received ${points} Eco-Coins for recycling your materials. Thank you for contributing to a greener future! 🌱`,
            send_type: "direct",
            notif_type: "transactions",
            redirect_type: "receipt",
            redirect_id: transactionId,
            userId: claimed_by,
            readBy: [],
            notif_date: admin.firestore.FieldValue.serverTimestamp(),
        };


        const userPoint = residentSnapshot.data().points

        const updatedPoints = userPoint + points

        const officerRef = db.collection('users').doc(transaction_officer)

        const residentTransactionRef = residentRef.collection("transactions").doc();
        const residentTransactionData = {
            transactionId: transactionId,
            type: "recieved",
            transactionDate: admin.firestore.FieldValue.serverTimestamp(),
        };

        const officerTransactionRef = officerRef.collection('transactions').doc()
        const officerTransactionData = {
            transactionId: transactionId,
            type: "collect",
            transactionDate: admin.firestore.FieldValue.serverTimestamp(),
        };

        const postNotif = await notifRef.set(residentNotif, { merge: true })
        const saveOfficerTransaction = await officerTransactionRef.set(officerTransactionData, { merge: true })
        const saveResidentTransaction = await residentTransactionRef.set(residentTransactionData, { merge: true })
        const updateBin = await binRef.set(binData, { merge: true })
        const updatePoints = await residentRef.set({ points: updatedPoints }, { merge: true })


        return res.status(200).json({ message: 'success' })
    } catch (error) {

        console.log(error.message)
        return res.status(501).json({ error: error.message })
    }
})
router.post('/smart-bin-officer', async (req, res, next) => {
    const errors = [];
    const { transaction_id, materials, total_points, collecting_officer, claimed_by } = req.body;
    const { material_name, points_collected, total_grams } = materials[0]
    const batch = db.batch();

    try {

        console.log('trans id:' + transaction_id)
        const trans_id = transaction_id.substring(0, 12);

        if (!transaction_id ||
            !materials ||
            materials.length == 0 ||
            !total_points ||
            !material_name || material_name == ''
        ) {
            return res.status(501).json({ message: 'error', error: 'invalid data' })
        }

        const binData = {
            transaction_id: trans_id,
            claim_type: 'officer_transaction',
            total_points,
            claiming_status: 'completed',
            transaction_date: admin.firestore.FieldValue.serverTimestamp(),
            claiming_date: admin.firestore.FieldValue.serverTimestamp(),
            claimed_by,
            transaction_officer: collecting_officer,
        }

        const residentRef = db.collection('users').doc(claimed_by);
        const residentSnapshot = await residentRef.get()
        const officerRef = db.collection('users').doc(collecting_officer)
        const officerSnapshot = await officerRef.get()

        if (!residentSnapshot.exists) {
            return res.status(404).json({ message: 'error', error: 'User not found' })
        }
        if (!officerSnapshot.exists) {
            return res.status(404).json({ message: 'error', error: 'Officer not found' })
        }

        const residentNotif = {
            title: "Thanks for Recycling!",
            message: `Congratulations! 🎉 You’ve received ${total_points} Eco-Coins for recycling your materials. Thank you for contributing to a greener future! 🌱`,
            send_type: "direct",
            notif_type: "transactions",
            redirect_type: "receipt",
            redirect_id: trans_id,
            userId: claimed_by,
            readBy: [],
            notif_date: admin.firestore.FieldValue.serverTimestamp(),
        };



        const residentTransactionRef = residentRef.collection("transactions").doc();

        const residentTransactionData = {
            transactionId: trans_id,
            type: "recieved",
            transactionDate: admin.firestore.FieldValue.serverTimestamp(),
        };

        const officerTransactionRef = officerRef.collection('transactions').doc()
        const officerTransactionData = {
            transactionId: trans_id,
            type: "collect",
            transactionDate: admin.firestore.FieldValue.serverTimestamp(),
        };

        const { points } = residentSnapshot.data()

        const updatedPoints = points + total_points

        const residentNotifRef = db.collection('notifications').doc()

        const smartBinRef = db.collection('smart_bin').doc(trans_id);

        console.log(updatedPoints)
        batch.set(smartBinRef, binData, { merge: true });
        batch.set(residentTransactionRef, residentTransactionData, { merge: true })
        batch.set(officerTransactionRef, officerTransactionData, { merge: true })
        batch.set(residentNotifRef, residentNotif, { merge: true });
        batch.set(residentRef, { points: updatedPoints }, { merge: true })

        materials.forEach(material => {
            const materialRef = smartBinRef.collection('materials').doc();
            batch.set(materialRef, material, { merge: true })
        });

        const saveData = await batch.commit()
        return res.status(200).json({ message: 'success', data: binData, materials })
        // admin.firestore.FieldValue.serverTimestamp()
    } catch (error) {
        console.error(error)
        return res.status(501).json({ message: error.message, error: 'Internal server error' })

    }
})
router.get('/rates', async (req, res, next) => {
    try {
        const pet_coins_value = 100;
        const pet_points_value = 100;
        const can_coins_value = 100;
        const can_points_value = 100;

        const rates = {
            pet_bottle: {
                coins_value: pet_coins_value,
                points_value: pet_points_value
            }, incan_bottle: {

                coins_value: can_coins_value,
                points_value: can_points_value
            }
        }

        return res.status(200).json(rates)
    } catch (error) {
        return res.status(501).json({ message: error.message })
    }
})


router.get('/get-receipt/:id', async (req, res, next) => {

    const { id } = req.params;
    const materials = [];
    let responseObj = {};
    try {
        const smartBinRef = db.collection('smart_bin').doc(id);
        const materialRef = smartBinRef.collection('materials');
        const smartBinDoc = await smartBinRef.get();
        const materialDoc = await materialRef.get();

        if (!smartBinDoc.exists) {
            return res.status(401).json({ message: 'Not found', error: `Transaction id ${id} does not exist` });

        }

        materialDoc.forEach(material => {
            materials.push({ ...material.data() });
        })



        responseObj = {
            ...smartBinDoc.data(),
            materials
        }

        console.log(responseObj)

        // console.log(responseArr)
        return res.status(200).json({ message: 'success', receipt: responseObj })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, error: 'Something went wrong!' })
    }
})

router.patch('/receipt', async (req, res, next) => {
    const { userId, transactionId, points } = req.body;
    const errors = [];
    const materials = [];
    let responseObj = {};
    try {
        const userRef = db.collection('users').doc(userId);
        const transactionRef = userRef.collection('transactions').doc();
        const notificationRef = db.collection('notifications').doc();
        const smartBinRef = db.collection('smart_bin').doc(transactionId);

        const userRefDoc = await userRef.get();
        let currentPoints = points;

        if (userRefDoc.data().points !== undefined) {
            currentPoints = userRefDoc.data().points + points;
        }
        const notificationData = {
            title: 'Points successfully claimed',
            message: `You have claimed a total of ${points} Eco-coins.`,
            send_type: 'direct',
            notif_type: 'transactions',
            redirect_type: 'receipt',
            redirect_id: transactionId,
            userId,
            readBy: [],
            notif_date: admin.firestore.FieldValue.serverTimestamp(),
        }

        const smartBinData = {
            claimed_by: userId,
            claiming_date: admin.firestore.FieldValue.serverTimestamp(),
            claiming_status: 'completed',
        }

        const transactionData = {
            transactionId,
            type: 'received',
            transactionDate: admin.firestore.FieldValue.serverTimestamp(),
        }


        const savePoints = await userRef.set({ points: currentPoints }, { merge: true });
        const saveSmartBin = await smartBinRef.set(smartBinData, { merge: true });
        const saveTransaction = await transactionRef.set(transactionData, { merge: true });
        const saveNotification = await notificationRef.set(notificationData, { merge: true });



        // console.log(responseArr)
        return res.status(200).json({ message: 'success', smartBinData, notificationData, transactionData })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message })
    }
})

router.get('/fetch-username/:username', async (req, res, next) => {
    try {
        const { username } = req.params;
        console.log(username)
        const userRef = db.collection('users').where('username', '==', lowerCaseTrim(username).replace(' ', '')).where('role', 'not-in', ['admin, officer']).where('status', '==', 'activated');
        const userSnapshot = await userRef.get();

        if (userSnapshot.empty) {
            return res.status(404).json({ error: `${username} does not exist!` })
        }

        let userObj = {}

        userSnapshot.forEach((user) => userObj = { userId: user.id, ...user.data() })

        return res.status(200).json({ userData: userObj })
    } catch (error) {
        return res.status(501).json({ message: 'error', error: error.message });
    }
})


router.get('/qr-scan-user/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id)
        const userRef = db.collection('users').doc(id)
        const userSnapshot = await userRef.get()

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: `A user with an id of ${id} does not exist!` })
        }

        if (userSnapshot.data().status == 'deactivated') {
            return res.status(409).json({ error: 'User is deactivated' });
        }

        console.log({ userId: userSnapshot.id, ...userSnapshot.data() })

        return res.status(200).json({ userId: userSnapshot.id, ...userSnapshot.data() })

    } catch (error) {
        console.error(error.message)

        return res.status(501).json({ message: 'error', error: error.message });
    }
})


router.get('/total-collected-today', async (req, res, next) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // 12:00 AM
        const endOfDay = new Date(now.setHours(23, 59, 59, 999)); // 11:59 PM

        // Convert to Firestore Timestamp
        const startTimestamp = Timestamp.fromDate(startOfDay);
        const endTimestamp = Timestamp.fromDate(endOfDay);

        // Query Firestore for today's transactions
        const binRef = db.collection('smart_bin')
            .where('transaction_date', '>=', startTimestamp)
            .where('transaction_date', '<=', endTimestamp);

        const snapshot = await binRef.get();

        if (snapshot.empty) {
            return res.status(200).json({ message: "No transactions found today", total_grams: 0 });
        }

        let totalGrams = 0;
        const transactionPromises = snapshot.docs.map(async (doc) => {
            const materialsRef = doc.ref.collection('materials'); // Access subcollection
            const materialsSnapshot = await materialsRef.get();

            // Sum total grams from each material document
            materialsSnapshot.forEach(materialDoc => {
                const materialData = materialDoc.data();
                totalGrams += materialData.total_grams || 0; // Ensure it doesn't break if field is missing
            });
        });

        // Wait for all transactions to process
        await Promise.all(transactionPromises);
        return res.status(200).json({ total_grams: totalGrams });
    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})


router.get('/materials-collected-today', async (req, res, next) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0)); // 12:00 AM
        const endOfDay = new Date(now.setHours(23, 59, 59, 999)); // 11:59 PM

        const startTimestamp = Timestamp.fromDate(startOfDay);
        const endTimestamp = Timestamp.fromDate(endOfDay);

        const binRef = db.collection('smart_bin')
            .where('transaction_date', '>=', startTimestamp)
            .where('transaction_date', '<=', endTimestamp);

        const snapshot = await binRef.get();

        if (snapshot.empty) {
            return res.status(200).json({ message: "No transactions found today", materials: {} });
        }

        let materialTotals = {};

        const transactionPromises = snapshot.docs.map(async (doc) => {
            const materialsRef = doc.ref.collection('materials');
            const materialsSnapshot = await materialsRef.get();

            materialsSnapshot.forEach(materialDoc => {
                const materialData = materialDoc.data();
                const materialName = materialData.material_name || "Unknown";
                const grams = materialData.total_grams || 0;

                if (!materialTotals[materialName]) {
                    materialTotals[materialName] = 0;
                }
                materialTotals[materialName] += grams;
            });
        });

        await Promise.all(transactionPromises);

        return res.status(200).json({ materials: materialTotals });
    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})

router.get('/total-materials-collected', async (req, res, next) => {
    try {
        console.log(`Fetching all data...`);

        const binRef = db.collection('smart_bin');
        const snapshot = await binRef.get();

        let materialData = [];

        for (const doc of snapshot.docs) {
            const transactionData = doc.data();

            let transactionDate = transactionData.transaction_date?.toDate ? transactionData.transaction_date.toDate() : new Date(transactionData.transaction_date);


            const materialsRef = binRef.doc(doc.id).collection('materials');
            const materialsSnapshot = await materialsRef.get();

            materialsSnapshot.forEach((materialDoc) => {
                const data = materialDoc.data();

                materialData.push({
                    material_name: data.material_name,
                    date: transactionDate,
                    total_grams: data.total_grams
                });
            });
        }

        console.log("📌 Returning all raw data...");
        return res.status(200).json(materialData);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});








router.get('/monthly-expense-summary', async (req, res) => {
    try {
        const now = new Date();

        // Get start and end dates for this, last, and two months ago
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const startOfTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0, 0);
        const endOfTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);

        // Convert to Firestore Timestamp
        const startTimestampThisMonth = Timestamp.fromDate(startOfMonth);
        const endTimestampThisMonth = Timestamp.fromDate(endOfMonth);

        const startTimestampLastMonth = Timestamp.fromDate(startOfLastMonth);
        const endTimestampLastMonth = Timestamp.fromDate(endOfLastMonth);

        const startTimestampTwoMonthsAgo = Timestamp.fromDate(startOfTwoMonthsAgo);
        const endTimestampTwoMonthsAgo = Timestamp.fromDate(endOfTwoMonthsAgo);

        // Function to fetch total expenses for a given period
        const fetchMonthlyExpenses = async (startTimestamp, endTimestamp) => {
            let totalExpense = 0;

            const binRef = db.collection('smart_bin')
                .where('transaction_date', '>=', startTimestamp)
                .where('transaction_date', '<=', endTimestamp);

            const snapshot = await binRef.get();

            if (!snapshot.empty) {
                const transactionPromises = snapshot.docs.map(async (doc) => {
                    const transactionData = doc.data();

                    if (transactionData.claim_type === "direct_to_bin" || transactionData.claim_type === "cash") {
                        totalExpense += transactionData.total_points || 0;
                    } else {
                        const paymentRef = db.collection('payment_request')
                            .where('store_id', '==', doc.id)
                            .where('status', '==', 'approved');

                        const paymentSnapshot = await paymentRef.get();
                        paymentSnapshot.forEach((paymentDoc) => {
                            totalExpense += paymentDoc.data().amount || 0;
                        });
                    }
                });

                await Promise.all(transactionPromises);
            }

            return totalExpense;
        };

        // Fetch expenses for current, last, and two months ago
        const thisMonthExpense = await fetchMonthlyExpenses(startTimestampThisMonth, endTimestampThisMonth);
        const lastMonthExpense = await fetchMonthlyExpenses(startTimestampLastMonth, endTimestampLastMonth);
        const twoMonthsAgoExpense = await fetchMonthlyExpenses(startTimestampTwoMonthsAgo, endTimestampTwoMonthsAgo);

        let growthRate;
        if (lastMonthExpense === 0) {
            growthRate = "N/A"; // No comparison possible
        } else if (thisMonthExpense < lastMonthExpense) {
            if (twoMonthsAgoExpense > 0) {
                // Compare with two months ago if it exists
                growthRate = ((thisMonthExpense - twoMonthsAgoExpense) / twoMonthsAgoExpense) * 100;
                growthRate = Number(growthRate.toFixed(2)) + "%";
            } else {
                // If two months ago has no data, return the max of last month
                growthRate = `Max Expense Last Month: ${lastMonthExpense}`;
            }
        } else {
            // Normal growth rate calculation
            growthRate = ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;
            growthRate = Number(growthRate.toFixed(2)) + "%";
        }

        return res.status(200).json({
            this_month_expense: thisMonthExpense,
            last_month_expense: lastMonthExpense,
            two_months_ago_expense: twoMonthsAgoExpense,
            growth_rate: growthRate
        });
    } catch (error) {
        console.error("Error computing monthly expense summary:", error);
        return res.status(500).json({ error: error.message });
    }
});

router.get('/available-years', async (req, res) => {
    try {
        const binRef = db.collection('smart_bin');
        const snapshot = await binRef.get();

        let years = new Set();

        snapshot.forEach(doc => {
            const data = doc.data();

            if (data.transaction_date) {
                let transactionDate;

                if (data.transaction_date.toDate) {
                    transactionDate = data.transaction_date.toDate();
                } else {
                    transactionDate = new Date(data.transaction_date);
                }

                if (!isNaN(transactionDate.getTime())) {
                    const year = transactionDate.getFullYear();
                    years.add(year);
                } else {
                    console.warn(`Invalid date format in document ${doc.id}:`, data.transaction_date);
                }
            } else {
                console.warn(`Missing transaction_date in document ${doc.id}`);
            }
        });

        return res.status(200).json([...years].sort((a, b) => b - a));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});



router.get('/monthly-expense-forecast', async (req, res) => {
    try {
        const now = new Date();

        // Function to get start and end of any given month
        const getMonthRange = (year, month) => {
            const start = new Date(year, month, 1, 0, 0, 0, 0);
            const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
            return { start: Timestamp.fromDate(start), end: Timestamp.fromDate(end) };
        };

        // Get timestamps for past 2 months, current month, and next 3 months
        const monthRanges = {
            thisMonth: getMonthRange(now.getFullYear(), now.getMonth()),
            lastMonth: getMonthRange(now.getFullYear(), now.getMonth() - 1),
            twoMonthsAgo: getMonthRange(now.getFullYear(), now.getMonth() - 2),
            nextMonth: getMonthRange(now.getFullYear(), now.getMonth() + 1),
            secondMonth: getMonthRange(now.getFullYear(), now.getMonth() + 2),
            thirdMonth: getMonthRange(now.getFullYear(), now.getMonth() + 3),
        };

        // Function to fetch total expenses for a given period
        const fetchMonthlyExpenses = async (startTimestamp, endTimestamp) => {
            let totalExpense = 0;

            // Fetch direct claim expenses (direct_to_bin & cash)
            const binSnapshot = await db.collection('smart_bin')
                .where('transaction_date', '>=', startTimestamp)
                .where('transaction_date', '<=', endTimestamp)
                .get();

            binSnapshot.forEach(doc => {
                const transactionData = doc.data();
                if (transactionData.claim_type === "direct_to_bin" || transactionData.claim_type === "cash") {
                    totalExpense += transactionData.total_points || 0;
                }
            });

            // Fetch approved payment requests that fall within this period
            const paymentSnapshot = await db.collection('payment_request')
                .where('status', '==', 'approved')
                .where('date_approved', '>=', startTimestamp)
                .where('date_approved', '<=', endTimestamp)
                .get();

            paymentSnapshot.forEach(doc => {
                const paymentData = doc.data();
                totalExpense += paymentData.amount || 0;
            });

            return totalExpense;
        };

        // Fetch expenses for current, last, and two months ago
        const thisMonthExpense = await fetchMonthlyExpenses(monthRanges.thisMonth.start, monthRanges.thisMonth.end);
        const lastMonthExpense = await fetchMonthlyExpenses(monthRanges.lastMonth.start, monthRanges.lastMonth.end);
        const twoMonthsAgoExpense = await fetchMonthlyExpenses(monthRanges.twoMonthsAgo.start, monthRanges.twoMonthsAgo.end);

        // Determine growth rate base
        let growthRate;
        if (thisMonthExpense > lastMonthExpense) {
            // Base on this month's expense if it's growing
            growthRate = ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;
        } else if (lastMonthExpense > 0 && twoMonthsAgoExpense > 0) {
            // Base on previous two months if this month's expense is declining
            growthRate = ((lastMonthExpense - twoMonthsAgoExpense) / twoMonthsAgoExpense) * 100;
        } else {
            // If no previous data, set N/A
            growthRate = "N/A";
        }

        // Ensure growth rate is a number before using
        growthRate = growthRate !== "N/A" ? Number(growthRate.toFixed(2)) : "N/A";

        // Predict expenses for the next 3 months using dynamic growth rate
        let predictedExpenses = [];
        let currentExpense = thisMonthExpense;

        for (let i = 1; i <= 3; i++) {
            if (growthRate !== "N/A") {
                currentExpense = currentExpense * (1 + growthRate / 100);
            }
            predictedExpenses.push(Math.round(currentExpense));
        }

        return res.status(200).json({
            months: [
                { name: "Two Months Ago", expense: twoMonthsAgoExpense },
                { name: "Last Month", expense: lastMonthExpense },
                { name: "This Month", expense: thisMonthExpense },
                { name: "Next Month", expense: predictedExpenses[0] },
                { name: "In Two Months", expense: predictedExpenses[1] },
                { name: "In Three Months", expense: predictedExpenses[2] }
            ],
            growth_rate: growthRate + "%"
        });
    } catch (error) {
        console.error("Error computing monthly expense forecast:", error);
        return res.status(500).json({ message: error.message });
    }
});


router.get('/expenses-list', async (req, res, next) => {
    try {
        const binRef = db.collection('smart_bin')
        const binSnapshot = await binRef.where('claim_type', 'in', ['cash', 'direct_to_bin']).get()
        const expenses = [];

        let years = new Set();
        binSnapshot.forEach(doc => {
            const binData = doc.data()

            const yearClaimed = binData.claiming_date.toDate().getFullYear();

            years.add(yearClaimed)


            let method = 'Manual Collection';
            if (binData.claim_type == 'direct_to_bin') {
                method = 'Vending Machine'
            }
            expenses.push({
                id: doc.id,
                type: 'RVM',
                method,
                name: null,
                points: binData.total_points,
                amount: binData.total_points,
                claiming_date: binData.claiming_date
            })
        })


        const paymentRef = db.collection('payment_request')
        const paymentSnapshot = await paymentRef.where('status', '==', 'approved').get()

        // const paymentTransaction = paymentSnapshot.forEach(async (doc) =>{
        //     const paymentData = doc.data()

        //     const userId = paymentData.userId

        //     const userRef = db.collection('users').doc(userId)
        //     const userSnapshot = await userRef.get();
        // })

        const paymentTransactions = await Promise.all(paymentSnapshot.docs.map(async (doc) => {
            const paymentData = doc.data()
            const userId = paymentData.userId;

            const userRef = db.collection('users').doc(userId)
            const userSnapshot = await userRef.get()
            const { firstname, lastname, middlename } = userSnapshot.data()

            const fullname = `${firstname}${middlename && ` ${middlename}`} ${lastname}`

            // let method = 'Online'

            // if (paymentData.type == 'cash') {
            //     method = 'Cash'
            // }
            const yearClaimed = paymentData.date_approved.toDate().getFullYear();

            years.add(yearClaimed)

            return {
                id: doc.id,
                type: 'Points Conversion Request',
                method:paymentData.type,
                name: fullname,
                points: paymentData.amount,
                amount: paymentData.amount,
                claiming_date: paymentData.date_approved
            }
        }))

        const availableYears = [...years].sort((a, b) => b - a)
        expenses.push(...paymentTransactions)

        const sortedExpenses = expenses.sort((a,b) => b.claiming_date - a.claiming_date)
        return res.status(200).json({ expenses: sortedExpenses, availableYears })

    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ error: error.message });
    }
})


module.exports = router;