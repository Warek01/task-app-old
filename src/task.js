"use strict";
class Task {
    constructor(content, timestamp = Date.now()) {
        this.timestamp = timestamp;
        let task = $("<div>", {
            "class": "task"
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
            /** Index of given task in main-content */
            let index = 0;
            for (let em of main_content.children(".task")) {
                if ($(em).text() === $(this).parent().text())
                    break;
                index++;
            }
            fetch(`/?index=${index}`, {
                method: "DELETE"
            }).then(res => {
                if (res.ok)
                    showModalWindow(modalTypes.OK);
                else
                    showModalWindow(modalTypes.ERROR);
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
            showModalWindow(modalTypes.OK);
        });
        // Task edit button
        editBtn.click(function (event) {
            let content = $(this).parent().find("p.content");
            content.attr("contenteditable", "true").trigger("focus").css("color", "#f7d794");
            this.oldContent = content.text();
        });
        // Set "contenteditable" attribute to false if it was true
        // when losing focus, and sending an text update request to 
        // given task on server
        taskContent.on({
            focusout: function (event) {
                console.log($(this).text() !== this.oldContent);
                if (Boolean($(this).attr("contenteditable"))) {
                    $(this).removeAttr("contenteditable").css("color", colorSetting.currentTextCol);
                    // If the task content hasn't changed
                    if ($(this).text() !== this.oldContent)
                        return;
                    try {
                        /** Index of given task in main-content */
                        let index = 0;
                        for (let em of main_content.children(".task")) {
                            if ($(em).text() === $(this).parent().text())
                                break;
                            index++;
                        }
                        fetch("/", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                index: index,
                                content: $(this).parent().find("p.content").text().trim()
                            })
                        }).then(res => {
                            if (res.ok)
                                showModalWindow(modalTypes.OK);
                            else
                                showModalWindow(modalTypes.ERROR);
                        });
                    }
                    catch (error) {
                        console.warn(error);
                    }
                }
            }, keydown: function (event) {
                if (event.key === "Enter")
                    $(this).trigger("focusout");
            }
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
