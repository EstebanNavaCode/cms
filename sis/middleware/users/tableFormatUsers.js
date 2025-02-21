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
      order: [[5, "desc"]], // Ordenar por fecha en orden descendente (último registro primero)
      columnDefs: [
        {
          targets: 5,
          type: "date",
          render: function (data, type, row) {
            if (!data) return "";

            let date = new Date(data);
            if (isNaN(date)) {
              console.log("⚠️ Fecha inválida detectada:", data);
              return data;
            }

            let day = date.getDate().toString().padStart(2, "0");
            let month = (date.getMonth() + 1).toString().padStart(2, "0");
            let year = date.getFullYear();
            let formattedDate = `${day}/${month}/${year}`;

            if (type === "sort" || type === "type") {
              return `${year}-${month}-${day}`;
            }

            return formattedDate;
          },
        },
      ],
    });

    $("#usersTable tbody").on("click", "tr", function () {
      let rowData = table.row(this).data();
      if (!rowData) return;

      //console.log("🔹 Datos de la fila seleccionada:", rowData);

      // Asignar valores al modal
      $("#modal-id").val(rowData[0] || "");
      $("#modal-name").val(rowData[1] || "");
      $("#modal-lastname").val(rowData[2] || "");
      $("#modal-correo").val(rowData[3] || "");

      // Mapear tipo de usuario
      const tipoUsuarioMap = { ADMIN: 1, GERENTE: 2, COLABORADOR: 3 };
      $("#type-modal").val(tipoUsuarioMap[rowData[4]] || "");

      // **Corregir la extracción del estado**
      const estadoHTML = rowData[6] || ""; // Obtener el valor de la columna estado
      const tempDiv = document.createElement("div"); // Crear un div temporal
      tempDiv.innerHTML = estadoHTML; // Insertar el HTML
      const estadoUsuario = tempDiv.textContent.trim().toLowerCase(); // Extraer solo el texto

      const isActive = estadoUsuario === "activo"; // Comparar solo con texto

      //console.log("🔹 Estado detectado:", estadoUsuario, "| isActive:", isActive);

      // **Verificar si los checkboxes existen**
      if ($("#modal-active").length > 0) {
        $("#modal-active").prop("checked", isActive).trigger("change");
      } else {
        console.error("⚠️ No se encontró el checkbox #modal-active");
      }

      if ($("#cb5").length > 0) {
        $("#cb5").prop("checked", isActive).trigger("change");
      } else {
        console.error("⚠️ No se encontró el checkbox #cb5");
      }

      // Manejo de la imagen
      let imageUrl = rowData[7] ? rowData[7].trim() : "";

      if (imageUrl.includes("<img")) {
        imageUrl = imageUrl.replace(
          /<img[^>]+src=['"]([^'"]+)['"][^>]*>/,
          "$1"
        );
      }

      if (!imageUrl || imageUrl === "NULL") {
        imageUrl = "/assets/img/default-placeholder.jpg";
      } else if (!imageUrl.startsWith("/uploads/pics/")) {
        imageUrl = `/uploads/pics/${imageUrl.replace("uploads/pics/", "")}`;
      }

      //console.log("✅ URL final de la imagen:", imageUrl);

      // Asegurar que la imagen sea visible
      $("#preview-user")
        .attr("src", imageUrl)
        .css("display", "block")
        .css("visibility", "visible");

      // Mostrar el modal
      $("#modal-register-user").modal("show");
    });
  }
});
