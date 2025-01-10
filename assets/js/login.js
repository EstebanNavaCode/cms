document.getElementById("login-cms").addEventListener("submit", async function (event) {

    event.preventDefault()
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Acceso correcto',
                    text: 'Ingresando al sistema',
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    window.location.href = '/dashboard';
                });
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error',
                    text: result.message,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        }
        
    } catch (error) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            text: 'Error al ingresar al sistema',
            showConfirmButton: false,
            timer: 1500,
        });
    }   
});

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>