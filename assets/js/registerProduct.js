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
    const fileInput = document.getElementById("file");
    const IMG_LIB = fileInput.files.length ? fileInput.files[0].name : "";

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
          IMG_LIB,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Producto registrado exitosamente.");
        document.getElementById("form-register-product").reset();
      } else {
        const error = await response.json();
        alert(error.message || "Error al registrar producto.");
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
