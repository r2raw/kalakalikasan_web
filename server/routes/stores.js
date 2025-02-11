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
const { isEmptyData } = require("../util/validations.js");

const uploadDir = path.join(__dirname, "../public/store-cred/");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = "others"; // Default folder

        if (file.fieldname === "credentials_dti") {
            folder = "dti-permit";
        } else if (file.fieldname === "barangay_permit") {
            folder = "barangay-permit";
        } else if (file.fieldname === "store_image") {
            folder = "store_front";
        } else if (file.fieldname == "store_logo") {
            folder = "store_logo";
        }

        const uploadPath = path.join(uploadDir, folder);

        // Ensure folder exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});

// Configure Multer middleware
const upload = multer({ storage }).fields([
    { name: "credentials_dti", maxCount: 1 },
    { name: "barangay_permit", maxCount: 1 },
    { name: "store_image", maxCount: 1 },
    { name: "store_logo", maxCount: 1 }
]);


const storeExisting = async (store_name) => {

    const storesRef = db.collection('stores')
    const existingStore = await storesRef.where('store_name', '==', lowerCaseTrim(store_name)).get();

    if (!existingStore.empty) {
        return true;
    }

    return false;
}

const saveStore = async (data) => {
    const storesRef = db.collection('stores').doc();
    const saveData = await storesRef.set(data, { merge: true })
    return saveData;
}


router.post('/verify-store', async (req, res, next) => {
    try {
        const { store_name } = req.body;

        console.log('verifying')
        const storenameExist = await storeExisting(store_name);
        if (storenameExist) {
            return res.status(501).json({ message: "Store name already exists. Please choose another name." });
        }

        return res.status(200).json({ message: 'Valid store name' })

    } catch (error) {
        console.log(error.message)
        return res.status(501).json({ message: error.message });
    }
})
router.post('/register-store', upload, async (req, res) => {
    try {

        const {
            user_id,
            store_name,
            street,
            barangay,
            city,
            province,
            zip,
        } = req.body;
        // let storenameExist = false;
        console.log("Uploaded files:", req.files);

        let store_logo = null;

        if(req.files['store_logo']){
            store_logo = req.files['store_logo'][0].filename
        }

        const primaryData = {
            owner_id: user_id,
            store_name,
            street,
            barangay,
            city,
            province,
            zip,
            store_logo,
            barangay_permit: req.files['barangay_permit'][0].filename,
            dti_permit: req.files['credentials_dti'][0].filename,
            store_image: req.files['store_image'][0].filename,
            application_date: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending',
            approved_by: null,
            aprroval_date: null,
            rejected_by: null,
            date_rejection: null,
            rejection_reason: null,
        }
        const storesRef = db.collection('stores').doc();
        const saveData = await storesRef.set(primaryData, { merge: true })




        return res.status(200).json({
            message: "Files and data uploaded successfully"
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Error uploading files', error: error.message });
    }
});

// router.post('/register-store', async (req, res) => {
//     try {
//         console.log('Received request for /register-store');

//         // Ensure multer parses form data first
//         await new Promise((resolve, reject) => {
//             parsedMulter(req, res, (err) => {
//                 if (err) return reject(err);
//                 resolve();
//             });
//         });

//         const { store_name, province, city, barangay, street, zip, user_id } = req.body;

//         console.log('storename: ' + store_name)
//         // Check if store name already exists
//         const storenameExist = await storeExisting(store_name);
//         if (storenameExist) {
//             return res.status(400).json({ message: "Store name already exists. Please choose another name." });
//         }

//         // Prepare store data
//         const storeData = {
//             user_id,
//             store_name,
//             street,
//             barangay,
//             city,
//             province,
//             zip
//         };

//         // Handle file uploads
//         await new Promise((resolve, reject) => {
//             upload(req, res, (err) => {
//                 if (err) return reject(err);
//                 resolve();
//             });
//         });

//         // Extract file names
//         let store_logo = req.files['store_logo'] ? req.files['store_logo'][0].filename : null;
//         let barangay_permit = req.files['credentials_barangay'] ? req.files['credentials_barangay'][0].filename : null;
//         let dti_permit = req.files['credentials_dti'] ? req.files['credentials_dti'][0].filename : null;
//         let store_image = req.files['store_image'] ? req.files['store_image'][0].filename : null;

//         // Final data to save
//         const primaryData = {
//             owner_id: user_id,
//             store_name,
//             street,
//             barangay,
//             city,
//             province,
//             zip,
//             store_logo,
//             barangay_permit,
//             dti_permit,
//             store_image,
//             application_date: admin.firestore.FieldValue.serverTimestamp(),
//             status: 'pending',
//             approved_by: null,
//             aprroval_date: null,
//             rejected_by: null,
//             date_rejection: null,
//             rejection_reason: null,
//         };

//         // Save to Firestore
//         await saveStore(primaryData);

//         return res.status(200).json({
//             message: "Files and data uploaded successfully",
//         });

//     } catch (error) {
//         console.error("Error:", error.message);
//         return res.status(500).json({ message: "Error uploading files", error: error.message });
//     }
// });

module.exports = router;