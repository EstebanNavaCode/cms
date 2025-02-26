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

        if (response.ok && result.success) {
          // Guardar los datos del usuario en sessionStorage
          sessionStorage.setItem("user", JSON.stringify(result.user));

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

document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(sessionStorage.getItem("user"));
  //console.log("Datos de sessionStorage:", user);

  if (user) {
    document.getElementById("name").value = user.nombre || "";
    document.getElementById("lastname").value = user.apellido || "";
    document.getElementById("correo_usr").value = user.correo || "";

    if (user.imagen) {
      const previewImage = document.getElementById("preview");
      previewImage.src = user.imagen + "?t=" + new Date().getTime();
      previewImage.style.display = "block";
      document.getElementById("icon-placeholder").style.display = "none";
    }
  } else {
    //console.log("No hay usuario en sesión.");
  }

  document
    .getElementById("save-changes-btn")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      const user = JSON.parse(sessionStorage.getItem("user"));

      if (!user) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No hay usuario autenticado.",
          confirmButtonColor: "#ffd700",
        });
        return;
      }

      // 🟢 Obtener datos del formulario
      const updatedUser = {
        ID_USR: user.id || "",
        TIPO_USR: user.tipo || "",
        NOMBRE_USR: document.getElementById("name").value.trim(),
        APELLIDO_USR: document.getElementById("lastname").value.trim(),
        CORREO_USR: document.getElementById("correo_usr").value.trim(),
        CONTRASENA_USR:
          document.getElementById("CONTRASENA_USR").value.trim() || "", // Asegurar que la contraseña se obtiene
      };

      //console.log("📩 Datos que se enviarán al backend:", updatedUser);

      const formData = new FormData();
      formData.append("ID_USR", updatedUser.ID_USR);
      formData.append("TIPO_USR", updatedUser.TIPO_USR);
      formData.append("NOMBRE_USR", updatedUser.NOMBRE_USR);
      formData.append("APELLIDO_USR", updatedUser.APELLIDO_USR);
      formData.append("CORREO_USR", updatedUser.CORREO_USR);

      // 🔥 Agregar contraseña solo si no está vacía
      if (updatedUser.CONTRASENA_USR !== "") {
        //console.log("🔑 Se enviará una nueva contraseña.");
        formData.append("CONTRASENA_USR", updatedUser.CONTRASENA_USR);
      } else {
        //console.log("🚫 No se enviará una nueva contraseña.");
      }

      // 📸 Agregar imagen si el usuario subió una nueva
      const fileInput = document.getElementById("file");
      if (fileInput.files.length > 0) {
        formData.append("IMG_USR", fileInput.files[0]);
      }

      for (let [key, value] of formData.entries()) {
        //console.log(`${key}: ${value}`);
      }

      try {
        const response = await fetch(`/perfil/${user.id}`, {
          method: "PUT",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Perfil actualizado",
            text: "Tu perfil se ha actualizado correctamente.",
            confirmButtonColor: "#ffd700",
            timer: 1500,
          }).then(() => {
            user.nombre = updatedUser.NOMBRE_USR;
            user.apellido = updatedUser.APELLIDO_USR;
            user.correo = updatedUser.CORREO_USR;

            if (result.imagen) {
              user.imagen = result.imagen;
            }

            sessionStorage.setItem("user", JSON.stringify(user));
            document.getElementById("preview").src =
              user.imagen + "?t=" + new Date().getTime();
            document.getElementById("icon-placeholder").style.display = "none";
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.message || "Hubo un problema al actualizar el perfil.",
            confirmButtonColor: "#ffd700",
          });
        }
      } catch (error) {
        console.error("❌ Error en la solicitud:", error);
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: "No se pudo conectar al servidor. Inténtalo de nuevo.",
          confirmButtonColor: "#ffd700",
        });
      }
    });
});
