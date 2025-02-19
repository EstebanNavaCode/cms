document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-register-genero");
  const subcategoryInput = document.getElementById("subcategory-input");
  const subcategoryList = document.getElementById("subcategory-list");
  const subcategoryValues = document.getElementById("subcategory-values");
  let subgeneros = [];

  const renderSubgeneros = () => {
    subcategoryList.innerHTML = "";
    subgeneros.forEach((subgenero, index) => {
      const tag = document.createElement("div");
      tag.className = "subcategory-tag";
      tag.innerHTML = `
                <span>${subgenero}</span>
                <button type="button" class="remove-tag" data-index="${index}">&times;</button>
            `;
      subcategoryList.appendChild(tag);

      tag.querySelector(".remove-tag").addEventListener("click", () => {
        removeSubgenero(index);
      });
    });

    subcategoryValues.value = JSON.stringify(subgeneros);
  };

  const addSubgenero = () => {
    const name = subcategoryInput.value.trim();
    if (name && !subgeneros.includes(name)) {
      subgeneros.push(name);
      renderSubgeneros();
    }
    subcategoryInput.value = "";
  };

  const removeSubgenero = (index) => {
    subgeneros.splice(index, 1);
    renderSubgeneros();
  };

  subcategoryInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubgenero();
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    subcategoryValues.value = JSON.stringify(subgeneros);

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/generos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text: result.message || "No se pudo registrar el género.",
          showConfirmButton: false,
          timer:1500,
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Registro Exitoso",
        text: result.message,
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.reload();
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar al servidor. Inténtalo de nuevo.",
        showConfirmButton: true,
      });
      console.error("Error en la petición:", err);
    }
  });
});
