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

document.getElementById("form-update-profile").addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(this);

  try {
    const response = await fetch("/users/updateProfile", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      // Actualizar sessionStorage con los nuevos datos
      const updatedUser = {
        id: formData.get("ID_USR"),
        name: formData.get("NOMBRE_USR"),
        lastname: formData.get("APELLIDO_USR"),
        email: formData.get("CORREO_USR"),
        image: result.user.image, // Asegúrate de que el backend envíe la imagen actualizada
      };

      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
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
        text: result.message,
      });
    }
  } catch (err) {
    console.error("❌ Error de conexión:", err);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar al servidor. Inténtalo de nuevo.",
    });
  }
});

document.getElementById("form-login").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      // Guardar datos en sessionStorage
      sessionStorage.setItem("user", JSON.stringify(result.user));

      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "¡Bienvenido!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = "/dashboard"; 
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error de inicio de sesión",
        text: result.message,
      });
    }
  } catch (err) {
    console.error("❌ Error de conexión:", err);
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "No se pudo conectar al servidor. Inténtalo de nuevo.",
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (user) {
    // Rellenar los campos del formulario
    document.getElementById("user-id").value = user.id;
    document.getElementById("name").value = user.name;
    document.getElementById("lastname").value = user.lastname;
    document.getElementById("correo_usr").value = user.email;

    // Mostrar la imagen si existe
    const imagePreview = document.getElementById("preview");
    if (user.image && user.image !== "NULL") {
      imagePreview.src = user.image;
      imagePreview.style.display = "block";
    } else {
      imagePreview.src = "/assets/img/default-placeholder.jpg";
      imagePreview.style.display = "block";
    }
  } else {
    // Si no hay datos en sessionStorage, redirigir al login
    window.location.href = "/login";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    window.location.href = "/login";
  }
});



