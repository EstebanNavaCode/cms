function resetModalElements(modal) {
  const preview = modal.querySelector(".image-preview img");
  const placeholder = modal.querySelector(".image-preview .placeholder-icon");
  const fileInput = modal.querySelector('input[type="file"]');

  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }
  if (placeholder) {
    placeholder.style.display = "block";
  }
  if (fileInput) {
    fileInput.value = "";
  }
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("hidden.bs.modal", function () {
    resetModalElements(modal);
    console.log(`Modal ${modal.id} cerrado y reiniciado.`);
  });
});

function previewImage(event) {
  const file = event.target.files[0];
  const container = event.target.closest(".form-container") || event.target.closest(".modal");
  const preview = container.querySelector(".image-preview img");
  const placeholder = container.querySelector(".image-preview .placeholder-icon");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      if (preview) {
        preview.src = e.target.result;
        preview.style.display = "block";
      }
      if (placeholder) {
        placeholder.style.display = "none";
      }
    };
    reader.readAsDataURL(file);
  } else {
    if (preview) {
      preview.src = "";
      preview.style.display = "none";
    }
    if (placeholder) {
      placeholder.style.display = "block";
    }
  }
}

document.querySelectorAll('input[type="file"]').forEach((input) => {
  input.addEventListener("change", previewImage);
});
