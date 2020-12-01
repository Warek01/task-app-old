function renderPage(): void {
  location.href = `/users/${$("input#user-name").val().toString()}`;
}

$("#ok").click(renderPage);

$(window).keydown(function (event): void {
  if (event.key === "Enter") renderPage();
});
