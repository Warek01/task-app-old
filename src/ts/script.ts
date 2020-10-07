const 
   textElements: JQuery = $(".text-col"),
   body: JQuery = $("body"),
   options: JQuery = $("#options"),
   banner_help: JQuery = $("#banner_help"),
   input: JQuery = $("#input");

const bg_colors: string[] = [ "#1abc9c", "#27ae60", "#2980b9", "#8e44ad", 
   "#2c3e50", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d" ],
   text_colors: string[] = [ "#1B1464", "#6F1E51", "#353b48", "#2bcbba", "#26de81" ];
   
let colorSetting = {
   originalBg: body.css("background-color"),
   currentBg: body.css("background-color"),
   bgIndex: 0,
   originalTextCol: textElements.eq(0).css("color"),
   currentTextCol:  textElements.eq(0).css("color"),
   textIndex: 0,
   
   reset(): void {
      body.css("background-color", this.originalBg);
      textElements.css("color", this.originalTextCol);
      $("#textcol").css("background-color", colorSetting.originalTextCol);
      $("#bgcol").css("background-color", colorSetting.originalBg);
      this.currentBg = this.originalBg;
      this.currentTextCol = this.originalTextCol;
      this.bgIndex = 0;
      this.textIndex = 0;
   }
}

options.find(".help").click(function(event): void {
   if (banner_help.css("display") === "none")
      banner_help.show("fast");
});

// Background color change button
options.find(".bgc").click(function(event): void {
   if (colorSetting.currentBg === colorSetting.originalBg) {
      body.css("background-color", bg_colors[0]);
      colorSetting.currentBg = bg_colors[0];

   } else if (bg_colors.has(colorSetting.currentBg)) {
      if (colorSetting.currentBg === bg_colors[bg_colors.length -1]) {
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
options.find(".textc").click(function(event): void {
   if (colorSetting.currentTextCol === colorSetting.originalTextCol) {
      textElements.css("color", text_colors[0]);
      colorSetting.currentTextCol = text_colors[0];

   } else if (text_colors.has(colorSetting.currentTextCol)) {
      if (colorSetting.currentTextCol === text_colors[text_colors.length -1]) {
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
banner_help.find("#close-btn").click(function(event): void {
   $(this).parent().hide("fast");
});

// Key tracking
$(window).keydown(function(event?): void {
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



interface Task {
   content: string;
   timestamp: number;
}

class Task implements Task {
   public content: string;
   public timestamp: number = Date.now();

   constructor(content: string) {
      this.content = content;
   }
}

interface Array<T> {
   has(element: any): boolean;
}
Array.prototype.has = function(element: any): boolean {
   for (let em of this) {
      if (em === element)
         return true;
   }

   return false;
}