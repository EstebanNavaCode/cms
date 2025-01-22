function previewImage(event) {
  const file = event.target.files[0];
  let preview, iconPlaceholder;

  if (event.target.id === "file") {
    preview = document.getElementById("preview");
    iconPlaceholder = document.getElementById("icon-placeholder");
  } else if (event.target.id === "modal-file") {
    preview = document.getElementById("modal-preview");
    iconPlaceholder = document.getElementById("icon-placeholder-modal");
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
      if (iconPlaceholder) iconPlaceholder.style.display = "none";
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
    if (iconPlaceholder) iconPlaceholder.style.display = "block";
  }
}

document
  .getElementById("modal-register-user")
  .addEventListener("hidden.bs.modal", function () {
    const modalPreview = document.getElementById("modal-preview");
    const modalIconPlaceholder = document.getElementById(
      "icon-placeholder-modal"
    );
    const modalFileInput = document.getElementById("modal-file");

    if (modalPreview) {
      modalPreview.src = "";
      modalPreview.style.display = "none";
    }
    if (modalIconPlaceholder) {
      modalIconPlaceholder.style.display = "block";
    }
    if (modalFileInput) {
      modalFileInput.value = "";
    }
  });

function previewImage(event) {
  const file = event.target.files[0];
  let preview, iconPlaceholder;

  // Identificar si el evento proviene del formulario principal o del modal
  if (event.target.id === "file") {
    preview = document.getElementById("preview");
    iconPlaceholder = document.getElementById("icon-placeholder");
  } else if (event.target.id === "modal-file") {
    preview = document.getElementById("modal-preview");
    iconPlaceholder = document.getElementById("icon-placeholder-modal");
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
      if (iconPlaceholder) iconPlaceholder.style.display = "none";
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
    if (iconPlaceholder) iconPlaceholder.style.display = "block";
  }
}

document
  .getElementById("modal-register-product")
  .addEventListener("hidden.bs.modal", function () {
    const modalPreview = document.getElementById("modal-preview");
    const modalIconPlaceholder = document.getElementById(
      "icon-placeholder-modal"
    );
    const modalFileInput = document.getElementById("modal-file");

    if (modalPreview) {
      modalPreview.src = "";
      modalPreview.style.display = "none";
    }
    if (modalIconPlaceholder) {
      modalIconPlaceholder.style.display = "block";
    }
    if (modalFileInput) {
      modalFileInput.value = "";
    }
  });
