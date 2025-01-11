// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body"),
          modeToggle = body.querySelector(".mode-toggle"),
          switchElement = modeToggle ? modeToggle.querySelector(".switch") : null,
          sidebar = body.querySelector("nav"),
          sidebarToggle = body.querySelector(".sidebar-toggle");

    // Recuperar modo oscuro del almacenamiento local
    let getMode = localStorage.getItem("mode");
    if (getMode && getMode === "dark") {
        body.classList.add("dark");
        if (switchElement) switchElement.classList.add("active");
    }

    // Recuperar estado del sidebar del almacenamiento local
    let getStatus = localStorage.getItem("status");
    if (getStatus && getStatus === "close") {
        if (sidebar) sidebar.classList.add("close");
    }

    // Evento para alternar el modo oscuro
    if (modeToggle) {
        modeToggle.addEventListener("click", () => {
            body.classList.toggle("dark"); // Cambia el tema del cuerpo
            if (switchElement) switchElement.classList.toggle("active"); // Mueve el círculo

            // Guardar el estado en localStorage
            localStorage.setItem("mode", body.classList.contains("dark") ? "dark" : "light");
        });
    }

    // Evento para alternar el estado del sidebar
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            if (sidebar) sidebar.classList.toggle("close");

            // Guardar el estado del sidebar en localStorage
            localStorage.setItem("status", sidebar.classList.contains("close") ? "close" : "open");
        });
    }
});
