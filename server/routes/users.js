const express = require("express");
const { db } = require('../data/firebase.js');
const router = express.Router();

router.post("/users", async (req, res, next) => {
    try {

        const { username, password } = req.body;

        const usersRef = db.collection('users').doc('asdasdassd')

        const dbRes = await usersRef.set(
            {
                username,
                password
            }, { merge: true }
        )


        res.status(200).send('asd')
    } catch (error) {
        console.error('error ' + error.message)
    }
});

module.exports = router;
