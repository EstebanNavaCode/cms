$(document).ready(function () {
  if (!$.fn.DataTable.isDataTable("#usersTable")) {
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

    $("#usersTable tbody").on("click", "tr", function () {
      let rowData = table.row(this).data();
      if (!rowData) return;

      //console.log("🔹 Datos de la fila seleccionada:", rowData);

      $("#modal-id").val(rowData[0] || "");
      $("#modal-name").val(rowData[1] || "");
      $("#modal-lastname").val(rowData[2] || "");
      $("#modal-correo").val(rowData[3] || "");

      const tipoUsuarioMap = { ADMIN: 1, GERENTE: 2, COLABORADOR: 3 };
      $("#type-modal").val(tipoUsuarioMap[rowData[4]] || "");

      const isActive = rowData[6]?.toString().toLowerCase().includes("activo");
      $("#modal-active").prop("checked", isActive);
      $("#cb5").prop("checked", isActive);

      //console.log("🟡 Valor original de rowData[7]:", rowData[7]);

      let imageUrl = rowData[7] ? rowData[7].trim() : "";

      if (imageUrl.includes("<img")) {
        imageUrl = imageUrl.replace(
          /<img[^>]+src=['"]([^'"]+)['"][^>]*>/,
          "$1"
        );
       /* console.log(
          "🔵 Imagen corregida tras eliminar etiquetas HTML:",
          imageUrl
        );*/
      }

      if (!imageUrl || imageUrl === "NULL") {
        imageUrl = "/assets/img/default-placeholder.jpg";
        //console.log("🟠 No se encontró imagen, usando placeholder.");
      } else if (!imageUrl.startsWith("/uploads/pics/")) {
        imageUrl = `/uploads/pics/${imageUrl.replace("uploads/pics/", "")}`;
        //console.log("🟢 Imagen corregida con ruta completa:", imageUrl);
      }

      //console.log("✅ URL final de la imagen en el modal:", imageUrl);

      // **Corrección: Asegurar que la imagen sea visible**
      $("#preview-user")
        .attr("src", imageUrl)
        .css("display", "block")
        .css("visibility", "visible");

      $("#modal-register-user").modal("show");
    });
  }
});
