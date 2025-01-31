$(document).ready(function () {
  const genresTable = $("#genresTable").DataTable({
    language: {
      lengthMenu: "Mostrar _MENU_ registros por página",
      zeroRecords: "No se encontraron géneros",
      info: "Mostrando _START_ a _END_ de _TOTAL_ géneros",
      infoEmpty: "No hay géneros disponibles",
      infoFiltered: "(filtrado de _MAX_ géneros en total)",
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
        targets: 3, // Formatear fecha de registro
        render: function (data) {
          if (!data) return "";
          const date = new Date(data);
          return date.toLocaleDateString("es-ES");
        },
      },
    ],
  });

  // 🔥 Evento para cargar datos de género en un modal (para edición futura)
  $(document).ready(function () {
    const genresTable = $("#genresTable").DataTable();

    $("#genresTable tbody").on("click", "tr", async function () {
      const genreId = $(this).data("id");

      try {
        const response = await fetch(`/generos/${genreId}`);
        if (response.ok) {
          const genreData = await response.json();

          $("#edit-genero-id").val(genreData.ID_LCAT);
          $("#edit-genero-name").val(genreData.NOMBRE_LCAT);
          $("#edit-genero-description").val(genreData.DESCRIPCION_LCAT);
          $("#edit-genero-active").prop("checked", genreData.ACTIVO_LCAT);

          const subcategoryList = $("#edit-subcategory-list");
          subcategoryList.html("");
          genreData.subgeneros.forEach((sub) => {
            subcategoryList.append(
              `<div class="subcategory-tag">${sub.NOMBRE_SBC} <button class="remove-tag">&times;</button></div>`
            );
          });

          $("#modal-edit-genero").modal("show");
        }
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
      }
    });

    $("#form-edit-genero").submit(async function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        let data = Object.fromEntries(formData.entries());
    
        // 🔥 Asegurar que `subgeneros` no se envíe vacío
        data.subgeneros = subgeneros.length > 0 ? JSON.stringify(subgeneros) : "[]";
    
        console.log("📤 Enviando solicitud PUT:", data);
    
        try {
            const response = await fetch(`/generos/${data.ID_LCAT}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("✅ Género actualizado con éxito");
                location.reload();
            } else {
                alert(result.message || "⚠️ Error al actualizar género.");
            }
        } catch (error) {
            console.error("❌ Error al enviar la solicitud:", error);
            alert("Error inesperado. Inténtalo de nuevo.");
        }
    });
    
  });
  $(document).ready(function () {
    const genresTable = $("#genresTable").DataTable();

    $("#genresTable tbody").on("click", "tr", async function () {
        const genreId = $(this).data("id");

        try {
            const response = await fetch(`/generos/${genreId}`);
            if (response.ok) {
                const genreData = await response.json();

                $("#edit-genero-id").val(genreData.ID_LCAT);
                $("#edit-genero-name").val(genreData.NOMBRE_LCAT);
                $("#edit-genero-description").val(genreData.DESCRIPCION_LCAT);
                $("#edit-genero-active").prop("checked", genreData.ACTIVO_LCAT);

                let subgeneros = genreData.subgeneros.map(sub => sub.NOMBRE_SBC);
                renderSubgeneros(subgeneros);

                $("#modal-edit-genero").modal("show");
            }
        } catch (error) {
            console.error("❌ Error al cargar datos:", error);
        }
    });

    const editSubcategoryInput = $("#edit-subcategory-input");
    const editSubcategoryList = $("#edit-subcategory-list");
    let subgeneros = [];
    let subgeneroEditando = null;

    const renderSubgeneros = (data) => {
        editSubcategoryList.empty();
        subgeneros = data;
        subgeneros.forEach((subgenero, index) => {
            const tag = $(`<div class="subcategory-tag">
                <span>${subgenero}</span>
                <button type="button" class="remove-tag" data-index="${index}">&times;</button>
            </div>`);

            tag.find("span").on("click", function () {
                subgeneroEditando = index;
                editSubcategoryInput.val(subgeneros[index]).focus();
            });

            tag.find(".remove-tag").on("click", function () {
                subgeneros.splice(index, 1);
                renderSubgeneros(subgeneros);
            });

            editSubcategoryList.append(tag);
        });
    };

    editSubcategoryInput.on("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const name = editSubcategoryInput.val().trim();
            if (!name) return;

            if (subgeneroEditando !== null) {
                subgeneros[subgeneroEditando] = name;
                subgeneroEditando = null;
            } else {
                subgeneros.push(name);
            }

            editSubcategoryInput.val("");
            renderSubgeneros(subgeneros);
        }
    });

    $("#form-edit-genero").submit(async function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        data.subgeneros = JSON.stringify(subgeneros);

        const response = await fetch(`/generos/${data.ID_LCAT}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert("✅ Género actualizado con éxito");
            location.reload();
        } else {
            alert("⚠️ Error al actualizar género.");
        }
    });
});

});
