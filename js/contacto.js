// El formulario de contacto manda a un Formulario de Google de la cuenta de Workspace: las respuestas quedan en
// Forms (y en su hoja de cálculo) y Google avisa por correo. `data-accion` es la dirección «formResponse» del
// formulario y cada campo lleva en `data-entrada` su «entry.N». Sin `data-accion`, el formulario no se enseña.
(function () {
  var forma = document.getElementById("formulario");
  if (!forma || !forma.dataset.accion) return;
  forma.hidden = false;
  var estado = forma.querySelector(".estado");
  var boton = forma.querySelector("button[type=submit]");
  forma.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!forma.reportValidity()) return;
    var datos = new FormData();
    forma.querySelectorAll("[data-entrada]").forEach(function (campo) {
      if (campo.dataset.entrada) datos.append(campo.dataset.entrada, campo.value.trim());
    });
    boton.disabled = true;
    estado.textContent = "Enviando…";
    //  Google no deja leer su respuesta desde otra página (no-cors): si la red no falla, se da por recibido.
    fetch(forma.dataset.accion, { method: "POST", mode: "no-cors", body: datos })
      .then(function () {
        forma.reset();
        estado.textContent = "¡Gracias! Recibimos su mensaje y le contestamos pronto.";
      })
      .catch(function () {
        estado.textContent = "No se pudo enviar. Escríbanos por WhatsApp al 899 452 8917 o a contacto@idevexia.com.";
      })
      .then(function () { boton.disabled = false; });
  });
})();
