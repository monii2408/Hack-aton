/**
 * Scanner estático de vulnerabilidades de seguridad
 * Analiza código fuente línea por línea usando expresiones regulares
 */

const rules = [
  {
    ruleId: "SQL_CONCAT_QUERY",
    regex: /(SELECT|INSERT|UPDATE|DELETE).*\+/i,
    severity: "high",
    description: "Posible SQL injection: consulta SQL construida concatenando strings.",
    recommendation: "Usar prepared statements o consultas parametrizadas en lugar de concatenar valores."
  },
  {
    ruleId: "EVAL_USAGE",
    regex: /eval\s*\(/,
    severity: "high",
    description: "Uso inseguro de eval().",
    recommendation: "Evitar eval() y usar funciones seguras para evaluar o procesar datos."
  },
  {
    ruleId: "HARDCODED_SECRET",
    regex: /(password|PASSWORD|API_KEY|apiKey|SECRET|token|TOKEN)\s*=\s*["'][^"']+["']/i,
    severity: "high",
    description: "Posible secreto o credencial hardcodeada en el código.",
    recommendation: "Usar variables de entorno o un gestor seguro de secretos."
  },
  {
    ruleId: "JWT_EXPOSED",
    regex: /eyJ[A-Za-z0-9_-]{10,}\./,
    severity: "high",
    description: "Se encontró un token JWT en el código.",
    recommendation: "No guardar JWT estáticos en el código ni en repositorios."
  },
  {
    ruleId: "XSS_INNERHTML",
    regex: /innerHTML\s*=\s*/,
    severity: "medium",
    description: "Asignación a innerHTML, posible riesgo de XSS.",
    recommendation: "Usar textContent o sanitizar el HTML antes de insertarlo."
  },
  {
    ruleId: "XSS_DOCUMENT_WRITE",
    regex: /document\.write\(/,
    severity: "medium",
    description: "Uso de document.write(), potencialmente inseguro.",
    recommendation: "Evitar usar document.write(); utilizar métodos modernos de manipulación del DOM."
  },
  {
    ruleId: "PLAINTTEXT_HTTP",
    regex: /http:\/\/[^"'\s]+/,
    severity: "medium",
    description: "Uso de HTTP en lugar de HTTPS.",
    recommendation: "Usar siempre HTTPS para proteger la comunicación."
  },
  {
    ruleId: "LOCALSTORAGE_SENSITIVE",
    regex: /localStorage\.setItem\(/,
    severity: "medium",
    description: "Escritura en localStorage detectada.",
    recommendation: "Evitar guardar información sensible (tokens, contraseñas) en localStorage sin cifrado."
  }
];

/**
 * Escanea un archivo línea por línea buscando vulnerabilidades
 * @param {string} content - Contenido del archivo
 * @param {string} filename - Nombre del archivo
 * @returns {Array} Array de findings detectados
 */
function scanFile(content, filename) {
  const lines = content.split(/\r?\n/);
  const findings = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();

    // Verificar cada regla
    rules.forEach((rule) => {
      if (rule.regex.test(line)) {
        findings.push({
          filename,
          line: lineNumber,
          ruleId: rule.ruleId,
          severity: rule.severity,
          description: rule.description,
          recommendation: rule.recommendation
        });
      }
    });

    // Regla especial: SQL concatenado (debe tener palabra SQL Y símbolo +)
    const hasSqlKeyword = /(SELECT|INSERT|UPDATE|DELETE)/i.test(trimmed);
    if (hasSqlKeyword && trimmed.includes('+')) {
      // Evitar duplicados
      const alreadyFound = findings.some(f => 
        f.line === lineNumber && f.ruleId === 'SQL_CONCAT_QUERY'
      );
      if (!alreadyFound) {
        findings.push({
          filename,
          line: lineNumber,
          ruleId: 'SQL_CONCAT_QUERY',
          severity: 'high',
          description: 'Posible SQL injection: consulta SQL construida concatenando strings.',
          recommendation: 'Usar prepared statements o consultas parametrizadas en lugar de concatenar valores.'
        });
      }
    }

    // Regla especial: Rutas Express sin auth (más precisa)
    const isRoute = /(app|router)\.(get|post)\(/.test(trimmed);
    if (isRoute) {
      // Buscar indicios de autenticación en la misma línea
      const hasAuth = /(auth|isAuthenticated|verifyToken|middleware|authenticate|requireAuth)/i.test(trimmed);
      if (!hasAuth) {
        // Verificar si ya existe este finding para esta línea
        const alreadyFound = findings.some(f => 
          f.line === lineNumber && f.ruleId === 'NO_AUTH_MIDDLEWARE'
        );
        if (!alreadyFound) {
          findings.push({
            filename,
            line: lineNumber,
            ruleId: 'NO_AUTH_MIDDLEWARE',
            severity: 'medium',
            description: 'Ruta de Express sin indicios de middleware de autenticación.',
            recommendation: 'Asegurar que las rutas sensibles estén protegidas por middleware de autenticación/autorización.'
          });
        }
      }
    }
  });

  return findings;
}

module.exports = { scanFile };
