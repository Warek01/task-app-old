"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const chalk = require("chalk");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();
let tasks = JSON.parse(fs.readFileSync(path.join(__dirname, "tasks.json")).toString());
nodeArgs();
app.use(cors(), express.static(path.resolve(__dirname, "../")));
app.route("/tasks").get((req, res, next) => {
}).post(express.json({ strict: false }), express.urlencoded({ extended: true }), (req, res, next) => {
});
app.listen(nodeArgs().port, nodeArgs().port_log);
// Console logger
function log(req, res, next) {
    console.log(chalk.hex("#74b9ff")("Request got for "), chalk.hex("#A3CB38")(req.url));
    next();
}
/**
 * Watches for params: "node [file_name] [params...]"
 * -d or --debug for Debugging mode
 * -p [port] or --port [port] to set port
 * -l or --log to trigger Console logger
 * @returns Current listened port and port logging function
 * @params none
 *
 */
function nodeArgs() {
    const argv = require("optimist").argv;
    // -d or --debug
    if (argv.d || argv.debug) {
        argv.log = true;
        argv.port = 8000;
    }
    // -l or --log
    if (argv.l || argv.log)
        app.use(log);
    // -p [port] or --port [port]
    return {
        port: argv.port || argv.p ? argv.port || argv.p : 8000,
        /** Logs in console current listened port
         * @returns Nothing
         */
        port_log() {
            console.log('"' + path.parse(__filename).base + '"' + " is listening to port " + chalk.hex("#ED4C67")(argv.port || argv.p ? argv.port || argv.p : 8000));
        }
    };
}
nodeArgs().port_log();
