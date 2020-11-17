"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const models = __importStar(require("./models"));
mongoose_1.default.connect("mongodb://localhost:27017/TODO", {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const app = express_1.default(), task_path = path_1.default.join(__dirname, "tasks.json"), task_history_path = path_1.default.join(__dirname, "tasks_history.json");
let taskDB = JSON.parse(fs_1.default.readFileSync(task_path).toString()) || {};
nodeArgs();
app.use(cors_1.default(), express_1.default.static(__dirname));
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
app.get("/", (req, res, next) => {
    req.redirected = true;
    res.redirect("/login");
});
app
    .route("/users/:userName")
    .get((req, res, next) => {
    try {
        if (!req.params.userName) {
            res.redirect("/404");
            return;
        }
        const userName = req.params.userName;
        models.Users.exists({ userName: userName }, async (err, exists) => {
            if (err)
                throw err;
            if (exists) {
                let user = (await models.Users.findOne({
                    userName: userName,
                })).toObject();
                res.render("index", {
                    tasks: user.tasks,
                    userName: user.userName,
                    newUser: false,
                    userID: user._id,
                });
            }
            else {
                let usr = new models.Users({
                    userName: userName,
                    tasks: [],
                });
                usr.save();
                res.render("index", {
                    userName: userName,
                    newUser: true,
                    userID: usr._id,
                });
            }
        });
    }
    catch (error) {
        serverError(res, error);
        return;
    }
})
    .post(express_1.default.json({ strict: true }), (req, res, next) => {
    try {
        let userName = req.params.userName, reqType = req.header("_meta") || "";
        if (reqType === "post") {
            let body = req.body;
            models.Users.exists({ userName: userName }, async (err, exists) => {
                if (err)
                    throw err;
                if (exists) {
                    let user = await models.Users.findOneAndUpdate({ userName: userName }, {
                        $addToSet: {
                            tasks: {
                                content: body.content,
                                timestamp: Number(body.timestamp),
                                isImportant: body.important,
                            },
                        },
                    });
                    res.send(user._id);
                }
            });
            new models.Tasks({
                content: body.content,
                timestamp: Number(body.timestamp),
                isImportant: body.important,
            }).save();
        }
        else if (reqType === "update") {
            const body = {
                content: req.body.content,
                id: req.body.id,
            };
            models.Users.exists({ userName: userName }, async (err, exists) => {
                if (err)
                    throw err;
                if (exists) {
                    const user = await models.Users.findOne({
                        userName: userName,
                    });
                    user.tasks.id(body.id).content = body.content;
                    user.save();
                    res.sendStatus(200);
                }
            });
        }
        else if (reqType === "important") {
            try {
                const taskId = req.body.id;
                models.Users.exists({ userName: userName }, async (err, exists) => {
                    if (err)
                        throw err;
                    if (exists) {
                        const user = await models.Users.findOne({
                            userName: userName,
                        });
                        user.tasks.id(taskId).isImportant = !user.tasks.id(taskId).isImportant;
                        user.save();
                        res.sendStatus(200);
                    }
                });
            }
            catch (error) {
                serverError(res, error);
                return;
            }
        }
    }
    catch (error) {
        serverError(res, error);
        return;
    }
})
    .delete((req, res, next) => {
    try {
        const userName = req.params.userName, taskId = req.query.id.toString() || "";
        console.log(taskId);
        models.Users.exists({ userName: userName }, async (err, exists) => {
            if (err)
                throw err;
            if (exists) {
                const user = await models.Users.findOne({
                    userName: userName,
                });
                user.tasks.id(taskId).remove();
                user.save();
                res.sendStatus(200);
            }
        });
    }
    catch (error) {
        serverError(res, error);
        return;
    }
});
app
    .route("/history")
    .get((req, res, next) => {
    try {
        fs_1.default.readFile(task_history_path, { encoding: "utf-8" }, (err, data) => {
            res.render("history", { tasks: JSON.parse(data) });
            if (err)
                throw err;
        });
    }
    catch (error) {
        serverError(res, error);
    }
})
    .delete((req, res, next) => {
    try {
        fs_1.default.writeFileSync(task_history_path, "[\n\n]");
    }
    catch (error) {
        serverError(res, error);
        return;
    }
    res.sendStatus(200);
});
app
    .route("/login")
    .get((req, res, next) => {
    res.render("login", {});
});
app
    .route("/nouser")
    .get((req, res, next) => {
    res.sendFile(path_1.default.resolve(__dirname, "../index.html"));
});
app.get("/404", (req, res, next) => {
    const reqPath = decodeURI((req.query.p || "").toString());
    res.render("not-found.ejs", { path: reqPath });
});
app.listen(nodeArgs().port, nodeArgs().port_log);
mongoose_1.default.connection.once("open", () => {
    console.log(chalk_1.default.hex("#74b9ff")("Database connected!"));
});
mongoose_1.default.connection.once("error", (err) => {
    console.log(`Error on Database: ${chalk_1.default.hex("#d63031")(err)}`);
});
function log(req, res, next) {
    console.log(chalk_1.default.hex("#74b9ff")("Request got for "), chalk_1.default.hex("#A3CB38")(req.url));
    next();
}
function nodeArgs() {
    const argv = require("optimist").argv;
    if (argv.d || argv.debug) {
        argv.log = true;
        argv.port = 8000;
    }
    if (argv.r || argv.redirect) {
        app
            .get("/users", (req, res, next) => {
            res.redirect("/login");
        })
            .get("/user", (req, res, next) => {
            res.redirect("/login");
        });
    }
    if (argv.l || argv.log)
        app.use(log);
    return {
        port: argv.port || argv.p ? argv.port || argv.p : 8000,
        port_log() {
            console.log('"' +
                path_1.default.parse(__filename).base +
                '"' +
                " is listening to port " +
                chalk_1.default.hex("#ED4C67")(argv.port || argv.p ? argv.port || argv.p : 8000));
        },
    };
}
function serverError(res, error) {
    console.error(chalk_1.default.hex("#e74c3c")("Error: "), chalk_1.default.hex("#ff7979")(error));
    res.sendStatus(500);
}
app.get("*", (req, res, next) => {
    res.redirect(`/404?p=${encodeURI(req.path)}`);
});
