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
            transaction_id,
            claim_type,
            total_points,
            claiming_status,
            transaction_date: admin.firestore.FieldValue.serverTimestamp(),
            claiming_date: claim_type == 'direct_to_bin' ? admin.firestore.FieldValue.serverTimestamp() : null,
            claimed_by: null,
            transaction_officer: null,
        }

        const smartBinRef = db.collection('smart_bin').doc(transaction_id);

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

        res.status(200).json(rates)
    } catch (error) {
        return res.status(501).json({ message: error.message })
    }
})


router.get('/get-receipt/:id', async (req, res, next) => {

    const { id } = req.params;
    const errors = [];
    const materials = [];
    let responseObj = {};
    try {
        const smartBinRef = db.collection('smart_bin').doc(id);
        const materialRef = smartBinRef.collection('materials');
        const smartBinDoc = await smartBinRef.get();
        const materialDoc = await materialRef.get();

        if (!smartBinDoc.exists) {
            errors.push(`Transaction id ${id} does not exist`)
            return res.status(401).json({ message: 'Not found', errors: errors });

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
        return res.status(501).json({ message: error.message })
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

        if(userRefDoc.data().points !== undefined){
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
            claiming_status: 'claimed',
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

module.exports = router;