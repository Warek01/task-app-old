"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
let tasks = JSON.parse(fs.readFileSync(path.join(__dirname, "tasks.json")).toString());
app.use(cors(), express.static(path.resolve(__dirname, "../")));
app.route("/tasks").get((req, res, next) => {
}).post(bodyParser(), (req, res, next) => {
});
app.listen(8000);
