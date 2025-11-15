# Opciones de Instalación de CodeScanner

## Opción 1: Instalación Directa desde GitHub (RECOMENDADA)

**NO necesitas clonar el repositorio manualmente.** npm lo descarga automáticamente:

```bash
npm install -g git+https://github.com/Camila-jovel/Hack-aton.git#main
```

**Ventajas:**
- ✅ Un solo comando
- ✅ npm descarga automáticamente desde GitHub
- ✅ No necesitas tener Git instalado (npm lo maneja)
- ✅ Se instala globalmente, disponible desde cualquier terminal

**Cómo funciona:**
1. npm descarga el repositorio de GitHub temporalmente
2. Instala las dependencias
3. Crea el comando `codescanner` en tu sistema
4. Ya puedes usarlo desde cualquier terminal

## Opción 2: Clonar y Instalar Manualmente

Si prefieres tener el código localmente:

```bash
# 1. Clonar el repositorio
git clone https://github.com/Camila-jovel/Hack-aton.git
cd Hack-aton/backend

# 2. Instalar dependencias
npm install

# 3. Instalar globalmente
npm install -g .
```

**Ventajas:**
- ✅ Tienes el código fuente localmente
- ✅ Puedes modificar el código
- ✅ Puedes ver todos los archivos

**Desventajas:**
- ❌ Requiere más pasos
- ❌ Necesitas tener Git instalado
- ❌ Ocupa más espacio en disco

## Opción 3: Publicar en npm (FUTURO)

Si publicas el paquete en npm, la instalación será aún más simple:

```bash
npm install -g codescanner
```

**Ventajas:**
- ✅ El comando más simple
- ✅ No depende de GitHub
- ✅ Más rápido
- ✅ Estándar de la industria

**Requisitos:**
- Necesitas crear cuenta en npm
- Publicar el paquete (ver `PUBLICAR-NPM.md`)

## Comparación

| Método | Comando | Requiere Git | Requiere Clonar |
|--------|---------|--------------|-----------------|
| GitHub directo | `npm install -g git+https://...` | No | No |
| Clonar manual | `git clone` + `npm install -g .` | Sí | Sí |
| npm registry | `npm install -g codescanner` | No | No |

## Recomendación

**Para usuarios finales:** Usa la Opción 1 (instalación directa desde GitHub)
- Es la más simple
- Un solo comando
- No requiere conocimientos de Git

**Para desarrolladores:** Usa la Opción 2 (clonar manualmente)
- Si quieres modificar el código
- Si quieres contribuir al proyecto

