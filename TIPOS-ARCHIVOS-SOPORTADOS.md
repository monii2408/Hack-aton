# Tipos de Archivos Soportados por CodeScanner

## 📋 Resumen

CodeScanner está **optimizado principalmente para JavaScript/TypeScript**, pero puede analizar otros tipos de archivos de texto plano.

---

## ✅ Archivos Completamente Soportados

### JavaScript/TypeScript (Soporte Completo)

**Extensiones:**
- `.js` - JavaScript
- `.jsx` - React JSX
- `.ts` - TypeScript
- `.tsx` - React TypeScript

**Vulnerabilidades detectadas:**
- ✅ SQL Injection (concatenación de strings)
- ✅ Uso de `eval()`
- ✅ Secretos hardcodeados (passwords, API keys, tokens)
- ✅ Tokens JWT expuestos
- ✅ XSS (`innerHTML`, `document.write()`)
- ✅ HTTP inseguro (en lugar de HTTPS)
- ✅ `localStorage` inseguro
- ✅ Rutas Express sin autenticación

**Ejemplo:**
```bash
codescanner app.js
codescanner src/
```

---

## ⚠️ Archivos con Soporte Parcial

### HTML (Soporte Parcial)

**Extensiones:**
- `.html`
- `.htm`

**Vulnerabilidades detectadas:**
- ✅ XSS (`innerHTML`, `document.write()`)
- ✅ HTTP inseguro
- ✅ Secretos hardcodeados (si están en el HTML)
- ❌ SQL Injection (no aplica en HTML)
- ❌ `eval()` (puede detectarlo si está en scripts inline)
- ❌ Rutas Express (no aplica)

**Ejemplo:**
```bash
codescanner index.html
```

### Archivos de Texto (Soporte Básico)

**Extensiones:**
- `.txt`
- `.log`
- Sin extensión (archivos de texto plano)

**Vulnerabilidades detectadas:**
- ✅ Secretos hardcodeados (passwords, API keys, tokens)
- ✅ Tokens JWT expuestos
- ✅ HTTP inseguro
- ⚠️ SQL Injection (solo si el patrón es similar a JavaScript)
- ❌ `eval()` (no aplica en texto plano)
- ❌ XSS (no aplica en texto plano)

**Ejemplo:**
```bash
codescanner config.txt
codescanner error.log
```

---

## ❌ Archivos NO Soportados (Actual)

### Python

**Razón:** Las reglas están diseñadas para sintaxis JavaScript. Python tiene sintaxis diferente:
- Python usa `exec()` en lugar de `eval()` (aunque también tiene `eval()`)
- Python no usa `innerHTML` ni `document.write()`
- Las consultas SQL en Python usan bibliotecas diferentes

**Estado:** No detectará vulnerabilidades específicas de Python.

**Ejemplo de lo que NO detectará:**
```python
# Esto NO será detectado correctamente
query = "SELECT * FROM users WHERE id = " + user_id  # SQL injection
exec(user_input)  # Ejecución de código insegura
```

### C / C++

**Razón:** Lenguaje compilado con sintaxis completamente diferente:
- No usa `eval()` ni `exec()`
- No tiene `innerHTML` ni `document.write()`
- Las vulnerabilidades son diferentes (buffer overflow, memory leaks, etc.)

**Estado:** No detectará vulnerabilidades específicas de C/C++.

### Java

**Razón:** Sintaxis diferente:
- Java usa `Runtime.exec()` en lugar de `eval()`
- No tiene `innerHTML` ni `document.write()`
- Las consultas SQL usan PreparedStatement (diferente sintaxis)

**Estado:** No detectará vulnerabilidades específicas de Java.

### JSON

**Razón:** JSON es un formato de datos, no código ejecutable:
- Puede detectar secretos hardcodeados si están en valores JSON
- Puede detectar tokens JWT si están en el JSON
- No detectará vulnerabilidades de código porque JSON no es código

**Ejemplo:**
```json
{
  "apiKey": "secret123",  // ✅ Esto SÍ se detectará
  "password": "mypass"     // ✅ Esto SÍ se detectará
}
```

### Bases de Datos (SQL, SQLite, etc.)

**Razón:** Los archivos SQL son scripts de base de datos:
- Puede detectar SQL injection si está en código JavaScript que construye queries
- No analiza archivos `.sql` directamente
- No detecta vulnerabilidades específicas de bases de datos

**Estado:** No analiza archivos `.sql` directamente.

---

## 🔍 Cómo Funciona Actualmente

### Proceso de Análisis

1. **Lee el archivo como texto plano**
2. **Aplica expresiones regulares** diseñadas para JavaScript
3. **Busca patrones** de vulnerabilidades comunes
4. **Reporta hallazgos** línea por línea

### Limitaciones

- **No analiza sintaxis:** No entiende la estructura del código, solo busca patrones de texto
- **Falsos positivos posibles:** Puede marcar código seguro como vulnerable si coincide con un patrón
- **Optimizado para JavaScript:** Las reglas están diseñadas para sintaxis JavaScript/TypeScript

---

## 📊 Tabla Comparativa

| Tipo de Archivo | Soporte | SQL Injection | eval() | XSS | Secretos | HTTP | Express |
|----------------|---------|---------------|--------|-----|----------|------|---------|
| `.js`, `.jsx` | ✅ Completo | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `.ts`, `.tsx` | ✅ Completo | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `.html` | ⚠️ Parcial | ❌ | ⚠️ | ✅ | ✅ | ✅ | ❌ |
| `.txt`, `.log` | ⚠️ Básico | ⚠️ | ❌ | ❌ | ✅ | ✅ | ❌ |
| `.py` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| `.c`, `.cpp` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| `.java` | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| `.json` | ⚠️ Solo secretos | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| `.sql` | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## 🚀 Uso Recomendado

### Para JavaScript/TypeScript
```bash
# ✅ RECOMENDADO - Funciona perfectamente
codescanner app.js
codescanner src/
codescanner *.js
```

### Para HTML
```bash
# ⚠️ Funciona pero con limitaciones
codescanner index.html
codescanner templates/
```

### Para Archivos de Texto/Configuración
```bash
# ⚠️ Solo detecta secretos y tokens
codescanner config.txt
codescanner .env
```

### Para Otros Lenguajes
```bash
# ❌ NO RECOMENDADO - No detectará vulnerabilidades específicas
codescanner app.py      # Python
codescanner main.c      # C
codescanner App.java    # Java
```

---

## 💡 Futuras Mejoras

Para soportar otros lenguajes, se necesitaría:

1. **Agregar reglas específicas** para cada lenguaje
2. **Usar parsers** para entender la sintaxis (no solo expresiones regulares)
3. **Bibliotecas de análisis estático** específicas por lenguaje

**Ejemplo de mejora futura:**
- Python: Detectar `exec()`, `eval()`, SQL injection con sintaxis Python
- C/C++: Detectar buffer overflow, memory leaks, uso inseguro de funciones
- Java: Detectar `Runtime.exec()`, SQL injection con JDBC, etc.

---

## 📝 Conclusión

**CodeScanner funciona mejor con:**
- ✅ JavaScript/TypeScript (soporte completo)
- ⚠️ HTML (soporte parcial)
- ⚠️ Archivos de texto (solo secretos y tokens)

**CodeScanner NO funciona bien con:**
- ❌ Python
- ❌ C/C++
- ❌ Java
- ❌ Otros lenguajes compilados o con sintaxis diferente

**Recomendación:** Usa CodeScanner principalmente para proyectos JavaScript/TypeScript/Node.js.

