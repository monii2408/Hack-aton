# 🔒 CodeScanner - Análisis Inteligente de Vulnerabilidades de Seguridad

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Hackathon](https://img.shields.io/badge/Hackathon-Project-blue.svg)](README.md)

**CodeScanner** es una herramienta de análisis estático de seguridad de código diseñada para detectar vulnerabilidades comunes en aplicaciones JavaScript antes de que lleguen a producción. Utiliza un sistema de "IA basada en reglas" que analiza el código línea por línea, identifica patrones peligrosos y genera reportes inteligentes con explicaciones claras y recomendaciones de remediación.

---

## 📋 Tabla de Contenidos

- [Problema que Resuelve](#-problema-que-resuelve)
- [Público Objetivo](#-público-objetivo)
- [Características Principales](#-características-principales)
- [Arquitectura](#-arquitectura)
- [Instalación y Uso](#-instalación-y-uso)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Limitaciones del Prototipo](#-limitaciones-del-prototipo)
- [Visión Futura](#-visión-futura)
- [Impacto en El Salvador](#-impacto-en-el-salvador)
- [Licencia](#-licencia)

---

## 🎯 Problema que Resuelve

En El Salvador, estudiantes de ingeniería, desarrolladores junior, startups y equipos pequeños de TI enfrentan un desafío crítico: **la falta de herramientas accesibles y gratuitas para detectar vulnerabilidades de seguridad** antes de desplegar software a producción. Muchas organizaciones no tienen acceso a herramientas comerciales costosas como SonarQube Enterprise, Veracode o Checkmarx, lo que los deja expuestos a riesgos de seguridad que podrían comprometer datos sensibles, sistemas gubernamentales, aplicaciones financieras o servicios públicos.

CodeScanner busca democratizar el acceso a análisis de seguridad básico, proporcionando una herramienta gratuita, fácil de usar y que no requiere configuración compleja, permitiendo que cualquier desarrollador pueda identificar y corregir vulnerabilidades comunes antes de que se conviertan en problemas críticos.

---

## 👥 Público Objetivo

CodeScanner está diseñado para:

- **Desarrolladores principiantes** que están aprendiendo mejores prácticas de seguridad
- **Estudiantes de ingeniería** que necesitan validar la seguridad de sus proyectos académicos
- **Pequeñas empresas y startups** que no tienen presupuesto para herramientas comerciales
- **Equipos de TI del sector público** que requieren análisis de seguridad sin costos adicionales
- **Desarrolladores freelance** que quieren asegurar la calidad de su código antes de entregarlo a clientes

---

## ✨ Características Principales

### 🔍 Análisis Línea por Línea
El scanner recorre cada línea de código aplicando reglas de seguridad basadas en expresiones regulares y patrones conocidos de vulnerabilidades.

### 🛡️ Detección de Vulnerabilidades Críticas

CodeScanner detecta las siguientes categorías de vulnerabilidades:

- **SQL Injection por concatenación**: Identifica consultas SQL construidas concatenando strings, una de las vulnerabilidades más críticas del OWASP Top 10
- **Uso de `eval()`**: Detecta el uso peligroso de `eval()` que puede permitir ejecución remota de código
- **Secretos hardcodeados**: Encuentra contraseñas, API keys, tokens y credenciales expuestas directamente en el código
- **Tokens JWT expuestos**: Identifica tokens JWT hardcodeados que podrían comprometer la autenticación
- **Riesgos de XSS**: Detecta uso inseguro de `innerHTML` y `document.write()` que pueden permitir Cross-Site Scripting
- **Conexiones HTTP inseguras**: Identifica URLs que usan HTTP en lugar de HTTPS
- **Almacenamiento inseguro**: Detecta uso de `localStorage` para guardar información sensible
- **Rutas Express sin autenticación**: Identifica endpoints de Express.js que no muestran indicios de middleware de autenticación

### 📊 Tabla de Resultados con Severidad por Colores

La interfaz web muestra los resultados organizados en una tabla clara donde cada vulnerabilidad está marcada con colores según su severidad:
- 🔴 **Alta severidad** (rojo): Vulnerabilidades críticas que deben corregirse inmediatamente
- 🟡 **Media severidad** (amarillo): Vulnerabilidades que requieren atención
- 🟢 **Baja severidad** (verde): Problemas menores o informativos

### 🤖 Resumen Generado por IA Basada en Reglas

El sistema incluye un módulo de "IA basada en reglas" que:
- **Agrupa** vulnerabilidades por tipo
- **Prioriza** según severidad e impacto
- **Explica** en lenguaje natural qué significa cada tipo de error
- **Describe** el impacto en seguridad y rendimiento
- **Recomienda** soluciones específicas y accionables

### 📏 Límite de Tamaño de Archivo
El sistema está optimizado para analizar archivos de tamaño razonable, ideal para proyectos pequeños y medianos.

---

## 🏗️ Arquitectura

CodeScanner está construido con una arquitectura modular y escalable:

### Frontend (Interfaz Web)
- **HTML/CSS/JavaScript vanilla**: Interfaz simple y rápida sin dependencias pesadas
- **Textarea para código**: Permite pegar código directamente o subir archivos
- **Tabla de resultados**: Muestra vulnerabilidades detectadas línea por línea
- **Panel de análisis inteligente**: Presenta resumen, métricas y grupos de vulnerabilidades con explicaciones

### Backend (API REST)
- **Express.js**: Servidor Node.js que expone endpoints REST
- **Endpoint `/scan`**: Recibe código, aplica reglas de seguridad y devuelve findings
- **Módulo Scanner**: Analiza código línea por línea usando expresiones regulares
- **Módulo IA basado en reglas**: Agrupa findings, calcula métricas y genera explicaciones

### Flujo de Análisis
1. El usuario pega código o sube un archivo en el frontend
2. El frontend envía el código al backend mediante POST `/scan`
3. El backend divide el código en líneas y aplica reglas de seguridad
4. Cada regla detecta patrones específicos (SQL injection, eval, secretos, etc.)
5. El módulo de IA agrupa los findings, calcula métricas y genera explicaciones
6. El backend devuelve un JSON con findings, summary y groups
7. El frontend renderiza los resultados en tabla y panel de análisis inteligente

---

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 18 o superior
- npm (incluido con Node.js)

### Instalación Rápida (Recomendada)

**⚠️ IMPORTANTE: Primero debes instalar CodeScanner antes de usarlo.**

**Paso 1: Instalar CodeScanner desde GitHub**

Abre cualquier terminal (PowerShell, CMD, Git Bash) y ejecuta:

```bash
npm install -g git+https://github.com/Camila-jovel/Hack-aton.git#main
```

**Paso 2: Verificar la instalación**

```bash
codescanner --help
```

Si ves el mensaje de ayuda, la instalación fue exitosa.

**Paso 3: Usar CodeScanner**

Ahora puedes usar `codescanner` desde cualquier lugar:

```bash
codescanner archivo.js
codescanner src/
codescanner .
```

**¡Eso es todo!** No necesitas clonar el repositorio ni tener Git instalado. npm lo descarga automáticamente.

**Nota:** Si ves el error "codescanner no se reconoce", significa que aún no está instalado. Ejecuta el comando de instalación del Paso 1.

### Instalación

1. **Clonar o descargar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd Hackaton
   ```

2. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

### Ejecución

#### Opción 1: Interfaz Web (Recomendado para demos)

1. **Iniciar el servidor backend**
   ```bash
   cd backend
   node server.js
   ```
   Deberías ver: `Scanner backend escuchando en http://localhost:3000`

2. **Abrir la interfaz web**
   - Abre tu navegador y ve a: `http://localhost:3000`
   - O abre directamente: `frontend/index.html`

3. **Analizar código**
   - Pega código en el textarea o sube un archivo `.js`
   - Haz clic en "🔍 Analizar código"
   - Revisa los resultados en la tabla y el panel de análisis inteligente

#### Opción 2: Uso desde la Terminal (CLI)

CodeScanner incluye una interfaz de línea de comandos que permite analizar código directamente desde la terminal, ideal para integrar en pipelines de CI/CD o para análisis rápido durante el desarrollo.

**Instalación Local (desde el proyecto)**

1. **Instalar dependencias**
   ```bash
   cd backend
   npm install
   ```

2. **Ejecutar el escáner**
   ```bash
   # Analizar un archivo específico
   npm run scan -- archivo.js

   # Analizar una carpeta completa (recursivo)
   npm run scan -- src/

   # Analizar la carpeta de ejemplos
   npm run scan -- examples/
   ```

**Instalación Global (desde cualquier computadora)**

Para usar CodeScanner desde cualquier terminal en cualquier computadora, **NO necesitas clonar el repositorio manualmente**. npm descarga e instala automáticamente desde GitHub con un solo comando:

**Instalación desde GitHub (RECOMENDADO)**

```bash
npm install -g git+https://github.com/Camila-jovel/Hack-aton.git#main
```

**Ventajas:**
- ✅ Un solo comando
- ✅ npm descarga automáticamente desde GitHub
- ✅ No necesitas tener Git instalado (npm lo maneja internamente)
- ✅ Se instala globalmente, disponible desde cualquier terminal
- ✅ Funciona en Windows, Mac y Linux

**Usar desde cualquier lugar**

Una vez instalado, puedes usar `codescanner` desde cualquier directorio:

```bash
# Analizar un archivo específico
codescanner archivo.js

# Analizar una carpeta completa (recursivo)
codescanner src/

# Analizar la carpeta actual
codescanner .

# Ver ayuda
codescanner --help
```

**Desinstalar (si es necesario)**

```bash
npm uninstall -g codescanner
```

**Nota:** Si prefieres tener el código fuente localmente, puedes clonar el repositorio y luego ejecutar `npm install -g .` desde la carpeta `backend`.

**4. Interpretar el resultado**

El CLI mostrará un reporte con:

- **Total de vulnerabilidades**: Número total encontradas
- **Conteo por severidad**:
  - 🔴 **Alta severidad** (rojo): Vulnerabilidades críticas
  - 🟡 **Media severidad** (amarillo): Vulnerabilidades que requieren atención
  - 🔵 **Baja severidad** (azul): Problemas menores
- **Lista detallada**: Cada vulnerabilidad muestra:
  - Severidad
  - Tipo (ruleId)
  - Archivo y número de línea
  - Descripción breve

**Ejemplo de salida:**

```
================================================================================
CodeScanner - Análisis de vulnerabilidades
================================================================================

Resumen de métricas
--------------------------------------------------------------------------------
Total de vulnerabilidades: 5
  Alta severidad: 2
  Media severidad: 3
  Baja severidad: 0
Archivos analizados: 2

Vulnerabilidades detectadas
--------------------------------------------------------------------------------

1. [HIGH] HARDCODED_SECRET
   Archivo: vulnerable-app.js | Línea: 4
   Descripción: Posible secreto o credencial hardcodeada en el código.
```

Si no se detectan vulnerabilidades, verás:

```
No se detectaron vulnerabilidades en los archivos analizados.
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Análisis de Código con Vulnerabilidades

```javascript
// Código vulnerable de ejemplo
const password = "admin123";  // ❌ Contraseña hardcodeada
const api_key = "sk_live_123"; // ❌ API key expuesta

eval("console.log('test')");  // ❌ Uso de eval()

const query = "SELECT * FROM users WHERE id = " + userId; // ❌ SQL Injection

document.getElementById("div").innerHTML = userInput; // ❌ XSS
```

**Resultado esperado**: El scanner detectará 5 vulnerabilidades (2 alta severidad, 3 media severidad) y generará un reporte detallado con explicaciones y recomendaciones.

### Ejemplo 2: Análisis de Archivo Completo

1. Crea un archivo `mi-app.js` con tu código
2. En la interfaz web, haz clic en "Elegir archivo"
3. Selecciona `mi-app.js`
4. Haz clic en "Analizar código"
5. Revisa el reporte completo con métricas y análisis inteligente

### Ejemplo 3: Uso del CLI

```bash
# Analizar un archivo
node backend/cli.js mi-archivo.js

# Analizar múltiples archivos
node backend/cli.js src/app.js src/server.js

# Generar reporte JSON
node backend/cli.js mi-archivo.js --output report.json
```

---

## ⚠️ Limitaciones del Prototipo

Esta versión MVP tiene las siguientes limitaciones:

- **No multiusuario**: La herramienta está diseñada para uso individual o en equipo pequeño
- **No almacenamiento persistente**: Los análisis no se guardan; cada ejecución es independiente
- **Solo JavaScript**: Actualmente solo analiza código JavaScript (Node.js, Express, JavaScript de navegador)
- **No autenticación**: No hay sistema de usuarios ni permisos
- **Análisis estático básico**: No analiza dependencias, configuraciones de servidor ni contenedores
- **Sin integración CI/CD**: No hay integración automática con pipelines de despliegue


---

## 🔮 Visión Futura

CodeScanner está diseñado para crecer y evolucionar. Las siguientes funcionalidades están planificadas:

### Escalabilidad
- **Multiusuario**: Sistema de autenticación y gestión de usuarios
- **Almacenamiento persistente**: Base de datos para guardar historial de análisis
- **Comparación de versiones**: Ver cómo cambian las vulnerabilidades entre commits

### Integración
- **GitHub/GitLab**: Integración directa con repositorios para análisis automático
- **CI/CD**: Plugins para GitHub Actions, GitLab CI, Jenkins
- **APIs públicas**: Endpoint REST para integración con otras herramientas

### Soporte de Lenguajes
- **Python**: Detección de vulnerabilidades en Flask, Django
- **Java**: Análisis de aplicaciones Spring Boot
- **PHP**: Detección en Laravel, WordPress
- **TypeScript**: Soporte mejorado para proyectos TypeScript

### Funcionalidades Avanzadas
- **Análisis de dependencias**: Detección de CVEs en paquetes npm
- **Reportes de auditoría**: Generación de reportes PDF/HTML profesionales
- **Dashboard de métricas**: Visualización de tendencias de seguridad
- **IA mejorada**: Integración opcional con modelos de lenguaje para análisis más profundo

---

## 🇸🇻 Impacto en El Salvador

En El Salvador, la ciberseguridad se ha convertido en una prioridad nacional. Instituciones gubernamentales, empresas privadas, startups tecnológicas y organizaciones sin fines de lucro manejan datos sensibles de ciudadanos, clientes y usuarios. Un error de seguridad puede resultar en:

- **Pérdida de datos personales** de miles de ciudadanos
- **Compromiso de sistemas gubernamentales** críticos
- **Pérdidas financieras** para empresas y usuarios
- **Daño a la reputación** de instituciones públicas y privadas

CodeScanner ayuda a prevenir estos problemas al:

1. **Educar a desarrolladores**: Muestra qué prácticas son inseguras y cómo corregirlas
2. **Prevenir vulnerabilidades comunes**: Detecta errores antes de que lleguen a producción
3. **Democratizar la seguridad**: Proporciona herramientas gratuitas accesibles para todos
4. **Mejorar la postura de seguridad**: Ayuda a equipos pequeños a mantener estándares básicos de seguridad

Al hacer que el análisis de seguridad sea accesible y fácil de usar, CodeScanner contribuye a fortalecer el ecosistema tecnológico de El Salvador, permitiendo que más desarrolladores y organizaciones puedan proteger sus aplicaciones sin necesidad de grandes inversiones en herramientas comerciales.

---

## 📄 Licencia

Este proyecto fue desarrollado para un hackatón. El código está disponible para fines educativos y de demostración.

**Nota**: Este es un prototipo desarrollado para un hackatón. Para uso en producción, se recomienda revisar y ajustar según las necesidades específicas del proyecto.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras un bug, tienes una idea para mejorar, o quieres agregar una nueva regla de detección, por favor:

1. Abre un issue describiendo el problema o la mejora
2. Crea un fork del repositorio
3. Realiza tus cambios
4. Envía un pull request

---

## 📧 Contacto

Para preguntas, sugerencias o colaboraciones, puedes contactar al equipo de desarrollo.

---

**CodeScanner** - Haciendo la seguridad de código accesible para todos 🚀
