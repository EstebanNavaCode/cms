document.addEventListener("DOMContentLoaded", function () {
  fetch("/categories")
    .then((response) => response.json())
    .then((categories) => {
      const categorySelect = document.getElementById("category");
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.ID_LCAT;
        option.textContent = category.NOMBRE_LCAT;
        categorySelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error al cargar las categorías:", error));
});

document.getElementById("category").addEventListener("change", function () {
  const categoryId = this.value;

  fetch(`/subcategories/${categoryId}`)
    .then((response) => response.json())
    .then((subcategories) => {
      const subcategorySelect = document.getElementById("subcategory");
      subcategorySelect.innerHTML =
        '<option value="" disabled selected hidden>Subcategoría</option>';
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

$(document).ready(function () {
  $("#productsTable").DataTable({
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
});
