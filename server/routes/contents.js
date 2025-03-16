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
const { error, count } = require("console");
const { consumers } = require("stream");
const { devNull, userInfo } = require("os");


const isProduction = process.env.NODE_ENV === "production";


const uploadPath = isProduction
    ? "/server/public/media-content" // Persistent disk on Render
    : path.join(__dirname, "../public/media-content");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // const uploadPath = isProduction
        //     ? "/server/public/media-content" // Persistent disk on Render
        //     : path.join(__dirname, "../public/media-content"); // Local storage

        cb(null, uploadPath)
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
const upload = multer({ storage: storage });

const multi_upload = multer({
    storage,
    fileFilter: uploadFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Adjust size limit as needed
});

router.patch('/delete-content-image', async (req, res, next) => {
    try {
        const { id, contentId, userId } = req.body

        const contentRef = db.collection('contents').doc(contentId)
        const contentSnapshot = await contentRef.get()

        if (!contentSnapshot.exists) {
            return res.status(404).json({ error: 'Content id not found!' })
        }


        const imagesRef = contentRef.collection('media').doc(id)
        const imageSnapshot = await imagesRef.get()

        if (!imageSnapshot.exists) {
            return res.status(404).json({ error: 'Image id not found!' })
        }

        const contentData = {
            date_modified: admin.firestore.FieldValue.serverTimestamp(),
            modified_by: userId
        }

        const saveContent = await contentRef.set(contentData, { merge: true })
        const saveImage = await imagesRef.delete()

        return res.status(200).json({ message: 'success' })

    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})
router.post('/add-content-image', upload.single('image'), async (req, res, next) => {
    try {
        const { id, contentId } = req.body

        const imgId = uid()
        const contentRef = db.collection('contents').doc(contentId)

        const imageRef = contentRef.collection('media').doc(imgId)

        const dataContent = {
            date_modified: admin.firestore.FieldValue.serverTimestamp(),
            modified_by: id
        }

        const mediaContent = {
            imgUrl: req.file.filename,
            type: req.file.mimetype,
            dateCreated: admin.firestore.FieldValue.serverTimestamp(),
        }

        const updateContent = await contentRef.set(dataContent, { merge: true })
        const saveImage = await imageRef.set(mediaContent, { merge: true })

        return res.status(200).json({ message: 'success' })

    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})


router.post('/edit-content', upload.single('image'), async (req, res, next) => {
    try {
        const { userId, contentId, title, description, type } = req.body


        const contentRef = db.collection('contents').doc(contentId)
        const dataContent = {
            title,
            description,
            type,
            modified_by: userId,
            date_modified: admin.firestore.FieldValue.serverTimestamp(),
        }

        const saveImage = await contentRef.set(dataContent, { merge: true })

        return res.status(200).json({ message: 'success' })

    } catch (error) {
        console.log(error.message)
        return res.status(501).json({ error: error.message })
    }
})
router.post('/create-post', multi_upload.array('uploadedFiles', 10), async (req, res, next) => {
    const contentId = uid()
    const errors = [];
    const batch = db.batch()
    const { description, type, title, created_by } = req.body;

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

        const notifRef = db.collection('notifications').doc()

        const notifData = {
            title: `New ${type} available!`,
            message: `Check out the latest ${type} just posted!`,
            notif_date: admin.firestore.FieldValue.serverTimestamp(),
            notif_type: 'postings',
            readBy: [],
            redirect_id: contentId,
            redirect_type: 'contents',
            send_type: 'global',
            userId: null,
        }

        batch.set(notifRef, notifData, { merge: true })

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
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }

})


router.get('/fetch-content/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const contentRef = db.collection('contents').doc(id)
        const contentSnapshot = await contentRef.get()

        const images = [];

        if (!contentSnapshot.exists) {
            return res.status(404).json({ message: 'error', error: `Cannot find content with an id of ${id}` })
        }

        const contentData = {
            ...contentSnapshot.data()
        }

        const imagesRef = contentRef.collection('media')
        const imagesDoc = await imagesRef.get()

        if (imagesDoc.empty) {
            return res.status(200).json({ contentData, images })
        }

        imagesDoc.forEach(image => images.push({ imageId: image.id, ...image.data() }))

        const commentSnapshot = await contentRef.collection('comments').count().get();
        const commentCount = commentSnapshot.data().count;
        const reactSnapshot = await contentRef.collection('reacts').count().get();
        const reactCount = reactSnapshot.data().count;
        return res.status(200).json({ contentData, images, reactCount, commentCount })


    } catch (error) {
        console.error(error.message)
        return res.status(501).json({ message: error.message, error: 'Internal server error' })
    }
})
router.get('/fetch-content-comments/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const contentRef = db.collection('contents').doc(id)
        const commentRef = contentRef.collection('comments').orderBy('date_commented', 'desc')
        const commentSnapshot = await commentRef.get()

        const comments = [];

        if (commentSnapshot.empty) {
            return res.status(200).json(comments)
        }

        commentSnapshot.forEach(comment => comments.push({ id: comment.id, ...comment.data() }))

        return res.status(200).json(comments)


    } catch (error) {
        console.error(error.message)
        return res.status(501).json({ message: error.message, error: 'Internal server error' })
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
            console.log(comments)

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

router.get('/fetch-content-mobile/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const contentRef = db.collection('contents').doc(id)
        const contentSnapshot = await contentRef.get()

        if (!contentSnapshot.exists) {
            return res.status(404).json({ error: 'Content not found' })
        }

        if (contentSnapshot.data().status == 'deactivated') {
            return res.status(409).json({ error: 'Content not available' })
        }


        const comments = [];
        const images = [];
        const reacts = [];
        const commentRef = contentRef.collection('comments')
        const commentSnapshot = await commentRef.get()

        const reactRef = contentRef.collection('reacts')
        const reactSnapshot = await reactRef.get()

        const mediaRef = contentRef.collection('media')
        const mediaSnapshot = await mediaRef.get()

        commentSnapshot.forEach(comment => comments.push({ id: comment.id, ...comment.data() }));
        reactSnapshot.forEach(react => reacts.push({ id: react.id, ...react.data() }))
        mediaSnapshot.forEach(media => images.push({ id: media.id, ...media.data() }))


        return res.status(200).json({id: contentSnapshot.id, ...contentSnapshot.data(), comments, images, reacts })

    } catch (error) {
        return res.status(501).json({ error: error.message })
    }
})

