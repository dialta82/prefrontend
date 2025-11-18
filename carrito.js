// carrito.js — versión mínima, robusta y compatible con index + carrito.html

// --- utilidad: obtener carrito desde localStorage ---
function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  } catch (e) {
    console.error("localStorage parse error", e);
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// --- 1) Listener para AGREGAR al carrito (siempre activo) ---
document.addEventListener("click", (evt) => {
  const boton = evt.target.closest(".btn-carrito");
  if (!boton) return;

  const id = boton.dataset.id || Date.now().toString();
  const nombre = boton.dataset.nombre;
  const precio = Number(boton.dataset.precio);
  const imagen = boton.dataset.imagen || "";

  if (!nombre || isNaN(precio)) {
    alert("Datos del servicio incompletos.");
    return;
  }

  const carrito = obtenerCarrito();

  // buscamos por id, si existe sumamos cantidad, si no lo agregamos
  const index = carrito.findIndex(item => item.id === id);
  if (index > -1) {
    carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
  } else {
    carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
  }

  guardarCarrito(carrito);
  // feedback visual (puedes reemplazar por un toast más adelante)
  alert(`Servicio agregado: ${nombre}`);
});

// --- 2) Código de renderizado / eliminación SÓLO si estamos en la página del carrito ---
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("carrito-contenedor");
  const totalPagar = document.getElementById("total-pagar");
  if (!contenedor || !totalPagar) return; // no estamos en carrito.html

  function formatoPrecio(num) {
    return `$${Number(num).toLocaleString("es-AR")}`;
  }

  function renderizar() {
    const carrito = obtenerCarrito();
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
      contenedor.innerHTML = `<p style="grid-column:1/-1;text-align:center;">El carrito está vacío.</p>`;
      totalPagar.textContent = formatoPrecio(0);
      return;
    }

    let total = 0;

    carrito.forEach(item => {
      total += item.precio * (item.cantidad || 1);

      const art = document.createElement("article");
      art.className = "servicio-card";

      art.innerHTML = `
        <img src="../${item.imagen}" alt="${item.nombre}">
        <h4>${item.nombre}</h4>
        <p class="precio">${formatoPrecio(item.precio)}</p>
        <p>Cantidad: ${item.cantidad || 1}</p>
        <div style="margin-top:10px;">
          <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
        </div>
      `;

      contenedor.appendChild(art);
    });

    totalPagar.textContent = formatoPrecio(total);
  }

  // eliminar mediante delegación
  document.addEventListener("click", (evt) => {
    const btnElim = evt.target.closest(".btn-eliminar");
    if (!btnElim) return;

    const id = btnElim.dataset.id;
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito(carrito);
    renderizar();
  });

  renderizar();
});







