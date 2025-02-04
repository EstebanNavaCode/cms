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

    const fileInput = document.getElementById("file"); // Capturar la imagen
    if (fileInput.files.length > 0) {
      formData.append("IMG_LIB", fileInput.files[0]); // Adjuntar la imagen al formulario
    }

    try {
      const response = await fetch("/products", {
        method: "POST",
        body: formData, // Enviar como FormData
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Producto registrado exitosamente.");
        window.location.href = "/products";
      } else {
        const errorResult = await response.json();
        alert(
          errorResult.message || "Ocurrió un error al registrar el producto."
        );
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Ocurrió un error al procesar el registro del producto.");
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
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const productId = document.getElementById("modal-id").value;
    const formData = new FormData(this);

    try {
      const response = await fetch(`/products/${productId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const result = await response.json();
      //console.log("✅ Producto actualizado:", result);

      $("#modal-register-product").modal("hide");
      location.reload();
    } catch (error) {
      //console.error("⚠️ Error al actualizar producto:", error);
    }
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


function updateCheckboxState() {
    const visibleCheckbox = document.getElementById("cb5");
    const hiddenCheckbox = document.getElementById("modal-active");

    if (visibleCheckbox.checked) {
        hiddenCheckbox.value = "1";  // Enviar como "1" si está marcado
    } else {
        hiddenCheckbox.value = "0";  // Enviar como "0" si está desmarcado
    }
    hiddenCheckbox.checked = visibleCheckbox.checked;
}


  });
