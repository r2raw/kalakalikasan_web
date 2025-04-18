const bodyParser = require("body-parser");
const userRoutes = require("./routes/users.js")
const contentRoutes = require("./routes/contents.js")
const smartBinRoutes = require("./routes/smartBin.js")
const storesRoutes = require("./routes/stores.js")
const dotenv =require('dotenv')
const express = require("express");
const app = express();
const _ = require('lodash')
const fs = require("fs");
const path = require("path");
const cors = require('cors');
const { isConvertibleToInt } = require("./util/validations.js");
dotenv.config()

const PORT = process.env.PORT || 8080;
const uploadDir = path.join(__dirname, "./public/media-content");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const UPLOAD_DIR = "/server/public";
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use(cors({
  // origin:'*',
  methods: ['GET, POST, PATCH, DELETE'],
  allowedHeaders:['Content-Type,Authorization']
}));

app.use("/media-content", express.static("/server/public/media-content"));
app.use("/products", express.static("/server/public/products"));
app.use("/userQr", express.static("/server/public/userQr"));
app.use("/userImg", express.static("/server/public/userImg"));
app.use("/store-cred", express.static("/server/public/store-cred"));

// app.use((req, res, next) => {
//   console.log('asssss')
//     const allowedOrigin = 'http://localhost:173/';
//     if (req.headers.origin !== allowedOrigin) {
//       return res.status(403).json({ error: 'CORS not allowed for this origin' });
//     }
//     next();
//   });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json());
app.use(express.static("public"));
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:173/');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   next();
// });


// ROUTES
app.use(userRoutes);
app.use(contentRoutes);
app.use(smartBinRoutes)
app.use(storesRoutes);

app.listen(PORT, ()=>{
  console.log(`Running on port ${PORT}...`)
});


module.exports = {UPLOAD_DIR}