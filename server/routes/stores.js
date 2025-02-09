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
        } else if (file.fieldname === "credentials_barangay") {
            folder = "barangay-permit";
        } else if (file.fieldname === "store_image") {
            folder = "store_front";
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
    { name: "credentials_barangay", maxCount: 1 },
    { name: "store_image", maxCount: 1 }
]);

const parsedMulter = multer().none();

router.post('/register-store', async (req, res) => {
    try {
        let storenameExist = true;

        const { store_name, province, city, barangay, street } = req.body;
        parsedMulter(req, res, (err) => {
            
            
        })

        if (storenameExist) {
            return res.status(400).json({ message: "Store name already exists. Please choose another name." });
        }
        upload(req, res, (err) => {
            if (err) {
                return res.status(500).json({ message: "File upload error", error: err.message });
            }

            console.log("Uploaded files:", req.files);
            console.log("Form Data2:", { store_name, province, city, barangay, street, user_id });

            return res.status(200).json({
                message: "Files and data uploaded successfully",
                data: { store_name, province, city, barangay, street },
                files: req.files
            });
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Error uploading files', error: error.message });
    }
});
module.exports = router;