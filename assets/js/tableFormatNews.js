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

  $("#newsTable tbody").on("click", "tr", async function () {
    try {
      const rowData = newsTable.row(this).data();
      const categoryId = $(this).data("category-id"); 
      const labelId = $(this).data("label-id"); 
  
      if (!categoryId || isNaN(Number(categoryId))) {
        console.error("Categoría inválida o no encontrada:", categoryId);
        return;
      }
  
      try {
        const categoriesResponse = await fetch("/categoriesNEWS");
        const categories = await categoriesResponse.json();
        const categorySelect = document.getElementById("edit-categoryNEWS");
        categorySelect.innerHTML =
          '<option value="" disabled hidden>Categoría</option>';
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.ID_CAT;
          option.textContent = category.NOMBRE_CAT;
          categorySelect.appendChild(option);
        });
        categorySelect.value = categoryId;
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
  
      try {
        const labelsResponse = await fetch(`/subcategoriesNEWS/${categoryId}`);
        const labels = await labelsResponse.json();
        const labelSelect = document.getElementById("edit-labelNEWS");
        labelSelect.innerHTML =
          '<option value="" disabled hidden>Etiqueta</option>';
        labels.forEach((label) => {
          const option = document.createElement("option");
          option.value = label.ID_ETQ;
          option.textContent = label.NOMBRE_ETQ;
          labelSelect.appendChild(option);
        });
        labelSelect.value = labelId; 
      } catch (error) {
        console.error("Error al cargar etiquetas:", error);
      }
  
      document.getElementById("edit-title").value = rowData[1]; 
      document.getElementById("edit-text").value = rowData[2]; 
      document.getElementById("edit-date").value = new Date(rowData[3])
        .toISOString()
        .split("T")[0]; 

      $("#modal-register-news").modal("show");
    } catch (error) {
      console.error("Error al abrir el modal:", error);
    }
  });
  
});
