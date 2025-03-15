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
const twilio = require('twilio');
const { Vonage } = require('@vonage/server-sdk');
const { error, info } = require("console");
var nodemailer = require('nodemailer');


const isProduction = process.env.NODE_ENV === "production";


// const uploadDir = path.join(__dirname, "../public/userImg/");
// const userQrDir = path.join(__dirname, "../public/userQr/");

const uploadDir = isProduction
    ? "/server/public/userImg"  // Persistent disk on Render
    : path.join(__dirname, "../public/userImg"); // Local storage for testing

const userQrDir = isProduction
    ? "/server/public/userQr"
    : path.join(__dirname, "../public/userQr");


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(userQrDir)) {
    fs.mkdirSync(userQrDir, { recursive: true });
}



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

const saltRounds = 10;

router.post('/change-image', upload.single('image'), async (req, res, next) => {
    try {
        const { id } = req.body;
        const userRef = db.collection('users').doc(id)
        const userSnapshot = await userRef.get()

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found!' })
        }

        const image = req.file.filename


        const saveData = await userRef.set({ image }, { merge: true })


        return res.status(200).json({ message: 'success' })
    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})

router.post('/get-email', async (req, res, next) => {
    try {

        const {email, otpCode} = req.body;

        const userRef = db.collection('users').where('email', '==', email).where('status', '==', 'activated')
        const userSnapshot = await userRef.get()

        if(userSnapshot.empty){
            return res.status(404).json({error: 'Email does not exist'})
        }

        let userObj = {}

        userSnapshot.forEach(user => userObj = {id: user.id, ...user.data()})

        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kalakalikasan.mail@gmail.com',
                pass: process.env.MAIL_APP_PASS
            }
        });

        var mailOptions = {
            from: 'kalakalikasan.mail@gmail.com',
            to: email,
            subject: '[KalaKalikasan] Password Reset OTP Code',
            text: `Hello,

        We received a request to reset your password for your KalaKalikasan account. Use the OTP code below to reset your password:

        Your OTP Code: ${otpCode}

        Do not share this code with anyone.

        If you did not request a password reset, please ignore this email. Your account remains secure.

        Best regards, 
        The KalaKalikasan Team`
        };

        

        const sendEmail = await transporter.sendMail(mailOptions);
        return res.status(200).json(userObj)
    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})

router.post("/register", upload.single('image'), async (req, res, next) => {
    const id = uid(16)
    const errors = [];
    const verificationId = uid(20)

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

        if (req.file) {
            image = req.file.filename
        }

        const usersRef = db.collection('users').doc()
        const userAddressRef = usersRef.collection("user_address").doc();
        const fullnameRef = usersRef.collection('fullname').doc();

        const verificationRef = db.collection('email_verification').doc(verificationId)
        const existingUsername = await db.collection('users').where('username', '==', lowerCaseTrim(username).replaceAll(' ', '')).get();
        const existingEmail = await db.collection('users').where('email', '==', lowerCaseTrim(email)).get();
        const existingMobile = await db.collection('users').where('mobile_num', '==', lowerCaseTrim(mobile_num)).get();

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
            return res.status(401).json({ errors: errors });
        }


        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kalakalikasan.mail@gmail.com',
                pass: process.env.MAIL_APP_PASS
            }
        });

        var mailOptions = {
            from: 'kalakalikasan.mail@gmail.com',
            to: email,
            subject: '[KalaKalikasan] Activate Your Account',
            text: `Hello,

        Please activate your officer account by clicking the link below:

        ${process.env.SITE_URL}/verify/${verificationId}

        Best regards, 
        The KalaKalikasan Team`
        };


        const primaryData = {
            username: lowerCaseTrim(username).replaceAll(' ', ''),
            // username: username,
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
            status: 'deactivated',
            first_time_log: true,
        }
        const verificationData = {
            isUsed: false,
            userId: id,
        }



        const sendEmail = await transporter.sendMail(mailOptions);
        const saveVerification = await verificationRef.set(verificationData, { merge: true })
        const saveData = await usersRef.set(primaryData, { merge: true })

        // batch.set(usersRef, primaryData, { merge: true });

        // const batchCommited = await batch.commit();


        res.status(200).send({ message: 'success' })
    } catch (error) {
        console.error(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
});

