document.addEventListener("DOMContentLoaded", function () {
  fetch("/categoriesNEWS")
    .then((response) => response.json())
    .then((categories) => {
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

  fetch(`/subcategoriesNEWS/${categoryId}`)
    .then((response) => response.json())
    .then((labels) => {
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
  $("#newsTable").DataTable({
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
    columnDefs: [
      {
        targets: 2,
        render: function (data, type, row) {
          if (!data) return "";
          let words = data.split(" ");
          let shortText = words.slice(0, 30).join(" ");
          return shortText + (words.length > 30 ? "..." : "");
        },
      },
      {
        targets: 3,
        render: function (data) {
          if (!data) return "";
          let date = new Date(data);
          let day = date.getDate().toString().padStart(2, "0");
          let month = (date.getMonth() + 1).toString().padStart(2, "0");
          let year = date.getFullYear();
          return `${day}/${month}/${year}`;
        },
      },
    ],
  });
});
