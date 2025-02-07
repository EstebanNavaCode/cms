document.getElementById("form-register-news").addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const fileInput = document.getElementById("file");

  if (fileInput.files.length > 0) {
    formData.append("IMG_NOT", fileInput.files[0]);
  }

  formData.append("ACTIVO_NOT", 1);

  try {
    const response = await fetch("/news", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        document.getElementById("form-register-news")?.reset();
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
      text: "No se pudo conectar al servidor. Inténtalo de nuevo.",
      showConfirmButton: false,
      timer: 1500,
    });
}

});



const loadCategoriesNEWS = async () => {
  try {
    const response = await fetch("/categoriesNEWS");
    if (response.ok) {
      const categoriesNEWS = await response.json();
      const categorySelect = document.getElementById("categoryNEWS");

      categorySelect.innerHTML =
        '<option value="" disabled selected hidden>Categoría</option>';

      categoriesNEWS.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.ID_CAT;
        option.textContent = category.NOMBRE_CAT;
        categorySelect.appendChild(option);
      });

      categorySelect.innerHTML =
        '<option value="" disabled selected hidden>Categoría</option>';
    } else {
      console.error("Error al cargar las categorías:", await response.text());
    }
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
};

document.addEventListener("DOMContentLoaded", loadCategoriesNEWS);

const loadSubcategoriesNEWS = async (categoryId) => {
  try {
    const response = await fetch(`/subcategoriesNEWS/${categoryId}`);
    if (response.ok) {
      const subcategories = await response.json();
      const subcategorySelect = document.getElementById("subcategoryNEWS");
      subcategorySelect.innerHTML =
        '<option value="" disabled selected hidden>Subcategoría</option>';

      subcategories.forEach((subcategory) => {
        const option = document.createElement("option");
        option.value = subcategory.ID_ETQ;
        option.textContent = subcategory.NOMBRE_ETQ;
        subcategorySelect.appendChild(option);
      });
    } else {
      console.error("Error al cargar subcategorías.");
    }
  } catch (error) {
    console.error("Error al cargar subcategorías:", error);
  }
};

document.getElementById("categoryNEWS").addEventListener("change", (e) => {
  const categoryId = e.target.value;
  loadSubcategoriesNEWS(categoryId);
});

document
  .getElementById("form-edit-news")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const fileInput = document.getElementById("edit-file");

    if (fileInput && fileInput.files.length > 0) {
      formData.append("IMG_NOT", fileInput.files[0]);
    }

    const ID_NOT = document.getElementById("edit-id").value;

    try {
      const response = await fetch(`/news/${ID_NOT}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          icon: "success",
          title: "Noticia actualizada",
          text: result.message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: "Algo salió mal, intente de nuevo en un momento.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar al servidor. Inténtalo de nuevo.",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log("Error:", err);
    }
  });

function updateCheckboxState() {
  const checkbox = document.getElementById("cb5");
  const hiddenInput = document.getElementById("modal-active");
  hiddenInput.value = checkbox.checked ? 1 : 0;
}
