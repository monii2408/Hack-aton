const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { scanFile } = require('./scanner');
const { analyzeFindings } = require('./aiAnalyzer');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta absoluta al directorio frontend
const frontendPath = path.join(__dirname, '../frontend');
const indexPath = path.join(frontendPath, 'index.html');

// Servir archivos estáticos del frontend (JS, CSS, etc.)
app.use(express.static(frontendPath));

// Servir index.html en la raíz
app.get('/', (req, res) => {
  // Verificar que el archivo existe
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <h1>Error: Frontend no encontrado</h1>
      <p>No se pudo encontrar el archivo index.html en: ${indexPath}</p>
      <p>Verifica que la carpeta frontend exista y contenga index.html</p>
    `);
  }
});

// Endpoint de prueba de API
app.get('/api', (req, res) => {
  res.send('Scanner backend funcionando');
});

// Endpoint principal de análisis
app.post('/scan', (req, res) => {
  try {
    const { files } = req.body;

    // Validar que files exista y no esté vacío
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        error: 'No se recibió código para analizar',
        message: 'Debes enviar un arreglo "files" con al menos un archivo que contenga código o logs.'
      });
    }

    const findings = [];

    // Escanear cada archivo
    for (const file of files) {
      const { filename, content, kind } = file;

      // Ignorar archivos vacíos o solo espacios
      if (!content || !content.trim()) {
        continue;
      }

      // Escanear el archivo
      const fileFindings = scanFile(content, filename || 'unknown');
      findings.push(...fileFindings);
    }

    // Si no se encontró contenido válido
    if (findings.length === 0 && files.every(f => !f.content || !f.content.trim())) {
      return res.status(400).json({
        error: 'No se encontró contenido válido para analizar',
        message: 'Todos los archivos enviados están vacíos o contienen solo espacios en blanco.'
      });
    }

    // Análisis inteligente basado en reglas
    const analysis = analyzeFindings(findings);

    // Construir respuesta según el formato requerido
    const response = {
      findings, // Lista completa de findings línea por línea
      summary: {
        total: analysis.metrics.total,
        bySeverity: analysis.metrics.bySeverity,
        riskLevel: analysis.globalSummary.riskLevel,
        message: analysis.globalSummary.summary
      },
      groups: analysis.vulnerabilityTypes.map(vuln => ({
        ruleId: vuln.ruleId,
        name: vuln.name,
        severity: vuln.severity,
        count: vuln.count,
        explanation: vuln.explanation,
        impact: vuln.impact,
        remediation: vuln.remediation
      }))
    };

    res.json(response);

  } catch (error) {
    console.error('Error en /scan:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Ocurrió un error al procesar el análisis. Por favor, intenta nuevamente.'
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Scanner backend escuchando en http://localhost:${PORT}`);
  console.log(`Frontend disponible en: ${indexPath}`);
  console.log(`Archivo existe: ${fs.existsSync(indexPath)}`);
});
