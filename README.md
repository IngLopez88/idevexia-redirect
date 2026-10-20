# idevexia.com

Página comercial de **Ingeniería y Desarrollos EVEXIA** (Reynosa, Tamaulipas), publicada con GitHub Pages.

- `index.html`: inicio (servicios, energía solar, nosotros, trabajos realizados, clientes, contacto).
- `energia-solar.html`: suministro e instalación de paneles solares.
- `css/estilo.css`, `js/menu.js`, `img/` (fotos de obra del currículum empresarial, logo y favicon).
- `CNAME`: el dominio. `404.html`: la página que sale si una dirección no existe.
- `pantalla/index.html`: la liga corta `idevexia.com/pantalla`, que manda a la pantalla de la oficina de EVEXIA (`/pantalla` en Cloud Run) para no teclear la dirección larga en el Echo Show. No sale en el menú ni en `sitemap.xml`.

**Lo demás no vive aquí:** el correo `@idevexia.com` es de Google Workspace, EVEXIA corre en Cloud Run (botón
«Acceso EVEXIA») y el DNS está en Neubox: cuatro registros A de `idevexia.com.` a las IP de GitHub Pages
(185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) y el CNAME de `www` a `inglopez88.github.io`.

Los textos y datos vienen del currículum empresarial de la empresa; un cambio se sube con un commit y se ve en
uno o dos minutos.

**Al cambiar `css/estilo.css` o un archivo de `js/`, sube la versión `?v=` con que lo piden las páginas.** GitHub
Pages deja que el navegador guarde esos archivos 10 minutos; sin versión nueva, una página nueva puede salir con el
estilo viejo (el 2026-10-15 se vio el menú sin estilo y el ícono de WhatsApp gigante por eso).
