// js/herramientas.js
console.log("herramientas.js cargado OK");

document.addEventListener("DOMContentLoaded", () => {

  // === Datos iniciales ===
  const HERRAMIENTAS_SEED = [
    {
      id: "taladro-percutor",
      nombre: "Taladro percutor",
      precio: 45000,
      imagen: "imagenes/herramientas/taladro.png",
      descripcion: "Motor de 800W, velocidad variable, modo percutor para mampostería."
    },
    {
      id: "amoladora-angular",
      nombre: "Amoladora angular",
      precio: 50000,
      imagen: "imagenes/herramientas/amoladora.png",
      descripcion: "Disco de 115 mm, protección térmica, mango ergonómico."
    },
    {
      id: "lijadora-orbital",
      nombre: "Lijadora orbital",
      precio: 40000,
      imagen: "imagenes/herramientas/lijadora.png",
      descripcion: "Potencia 300W, 6 niveles de vibración."
    }
  ];

  // Keys unificadas
  const LS_KEY_HERR = "herramientas";
  const LS_KEY_CARR = "carritoHerramientas";

  // DOM
  const grid = document.getElementById("herramientas-grid");
  const modalEl = document.getElementById("herramientaModal");
  const bsModal = new bootstrap.Modal(modalEl);

  const titulo = document.getElementById("herrTitulo");
  const img = document.getElementById("herrImagen");
  const precio = document.getElementById("herrPrecio");
  const desc = document.getElementById("herrDescripcion");
  const cantidadInput = document.getElementById("cantidadHerr");
  const btnAgregarModal = document.getElementById("btnAgregarCarritoModal");

  const badge = document.getElementById("contador-carrito");
  const carritoBtn = document.getElementById("carrito-flotante");

  // Herramientas desde LS
  function getHerramientas() {
    const stored = JSON.parse(localStorage.getItem(LS_KEY_HERR));
    if (stored && stored.length) return stored;

    localStorage.setItem(LS_KEY_HERR, JSON.stringify(HERRAMIENTAS_SEED));
    return HERRAMIENTAS_SEED;
  }

  // Carrito
  function getCarrito() {
    return JSON.parse(localStorage.getItem(LS_KEY_CARR)) || [];
  }

  function setCarrito(c) {
    localStorage.setItem(LS_KEY_CARR, JSON.stringify(c));
    updateBadge();
  }

  function updateBadge() {
    const carrito = getCarrito();
    const total = carrito.reduce((a, i) => a + (i.cantidad || 1), 0);
    badge.textContent = total;

    badge.classList.remove("carrito-anim");
    void badge.offsetWidth;
    badge.classList.add("carrito-anim");
  }

  // Render tarjetas
  function renderHerramientas() {
    console.log("Render herramientas()");

    const herramientas = getHerramientas();
    grid.innerHTML = "";

    herramientas.forEach(h => {
      const card = document.createElement("article");
      card.classList.add("herr-card");
      card.innerHTML = `
        <img src="${h.imagen}" alt="${h.nombre}">
        <h4>${h.nombre}</h4>
        <p class="precio">$${Number(h.precio).toLocaleString("es-AR")}</p>
        <p class="mini-desc">${h.descripcion.slice(0, 60)}...</p>

        <div class="btn-group">
          <button class="btn btn-outline-primary btn-sm btn-ver" data-id="${h.id}">Ver más</button>
          <button class="btn btn-warning btn-sm btn-add" data-id="${h.id}">Agregar</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Modal detalle
  function abrirDetalle(id) {
    const h = getHerramientas().find(x => x.id === id);
    if (!h) return;

    titulo.textContent = h.nombre;
    img.src = h.imagen;
    precio.textContent = `$${h.precio.toLocaleString("es-AR")}`;
    desc.textContent = h.descripcion;
    cantidadInput.value = 1;

    btnAgregarModal.onclick = () => {
      agregarAlCarrito(h, Number(cantidadInput.value));
      bsModal.hide();

      Swal.fire({
        icon: "success",
        title: "Agregado",
        text: `${h.nombre} agregado al carrito`,
        timer: 1200,
        showConfirmButton: false
      });
    };

    bsModal.show();
  }

  // Agregar al carrito
  function agregarAlCarrito(tool, cantidad = 1) {
    const carrito = getCarrito();
    const listo = carrito.find(i => i.id === tool.id);

    if (listo) {
      listo.cantidad += cantidad;
    } else {
      carrito.push({
        id: tool.id,
        nombre: tool.nombre,
        precio: tool.precio,
        imagen: tool.imagen,
        cantidad: cantidad
      });
    }

    setCarrito(carrito);

    carritoBtn.classList.add("carrito-anim");
    setTimeout(() => carritoBtn.classList.remove("carrito-anim"), 400);
  }

  // Eventos
  grid.addEventListener("click", (e) => {
    const ver = e.target.closest(".btn-ver");
    const add = e.target.closest(".btn-add");

    if (ver) abrirDetalle(ver.dataset.id);

    if (add) {
      const h = getHerramientas().find(x => x.id === add.dataset.id);
      agregarAlCarrito(h, 1);

      Swal.fire({
        icon: "success",
        title: "Agregado",
        text: `${h.nombre} agregado al carrito`,
        timer: 900,
        showConfirmButton: false
      });
    }
  });

  carritoBtn.addEventListener("click", () => {
    window.location.href = "pages/carrito_herramientas.html";
  });

  // iniciar
  renderHerramientas();
  updateBadge();

});


