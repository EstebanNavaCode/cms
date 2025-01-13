document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById("toggle-password");
  const passwordField = document.getElementById("password");

  if (togglePassword && passwordField) {
    togglePassword.addEventListener("click", () => {
      const type = passwordField.type === "password" ? "text" : "password";
      passwordField.type = type;

      togglePassword.name =
        type === "password" ? "eye-outline" : "eye-off-outline";
    });
  }
});
