# Proyecto de Prueba para CodeScanner

Esta carpeta contiene múltiples archivos con vulnerabilidades intencionales para probar CodeScanner.

## Archivos incluidos:

- `app.js` - Lógica principal con SQL injection, eval(), secretos
- `routes.js` - Rutas Express sin autenticación
- `frontend.js` - Vulnerabilidades XSS y localStorage
- `config.js` - Secretos y tokens expuestos
- `utils.js` - Más SQL injection y eval()

## Cómo probar:

```bash
# Desde la raíz del proyecto CodeScanner
codescanner test-project/

# O con npm
npm run scan -- test-project/
```

Este proyecto contiene aproximadamente 20+ vulnerabilidades distribuidas en varios archivos.

