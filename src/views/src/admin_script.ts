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

type ContentUsedTypes = "Welcome Page" | "history" | "users";
function clearContent(usedBy: ContentUsedTypes): void {

}

function postTask(content: string, timestamp: number): void {

}


function _getDay(date: number): string {
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
function _getMonth(month: number): string {
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