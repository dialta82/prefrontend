// === Carga inicial de servicios si no existen en LocalStorage ===
const serviciosIniciales = [
  {
    nombre: "Carpintería",
    precio: 10000,
    imagen: "imagenes/carpinteria.png"
  },
  {
    nombre: "Cerrajería",
    precio: 8000,
    imagen: "imagenes/cerrajería.png"
  },
  {
    nombre: "Plomería",
    precio: 9000,
    imagen: "imagenes/plomeria.png"
  },
  {
    nombre: "Electricidad",
    precio: 12000,
    imagen: "imagenes/electricidad.png"
  },
  {
    nombre: "Fumigación",
    precio: 18000,
    imagen: "imagenes/fumigación.png"
  },
  {
    nombre: "Gasista",
    precio: 25000,
    imagen: "imagenes/gasista.png"
  }
];

if (!localStorage.getItem("servicios")) {
  localStorage.setItem("servicios", JSON.stringify(serviciosIniciales));
  console.log("Servicios iniciales cargados en LocalStorage ✔");
}
