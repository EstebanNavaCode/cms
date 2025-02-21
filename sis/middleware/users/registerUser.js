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
          if (result.message === "El correo ya está registrado.") {
            Swal.fire({
              icon: "warning",
              title: "Correo duplicado",
              text: "Este correo ya está registrado. Intente con otro.",
              showConfirmButton: false,
              timer: 1500,
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
        }
      } catch (err) {
        console.error("Error:", err);
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar al servidor. Inténtalo de nuevo.",
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
      document.getElementById("modal-active").value
    ); // ✅ Se envía el valor correcto

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

document.addEventListener("DOMContentLoaded", function () {
  const nameInputs = document.querySelectorAll(
    "#name, #lastname, #modal-name, #modal-lastname"
  );

  const validateNameInput = (input) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!regex.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
      //showError(input, "Entrada no valida");
    } else {
      clearError(input);
    }
  };

  const showError = (input, message) => {
    let errorMessage = input.nextElementSibling;
    if (!errorMessage || !errorMessage.classList.contains("error-message")) {
      errorMessage = document.createElement("span");
      errorMessage.className = "error-message";
      errorMessage.style.color = "red";
      errorMessage.style.fontSize = "0.8em";
      input.parentNode.insertBefore(errorMessage, input.nextSibling);
    }
    errorMessage.textContent = message;
  };

  const clearError = (input) => {
    const errorMessage = input.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains("error-message")) {
      errorMessage.remove();
    }
  };

  nameInputs.forEach((input) => {
    input.addEventListener("input", () => validateNameInput(input));
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const nameInputs = document.querySelectorAll(
    "#name, #lastname, #modal-name, #modal-lastname"
  );

  const emailInputs = document.querySelectorAll("#correo_usr, #modal-correo");

  function enforceTextLimit(input) {
    input.addEventListener("input", function () {
      if (this.value.length > 30) {
        this.value = this.value.slice(0, 30);
      }
    });

    input.addEventListener("keydown", function (event) {
      if (
        this.value.length >= 30 &&
        event.key !== "Backspace" &&
        event.key !== "Delete"
      ) {
        event.preventDefault();
      }
    });
  }

  function validateEmailInput(input) {
    input.addEventListener("input", function () {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(this.value)) {
        this.style.borderColor = "red";
      } else {
        this.style.borderColor = "green";
      }
    });
  }

  nameInputs.forEach(enforceTextLimit);
  emailInputs.forEach(validateEmailInput);
});
