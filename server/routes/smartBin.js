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


router.post('/smart-bin', async (req, res, next) => {
    const errors = [];
    const { transaction_id, claim_type, materials, total_points } = req.body;

    const { material_name, points_per_kg, total_kg } = materials[0]
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
            !material_name || material_name == '' ||
            !points_per_kg ||
            !total_kg
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
            'pet_bottle': {
                "coins_value": pet_coins_value,
                "points_value": pet_points_value
            }, "incan_bottlw": {

                "coins_value": can_coins_value,
                "points_value": can_points_value
            }
        }

        res.status(200).json(rates)
    } catch (error) {
        return res.status(501).json({ message: error.message })
    }
})


module.exports = router;