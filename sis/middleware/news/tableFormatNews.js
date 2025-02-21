document.addEventListener("DOMContentLoaded", function () {
  // Cargar categorías al inicializar
  fetch("/categoriesNEWS")
    .then((response) => response.json())
    .then((categories) => {
      //console.log("Categorías cargadas:", categories);
      const categorySelect = document.getElementById("categoryNEWS");
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.ID_CAT;
        option.textContent = category.NOMBRE_CAT;
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar las categorías:", error));
});

document.getElementById("categoryNEWS").addEventListener("change", function () {
  const categoryId = this.value;
  //console.log("Categoría seleccionada:", categoryId);

  fetch(`/subcategoriesNEWS/${categoryId}`)
    .then((response) => response.json())
    .then((labels) => {
      //console.log("Etiquetas cargadas para la categoría:", categoryId, labels);
      const labelSelect = document.getElementById("labelNEWS");
      labelSelect.innerHTML =
        '<option value="" disabled selected hidden>Etiqueta</option>';
      labels.forEach((label) => {
        const option = document.createElement("option");
        option.value = label.ID_ETQ;
        option.textContent = label.NOMBRE_ETQ;
        labelSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar las etiquetas:", error));
});

$(document).ready(function () {
  const newsTable = $("#newsTable").DataTable({
    language: {
      lengthMenu: "Mostrar _MENU_ registros por página",
      zeroRecords: "No se encontraron noticias",
      info: "Mostrando _START_ a _END_ de _TOTAL_ noticias",
      infoEmpty: "No hay noticias disponibles",
      infoFiltered: "(filtrado de _MAX_ noticias en total)",
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
        targets: 2,
        render: function (data) {
          if (!data) return "";
          const words = data.split(" ");
          const shortText = words.slice(0, 30).join(" ");
          return shortText + (words.length > 30 ? "..." : "");
        },
      },
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
      },
    ],
  });

  $("#newsTable tbody").on("click", "tr", async function () {
    try {
      const rowData = newsTable.row(this).data();
      const newsId = $(this).data("id");
      const categoryId = $(this).data("category-id");
      const labelId = $(this).data("label-id");
      const isActiveRaw = $(this).data("active");

      const isActive =
        isActiveRaw == 1 || isActiveRaw === true || isActiveRaw === "true";
      // console.log("Estado actual en la tabla:", isActive);

      if (!newsId || isNaN(newsId)) {
        console.error("ID de la noticia no es válido:", newsId);
        alert("No se pudo cargar la noticia debido a un error en los datos.");
        return;
      }

      const cleanTitle =
        typeof rowData[1] === "string"
          ? rowData[1].trim().substring(0, 300)
          : "";
      const cleanText =
        typeof rowData[2] === "string"
          ? rowData[2].trim().substring(0, 1000)
          : "";
      const imagePath =
        $(this).data("image") || "/uploads/news/default-placeholder.jpg";

      //console.log("Imagen recibida en modal:", imagePath);

      $("#edit-id").val(newsId);
      $("#edit-title").val(cleanTitle);
      $("#edit-text").val(cleanText);
      $("#edit-date").val(new Date(rowData[3]).toISOString().split("T")[0]);

      $("#modal-register-news .image-preview img")
        .attr("src", imagePath)
        .show();

      $("#cb5").prop("checked", isActive);
      $("#modal-active").val(isActive ? 1 : 0);
      console.log("Estado cargado en modal:", isActive ? 1 : 0);

      await loadCategoriesAndLabels(categoryId, labelId);

      $("#modal-register-news").css("min-height", "500px").modal("show");
    } catch (error) {
      console.error("Error al abrir el modal:", error);
      alert("Ocurrió un error al abrir la noticia. Intenta nuevamente.");
    }
  });

  async function loadCategoriesAndLabels(categoryId, labelId) {
    try {
      const categorySelect = $("#edit-categoryNEWS");
      const labelSelect = $("#edit-labelNEWS");

      categorySelect
        .empty()
        .append('<option value="" disabled hidden>Categoría</option>');
      labelSelect
        .empty()
        .append('<option value="" disabled hidden>Etiqueta</option>');

      const categoriesResponse = await fetch("/categoriesNEWS");
      const categories = await categoriesResponse.json();
      categories.forEach((category) => {
        categorySelect.append(
          `<option value="${category.ID_CAT}">${category.NOMBRE_CAT}</option>`
        );
      });
      categorySelect.val(categoryId);

      await loadSubcategories(categoryId, labelId);
    } catch (error) {
      console.error("Error al cargar categorías o etiquetas:", error);
    }
  }

  async function loadSubcategories(categoryId, labelId) {
    try {
      const labelSelect = $("#edit-labelNEWS");

      labelSelect
        .empty()
        .append('<option value="" disabled hidden>Etiqueta</option>');

      const labelsResponse = await fetch(`/subcategoriesNEWS/${categoryId}`);
      const labels = await labelsResponse.json();
      labels.forEach((label) => {
        labelSelect.append(
          `<option value="${label.ID_ETQ}">${label.NOMBRE_ETQ}</option>`
        );
      });
      labelSelect.val(labelId);
    } catch (error) {
      console.error("Error al cargar las etiquetas:", error);
    }
  }

  $("#edit-categoryNEWS").on("change", async function () {
    const newCategoryId = $(this).val();
    //console.log("Nueva categoría seleccionada:", newCategoryId);

    if (newCategoryId) {
      await loadSubcategories(newCategoryId, null);
    }
  });

  $("#cb5").on("change", function () {
    const isChecked = this.checked;
    $("#modal-active").val(isChecked ? 1 : 0);
  });
});
