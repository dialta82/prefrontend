// ========================
// RENDER DINÁMICO DE SERVICIOS
// ========================

// Obtener servicios del localStorage
/*let servicios = JSON.parse(localStorage.getItem("servicios")) || [];

// Contenedor donde van las tarjetas
const contenedorServicios = document.getElementById("servicios-dinamicos");

// Si el contenedor existe (solo en index)
if (contenedorServicios) {
    
    function renderServiciosDinamicos() {

        contenedorServicios.innerHTML = "";

        servicios.forEach(serv => {

            const card = document.createElement("article");
            card.classList.add("servicio-card");

            card.innerHTML = `
                <img src="${serv.imagen}" alt="${serv.nombre}">
                <h4>${serv.nombre}</h4>
                <p>${serv.descripcion || "Servicio disponible"}</p>
                <p class="precio">$${serv.precio.toLocaleString("es-AR")}</p>

                <button class="btn-carrito"
                    data-nombre="${serv.nombre}"
                    data-precio="${serv.precio}"
                    data-imagen="${serv.imagen}">
                    Agregar al carrito
                </button>
            `;

            contenedorServicios.appendChild(card);
        });
    }

    renderServiciosDinamicos();
}*/
document.addEventListener("DOMContentLoaded", () => {
    console.log("Render dinámico listo");

    const contenedor = document.getElementById("servicios-dinamicos");

    if (!contenedor) {
        console.error("❌ No se encontró el contenedor #servicios-dinamicos");
        return;
    }

    const servicios = JSON.parse(localStorage.getItem("servicios")) || [];

    contenedor.innerHTML = "";

    if (servicios.length === 0) {
        contenedor.innerHTML = `
            <p style="grid-column:1/-1;text-align:center;font-size:1.1rem;color:#666;">
                No hay servicios cargados por el administrador.
            </p>`;
        return;
    }

    servicios.forEach(serv => {
        const card = document.createElement("article");
        card.classList.add("servicio-card");

        card.innerHTML = `
            <img src="${serv.imagen}" alt="${serv.nombre}">
            <h4>${serv.nombre}</h4>
            <p>Servicio disponible</p>
            <p class="precio">$${serv.precio.toLocaleString("es-AR")}</p>

            <button class="btn-carrito"
                data-nombre="${serv.nombre}"
                data-precio="${serv.precio}"
                data-imagen="${serv.imagen}">
                Agregar al carrito
            </button>
        `;

        contenedor.appendChild(card);
    });
});

