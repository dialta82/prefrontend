// === BASE DE DATOS DE HERRAMIENTAS ===
/*const herramientas = [
  {
    nombre: "Taladro percutor",
    precio: 16000,
    imagen: "imagenes/taladro.png",
    descripcion: "Taladro percutor 800W, ideal para trabajos en madera y mampostería."
  },
  {
    nombre: "Amoladora angular",
    precio: 13000,
    imagen: "imagenes/amoladora.png",
    descripcion: "Amoladora de 1200W con discos incluidos."
  },
  {
    nombre: "Lijadora orbital",
    precio: 11000,
    imagen: "imagenes/lijadora.png",
    descripcion: "Lijadora orbital ideal para acabados precisos en madera."
  },
  {
    nombre: "Hidrolavadora",
    precio: 20000,
    imagen: "imagenes/hidrolavadora.png",
    descripcion: "Hidrolavadora 1500 PSI, ideal para patios y autos."
  }
];


// === GENERACIÓN DINÁMICA DE TARJETAS ===
const contenedor = document.getElementById("herramientas-dinamicas");

herramientas.forEach(h => {
  const card = document.createElement("article");
  card.classList.add("servicio-card");

  // estructura visual idéntica a tus otras tarjetas
  card.innerHTML = `
    <img src="${h.imagen}" alt="${h.nombre}">
    <h4>${h.nombre}</h4>
    <p class="precio">$${h.precio}</p>
    <button class="btn-descripcion">Ver descripción</button>
  `;

  const boton = card.querySelector(".btn-descripcion");

  // evento de descripción
  boton.addEventListener("click", () => {

    let descripcion = card.querySelector(".descripcion");

    if (!descripcion) {
      descripcion = document.createElement("p");
      descripcion.classList.add("descripcion");
      descripcion.style.marginTop = "10px";
      descripcion.textContent = h.descripcion;

      card.appendChild(descripcion);
      boton.textContent = "Ocultar descripción";

    } else {
      descripcion.remove(); 
      boton.textContent = "Ver descripción";
    }
  });

  contenedor.appendChild(card);
});*/
