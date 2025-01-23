const bodyParser = require("body-parser");
const userRoutes = require("./routes/users.js")
const contentRoutes = require("./routes/contents.js")
const express = require("express");
const app = express();
const _ = require('lodash')
const fs = require("fs");
const path = require("path");
const cors = require('cors');

const uploadDir = path.join(__dirname, "./public/media-content");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


app.use(cors({
  origin:'http://localhost:5173',
  methods: ['GET, POST, PATCH'],
  allowedHeaders:['Content-Type,Authorization']
}));



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

app.listen(8080, ()=>{
  const email = 'r2raaaw'

  console.log(email.substring(0))
});