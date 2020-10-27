"use strict";
class Task {
    constructor(content, timestamp = Date.now()) {
        this.timestamp = timestamp;
        let task = $("<div>", {
            "class": "task text-col"
        }), taskTimestamp = $("<div>", {
            html: `${Task.getDay(new Date(this.timestamp).getDay())} ${new Date(this.timestamp).getDate()} 
               ${Task.getMonth(new Date(this.timestamp).getMonth())} ${new Date(this.timestamp).getFullYear()}
               ${new Date(this.timestamp).getHours()}:${new Date(this.timestamp).getMinutes()}`,
            "class": "timestamp"
        }), taskContent = $("<p>", {
            html: content.trim(),
            "class": "content text-col"
        }), deleteBtn = $("<button>", {
            html: "Delete",
            "class": "delete"
        }), editBtn = $("<button>", {
            html: "Edit",
            "class": "edit"
        }), copyBtn = $("<button>", {
            html: "Copy text",
            "class": "copy"
        });
        // Task delete logic
        deleteBtn.click(function (event) {
            $(this).parent().hide("slow", () => {
                if (main_content.find(".task").length <= 1) {
                    if (banner_empty.css("display") === "none")
                        banner_empty.show("fast");
                    $(this).parent().remove();
                    banner_empty.css({
                        "filter": "opacity(1)",
                        "top": "45vh"
                    });
                }
                else
                    $(this).parent().remove();
            });
        });
        // Task copy button
        copyBtn.click(function (event) {
            let range = document.createRange();
            range.selectNode($(this).parent().find("p").get(0));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand("copy");
            window.getSelection().removeAllRanges();
            showModalWindow();
        });
        taskContent.css("color", colorSetting.currentTextCol);
        task.append(taskContent, taskTimestamp, deleteBtn, editBtn, copyBtn);
        main_content.append(task);
        this.content = content;
        this.element = task;
    }
    // Task jquery css
    css(prop, value = null) {
        value ? this.element.css(prop, value) : this.element.css(prop);
        return this;
    }
    static getDay(date) {
        switch (date) {
            case 1: return "Mon";
            case 2: return "Tue";
            case 3: return "Wed";
            case 4: return "Thu";
            case 5: return "Fri";
            case 6: return "Sat";
            case 7: return "Sun";
        }
    }
    static getMonth(month) {
        switch (month) {
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
