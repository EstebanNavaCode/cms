document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('toggle-password');
    const passwordField = document.getElementById('password');

    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', () => {
            // Alternar el tipo de entrada entre 'password' y 'text'
            const type = passwordField.type === 'password' ? 'text' : 'password';
            passwordField.type = type;

            // Alternar entre los íconos de ojo abierto y cerrado
            togglePassword.name = type === 'password' ? 'eye-outline' : 'eye-off-outline';
        });
    }
});
