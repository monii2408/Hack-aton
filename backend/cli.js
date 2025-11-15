#!/usr/bin/env node

/**
 * CodeScanner CLI - Herramienta de línea de comandos
 * Uso: codescanner <archivo> | codescanner --path <carpeta>
 * Ejemplo: codescanner app.js
 * Ejemplo: codescanner --path src/
 */

const fs = require('fs');
const path = require('path');

// Encontrar el directorio del módulo (funciona tanto local como globalmente)
// Cuando se ejecuta como binario global, __dirname apunta al directorio del paquete instalado
const backendDir = __dirname;

// Importar módulos del scanner
const { scanFile } = require(path.join(backendDir, 'scanner'));
const { analyzeFindings } = require(path.join(backendDir, 'aiAnalyzer'));

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
      console.error(colorize(`Error: El archivo "${filePath}" no existe.`, 'red'));
      return null;
    }
    
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      console.error(colorize(`Error: "${filePath}" no es un archivo.`, 'red'));
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    return { filename: path.basename(filePath), filepath: filePath, content };
  } catch (error) {
    console.error(colorize(`Error al leer "${filePath}": ${error.message}`, 'red'));
    return null;
  }
}

// Función para leer archivos de una carpeta recursivamente
function readDirectory(dirPath, fileExtensions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.txt']) {
  const files = [];
  
  try {
    if (!fs.existsSync(dirPath)) {
      console.error(colorize(`Error: La carpeta "${dirPath}" no existe.`, 'red'));
      return files;
    }
    
    const stats = fs.statSync(dirPath);
    if (!stats.isDirectory()) {
      console.error(colorize(`Error: "${dirPath}" no es una carpeta.`, 'red'));
      return files;
    }
    
    function walkDir(currentPath) {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        // Ignorar node_modules, .git, y otros directorios comunes
        if (entry.isDirectory()) {
          if (!['node_modules', '.git', '.next', 'dist', 'build', '.vscode', '.idea'].includes(entry.name)) {
            walkDir(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (fileExtensions.length === 0 || fileExtensions.includes(ext)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              files.push({
                filename: entry.name,
                filepath: fullPath,
                content
              });
            } catch (error) {
              console.error(colorize(`Advertencia: No se pudo leer "${fullPath}": ${error.message}`, 'yellow'));
            }
          }
        }
      }
    }
    
    walkDir(dirPath);
  } catch (error) {
    console.error(colorize(`Error al leer la carpeta "${dirPath}": ${error.message}`, 'red'));
  }
  
  return files;
}

