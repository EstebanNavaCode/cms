document.addEventListener("DOMContentLoaded", () => {
  //console.log("✅ Script cargado correctamente.");

  /*** 🟢 FUNCIONES REUTILIZABLES PARA MANEJAR SUBCATEGORÍAS / ETIQUETAS ***/

  const handleAddEtiqueta = (inputField, listContainer, etiquetasArray, etiquetaEditando) => {
      const name = inputField.value.trim();
      if (!name) return;

      if (etiquetaEditando.value) {
          //console.log(`✏️ Editando etiqueta ID_ETQ: ${etiquetaEditando.value.ID_ETQ}, Nuevo Nombre: ${name}`);
          etiquetaEditando.value.NOMBRE_ETQ = name;
          etiquetaEditando.value = null;
      } else {
          //console.log("➕ Agregando nueva etiqueta:", name);
          etiquetasArray.push({ ID_ETQ: null, NOMBRE_ETQ: name });
      }

      inputField.value = "";
      renderEtiquetas(listContainer, etiquetasArray, etiquetaEditando);
  };

  const handleRemoveEtiqueta = (id, etiquetasArray, listContainer, etiquetaEditando) => {
      //console.log(`❌ Eliminando etiqueta ID_ETQ: ${id}`);
      etiquetasArray.splice(etiquetasArray.findIndex(etq => etq.ID_ETQ === id), 1);
      renderEtiquetas(listContainer, etiquetasArray, etiquetaEditando);
  };

  const handleEditEtiqueta = (id, etiquetasArray, inputField, etiquetaEditando) => {
      etiquetaEditando.value = etiquetasArray.find(etq => etq.ID_ETQ === id);
      //console.log("✏️ Editando etiqueta:", etiquetaEditando.value);
      inputField.value = etiquetaEditando.value.NOMBRE_ETQ;
  };

  const renderEtiquetas = (listContainer, etiquetasArray, etiquetaEditando) => {
      listContainer.innerHTML = "";
      etiquetasArray.forEach(etq => {
          //console.log("🔹 Renderizando etiqueta:", etq);
          const tag = document.createElement("div");
          tag.className = "subcategory-tag";
          tag.innerHTML = `
              <span data-id="${etq.ID_ETQ}">${etq.NOMBRE_ETQ}</span>
              <button type="button" class="remove-tag" data-id="${etq.ID_ETQ}">&times;</button>
          `;
          listContainer.appendChild(tag);

          tag.querySelector("span").addEventListener("click", () => handleEditEtiqueta(etq.ID_ETQ, etiquetasArray, document.getElementById("edit-subcategory-input"), etiquetaEditando));
          tag.querySelector("button").addEventListener("click", () => handleRemoveEtiqueta(etq.ID_ETQ, etiquetasArray, listContainer, etiquetaEditando));
      });
  };

  /*** 🟢 MANEJO DE REGISTRO DE CATEGORÍAS ***/

  const subcategoryInput = document.getElementById("subcategory-input");
  const subcategoryList = document.getElementById("subcategory-list");
  const subcategoryValues = document.getElementById("subcategory-values");
  let subcategories = [];

  subcategoryInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
          event.preventDefault();
          if (!subcategories.includes(subcategoryInput.value.trim())) {
              subcategories.push(subcategoryInput.value.trim());
              renderEtiquetas(subcategoryList, subcategories, { value: null });
              subcategoryInput.value = "";
          }
      }
  });

  document.getElementById("form-register-category").addEventListener("submit", async function (event) {
      event.preventDefault();

      const nombre = document.getElementById("name").value.trim();
      const descripcion = document.getElementById("descripcion").value.trim();
      if (!nombre || !descripcion) {
          alert("Por favor, completa los campos obligatorios.");
          return;
      }

      //console.log("📤 Enviando datos de categoría:", { nombre, descripcion, subcategories });

      try {
          const response = await fetch("/categorias", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ NOMBRE_CAT: nombre, DESCRIPCION_CAT: descripcion, subcategorias })
          });

          if (response.ok) {
              alert("✅ Categoría registrada con éxito.");
              window.location.reload();
          } else {
              const error = await response.json();
              alert(error.message || "⚠️ Error al registrar la categoría.");
          }
      } catch (err) {
          console.error("❌ Error al enviar el formulario:", err);
          alert("⚠️ Error inesperado. Intenta de nuevo.");
      }
  });

  /*** 🟢 MANEJO DE EDICIÓN DE CATEGORÍAS ***/

  const editSubcategoryInput = document.getElementById("edit-subcategory-input");
  const editSubcategoryList = document.getElementById("edit-subcategory-list");
  const editCategoryIdInput = document.getElementById("edit-category-id");
  let etiquetas = [];
  let etiquetaEditando = { value: null };

  editSubcategoryInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
          event.preventDefault();
          handleAddEtiqueta(editSubcategoryInput, editSubcategoryList, etiquetas, etiquetaEditando);
      }
  });

  document.getElementById("form-edit-category").addEventListener("submit", async function (event) {
      event.preventDefault();

      const id = editCategoryIdInput.value;
      const nombre = document.getElementById("edit-category-name").value.trim();
      const descripcion = document.getElementById("edit-category-description").value.trim();
      const activo = document.getElementById("cb5").checked ? 1 : 0;

      // console.log("📤 Enviando actualización:", { id, nombre, descripcion, activo, etiquetas });

      try {
          const response = await fetch(`/categorias/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ NOMBRE_CAT: nombre, DESCRIPCION_CAT: descripcion, ACTIVO_CAT: activo, etiquetas })
          });

          if (response.ok) {
              alert("✅ Categoría y etiquetas actualizadas con éxito.");
              window.location.reload();
          } else {
              const error = await response.json();
              alert(error.message || "⚠️ Error al actualizar.");
          }
      } catch (err) {
          console.error("❌ Error al enviar la actualización:", err);
          alert("⚠️ Error inesperado.");
      }
  });

  $("#categoriesTable tbody").on("click", "tr", async function () {
      const categoryId = $(this).data("id");

      try {
          const response = await fetch(`/categorias/${categoryId}`);
          if (response.ok) {
              const categoryData = await response.json();

              document.getElementById("edit-category-id").value = categoryData.ID_CAT;
              document.getElementById("edit-category-name").value = categoryData.NOMBRE_CAT;
              document.getElementById("edit-category-description").value = categoryData.DESCRIPCION_CAT;
              document.getElementById("cb5").checked = categoryData.ACTIVO_CAT;

              etiquetas = categoryData.etiquetas.map(etq => ({ ID_ETQ: etq.ID_ETQ, NOMBRE_ETQ: etq.NOMBRE_ETQ }));
              renderEtiquetas(editSubcategoryList, etiquetas, etiquetaEditando);

              $("#modal-edit-category").modal("show");
          }
      } catch (error) {
          console.error("❌ Error al cargar la categoría:", error);
      }
  });
});
