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
    "#bdc3c7",
    "#1abc9c",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#2c3e50",
    "#f39c12",
    "#d35400",
    "#c0392b",
    "#7f8c8d",
  ],
  text_colors: string[] = [
    "#fff",
    "#1B1464",
    "#6F1E51",
    "#353b48",
    "#2bcbba",
    "#26de81",
    "#f7d794",
  ];

let tempTextElements: JQuery = $(".text-col"),
  colorSetting = {
    currentText: 0,
    currentBg: 0,

    reset(): void {
      this.currentBg = bg_colors.length - 1;
      this.currentText = text_colors.length - 1;
      options.find(".bgc").trigger("click");
      options.find(".textc").trigger("click");
    },
  };

// Global variables
declare const userID: string;
/** Whether user is newly created or not */
declare const newUser: boolean;

if (newUser) showModalWindow("info", "Welcome!");

// Colors setup
declare const SvColor: number;
declare const SvBgColor: number;
if (
  SvColor > 0 &&
  SvBgColor > 0 &&
  SvColor <= text_colors.length &&
  SvBgColor <= bg_colors.length
) {
   // Change text color to the server one
   colorSetting.currentText = SvColor;
   tempTextElements.css("color", text_colors[colorSetting.currentText]);
   $("#textcol").css("background-color", text_colors[colorSetting.currentText]);
   // And background ones
   colorSetting.currentBg = SvBgColor;
   body.css("background-color", bg_colors[colorSetting.currentBg]);
   $(".circle-bgc").css("background-color", bg_colors[colorSetting.currentBg]);
   $("#bgcol").css("background-color", bg_colors[colorSetting.currentBg]);
}

// Help banner toggler
options.find(".help").click(function (event): void {
  if (banner_help.css("display") === "none") banner_help.show("fast");
  options.css("pointer-events", "none");
});

// Background color change button
options.find(".bgc").click(function (event): void {
  if (colorSetting.currentBg === bg_colors.length - 1) {
    body.css("background-color", bg_colors[0]);
    colorSetting.currentBg = 0;
  } else {
    colorSetting.currentBg++;
    body.css("background-color", bg_colors[colorSetting.currentBg]);
  }

  $(".circle-bgc").css("background-color", bg_colors[colorSetting.currentBg]);
  $("#bgcol").css("background-color", bg_colors[colorSetting.currentBg]);

  fetch(`/users/${userID}?bg=${colorSetting.currentBg}`, {
   method: "POST",
   body: ""
});
});

// Text color change button
options.find(".textc").click(function (event): void {
  if (colorSetting.currentText === text_colors.length - 1) {
    tempTextElements.css("color", text_colors[0]);
    colorSetting.currentText = 0;
  } else {
    colorSetting.currentText++;
    tempTextElements.css("color", text_colors[colorSetting.currentText]);
  }

  $("#textcol").css("background-color", text_colors[colorSetting.currentText]);

  fetch(`/users/${userID}?color=${colorSetting.currentText}`, {
     method: "POST",
     body: ""
  });
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
    task: Task;
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
        content: task!.content,
        timestamp: task!.timestamp,
      }),
    })
      .then((res) => res.text())
      .then((res) => {
        $(task!.element).attr("data-id", res);
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
