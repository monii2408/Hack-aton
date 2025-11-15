# Solución: Error "codescanner no se reconoce"

Si ves el error:
```
codescanner : El término 'codescanner' no se reconoce como nombre de un cmdlet...
```

**Significa que CodeScanner no está instalado globalmente.**

## Solución: Instalar CodeScanner

### Paso 1: Instalar desde GitHub

Abre PowerShell o CMD y ejecuta:

```bash
npm install -g git+https://github.com/Camila-jovel/Hack-aton.git#main
```

### Paso 2: Verificar la instalación

Después de instalar, verifica que funciona:

```bash
codescanner --help
```

Si ves el mensaje de ayuda, está instalado correctamente.

### Paso 3: Usar CodeScanner

Ahora puedes usar el comando desde cualquier directorio:

```bash
codescanner archivo.js
codescanner src/
codescanner .
```

## Si sigue sin funcionar

### Verificar que npm está instalado

```bash
npm --version
```

Si no está instalado, descarga Node.js desde [nodejs.org](https://nodejs.org/)

### Verificar la ubicación de npm global

```bash
npm config get prefix
```

Asegúrate de que esa ruta esté en tu PATH del sistema.

### Reinstalar

Si la instalación falló, intenta de nuevo:

```bash
npm uninstall -g codescanner
npm install -g git+https://github.com/Camila-jovel/Hack-aton.git#main
```

## Nota para Windows

En Windows, puede ser necesario:
1. Ejecutar PowerShell o CMD como Administrador
2. O agregar la ruta de npm al PATH del sistema

