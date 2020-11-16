function renderPage() {
    location.href = `/users/${$("input#user-name").val().toString()}`;
}