router.post('/regen-qr', async (req, res, next) => {
    try {
        const { id } = req.body


        const url = id;
        var qr_svg = qr.image(url);
        const qrFilePath = path.join(userQrDir, id + ".png");
        qr_svg.pipe(fs.createWriteStream(qrFilePath));

        return res.status(200).json('success')
    } catch (error) {

    }
})

router.post('/register-actor', async (req, res, next) => {
    const { username, password, email, role, mobileNum, birthdate, zip, city, barangay, street, firstname, lastname, middlename, sex } = req.body;

    const errors = [];
    const convertedBirthdateString = new Date(birthdate)
    try {


        const id = uid(16)
        const verificationId = uid(20)
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        const usersRef = db.collection('users')
        const verificationRef = db.collection('email_verification').doc(verificationId)
        const existingUsername = await usersRef.where('username', '==', lowerCaseTrim(username).replaceAll(' ', '')).get();
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
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kalakalikasan.mail@gmail.com',
                pass: process.env.MAIL_APP_PASS
            }
        });

        var mailOptions = {
            from: 'kalakalikasan.mail@gmail.com',
            to: email,
            subject: '[KalaKalikasan] Activate Your Account',
            text: `Hello,

        Thank you for signing up with KalaKalikasan! To complete your registration, please activate your account by clicking the link below:

        ${process.env.SITE_URL}/verify/${verificationId}

        If you did not sign up for this account, you can safely ignore this email.

        Best regards, 
        The KalaKalikasan Team`
        };

        const url = id;
        var qr_svg = qr.image(url);
        const qrFilePath = path.join(userQrDir, id + ".png");
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
            status: 'deactivated',
            points: 0,
        }


        const verificationData = {
            isUsed: false,
            userId: id,
        }
        const sendEmail = await transporter.sendMail(mailOptions);
        const saveVerification = await verificationRef.set(verificationData, { merge: true })
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
        const userRef = db.collection('users').where('username', '==', username).where('role', '==', 'admin').where('status', '==', 'activated');
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
            return res.status(401).json({ message: 'Invalid login', errors: errors })
        }
        return res.status(200).json({ message: 'success', id: responseArr[0].id });
    } catch (error) {
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})

router.post('/confirm-password', async (req, res, next) => {
    try {
        const { id, password } = req.body;

        const userRef = db.collection('users').doc(id)
        const userSnapshot = await userRef.get()

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found' })
        }

        const dbPass = userSnapshot.data().password
        const match = await bcrypt.compare(password, dbPass);

        if (!match) {
            return res.status(409).json({ error: 'Invalid password' })
        }

        return res.status(200).json(true);
    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})

router.post('/change-password', async (req, res, next) => {
    try {
        const { id, password } = req.body;
        const userRef = db.collection('users').doc(id)
        const userSnapshot = await userRef.get()

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found' })
        }
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        const saveData = await userRef.set({
            password: hash,
            date_modified: admin.firestore.FieldValue.serverTimestamp(),
            modified_by: id,
        }, { merge: true })



        return res.status(200).json(true);
    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})


router.post('/first-time-log', async (req, res, next) => {
    try {
        const { id, password } = req.body;
        const userRef = db.collection('users').doc(id)
        const userSnapshot = await userRef.get()

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found' })
        }
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        const saveData = await userRef.set({
            password: hash,
            first_time_log: false,
            date_modified: admin.firestore.FieldValue.serverTimestamp(),
            modified_by: id,
        }, { merge: true })



        return res.status(200).json(true);
    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})



router.post('/login-mobile', async (req, res, next) => {
    const { userCred, password } = req.body;
    const errors = [];
    try {
        let enteredCred = 'email';

        if (isConvertibleToInt(userCred)) {
            enteredCred = 'mobile_num'
        }
        const userRef = db.collection('users').where(enteredCred, '==', userCred).where('role', '!=', 'admin').where('status', '==', 'activated');
        const doc = await userRef.get();
        const responseArr = [];

        if (doc.empty) {
            return res.status(401).json({ message: 'internal server error', error: 'Invalid credentials' });

        }



        doc.forEach(doc => {
            responseArr.push({ id: doc.id, data: doc.data() })
        });

        const dbPass = responseArr[0].data.password

        const match = await bcrypt.compare(password, dbPass);

        if (!match) {
            return res.status(401).json({ message: 'Invalid login', error: 'Invalid credentials' })
        }



        const resData = { message: 'success', userData: responseArr[0] };
        if (responseArr[0].data.role !== 'officer') {
            const storeRef = db.collection('stores').where('owner_id', '==', responseArr[0].id).where('status', '!=', 'deactivated');

            const storeDoc = await storeRef.get();
            let storeObj = {}; // Use 'let' instead of 'const'

            if (!storeDoc.empty) {
                storeObj = storeDoc.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));


                resData.store = storeObj;
            }

        }

        console.log(resData)


        return res.status(200).json(resData);
    } catch (error) {
        console.log(error)
        return res.status(501).json({ message: error.message, error: 'Something went wrong!' })
    }
})


