const bodyParser = require("body-parser");

const userRoutes = require("./routes/users.js")
const express = require("express");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});


// ROUTES
app.use(userRoutes);

app.listen(8080, ()=>{
  console.log('listening to port 8080')
});