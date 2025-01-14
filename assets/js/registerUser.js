document
  .getElementById("form-register-user")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const TIPO_USR = document.getElementById("tipo_usr").value;
    const NOMBRE_USR = document.getElementById("nombre_usr").value;
    const APELLIDO_USR = document.getElementById("apellido_usr").value;
    const CORREO_USR = document.getElementById("correo_usr").value;
    const CONTRASENA_USR = document.getElementById("contrasena_usr").value;
    const IMG_USR = document.getElementById("img_usr").value; // Opcional

    try {
      const response = await fetch("/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TIPO_USR,
          NOMBRE_USR,
          APELLIDO_USR,
          CORREO_USR,
          CONTRASENA_USR,
          IMG_USR,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        const error = await response.json();
        alert(error.message || "Error al registrar usuario.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Ocurrió un error al procesar el registro.");
    }
  });
