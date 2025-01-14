// Evento para manejar el envío del formulario de registro de producto
document
  .getElementById("form-register-news")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("Formulario enviado"); // Confirmación del disparo del evento

    const TITULO_NOT = document.getElementById("name").value;
    const TEXTO_NOT = document.getElementById("autor").value;
    const CATEGORIA_NOT = document.getElementById("categoryNEWS").value;
    const ETIQUETA_NOT = document.getElementById("subcategoryNEWS").value;
    const FECHA_PUBLICAR_NOT = document.getElementById("isbn").value;

    // Validación de campos requeridos
    if (
      !TITULO_NOT || !TEXTO_NOT || !CATEGORIA_NOT || !FECHA_PUBLICAR_NOT || !ETIQUETA_NOT
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      // Petición POST para registrar el producto
      const response = await fetch("/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TITULO_NOT,
          TEXTO_NOT,
          CATEGORIA_NOT,
          ETIQUETA_NOT,
          FECHA_PUBLICAR_NOT,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Producto registrado exitosamente.");
        // Limpiar el formulario tras éxito
        document.getElementById("form-register-news").reset();
      } else {
        const error = await response.json();
        alert(error.message || "Error al registrar producto.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Ocurrió un error al procesar el registro del producto.");
    }
  });


  
  const loadCategoriesNEWS = async () => {
    try {
      const response = await fetch("/categoriesNEWS");
      if (response.ok) {
        const categoriesNEWS = await response.json();
        console.log("Categorías recibidas:", categoriesNEWS); // <-- Agregar aquí
        const categorySelect = document.getElementById("categoryNEWS");
        categorySelect.innerHTML = '<option value="" disabled selected hidden>Categoría</option>';
  
        categoriesNEWS.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.ID_CAT;
          option.textContent = category.NOMBRE_CAT;
          categorySelect.appendChild(option);
        });
      } else {
        console.error("Error al cargar las categorías.");
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };
  
  
  // Cargar categorías automáticamente al cargar la página
  document.addEventListener("DOMContentLoaded", loadCategoriesNEWS);
  
  const loadSubcategoriesNEWS = async (categoryId) => {
    try {
      const response = await fetch(`/subcategoriesNEWS/${categoryId}`);
      if (response.ok) {
        const subcategories = await response.json();
        console.log("Subcategorías recibidas:", subcategories); // <-- Agregar aquí
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
  
  // Vincular evento al cambio en el select de categorías
  document.getElementById("categoryNEWS").addEventListener("change", (e) => {
    const categoryId = e.target.value;
    loadSubcategoriesNEWS(categoryId);
  });
  
  
  

