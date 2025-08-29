let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
  id: "",
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarSeccion(); // Muestra y oculta las secciones
  tabs(); // Cambia la funcion cuando se presionen los tabs
  botonesPaginador(); // Agrega o quita los botones del paginador
  paginaAnterior();
  paginaSiguiente();

  consultarAPI(); // Consulta la API en el backend de PHP
  idCliente();
  nombreCliente(); // Añade el nombre del cliente al objeto cita
  seleccionarFecha(); // Añade la fecha al objeto cita
  seleccionarHora(); // Añade la hora al objeto cita
  mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {
  // Ocultar la seccion que tenga la clase de mostrar
  const seccionAnterior = document.querySelector(".mostrar");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar");
  }

  // Seleccionr la seccion con el paso
  const pasoSelector = `#paso-${paso}`;
  const seccion = document.querySelector(pasoSelector);
  seccion.classList.add("mostrar");

  // Eliminar la clase actual al tab anterior
  const tabAnterior = document.querySelector(".actual");

  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
  }

  // Resalta el tab actual
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add("actual");
}

function tabs() {
  const botones = document.querySelectorAll(".tabs button");

  botones.forEach((boton) => {
    boton.addEventListener("click", function (e) {
      paso = parseInt(e.target.dataset.paso);

      mostrarSeccion();
      botonesPaginador();
    });
  });
}

function botonesPaginador() {
  const paginaAnterior = document.querySelector("#anterior");
  const paginaSiguiente = document.querySelector("#siguiente");

  if (paso === 1) {
    paginaAnterior.classList.add("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  } else if (paso === 3) {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.add("ocultar");
    mostrarResumen();
  } else {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  }

  mostrarSeccion();
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", function () {
    if (paso <= pasoInicial) return;

    paso--;
    botonesPaginador();
  });
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", function () {
    if (paso >= pasoFinal) return;

    paso++;
    botonesPaginador();
  });
}

async function consultarAPI() {
  try {
    const url = `/api/servicios`;
    const resultado = await fetch(url);
    const servicios = await resultado.json();

    mostrarServicios(servicios);
  } catch (error) {
    console.log(error);
  }
}

function mostrarServicios(servicios) {
  const contenedorServicios = document.querySelector("#servicios");
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;

    const nombreServicio = document.createElement("P");
    nombreServicio.classList.add("nombre-servicio");
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.classList.add("precio-servicio");
    precioServicio.textContent = `$${precio}`;

    const servicioDiv = document.createElement("DIV");
    servicioDiv.classList.add("servicio");
    servicioDiv.dataset.idServicio = id;

    servicioDiv.onclick = function () {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    contenedorServicios.appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  const { id } = servicio;
  const { servicios } = cita;

  // Identificar el elemento al que se da click
  const servicioDiv = document.querySelector(`[data-id-servicio="${id}"]`);

  // Comprobar si un servicio ya fue agregado
  if (servicios.some((agregado) => agregado.id === id)) {
    // Eliminar
    cita.servicios = servicios.filter((agregado) => agregado.id !== id);
    servicioDiv.classList.remove("seleccionado");
  } else {
    // Agregar
    cita.servicios = [...servicios, servicio];
    servicioDiv.classList.add("seleccionado");
  }
}

function idCliente() {
  cita.id = document.querySelector("#id").value;
}

function nombreCliente() {
  cita.nombre = document.querySelector("#nombre").value;
}

function seleccionarFecha() {
  const inputFecha = document.querySelector("#fecha");
  inputFecha.addEventListener("input", function (e) {
    const dia = new Date(e.target.value).getUTCDay();

    if ([6, 0].includes(dia)) {
      e.target.value = "";
      mostrarAlerta("error", "Fines de semana no permitidos", "#paso-2 p");
    } else {
      cita.fecha = e.target.value;
    }
  });
}

function seleccionarHora() {
  const inputHora = document.querySelector("#hora");

  inputHora.addEventListener("input", function (e) {
    const horaCita = e.target.value;
    const hora = horaCita.split(":")[0];

    if (hora < 9 || hora > 20) {
      e.target.value = "";
      mostrarAlerta("error", "Hora no valida", "#paso-2 p");
    } else {
      cita.hora = e.target.value;
    }
  });
}

function mostrarAlerta(tipo, mensaje, elemento, desaparece = true) {
  alertaPrevia = document.querySelector(".alerta");
  // Previene que se genere mas de una alerta
  if (alertaPrevia) {
    alertaPrevia.remove();
  }

  // Scripting para crear la alerta
  const alerta = document.createElement("DIV");

  alerta.textContent = mensaje;
  alerta.classList.add("alerta");
  alerta.classList.add(tipo);
  alerta.style.marginTop = "2rem";

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  // Eliminar la alerta
  if (desaparece) {
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function mostrarResumen() {
  const resumen = document.querySelector(".contenido-resumen");

  // Limpiar el contenido del resumen
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }
  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlerta(
      "error",
      "Debes elegir un servico, fecha y hora de  la cita",
      ".contenido-resumen",
      false
    );

    return;
  }

  // Formatiar el div de resumen
  const { nombre, fecha, hora, servicios } = cita;

  // Heading para servicios en resu,em

  const headingServicios = document.createElement("H3");

  headingServicios.textContent = "Resumen Servicios";
  resumen.appendChild(headingServicios);

  // Iterar en los servicios y mostrandolos

  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;
    const contenedorServicio = document.createElement("DIV");
    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("p");
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);
  });
  // Heading datos persona
  const headingResumen = document.createElement("H3");

  headingResumen.textContent = "Resumen de Cita";
  resumen.appendChild(headingResumen);

  const nombreCliente = document.createElement("P");
  nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

  // Formatiar fecha en español
  const fechaObj = new Date(fecha);

  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() + 2;
  const year = fechaObj.getFullYear();

  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const fechaFormatiada = fechaUTC.toLocaleDateString("es-CO", opciones);

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormatiada}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

  // Boton para crear cita
  const botonReservar = document.createElement("BUTTON");
  botonReservar.classList.add("boton");
  botonReservar.textContent = "Reservar Cita";
  botonReservar.onclick = reservarCita;

  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);
  resumen.appendChild(botonReservar);
}

async function reservarCita() {
  const { id, fecha, hora, servicios } = cita;

  const idServicios = servicios.map((servicio) => servicio.id);
  const datos = new FormData();

  datos.append("fecha", fecha);
  datos.append("hora", hora);
  datos.append("usuario_id", id);
  datos.append("servicios", idServicios);

  try {
    // Peticion hacia la Api
    const url = "/api/citas";

    const respuesta = await fetch(url, {
      method: "POST",
      body: datos,
    });

    const resultado = await respuesta.json();

    if (resultado.resultado) {
      Swal.fire({
        icon: "success",
        title: "Cita Creada",
        text: "Tu cita fue creada correctamente",
        button: "Ok",
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al guardar la cita",
    });
    // console.log([...datos]);
  }
}