router.get('/fetch-archived-contents', async (req, res, next) => {

    const errors = [];
    const contents = [];

    try {
        const contentDoc = db.collection('contents').orderBy('date_deactivated', 'desc').where('status', '==', 'deactivated')
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
    const { id, deactivatedBy } = req.body;
    const errors = [];
    try {

        // console.log(deactivatedBy)
        const contentDoc = db.collection('contents').doc(id)

        const response = await contentDoc.set({
            status: 'deactivated',
            date_deactivated: admin.firestore.FieldValue.serverTimestamp(),
            deactivatedBy
        }, { merge: true })

        res.status(200).send({ message: 'success' })
    } catch (error) {
        console.log(error.message)
        errors.push('Internal server error')
        return res.status(501).json({ message: error.message, errors: errors })
    }
})
router.patch('/restore-content/', async (req, res, next) => {
    const { id, userId } = req.body;
    try {

        const contentDoc = db.collection('contents').doc(id)

        const response = await contentDoc.set({
            status: 'visible',
            date_restored: admin.firestore.FieldValue.serverTimestamp(),
            restoredby: userId
        }, { merge: true })

        res.status(200).send({ message: 'success' })
    } catch (error) {
        return res.status(501).json({ message: error.message, error: 'Internal server error' })
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

        const { username } = userSnapshot.data()
        const commentRef = contentRef.collection('comments').doc(commentId)

        const commentData = {
            userId,
            commentedBy: username,
            comment,
            date_commented: admin.firestore.FieldValue.serverTimestamp(),
        }
        console.log(commentData.date_commented)
        const saveComment = await commentRef.set(commentData, { merge: true })
        return res.status(200).json({ ...commentData })

    } catch (error) {

        console.error(error.message)
        return res.status(501).json({ error: error.message })
    }
})


router.get('/top-reacted-contents', async (req, res) => {
    try {
        // Step 1: Query all reactions using collectionGroup to get reactions from all contents
        const reactsSnapshot = await db.collectionGroup('reacts').get();

        if (reactsSnapshot.empty) {
            return res.status(200).json({ message: "No reactions found", top_contents: [] });
        }

        // Step 2: Count reactions per content
        const contentReactionCount = {};

        const countPromises = reactsSnapshot.docs.map(async (reactDoc) => {
            const contentDocRef = reactDoc.ref.parent.parent;

            if (!contentDocRef) return;

            const contentDoc = await contentDocRef.get();

            if (!contentDoc.exists) return;

            const contentId = contentDoc.id;
            const contentTitle = contentDoc.data().title || "Unknown Title";

            if (!contentReactionCount[contentId]) {
                contentReactionCount[contentId] = { contentId, title: contentTitle, count: 0 };
            }

            contentReactionCount[contentId].count += 1;
        });

        await Promise.all(countPromises);

        // Step 3: Sort contents by reaction count in descending order
        const sortedContents = Object.values(contentReactionCount)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Get the top 5

        // Step 4: Return response
        return res.status(200).json({ top_contents: sortedContents });

    } catch (error) {
        console.error("Error fetching top contents by reactions:", error);
        return res.status(500).json({ error: error.message });
    }
});


router.get('/top-commented-contents', async (req, res) => {
    try {
        const commentSnapshot = await db.collectionGroup('comments').get();

        if (commentSnapshot.empty) {
            return res.status(200).json({ message: "No reactions found", top_contents: [] });
        }

        const contentCommentCount = {};

        const countPromises = commentSnapshot.docs.map(async (commentDoc) => {
            const contentDocRef = commentDoc.ref.parent.parent;

            if (!contentDocRef) return;

            const contentDoc = await contentDocRef.get();

            if (!contentDoc.exists) return;

            const contentId = contentDoc.id;
            const contentTitle = contentDoc.data().title || "Unknown Title";

            if (!contentCommentCount[contentId]) {
                contentCommentCount[contentId] = { contentId, title: contentTitle, count: 0 };
            }

            contentCommentCount[contentId].count += 1;
        });

        await Promise.all(countPromises);

        // Step 3: Sort contents by reaction count in descending order
        const sortedContents = Object.values(contentCommentCount)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Get the top 5

        // Step 4: Return response
        return res.status(200).json({ top_contents: sortedContents });

    } catch (error) {
        console.error("Error fetching top contents by reactions:", error);
        return res.status(500).json({ error: error.message });
    }
});
router.get('/reacts-count/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const contentRef = db.collection('contents').doc(id)

        const reactSnapshot = await contentRef.collection('reacts').count().get();
        const reactCount = reactSnapshot.data().count;
        return res.status(200).json(reactCount);

    } catch (error) {
        console.error("Error fetching top contents by reactions:", error);
        return res.status(500).json({ error: error.message });
    }
});

