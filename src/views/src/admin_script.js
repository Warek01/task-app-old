"use strict";
const content = $("#content"), backBtn = $("button#back"), historyBtn = $("button#history"), loginBtn = $("button#login"), usersBtn = $("button#users"), connectionsBtn = $("button#connections");
$("nav button").click(function (event) {
    if (!$(this).hasClass("active") && $(this).attr("id") !== "back") {
        if ($("nav button").hasClass("active"))
            $("nav button").removeClass("active");
        $(this).addClass("active");
    }
});
backBtn.click(function (event) {
    if (confirm("Are you sure you want to exit?")) {
        if (history && history instanceof History) {
            history.back();
        }
        else {
            let form = $("<form>", {
                action: "/login",
                method: "GET"
            }), button = $("<button>", {
                type: "submit"
            });
            form.append(button).appendTo("body");
            button.trigger("click");
        }
    }
});
historyBtn.click(function (event) {
    fetch("/getTasks", {
        method: "GET"
    }).then(res => res.json()).then(res => {
        for (let task of JSON.parse(res))
            postTask(task.content, task.timestamp);
    });
    if (content.attr("data-userBy") !== "history") {
        content.empty().attr("data-usedBy", "History");
    }
});
function clearContent(usedBy) {
}
function postTask(content, timestamp) {
}
function _getDay(date) {
    switch (date) {
        case 1:
            return "Mon";
        case 2:
            return "Tue";
        case 3:
            return "Wed";
        case 4:
            return "Thu";
        case 5:
            return "Fri";
        case 6:
            return "Sat";
        case 7:
            return "Sun";
    }
}
function _getMonth(month) {
    switch (month) {
        case 0:
            return "Jan";
        case 1:
            return "Feb";
        case 2:
            return "Mar";
        case 3:
            return "Apr";
        case 4:
            return "May";
        case 5:
            return "Jun";
        case 6:
            return "Jul";
        case 7:
            return "Aug";
        case 8:
            return "Sep";
        case 9:
            return "Oct";
        case 10:
            return "Nov";
        case 11:
            return "Dec";
    }
}
