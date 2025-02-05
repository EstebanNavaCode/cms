document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("form-register-user")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData();
      formData.append("TIPO_USR", document.getElementById("type")?.value);
      formData.append("NOMBRE_USR", document.getElementById("name").value);
      formData.append(
        "APELLIDO_USR",
        document.getElementById("lastname").value
      );
      formData.append(
        "CORREO_USR",
        document.getElementById("correo_usr").value
      );
      formData.append(
        "CONTRASENA_USR",
        document.getElementById("contrasena_usr").value
      );

      const fileInput = document.getElementById("file"); // ID del input type="file"
      if (fileInput.files.length > 0) {
        formData.append("IMG_USR", fileInput.files[0]); // Aquí enviamos la imagen correctamente
      }

      //console.log("Cuerpo de la solicitud a enviar:", formData);

      try {
        const response = await fetch("/users", {
          method: "POST",
          body: formData, // Enviar como FormData para manejar archivos
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

    const formData = new FormData();
    formData.append("ID_USR", document.getElementById("modal-id").value.trim());
    formData.append(
      "TIPO_USR",
      document.getElementById("type-modal").value.trim()
    );
    formData.append(
      "NOMBRE_USR",
      document.getElementById("modal-name").value.trim()
    );
    formData.append(
      "APELLIDO_USR",
      document.getElementById("modal-lastname").value.trim()
    );
    formData.append(
      "CORREO_USR",
      document.getElementById("modal-correo").value.trim()
    );
    formData.append(
      "ACTIVO_USR",
      document.getElementById("modal-active").checked
    );

    const fileInput = document.getElementById("modal-file");
    if (fileInput.files.length > 0) {
      formData.append("IMG_USR", fileInput.files[0]); // Si se sube una imagen, la enviamos
    }

    try {
      const response = await fetch(`/users/${formData.get("ID_USR")}`, {
        method: "PUT",
        body: formData, // Enviar como FormData
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