router.get('/commentCounts-count/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const contentRef = db.collection('contents').doc(id)

        const contentSnapshot = await contentRef.collection('comments').count().get();
        const commentCount = contentSnapshot.data().count;
        return res.status(200).json(commentCount);

    } catch (error) {
        console.error("Error fetching top contents by reactions:", error);
        return res.status(500).json({ error: error.message });
    }
});



router.get('/recent-reactors', async (req, res, next) => {
    try {
        const reactRef = db.collectionGroup('reacts');
        const reactSnapshot = await reactRef.orderBy('date_reacted', 'desc').limit(5).get();

        const reactors = [];

        for (const doc of reactSnapshot.docs) {
            const reactionData = doc.data();
            const docRef = doc.ref;
            const userRef = db.collection('users').doc(doc.id)
            const parentRef = docRef.parent;
            const parentDocRef = parentRef.parent; // This gets the parent content document reference

            if (parentDocRef) {
                const parentDocSnapshot = await parentDocRef.get();
                const userSnapshot = await userRef.get();
                if (parentDocSnapshot.exists) {
                    const contentData = parentDocSnapshot.data();
                    const username = userSnapshot.data().username || 'Unkown user';
                    reactors.push({
                        contentId: parentDocRef.id,
                        user_id: doc.id || 'Unknown User',
                        info: `${username} reacted to ${contentData.title || 'Unknown Title'}`,
                        date_reacted: reactionData.date_reacted
                    });
                }
            }
        }

        return res.json(reactors);
    } catch (error) {
        console.error("Error fetching top recent reactors:", error);
        return res.status(500).json({ error: error.message });
    }
});

