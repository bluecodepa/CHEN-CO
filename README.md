# CHEN-CO

## Cambiar la foto de Winny Chen

1. Guarda la foto nueva con este nombre:
   - `assets/winny-chen.jpg`
2. El sitio ya está configurado para usar esa ruta en `index.html` (sección **Quiénes somos**, bloque de la CEO).

> Nota: si el archivo no existe, el sitio usará temporalmente una imagen de respaldo (fallback) para que no se rompa el layout.

## Subir a cPanel (public_html)

Sube **estos archivos/carpetas** manteniendo exactamente los nombres (en Linux/cPanel las mayúsculas importan):

- `index.html`
- `favicon.svg`
- `.htaccess` (recomendado)
- `CSS/`
- `JS/`
- `assets/`

Notas:
- **Case-sensitive**: `CSS/styles.css` y `JS/animations.js` deben ir en carpetas llamadas exactamente `CSS` y `JS`.
- Las imágenes de “Servicios” y “Contacto” actualmente apuntan a URLs externas (Unsplash). Si quieres que el sitio quede 100% sin dependencias externas, descarga esas imágenes y colócalas en `assets/` y te actualizo los `src` a rutas locales.
