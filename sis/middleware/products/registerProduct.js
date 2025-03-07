document
  .getElementById("form-register-product")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("CATEGORIA_LIB", document.getElementById("category").value);
    formData.append(
      "SUBCATEGORIA_LIB",
      document.getElementById("subcategory").value
    );
    formData.append("ISBN_LIB", document.getElementById("isbn").value);
    formData.append("NOMBRE_LIB", document.getElementById("name").value);
    formData.append("AUTOR_LIB", document.getElementById("autor").value);
    formData.append("EDITORIAL_LIB", document.getElementById("lastname").value);
    formData.append("STOCK_LIB", document.getElementById("stock").value);

    const fileInput = document.getElementById("file");
    if (fileInput.files.length > 0) {
      formData.append("IMG_LIB", fileInput.files[0]);
    }

    try {
      const response = await fetch("/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
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

const loadCategories = async () => {
  try {
    const response = await fetch("/categories");
    if (response.ok) {
      const categories = await response.json();
      const categorySelect = document.getElementById("category");
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.ID_LCAT;
        option.textContent = category.NOMBRE_LCAT;
        categorySelect.appendChild(option);
      });
    } else {
      console.error("Error al cargar las categorías.");
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
};

const loadSubcategories = async (categoryId) => {
  try {
    const response = await fetch(`/subcategories/${categoryId}`);
    if (response.ok) {
      const subcategories = await response.json();
      const subcategorySelect = document.getElementById("subcategory");
      subcategorySelect.innerHTML =
        '<option value="" disabled selected hidden>Subcategoría</option>';
      subcategories.forEach((subcategory) => {
        const option = document.createElement("option");
        option.value = subcategory.ID_SBC;
        option.textContent = subcategory.NOMBRE_SBC;
        subcategorySelect.appendChild(option);
      });
    } else {
      console.error("Error al cargar las subcategorías.");
    }
  } catch (error) {
    console.error("Error loading subcategories:", error);
  }
};

document.getElementById("category").addEventListener("change", (e) => {
  const categoryId = e.target.value;
  loadSubcategories(categoryId);
});

document.addEventListener("DOMContentLoaded", loadCategories);

document
  .getElementById("form-update-product")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    updateCheckboxState();

    const productId = document.getElementById("modal-id").value;
    const formData = new FormData(this);

    fetch(`/products/${productId}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          $("#modal-register-product").modal("hide");
          location.reload();
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: error.message || "Ocurrió un error al actualizar el producto.",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  });

function updateCheckboxState() {
  const visibleCheckbox = document.getElementById("cb5");
  const hiddenCheckbox = document.getElementById("modal-active");

  hiddenCheckbox.value = visibleCheckbox.checked ? "1" : "0";
  hiddenCheckbox.checked = visibleCheckbox.checked;
}

document
  .getElementById("modal-register-product")
  .addEventListener("show.bs.modal", () => {
    const hiddenCheckbox = document.getElementById("modal-active");
    const visibleCheckbox = document.getElementById("cb5");

    visibleCheckbox.checked = hiddenCheckbox.value === "1";
  });

document
  .getElementById("modal-file")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("preview-product").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

document.getElementById("cb5").addEventListener("change", updateCheckboxState);

document.addEventListener("DOMContentLoaded", function () {
  const quantityInputs = document.querySelectorAll("#stock, #modal-stock");

  quantityInputs.forEach((input) => {
    input.addEventListener("keydown", function (event) {
      if (
        event.key === "e" ||
        event.key === "E" ||
        event.key === "-" ||
        event.key === "+" ||
        event.key === "."
      ) {
        event.preventDefault();
      }
    });

    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "");
    });

    input.addEventListener("paste", function (event) {
      event.preventDefault();
      let pasteData = (event.clipboardData || window.clipboardData).getData(
        "text"
      );
      pasteData = pasteData.replace(/[^0-9]/g, "");
      document.execCommand("insertText", false, pasteData);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const isbnInputs = document.querySelectorAll("#isbn, #modal-isbn");

  function enforceIsbnLimit(input) {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
      if (this.value.length > 13) {
        this.value = this.value.slice(0, 13);
      }
    });

    input.addEventListener("keydown", function (event) {
      if (
        this.value.length >= 13 &&
        event.key !== "Backspace" &&
        event.key !== "Delete"
      ) {
        event.preventDefault();
      }
    });
  }

  isbnInputs.forEach(enforceIsbnLimit);

  const textInputs = document.querySelectorAll(
    "#name, #autor, #lastname, #modal-name, #modal-autor, #modal-editorial"
  );

  textInputs.forEach((input) => {
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
  });
});
