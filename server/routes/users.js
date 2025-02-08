const express = require("express");
const { db } = require('../data/firebase.js');
const router = express.Router();
const { uid } = require('uid')
const multer = require('multer');
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const _ = require('lodash');
const { lowerCaseTrim } = require("../util/myFunctions.js");
const qr = require('qr-image');
const { isConvertibleToInt } = require("../util/validations.js");

const uploadDir = path.join(__dirname, "../public/userImg/");
const userQrDir = path.join(__dirname,  "../public/userQr/");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(userQrDir)) {
    fs.mkdirSync(userQrDir, { recursive: true });
}



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/userImg");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

const saltRounds = 10;


router.post("/register", upload.single('image'), async (req, res, next) => {
    const id = uid(16)
    const errors = [];
    const { username, password, email, role, mobile_num, birthdate, zip, city, barangay, street, firstname, lastname, middlename, sex, created_by } = req.body;
    const user_address = { zip: _.trim(zip), city: lowerCaseTrim(city), barangay: lowerCaseTrim(barangay), street: lowerCaseTrim(street) };
    const fullname = { firstname: lowerCaseTrim(firstname), lastname: lowerCaseTrim(lastname), middlename: lowerCaseTrim(middlename) }
    // const image = req.file.filename;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const batch = db.batch();
    const today = Date.now();
    const convertedBirthdateString = new Date(birthdate)

    try {
        let image = null

        if (errors.length > 0) {
            return res.status(401).json({ errors: errors });
        }


        if (req.file) {
            image = req.file.filename
        }

        const usersRef = db.collection('users').doc(id)
        const userAddressRef = usersRef.collection("user_address").doc();
        const fullnameRef = usersRef.collection('fullname').doc();



        const primaryData = {
            username: lowerCaseTrim(username).replaceAll(' ', ''),
            password: hash,
            email: lowerCaseTrim(email),
            role,
            sex,
            mobile_num: lowerCaseTrim(mobile_num),
            image,
            ...fullname,
            ...user_address,
            birthdate: admin.firestore.Timestamp.fromDate(convertedBirthdateString),
            date_created: admin.firestore.FieldValue.serverTimestamp(),
            date_modified: null,
            created_by,
            modified_by: null,
            status: 'activated'
        }


        const saveData = await usersRef.set(primaryData, { merge: true })

        // batch.set(usersRef, primaryData, { merge: true });

        // const batchCommited = await batch.commit();


        res.status(200).send({ message: 'success' })
    } catch (error) {
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
});

router.post('/register-actor', async (req, res, next) => {
    const { username, password, email, role, mobileNum, birthdate, zip, city, barangay, street, firstname, lastname, middlename, sex } = req.body;

    const errors = [];
    const convertedBirthdateString = new Date(birthdate)
    try {


        const id = uid(16)
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        const usersRef = db.collection('users')
        const existingUsername = await usersRef.where('username', '==', lowerCaseTrim(username)).get();
        const existingEmail = await usersRef.where('email', '==', lowerCaseTrim(email)).get();
        const existingMobile = await usersRef.where('mobile_num', '==', lowerCaseTrim(mobileNum)).get();

        if (!existingUsername.empty) {
            errors.push('Username already exist!');
        }

        if (!existingEmail.empty) {
            errors.push('Email already exist!');
        }
        if (!existingMobile.empty) {
            errors.push('Mobile number already exist!');
        }

        if (errors.length > 0) {
            return res.status(501).json({ message: 'error', errors })
        }

        const usersRefDoc = db.collection('users').doc(id);

        const url = id;
        var qr_svg = qr.image(url);
        const qrFilePath = userQrDir + id + ".png";
        qr_svg.pipe(fs.createWriteStream(qrFilePath));
        const primaryData = {
            username: lowerCaseTrim(username).replaceAll(' ', ''),
            password: hash,
            email: lowerCaseTrim(email),
            role: 'actor',
            sex,
            mobile_num: lowerCaseTrim(mobileNum),
            image: null,
            firstname,
            lastname,
            middlename,
            zip,
            city,
            barangay,
            street,
            birthdate: admin.firestore.Timestamp.fromDate(convertedBirthdateString),
            date_created: admin.firestore.FieldValue.serverTimestamp(),
            first_time_log: true,
            status: 'activated'
        }
        
        const saveData = await usersRefDoc.set(primaryData, { merge: true })

        return res.status(200).json({ message: 'success' });

    } catch (error) {
        console.log(error.message);
        return res.status(501).json({ message: 'error' })
    }
})

router.post('/test', async (req, res, next) => {
    console.log(req.body)
    return res.status(200).json({ message: 'success' })
})
// login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    const errors = [];

    try {
        const userRef = db.collection('users').where('username', '==', username);
        const doc = await userRef.get();
        const responseArr = [];


        if (username == '' || password == '') {
            errors.push('All fields must not be empty')
            return res.status(400).json({ message: 'internal server error', errors: errors });
        }
        if (doc.empty) {
            errors.push('Incorrect username or password')
            return res.status(401).json({ message: 'internal server error', errors: errors });

        }



        doc.forEach(doc => {
            responseArr.push({ id: doc.id, data: doc.data() })
        });

        const dbPass = responseArr[0].data.password

        const match = await bcrypt.compare(password, dbPass);

        if (!match) {
            errors.push('Incorrect username or password')
        }

        if (errors.length > 0) {
            return res.status(401).json({ message: 'Imvalid login', errors: errors })
        }
        return res.status(200).json({ message: 'success', id: responseArr[0].id });
    } catch (error) {
        errors.push('Internal server error')
        console.log(error.message)
        return res.status(501).json({ message: error.message, errors: errors })
    }
})


