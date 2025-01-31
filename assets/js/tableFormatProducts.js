document.addEventListener("DOMContentLoaded", function () {
  const categorySelect = document.getElementById("modal-category");
  const subcategorySelect = document.getElementById("modal-subcategory");

  if (!categorySelect || !subcategorySelect) {
    console.error(
      "No se encontraron los selectores de categoría o subcategoría en el DOM."
    );
    return;
  }

  fetch("/categories")
    .then((response) => response.json())
    .then((categories) => {
      //console.log("Categorías obtenidas:", categories);
      categorySelect.innerHTML =
        '<option value="" disabled selected hidden>Seleccione categoría</option>';
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.ID_LCAT;
        option.textContent = category.NOMBRE_LCAT;
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar las categorías:", error));

  categorySelect.addEventListener("change", function () {
    const categoryId = this.value;
    //console.log("Categoría seleccionada:", categoryId);

    fetch(`/subcategories/${categoryId}`)
      .then((response) => response.json())
      .then((subcategories) => {
        //console.log("Subcategorías obtenidas:", subcategories);
        subcategorySelect.innerHTML =
          '<option value="" disabled selected hidden>Seleccione subcategoría</option>';
        subcategories.forEach((subcategory) => {
          const option = document.createElement("option");
          option.value = subcategory.ID_SBC;
          option.textContent = subcategory.NOMBRE_SBC;
          subcategorySelect.appendChild(option);
        });
      })
      .catch((error) =>
        console.error("Error al cargar las subcategorías:", error)
      );
  });

  let table = $("#productsTable").DataTable({
    columnDefs: [
      { targets: [6], visible: true },
      { targets: [7], visible: true },
    ],
    language: {
      lengthMenu: "Mostrar _MENU_ registros por página",
      zeroRecords: "No se encontraron productos",
      info: "Mostrando _START_ a _END_ de _TOTAL_ productos",
      infoEmpty: "No hay productos disponibles",
      infoFiltered: "(filtrado de _MAX_ productos en total)",
      search: "Buscar:",
      paginate: {
        first: "Primero",
        last: "Último",
        next: "Siguiente",
        previous: "Anterior",
      },
    },
  });

  $("#productsTable tbody").on("click", "tr", async function () {
    const rowData = table.row(this).data();

    if (rowData) {
      $("#modal-id").val(rowData[0]);
      $("#modal-name").val(rowData[1]);
      $("#modal-autor").val(rowData[2]);
      $("#modal-editorial").val(rowData[3]);
      $("#modal-isbn").val(rowData[4]);
      $("#modal-stock").val(rowData[5]);

      const categoryName = rowData[6];
      const subcategoryName = rowData[7];

      const estadoHtml = rowData[8]?.trim();
      //console.log("Estado actual del producto (con etiquetas):", estadoHtml);

      const estado = estadoHtml.replace(/<[^>]+>/g, "").trim();
      //console.log("Estado actual del producto (limpio):", estado);

      if (estado === "Disponible") {
        $("#modal-active").prop("checked", true);
        $("#cb5").prop("checked", true);
        //console.log("El producto está marcado como 'Disponible'.");
      } else if (estado === "No Disponible") {
        $("#modal-active").prop("checked", false);
        $("#cb5").prop("checked", false);
        //console.log("El producto está marcado como 'No Disponible'.");
      } else {
        console.warn("Estado desconocido o inválido:", estado);
      }
      await selectCategoryAndSubcategory(categoryName, subcategoryName);

      $("#modal-register-product").modal("show");
    }
  });

  const selectCategoryAndSubcategory = async (
    categoryName,
    subcategoryName
  ) => {
    try {
      const categoryOption = Array.from(categorySelect.options).find(
        (option) => option.textContent === categoryName
      );

      if (categoryOption) {
        categorySelect.value = categoryOption.value;

        const response = await fetch(`/subcategories/${categoryOption.value}`);
        if (response.ok) {
          const subcategories = await response.json();
          //console.log("Subcategorías obtenidas:", subcategories);
          subcategorySelect.innerHTML =
            '<option value="" disabled selected hidden>Seleccione subcategoría</option>';
          subcategories.forEach((subcategory) => {
            const option = document.createElement("option");
            option.value = subcategory.ID_SBC;
            option.textContent = subcategory.NOMBRE_SBC;
            subcategorySelect.appendChild(option);
          });

          const subcategoryOption = Array.from(subcategorySelect.options).find(
            (option) => option.textContent === subcategoryName
          );

          if (subcategoryOption) {
            subcategorySelect.value = subcategoryOption.value;
          }
        } else {
          console.error(
            "Error al cargar las subcategorías:",
            response.statusText
          );
        }
      } else {
        console.error("Categoría no encontrada:", categoryName);
      }
    } catch (error) {
      console.error("Error al cargar categoría y subcategorías:", error);
    }
  };
});

function updateCheckboxState() {
  const visibleCheckbox = document.getElementById("cb5");
  const hiddenCheckbox = document.getElementById("modal-active");

  hiddenCheckbox.checked = visibleCheckbox.checked;
}
