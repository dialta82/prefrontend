// === Cargar servicios desde LocalStorage ===
let servicios = JSON.parse(localStorage.getItem("servicios")) || [];

// === Seleccionar contenedor ===
const contenedor = document.getElementById("servicios-dinamicos");

function renderServicios() {
  if (!contenedor) return;

  contenedor.innerHTML = "";

  servicios.forEach(serv => {
    const card = document.createElement("article");
    card.classList.add("servicio-card");

    card.innerHTML = `
      <img src="${serv.imagen}" alt="${serv.nombre}">
      <h4>${serv.nombre}</h4>
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
}

// Render inicial
renderServicios();
