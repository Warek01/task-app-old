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
    function postTask(content, timestamp) {
    }
    if (content.attr("data-userBy") !== "history") {
        content.empty().attr("data-usedBy", "History");
    }
});
function clearContent(usedBy) {
}
