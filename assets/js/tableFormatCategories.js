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
      columnDefs: [
        {
          targets: 3, // Columna de la fecha
          render: function (data) {
            if (!data) return "";
            const date = new Date(data);
            const day = date.getDate().toString().padStart(2, "0");
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
          },
        },
      ],
    });
  
    $("#categoriesTable tbody").on("click", "tr", async function () {
        const categoryId = $(this).data("id");
        try {
          const response = await fetch(`/categorias/${categoryId}`);
          if (response.ok) {
            const categoryData = await response.json();
            // Precargar datos en el modal
            $("#edit-category-id").val(categoryData.ID_CAT);
            $("#edit-category-name").val(categoryData.NOMBRE_CAT);
            $("#edit-category-description").val(categoryData.DESCRIPCION_CAT);
            // Cargar etiquetas
            const subcategoryList = $("#edit-subcategory-list");
            subcategoryList.empty();
            if (categoryData.etiquetas) {
              categoryData.etiquetas.forEach((etiqueta) => {
                subcategoryList.append(
                  `<div class="subcategory-tag">
                     <span>${etiqueta.NOMBRE_ETQ}</span>
                     <button type="button" data-name="${etiqueta.NOMBRE_ETQ}">&times;</button>
                   </div>`
                );
              });
            }
            $("#modal-edit-category").modal("show");
          }
        } catch (error) {
          console.error("Error al cargar los datos de la categoría:", error);
        }
      });
      
    const removeSubcategory = (name) => {
      $(`#edit-subcategory-list .remove-tag[data-name="${name}"]`).parent().remove();
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
  