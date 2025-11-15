# 🔒 Vulnerabilidades Detectadas por CodeScanner

Esta es la lista completa de vulnerabilidades de seguridad que CodeScanner puede detectar, organizadas por severidad.

---

## 🔴 ALTA SEVERIDAD

### 1. SQL Injection por Concatenación de Strings
**ID:** `SQL_CONCAT_QUERY`  
**Severidad:** Alta

**Descripción:**
Este error ocurre cuando se construyen consultas SQL concatenando strings directamente con el operador `+`. Esto permite que atacantes inyecten código SQL malicioso a través de parámetros de entrada, pudiendo acceder, modificar o eliminar datos de la base de datos sin autorización.

**Ejemplo de código vulnerable:**
```javascript
const query = "SELECT * FROM users WHERE id = " + userId;
```

**Impacto:**
Alta: Puede comprometer completamente la base de datos, permitiendo robo de información, modificación de datos o eliminación de registros. Es una de las vulnerabilidades más críticas del OWASP Top 10.

**Recomendación:**
Reemplazar todas las concatenaciones de strings en consultas SQL por consultas parametrizadas o prepared statements. Esto asegura que los valores se traten como datos, no como código ejecutable.

**Ejemplo de código seguro:**
```javascript
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);
```

---

### 2. Uso de eval()
**ID:** `EVAL_USAGE`  
**Severidad:** Alta

**Descripción:**
La función `eval()` ejecuta código JavaScript de forma dinámica, lo que puede permitir a atacantes ejecutar código arbitrario si logran inyectar contenido malicioso. Es extremadamente peligrosa porque puede comprometer completamente la aplicación.

**Ejemplo de código vulnerable:**
```javascript
const userInput = req.body.code;
eval(userInput); // ¡MUY PELIGROSO!
```

**Impacto:**
Alta: Permite ejecución remota de código (RCE), lo que puede llevar a robo de datos, modificación del sistema, o uso de la aplicación como punto de entrada para ataques más amplios.

**Recomendación:**
Eliminar completamente el uso de `eval()`. Si es necesario evaluar código dinámico, usar alternativas seguras como `JSON.parse()` para datos estructurados, o funciones específicas que validen y sanitizen la entrada antes de procesarla.

**Alternativas seguras:**
```javascript
// En lugar de eval()
const data = JSON.parse(userInput); // Solo para JSON válido
// O usar funciones específicas que validen la entrada
```

---

### 3. Exposición de Datos Sensibles (Contraseñas, Tokens, API Keys)
**ID:** `HARDCODED_SECRET`  
**Severidad:** Alta

**Descripción:**
Se detectaron credenciales, contraseñas, API keys o tokens hardcodeados directamente en el código fuente. Estos secretos quedan expuestos en el repositorio y pueden ser accedidos por cualquiera que tenga acceso al código.

