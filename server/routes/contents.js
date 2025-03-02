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
const { error } = require("console");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/media-content"))
    }, filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});


const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const uploadFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type!"), false);
    }
};

const multi_upload = multer({
    storage,
    fileFilter: uploadFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Adjust size limit as needed
});


router.post('/create-post', multi_upload.array('uploadedFiles', 10), async (req, res, next) => {
    const contentId = uid()
    const errors = [];
    const batch = db.batch()
    const { description, type, title, created_by } = req.body;
    // multi_upload(req, res, function (err) {
    //     if (err instanceof multer.MulterError) {
    //         // A Multer error occurred when uploading.
    //         res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
    //         return;
    //     } else if (err) {
    //         // An unknown error occurred when uploading.
    //         if (err.name == 'ExtensionError') {
    //             res.status(413).send({ error: { message: err.message } }).end();
    //         } else {
    //             res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
    //         }
    //         return;
    //     }

    //     // Everything went fine.
    //     // show file `req.files`

    //     console.log(req)
    //     // show body `req.body`
    //     res.status(200).end('Your files uploaded.');
    // })

    try {
        if (isEmptyData(title)) {
            errors.push('Title cannot be empty')
        }
        if (isEmptyData(description)) {
            errors.push('Description cannot be empty')
        }
        if (isEmptyData(type)) {
            errors.push('Please select the type of content')
        }

        if (errors.length > 0) {
            return res.status(501).json({ message: 'Error saving content', errors: errors })
        }

        console.log(errors.length)

        const contentRef = db.collection('contents').doc(contentId)
        const contentData = {
            title,
            description,
            type,
            date_created: admin.firestore.FieldValue.serverTimestamp(),
            date_modified: null,
            created_by,
            modified_by: null,
            status: 'visible'
        }
        batch.set(contentRef, contentData, { merge: true });

        //
        if (req.files) {
            req.files.forEach(file => {
                const imgId = uid()
                const mediaContentRef = contentRef.collection('media').doc(imgId)
                const mediaType = file.mimetype;
                const fileName = file.filename
                const mediaContent = {
                    imgUrl: fileName,
                    type: mediaType,
                    dateCreated: admin.firestore.FieldValue.serverTimestamp(),
                }
                batch.set(mediaContentRef, mediaContent, { merge: true });

            });
            // console.log(req.files)

        }

        await batch.commit()
        res.status(200).json({ message: 'success' })


    } catch (error) {
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }

})

