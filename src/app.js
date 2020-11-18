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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chalk_1 = __importDefault(require("chalk"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const models = __importStar(require("./models"));
mongoose_1.default.connect("mongodb://localhost:27017/TODO", {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const app = express_1.default();
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
                    colorIndex: user.colorIndex,
                    bgIndex: user.backgroundColorIndex,
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
                    colorIndex: 0,
                    bgIndex: 0,
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
        const userName = req.params.userName, reqType = req.header("_meta") || "";
        console.log(req.query);
        models.Users.exists({ userName: userName }, async (err, exists) => {
            if (err)
                throw err;
            if (exists) {
                let user = await models.Users.findOne({
                    userName: userName,
                });
                if (req.query.color) {
                    user.colorIndex = Number(req.query.color);
                    user.save();
                    return;
                }
                else if (req.query.bg) {
                    user.backgroundColorIndex = Number(req.query.bg);
                    user.save();
                    return;
                }
                if (reqType === "post") {
                    let body = req.body;
                    user.tasks.push({
                        content: body.content,
                        timestamp: Number(body.timestamp),
                        isImportant: body.important,
                    });
                    new models.Tasks({
                        content: body.content,
                        timestamp: Number(body.timestamp),
                        isImportant: body.important,
                    }).save();
                    res.send(user._id);
                }
                else if (reqType === "update") {
                    const body = {
                        content: req.body.content,
                        id: req.body.id,
                    };
                    user.tasks.id(body.id).content = body.content;
                    res.sendStatus(200);
                }
                else if (reqType === "important") {
                    const taskId = req.body.id;
                    user.tasks.id(taskId).isImportant = !user.tasks.id(taskId).isImportant;
                    res.sendStatus(200);
                }
                user.save();
            }
        });
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
    .get(async (req, res, next) => {
    try {
        const history = await models.Tasks.find({});
        res.render("history.ejs", { tasks: history });
    }
    catch (error) {
        serverError(res, error);
    }
})
    .delete((req, res, next) => {
    try {
        models.Tasks.deleteMany({}, (err) => {
            if (err)
                throw err;
        });
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
let adminPassed = false;
app
    .route("/adminLogin")
    .get((req, res, next) => {
    if (decodeURI(String(req.query.pass)) === "Warek20")
        adminPassed = true;
    res.redirect("/admin");
});
app
    .route("/admin")
    .get((req, res, next) => {
    if (adminPassed) {
        res.render("admin.ejs", {});
        adminPassed = false;
    }
    else
        res.redirect("/login");
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