**Ejemplo de código vulnerable:**
```javascript
const API_KEY = "sk_live_1234567890abcdef";
const password = "miPassword123";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

**Impacto:**
Alta: Si el código se sube a un repositorio público o es accesible por personal no autorizado, los secretos pueden ser robados y utilizados para acceder a servicios externos, bases de datos, o sistemas de terceros asociados a estas credenciales.

**Recomendación:**
Mover todos los secretos a variables de entorno usando archivos `.env` (que deben estar en `.gitignore`), o usar servicios de gestión de secretos como AWS Secrets Manager, HashiCorp Vault, o Azure Key Vault. Nunca commitear secretos al repositorio.

**Ejemplo de código seguro:**
```javascript
const API_KEY = process.env.API_KEY;
const password = process.env.DB_PASSWORD;
```

---

### 4. Token JWT Expuesto
**ID:** `JWT_EXPOSED`  
**Severidad:** Alta

**Descripción:**
Se encontró un token JWT (JSON Web Token) hardcodeado en el código. Los JWT contienen información de autenticación y autorización, y si están expuestos, pueden ser utilizados por atacantes para impersonar usuarios.

**Ejemplo de código vulnerable:**
```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
```

**Impacto:**
Alta: Un atacante que obtenga el token puede acceder a recursos protegidos como si fuera el usuario legítimo, pudiendo robar datos, modificar información o realizar acciones no autorizadas.

**Recomendación:**
Nunca hardcodear tokens JWT. Los tokens deben generarse dinámicamente durante el proceso de autenticación y almacenarse de forma segura (cookies httpOnly, o almacenamiento seguro del lado del cliente). Los tokens deben tener tiempo de expiración y ser revocados cuando sea necesario.

---

## 🟡 MEDIA SEVERIDAD

### 5. Riesgo de Cross-Site Scripting (XSS) por innerHTML
**ID:** `XSS_INNERHTML`  
**Severidad:** Media

**Descripción:**
El uso de `innerHTML` para insertar contenido dinámico puede permitir que código JavaScript malicioso se ejecute en el navegador de los usuarios si el contenido no está sanitizado. Esto ocurre cuando se inserta HTML que contiene scripts ejecutables.

**Ejemplo de código vulnerable:**
```javascript
const userComment = req.body.comment;
document.getElementById('content').innerHTML = userComment; // Peligroso si userComment contiene <script>
```

**Impacto:**
Media-Alta: Puede permitir a atacantes robar cookies de sesión, tokens de autenticación, o realizar acciones en nombre del usuario. También puede usarse para redirigir a sitios maliciosos o mostrar contenido falso.

**Recomendación:**
Reemplazar `innerHTML` por `textContent` cuando solo se necesite texto plano. Si se requiere HTML, usar una librería de sanitización como DOMPurify para limpiar el contenido antes de insertarlo. Validar y escapar toda entrada del usuario.

**Ejemplo de código seguro:**
```javascript
// Para texto plano
element.textContent = userInput;

// Para HTML (con sanitización)
element.innerHTML = DOMPurify.sanitize(userInput);
```

---

### 6. Riesgo de XSS por document.write()
**ID:** `XSS_DOCUMENT_WRITE`  
**Severidad:** Media

**Descripción:**
El método `document.write()` puede inyectar código HTML/JavaScript directamente en el DOM, lo que es peligroso si el contenido proviene de fuentes no confiables. Es un método obsoleto y potencialmente inseguro.

**Ejemplo de código vulnerable:**
```javascript
const userInput = req.query.data;
document.write(userInput); // Peligroso
```

**Impacto:**
Media: Similar a `innerHTML`, puede permitir ejecución de código malicioso en el navegador del usuario, comprometiendo la sesión y permitiendo robo de información sensible.

**Recomendación:**
Eliminar `document.write()` y usar métodos modernos de manipulación del DOM como `createElement()`, `appendChild()`, o `innerHTML` (con sanitización). Preferir frameworks modernos que manejen el DOM de forma segura.

**Ejemplo de código seguro:**
```javascript
const element = document.createElement('div');
element.textContent = userInput;
document.body.appendChild(element);
```

---

### 7. Uso de Conexiones HTTP Inseguras
**ID:** `PLAINTTEXT_HTTP`  
**Severidad:** Media

**Descripción:**
Se detectaron URLs que usan el protocolo HTTP en lugar de HTTPS. Las conexiones HTTP transmiten datos en texto plano, lo que permite que cualquier persona que intercepte el tráfico de red pueda leer la información transmitida.

**Ejemplo de código vulnerable:**
```javascript
fetch("http://api.example.com/data"); // Inseguro
```

**Impacto:**
Media: Permite a atacantes realizar ataques de "man-in-the-middle" para interceptar y modificar comunicaciones, robar credenciales, tokens, o datos sensibles que se transmitan entre el cliente y el servidor.

**Recomendación:**
Reemplazar todas las URLs HTTP por HTTPS. Asegurarse de que todos los endpoints de API, recursos externos, y comunicaciones usen HTTPS. Configurar redirecciones automáticas de HTTP a HTTPS en el servidor.

**Ejemplo de código seguro:**
```javascript
fetch("https://api.example.com/data"); // Seguro
```

**Nota:** El scanner ignora automáticamente namespaces XML estándar como `xmlns="http://www.w3.org/2000/svg"` ya que no son URLs de recursos.

---

### 8. Almacenamiento Inseguro en localStorage
**ID:** `LOCALSTORAGE_SENSITIVE`  
**Severidad:** Media

**Descripción:**
Se detectó el uso de `localStorage.setItem()` para almacenar datos. `localStorage` es accesible por cualquier script en la misma página, lo que lo hace vulnerable a ataques XSS. Si se almacenan tokens o información sensible, pueden ser robados fácilmente.

**Ejemplo de código vulnerable:**
```javascript
localStorage.setItem('authToken', token); // Peligroso si el token es sensible
localStorage.setItem('password', password); // MUY PELIGROSO
```

**Impacto:**
Media: Si se almacenan tokens de autenticación, contraseñas, o datos sensibles en `localStorage`, un ataque XSS puede robar esta información. `localStorage` persiste entre sesiones, aumentando el riesgo.

**Recomendación:**
No almacenar información sensible (tokens, contraseñas, datos personales) en `localStorage`. Si es necesario almacenar tokens, usar cookies `httpOnly` (más seguras) o `sessionStorage` (se limpia al cerrar la pestaña). Si se debe usar `localStorage`, cifrar los datos antes de almacenarlos.

**Ejemplo de código seguro:**
```javascript
// Para tokens, usar cookies httpOnly (lado del servidor)
// O sessionStorage si es necesario en el cliente
sessionStorage.setItem('tempData', data); // Se limpia al cerrar

