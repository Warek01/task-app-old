const 
body: JQuery = $("body"),
   options: JQuery = $("#options"),
   banner_help: JQuery = $("#banner_help");

   const bg_colors: string[] = ["#1abc9c", "#27ae60", "#2980b9", "#8e44ad", 
   "#2c3e50", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"],
   text_colors: string[] = [];
   
let colorSetting = {
   originalBg: body.css("background-color"),
   currentBg: body.css("background-color"),
   bgIndex: 0,
   originalTextCol: body.css("color"),
   currentTextCol: body.css("color"),
   textIndex: 0
}

options.find(".help").click(function(event): void {
   banner_help.css("display") === "none"?
      banner_help.show("fast") : null;
});

options.find(".bgc").click(function(event): void {
   if (colorSetting.currentBg === colorSetting.originalBg) {
      body.css("background-color", bg_colors[0]);
      colorSetting.currentBg = bg_colors[0];

   } else if (colorSetting.currentBg in bg_colors) {
      colorSetting.bgIndex++;
      body.css("background-color", bg_colors[colorSetting.bgIndex]);
      colorSetting.currentBg = bg_colors[colorSetting.bgIndex];

   }
});

options.find(".textc").click(function(event): void {

});

banner_help.find("#close-btn").click(function(event): void {
   $(this).parent().hide("fast");
});


interface _Task {
   content: string;
   timestamp: number;
}

class Task implements _Task {
   public content: string;
   public timestamp: number = Date.now();

   constructor(content: string) {
      this.content = content;
   }
}