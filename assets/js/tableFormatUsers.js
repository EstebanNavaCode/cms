$(document).ready(function () {
  let table = $("#usersTable").DataTable({
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
        targets: 5,
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

  $("#usersTable tbody").on("click", "tr", function () {
    let rowData = table.row(this).data();

    if (rowData) {
      $("#modal-id").val(rowData[0]);
      $("#modal-name").val(rowData[1]);
      $("#modal-lastname").val(rowData[2]);
      $("#modal-correo").val(rowData[3]);

      const tipoUsuarioMap = {
        ADMIN: 1,
        GERENTE: 2,
        COLABORADOR: 3,
      };

      const tipoUsuarioValue = tipoUsuarioMap[rowData[4]];
      $("#type-modal").val(tipoUsuarioValue);

      const isActive = rowData[6].includes("Activo");
      $("#modal-active").prop("checked", isActive);
      $("#cb5").prop("checked", isActive);

      $("#modal-register-user").modal("show");
    }
  });
});

function updateCheckboxState() {
  const visualCheckbox = document.getElementById("cb5");
  const hiddenCheckbox = document.getElementById("modal-active");

  hiddenCheckbox.checked = visualCheckbox.checked;
}
