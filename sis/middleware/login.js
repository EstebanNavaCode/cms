document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("login-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        Swal.fire({
          icon: "warning",
          title: "Campos vacíos",
          text: "Por favor, ingresa tu correo y contraseña",
          confirmButtonColor: "#ffd700",
        });
        return;
      }

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Acceso correcto",
            text: "Ingresando al sistema...",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.href = "/dashboard";
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.message || "Usuario o contraseña incorrectos",
            confirmButtonColor: "#ffd700",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar al servidor. Inténtalo de nuevo.",
          confirmButtonColor: "#ffd700",
        });
      }
    });
});
