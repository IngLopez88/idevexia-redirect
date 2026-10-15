# idevexia.com → www.idevexia.com

Lleva la dirección sin `www` a la página comercial, que vive en Google Sites en `www.idevexia.com`.

- **Por qué aquí:** Google Sites sólo se publica en un subdominio (`www`), y la redirección que ofrece Google
  Workspace para el dominio sin `www` no tiene https. GitHub Pages sí da https gratis.
- **Qué hace:** `index.html` y `404.html` mandan cualquier ruta a la misma en `www` (`idevexia.com/servicios` →
  `www.idevexia.com/servicios`). `CNAME` le dice a GitHub Pages el dominio.
- **DNS (Neubox):** cuatro registros A de `idevexia.com.` a las IP de GitHub Pages (185.199.108.153,
  185.199.109.153, 185.199.110.153, 185.199.111.153) y el CNAME de `www` a `ghs.googlehosted.com` (Google Sites).
