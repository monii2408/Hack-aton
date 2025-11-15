/**
 * Módulo de "IA basada en reglas"
 * Agrupa findings, calcula métricas y genera explicaciones y recomendaciones
 * Todo basado en lógica determinista, sin APIs externas
 */

// Mapeo de ruleIds a nombres descriptivos y explicaciones
const vulnerabilityInfo = {
  'SQL_CONCAT_QUERY': {
    name: 'SQL Injection por concatenación de strings',
    explanation: 'Este error ocurre cuando se construyen consultas SQL concatenando strings directamente con el operador +. Esto permite que atacantes inyecten código SQL malicioso a través de parámetros de entrada, pudiendo acceder, modificar o eliminar datos de la base de datos sin autorización.',
    impact: 'Alta: Puede comprometer completamente la base de datos, permitiendo robo de información, modificación de datos o eliminación de registros. Es una de las vulnerabilidades más críticas del OWASP Top 10.',
    remediation: 'Reemplazar todas las concatenaciones de strings en consultas SQL por consultas parametrizadas o prepared statements. Esto asegura que los valores se traten como datos, no como código ejecutable.'
  },
  'EVAL_USAGE': {
    name: 'Uso de eval()',
    explanation: 'La función eval() ejecuta código JavaScript de forma dinámica, lo que puede permitir a atacantes ejecutar código arbitrario si logran inyectar contenido malicioso. Es extremadamente peligrosa porque puede comprometer completamente la aplicación.',
    impact: 'Alta: Permite ejecución remota de código (RCE), lo que puede llevar a robo de datos, modificación del sistema, o uso de la aplicación como punto de entrada para ataques más amplios.',
    remediation: 'Eliminar completamente el uso de eval(). Si es necesario evaluar código dinámico, usar alternativas seguras como JSON.parse() para datos estructurados, o funciones específicas que validen y sanitizen la entrada antes de procesarla.'
  },
  'HARDCODED_SECRET': {
    name: 'Exposición de datos sensibles (contraseñas, tokens, API keys)',
    explanation: 'Se detectaron credenciales, contraseñas, API keys o tokens hardcodeados directamente en el código fuente. Estos secretos quedan expuestos en el repositorio y pueden ser accedidos por cualquiera que tenga acceso al código.',
    impact: 'Alta: Si el código se sube a un repositorio público o es accesible por personal no autorizado, los secretos pueden ser robados y utilizados para acceder a servicios externos, bases de datos, o sistemas de terceros asociados a estas credenciales.',
    remediation: 'Mover todos los secretos a variables de entorno usando archivos .env (que deben estar en .gitignore), o usar servicios de gestión de secretos como AWS Secrets Manager, HashiCorp Vault, o Azure Key Vault. Nunca commitear secretos al repositorio.'
  },
  'JWT_EXPOSED': {
    name: 'Token JWT expuesto',
    explanation: 'Se encontró un token JWT (JSON Web Token) hardcodeado en el código. Los JWT contienen información de autenticación y autorización, y si están expuestos, pueden ser utilizados por atacantes para impersonar usuarios.',
    impact: 'Alta: Un atacante que obtenga el token puede acceder a recursos protegidos como si fuera el usuario legítimo, pudiendo robar datos, modificar información o realizar acciones no autorizadas.',
    remediation: 'Nunca hardcodear tokens JWT. Los tokens deben generarse dinámicamente durante el proceso de autenticación y almacenarse de forma segura (cookies httpOnly, o almacenamiento seguro del lado del cliente). Los tokens deben tener tiempo de expiración y ser revocados cuando sea necesario.'
  },
  'XSS_INNERHTML': {
    name: 'Riesgo de Cross-Site Scripting (XSS) por innerHTML',
    explanation: 'El uso de innerHTML para insertar contenido dinámico puede permitir que código JavaScript malicioso se ejecute en el navegador de los usuarios si el contenido no está sanitizado. Esto ocurre cuando se inserta HTML que contiene scripts ejecutables.',
    impact: 'Media-Alta: Puede permitir a atacantes robar cookies de sesión, tokens de autenticación, o realizar acciones en nombre del usuario. También puede usarse para redirigir a sitios maliciosos o mostrar contenido falso.',
    remediation: 'Reemplazar innerHTML por textContent cuando solo se necesite texto plano. Si se requiere HTML, usar una librería de sanitización como DOMPurify para limpiar el contenido antes de insertarlo. Validar y escapar toda entrada del usuario.'
  },
  'XSS_DOCUMENT_WRITE': {
    name: 'Riesgo de XSS por document.write()',
    explanation: 'El método document.write() puede inyectar código HTML/JavaScript directamente en el DOM, lo que es peligroso si el contenido proviene de fuentes no confiables. Es un método obsoleto y potencialmente inseguro.',
    impact: 'Media: Similar a innerHTML, puede permitir ejecución de código malicioso en el navegador del usuario, comprometiendo la sesión y permitiendo robo de información sensible.',
    remediation: 'Eliminar document.write() y usar métodos modernos de manipulación del DOM como createElement(), appendChild(), o innerHTML (con sanitización). Preferir frameworks modernos que manejen el DOM de forma segura.'
  },
  'PLAINTTEXT_HTTP': {
    name: 'Uso de conexiones HTTP inseguras',
    explanation: 'Se detectaron URLs que usan el protocolo HTTP en lugar de HTTPS. Las conexiones HTTP transmiten datos en texto plano, lo que permite que cualquier persona que intercepte el tráfico de red pueda leer la información transmitida.',
    impact: 'Media: Permite a atacantes realizar ataques de "man-in-the-middle" para interceptar y modificar comunicaciones, robar credenciales, tokens, o datos sensibles que se transmitan entre el cliente y el servidor.',
    remediation: 'Reemplazar todas las URLs HTTP por HTTPS. Asegurarse de que todos los endpoints de API, recursos externos, y comunicaciones usen HTTPS. Configurar redirecciones automáticas de HTTP a HTTPS en el servidor.'
  },
  'LOCALSTORAGE_SENSITIVE': {
    name: 'Almacenamiento inseguro en localStorage',
    explanation: 'Se detectó el uso de localStorage.setItem() para almacenar datos. localStorage es accesible por cualquier script en la misma página, lo que lo hace vulnerable a ataques XSS. Si se almacenan tokens o información sensible, pueden ser robados fácilmente.',
    impact: 'Media: Si se almacenan tokens de autenticación, contraseñas, o datos sensibles en localStorage, un ataque XSS puede robar esta información. localStorage persiste entre sesiones, aumentando el riesgo.',
    remediation: 'No almacenar información sensible (tokens, contraseñas, datos personales) en localStorage. Si es necesario almacenar tokens, usar cookies httpOnly (más seguras) o sessionStorage (se limpia al cerrar la pestaña). Si se debe usar localStorage, cifrar los datos antes de almacenarlos.'
  },
  'NO_AUTH_MIDDLEWARE': {
    name: 'Rutas de Express sin middleware de autenticación',
    explanation: 'Se detectaron rutas definidas con app.get(), app.post(), router.get() o router.post() que no muestran indicios de tener middleware de autenticación. Esto significa que estas rutas pueden ser accesibles públicamente sin verificación de identidad.',
    impact: 'Media-Alta: Rutas sin autenticación pueden exponer endpoints sensibles a usuarios no autorizados, permitiendo acceso a datos privados, modificación de información, o ejecución de acciones privilegiadas sin autorización.',
    remediation: 'Agregar middleware de autenticación a todas las rutas sensibles. Usar librerías como Passport.js, JWT, o implementar middleware personalizado que verifique tokens o sesiones antes de permitir el acceso. Aplicar el principio de "denegar por defecto" y solo permitir acceso a rutas públicas explícitamente marcadas.'
  }
};

