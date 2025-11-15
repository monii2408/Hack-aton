# Uso Rápido de CodeScanner (Sin Instalación Global)

## Para Proyectos Locales

Si tienes el proyecto CodeScanner descargado/clonado, puedes usarlo directamente **sin necesidad de instalación global**.

### Opción 1: Usar npm run scan (Más Simple)

```bash
# Desde la raíz del proyecto Hackaton
npm run scan -- archivo.js
npm run scan -- src/
npm run scan -- ../otro-proyecto/
```

### Opción 2: Scripts Wrapper

**Windows:**
```bash
codescanner.bat archivo.js
codescanner.bat src/
```

**Linux/Mac:**
```bash
chmod +x codescanner.sh
./codescanner.sh archivo.js
./codescanner.sh src/
```

### Opción 3: Ejecutar Directamente

```bash
# Desde la raíz del proyecto
node backend/cli.js archivo.js
node backend/cli.js src/
```

## Ejemplo Completo

1. **Descargar/Clonar el proyecto:**
   ```bash
   git clone https://github.com/Camila-jovel/Hack-aton.git
   cd Hackaton
   ```

2. **Instalar dependencias (solo una vez):**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Usar CodeScanner:**
   ```bash
   # Analizar un archivo
   npm run scan -- archivo.js
   
   # Analizar una carpeta
   npm run scan -- src/
   
   # Analizar otro proyecto
   npm run scan -- ../mi-otro-proyecto/
   ```

## Ventajas

- ✅ No necesitas instalación global
- ✅ Funciona inmediatamente después de clonar
- ✅ No requiere permisos de administrador
- ✅ El código está disponible localmente

## Nota

Si quieres usar `codescanner` como comando global desde cualquier proyecto, puedes instalarlo globalmente:

```bash
npm install -g git+https://github.com/Camila-jovel/Hack-aton.git#main
```

Pero **no es necesario** si solo quieres usarlo en proyectos locales.

