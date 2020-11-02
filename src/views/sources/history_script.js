let taskCount = 0,
  emptyBanner = $("#empty");

function makeTask(content, timestamp) {
  let task = $("<div>", {
      class: "task",
    }),
    taskContent = $("<p>", {
      html: content,
      class: "content",
    }),
    taskTimestamp = $("<p>", {
      html: `${getDay(new Date(timestamp).getDay())} ${new Date(
        timestamp
      ).getDate()} 
               ${getMonth(new Date(timestamp).getMonth())} ${new Date(
        timestamp
      ).getFullYear()}
               ${new Date(timestamp).getHours()}:${new Date(
        timestamp
      ).getMinutes()}`,
      class: "timestamp",
    });

  task.append(taskContent, taskTimestamp);
  $(".main-content").append(task);

  taskCount++;
}

function clearHistory(element) {
  if ($(".main-content").find(".task").length > 0) {
    emptyBanner.show("fast");

    fetch("/history", {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then((res) => console.log(res));

    $(".main-content").children(".task").remove();

    showModalWindow();
  }
}

function getDay(date) {
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
function getMonth(month) {
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

function showModalWindow() {
  let modal = $(".modal");
  modal.css("transition", "filter 75ms linear");
  modal.css("filter", "opacity(1)");
  setTimeout(() => {
    modal.css("filter", "opacity(0)");
    modal.css("transition", "filter .3s ease");
  }, 750);
}
