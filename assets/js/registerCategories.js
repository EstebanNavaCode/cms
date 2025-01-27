document.addEventListener("DOMContentLoaded", () => {
  const subcategoryInput = document.getElementById("subcategory-input");
  const subcategoryList = document.getElementById("subcategory-list");
  const subcategoryValues = document.getElementById("subcategory-values");

  let subcategories = []; 

  
  const addSubcategory = (name) => {
    if (!name || subcategories.includes(name)) return; 
    subcategories.push(name);

    const tag = document.createElement("div");
    tag.className = "subcategory-tag";
    tag.innerHTML = `
      <span>${name}</span>
      <button type="button" data-name="${name}">&times;</button>
    `;
    subcategoryList.appendChild(tag);

    updateHiddenInput();

    tag.querySelector("button").addEventListener("click", () => {
      removeSubcategory(name);
    });
  };

  const removeSubcategory = (name) => {
    subcategories = subcategories.filter((subcategory) => subcategory !== name);
    const tag = subcategoryList.querySelector(`button[data-name="${name}"]`).parentElement;
    if (tag) subcategoryList.removeChild(tag);

    updateHiddenInput();
  };

  const updateHiddenInput = () => {
    subcategoryValues.value = JSON.stringify(subcategories);
  };

  subcategoryInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); 
      const value = subcategoryInput.value.trim();
      if (value) {
        addSubcategory(value);
        subcategoryInput.value = ""; 
      }
    }
  });
});

document.getElementById("form-register-category").addEventListener("submit", async function (event) {
  event.preventDefault();

  const nombre = document.getElementById("name").value;
  const descripcion = document.getElementById("descripcion").value;
  const subcategorias = JSON.parse(document.getElementById("subcategory-values").value || "[]");

  if (!nombre || !descripcion) {
    alert("Por favor, completa los campos obligatorios.");
    return;
  }

  try {
    const response = await fetch("/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        NOMBRE_CAT: nombre,
        DESCRIPCION_CAT: descripcion,
        subcategorias, 
      }),
    });

    if (response.ok) {
      alert("Categoría y subcategorías registradas con éxito.");
      window.location.reload();
    } else {
      const error = await response.json();
      alert(error.message || "Error al registrar la categoría.");
    }
  } catch (err) {
    console.error("Error al enviar el formulario:", err);
    alert("Error inesperado. Intenta de nuevo.");
  }
});