router.get('/recent-commentors', async (req, res, next) => {
    try {
        const reactRef = db.collectionGroup('comments');
        const reactSnapshot = await reactRef.orderBy('date_commented', 'desc').limit(5).get();

        const commentors = [];

        for (const doc of reactSnapshot.docs) {
            const commentData = doc.data();
            const docRef = doc.ref;
            const userRef = db.collection('users').doc(commentData.userId)
            const parentRef = docRef.parent;
            const parentDocRef = parentRef.parent; // This gets the parent content document reference

            if (parentDocRef) {
                const parentDocSnapshot = await parentDocRef.get();
                const userSnapshot = await userRef.get();
                if (parentDocSnapshot.exists) {
                    const contentData = parentDocSnapshot.data();
                    const username = userSnapshot.data().username || 'Unkown user';
                    commentors.push({
                        contentId: parentDocRef.id,
                        user_id: doc.id || 'Unknown User',
                        info: `${username} commented to ${contentData.title || 'Unknown Title'}`,
                        date_commented: commentData.date_commented
                    });
                }
            }
        }

        return res.json(commentors);
    } catch (error) {
        console.error("Error fetching top recent reactors:", error);
        return res.status(500).json({ error: error.message });
    }
});

router.get('/content-admin-activity/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const activities = [];

        // Get stores where the admin has approved or rejected
        const contentCreateSnapshot = await db.collection("contents")
            .where("created_by", "==", id).orderBy('date_created', 'desc').limit(5)
            .get();

        contentCreateSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.date_created) {
                activities.push({
                    id: doc.id,
                    info: `You created ${data.title}`,
                    date: data.date_created
                });
            }
        });

        const deactivatedContentSnapshot = await db.collection("contents")
            .where("deactivatedBy", "==", id).orderBy('date_deactivated', 'desc').limit(5)
            .get();

        deactivatedContentSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.date_deactivated) {
                activities.push({
                    id: doc.id,
                    info: `You deactivated ${data.title}`,
                    date: data.date_deactivated
                });
            }
        });


        const restoredContentSnapshot = await db.collection("contents")
            .where("restoredby", "==", id).orderBy('date_restored', 'desc').limit(5)
            .get();

        restoredContentSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.date_restored) {
                activities.push({
                    id: doc.id,
                    info: `You restore ${data.title}`,
                    date: data.date_restored
                });
            }
        });


        const modifiedContentSnapshot = await db.collection("contents")
            .where("modified_by", "==", id).orderBy('date_modified', 'desc').limit(5)
            .get();

        modifiedContentSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.date_modified) {
                activities.push({
                    id: doc.id,
                    info: `You edited ${data.title}`,
                    date: data.date_modified
                });
            }
        });
        // Sort by date (latest first)
        const latestActs = activities.sort((a, b) => b.date - a.date).slice(0, 5);

        return res.status(200).json(latestActs);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message });
    }
})

module.exports = router;