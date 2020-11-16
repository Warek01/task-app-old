function renderPage(): void {
  location.href = `/users/${$("input#user-name").val().toString()}`;
}
