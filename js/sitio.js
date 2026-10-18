// idevexia.com: el menú, el encabezado que cambia al bajar, la sección en la que vas, las animaciones al aparecer,
// la cifra que se cuenta y el visor de fotos. Código propio y chico; quien pidió «reducir movimiento» no ve
// animaciones (sólo los cambios de estado).
(function () {
  "use strict";
  var raiz = document.documentElement;
  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Encabezado: transparente sobre la portada, sólido al bajar -------------------------------------------
  var encabezado = document.getElementById("encabezado");
  if (encabezado && encabezado.classList.contains("sobre-portada")) {
    var pendiente = false;
    var revisar = function () {
      pendiente = false;
      encabezado.classList.toggle("solido", window.scrollY > 30);
    };
    window.addEventListener("scroll", function () {
      if (!pendiente) { pendiente = true; window.requestAnimationFrame(revisar); }
    }, { passive: true });
    revisar();
  }

  // ---- Menú del celular: a pantalla completa ----------------------------------------------------------------
  var boton = encabezado && encabezado.querySelector(".boton-menu");
  var abrirMenu = function (abierto) {
    encabezado.classList.toggle("abierto", abierto);
    raiz.classList.toggle("menu-abierto", abierto);
    boton.setAttribute("aria-expanded", abierto ? "true" : "false");
    boton.setAttribute("aria-label", abierto ? "Cerrar el menú" : "Abrir el menú");
  };
  if (boton) {
    boton.addEventListener("click", function () { abrirMenu(!encabezado.classList.contains("abierto")); });
    encabezado.querySelectorAll(".menu a").forEach(function (liga) {
      liga.addEventListener("click", function () { abrirMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && encabezado.classList.contains("abierto")) { abrirMenu(false); boton.focus(); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960 && encabezado.classList.contains("abierto")) abrirMenu(false);
    });
  }

  // ---- La sección en la que vas, subrayada en el menú --------------------------------------------------------
  if ("IntersectionObserver" in window && encabezado) {
    var ligas = {};
    encabezado.querySelectorAll('.menu a[href^="#"]').forEach(function (a) { ligas[a.getAttribute("href").slice(1)] = a; });
    var secciones = Object.keys(ligas).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (secciones.length) {
      var espia = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (!en.isIntersecting) return;
          Object.keys(ligas).forEach(function (id) { ligas[id].classList.toggle("activo", id === en.target.id); });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      secciones.forEach(function (s) { espia.observe(s); });
    }
  }

  // ---- Aparecer al bajar --------------------------------------------------------------------------------------
  //  Sólo lo que todavía no se ve al cargar: lo de arriba ya está (y si este archivo no cargara, nada queda oculto).
  var SELECTORES = [
    ".titulo-seccion", ".servicio", ".solar-franja .contenedor > *", ".nosotros > *", ".tarjeta", ".distingue li",
    ".trabajo > div", ".galeria li", ".otras-obras", ".obras-pares img", ".pasos li", ".dos > div",
    ".preguntas details", ".llamado .contenedor > *", ".contacto .rejilla > *", ".portada-solar .contenedor > *"
  ].join(",");
  if (!quieto && "IntersectionObserver" in window) {
    var porAparecer = [];
    document.querySelectorAll(SELECTORES).forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.92) porAparecer.push(el);
    });
    //  Escalonado: los hermanos aparecen uno tras otro.
    porAparecer.forEach(function (el) {
      var hermanos = Array.prototype.filter.call(el.parentElement.children, function (h) { return porAparecer.indexOf(h) >= 0; });
      el.style.setProperty("--retraso", Math.min(hermanos.indexOf(el), 5) * 90 + "ms");
      el.classList.add("revelar");
    });
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); observador.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    porAparecer.forEach(function (el) { observador.observe(el); });
  }

  // ---- Cifras que se cuentan --------------------------------------------------------------------------------
  var contar = function (el) {
    var meta = parseInt(el.getAttribute("data-contar"), 10) || 0;
    if (quieto) { el.textContent = meta; return; }
    var inicio = null, duracion = 1300;
    var paso = function (t) {
      if (inicio === null) inicio = t;
      var avance = Math.min((t - inicio) / duracion, 1);
      el.textContent = Math.round(meta * (1 - Math.pow(1 - avance, 3)));
      if (avance < 1) window.requestAnimationFrame(paso);
    };
    el.textContent = "0";
    window.setTimeout(function () { window.requestAnimationFrame(paso); }, 350);
  };
  var cifras = document.querySelectorAll("[data-contar]");
  if (cifras.length && "IntersectionObserver" in window) {
    var contador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { contar(en.target); contador.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    cifras.forEach(function (c) { contador.observe(c); });
  }

  // ---- Visor de fotos ---------------------------------------------------------------------------------------
  var fotos = document.querySelectorAll(".galeria img, .obras-pares img");
  if (fotos.length) {
    var visor = document.createElement("div");
    visor.className = "visor";
    visor.setAttribute("role", "dialog");
    visor.setAttribute("aria-modal", "true");
    visor.setAttribute("aria-label", "Foto ampliada");
    visor.hidden = true;
    visor.innerHTML =
      '<button class="visor-cerrar" type="button" aria-label="Cerrar">&times;</button>' +
      '<button class="visor-anterior" type="button" aria-label="Foto anterior">&#8249;</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="visor-siguiente" type="button" aria-label="Foto siguiente">&#8250;</button>' +
      '<p class="visor-cuenta"></p>';
    document.body.appendChild(visor);
    var img = visor.querySelector("img"), pie = visor.querySelector("figcaption"), cuenta = visor.querySelector(".visor-cuenta");
    var anterior = visor.querySelector(".visor-anterior"), siguiente = visor.querySelector(".visor-siguiente");
    var cerrarBoton = visor.querySelector(".visor-cerrar");
    var grupo = [], actual = 0, origen = null;

    var mostrar = function (i) {
      actual = (i + grupo.length) % grupo.length;
      var foto = grupo[actual];
      img.src = foto.currentSrc || foto.src;
      img.alt = foto.alt;
      pie.textContent = foto.alt;
      cuenta.textContent = grupo.length > 1 ? (actual + 1) + " / " + grupo.length : "";
      anterior.hidden = siguiente.hidden = grupo.length < 2;
    };
    var abrir = function (foto) {
      var caja = foto.closest(".galeria, .obras-pares");
      grupo = Array.prototype.slice.call(caja.querySelectorAll("img"));
      origen = foto;
      mostrar(grupo.indexOf(foto));
      visor.hidden = false;
      raiz.classList.add("visor-abierto");
      window.requestAnimationFrame(function () { visor.classList.add("abierto"); });
      cerrarBoton.focus();
    };
    var cerrar = function () {
      visor.classList.remove("abierto");
      raiz.classList.remove("visor-abierto");
      window.setTimeout(function () { visor.hidden = true; }, quieto ? 0 : 220);
      if (origen) origen.focus();
    };
    fotos.forEach(function (foto) {
      foto.tabIndex = 0;
      foto.setAttribute("role", "button");
      foto.setAttribute("aria-label", "Ampliar: " + foto.alt);
      foto.addEventListener("click", function () { abrir(foto); });
      foto.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(foto); }
      });
    });
    cerrarBoton.addEventListener("click", cerrar);
    anterior.addEventListener("click", function () { mostrar(actual - 1); });
    siguiente.addEventListener("click", function () { mostrar(actual + 1); });
    visor.addEventListener("click", function (e) { if (e.target === visor) cerrar(); });
    document.addEventListener("keydown", function (e) {
      if (visor.hidden) return;
      if (e.key === "Escape") cerrar();
      else if (e.key === "ArrowLeft") mostrar(actual - 1);
      else if (e.key === "ArrowRight") mostrar(actual + 1);
    });
    //  Deslizar con el dedo.
    var x0 = null;
    visor.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    visor.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45 && grupo.length > 1) mostrar(actual + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  // ---- Videos de fondo: quien pidió reducir movimiento ve la primera imagen, quieta --------------------------
  if (quieto) {
    Array.prototype.forEach.call(document.querySelectorAll("video[autoplay]"), function (v) {
      v.removeAttribute("autoplay"); v.pause();
    });
  }

  // ---- Año del pie ------------------------------------------------------------------------------------------
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();
