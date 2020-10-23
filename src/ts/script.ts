const 
body: JQuery = $("body"),
options: JQuery = $("#options"),
banner_help: JQuery = $("#banner_help"),
banner_empty: JQuery = $("#banner-empty"),
main_content: JQuery = $(".main-content"),
input: JQuery = $("#input");

const bg_colors: string[] = [ "#1abc9c", "#27ae60", "#2980b9", "#8e44ad", 
"#2c3e50", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d" ],
text_colors: string[] = [ "#1B1464", "#6F1E51", "#353b48", "#2bcbba", "#26de81", "#f7d794" ];

let tempTextElements: JQuery = $(".text-col");
let colorSetting = {
   originalBg: body.css("background-color"),
   currentBg: body.css("background-color"),
   bgIndex: 0,
   originalTextCol: tempTextElements.eq(0).css("color"),
   currentTextCol:  tempTextElements.eq(0).css("color"),
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
   }
};

// Help banner toggler
options.find(".help").click(function(event): void {
   if (banner_help.css("display") === "none")
      banner_help.show("fast");
   options.css("pointer-events", "none");
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
options.find(".textc").click(function(event): void {
   if (colorSetting.currentTextCol === colorSetting.originalTextCol) {
      tempTextElements.css("color", text_colors[0]);
      colorSetting.currentTextCol = text_colors[0];

   } else if (text_colors.has(colorSetting.currentTextCol)) {
      if (colorSetting.currentTextCol === text_colors[text_colors.length -1]) {
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
options.find(".reset").click(function(event): void {
   let keyEvent: JQuery.Event & object = $.Event("keydown");
   keyEvent.key = "F1";
   $(window).trigger(keyEvent);
});

// Help banner close button
banner_help.find("#close-btn").click(function(event): void {
   $(this).parent().hide("fast");
   options.css("pointer-events", "all");
});

// Main input extention when focused
input.find(".wrapper").focusin(function(event): void {
   $(this).find("input[type=text]").css("width", 625);
   $(this).css("width", 700);
}).focusout(function(event): void {
   $(this).find("input[type=text]").css("width", 370);
   $(this).css("width", 470);
});

// Insert Button
input.find("#insert").click(function(e): void {
   console.log("Press!");
   let keyEvent: JQuery.Event & object = $.Event("keydown");
   keyEvent.key = "Enter";
   $(window).trigger(keyEvent);
});

// Key tracking
$(window).keydown(function(event?): void {
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


interface Task {
   content: string;
   element: JQuery;
   timestamp: number;
}

class Task implements Task {
   public content: string;
   
   constructor(content: string, public timestamp: number = Date.now()) {

      let task: JQuery = $("<div>", {
            "class": "task text-col"
         }),
         taskTimestamp: JQuery = $("<div>", {
            html: `${Task.getDay(new Date(this.timestamp).getDay())} ${new Date(this.timestamp).getDate()} 
               ${Task.getMonth(new Date(this.timestamp).getMonth())} ${new Date(this.timestamp).getFullYear()}
               ${new Date(this.timestamp).getHours()}:${new Date(this.timestamp).getMinutes()}`,
            "class": "timestamp"
         }),
         taskContent: JQuery = $("<p>", {
            html: "&nbsp; " + content,
            "class": "content text-col"
         }),
         deleteBtn: JQuery = $("<button>", {
            html: "Delete",
            "class": "delete"
         }),
         editBtn: JQuery = $("<button>", {
            html: "Edit",
            "class": "edit"
         }),
         copyBtn: JQuery = $("<button>", {
            html: "Copy text",
            "class": "copy"
         });

      // Task delete logic
      deleteBtn.click(function(event): void {
         $(this).parent().hide("slow", () => {
            if (main_content.find(".task").length <= 1) {
               if (banner_empty.css("display") === "none") 
                  banner_empty.show("fast");

               $(this).parent().remove();
               banner_empty.css({
                  "filter": "opacity(1)",
                  "top": "45vh"
               });
            } else 
               $(this).parent().remove();
         });
      });

      copyBtn.click(function(event): void {
         let input = $("<input type=\"text\">", {
            type: "text",
            value: 
         })
         console.log(input)
         document.execCommand("copy");
      });
         
      taskContent.css("color", colorSetting.currentTextCol);
      task.append(taskContent, taskTimestamp, deleteBtn, editBtn, copyBtn);
      main_content.append(task);

      this.content = content;
      this.element = task;
   }

   // Task jquery css
   css(prop: string, value: string | number | null = null): this {
      value? this.element.css(prop, value) : this.element.css(prop); 
      return this;
   } 

   static getDay(date: number): string {
      switch(date) {
         case 1: return "Mon";
         case 2: return "Tue";
         case 3: return "Wed";
         case 4: return "Thu";
         case 5: return "Fri";
         case 6: return "Sat";
         case 7: return "Sun";
      }
   }

   static getMonth(month: number): string {
      switch(month) {
         case 0: return "Jan";
         case 1: return "Feb";
         case 2: return "Mar";
         case 3: return "Apr";
         case 4: return "May";
         case 5: return "Jun";
         case 6: return "Jul";
         case 7: return "Aug";
         case 8: return "Sep";
         case 9: return "Oct";
         case 10: return "Nov";
         case 11: return "Dec";
      }
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

function postTask() {
   // Text field
   let textInput: JQuery = input.find("input");
   if ((textInput.is(":focus") || $("#insert").is(":focus")) && String(textInput.val()).trim() !== "") {
      if (banner_empty.css("display") !== "none") {
         banner_empty.css({
            "top": "55vh",
            "filter": "opacity(0)"
         });
         setTimeout(() => {
            banner_empty.hide();
         }, 500);
      }
      new Task(String(textInput.val()));
      textInput.val("");
   }
   tempTextElements = $(".text-col");
}
