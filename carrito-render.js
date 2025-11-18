// === OBTENER EL CARRITO DESDE LOCALSTORAGE ===
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Intentamos capturar elementos SOLO si existen
const contenedor = document.getElementById("carrito-contenedor");
const totalPagar = document.getElementById("total-pagar");

// Si estos elementos NO están en el DOM → estamos en index.html
// Entonces NO intentamos renderizar nada
if (contenedor && totalPagar) {

    function mostrarCarrito() {
        contenedor.innerHTML = "";
        let total = 0;

        carrito.forEach(item => {
            total += item.precio;

            const card = document.createElement("article");
            card.classList.add("servicio-card");

            card.innerHTML = `
                <img src="../${item.imagen}" alt="${item.nombre}">
                <h4>${item.nombre}</h4>
                <p class="precio">$${item.precio.toLocaleString("es-AR")}</p>
                <button class="btn-eliminar" data-nombre="${item.nombre}">
                    Eliminar
                </button>
            `;

            contenedor.appendChild(card);
        });

        totalPagar.textContent = `$${total.toLocaleString("es-AR")}`;
    }

    // Activar eliminar desde el carrito
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("btn-eliminar")) {
            const nombre = event.target.dataset.nombre;

            carrito = carrito.filter(item => item.nombre !== nombre);
            localStorage.setItem("carrito", JSON.stringify(carrito));

            mostrarCarrito();
        }
    });

    // Mostrar carrito al cargar
    mostrarCarrito();
}
