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

      const fileInput = document.getElementById("file"); 
      if (fileInput.files.length > 0) {
        formData.append("IMG_USR", fileInput.files[0]);
      }

      try {
        const response = await fetch("/users", {
          method: "POST",
          body: formData, 
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: result.message,
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Algo salió mal, intente de nuevo en un momento.",
            showConfirmButton: false,
          timer: 1500,
          });
        }
      } catch (err) {
        console.error("Error:", err);
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
});

document
  .getElementById("form-register-user-modal")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("ID_USR", document.getElementById("modal-id").value.trim());
    formData.append("TIPO_USR", document.getElementById("type-modal").value.trim());
    formData.append("NOMBRE_USR", document.getElementById("modal-name").value.trim());
    formData.append("APELLIDO_USR", document.getElementById("modal-lastname").value.trim());
    formData.append("CORREO_USR", document.getElementById("modal-correo").value.trim());
    formData.append("ACTIVO_USR", document.getElementById("modal-active").value); // ✅ Se envía el valor correcto

    const fileInput = document.getElementById("modal-file");
    if (fileInput.files.length > 0) {
      formData.append("IMG_USR", fileInput.files[0]); // Si se sube una imagen, la enviamos
    }

    //console.log("🟢 Datos enviados al backend:", Object.fromEntries(formData));

    try {
      const response = await fetch(`/users/${formData.get("ID_USR")}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: "success",
          title: "Usuario actualizado",
          text: result.message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      } else {
        const error = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: "Algo salió mal, intente de nuevo en un momento.",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log(error);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar al servidor. Inténtalo de nuevo.",
        showConfirmButton: false,
        timer: 1500,
      });
      console.error("Error:", err);
    }
  });


  function updateCheckboxState() {
    let isChecked = $("#cb5").prop("checked");
    $("#modal-active").val(isChecked ? "1" : "0");
    //console.log("🔄 Estado del checkbox enviado:", $("#modal-active").val());
}
