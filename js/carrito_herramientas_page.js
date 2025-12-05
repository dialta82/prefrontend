// js/carrito_herramientas_page.js


document.addEventListener("DOMContentLoaded", () => {

  // 🔥 MISMA KEY QUE USA EL ICONO FLOTANTE
  const LS_KEY_CARR = "carritoHerramientas";

  const contenedor = document.getElementById("carrito-contenedor");
  const totalP = document.getElementById("total-pagar");
  const vaciarBtn = document.getElementById("vaciar-carrito");

  // ---------- UTILIDADES ----------
  function getCarrito() {
    return JSON.parse(localStorage.getItem(LS_KEY_CARR)) || [];
  }

  function setCarrito(c) {
    localStorage.setItem(LS_KEY_CARR, JSON.stringify(c));
    render();
    actualizarBadge();
  }

  function actualizarBadge() {
    const badge = document.getElementById("contador-carrito");
    if (!badge) return;

    const carrito = getCarrito();
    const total = carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0);

    badge.textContent = total;
  }

  // ---------- RENDER ----------
  function render() {
    const carrito = getCarrito();
    contenedor.innerHTML = "";

    if (!carrito.length) {
      contenedor.innerHTML = "<p>No hay herramientas en el carrito.</p>";
      totalP.textContent = "$0";
      actualizarBadge();
      return;
    }

    let total = 0;

    carrito.forEach(item => {
      total += item.precio * (item.cantidad || 1);

      const card = document.createElement("article");
      card.className = "servicio-card";

      card.innerHTML = `
        <img src="../${item.imagen}" alt="${item.nombre}" style="width:100%;max-width:120px;">
        <h4>${item.nombre}</h4>
        <p class="precio">$${item.precio.toLocaleString("es-AR")}</p>

        <label>Cantidad:</label>
        <input type="number" min="1" value="${item.cantidad}" 
              data-id="${item.id}" class="cantidad-input" style="width:80px">

        <button class="btn-eliminar btn btn-outline-danger" data-id="${item.id}">
          Eliminar
        </button>
      `;

      contenedor.appendChild(card);
    });

    totalP.textContent = `$${total.toLocaleString("es-AR")}`;
    actualizarBadge();
  }

  // 🔥 Evento: eliminar herramienta
  contenedor.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
      const id = e.target.dataset.id;

      Swal.fire({
        title: "¿Eliminar herramienta?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      }).then(result => {
        if (result.isConfirmed) {
          let c = getCarrito();
          c = c.filter(i => i.id !== id);
          setCarrito(c);

          Swal.fire({
            icon: "success",
            title: "Eliminado",
            timer: 1200,
            showConfirmButton: false
          });
        }
      });
    }
  });

  // 🔥 Modificar cantidad
  contenedor.addEventListener("change", (e) => {
    if (e.target.classList.contains("cantidad-input")) {
      const id = e.target.dataset.id;
      const nuevaCantidad = Number(e.target.value) || 1;

      let c = getCarrito();
      const item = c.find(i => i.id === id);

      if (item) {
        item.cantidad = nuevaCantidad;
        setCarrito(c);
      }
    }
  });

  // 🔥 Vaciar carrito
  vaciarBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Vaciar carrito",
      text: "¿Seguro querés vaciar todo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar"
    }).then(res => {
      if (res.isConfirmed) {
        localStorage.removeItem(LS_KEY_CARR);
        render();
        actualizarBadge();
      }
    });
  });

  // Inicializar
  render();
  actualizarBadge();

});
