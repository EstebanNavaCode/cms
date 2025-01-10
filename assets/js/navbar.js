console.log("Hola desde el switch");

// Seleccionar los elementos necesarios
const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle"),
      switchElement = modeToggle.querySelector(".switch"),
      sidebar = body.querySelector("nav"),
      sidebarToggle = body.querySelector(".sidebar-toggle");

// Recuperar modo oscuro del almacenamiento local
let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
    body.classList.add("dark");
    switchElement.classList.add("active"); // Agregar la clase para el círculo en modo oscuro
}

// Recuperar estado del sidebar del almacenamiento local
let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
    sidebar.classList.add("close");
}

// Evento para alternar el modo oscuro
modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark"); // Cambia el tema del cuerpo
    switchElement.classList.toggle("active"); // Mueve el círculo

    // Guardar el estado en localStorage
    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

// Evento para alternar el estado del sidebar
sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");

    // Guardar el estado del sidebar en localStorage
    if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
});
