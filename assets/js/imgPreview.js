function previewImage(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("preview");
  const iconPlaceholder = document.getElementById("icon-placeholder");

  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
          preview.src = e.target.result;
          preview.style.display = "block"; // Muestra la imagen
          iconPlaceholder.style.display = "none"; // Oculta el ícono
      };
      reader.readAsDataURL(file);
  } else {
      preview.src = "";
      preview.style.display = "none"; // Oculta la imagen
      iconPlaceholder.style.display = "block"; // Muestra el ícono
  }
}
