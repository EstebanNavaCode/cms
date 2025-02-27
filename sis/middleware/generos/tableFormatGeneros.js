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
    order: [[3, "desc"]],
    columnDefs: [
      {
        targets: 3, // Índice de la columna de fecha
        type: "date",
        render: function (data, type, row) {
          if (!data) return "";

          const date = new Date(data);
          if (isNaN(date)) return data; // Si la fecha es inválida, retorna el valor original

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          // Para ordenar, retornar en formato YYYY-MM-DD
          if (type === "sort" || type === "type") {
            return `${year}-${month}-${day}`;
          }

          // Para mostrar en formato DD/MM/YYYY
          return `${day}/${month}/${year}`;
        },
      },
    ],
  });

  // Evento al hacer clic en una fila de la tabla para cargar el género en el modal
  $("#genresTable tbody").on("click", "tr", async function () {
    const genreId = $(this).data("id");

    try {
      const response = await fetch(`/generos/${genreId}`);
      if (response.ok) {
        const genreData = await response.json();

        // Rellenar los datos en el modal
        $("#edit-genero-id").val(genreData.ID_LCAT);
        $("#edit-genero-name").val(genreData.NOMBRE_LCAT);
        $("#edit-genero-description").val(genreData.DESCRIPCION_LCAT);
        $("#edit-genero-active").prop("checked", genreData.ACTIVO_LCAT);

        // Llenar los subgéneros en el modal
        let subgeneros = genreData.subgeneros.map((sub) => sub.NOMBRE_SBC);
        renderSubgeneros(subgeneros);

        $("#modal-edit-genero").modal("show");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar los datos",
        text: "Algo salió mal, intente de nuevo en un momento.",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(error);
    }
  });

  let subgeneros = [];
  let subgeneroEditando = null;

  const renderSubgeneros = (data) => {
    const editSubcategoryList = $("#edit-subcategory-list");
    editSubcategoryList.empty();
    subgeneros = data;
    subgeneros.forEach((subgenero, index) => {
      const tag = $(`<div class="subcategory-tag">
            <span>${subgenero}</span>
            <button type="button" class="remove-tag" data-index="${index}">&times;</button>
        </div>`);

      tag.find("span").on("click", function () {
        subgeneroEditando = index;
        $("#edit-subcategory-input").val(subgeneros[index]).focus();
      });

      tag.find(".remove-tag").on("click", function () {
        subgeneros.splice(index, 1);
        renderSubgeneros(subgeneros);
      });

      editSubcategoryList.append(tag);
    });

    // Actualiza el campo oculto con la lista de subgéneros
    $("#edit-subcategory-values").val(JSON.stringify(subgeneros));
  };

  // Evento de "Enter" en el input de subgénero
  $("#edit-subcategory-input").on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const name = $("#edit-subcategory-input").val().trim();
      if (!name) return;

      if (subgeneroEditando !== null) {
        subgeneros[subgeneroEditando] = name;
        subgeneroEditando = null;
      } else {
        subgeneros.push(name);
      }

      $("#edit-subcategory-input").val("");
      renderSubgeneros(subgeneros);
    }
  });

  // Evento al hacer clic en el botón checkmark en el modal
  $("#add-edit-subcategory-btn").on("click", function () {
    const name = $("#edit-subcategory-input").val().trim();
    if (!name) return;

    if (subgeneroEditando !== null) {
      subgeneros[subgeneroEditando] = name;
      subgeneroEditando = null;
    } else {
      subgeneros.push(name);
    }

    $("#edit-subcategory-input").val("");
    renderSubgeneros(subgeneros);
  });

  // Enviar el formulario de edición
  $("#form-edit-genero").submit(async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    let data = Object.fromEntries(formData.entries());

    data.subgeneros = JSON.stringify(subgeneros);
    data.ACTIVO_LCAT = $("#edit-genero-active").prop("checked") ? 1 : 0;

    try {
      const response = await fetch(`/generos/${data.ID_LCAT}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Género actualizado",
          text: result.message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: "Algo salió mal, intente de nuevo en un momento.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar al servidor. Inténtalo de nuevo.",
        showConfirmButton: false,
        timer: 1500,
      });
      console.error("Error:", error);
    }
  });
});
