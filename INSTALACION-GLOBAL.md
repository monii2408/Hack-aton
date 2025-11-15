# Instalación Global de CodeScanner

Este documento explica cómo instalar CodeScanner globalmente para usarlo desde cualquier terminal en cualquier computadora.

## Requisitos Previos

- Node.js 18 o superior instalado
- npm (incluido con Node.js)

## Método 1: Instalación desde el Repositorio Local

Si tienes el proyecto descargado localmente:

```bash
# Navegar a la carpeta backend
cd backend

# Instalar globalmente
npm install -g .
```

## Método 2: Instalación desde GitHub

Si el proyecto está en GitHub:

```bash
npm install -g git+https://github.com/Camila-jovel/Hack-aton.git#main
```

O si quieres instalar desde una rama específica:

```bash
npm install -g git+https://github.com/Camila-jovel/Hack-aton.git#nombre-de-rama
```

## Método 3: Instalación desde npm (si está publicado)

Si el paquete está publicado en npm:

```bash
npm install -g codescanner
```

## Verificar la Instalación

Después de instalar, verifica que funciona:

```bash
codescanner --help
```

Deberías ver el mensaje de ayuda de CodeScanner.

## Uso

Una vez instalado globalmente, puedes usar `codescanner` desde cualquier directorio:

```bash
# Analizar un archivo
codescanner archivo.js

# Analizar una carpeta
codescanner src/

# Analizar la carpeta actual
codescanner .
```

## Desinstalar

Si necesitas desinstalar CodeScanner:

```bash
npm uninstall -g codescanner
```

## Solución de Problemas

### Error: "codescanner no se reconoce como comando"

Esto significa que npm no está en tu PATH o la instalación falló. Verifica:

1. **Verificar que npm está instalado:**
   ```bash
   npm --version
   ```

2. **Verificar la ubicación de los binarios globales de npm:**
   ```bash
   npm config get prefix
   ```

3. **Asegúrate de que esa ruta esté en tu PATH del sistema**

### Error: "Cannot find module './scanner'"

Esto puede ocurrir si la instalación no copió todos los archivos. Reinstala:

```bash
npm uninstall -g codescanner
npm install -g .
```

### En Windows

Si tienes problemas con permisos, ejecuta PowerShell o CMD como Administrador.

## Notas

- La instalación global requiere permisos de administrador en algunos sistemas
- En Linux/Mac, puede ser necesario usar `sudo`:
  ```bash
  sudo npm install -g .
  ```

