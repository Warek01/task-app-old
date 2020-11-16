const body: JQuery = $("body")!,
  options: JQuery = $("#options")!,
  banner_help: JQuery = $("#banner_help")!,
  banner_empty: JQuery = $("#banner-empty")!,
  main_content: JQuery = $(".main-content")!,
  modal: JQuery = $(".modal")!,
  inputDiv: JQuery = $("#input")!,
  inputElement: JQuery = inputDiv.find("input")!,
  inputCopy: JQuery = $("#input-copy")!;

const bg_colors: string[] = [
    "#1abc9c",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#2c3e50",
    "#f39c12",
    "#d35400",
    "#c0392b",
    "#bdc3c7",
    "#7f8c8d",
  ],
  text_colors: string[] = [
    "#1B1464",
    "#6F1E51",
    "#353b48",
    "#2bcbba",
    "#26de81",
    "#f7d794",
  ];

let tempTextElements: JQuery = $(".text-col"),
  colorSetting = {
    originalBg: body.css("background-color"),
    currentBg: body.css("background-color"),
    bgIndex: 0,
    originalTextCol: tempTextElements.eq(0).css("color"),
    currentTextCol: tempTextElements.eq(0).css("color"),
    textIndex: 0,

    reset(): void {
      body.css("background-color", this.originalBg);
      tempTextElements.css("color", this.originalTextCol);
      $("#textcol").css("background-color", this.originalTextCol);
      $("#bgcol").css("background-color", this.originalBg);
      $(".circle-bgc").css("background-color", this.originalBg);
      this.currentBg = this.originalBg;
      this.currentTextCol = this.originalTextCol;
      this.bgIndex = 0;
      this.textIndex = 0;
    },
  };

// Global variables
declare const userID: string;
/** Whether user is newly created or not */
declare const newUser: boolean;
// declare class Task {
//    content: string;
//    timestamp: number;
//    element: HTMLElement;
//    isImportant?: boolean;
//    constructor(content: string, timestamp?: number);
// };

if (newUser) showModalWindow("info", "Welcome!");

// Help banner toggler
options.find(".help").click(function (event): void {
  if (banner_help.css("display") === "none") banner_help.show("fast");
  options.css("pointer-events", "none");
});

// Background color change button
options.find(".bgc").click(function (event): void {
  if (colorSetting.currentBg === colorSetting.originalBg) {
    body.css("background-color", bg_colors[0]);
    colorSetting.currentBg = bg_colors[0];
  } else if (bg_colors.has(colorSetting.currentBg)) {
    if (colorSetting.currentBg === bg_colors[bg_colors.length - 1]) {
      body.css("background-color", colorSetting.originalBg);
      colorSetting.bgIndex = 0;
      colorSetting.currentBg = colorSetting.originalBg;
      $("#bgcol").css("background-color", colorSetting.currentBg);
      $(".circle-bgc").css("background-color", colorSetting.currentBg);
      return;
    }

    colorSetting.bgIndex++;
    body.css("background-color", bg_colors[colorSetting.bgIndex]);
    colorSetting.currentBg = bg_colors[colorSetting.bgIndex];
    $(".circle-bgc").css("background-color", bg_colors[colorSetting.bgIndex]);
  }

  $(".circle-bgc").css("background-color", colorSetting.currentBg);
  $("#bgcol").css("background-color", colorSetting.currentBg);
});

// Text color change button
options.find(".textc").click(function (event): void {
  if (colorSetting.currentTextCol === colorSetting.originalTextCol) {
    tempTextElements.css("color", text_colors[0]);
    colorSetting.currentTextCol = text_colors[0];
  } else if (text_colors.has(colorSetting.currentTextCol)) {
    if (colorSetting.currentTextCol === text_colors[text_colors.length - 1]) {
      tempTextElements.css("color", colorSetting.originalTextCol);
      colorSetting.textIndex = 0;
      colorSetting.currentTextCol = colorSetting.originalTextCol;
      $("#textcol").css("background-color", colorSetting.currentTextCol);
      return;
    }

    colorSetting.textIndex++;
    tempTextElements.css("color", text_colors[colorSetting.textIndex]);
    colorSetting.currentTextCol = text_colors[colorSetting.textIndex];
  }

  $("#textcol").css("background-color", colorSetting.currentTextCol);
});

