$(document).ready(function () {
  const categoryTable = $("#categoriesTable").DataTable({
    language: {
      lengthMenu: "Mostrar _MENU_ registros por página",
      zeroRecords: "No se encontraron categorías",
      info: "Mostrando _START_ a _END_ de _TOTAL_ categorías",
      infoEmpty: "No hay categorías disponibles",
      infoFiltered: "(filtrado de _MAX_ categorías en total)",
      search: "Buscar:",
      paginate: {
        first: "Primero",
        last: "Último",
        next: "Siguiente",
        previous: "Anterior",
      },
    },
    order: [[3, "desc"]],
    columnDefs: [
      {
        targets: 3,
        type: "date",
        render: function (data, type, row) {
          if (!data) return "";

          const date = new Date(data);
          if (isNaN(date)) return data;

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          if (type === "sort" || type === "type") {
            return `${year}-${month}-${day}`;
          }

          return `${day}/${month}/${year}`;
        },
      }

    ],
  });

  $("#categoriesTable tbody").on("click", "tr", async function () {
    const categoryId = $(this).data("id");

    try {
      const response = await fetch(`/categorias/${categoryId}`);
      if (response.ok) {
        const categoryData = await response.json();

        $("#edit-category-id").val(categoryData.ID_CAT);
        $("#edit-category-name").val(categoryData.NOMBRE_CAT);
        $("#edit-category-description").val(categoryData.DESCRIPCION_CAT);
        $("#cb5").prop("checked", categoryData.ACTIVO_CAT);

        $("#modal-edit-category").modal("show");
      }
    } catch (error) {
      console.error("Error al cargar los datos de la categoría:", error);
    }
  });

  const removeSubcategory = (name) => {
    $(`#edit-subcategory-list .remove-tag[data-name="${name}"]`)
      .parent()
      .remove();
  };

  $("#add-subcategory").on("click", () => {
    const newTag = $("#edit-subcategory-input").val().trim();
    if (newTag) {
      const subcategoryList = $("#edit-subcategory-list");
      const tagElement = `
          <div class="subcategory-tag">
            <span>${newTag}</span>
            <button type="button" class="remove-tag" data-name="${newTag}">&times;</button>
          </div>
        `;
      subcategoryList.append(tagElement);
      $(`.remove-tag[data-name="${newTag}"]`).on("click", function () {
        removeSubcategory(newTag);
      });

      $("#edit-subcategory-input").val("");
    }
  });
});
