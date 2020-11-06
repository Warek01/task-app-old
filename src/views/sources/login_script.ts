function renderPage(): void {
   location.href = `/users/${$("input#user-name").val().toString()}`;
}

$(window).keydown(function(event): void {
   switch (event.key) {
      case "Enter":
         renderPage();
         break;
   }
});

$("input#user-name").trigger("focus");