/**
 * Agrupa findings por tipo de vulnerabilidad
 */
function groupFindingsByType(findings) {
  const grouped = {};
  
  findings.forEach(finding => {
    if (!grouped[finding.ruleId]) {
      grouped[finding.ruleId] = {
        ruleId: finding.ruleId,
        findings: [],
        count: 0,
        severities: { high: 0, medium: 0, low: 0 }
      };
    }
    
    grouped[finding.ruleId].findings.push(finding);
    grouped[finding.ruleId].count++;
    grouped[finding.ruleId].severities[finding.severity] = 
      (grouped[finding.ruleId].severities[finding.severity] || 0) + 1;
  });

  return grouped;
}

/**
 * Calcula métricas agregadas
 */
function calculateMetrics(findings) {
  const total = findings.length;
  const bySeverity = {
    high: findings.filter(f => f.severity === 'high').length,
    medium: findings.filter(f => f.severity === 'medium').length,
    low: findings.filter(f => f.severity === 'low').length
  };

  const byType = {};
  findings.forEach(f => {
    byType[f.ruleId] = (byType[f.ruleId] || 0) + 1;
  });

  return {
    total,
    bySeverity,
    byType,
    uniqueTypes: Object.keys(byType).length
  };
}

/**
 * Genera información enriquecida para cada tipo de vulnerabilidad
 */
