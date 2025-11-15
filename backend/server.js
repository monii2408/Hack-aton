const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('Scanner backend funcionando');
});

/*
  Endpoint: POST /scan
  Recibe: { files: [ { filename, content } ] }
  Devuelve: array de findings detectados
*/
app.post('/scan', (req, res) => {
  const files = req.body.files || [];
  const findings = [];

  for (const file of files) {
    const { filename, content } = file;
    if (!content) continue;

    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmed = line.trim();

      // REGLA 1: SQL concatenado
      const sqlRegex = /(SELECT|INSERT|UPDATE|DELETE)/i;
      if (sqlRegex.test(trimmed) && trimmed.includes('+')) {
        findings.push({
          filename,
          line: lineNumber,
          ruleId: 'SQL_CONCAT_QUERY',
          severity: 'high',
          description: 'Posible SQL injection: consulta SQL construida concatenando strings.',
          recommendation: 'Usar prepared statements o consultas parametrizadas.'
        });
      }

      // REGLA 2: eval()
      if (trimmed.includes('eval(')) {
        findings.push({
          filename,
          line: lineNumber,
          ruleId: 'EVAL_USAGE',
          severity: 'high',
          description: 'Uso de eval(), puede permitir ejecución remota de código.',
          recommendation: 'Evitar eval() y usar alternativas seguras.'
        });
      }

      // REGLA 3: secretos hardcodeados
      const secretRegex = /(password|PASSWORD|API_KEY|apiKey|SECRET|token|TOKEN)/;
      if (secretRegex.test(trimmed)) {
        findings.push({
          filename,
          line: lineNumber,
          ruleId: 'HARDCODED_SECRET',
          severity: 'high',
          description: 'Posible secreto o credencial hardcodeada en el código.',
          recommendation: 'Usar variables de entorno o un gestor seguro de secretos.'
        });
      }

      // REGLA 4: rutas sin autenticación
      const isRoute =
        trimmed.includes('app.get(') ||
        trimmed.includes('app.post(') ||
        trimmed.includes('router.get(') ||
        trimmed.includes('router.post(');

      const hasAuth =
        trimmed.includes('auth') ||
        trimmed.includes('isAuthenticated');

      if (isRoute && !hasAuth) {
        findings.push({
          filename,
          line: lineNumber,
          ruleId: 'NO_AUTH_MIDDLEWARE',
          severity: 'medium',
          description: 'Ruta de Express sin middleware de autenticación.',
          recommendation: 'Agregar middleware de autenticación/autorización.'
        });
      }
    });
  }

  res.json(findings);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Scanner backend escuchando en http://localhost:${PORT}`);
});