// Reset colors
options.find(".reset").click(function (event): void {
  let keyEvent: JQuery.Event & object = $.Event("keydown");
  keyEvent.key = "F1";
  $(window).trigger(keyEvent);
});

// Help banner close button
banner_help.find("#close-btn").click(function (event): void {
  $(this).parent().hide("fast");
  options.css("pointer-events", "all");
});

// Main input extention when focused
inputDiv
  .find(".wrapper")
  .focusin(function (event): void {
    $(this).find("input[type=text]").css("width", 625);
    $(this).css("width", 700);
  })
  .focusout(function (event): void {
    $(this).find("input[type=text]").css("width", 370);
    $(this).css("width", 470);
  });

// Insert Button
inputDiv.find("#insert").click(function (e): void {
  console.log("Press!");
  let keyEvent: JQuery.Event & object = $.Event("keydown");
  keyEvent.key = "Enter";
  $(window).trigger(keyEvent);
});

// Key tracking
$(window).keydown(function (event?): void {
  switch (event.key) {
    case "F1":
      // Reset colors
      event.preventDefault();
      colorSetting.reset();
      break;
    case "Enter":
      // Post the task from input
      postTask();
      break;
    case "Escape":
      // Close help banner
      if (banner_help.css("display") !== "none")
        banner_help.find("#close-btn").trigger("click");
      break;
    case "Delete":
      $(".task").first().find("button.delete").trigger("click");
      break;
  }
});

interface Array<T> {
  has(element: any): boolean;
}
Array.prototype.has = function (element: any): boolean {
  for (let em of this) {
    if (em === element) return true;
  }

  return false;
};

function postTask(
  content: string | null = null,
  timestamp: number | string | null = null,
  isImportant: boolean = false,
  id: string | null = null
) {
  // Text field
  let textInput: JQuery = inputDiv.find("input"),
    task: Task = new Task("");
  if (!content && !timestamp) {
    if (
      (textInput.is(":focus") || $("#insert").is(":focus")) &&
      textInput.val()!.toString().trim() !== ""
    ) {
      if (banner_empty.css("display") !== "none") {
        banner_empty.css({
          top: "55vh",
          filter: "opacity(0)",
        });
        setTimeout(() => {
          banner_empty.hide();
        }, 500);
      }
      task = new Task(String(textInput.val()).trim());
      textInput.val("");
    }

    // Send the new task to server
    fetch(`/users/${userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        _meta: "post",
      },
      body: JSON.stringify({
        content: task.content,
        timestamp: task.timestamp,
      }),
    })
      .then((res) => res.text())
      .then((res) => {
        $(task.element).attr("data-id", res);
      });
  } else {
    // If task is present (received from the server)
    // Only make it, no post and send
    let task: Task = new Task(content!, Number(timestamp)!, isImportant);

    if (id) $(task.element).attr("data-id", id);

    if (isImportant)
      $(task.element)
        .addClass("active")
        .find("button.mark")
        .text("Mark as default")
        .addClass("active");
  }

  tempTextElements = $(".text-col");
}

type modalType = "ok" | "error" | "info";

function showModalWindow(type: modalType = "ok", text: string = ""): void {
  let textContent: JQuery = $(".modal .content");

  switch (type) {
    case "ok":
      modal.css("background-color", "#4cd137cf");
      textContent.text("done!");
      break;
    case "error":
      modal.css("background-color", "#e84118cf");
      textContent.text("error!");
      break;
    case "info":
      modal.css("background-color", "#535c68ff");
      textContent.text(text);

      modal.css("transition", "filter 75ms linear");
      modal.css("filter", "opacity(1)");
      setTimeout(() => {
        modal.css("filter", "opacity(0)");
        modal.css("transition", "filter .3s ease");
      }, 2250);
      return;
  }

  modal.css("transition", "filter 75ms linear");
  modal.css("filter", "opacity(1)");
  setTimeout(() => {
    modal.css("filter", "opacity(0)");
    modal.css("transition", "filter .3s ease");
  }, 1250);
}
