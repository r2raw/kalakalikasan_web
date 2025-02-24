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
const { error } = require("console");

const uploadDir = path.join(__dirname, "../public/store-cred/");
const uploadProdDir = path.join(__dirname, "../public/products/");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(uploadProdDir)) {
    fs.mkdirSync(uploadProdDir, { recursive: true });
}

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/products");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
});


const uploadProduct = multer({ storage: productStorage });
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

router.get('/fetch-user-store/:id', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const storeRef = db.collection('stores').where('owner_id', '==', userId);

        const storeDoc = await storeRef.get();
        let storeObj = {}; // Use 'let' instead of 'const'


        if (storeDoc.empty) {
            return res.status(200).json({ message: 'No store' })
        }
        if (!storeDoc.empty) {
            storeObj = storeDoc.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        }

        return res.status(200).json({ message: 'success', storeData: storeObj })
    } catch (error) {
        console.error(error.message)
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


router.get('/store-info-mobile/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const errors = [];
        let responseObj = {};

        const storeRef = db.collection('stores').where('owner_id', '==', id);
        const storeDoc = await storeRef.get();


        if (storeDoc.empty) {
            errors.push(`A store with an id of ${id} does not exist`)
            return res.status(401).json({ message: 'Unauthorized', errors: errors });
        }

        storeDoc.forEach(doc => {
            responseObj = {
                store_id: doc.id,
                ...doc.data(),
            }
        });


        console.log(responseObj)
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


router.post('/check-product-existing', async (req, res, next) => {

})

router.post('/add-product', uploadProduct.single('productImage'), async (req, res, next) => {
    const { store_id, quantity, price, productName } = req.body;
    const id = uid(20)
    const errors = []
    try {

        let productImage = null
        if (req.file) {
            productImage = req.file.filename;
        }


        const storeRef = db.collection('stores').doc(store_id)
        const productRef = storeRef.collection('products').doc(id);
        const productInfo = {
            productImage,
            productName,
            quantity: parseInt(quantity),
            price: parseInt(price),
            date_created: admin.firestore.FieldValue.serverTimestamp(),

        }

        const saveProduct = await productRef.set(productInfo, { merge: true })



        res.status(200).send({ message: 'success', productInfo: { id: id, ...productInfo } })
    } catch (error) {
        errors.push('Internal server error')
        console.error(error.message)
        return res.status(501).json({ message: error.message, error: error.message })
    }

})


router.get('/fetch-products/:id', async (req, res, next) => {

    const { id } = req.params;
    try {
        const products = [];
        const storeRef = db.collection('stores').doc(id);
        const productRef = storeRef.collection('products').orderBy('productName');
        const productDoc = await productRef.get();

        if (productDoc.empty) {
            return res.status(200).json({ message: 'No products found', products })
        }


        productDoc.forEach(product => products.push({ id: product.id, ...product.data() }))

        return res.status(200).json({ message: 'Success', products })
    } catch (error) {
        console.error(error.message)
        return res.status(501).json({ message: error.message, error: error.message })
    }
})


function getAverageRoundedRating(ratingsArray) {
    if (ratingsArray.length === 0) return 0; // Avoid division by zero
    const total = ratingsArray.reduce((sum, item) => sum + item.ratings, 0);
    const average = total / ratingsArray.length;
    return Math.round(average);
}


router.get('/fetch-stores/:id', async (req, res, next) => {
    const { id } = req.params;
    const stores = []
    try {
        const storeRef = db.collection('stores');
        const rateRef = storeRef.doc().collection('rates')
        const rateDoc = await rateRef.get()
        const storeDoc = await storeRef.where('owner_id', '!=', id).where('status', '==', 'approved').get()

        if (storeDoc.empty) {
            return res.status(200).json({ message: 'No stores found', stores })
        }


        storeDoc.forEach(store => {
            const ratings = [];

            if (!rateDoc.empty) {
                rateDoc.forEach(rate => ratings.push({ rate_id: rate.id, ...rate.data() }))
            }

            const hasRated = ratings.find(item => item.rating_id === id) || null
            let myRate = 0
            if (hasRated != null) {
                myRate = hasRated.ratings;
            }

            const averageRounded = getAverageRoundedRating(ratings);


            stores.push({ store_id: store.id, ...store.data(), ratings, myRate, total_ratings: averageRounded })
        })


        return res.status(200).json({ message: 'Success', stores })
    } catch (error) {
        console.error(error.message)
        return res.status(501).json({ message: error.message, error: error.message })
    }
})

const getProduct = async (productRef) => {

    const productDoc = await productRef.get();
    return productDoc;
}
router.post('/checkout-products', async (req, res, next) => {

    try {
        const errors = [];
        const { user_id, cart } = req.body;
        const userRef = db.collection('users').doc(user_id);
        const userDoc = await userRef.get();
        const { username, points } = userDoc.data()
        let totalProductPrice = 0;
        // CHECK DB
        await Promise.all(cart.map(async (store) => {
            const { store_id, products, store_name } = store;
            const storeRef = db.collection('stores').doc(store_id);
            const totalPoints = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
            totalProductPrice += totalPoints
            console.log(totalProductPrice)

            await Promise.all(products.map(async (product) => {
                const productRef = storeRef.collection('products').doc(product.product_id);
                const productDoc = await getProduct(productRef);
                if (productDoc.exists) {
                    const { quantity, productName } = productDoc.data()
                    // CHECK IF THE CURRENT STOCKS IN DB IS SUFFICIENT
                    if (product.quantity > quantity) {
                        errors.push(`Insufficient stocks for ${productName}. Only ${quantity} is available, but ${product.quantity} were requested.`)
                    }
                }
            }));
        }));


        if (points < totalProductPrice) {
            errors.push('Insufficient points')
        }

        if (errors.length > 0) {
            return res.status(409).json({ message: 'Insufficient products', errors });
        }


        // NO ERRORS
        await Promise.all(cart.map(async (store) => {
            const notificationRef = db.collection('notifications').doc();

            const id = uid(16)
            const { store_id, products, store_name } = store;
            const storeRef = db.collection('stores').doc(store_id);
            const storeDoc = await storeRef.get();
            const { owner_id } = storeDoc.data();
            const orderRef = db.collection('orders').doc(id);


            // PRODUCTS

            const orderData = {
                ordered_by: user_id,
                store_id: store_id,
                status: 'pending',
                order_date: admin.firestore.FieldValue.serverTimestamp(),
            }

            const saveOrder = await orderRef.set(orderData, { merge: true })

            await Promise.all(products.map(async (product) => {

                const orderedProductRef = orderRef.collection('products_ordered').doc();
                const saveOrderedProducts = await orderedProductRef.set(product, { merge: true })

            }));

            const notificationData = {
                title: 'Product request',
                message: `${username} has a product request.`,
                send_type: 'direct',
                notif_type: 'transactions',
                redirect_type: 'selling',
                redirect_id: id,
                userId: owner_id,
                readBy: [],
                notif_date: admin.firestore.FieldValue.serverTimestamp(),
            }

            const transactionRef = userRef.collection('transactions').doc();

            const transactionData = {
                transactionId: id,
                type: 'buying',
                transactionDate: admin.firestore.FieldValue.serverTimestamp(),
            }

            const saveNotification = await notificationRef.set(notificationData, { merge: true })
            const saveTransaction = await transactionRef.set(transactionData, { merge: true })
            // console.log(notificationData)
        }));

        const currentPoints = points - totalProductPrice;

        const saveUser = await userRef.set({ points: currentPoints }, { merge: true })


        return res.status(200).json({ message: 'Success' })

    } catch (error) {
        console.error(error.message)
        return res.status(501).json({ message: 'Checkout error', error: error.message })
    }
})

router.get('/pending-product-request/:store_id', async (req, res, next) => {
    try {
        const { store_id } = req.params;

        console.log(store_id)
        const orders = [];
        const orderRef = db.collection('orders')
            .where('store_id', '==', store_id).where('status', '==', 'pending')
            .orderBy('order_date', 'desc');
        const orderDoc = await orderRef.get();


        if (!orderDoc.empty) {
            await Promise.all(orderDoc.docs.map(async (item) => {

                const { ordered_by } = item.data();
                const userRef = db.collection('users').doc(ordered_by);
                const userDoc = await userRef.get();

                if (userDoc.exists) {
                    const { username } = userDoc.data();

                    orders.push({ order_id: item.id, ...item.data(), username })
                }

            }));
        }

        console.log(orders)
        return res.status(200).json({ message: 'success', orders })
    } catch (error) {
        console.error(error.message)
        return res.status(501).json({ message: 'Checkout error', error: error.message })
    }
})

router.get('/product-request/:id', async (req, res, next) => {
    const errors = []
    try {
        const { id } = req.params;

        const orderRef = db.collection('orders').doc(id)
        const orderDoc = await orderRef.get();
        const productRef = orderRef.collection('products_ordered')
        const productDoc = await productRef.get();
        const { ordered_by, store_id } = orderDoc.data();
        const userRef = db.collection('users').doc(ordered_by)
        const userDoc = await userRef.get();
        const storeRef = db.collection('stores').doc(store_id)
        const storeDoc = await storeRef.get()

        if (!storeDoc.exists) {
            errors.push('Store not found')
        }
        if (!userDoc.exists) {
            errors.push('User not found')
        }
        if (!orderDoc.exists) {
            errors.push('Order not found')
        }

        if (productDoc.empty) {
            errors.push('Product not found')
        }

        if (errors.length > 0) {
            console.log(errors)
            return res.status(401).json({ message: 'error', errors })

        }
        const fetchedProducts = [];
        productDoc.forEach(item => {
            fetchedProducts.push({ ordered_product_id: item.id, ...item.data() })
        })

        const { username } = userDoc.data()
        const { store_name } = storeDoc.data()
        const orderData = {
            ...orderDoc.data(),
            username,
            store_name,
            products: fetchedProducts,
        }



        return res.status(200).json({ message: 'success', order: orderData })

    } catch (error) {
        console.log(error.message)
        return res.status(501).json({ message: 'Error', error: error.message })
    }
})

router.patch('/reject-product-request', async (req, res, next) => {
    try {
        const { orderId } = req.body;

        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get()
        if (!orderDoc.exists) {
            res.status(401).json({ message: 'error', error: 'Order id not found!' })
        }



        const productRef = orderRef.collection('products_ordered');
        const productDoc = await productRef.get()

        if (productDoc.empty) {
            if (!orderRef.exists) {
                res.status(401).json({ message: 'error', error: 'No product found' })
            }
        }


        const products = [];
        productDoc.forEach(item => products.push({ ...item.data() }))
        const totalPoints = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);


        const { ordered_by } = orderDoc.data();
        const userRef = db.collection('users').doc(ordered_by);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(401).json({ message: 'error', error: 'User not found' })
        }


        const { points } = userDoc.data();
        const currentPoints = points + totalPoints;


        const notificationRef = db.collection('notifications').doc();
        const notificationData = {
            title: 'Product request rejected',
            message: `Your product requests have been rejected. A refund of ${totalPoints} points has been issued to your account`,
            send_type: 'direct',
            notif_type: 'transactions',
            redirect_type: 'refund',
            redirect_id: orderId,
            userId: ordered_by,
            readBy: [],
            notif_date: admin.firestore.FieldValue.serverTimestamp(),
        }

        const transactionRef = userRef.collection('transactions').doc()
        const transactionData = {
            transactionId: orderId,
            type: 'refund',
            transactionDate: admin.firestore.FieldValue.serverTimestamp(),
        }

        const updateOrder = await orderRef.set({ status: 'rejected' }, { merge: true })
        const saveCurrentpoints = await userRef.set({ points: currentPoints, }, { merge: true })
        const saveNotification = await notificationRef.set(notificationData, { merge: true })
        const saveTransaction = await transactionRef.set(transactionData, { merge: true })

        res.status(200).json({ message: 'success' })
    } catch (error) {
        console.log(error.message)
        res.status(501).json({ message: 'error', error: error.message })

    }
})

module.exports = router;