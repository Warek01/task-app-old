// V 1.0
interface HTMLElement {
   // Old text content for task editing
   oldContent?: string,
   apply?(): void
}

interface Task {
   content: string;
   element: JQuery;
   timestamp: number;
}
class Task implements Task {
   public content: string;
   
   constructor(content: string, public timestamp: number = Date.now(), isImportant: boolean = false) {

      let task: JQuery = $("<div>", {
            "class": "task"
         }),
         taskTimestamp: JQuery = $("<div>", {
            html: `${Task.getDay(new Date(this.timestamp).getDay())} ${new Date(this.timestamp).getDate()} 
               ${Task.getMonth(new Date(this.timestamp).getMonth())} ${new Date(this.timestamp).getFullYear()}
               ${new Date(this.timestamp).getHours()}:${new Date(this.timestamp).getMinutes()}`,
            "class": "timestamp"
         }),
         taskContent: JQuery = $("<p>", {
            html: content.trim(),
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
         }),
         markBtn: JQuery = $("<button>", {
            html: "Mark as important",
            "class": "mark"
         });

      // Task delete logic
      deleteBtn.click(function(event): void {
         /** Index of given task in main-content */
         const index: number = Task.getTaskIndex(this.parentElement);

            fetch(`/users/${userID}?index=${index}`, {
               method: "DELETE"
            }).then(res => {
               if (res.ok)
                  showModalWindow("ok");
               else
                  showModalWindow("error");
            });

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

      // Task copy button
      copyBtn.click(function(event): void {
         let range = document.createRange();
         range.selectNode($(this).parent().find("p").get(0));
         window.getSelection().removeAllRanges();
         window.getSelection().addRange(range);
         document.execCommand("copy");
         window.getSelection().removeAllRanges();

         showModalWindow("ok");
      });

      // Task edit button
      editBtn.click(function(event): void {
         let content: JQuery = $(this).parent().find("p.content");
         content.attr("contenteditable", "true").trigger("focus").css("color", "#f7d794");
         this.oldContent = content.text();
      });

      // Set "contenteditable" attribute to false if it was true
      // when losing focus, and sending an text update request to 
      // given task on server
      taskContent.on({
         focusout: function(event): void {
            if (Boolean($(this).attr("contenteditable"))) {
               $(this).removeAttr("contenteditable").css("color", colorSetting.currentTextCol);

               // If the task content hasn't changed
               /* if ($(this).text() !== this.oldContent)
                  return; */

               try {
                  /** Index of given task in main-content */
                  const index: number = Task.getTaskIndex(this.parentElement);
                  console.log(index)

                  fetch(`/users/${userID}`, {
                     method: "POST",
                     headers: {
                        "Content-Type": "application/json",
                        "_meta": "update"
                     },
                     body: JSON.stringify({
                        index: index,
                        content: $(this).parent().find("p.content").text().trim()
                     })
                  }).then(res => {
                     if (res.ok)
                        showModalWindow("ok");
                     else
                        showModalWindow("error");
                  });

               } catch(error) {
                  console.warn(error);
               }
            }
         }, keydown: function(event): void {
            if (event.key === "Enter")
               $(this).trigger("focusout");
         }
      });
      
      // "Mark as important" button
      markBtn.click(function(event): void {
         const parent: JQuery = $(this).parent();
         const index: number = Task.getTaskIndex(this.parentElement);

         // if not important
         parent.css("transition", "background-color 300ms ease");
         if (!$(this).hasClass("active")) {
            parent.addClass("active");
            $(this).text("Mark as default").addClass("active");

         } else {
            parent.removeClass("active");
            $(this).text("Mark as important").removeClass("active");
         }
         
         setTimeout(() => {
            parent.css("transition", "background-color 0s");
         }, 300);

         fetch(`/users/${userID}`, {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             _meta: "important",
           },
           body: JSON.stringify({ index: index }),
         });
      });
      
      taskContent.css("color", colorSetting.currentTextCol);
      task.append(taskContent, taskTimestamp, markBtn, editBtn, copyBtn, deleteBtn);
      main_content.append(task);

      this.content = content;
      this.element = task;
   }

   // Task jquery css
   css(prop: string, value: string | number | null = null): this {
      value? this.element.css(prop, value) : this.element.css(prop); 
      return this;
   } 

   /**
    * @param task task element to track
    * @returns index of given task in main container
    */
   static getTaskIndex(task: HTMLElement | JQuery): number {
      let index = 0;
      for (let em of main_content.children(".task")) {
         if ($(em).text() === $(task).text())
            break;
         index++;
      }
      return index;
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
