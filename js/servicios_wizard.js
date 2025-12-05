// js/servicios_wizard.js
document.addEventListener("DOMContentLoaded", () => {

  // === 1) DEFINICIÓN DE OPCIONES POR CATEGORÍA ===
  const OPCIONES_SERVICIO = {
    Electricidad: [
      "Diagnóstico y reparación",
      "Instalación de artefactos",
      "Seguridad",
      "Cableados",
      "Instalación completa",
      "Revisión de Falla general",
      "Otros"
    ],
    Plomería: [
      "Instalación",
      "Cambios o reparación",
      "Destapaciones simples",
      "Destapaciones urgentes 24 hrs",
      "Detección y Reparación perdidas de agua",
      "Conexión con red de distribución",
      "Otros"
    ],
    Gasista: [
      "Instalación",
      "Diagnóstico y reparación",
      "Trámites y documentación",
      "Inspección y reparación de pérdidas",
      "Conexión con red de distribución",
      "Otros"
    ],
    Cerrajería: [
      "Apertura de puertas",
      "Cambio de cerraduras",
      "Reparación de cerraduras",
      "Instalación de cerraduras de seguridad",
      "Colocación de cerraduras electrónicas / smart",
      "Otros"
    ],
    Fumigación: [
      "Fumigaciones",
      "Desinfección de tanques",
      "Desratizaciones",
      "Ahuyentamiento y control de murciélagos",
      "Control de plagas en espacios verdes",
      "Control de plagas"
    ],
    Seguridad: [
      "Instalación de Alarmas",
      "Instalación de Cámaras",
      "Instalación de Cercos eléctricos",
      "Automatización de portones",
      "Diagnóstico y reparación de cámaras de seguridad",
      "Backups (respaldo de datos)"
    ]
  };

  // === 2) Elementos DOM ===
  const cards = document.querySelectorAll(".categoria-card");
  const modalEl = document.getElementById("wizardModal");
  const modalCategoria = document.getElementById("modalCategoria");
  const wizardSteps = document.querySelectorAll(".wizard-step");
  const stepLabel = document.getElementById("wizardStepLabel");
  const btnPrev = document.getElementById("wizardPrev");
  const btnNext = document.getElementById("wizardNext");

  let currentStep = 1;
  let selectedCategory = null;

  // Inicializar modal bootstrap
  const bootstrapModal = new bootstrap.Modal(modalEl);

  // === 3) Cargar opciones dinámicas en el step1 según categoría ===
  function cargarOpcionesPorCategoria(categoria) {
    const contenedor = document.getElementById("opciones-step1");
    contenedor.innerHTML = ""; // limpia

    const listaOpciones = OPCIONES_SERVICIO[categoria] || [];

    listaOpciones.forEach((op, idx) => {
      const id = `opc_${categoria.replace(/\s+/g, "_")}_${idx}`;
      const wrapper = document.createElement("label");
      wrapper.className = "wizard-check";
      wrapper.innerHTML = `
        <input type="checkbox" id="${id}" value="${op}">
        <span>${op}</span>
      `;
      contenedor.appendChild(wrapper);
    });
  }

  // === 4) Abrir modal desde la tarjeta y setear categoria ===
  cards.forEach(c => {
    c.addEventListener("click", () => {
      selectedCategory = c.dataset.categoria;
      modalCategoria.textContent = selectedCategory;

      // inyectar las opciones del paso 1 segun la categoria
      cargarOpcionesPorCategoria(selectedCategory);

      // reiniciar y abrir wizard
      openWizard();
      bootstrapModal.show();
    });
  });

  // === 5) Funciones control wizard ===
  function openWizard() {
    currentStep = 1;
    updateSteps();
  }

  function updateSteps() {
    wizardSteps.forEach(s => {
      s.style.display = Number(s.dataset.step) === currentStep ? "block" : "none";
    });
    stepLabel.textContent = `Paso ${currentStep} de ${wizardSteps.length}`;
    btnPrev.style.display = currentStep === 1 ? "none" : "inline-block";
    btnNext.textContent = currentStep === wizardSteps.length ? "Consultar" : "Continuar";
  }

  btnPrev.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateSteps();
    }
  });

  btnNext.addEventListener("click", async () => {
    if (!validarPaso(currentStep)) return;

    if (currentStep < wizardSteps.length) {
      currentStep++;
      updateSteps();
      return;
    }

    // último paso: enviar
    const data = recopilarDatos();

    // Mostrar "enviando" con SweetAlert
    Swal.fire({
      title: "Enviando consulta...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      await enviarFormspree(data);

      Swal.close(); // cerrar loading
      await Swal.fire({
        icon: "success",
        title: "Consulta enviada",
        text: "En breve un profesional te contactará.",
        timer: 2200,
        showConfirmButton: false
      });

      bootstrapModal.hide();
      limpiarWizard();
    } catch (err) {
      Swal.close();
      console.error(err);
      Swal.fire("Error", "No se pudo enviar la consulta. Intentá de nuevo.", "error");
    }
  });

  // === 6) Validaciones por paso ===
  function validarPaso(step) {
    if (step == 1) {
      const checks = document.getElementById("opciones-step1").querySelectorAll("input[type=checkbox]");
      const ok = Array.from(checks).some(ch => ch.checked);
      if (!ok) {
        Swal.fire("Atención", "Seleccioná al menos un tipo de servicio.", "warning");
        return false;
      }
    }

    if (step == 2) {
      const radios = wizardSteps[1].querySelectorAll("input[name=vivienda]");
      const ok = Array.from(radios).some(r => r.checked);
      if (!ok) {
        Swal.fire("Atención", "Seleccioná el tipo de vivienda.", "warning");
        return false;
      }
    }

    if (step == 3) {
      const txt = document.getElementById("inputDescripcion").value.trim();
      if (txt.length < 10) {
        Swal.fire("Atención", "Contanos más detalles (mínimo 10 caracteres).", "warning");
        return false;
      }
    }

    if (step == 4) {
      const zona = document.getElementById("inputZona").value.trim();
      if (!zona) {
        Swal.fire("Atención", "Ingresá la zona.", "warning");
        return false;
      }
    }

    if (step == 5) {
      const medio = wizardSteps[4].querySelector("input[name=medio]:checked");
      const num = document.getElementById("inputContacto").value.trim();
      if (!medio) {
        Swal.fire("Atención", "Seleccioná medio de contacto.", "warning");
        return false;
      }
      if (!/^\d{7,15}$/.test(num)) {
        Swal.fire("Atención", "Ingresá un número válido (solo dígitos).", "warning");
        return false;
      }
    }

    return true;
  }

  // === 7) Recopilar datos ===
  function recopilarDatos() {
    const servicios = Array.from(document.querySelectorAll("#opciones-step1 input[type=checkbox]:checked")).map(i => i.value);
    const vivienda = wizardSteps[1].querySelector("input[name=vivienda]:checked").value;
    const descripcion = document.getElementById("inputDescripcion").value.trim();
    const zona = document.getElementById("inputZona").value.trim();
    const medio = wizardSteps[4].querySelector("input[name=medio]:checked").value;
    const telefono = document.getElementById("inputContacto").value.trim();

    return {
      categoriaPrincipal: selectedCategory,
      serviciosSeleccionados: servicios,
      vivienda,
      descripcion,
      zona,
      medio,
      telefono,
      fecha: new Date().toISOString()
    };
  }

  // === 8) Limpiar wizard ===
  function limpiarWizard() {
    // limpiar inputs
    document.querySelectorAll("#opciones-step1 input, .wizard-step input, .wizard-step textarea").forEach(i => {
      if (i.type === "checkbox" || i.type === "radio") i.checked = false;
      else i.value = "";
    });
    currentStep = 1;
    updateSteps();
  }

  // === 9) Envío a Formspree ===
  async function enviarFormspree(payload) {
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xldwvdoo"; // tu endpoint

    const body = {
      categoriaPrincipal: payload.categoriaPrincipal,
      servicios: payload.serviciosSeleccionados.join(", "),
      vivienda: payload.vivienda,
      descripcion: payload.descripcion,
      zona: payload.zona,
      medio: payload.medio,
      telefono: payload.telefono,
      fecha: payload.fecha
    };

    const resp = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!resp.ok) throw new Error("Error enviando a Formspree");
    return resp;
  }

  // Inicializar estado
  updateSteps();

});
