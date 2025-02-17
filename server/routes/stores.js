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
const { ADDRGETNETWORKPARAMS } = require("dns");

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

        if (req.files['store_logo']) {
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
            approval_date: null,
            rejected_by: null,
            date_rejection: null,
            rejection_reason: null,
        }
        const storesRef = db.collection('stores').doc();
        const saveData = await storesRef.set(primaryData, { merge: true })



        return res.status(200).json({
            message: "Files and data uploaded successfully",
            store: primaryData,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Error uploading files', error: error.message });
    }
});


router.get('/approved-stores', async (req, res, next) => {
    try {
        const stores = [];

        const storeRef = db.collection('stores');

        const storesDoc = await storeRef.where('status', '==', 'approved').orderBy('store_name', 'asc').get();

        if (storesDoc.empty) {
            return res.status(200).json({ message: 'No stores found', stores: stores });
        }

        storesDoc.forEach(doc => stores.push({ id: doc.id, ...doc.data() }));
        return res.status(200).json({ message: 'success', stores: stores });

    } catch (error) {

        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error', error: [error.message] });
    }

})

router.get('/fetch-user-store/:id', async (req,res, next)=>{
    try {
        const {userId} = req.params;
        const storeRef = db.collection('stores').where('owner_id', '==', userId);

        const storeDoc = await storeRef.get();
        let storeObj = {}; // Use 'let' instead of 'const'


        if(storeDoc.empty){
            return res.status(200).json({message: 'No store'})
        }
        if (!storeDoc.empty) {
            storeObj = storeDoc.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        }

        return res.status(200).json({message: 'success', storeData: storeObj})
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
})



router.get('/application-request', async (req, res, next) => {
    try {
        const stores = [];

        const storeRef = db.collection('stores');

        const storesDoc = await storeRef.where('status', '==', 'pending').orderBy('application_date', 'desc').get();

        if (storesDoc.empty) {
            return res.status(200).json({ message: 'No stores found', stores: stores });
        }

        storesDoc.forEach(doc => stores.push({ id: doc.id, ...doc.data() }));
        return res.status(200).json({ message: 'success', stores: stores });

    } catch (error) {

        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error', error: [error.message] });
    }

})


router.get('/store-info/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const errors = [];
        let responseObj = {};

        const storeRef = db.collection('stores').doc(id);

        const storeDoc = await storeRef.get();


        if (!storeDoc.exists) {
            errors.push(`A store with an id of ${id} does not exist`)
            return res.status(401).json({ message: 'Unauthorized', errors: errors });

        }

        const userRef = db.collection('users').doc(storeDoc.data().owner_id);

        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            errors.push(`A user with an id of ${id} does not exist`)
            return res.status(401).json({ message: 'Unauthorized', errors: errors });

        }

        const { firstname, lastname, middlename } = userDoc.data();

        responseObj = {
            ...storeDoc.data(),
            firstname,
            lastname,
            middlename
        }

        return res.status(200).json({ message: 'success', store: responseObj })

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error', error: [error.message] });
    }
})



router.patch('/approve-store', async (req, res, next) => {

    const { store_id, owner_id, approved_by, } = req.body;
    const errors = []
    try {

        const storeRef = db.collection('stores')
        const userRef = db.collection('users')
        const userDoc = userRef.doc(owner_id)
        const storeDoc = storeRef.doc(store_id)

        await userDoc.set({
            role: 'partner'
        }, { merge: true })

        const response = await storeDoc.set({
            status: 'approved',
            approval_date: admin.firestore.FieldValue.serverTimestamp(),
            approved_by,
        }, { merge: true })


        res.status(200).send({ message: 'success' })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})


router.post('/check-product-existing', async (req, res, next)=>{
    
})

router.post('/add-product', async (req, res, next)=>{
    
})

module.exports = router;