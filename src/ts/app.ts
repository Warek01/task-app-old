import express = require("express");
import chalk = require("chalk");
import fs = require("fs");
import bodyParser = require("body-parser");
import cors = require("cors");
import path = require("path");

const app = express();
const tasks = JSON.parse( String( fs.readFileSync(path.join(__dirname, "tasks.json")) ) );

app.use(cors(), express.static(path.resolve(__dirname, "../")));

app.route("/tasks").get((req, res, next) => {

}).post(bodyParser(), (req, res, next) => {

});

app.listen(8000);