// Función para mostrar resultados en consola
function displayResults(findings, analysis, files) {
  console.log('\n' + '='.repeat(80));
  console.log(colorize('CodeScanner - Análisis de vulnerabilidades', 'bright'));
  console.log('='.repeat(80) + '\n');

  // Resumen de métricas
  const { summary, groups } = analysis;
  
  console.log(colorize('Resumen de métricas', 'bright'));
  console.log('-'.repeat(80));
  console.log(`Total de vulnerabilidades: ${colorize(summary.total, summary.total > 0 ? 'red' : 'green')}`);
  console.log(`  Alta severidad: ${colorize(summary.bySeverity.high, 'red')}`);
  console.log(`  Media severidad: ${colorize(summary.bySeverity.medium, 'yellow')}`);
  console.log(`  Baja severidad: ${colorize(summary.bySeverity.low, 'blue')}`);
  console.log(`Archivos analizados: ${colorize(files.length, 'cyan')}\n`);

  // Lista detallada línea por línea (PRIMERO)
  if (findings.length > 0) {
    console.log(colorize('Detalles por Línea', 'bright'));
    console.log('-'.repeat(80));
    
    // Agrupar por archivo para mejor organización
    const byFile = {};
    findings.forEach(f => {
      if (!byFile[f.filename]) {
        byFile[f.filename] = [];
      }
      byFile[f.filename].push(f);
    });

    Object.keys(byFile).forEach(filename => {
      console.log(`\n${colorize(`Archivo: ${filename}`, 'cyan')}`);
      byFile[filename].forEach((finding, index) => {
        const severityColor = finding.severity === 'high' ? 'red' : 
                             finding.severity === 'medium' ? 'yellow' : 'blue';
        const severityBadge = colorize(`[${finding.severity.toUpperCase()}]`, severityColor);
        
        console.log(`  ${index + 1}. Línea ${colorize(finding.line, 'bright')}: ${severityBadge} ${colorize(finding.ruleId, 'magenta')}`);
        console.log(`     ${finding.description}`);
        console.log(`     → ${colorize(finding.recommendation, 'yellow')}`);
      });
    });
    console.log('');
    console.log('='.repeat(80));
    console.log('');
  } else {
    console.log(colorize('No se detectaron vulnerabilidades en los archivos analizados.', 'green'));
    console.log('');
    console.log('='.repeat(80));
    console.log('');
  }

  // Resumen global inteligente (IA basada en reglas) - AL FINAL
  if (summary.message) {
    console.log(colorize('ANÁLISIS INTELIGENTE - RESUMEN DE VULNERABILIDAD', 'bright'));
    console.log('='.repeat(80));
    console.log('');
    
    // Mostrar nivel de riesgo destacado
    const riskColors = {
      'crítico': 'red',
      'alto': 'red',
      'medio-alto': 'yellow',
      'medio': 'yellow',
      'bajo': 'green'
    };
    const riskColor = riskColors[summary.riskLevel] || 'yellow';
    console.log(colorize('NIVEL DE RIESGO GENERAL:', 'bright') + ` ${colorize(summary.riskLevel.toUpperCase(), riskColor)}`);
    console.log('');
    
    // Mensaje completo del análisis
    console.log(colorize('Resumen del análisis:', 'bright'));
    console.log(summary.message);
    console.log('');
    console.log('='.repeat(80));
    console.log('');
  }

  // Grupos de vulnerabilidades con explicaciones detalladas - AL FINAL
  if (groups && groups.length > 0) {
    console.log(colorize('¿POR QUÉ ES VULNERABLE EL PROGRAMA?', 'bright'));
    console.log('='.repeat(80));
    console.log('');
    console.log(colorize('El programa presenta vulnerabilidades en las siguientes categorías:', 'bright'));
    console.log('');
    
    groups.forEach((group, index) => {
      const severityColor = group.severity === 'high' ? 'red' : 
                           group.severity === 'medium' ? 'yellow' : 'blue';
      const severityBadge = colorize(`[${group.severity.toUpperCase()}]`, severityColor);
      
      console.log(colorize(`\n${index + 1}. ${group.name}`, 'bright') + ` ${severityBadge}`);
      console.log(`   ${colorize('Encontradas:', 'cyan')} ${colorize(`${group.count} ocurrencia(s)`, 'cyan')}`);
      console.log(`   ${colorize('¿Qué significa?', 'bright')}`);
      console.log(`   ${group.explanation}`);
      console.log(`   ${colorize('¿Cuál es el impacto?', 'bright')}`);
      console.log(`   ${group.impact}`);
      console.log(`   ${colorize('¿Cómo solucionarlo?', 'bright')}`);
      console.log(`   ${group.remediation}`);
      if (index < groups.length - 1) {
        console.log('');
        console.log('-'.repeat(80));
      }
    });
    console.log('');
    console.log('='.repeat(80));
    console.log('');
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

// Función principal
function main() {
  const args = process.argv.slice(2);

  // Mostrar ayuda si no hay argumentos
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(colorize('CodeScanner CLI - Analizador de Vulnerabilidades', 'bright'));
    console.log('\nUso:');
    console.log(colorize('  codescanner <archivo>', 'cyan'));
    console.log(colorize('  codescanner <carpeta>', 'cyan'));
    console.log('\nEjemplos:');
    console.log('  codescanner app.js');
    console.log('  codescanner src/');
    console.log('  codescanner ../otro-proyecto/');
    console.log('\nFormas de ejecutar:');
    console.log('  - Si está instalado globalmente: codescanner archivo.js');
    console.log('  - Desde el proyecto: npm run scan -- archivo.js');
    console.log('  - Windows: codescanner.bat archivo.js');
    console.log('  - Linux/Mac: ./codescanner.sh archivo.js');
    console.log('  - Directo: node backend/cli.js archivo.js');
    console.log('\nNota: Puedes usar rutas relativas o absolutas');
    console.log('      Si es una carpeta, se analizarán todos los archivos recursivamente\n');
    process.exit(0);
  }

  // Procesar argumentos
  let targetPath = null;
  let isDirectory = false;

  // Si hay argumentos después de -- (npm run scan -- archivo)
  const actualArgs = args.includes('--') ? args.slice(args.indexOf('--') + 1) : args;

  if (actualArgs.length === 0) {
    console.error(colorize('Error: Debes especificar un archivo o carpeta para analizar.', 'red'));
    console.log('Usa "codescanner --help" o "npm run scan -- --help" para ver la ayuda.');
    process.exit(1);
  }

  targetPath = actualArgs[0];

  // Verificar si es archivo o carpeta
  try {
    const absolutePath = path.isAbsolute(targetPath) 
      ? targetPath 
      : path.resolve(process.cwd(), targetPath);
    
    if (!fs.existsSync(absolutePath)) {
      console.error(colorize(`Error: La ruta "${targetPath}" no existe.`, 'red'));
      process.exit(1);
    }
    
    const stats = fs.statSync(absolutePath);
    isDirectory = stats.isDirectory();
  } catch (error) {
    console.error(colorize(`Error: No se pudo acceder a "${targetPath}": ${error.message}`, 'red'));
    process.exit(1);
  }

  // Leer archivos
  let fileContents = [];
  const absolutePath = path.isAbsolute(targetPath) 
    ? targetPath 
    : path.resolve(process.cwd(), targetPath);
  
  try {
    if (isDirectory) {
      // Leer carpeta recursivamente
      fileContents = readDirectory(absolutePath);
      
      if (fileContents.length === 0) {
        console.error(colorize(`Error: No se encontraron archivos para analizar en "${targetPath}".`, 'red'));
        process.exit(1);
      }
    } else {
      // Leer archivo individual
      const file = readFile(absolutePath);
      
      if (!file) {
        process.exit(1);
      }
      
      fileContents = [file];
    }
  } catch (error) {
    console.error(colorize(`Error: No se pudo acceder a "${targetPath}": ${error.message}`, 'red'));
    process.exit(1);
  }

  // Escanear archivos usando la misma lógica del backend
  const allFindings = [];
  fileContents.forEach(file => {
    const findings = scanFile(file.content, file.filename);
    allFindings.push(...findings);
  });

  // Análisis inteligente usando la misma función del backend (IA basada en reglas)
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

  // Mostrar resultados con todo el análisis inteligente
  displayResults(allFindings, result, fileContents);

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

