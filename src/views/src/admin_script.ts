const
  content: JQuery = $("#content"),
  backBtn: JQuery = $("button#back"),
  historyBtn: JQuery = $("button#history"),
  loginBtn: JQuery = $("button#login"),
  usersBtn: JQuery = $("button#users"),
  connectionsBtn: JQuery = $("button#connections");

$("nav button").click(function (event: any): void {
  if (!$(this).hasClass("active") && $(this).attr("id") !== "back") {
    if ($("nav button").hasClass("active"))
      $("nav button").removeClass("active");
    $(this).addClass("active");
  }
});

backBtn.click(function (event: any): void {
  if (confirm("Are you sure you want to exit?")) {
    if (history && history instanceof History) {
      history.back();
    } else {
      let form: JQuery = $("<form>", {
        action: "/login",
        method: "GET"
      }),
        button: JQuery = $("<button>", {
          type: "submit"
        });

      form.append(button).appendTo("body");
      button.trigger("click");
    }
  }
});

historyBtn.click(function (event: any): void {

  function postTask(content: string, timestamp: number): void {
    
  }

  if (content.attr("data-userBy") !== "history") {
    content.empty().attr("data-usedBy", "History");
  }
});

type ContentUsedTypes = "Welcome Page" | "history" | "users";
function clearContent(usedBy: ContentUsedTypes): void {

}