// GET REQUEST

router.get('/activeUsers', async (req, res, next) => {
    const errors = [];
    try {

        const users = []
        const usersRef = db.collection('users')

        const usersDoc = await usersRef.where('role', '!=', 'admin')
            .where('status', '==', 'activated')
            .select('mobile_num', 'email', 'image', 'firstname', 'lastname', 'middlename', 'date_created', 'role')
            .orderBy('date_created', 'desc')
            .get();



        if (usersDoc.empty) {
            return res.status(200).json({ message: 'No users found', users: users });
        }

        usersDoc.forEach(doc => users.push({ id: doc.id, ...doc.data() }))


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
            .select('mobile_num', 'email', 'image', 'firstname', 'lastname', 'middlename', 'role')
            .get();



        if (usersDoc.empty) {
            return res.status(200).json({ message: 'No users found', users: users });
        }


        usersDoc.forEach(doc => users.push({ id: doc.id, ...doc.data() }))

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



        console.log(responseObj)
        return res.status(200).json({ message: 'success', user: responseObj })
    } catch (error) {

        console.error(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})

router.get('/notifications/:id', async (req, res, next) => {
    const { id } = req.params;
    const errors = [];
    const notifs = [];
    const notifObj = {
        unread: [],
        read: []
    }
    try {
        console.log(id)
        const notificationRef = db.collection('notifications');

        const directNotifDoc = await notificationRef.where('userId', '==', id).get()
        const globalNotifDoc = await notificationRef.where('send_type', '==', 'global').get()

        if (!directNotifDoc.empty) {
            directNotifDoc.forEach(notifItem => notifs.push({ id: notifItem.id, ...notifItem.data() }))
        }

        if (!globalNotifDoc.empty) {

            globalNotifDoc.forEach(notifItem => notifs.push({ id: notifItem.id, ...notifItem.data() }))
        }


        notifs.sort((a, b) => b.notif_date._seconds - a.notif_date._seconds);
        notifs.forEach(notif => {

            // const notifReadRed = notificationRef.collection('notifRead').doc(id)
            if (notif.readBy && notif.readBy.includes(id)) {
                notifObj.read.push(notif);
            } else {
                notifObj.unread.push(notif);
            }
        });

        console.log(notifObj)
        return res.status(200).json({ notifObj })

    } catch (error) {
        console.error(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})


router.get('/user-points/:id', async (req, res, next) => {
    const { id } = req.params;
    const errors = [];
    let responseObj = {};
    try {
        const userRef = db.collection('users').doc(id);

        const userDoc = await userRef.get();

        const points = userDoc.data().points || 0;

        return res.status(200).json({ message: 'success', points })
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


router.get('/total-collected/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const transactionRef = db.collection('smart_bin').where('claimed_by', '==', id)
        const transactionDoc = await transactionRef.get()
        let totalGrams = 0;
        if (transactionDoc.empty) {

            return res.status(200).json({ totalGrams })
        }
        console.log('transaction not empty')
        const smart_bin = [];

        transactionDoc.forEach(item => smart_bin.push({ transactionId: item.id, ...item.data() }))


        await Promise.all(smart_bin.map(async (bin) => {
            const binRef = db.collection('smart_bin').doc(bin.transactionId);
            const materialRef = binRef.collection('materials')
            const materialsSnapshot = await materialRef.get()

            const materials = []

            if (materialsSnapshot.empty) {
                return res.status(200).json({ totalGrams })
            }
            console.log('material not empty')

            materialsSnapshot.forEach(item => {
                totalGrams += item.data().total_grams
                materials.push({ id: item.id, ...item.data() })
            })

        }))
        return res.status(200).json({ totalGrams })

    } catch (error) {
        console.log(error.message);
        return res.status(200).json({ error: error.message })
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



        if (req.file) {
            image = req.file.filename
        }

        const usersRef = db.collection('users').doc(id)
        const userSnapshot = await usersRef.get()

        if (!userSnapshot.exists) {

            return res.status(404).json({ errors: ['User not found'] })
        }

        const sanitizedUsername = lowerCaseTrim(username).replaceAll(' ', '');
        const sanitizedEmail = lowerCaseTrim(email);
        const sanitizedMobile = lowerCaseTrim(mobile_num);

        const existingUsernameSnapshot = await db.collection('users')
            .where('username', '==', sanitizedUsername)
            .get();

        const usernameExists = existingUsernameSnapshot.docs.some(doc => doc.id !== id);

        if (usernameExists) {
            errors.push('Username already exists!');
        }

        const existingEmailSnapshot = await db.collection('users')
            .where('email', '==', sanitizedEmail)
            .get();

        const emailExists = existingEmailSnapshot.docs.some(doc => doc.id !== id);

        if (emailExists) {
            errors.push('Email already exists!');
        }

        const existingMobileSnapshot = await db.collection('users')
            .where('mobile_num', '==', sanitizedMobile)
            .get();

        const mobileExists = existingMobileSnapshot.docs.some(doc => doc.id !== id);

        if (mobileExists) {
            errors.push('Mobile number already exists!');
        }
        if (errors.length > 0) {
            return res.status(401).json({ errors: errors });
        }

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


const accountSid = process.env.TWILIOSID;
const authToken = process.env.TWILIOAUTHTOKEN;

const client = twilio(accountSid, authToken)

router.post('/send-sms', async (req, res, next) => {
    try {
        const { send_to, msg } = req.body;
        const to = `+63${send_to.substring(1, 11)}`


        const smsRes = await client.messages.create({
            body: msg,
            to,
            from: process.env.TWILIONUM

        })

        console.log(smsRes)
        if (!smsRes) {
            return res.status(501).json({ error: 'Failed to send otp' })
        }
        if (smsRes) {
            return res.status(200).json({ message: 'message sent successfully' })
        }

    } catch (error) {
        console.error(error.message)
        return res.status(501).json({ message: error.message })
    }
})
router.patch('/view-notif', async (req, res) => {
    try {
        const { notifId, userId } = req.body;

        console.log(notifId)
        const notifRef = db.collection('notifications').doc(notifId);
        const notifSnapshot = await notifRef.get();

        if (!notifSnapshot.exists) {
            return res.status(404).json({ message: 'error', error: `Notification ID ${notifId} not found.` });
        }

        // Update the readBy array using arrayUnion to prevent duplicates
        await notifRef.update({
            readBy: admin.firestore.FieldValue.arrayUnion(userId)
        });

        return res.status(200).json({ message: 'success', notifId, userId });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'error', error: error.message });
    }
});



router.post('/request-payment', async (req, res, next) => {
    const batch = db.batch();
    try {
        const id = uid(16)
        const { store_id, amount, userId, type } = req.body;
        const userRef = db.collection('users').doc(userId)
        const userSnapshot = await userRef.get()
        const storeRef = db.collection('stores').doc(store_id)
        const storeSnapshot = await storeRef.get()
        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'User not found!' })
        }

        if (!storeSnapshot.exists) {
            return res.status(404).json({ error: 'Store not found' })
        }





        const transactionRef = userRef.collection('transactions').doc()

        //UPDATE POINTS
        const { points } = userSnapshot.data()

        if (amount > points) {
            return res.status(409).json({ error: 'Insufficient points' })
        }

        const currentPoints = points - amount;

        batch.set(userRef, { points: currentPoints }, { merge: true })

        // TRANSACTION REF
        const paymentData = {
            transactionId: id,
            type: "withdraw",
            transactionDate: admin.firestore.FieldValue.serverTimestamp(),
        };

        batch.set(transactionRef, paymentData, { merge: true })

        // PAYMENT REQ
        const requestPaymentRef = db.collection('payment_request').doc(id)

        const requestPaymentData = {
            store_id,
            amount,
            type,
            userId,
            status: 'pending',
            date_requested: admin.firestore.FieldValue.serverTimestamp(),
            acceptance_image: null,
            approved_by: null,
            rejected_date: null,
            rejected_reason: null,
            date_approved: null,
        }

        batch.set(requestPaymentRef, requestPaymentData, { merge: true })


        await batch.commit()

        return res.status(200).json({ message: 'success' })
    } catch (error) {
        console.error(error.message)
        return res.status(501).json({ error: error.message })
    }
})


router.get('/new-users', async (req, res, next) => {
    try {
        const userRef = db.collection('users')
            .where('role', 'in', ['actor', 'partner'])
            .orderBy('date_created', 'desc')
            .limit(5);
        const snapshot = await userRef.get();

        if (snapshot.empty) {
            return [];
        }

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})

router.get('/new-stores', async (req, res, next) => {
    try {
        const storeRef = db.collection('stores')
            .where('status', '==', 'approved')
            .orderBy('approval_date', 'desc')
            .limit(5);
        const snapshot = await storeRef.get();

        if (snapshot.empty) {
            return res.status(200).json({ stores: [] });
        }

        const stores = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return res.status(200).json({ stores });
    } catch (error) {
        console.error(error.message)
        return res.status(501).json({ message: error.message })
    }
})

router.get('/total-users', async (req, res, next) => {
    try {
        // Fetch user counts by role in parallel
        const [actorSnap, partnerSnap, officerSnap] = await Promise.all([
            db.collection('users').where('role', '==', 'actor').where('status', '==', 'activated').get(),
            db.collection('users').where('role', '==', 'partner').where('status', '==', 'activated').get(),
            db.collection('users').where('role', '==', 'officer').where('status', '==', 'activated').get()
        ]);

        // Get document counts for each role
        const totalUsers = {
            actors: actorSnap.size,
            partners: partnerSnap.size,
            officers: officerSnap.size
        };

        return res.status(200).json(totalUsers);
    } catch (error) {
        console.error("Error fetching user counts:", error);
        return res.status(500).json({ error: error.message });
    }
});



// router.post('/feedback', async (req, res, next) => {
//     try {
//         const { message, email, name } = req.body;

//         const feedbackRef = db.collection('feedbacks').doc()
//         await feedbackRef.set({ message, email, name: lowerCaseTrim(name), date_submitted: admin.firestore.FieldValue.serverTimestamp(), }, { merge: true })
//         return res.status(200).json({ message: 'success' })
//     } catch (error) {

//         console.error(error.message)
//         return res.status(500).json({ error: error.message });
//     }
// })

router.get('/feedback', async (req, res, next) => {
    try {

        const feedbackRef = db.collection('feedbacks').orderBy('date_submitted', 'desc')
        const feedBackSnapshot = await feedbackRef.get();

        const feedbacks = [];

        if (feedBackSnapshot.empty) {
            return res.status(200).json({ message: 'success', feedbacks })
        }

        feedBackSnapshot.forEach((feedback) => feedbacks.push({ id: feedback.id, ...feedback.data() }))

        return res.status(200).json({ message: 'success', feedbacks })
    } catch (error) {

        console.error(error.message)
        return res.status(500).json({ error: error.message });
    }
})


router.get('/pending-payments', async (req, res, next) => {
    try {
        const paymentRef = db.collection('payment_request')
            .where('status', '==', 'pending')
            .orderBy('date_requested', 'desc');
        const paymentSnapshot = await paymentRef.get();

        const paymentPromises = [];

        if (paymentSnapshot.empty) {
            return res.status(200).json({ paymentPromises });
        }


        paymentSnapshot.forEach((payment) => {
            const paymentData = payment.data();
            const { store_id } = paymentData;
            const storeRef = db.collection('stores').doc(store_id);

            paymentPromises.push(
                storeRef.get().then((storeSnapshot) => {
                    if (!storeSnapshot.exists) {
                        return { error: `Store with an id of ${store_id} does not exist` };
                    }

                    const { store_name } = storeSnapshot.data();
                    return { id: payment.id, ...paymentData, store_name };
                })
            );
        });

        const resolvedPayments = await Promise.all(paymentPromises);

        // Filter out any errors
        const validPayments = resolvedPayments.filter(payment => !payment.error);

        return res.status(200).json({ payments: validPayments });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
});

router.get('/user-info/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const userRef = db.collection('users').doc()
        const userSnapshot = await userRef.get()

        if (!userSnapshot.exists) {
            return res.status(404).json({ error: 'Cannot find user with an id of ' + id })
        }

        const userInfo = {
            id: userSnapshot.id,
            ...userSnapshot.data()
        }

        return res.status(200).json({ userInfo })
    } catch (error) {
        console.error(error.message);
        return res.status(501).json({ error: error.message });

    }
})


router.patch('/update-user', async (req, res, next) => {
    try {
        console.log(req.body)
    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})


router.get('/transactions/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const userRef = db.collection('users').doc(id)
        const userSnapshot = await userRef.get()

        if (!userSnapshot.exists) {
            return res.status(404).json('User id not found')
        }

        const transactionsList = []

        const binRef = db.collection('smart_bin')
        const binSnapshot = await binRef.where('claimed_by', '==', id).get()

        binSnapshot.forEach(bin => {
            const binData = bin.data()
            const transactionData = {
                id: bin.id,
                date: binData.claiming_date,
                info: 'Scanned receipt',
                value: binData.total_points,
                status: binData.claiming_status,
            }
            transactionsList.push(transactionData)
        },)


        // order transaction

        const orderRef = db.collection('orders')
        const orderSnapshot = await orderRef.where('ordered_by', '==', id).get()

        const orderTransactions = await Promise.all(orderSnapshot.docs.map(async (order) => {
            const orderData = order.data();
            let price = 0;

            const productsOrderedRef = order.ref.collection('products_ordered');
            const productsOrderedSnapshot = await productsOrderedRef.get();

            productsOrderedSnapshot.forEach((product) => {
                const productData = product.data();
                price += productData.quantity * productData.price;
            });

            return {
                id: order.id,
                value: price,
                info: 'Product request',
                date: orderData.order_date,
                status: orderData.status,
            };
        }));
        transactionsList.push(...orderTransactions);

        // STORE TRANSACTION
        const storeRef = db.collection('stores').where('owner_id', '==', id)
        const storeSnapshot = await storeRef.get()
        const storeTransactions = await Promise.all(storeSnapshot.docs.map(async (store) => {
            const orderRef = db.collection('orders').where('store_id', '==', store.id).where('status', '==', 'accepted')
            const orderSnapshot = await orderRef.get()
            return Promise.all(orderSnapshot.docs.map(async (order) => {

                const orderData = order.data();
                let price = 0;



                const productsOrderedRef = order.ref.collection('products_ordered');
                const productsOrderedSnapshot = await productsOrderedRef.get();

                productsOrderedSnapshot.forEach((product) => {
                    const productData = product.data();
                    price += productData.quantity * productData.price;
                });

                return {
                    id: order.id,
                    value: price,
                    info: 'Product sold',
                    date: orderData.order_date,
                    status: orderData.status,
                };
            }))

        }))

        transactionsList.push(...storeTransactions.flat());

        const paymentRequestRef = db.collection('payment_request').where('userId', '==', id)
        const paymentSnapshot = await paymentRequestRef.get()

        paymentSnapshot.forEach(payment => {

            const paymentData = payment.data()
            const transactionData = {
                id: payment.id,
                date: paymentData.date_requested,
                info: 'Conversion request',
                value: paymentData.amount,
                status: paymentData.status,
            }
            transactionsList.push(transactionData)
        })


        const sortedTransaction = transactionsList.sort((a, b) => b.date - a.date)

        return res.status(200).json(sortedTransaction)
    } catch (error) {
        console.error({ error: error.message })
        return res.status(501).json({ error: error.message })
    }
})

router.get('/officer-transaction/:id', async (req, res, next) => {
    try {
        const { id } = req.params

        const transactionList = [];

        const binRef = db.collection('smart_bin').where('transaction_officer', '==', id)
        const binSnapshot = await binRef.get()

        binSnapshot.forEach(bin => {
            const binData = bin.data()

            let info = 'Scanned receipt';

            if (binData.claim_type != 'qr_receipt') {
                info = 'Collect materials'
            }

            const transactionData = {
                id: bin.id,
                date: binData.claiming_date,
                info,
                value: binData.total_points,
                status: binData.claiming_status,
            }

            transactionList.push(transactionData)

        })

        const paymentReqRef = db.collection('payment_request').where('approved_by', '==', id)
        const paymentReqSnapshot = await paymentReqRef.get()

        paymentReqSnapshot.forEach(payment => {
            const paymentData = payment.data()

            const transactionData = {
                id: payment.id,
                date: paymentData.date_approved,
                info: 'Points to cash',
                value: paymentData.amount,
                status: paymentData.status,
            }

            transactionList.push(transactionData)
        })
        const sortedTransaction = transactionList.sort((a, b) => b.date - a.date)


        return res.status(200).json(sortedTransaction)
    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})

module.exports = router;