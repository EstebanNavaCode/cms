$(document).ready(function () {
  $("#usersTable").DataTable({
    language: {
      lengthMenu: "Mostrar _MENU_ registros por página",
      zeroRecords: "No se encontraron resultados",
      info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
      infoEmpty: "No hay registros disponibles",
      infoFiltered: "(filtrado de _MAX_ registros en total)",
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
        targets: 5, // Formato de fecha
        render: function (data, type, row) {
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
