# CHEN-CO

## Cambiar la foto de Winny Chen

1. Guarda la foto nueva con este nombre:
   - `assets/winny-chen.jpg`
2. El sitio ya está configurado para usar esa ruta en `index.html` (sección **Quiénes somos**, bloque de la CEO).
> Nota: asegúrate de subir también `assets/winny-chen.jpg` a producción (cPanel) para que se vea correctamente.

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
- Las imágenes de “Servicios” y el recuadro de “Contacto” usan archivos locales en `assets/` (sin dependencias externas).
