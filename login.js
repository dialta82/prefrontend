// --- USUARIO ADMIN SIMULADO ---
const adminUser = {
    email: "admin@manosos.com",
    password: "12345"
};

document.getElementById("btnLogin").addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();
    const error = document.getElementById("error");

    // Limpio mensaje anterior
    error.textContent = "";

    // Validaciones simples
    if (email === "" || pass === "") {
        error.textContent = "Complete todos los campos.";
        return;
    }

    if (email === adminUser.email && pass === adminUser.password) {
        // Guardamos sesión simulada
        localStorage.setItem("usuarioLogueado", "admin");

        // Redirigimos al panel admin
        window.location.href = "admin.html";
    } else {
        error.textContent = "Credenciales incorrectas.";
    }
});
