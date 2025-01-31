document
  .getElementById("form-register-product")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const CATEGORIA_LIB = document.getElementById("category").value;
    const SUBCATEGORIA_LIB = document.getElementById("subcategory").value;
    const ISBN_LIB = document.getElementById("isbn").value;
    const NOMBRE_LIB = document.getElementById("name").value;
    const AUTOR_LIB = document.getElementById("autor").value;
    const EDITORIAL_LIB = document.getElementById("lastname").value;
    const STOCK_LIB = document.getElementById("stock").value;

    if (
      !CATEGORIA_LIB ||
      !SUBCATEGORIA_LIB ||
      !ISBN_LIB ||
      !NOMBRE_LIB ||
      !AUTOR_LIB ||
      !EDITORIAL_LIB ||
      !STOCK_LIB
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ISBN_LIB,
          NOMBRE_LIB,
          AUTOR_LIB,
          EDITORIAL_LIB,
          STOCK_LIB,
          CATEGORIA_LIB,
          SUBCATEGORIA_LIB,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Producto registrado exitosamente.");

        window.location.href = "/products";

        document.getElementById("form-register-product").reset();
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

    const ID_LIB = document.getElementById("modal-id").value.trim();
    const NOMBRE_LIB = document.getElementById("modal-name").value.trim();
    const AUTOR_LIB = document.getElementById("modal-autor").value.trim();
    const EDITORIAL_LIB = document
      .getElementById("modal-editorial")
      .value.trim();
    const ISBN_LIB = document.getElementById("modal-isbn").value.trim();
    const STOCK_LIB = document.getElementById("modal-stock").value.trim();
    const CATEGORIA_LIB = document
      .getElementById("modal-category")
      .value.trim();
    const SUBCATEGORIA_LIB = document
      .getElementById("modal-subcategory")
      .value.trim();
    const ACTIVO_LIB = document.getElementById("modal-active").checked;

    console.log("Datos enviados al backend:", {
      ID_LIB,
      NOMBRE_LIB,
      AUTOR_LIB,
      EDITORIAL_LIB,
      ISBN_LIB,
      STOCK_LIB,
      CATEGORIA_LIB,
      SUBCATEGORIA_LIB,
      ACTIVO_LIB,
    });

    try {
      const response = await fetch(`/products/${ID_LIB}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          NOMBRE_LIB,
          AUTOR_LIB,
          EDITORIAL_LIB,
          ISBN_LIB,
          STOCK_LIB,
          CATEGORIA_LIB,
          SUBCATEGORIA_LIB,
          ACTIVO_LIB,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Producto actualizado exitosamente.");
        location.reload();
      } else {
        const error = await response.json();
        console.error("Error del servidor:", error);
        alert(error.message || "Error al actualizar producto.");
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      alert("Ocurrió un error inesperado.");
    }
  });
