document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle"),
    switchElement = modeToggle ? modeToggle.querySelector(".switch") : null,
    sidebar = body.querySelector("nav"),
    sidebarToggle = body.querySelector(".sidebar-toggle");

  let getMode = localStorage.getItem("mode");
  if (getMode && getMode === "dark") {
    body.classList.add("dark");
    if (switchElement) switchElement.classList.add("active");
  }

  let getStatus = localStorage.getItem("status");
  if (getStatus && getStatus === "close") {
    if (sidebar) sidebar.classList.add("close");
  }

  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      if (switchElement) switchElement.classList.toggle("active");

      localStorage.setItem(
        "mode",
        body.classList.contains("dark") ? "dark" : "light"
      );
    });
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      if (sidebar) sidebar.classList.toggle("close");

      localStorage.setItem(
        "status",
        sidebar.classList.contains("close") ? "close" : "open"
      );
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-links li a");

  let activeLink = localStorage.getItem("activeLink");

  if (activeLink) {
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === activeLink) {
        link.classList.add("active");
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      navLinks.forEach((item) => item.classList.remove("active"));

      this.classList.add("active");

      localStorage.setItem("activeLink", this.getAttribute("href"));
    });
  });
});
