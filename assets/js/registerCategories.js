document.addEventListener("DOMContentLoaded", () => {
    const subcategoryInput = document.getElementById("subcategory-input");
    const subcategoryList = document.getElementById("subcategory-list");
  
    let subcategories = []; // Array para almacenar las subcategorías
  
    // Función para agregar una subcategoría
    const addSubcategory = (name) => {
      if (!name || subcategories.includes(name)) return; // Evita duplicados o valores vacíos
      subcategories.push(name);
  
      // Crear etiqueta
      const tag = document.createElement("div");
      tag.className = "subcategory-tag";
      tag.innerHTML = `
        <span>${name}</span>
        <button type="button" data-name="${name}">&times;</button>
      `;
      subcategoryList.appendChild(tag);
  
      // Agregar evento para eliminar etiqueta
      tag.querySelector("button").addEventListener("click", () => {
        removeSubcategory(name);
      });
    };
  
    // Función para eliminar una subcategoría
    const removeSubcategory = (name) => {
      subcategories = subcategories.filter((subcategory) => subcategory !== name);
      const tag = subcategoryList.querySelector(`button[data-name="${name}"]`).parentElement;
      if (tag) subcategoryList.removeChild(tag);
    };
  
    // Captura el evento Enter en el campo de entrada
    subcategoryInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Evita que se envíe el formulario
        const value = subcategoryInput.value.trim();
        if (value) {
          addSubcategory(value);
          subcategoryInput.value = ""; // Limpia el campo de entrada
        }
      }
    });
  });
  