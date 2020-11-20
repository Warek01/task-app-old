import express, { Response, Request, NextFunction } from "express";
import chalk from "chalk";
import fs from "fs";
import cors from "cors";
import path from "path";
import ejs from "ejs";
import mongoose from "mongoose";
import * as models from "./models";
import process from "process";

type Document = mongoose.Document | mongoose.Document[] | null;

// Connecting to MongoDB
mongoose.connect("mongodb://localhost:27017/TODO", {
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

nodeArgs();
app.use(cors(), express.static(__dirname));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req: Request, res: Response, next: NextFunction): void => {
  (req as any).redirected = true;
  res.redirect("/login");
});

//       /* /USERS/USERNAME */ ---------------
app
  .route("/users/:userName")
  .get((req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.params.userName) {
        res.redirect("/404");
        return;
      }

      const userName: string = req.params.userName;

      if (userName === "admin") res.redirect("/admin");

      models.Users.exists(
        { userName: userName },
        async (err: Error, exists: boolean): Promise<any> => {
          if (err) throw err;
          if (exists) {
            // Get user object
            let user: any = (await models.Users.findOne({
              userName: userName,
            }))!.toObject();

            res.render("index", {
              tasks: user.tasks,
              userName: user.userName,
              newUser: false,
              userID: user._id,
              colorIndex: user.colorIndex,
              bgIndex: user.backgroundColorIndex,
            });
          } else {
            let usr: mongoose.Document = new models.Users({
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
        }
      );
    } catch (error) {
      serverError(res, error);
      return;
    }
  })
  // Task posts/updates request
  .post(
    express.json({ strict: true }),
    (req: Request, res: Response, next: NextFunction): void => {
      try {
        const userName: string = req.params.userName,
          reqType: string = req.header("_meta") || "";
        console.log(req.query);

        models.Users.exists(
          { userName: userName },
          async (err: Error, exists: boolean): Promise<any> => {
            if (err) throw err;
            if (exists) {
              let user: Document = await models.Users.findOne({
                userName: userName,
              });

              if (req.query.color) {
                (user as any).colorIndex = Number(req.query.color);
                user!.save();
                return;
              } else if (req.query.bg) {
                (user as any).backgroundColorIndex = Number(req.query.bg);
                user!.save();
                return;
              }

              // Post task
              if (reqType === "post") {
                let body: any = req.body;

                (user as any).tasks.push({
                  content: body.content,
                  timestamp: Number(body.timestamp),
                  isImportant: body.important,
                });

                // Append new task to tasks history collection
                new models.Tasks({
                  content: body.content,
                  timestamp: Number(body.timestamp),
                  isImportant: body.important,
                }).save();

                res.send(user!._id);
              }
              // Task content update logic
              else if (reqType === "update") {
                const body: any = {
                  content: req.body.content,
                  id: req.body.id,
                };

                (user as any).tasks.id(body.id).content = body.content;
                res.sendStatus(200);
              }
              // Make a task importand/default
              else if (reqType === "important") {
                const taskId: string = req.body.id;

                (user as any).tasks.id(
                  taskId
                ).isImportant = !(user as any).tasks.id(taskId).isImportant;

                res.sendStatus(200);
              }

              user!.save();
            }
          }
        );
      } catch (error) {
        serverError(res, error);
        return;
      }
    }
  )
  // Task deleting logic
  .delete((req: Request, res: Response, next: NextFunction): void => {
    try {
      const userName: string = req.params.userName,
        taskId: string = req.query.id!.toString() || "";
      console.log(taskId);

      models.Users.exists(
        { userName: userName },
        async (err: Error, exists: boolean): Promise<any> => {
          if (err) throw err;
          if (exists) {
            const user: Document = await models.Users.findOne({
              userName: userName,
            });

            (user as any).tasks.id(taskId).remove();
            user!.save();

            res.sendStatus(200);
          }
        }
      );
    } catch (error) {
      serverError(res, error);
      return;
    }
  });
// -------------------------- /* /USERS/USERID */

//       /* /HISTORY */ ---------------
app
  .route("/history")
  .get(
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      try {
        const history: Document = await models.Tasks.find({});
        res.render("history.ejs", { tasks: history });
      } catch (error) {
        serverError(res, error);
      }
    }
  )
  .delete((req: Request, res: Response, next: NextFunction): void => {
    try {
      models.Tasks.deleteMany({}, (err: Error): void => {
        if (err) throw err;
      });
    } catch (error) {
      serverError(res, error);
      return;
    }
    res.sendStatus(200);
  });

// -------------------------- /* /HISTORY */

//       /* /LOGIN */ ---------------
app
  .route("/login")
  .get((req: Request, res: Response, next: NextFunction): void => {
    res.render("login", {});
  });
// -------------------------- /* /LOGIN */

//       /* /NOUSER */ ---------------
app
  .route("/nouser")
  .get((req: Request, res: Response, next: NextFunction): void => {
    res.sendFile(path.resolve(__dirname, "../index.html"));
  });
// -------------------------- /* /NOUSER */

//       /* /404 */ ---------------
app.get("/404", (req: Request, res: Response, next: NextFunction): void => {
  const reqPath: string = decodeURI((req.query.p || "").toString());
  res.render("not-found.ejs", { path: reqPath });
});
// -------------------------- /* /404 */

//       /* /ADMIN */ ---------------
app
  .route("/admin")
  .get(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    res.render("admin.ejs", {

    });
  });
// -------------------------- /* /ADMIN */

app.listen(nodeArgs().port, nodeArgs().port_log);

/* Events */

mongoose.connection.once("open", (): void => {
  console.log(chalk.hex("#74b9ff")("Database connected!"));
});

mongoose.connection.once("error", (err: Error): void => {
  console.log(`Error on Database: ${chalk.hex("#d63031")(err)}`);
  // Shut down program
  /* process.exit(); */
});

/* Functions */

// Console logger
function log(req: any, res: any, next: any): void {
  console.log(
    chalk.hex("#74b9ff")("Request got for "),
    chalk.hex("#A3CB38")(req.url)
  );
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
function nodeArgs(this: any): { port: string; port_log(): void } {
  const argv = require("optimist").argv;
  // -d or --debug
  if (argv.d || argv.debug) {
    argv.log = true;
    argv.port = 8000;
  }

  if (argv.r || argv.redirect) app
    .get(
      "/users",
      (req: Request, res: Response, next: NextFunction): void => {
        res.redirect("/login");
      }
    )
    .get("/user", (req: Request, res: Response, next: NextFunction): void => {
      res.redirect("/login");
    });

  // -l or --log
  if (argv.l || argv.log) app.use(log);

  // -p [port] or --port [port]
  return {
    port: argv.port || argv.p || 8000,
    port_log(): void {
      console.log(`"${path.parse(__filename).base}" is listening to port ${chalk.hex("#ED4C67")(argv.port || argv.p || 8000)}`);
    },
  };
}

/**
 * Logs in console whenever an error on server side
 * occurs and sends response with status 500
 * "Internal Server Error"
 * @param res Response object of current callback
 * @param error Error object from "try catch" block
 * */
function serverError(res: any, error: string): void {
  console.error(chalk.hex("#e74c3c")("Error: "), chalk.hex("#ff7979")(error));
  res.sendStatus(500);
}

// Not Found page
// Last in code as if it is being handled (path or file exists)
// it won't be called
app.get("*", (req: Request, res: Response, next: NextFunction): void => {
  // res.render("not-found.ejs", { path: req.path });
  res.redirect(`/404?p=${encodeURI(req.path)}`);
});
