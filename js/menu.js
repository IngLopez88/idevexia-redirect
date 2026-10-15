// El menú en el celular: el botón lo abre y lo cierra; al elegir una sección se cierra solo.
(function () {
  var encabezado = document.getElementById("encabezado");
  var boton = encabezado && encabezado.querySelector(".boton-menu");
  if (boton) {
    boton.addEventListener("click", function () {
      var abierto = encabezado.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto ? "true" : "false");
      boton.setAttribute("aria-label", abierto ? "Cerrar el menú" : "Abrir el menú");
    });
    encabezado.querySelectorAll(".menu a").forEach(function (liga) {
      liga.addEventListener("click", function () {
        encabezado.classList.remove("abierto");
        boton.setAttribute("aria-expanded", "false");
      });
    });
  }
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();