function enrichVulnerabilityTypes(groupedFindings) {
  return Object.values(groupedFindings).map(group => {
    const info = vulnerabilityInfo[group.ruleId] || {
      name: group.ruleId,
      explanation: 'Vulnerabilidad detectada en el código.',
      impact: 'Variable según el contexto.',
      remediation: 'Revisar y corregir según mejores prácticas de seguridad.'
    };

    const mainSeverity = group.severities.high > 0 ? 'high' :
                        group.severities.medium > 0 ? 'medium' : 'low';

    return {
      ruleId: group.ruleId,
      name: info.name,
      count: group.count,
      severity: mainSeverity,
      explanation: info.explanation,
      impact: info.impact,
      remediation: info.remediation
    };
  });
}

/**
 * Ordena tipos de vulnerabilidad por prioridad
 */
function prioritizeVulnerabilities(enrichedTypes) {
  return enrichedTypes.sort((a, b) => {
    // Primero por severidad (high > medium > low)
    const severityOrder = { high: 3, medium: 2, low: 1 };
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    
    if (severityDiff !== 0) return severityDiff;
    
    // Si misma severidad, por cantidad (más ocurrencias = mayor prioridad)
    return b.count - a.count;
  });
}

/**
 * Genera resumen global del análisis
 */
function generateGlobalSummary(metrics, prioritizedTypes) {
  const { total, bySeverity } = metrics;
  
  // Determinar nivel de riesgo general
  let riskLevel = 'bajo';
  let riskExplanation = '';
  
  if (bySeverity.high > 0) {
    riskLevel = bySeverity.high >= 5 ? 'crítico' : 'alto';
    riskExplanation = `Se encontraron ${bySeverity.high} vulnerabilidades de severidad alta. `;
  } else if (bySeverity.medium > 0) {
    riskLevel = bySeverity.medium >= 10 ? 'medio-alto' : 'medio';
    riskExplanation = `Se encontraron ${bySeverity.medium} vulnerabilidades de severidad media. `;
  } else if (bySeverity.low > 0) {
    riskLevel = 'bajo';
    riskExplanation = `Se encontraron ${bySeverity.low} vulnerabilidades de severidad baja. `;
  }

  if (total === 0) {
    return {
      riskLevel: 'bajo',
      summary: 'No se detectaron vulnerabilidades de seguridad en el código analizado. El código parece estar siguiendo buenas prácticas de seguridad.',
      criticalCategories: [],
      priority: 'No hay vulnerabilidades críticas que priorizar.'
    };
  }

  // Identificar categorías más críticas
  const criticalCategories = prioritizedTypes
    .filter(v => v.severity === 'high')
    .slice(0, 3)
    .map(v => v.name);

  let summary = `El análisis detectó ${total} vulnerabilidad${total > 1 ? 'es' : ''} de seguridad en el código. `;
  summary += riskExplanation;
  
  if (bySeverity.high > 0) {
    summary += `Las vulnerabilidades de alta severidad representan un riesgo significativo y deben corregirse antes de desplegar a producción. `;
  }
  
  if (bySeverity.medium > 0) {
    summary += `Las vulnerabilidades de severidad media también requieren atención, especialmente si se combinan con otras. `;
  }

  summary += `Se identificaron ${metrics.uniqueTypes} tipo${metrics.uniqueTypes > 1 ? 's' : ''} diferente${metrics.uniqueTypes > 1 ? 's' : ''} de vulnerabilidades. `;

  if (criticalCategories.length > 0) {
    summary += `Las categorías más críticas son: ${criticalCategories.join(', ')}. `;
  }

  let priority = 'Se recomienda priorizar la corrección de vulnerabilidades de alta severidad, especialmente aquellas relacionadas con inyección de código (SQL Injection, eval), exposición de secretos, y autenticación. ';

  if (bySeverity.high === 0 && bySeverity.medium > 0) {
    priority = 'Aunque no hay vulnerabilidades de severidad alta, se recomienda corregir las vulnerabilidades de severidad media para mejorar la postura de seguridad general.';
  }

  return {
    riskLevel,
    summary,
    criticalCategories,
    priority
  };
}

/**
 * Función principal que analiza findings y genera reporte inteligente
 */
function analyzeFindings(findings) {
  // Agrupar findings por tipo
  const grouped = groupFindingsByType(findings);
  
  // Calcular métricas
  const metrics = calculateMetrics(findings);
  
  // Enriquecer con información detallada
  const enrichedTypes = enrichVulnerabilityTypes(grouped);
  
  // Priorizar vulnerabilidades
  const prioritizedTypes = prioritizeVulnerabilities(enrichedTypes);
  
  // Generar resumen global
  const globalSummary = generateGlobalSummary(metrics, prioritizedTypes);
  
  return {
    metrics,
    vulnerabilityTypes: prioritizedTypes,
    globalSummary
  };
}

module.exports = { analyzeFindings };
