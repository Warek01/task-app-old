"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const chalk = require("chalk");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express(), task_path = path.join(__dirname, "tasks.json"), task_history_path = path.join(__dirname, "tasks_history.json");
/** Tasks database object */
let taskDB = JSON.parse(fs.readFileSync(task_path).toString());
nodeArgs();
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//       /* / */ ---------------
app.route("/").get((req, res, next) => {
    try {
        res.render("index", { tasks: taskDB });
    }
    catch (error) {
        serverError(res, error);
        return;
    }
}).post(express.json({ strict: true }), express.urlencoded({ extended: true }), (req, res, next) => {
    try {
        if (!req.body.index) {
            // Get request body (task)
            let body = req.body, tasksHistory = JSON.parse(fs.readFileSync(task_history_path, "utf-8"));
            // Push gotten task to local memory tasks array
            tasksHistory.push(body);
            taskDB.push(body);
            // Overwrite static memory file with local memory tasks array
            fs.writeFileSync(task_path, JSON.stringify(taskDB, null, 2));
            fs.writeFile(task_history_path, JSON.stringify(tasksHistory, null, 2), () => { });
        }
        // Task content update logic
        else {
            let body = req.body;
            // Update required task content to gotten one
            taskDB[body.index].content = body.content;
            // Overwrite static memory file with local memory tasks array
            fs.writeFileSync(task_path, JSON.stringify(taskDB, null, 2));
        }
    }
    catch (error) {
        serverError(res, error);
        return;
    }
    res.sendStatus(200);
})
    // Task deleting logic
    .delete((req, res, next) => {
    try {
        let index = Number(req.query.index);
        // Remove item from array
        taskDB.splice(index, 1);
        // Overwrite static memory file with local memory tasks array
        fs.writeFileSync(task_path, JSON.stringify(taskDB, null, 2));
    }
    catch (error) {
        serverError(res, error);
        return;
    }
    res.sendStatus(200);
});
// -------------------------- /* / */
//       /* /HISTORY */ ---------------
app.route("/history").get((req, res, next) => {
    try {
        fs.readFile(task_history_path, { encoding: "utf-8" }, (err, data) => {
            res.render("history", { tasks: JSON.parse(data) });
            if (err)
                throw err;
        });
    }
    catch (error) {
        serverError(res, error);
    }
}).delete((req, res, next) => {
    try {
        fs.writeFileSync(task_history_path, "[\n\n]");
    }
    catch (error) {
        serverError(res, error);
        return;
    }
    res.sendStatus(200);
});
// -------------------------- /* /HISTORY */
app.listen(nodeArgs().port, nodeArgs().port_log);
app.use(express.static(path.resolve(__dirname, "../")));
// --------------------------
/* Functions */
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
        port_log() {
            console.log('"' + path.parse(__filename).base + '"' + " is listening to port " + chalk.hex("#ED4C67")(argv.port || argv.p ? argv.port || argv.p : 8000));
        }
    };
}
/**
 * Logs in console whenever an error on server side
 * occurs and sends response with status 500
 * "Internal Server Error"
 * @param res Response object of current callback
 * @param error Error object from "try catch" block
 * */
function serverError(res, error) {
    console.error(chalk.hex("#e74c3c")("Error: "), chalk.hex("#ff7979")(error));
    res.sendStatus(500);
}
