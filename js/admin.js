// ======= PROTECCIÓN DE RUTA ===========
if (localStorage.getItem("usuarioLogueado") !== "admin") {
    window.location.href = "login.html";
}

// ======= VARIABLES PRINCIPALES ===========
let servicios = JSON.parse(localStorage.getItem("servicios")) || [];

const listaServicios = document.getElementById("listaServicios");
const btnAgregarServicio = document.getElementById("btnAgregarServicio");
const btnCancelar = document.getElementById("btnCancelarEdicion");
const mensajeAdmin = document.getElementById("mensajeAdmin");

let editIndex = null;


// ======= RENDERIZAR SERVICIOS ===========
function renderServicios() {
    listaServicios.innerHTML = "";

    if (servicios.length === 0) {
        listaServicios.innerHTML = "<p style='text-align:center;color:#777;'>No hay servicios cargados.</p>";
        return;
    }

    servicios.forEach((serv, i) => {
        const card = document.createElement("div");
        card.classList.add("admin-card");

        card.innerHTML = `
            <img src="../${serv.imagen}">
            <h4>${serv.nombre}</h4>
            <p>Precio: $${serv.precio.toLocaleString("es-AR")}</p>

            <div class="admin-btns">
                <button class="btn-editar" data-index="${i}">Editar</button>
                <button class="btn-eliminar" data-index="${i}">Eliminar</button>
            </div>
        `;

        listaServicios.appendChild(card);
    });
}

// ======= AGREGAR O EDITAR SERVICIO ===========
btnAgregarServicio.addEventListener("click", () => {
    const nombre = document.getElementById("nombreServicio").value.trim();
    const precio = Number(document.getElementById("precioServicio").value);
    const imagen = document.getElementById("imagenServicio").value.trim();

    if (!nombre || !precio || !imagen) {
        mensajeAdmin.textContent = "Complete todos los campos.";
        mensajeAdmin.style.color = "red";
        return;
    }

    const nuevoServicio = { nombre, precio, imagen };

    // Si estamos editando
    if (editIndex !== null) {
        servicios[editIndex] = nuevoServicio;

        Swal.fire("Cambios guardados", "", "success");
        btnAgregarServicio.textContent = "Agregar servicio";
        btnCancelar.style.display = "none";
        editIndex = null;

    } else {
        // Crear nuevo
        servicios.push(nuevoServicio);

        Swal.fire({
            icon: "success",
            title: "Servicio agregado",
            text: "El servicio ya aparece en la página principal.",
            timer: 1500,
            showConfirmButton: false
        });
    }

    localStorage.setItem("servicios", JSON.stringify(servicios));
    limpiarFormulario();
    renderServicios();
});

// ======= CANCELAR EDICIÓN ===========
btnCancelar.addEventListener("click", () => {
    limpiarFormulario();
    btnAgregarServicio.textContent = "Agregar servicio";
    btnCancelar.style.display = "none";
    editIndex = null;
});

function limpiarFormulario() {
    document.getElementById("nombreServicio").value = "";
    document.getElementById("precioServicio").value = "";
    document.getElementById("imagenServicio").value = "";
    mensajeAdmin.textContent = "";
}

// ======= BOTONES EDITAR / ELIMINAR ===========
document.addEventListener("click", (e) => {
    const i = e.target.dataset.index;

    // Editar
    if (e.target.classList.contains("btn-editar")) {
        const serv = servicios[i];

        document.getElementById("nombreServicio").value = serv.nombre;
        document.getElementById("precioServicio").value = serv.precio;
        document.getElementById("imagenServicio").value = serv.imagen;

        editIndex = i;

        btnAgregarServicio.textContent = "Guardar cambios";
        btnCancelar.style.display = "inline-block";
    }

    // Eliminar
    if (e.target.classList.contains("btn-eliminar")) {
        Swal.fire({
            icon: "warning",
            title: "¿Seguro?",
            text: "Este servicio será eliminado.",
            showCancelButton: true
        }).then(res => {
            if (res.isConfirmed) {
                servicios.splice(i, 1);
                localStorage.setItem("servicios", JSON.stringify(servicios));
                renderServicios();
                Swal.fire("Eliminado", "", "success");
            }
        });
    }
});

// ======= LOGOUT ===========
document.getElementById("btnLogout").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "login.html";
});

// ======= INICIAL ===========
renderServicios();

