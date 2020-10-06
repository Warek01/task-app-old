"use strict";
const body = $("body"), options = $("#options"), banner_help = $("#banner_help");
const bg_colors = ["#1abc9c", "#27ae60", "#2980b9", "#8e44ad",
    "#2c3e50", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"], text_colors = [""];
let colorSetting = {
    originalBg: body.css("background-color"),
    currentBg: body.css("background-color"),
    bgIndex: 0,
    originalTextCol: body.css("color"),
    currentTextCol: body.css("color"),
    textIndex: 0
};
options.find(".help").click(function (event) {
    if (banner_help.css("display") === "none")
        banner_help.show("fast");
});
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
            return;
        }
        colorSetting.bgIndex++;
        body.css("background-color", bg_colors[colorSetting.bgIndex]);
        colorSetting.currentBg = bg_colors[colorSetting.bgIndex];
    }
});
options.find(".textc").click(function (event) {
});
banner_help.find("#close-btn").click(function (event) {
    $(this).parent().hide("fast");
});
// interface JQuery {
//    click(event: any): void;
// }
$(window).click(function (event) {
    if (event.key.toLowerCase() === "F1") {
    }
});
class Task {
    constructor(content) {
        this.timestamp = Date.now();
        this.content = content;
    }
}
Array.prototype.has = function (element) {
    for (let em of this) {
        if (em === element)
            return true;
    }
    return false;
};