// Si se debe usar localStorage, cifrar primero
const encrypted = encrypt(data);
localStorage.setItem('encryptedData', encrypted);
```

---

### 9. Rutas de Express sin Middleware de Autenticación
**ID:** `NO_AUTH_MIDDLEWARE`  
**Severidad:** Media

**Descripción:**
Se detectaron rutas definidas con `app.get()`, `app.post()`, `router.get()` o `router.post()` que no muestran indicios de tener middleware de autenticación. Esto significa que estas rutas pueden ser accesibles públicamente sin verificación de identidad.

**Ejemplo de código vulnerable:**
```javascript
app.get('/api/users', (req, res) => {
  // Sin middleware de autenticación
  res.json(getAllUsers());
});
```

**Impacto:**
Media-Alta: Rutas sin autenticación pueden exponer endpoints sensibles a usuarios no autorizados, permitiendo acceso a datos privados, modificación de información, o ejecución de acciones privilegiadas sin autorización.

**Recomendación:**
Agregar middleware de autenticación a todas las rutas sensibles. Usar librerías como Passport.js, JWT, o implementar middleware personalizado que verifique tokens o sesiones antes de permitir el acceso. Aplicar el principio de "denegar por defecto" y solo permitir acceso a rutas públicas explícitamente marcadas.

**Ejemplo de código seguro:**
```javascript
// Con middleware de autenticación
app.get('/api/users', authenticateToken, (req, res) => {
  res.json(getAllUsers());
});

// O con Passport.js
app.get('/api/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(getAllUsers());
});
```

---

## 📊 Resumen de Detección

| Vulnerabilidad | Severidad | OWASP Top 10 | Detección |
|----------------|-----------|--------------|-----------|
| SQL Injection | Alta | A03:2021 - Injection | ✅ |
| eval() Usage | Alta | A03:2021 - Injection | ✅ |
| Hardcoded Secrets | Alta | A02:2021 - Cryptographic Failures | ✅ |
| JWT Exposed | Alta | A02:2021 - Cryptographic Failures | ✅ |
| XSS (innerHTML) | Media | A03:2021 - Injection | ✅ |
| XSS (document.write) | Media | A03:2021 - Injection | ✅ |
| HTTP Insecure | Media | A02:2021 - Cryptographic Failures | ✅ |
| localStorage Sensitive | Media | A05:2021 - Security Misconfiguration | ✅ |
| No Auth Middleware | Media | A01:2021 - Broken Access Control | ✅ |

---

## 🔍 Notas Importantes

1. **Falsos Positivos:** El scanner puede generar algunos falsos positivos. Siempre revisa manualmente los resultados antes de tomar acciones.

2. **Cobertura Limitada:** Este scanner detecta patrones comunes, pero no reemplaza una auditoría de seguridad completa. Para aplicaciones críticas, considera herramientas profesionales adicionales.

3. **Contexto:** Algunas vulnerabilidades pueden ser aceptables en contextos específicos (por ejemplo, `localStorage` para datos no sensibles). Evalúa cada caso según tu contexto.

4. **Actualizaciones:** Las reglas se actualizan periódicamente. Mantén el scanner actualizado para detectar nuevas vulnerabilidades.

---

**Última actualización:** Diciembre 2024  
**Versión del Scanner:** 1.0.0