router.post('/login-mobile', async (req, res, next) => {
    const { userCred, password } = req.body;
    const errors = [];

    try {
        let enteredCred = 'email';

        if(isConvertibleToInt(userCred)){
            enteredCred = 'mobile_num'
        }
        console.log(enteredCred)
        const userRef = db.collection('users').where(enteredCred, '==', userCred).where('role', '!=', 'admin');
        const doc = await userRef.get();
        const responseArr = [];

        if (doc.empty) {
            return res.status(401).json({ message: 'internal server error', error: 'Incorrect username or password' });

        }



        doc.forEach(doc => {
            responseArr.push({ id: doc.id, data: doc.data() })
        });

        const dbPass = responseArr[0].data.password

        const match = await bcrypt.compare(password, dbPass);

        if (!match) {
            return res.status(401).json({ message: 'Imvalid login', error: 'Incorrect password' })
        }
        return res.status(200).json({ message: 'success', userData: responseArr[0] });
    } catch (error) {
        console.log(error)
        return res.status(501).json({ message: error.message, error: 'Something went wrong!' })
    }
})


// GET REQUEST

router.get('/activeUsers', async (req, res, next) => {
    console.log('asdasd')
    const errors = [];
    try {

        const users = []
        const usersRef = db.collection('users')

        const usersDoc = await usersRef.where('role', '!=', 'admin')
            .where('status', '==', 'activated')
            .select('mobile_num', 'email', 'image', 'firstname', 'lastname', 'middlename', 'date_created')
            .orderBy('date_created', 'desc')
            .get();



        if (usersDoc.empty) {
            return res.status(200).json({ message: 'No users found', users: users });
        }

        usersDoc.forEach(doc => users.push({ id: doc.id, ...doc.data() }))

        // for (const doc of usersDoc.docs) {
        //     const userData = { id: doc.id, ...doc.data() };
        //     const fullNameRef = usersRef.doc(doc.id).collection('fullname');
        //     const fullnameDoc = await fullNameRef.get();

        //     if (!fullnameDoc.empty) {
        //         fullnameDoc.forEach(fullname => {
        //             {userData.fullname = fullname.data()}; // Assuming there's only one document in the subcollection
        //         });
        //     }

        //     users.push(userData);
        // }


        return res.status(200).json({ message: 'success', users: users })
    } catch (error) {
        console.log(error.message
        )
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})

router.get('/inactiveUsers', async (req, res, next) => {
    const errors = [];
    try {

        const users = []
        const usersRef = db.collection('users')

        const usersDoc = await usersRef.where('role', '!=', 'admin')
            .where('status', '==', 'deactivated')
            .select('mobile_num', 'email', 'image', 'firstname', 'lastname', 'middlename')
            .get();



        if (usersDoc.empty) {
            return res.status(200).json({ message: 'No users found', users: users });
        }


        usersDoc.forEach(doc => users.push({ id: doc.id, ...doc.data() }))

        // for (const doc of usersDoc.docs) {
        //     const userData = { id: doc.id, ...doc.data() };
        //     const fullNameRef = usersRef.doc(doc.id).collection('fullname');
        //     const fullnameDoc = await fullNameRef.get();

        //     if (!fullnameDoc.empty) {
        //         fullnameDoc.forEach(fullname => {
        //             {userData.fullname = fullname.data()}; 
        //         });
        //     } 

        //     users.push(userData);
        // }

        return res.status(200).json({ message: 'success', users: users })
    } catch (error) {
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})
// get user data
router.get('/user/:id', async (req, res, next) => {
    const { id } = req.params;
    const errors = [];
    let responseObj = {};
    try {
        const userRef = db.collection('users').doc(id);

        const userDoc = await userRef.get();


        if (!userDoc.exists) {
            errors.push(`A user with an id of ${id} does not exist`)
            return res.status(401).json({ message: 'Unauthorized', errors: errors });

        }

        responseObj = {
            ...userDoc.data()
        }



        // console.log(responseArr)
        return res.status(200).json({ message: 'success', user: responseObj })
    } catch (error) {

        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})



// patch request

router.patch('/deactivate-user', async (req, res, next) => {

    const { id } = req.body;
    const errors = []
    console.log(id)
    try {

        const userRef = db.collection('users')

        const userDoc = userRef.doc(id)


        const response = await userDoc.set({
            status: 'deactivated'
        }, { merge: true })

        res.status(200).send({ message: 'success' })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})

router.patch('/activate-user', async (req, res, next) => {

    const { id } = req.body;
    const errors = []
    try {

        const userRef = db.collection('users')

        const userDoc = userRef.doc(id)


        const response = await userDoc.set({
            status: 'activated'
        }, { merge: true })

        res.status(200).send({ message: 'success' })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})


// PUT REQUEST

router.patch("/edit-user", upload.single('image'), async (req, res, next) => {
    const errors = [];
    const { username, email, mobile_num, birthdate, street, firstname, lastname, middlename, sex, id, modified_by } = req.body;
    const user_address = { street: lowerCaseTrim(street) };
    const fullname = { firstname: lowerCaseTrim(firstname), lastname: lowerCaseTrim(lastname), middlename: lowerCaseTrim(middlename) }
    // const image = req.file.filename;
    const batch = db.batch();
    const convertedBirthdateString = new Date(birthdate)

    try {
        let image = null

        if (errors.length > 0) {
            return res.status(401).json({ errors: errors });
        }


        if (req.file) {
            image = req.file.filename
        }

        const usersRef = db.collection('users').doc(id)


        let primaryData = {
            username: lowerCaseTrim(username).replaceAll(' ', ''),
            email: lowerCaseTrim(email),
            sex,
            ...fullname,
            ...user_address,
            mobile_num: lowerCaseTrim(mobile_num),
            birthdate: admin.firestore.Timestamp.fromDate(convertedBirthdateString),
            date_modified: admin.firestore.FieldValue.serverTimestamp(),
            modified_by,

        }
        if (image != null) {
            primaryData = { ...primaryData, image }
        }


        const updateRes = await usersRef.set(primaryData, { merge: true })


        // batch.set(usersRef, primaryData, { merge: true });
        // batch.set(userAddressRef, user_address, { merge: true });
        // batch.set(fullnameRef, fullname, { merge: true });

        // const batchCommited = await batch.commit();


        res.status(200).send({ message: 'success' })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
});


module.exports = router;