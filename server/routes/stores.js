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


router.post('/register-store', async (req, res, next)=>{
    try {
        
    } catch (error) {
        res.status(501).json({message: 'error', error: error.message})
    }
})
module.exports = router;