router.get('/fetch-contents', async (req, res, next) => {
    const errors = [];
    const groupedData = {}

    try {
        const contentDoc = db.collection('contents').orderBy('type', 'asc').orderBy('date_created', 'desc')
        const contentSnapshot = await contentDoc.where('status', '!=', 'deactivated').get()
        for (const doc of contentSnapshot.docs) {
            const data = doc.data();
            const type = data.type;

            // Fetch images from the media subcollection
            const contentImagesCollection = doc.ref.collection('media');
            const imagesSnapshot = await contentImagesCollection.get();
            // Group data by type
            if (!groupedData[type]) {
                groupedData[type] = [];
            }


            // Check if media is empty and log if so
            const images = [];
            if (!imagesSnapshot.empty) {
                imagesSnapshot.forEach(imageDoc => {
                    images.push({ imgId: imageDoc.id, ...imageDoc.data() });
                });
            }

            console.log(images)
            groupedData[type].push({ id: doc.id, ...data, images });


        }

        return res.status(200).json({ message: 'success', contentData: groupedData })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})

router.get('/fetch-contents-mobile', async (req, res, next) => {
    const errors = [];
    const groupedData = []

    try {
        const contentDoc = db.collection('contents').orderBy('date_created', 'desc')
        const contentSnapshot = await contentDoc.where('status', '==', 'visible').get()

        for (const doc of contentSnapshot.docs) {
            const data = doc.data();
            const type = data.type;

            // Fetch images from the media subcollection
            const contentImagesCollection = doc.ref.collection('media');
            const userComments = doc.ref.collection('comments');
            const userCommentsDoc = await userComments.get()
            const userReactions = doc.ref.collection('reacts');
            const userReactionsDoc = await userReactions.get()
            const imagesSnapshot = await contentImagesCollection.get();
            // Group data by type

            // Check if media is empty and log if so
            const images = [];
            if (!imagesSnapshot.empty) {
                imagesSnapshot.forEach(imageDoc => {
                    images.push({ imgId: imageDoc.id, ...imageDoc.data() });
                });
            }

            const comments = [];

            if (!userCommentsDoc.empty) {
                userCommentsDoc.forEach(commentDoc => {
                    comments.push({ ...commentDoc.data() })
                })
            }

            const reacts = [];

            if (!userReactionsDoc.empty) {
                userReactionsDoc.forEach(reactDoc => {
                    reacts.push({ reactId: reactDoc.id, })
                })
            }
            groupedData.push({ id: doc.id, ...data, images, comments, reacts });


        }

        console.log(groupedData);

        return res.status(200).json({ message: 'success', contentData: groupedData })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})

router.get('/fetch-archived-contents', async (req, res, next) => {

    const errors = [];
    const contents = [];

    try {
        const contentDoc = db.collection('contents').orderBy('type', 'asc').orderBy('date_created', 'desc').where('status', '==', 'deactivated')
        const contentSnapshot = await contentDoc.get()

        contentSnapshot.forEach(doc => {
            contents.push({ id: doc.id, ...doc.data() })
        })

        return res.status(200).json({ message: 'success', contents })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})


// PATCH REQUEST
router.patch('/deactivate-content', async (req, res, next) => {
    const { id } = req.body;
    const errors = [];
    try {

        const contentDoc = db.collection('contents').doc(id)

        const response = await contentDoc.set({
            status: 'deactivated'
        }, { merge: true })

        res.status(200).send({ message: 'success' })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})

router.patch('/hide-content', async (req, res, next) => {
    const { id } = req.body;
    const errors = [];
    try {

        const contentDoc = db.collection('contents').doc(id)

        const response = await contentDoc.set({
            status: 'hidden'
        }, { merge: true })

        res.status(200).send({ message: 'success' })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})


router.post('/react-to-post', async (req, res, next) => {
    try {
        const { userId, contentId } = req.body;

        const contentRef = db.collection('contents').doc(contentId)
        const contentDoc = await contentRef.get()
        const reactsRef = contentRef.collection('reacts').doc(userId)
        if (!contentDoc.exists) {
            return res.status(401).json({ error: `Cannot find a content that has an ID of ${contentId}` })
        }

        const saveReact = await reactsRef.set({ date_reacted: admin.firestore.FieldValue.serverTimestamp(), }, { merge: true },);

        return res.status(200).json({ message: 'success', react: { reactId: 'userId', date_reacted: admin.firestore.FieldValue.serverTimestamp(), }, },)
    } catch (error) {
        console.error(error.message)
        return res.status(501).json({ error: error.message })
    }
})

router.post('/remove-react-to-post', async (req, res, next) => {
    try {
        const { userId, contentId } = req.body;

        const contentRef = db.collection('contents').doc(contentId)
        const contentDoc = await contentRef.get()
        const reactsRef = contentRef.collection('reacts').doc(userId)
        if (!contentDoc.exists) {
            return res.status(401).json({ error: `Cannot find a content that has an ID of ${contentId}` })
        }

        const saveReact = await reactsRef.delete();

        return res.status(200).json({ message: 'success', react: { reactId: userId, date_reacted: admin.firestore.FieldValue.serverTimestamp(), }, },)
    } catch (error) {
        console.error(error.message)
        return res.status(501).json({ error: error.message })
    }
})


router.post('/add-comment', async (req, res, next) => {
    try {
        const { userId, contentId, comment } = req.body;
        console.log(req.body)
        const commentId = uid(16)
        const contentRef = db.collection('contents').doc(contentId)
        const contentDoc = await contentRef.get()

        const userRef = db.collection('users').doc(userId)
        const userSnapshot = await userRef.get()

        if (!contentDoc.exists) {
            return res.status(401).json({ error: `Cannot find a content that has an ID of ${contentId}` })
        }

        if (!userSnapshot.exists) {
            return res.status(401).json({ error: `Cannot find a user id ${userId}` })
        }

        const {username} = userSnapshot.data()
        const commentRef = contentRef.collection('comments').doc(commentId)

        const commentData = {
            userId,
            commentedBy: username,
            comment,
            date_commented: admin.firestore.FieldValue.serverTimestamp(),
        }
        console.log(comment)
        const saveComment = await commentRef.set(commentData, { merge: true })
        return res.status(200).json({ id: commentId, ...commentData })

    } catch (error) {

        console.error(error.message)
        return res.status(501).json({ error: error.message })
    }
})



module.exports = router;