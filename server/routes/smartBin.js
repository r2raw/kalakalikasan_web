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

        const {points} = residentSnapshot.data()

        const updatedPoints = points + total_points

        const residentNotifRef = db.collection('notifications').doc()

        const smartBinRef = db.collection('smart_bin').doc(trans_id);

        console.log(updatedPoints)
        batch.set(smartBinRef, binData, { merge: true });
        batch.set(residentTransactionRef, residentTransactionData, { merge: true })
        batch.set(officerTransactionRef, officerTransactionData, {merge: true})
        batch.set(residentNotifRef, residentNotif, {merge: true});
        batch.set(residentRef, {points: updatedPoints}, {merge: true})

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
        const userRef = db.collection('users').where('username', '==', lowerCaseTrim(username));
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

        console.log({ userId: userSnapshot.id, ...userSnapshot.data() })

        return res.status(200).json({ userId: userSnapshot.id, ...userSnapshot.data() })

    } catch (error) {
        console.error(error.message)

        return res.status(501).json({ message: 'error', error: error.message });
    }
})

module.exports = router;