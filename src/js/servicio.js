document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  seleccionarServicio();
}

function seleccionarServicio() {
  const servicios = document.querySelectorAll(".servicio");

  servicios.forEach((servicio) => {
    servicio.addEventListener("click", () => {
      const idServicio = servicio.dataset.idServicio;
      mostrarFunciones(idServicio);
    });
  });
}

function mostrarFunciones(idServicio) {
  const servicios = document.querySelectorAll(".servicio");
  const servicio = document.querySelector(`[data-id-servicio="${idServicio}"]`);
  const datos = servicio.querySelector(".datos-servicio");
  const funciones = servicio.querySelector(".funciones");
  const abiertoEnFunciones = funciones.classList.contains("mostrar-servicio");

  servicios.forEach((s) => {
    s.querySelector(".datos-servicio").classList.add("mostrar-servicio");
    s.querySelector(".funciones").classList.remove("mostrar-servicio");
  });

  if (abiertoEnFunciones) {
    datos.classList.add("mostrar-servicio");
    funciones.classList.remove("mostrar-servicio");
    return;
  }

  if (funciones.classList.contains("mostrar-servicio")) {
    funciones.classList.remove("mostrar-servicio");
    datos.classList.add("mostrar-servicio");
  } else {
    datos.classList.remove("mostrar-servicio");
    funciones.classList.add("mostrar-servicio");
  }
}
