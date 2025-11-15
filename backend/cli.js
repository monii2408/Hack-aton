#!/usr/bin/env node

/**
 * CodeScanner CLI - Herramienta de línea de comandos
 * Uso: node cli.js <archivo1> [archivo2] [archivo3] ...
 * Ejemplo: node cli.js app.js server.js
 */

const fs = require('fs');
const path = require('path');
const { scanFile } = require('./scanner');
const { analyzeFindings } = require('./aiAnalyzer');

// Colores para la terminal (ANSI escape codes)
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Función para leer archivo
function readFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(colorize(`❌ Error: El archivo "${filePath}" no existe.`, 'red'));
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    return { filename: path.basename(filePath), content };
  } catch (error) {
    console.error(colorize(`❌ Error al leer "${filePath}": ${error.message}`, 'red'));
    return null;
  }
}

// Función para mostrar resultados en consola
function displayResults(findings, analysis, files) {
  console.log('\n' + '='.repeat(80));
  console.log(colorize('🔒 CODESCANNER - REPORTE DE VULNERABILIDADES', 'bright'));
  console.log('='.repeat(80) + '\n');

  // Resumen general
  const { summary, groups } = analysis;
  const riskColors = {
    'crítico': 'red',
    'alto': 'red',
    'medio-alto': 'yellow',
    'medio': 'yellow',
    'bajo': 'green'
  };

  console.log(colorize('📊 RESUMEN GENERAL', 'bright'));
  console.log('-'.repeat(80));
  console.log(`Archivos analizados: ${colorize(files.length, 'cyan')}`);
  console.log(`Total de vulnerabilidades: ${colorize(summary.total, summary.total > 0 ? 'red' : 'green')}`);
  console.log(`  ${colorize('● Alta severidad:', 'red')} ${summary.bySeverity.high}`);
  console.log(`  ${colorize('● Media severidad:', 'yellow')} ${summary.bySeverity.medium}`);
  console.log(`  ${colorize('● Baja severidad:', 'green')} ${summary.bySeverity.low}`);
  console.log(`Nivel de riesgo: ${colorize(summary.riskLevel.toUpperCase(), riskColors[summary.riskLevel] || 'yellow')}`);
  console.log(`\n${summary.message}\n`);

  // Grupos de vulnerabilidades
  if (groups.length > 0) {
    console.log(colorize('📋 VULNERABILIDADES POR TIPO', 'bright'));
    console.log('-'.repeat(80));
    
    groups.forEach((group, index) => {
      const severityColor = group.severity === 'high' ? 'red' : 
                           group.severity === 'medium' ? 'yellow' : 'green';
      
      console.log(`\n${index + 1}. ${colorize(group.name, 'bright')}`);
      console.log(`   Severidad: ${colorize(group.severity.toUpperCase(), severityColor)} | Ocurrencias: ${colorize(group.count, 'cyan')}`);
      console.log(`   ${colorize('¿Qué es?', 'bright')} ${group.explanation}`);
      console.log(`   ${colorize('Impacto:', 'bright')} ${group.impact}`);
      console.log(`   ${colorize('Recomendación:', 'bright')} ${group.remediation}`);
    });
  }

  // Detalles línea por línea
  if (findings.length > 0) {
    console.log('\n' + colorize('📝 DETALLES POR LÍNEA', 'bright'));
    console.log('-'.repeat(80));
    
    // Agrupar por archivo
    const byFile = {};
    findings.forEach(f => {
      if (!byFile[f.filename]) {
        byFile[f.filename] = [];
      }
      byFile[f.filename].push(f);
    });

    Object.keys(byFile).forEach(filename => {
      console.log(`\n${colorize(`📄 ${filename}`, 'cyan')}`);
      byFile[filename].forEach(finding => {
        const severityColor = finding.severity === 'high' ? 'red' : 
                             finding.severity === 'medium' ? 'yellow' : 'green';
        const severityBadge = colorize(`[${finding.severity.toUpperCase()}]`, severityColor);
        
        console.log(`  Línea ${colorize(finding.line, 'bright')}: ${severityBadge} ${colorize(finding.ruleId, 'magenta')}`);
        console.log(`    ${finding.description}`);
        console.log(`    → ${colorize(finding.recommendation, 'yellow')}`);
      });
    });
  } else {
    console.log(colorize('\n✅ No se detectaron vulnerabilidades en el código analizado.', 'green'));
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

// Función principal
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(colorize('🔒 CodeScanner CLI - Analizador de Vulnerabilidades', 'bright'));
    console.log('\n📖 Uso:');
    console.log(colorize('  node cli.js <archivo1> [archivo2] [archivo3] ...', 'cyan'));
    console.log('\n💡 Ejemplos:');
    console.log('  node cli.js app.js');
    console.log('  node cli.js app.js server.js config.js');
    console.log('  node cli.js ../example-vulnerable.js');
    console.log('\n⚙️  Opciones:');
    console.log('  --json          Exportar resultados en formato JSON');
    console.log('  --output <file> Guardar reporte en archivo JSON');
    console.log('\n📝 Nota: Puedes usar rutas relativas o absolutas');
    console.log('   Ejemplo: node cli.js ../example-vulnerable.js\n');
    process.exit(0);
  }

  // Procesar argumentos
  const files = [];
  let jsonOutput = false;
  let outputFile = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--json') {
      jsonOutput = true;
    } else if (args[i] === '--output' && i + 1 < args.length) {
      outputFile = args[i + 1];
      i++;
    } else if (!args[i].startsWith('--')) {
      files.push(args[i]);
    }
  }

  if (files.length === 0) {
    console.error(colorize('❌ Error: Debes especificar al menos un archivo para analizar.', 'red'));
    process.exit(1);
  }

  // Leer y escanear archivos
  const fileContents = [];
  let hasErrors = false;

  files.forEach(filePath => {
    const file = readFile(filePath);
    if (file) {
      fileContents.push(file);
    } else {
      hasErrors = true;
    }
  });

  if (fileContents.length === 0) {
    console.error(colorize('❌ Error: No se pudo leer ningún archivo válido.', 'red'));
    process.exit(1);
  }

  // Escanear archivos
  const allFindings = [];
  fileContents.forEach(file => {
    const findings = scanFile(file.content, file.filename);
    allFindings.push(...findings);
  });

  // Análisis inteligente
  const analysis = analyzeFindings(allFindings);
  const result = {
    findings: allFindings,
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

  // Mostrar o exportar resultados
  if (jsonOutput || outputFile) {
    const jsonResult = JSON.stringify(result, null, 2);
    
    if (outputFile) {
      fs.writeFileSync(outputFile, jsonResult, 'utf8');
      console.log(colorize(`✅ Reporte guardado en: ${outputFile}`, 'green'));
    } else {
      console.log(jsonResult);
    }
  } else {
    displayResults(allFindings, result, fileContents);
  }

  // Exit code basado en vulnerabilidades encontradas
  if (allFindings.length > 0) {
    process.exit(1); // Hay vulnerabilidades
  } else {
    process.exit(0); // No hay vulnerabilidades
  }
}

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = { main };

