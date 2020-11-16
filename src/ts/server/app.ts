import express, { Response, Request, NextFunction } from "express";
import chalk from "chalk";
import fs from "fs";
import cors from "cors";
import path from "path";
import ejs from "ejs";
import mongoose from "mongoose";
import * as models from "./models";
import process from "process";

type Document = mongoose.Document | null;

// Connecting to MongoDB
mongoose.connect("mongodb://localhost:27017/TODO", {
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express(),
  task_path: string = path.join(__dirname, "tasks.json"),
  task_history_path: string = path.join(__dirname, "tasks_history.json");

/** Tasks database object */
let taskDB = JSON.parse(fs.readFileSync(task_path).toString()) || {};

nodeArgs();
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req: Request, res: Response, next: NextFunction): void => {
  (req as any).redirected = true;
  res.redirect("/login");
});

// app.get("/users", (req: Request, res: Response, next: NextFunction): void => {
//    res.redirect("/login");
// }).get("/user", (req: Request, res: Response, next: NextFunction): void => {
//    res.redirect("/login");
// });

//       /* /USERS/USERID */ ---------------
app
  .route("/users/:userID")
  .get((req: Request, res: Response, next: NextFunction): void => {
    try {
      let userName: string = req.params.userID.toLowerCase();

      models.Users.exists(
        { userName: userName },
        async (err: Error, exists: boolean): Promise<any> => {
          if (err) throw err;
          if (exists) {
            let user: any = (await models.Users.findOne({
              userName: userName,
            }))!.toObject();

            res.render("index", {
              tasks: user.tasks,
              userName: user.userName,
              newUser: false,
              userID: user._id,
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
  // All post/update request
  .post(
    express.json({ strict: true }),
    (req: Request, res: Response, next: NextFunction): void => {
      try {
        let userID: string = req.params.userID.toLowerCase(),
          reqType: string = req.header("_meta")!;

        if (reqType === "post") {
          // Get request body (task)
          let body: any = req.body;

          models.Users.exists(
            { userName: userID },
            async (err: Error, exists: boolean): Promise<any> => {
              if (err) throw err;
              if (exists) {
                let user: Document = await models.Users.findOneAndUpdate(
                  { userName: userID },
                  {
                    // Append given task to tasks array
                    $addToSet: {
                      tasks: {
                        content: body.content,
                        timestamp: Number(body.timestamp),
                        isImportant: body.important,
                      },
                    },
                  }
                );

                res.send(user!._id);
              }
            }
          );
        }
        // Task content update logic
        else if (reqType === "update") {
          let body = {
            index: req.body.index!,
            content: req.body.content!,
          };

          // Update required task content to gotten one
          taskDB[userID][body.index!].content = body.content;
          fs.writeFileSync(task_path, JSON.stringify(taskDB, null, 2));
        }
        // Make a task importand/default
        else if (reqType === "important") {
          try {
            const index: number = req.body.index,
              taskIsImportant: boolean =
                taskDB[userID][req.body.index].important;

            if (!taskIsImportant)
              taskDB[userID][req.body.index].important = true;
            else taskDB[userID][req.body.index].important = false;
          } catch (error) {
            serverError(res, error);
            return;
          }
        }

        // Overwrite static memory file with local memory tasks array
        fs.writeFileSync(task_path, JSON.stringify(taskDB, null, 2));
      } catch (error) {
        serverError(res, error);
        return;
      }
    }
  )
  // Task deleting logic
  .delete((req: Request, res: Response, next: NextFunction): void => {
    try {
      let userID: string = req.params.userID.toLowerCase(),
        index: number = Number(req.query.index);

      // Remove item from array
      taskDB[userID].splice(index, 1);
      // Overwrite static memory file with local memory tasks array
      fs.writeFileSync(task_path, JSON.stringify(taskDB, null, 2));
    } catch (error) {
      serverError(res, error);
      return;
    }
    res.sendStatus(200);
  });
// -------------------------- /* /USERS/USERID */

//       /* /HISTORY */ ---------------
app
  .route("/history")
  .get((req: Request, res: Response, next: NextFunction): void => {
    try {
      fs.readFile(task_history_path, { encoding: "utf-8" }, (err, data) => {
        res.render("history", { tasks: JSON.parse(data) });
        if (err) throw err;
      });
    } catch (error) {
      serverError(res, error);
    }
  })
  .delete((req: Request, res: Response, next: NextFunction): void => {
    try {
      fs.writeFileSync(task_history_path, "[\n\n]");
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

app.listen(nodeArgs().port, nodeArgs().port_log);
// app.use(express.static(path.resolve(__dirname, "../")));
app.use(express.static(__dirname));

// Not Found page
app.use((req: Request, res: Response, next: NextFunction): void => {
  res.render("not-found.ejs", { path: req.path });
});

// --------------------------

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

  if (argv.r || argv.redirect) {
    app
      .get(
        "/users",
        (req: Request, res: Response, next: NextFunction): void => {
          res.redirect("/login");
        }
      )
      .get("/user", (req: Request, res: Response, next: NextFunction): void => {
        res.redirect("/login");
      });
  }

  // -l or --log
  if (argv.l || argv.log) app.use(log);

  // -p [port] or --port [port]
  return {
    port: argv.port || argv.p ? argv.port || argv.p : 8000,
    port_log(): void {
      console.log(
        '"' +
          path.parse(__filename).base +
          '"' +
          " is listening to port " +
          chalk.hex("#ED4C67")(argv.port || argv.p ? argv.port || argv.p : 8000)
      );
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
