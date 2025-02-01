document.addEventListener("DOMContentLoaded", function () {
  const categorySelect = document.getElementById("modal-category");
  const subcategorySelect = document.getElementById("modal-subcategory");

  if (!categorySelect || !subcategorySelect) {
      console.error("❌ No se encontraron los selectores de categoría o subcategoría en el DOM.");
      return;
  }

  async function loadCategories() {
      try {
          const response = await fetch("/categories");
          if (!response.ok) throw new Error("Error al cargar las categorías.");
          const categories = await response.json();

          categorySelect.innerHTML = '<option value="" disabled selected hidden>Seleccione categoría</option>';
          categories.forEach(category => {
              const option = document.createElement("option");
              option.value = category.ID_LCAT;
              option.textContent = category.NOMBRE_LCAT;
              categorySelect.appendChild(option);
          });

          console.log("✅ Categorías cargadas correctamente.");
      } catch (error) {
          console.error("⚠️ Error al cargar categorías:", error);
      }
  }

  async function loadSubcategories(categoryId) {
      try {
          if (!categoryId) return;
          const response = await fetch(`/subcategories/${categoryId}`);
          if (!response.ok) throw new Error("Error al cargar las subcategorías.");
          const subcategories = await response.json();

          subcategorySelect.innerHTML = '<option value="" disabled selected hidden>Seleccione subcategoría</option>';
          subcategories.forEach(subcategory => {
              const option = document.createElement("option");
              option.value = subcategory.ID_SBC;
              option.textContent = subcategory.NOMBRE_SBC;
              subcategorySelect.appendChild(option);
          });

          console.log("✅ Subcategorías cargadas correctamente.");
      } catch (error) {
          console.error("⚠️ Error al cargar subcategorías:", error);
      }
  }

  loadCategories();

  categorySelect.addEventListener("change", function () {
      loadSubcategories(this.value);
  });

  let table = $("#productsTable").DataTable({
      columnDefs: [{ targets: [6], visible: true }, { targets: [7], visible: true }],
      language: {
          lengthMenu: "Mostrar _MENU_ registros por página",
          zeroRecords: "No se encontraron productos",
          info: "Mostrando _START_ a _END_ de _TOTAL_ productos",
          infoEmpty: "No hay productos disponibles",
          infoFiltered: "(filtrado de _MAX_ productos en total)",
          search: "Buscar:",
          paginate: { first: "Primero", last: "Último", next: "Siguiente", previous: "Anterior" },
      },
  });

  $("#productsTable tbody").on("click", "tr", async function () {
      const rowData = table.row(this).data();
      if (!rowData) return;

      console.log("🔹 Datos de la fila seleccionada:", rowData);

      $("#modal-id").val(rowData[0]);
      $("#modal-name").val(rowData[1]);
      $("#modal-autor").val(rowData[2]);
      $("#modal-editorial").val(rowData[3]);
      $("#modal-isbn").val(rowData[4]);
      $("#modal-stock").val(rowData[5]);

      const categoryName = rowData[6];
      const subcategoryName = rowData[7];

      const estadoHtml = rowData[8]?.trim();
      const estado = estadoHtml.replace(/<[^>]+>/g, "").trim();
      const isActive = estado === "Disponible";
      $("#modal-active").prop("checked", isActive);
      $("#cb5").prop("checked", isActive);

      await loadCategories();
      await selectCategoryAndSubcategory(categoryName, subcategoryName);

      let imageUrl = rowData[9] ? rowData[9].trim() : "/assets/img/default-placeholder.jpg";
      if (imageUrl.includes("<img")) {
          imageUrl = imageUrl.replace(/<img[^>]+src=['"]([^'"]+)['"][^>]*>/, "$1");
      }
      $("#preview-product").attr("src", imageUrl)
          .css({ display: "block", visibility: "visible", width: "100%", height: "auto" })
          .off("error")
          .on("error", function () {
              if ($(this).attr("src") !== "/assets/img/default-placeholder.jpg") {
                  console.log("⚠️ Imagen no encontrada, usando placeholder.");
                  $(this).attr("src", "/assets/img/default-placeholder.jpg");
              }
          });

      $("#modal-register-product").modal("show");
  });

  async function selectCategoryAndSubcategory(categoryName, subcategoryName) {
      try {
          await new Promise(resolve => setTimeout(resolve, 500));

          const categoryOption = Array.from(categorySelect.options).find(option => option.textContent === categoryName);
          if (!categoryOption) {
              console.error("❌ Categoría no encontrada:", categoryName);
              return;
          }

          categorySelect.value = categoryOption.value;
          await loadSubcategories(categoryOption.value);

          const subcategoryOption = Array.from(subcategorySelect.options).find(option => option.textContent === subcategoryName);
          if (subcategoryOption) {
              subcategorySelect.value = subcategoryOption.value;
          }

          console.log("✅ Categoría y subcategoría seleccionadas correctamente.");
      } catch (error) {
          console.error("⚠️ Error al cargar categoría y subcategorías:", error);
      }
  }

  function updateCheckboxState() {
      const visibleCheckbox = document.getElementById("cb5");
      const hiddenCheckbox = document.getElementById("modal-active");
      hiddenCheckbox.checked = visibleCheckbox.checked;
  }
});
