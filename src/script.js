"use strict";
const textElements = $(".text-col"), body = $("body"), options = $("#options"), banner_help = $("#banner_help"), input = $("#input");
const bg_colors = ["#1abc9c", "#27ae60", "#2980b9", "#8e44ad",
    "#2c3e50", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"], text_colors = ["#1B1464", "#6F1E51", "#353b48", "#2bcbba", "#26de81", "#f7d794"];
let colorSetting = {
    originalBg: body.css("background-color"),
    currentBg: body.css("background-color"),
    bgIndex: 0,
    originalTextCol: textElements.eq(0).css("color"),
    currentTextCol: textElements.eq(0).css("color"),
    textIndex: 0,
    reset() {
        body.css("background-color", this.originalBg);
        textElements.css("color", this.originalTextCol);
        $("#textcol").css("background-color", colorSetting.originalTextCol);
        $("#bgcol").css("background-color", colorSetting.originalBg);
        this.currentBg = this.originalBg;
        this.currentTextCol = this.originalTextCol;
        this.bgIndex = 0;
        this.textIndex = 0;
    }
};
// Help banner toggler
options.find(".help").click(function (event) {
    if (banner_help.css("display") === "none")
        banner_help.show("fast");
    options.css("pointer-events", "none");
});
// Background color change button
options.find(".bgc").click(function (event) {
    if (colorSetting.currentBg === colorSetting.originalBg) {
        body.css("background-color", bg_colors[0]);
        colorSetting.currentBg = bg_colors[0];
    }
    else if (bg_colors.has(colorSetting.currentBg)) {
        if (colorSetting.currentBg === bg_colors[bg_colors.length - 1]) {
            body.css("background-color", colorSetting.originalBg);
            colorSetting.bgIndex = 0;
            colorSetting.currentBg = colorSetting.originalBg;
            $("#bgcol").css("backgriund-color", colorSetting.currentBg);
            return;
        }
        colorSetting.bgIndex++;
        body.css("background-color", bg_colors[colorSetting.bgIndex]);
        colorSetting.currentBg = bg_colors[colorSetting.bgIndex];
    }
    $("#bgcol").css("background-color", colorSetting.currentBg);
});
// Text color change button
options.find(".textc").click(function (event) {
    if (colorSetting.currentTextCol === colorSetting.originalTextCol) {
        textElements.css("color", text_colors[0]);
        colorSetting.currentTextCol = text_colors[0];
    }
    else if (text_colors.has(colorSetting.currentTextCol)) {
        if (colorSetting.currentTextCol === text_colors[text_colors.length - 1]) {
            textElements.css("color", colorSetting.originalTextCol);
            colorSetting.textIndex = 0;
            colorSetting.currentTextCol = colorSetting.originalTextCol;
            $("#textcol").css("background-color", colorSetting.currentTextCol);
            return;
        }
        colorSetting.textIndex++;
        textElements.css("color", text_colors[colorSetting.textIndex]);
        colorSetting.currentTextCol = text_colors[colorSetting.textIndex];
    }
    $("#textcol").css("background-color", colorSetting.currentTextCol);
});
// Help banner close button
banner_help.find("#close-btn").click(function (event) {
    $(this).parent().hide("fast");
    options.css("pointer-events", "all");
});
// Key tracking
$(window).keydown(function (event) {
    switch (event.key) {
        case "F1":
            event.preventDefault();
            colorSetting.reset();
            break;
        case "Enter":
            console.log("Task appended!");
            break;
        case "Escape":
            if (banner_help.css("display") !== "none")
                banner_help.find("#close-btn").trigger("click");
            break;
    }
});
class Task {
    constructor(content) {
        this.timestamp = Date.now();
        let task = $("<div />", {
            "class": "task text-col"
        }), timestamp = $("<div />", {
            html: this.content,
            "class": "timestamp"
        }), deleteBtn = $("<button />", {
            html: "Delete",
            "class": "delete"
        });
        task.append(timestamp, deleteBtn);
    }
}
Array.prototype.has = function (element) {
    for (let em of this) {
        if (em === element)
            return true;
    }
    return false;
};
