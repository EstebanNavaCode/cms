document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("form-register-user")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const TIPO_USR = document.getElementById("type")?.value;
      if (!TIPO_USR) {
        console.error("El elemento con ID 'type' no se encontró en el DOM.");
        return;
      }

      const NOMBRE_USR = document.getElementById("name").value;
      const APELLIDO_USR = document.getElementById("lastname").value;
      const CORREO_USR = document.getElementById("correo_usr").value;
      const CONTRASENA_USR = document.getElementById("contrasena_usr").value;
      const IMG_USR = document.getElementById("img_usr")?.value || null; // Opcional

      const body = {
        TIPO_USR,
        NOMBRE_USR,
        APELLIDO_USR,
        CORREO_USR,
        CONTRASENA_USR,
        IMG_USR,
      };

      console.log("Cuerpo de la solicitud a enviar:", body);

      try {
        const response = await fetch("/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          window.location.reload();
        } else {
          const error = await response.json();
          alert(error.message || "Error al registrar usuario.");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Ocurrió un error al procesar el registro.");
      }
    });
});


document
  .getElementById("form-register-user-modal")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const ID_USR = document.getElementById("modal-id").value.trim();
    const TIPO_USR = document.getElementById("type-modal").value.trim();
    const NOMBRE_USR = document.getElementById("modal-name").value.trim();
    const APELLIDO_USR = document.getElementById("modal-lastname").value.trim();
    const CORREO_USR = document.getElementById("modal-correo").value.trim();
    const ACTIVO_USR = document.getElementById("modal-active").checked;

    try {
      const response = await fetch(`/users/${ID_USR}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TIPO_USR,
          NOMBRE_USR,
          APELLIDO_USR,
          CORREO_USR,
          ACTIVO_USR,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        location.reload();
      } else {
        const error = await response.json();
        alert(error.message || "Error al actualizar usuario.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Ocurrió un error al procesar la actualización.");
    }
  });
