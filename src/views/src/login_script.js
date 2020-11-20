function renderPage() {
    location.href = `/users/${$("input#user-name").val().toString()}`;
}
$("#ok").click(renderPage);
$(window).keydown(function (event) {
    if (event.key === "Enter")
        renderPage();
});
