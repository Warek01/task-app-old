import express = require("express");
import chalk = require("chalk");
import fs = require("fs");
import bodyParser = require("body-parser");
import cors = require("cors");
import path = require("path");

const app = express();
let tasks: any = JSON.parse(fs.readFileSync(path.join(__dirname, "tasks.json")).toString());

app.use(cors(), express.static(path.resolve(__dirname, "../")));

app.route("/tasks").get((req, res, next): void => {

}).post(bodyParser(), (req, res, next): void => {

});

app.listen(8000);
