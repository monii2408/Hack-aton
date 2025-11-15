let selectedFile = null;

// Manejo de input de archivo
document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) {
    selectedFile = null;
    return;
  }

  selectedFile = file;

  const reader = new FileReader();
  reader.onload = (event) => {
    document.getElementById('codeInput').value = event.target.result;
  };
  reader.readAsText(file);
});

// Función para determinar el tipo de archivo (code o log)
function getFileKind(filename) {
  if (!filename) return 'code';
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'log' || filename.toLowerCase().includes('log')) {
    return 'log';
  }
  return 'code';
}

// Función principal de análisis
document.getElementById('btnScan').addEventListener('click', async () => {
  const codeInput = document.getElementById('codeInput');
  const code = codeInput.value.trim();
  
  if (!code) {
    showError('Por favor, pega código o sube un archivo para analizar.');
    return;
  }

  // Mostrar loading
  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');
  hideError();

  try {
    // Preparar archivos para enviar
    const files = [];
    
    if (selectedFile) {
      // Si hay un archivo seleccionado, usar su nombre y tipo
      files.push({
        filename: selectedFile.name,
        content: code,
        kind: getFileKind(selectedFile.name)
      });
    } else {
      // Si solo hay texto pegado, usar nombre por defecto
      files.push({
        filename: 'pasted.js',
        content: code,
        kind: 'code'
      });
    }

    const res = await fetch('http://localhost:3000/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files })
    });

    // Manejar errores del servidor
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || errorData.error || 'Error del servidor');
    }

    const data = await res.json();
    
    // Ocultar loading y mostrar resultados
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');

    // Renderizar según el nuevo formato: { findings, summary, groups }
    renderMetrics(data.summary);
    renderFindingsTable(data.findings);
    renderSummaryAndGroups(data.summary, data.groups);

  } catch (error) {
    document.getElementById('loading').classList.add('hidden');
    showError('Error al analizar el código: ' + error.message);
    console.error(error);
  }
});

// Función para mostrar errores
function showError(message) {
  let errorDiv = document.getElementById('errorMessage');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'errorMessage';
    errorDiv.style.cssText = 'background: #FFEBEE; color: #C62828; padding: 16px; border-radius: 12px; margin-bottom: 24px; border-left: 4px solid #E53935; box-shadow: 0 2px 8px rgba(229, 57, 53, 0.15);';
    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, container.firstChild.nextSibling);
  }
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

// Función para ocultar errores
function hideError() {
  const errorDiv = document.getElementById('errorMessage');
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}

// Renderizar métricas
function renderMetrics(summary) {
  const metricsContainer = document.getElementById('metrics');
  metricsContainer.innerHTML = `
    <div class="metric-card">
      <div class="metric-value">${summary.total}</div>
      <div class="metric-label">Total de vulnerabilidades</div>
    </div>
    <div class="metric-card high">
      <div class="metric-value">${summary.bySeverity.high}</div>
      <div class="metric-label">Alta severidad</div>
    </div>
    <div class="metric-card medium">
      <div class="metric-value">${summary.bySeverity.medium}</div>
      <div class="metric-label">Media severidad</div>
    </div>
    <div class="metric-card low">
      <div class="metric-value">${summary.bySeverity.low}</div>
      <div class="metric-label">Baja severidad</div>
    </div>
  `;
}

// Renderizar tabla de findings
function renderFindingsTable(findings) {
  const tbody = document.getElementById('findingsBody');
  
  if (findings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #00695C;">No se detectaron vulnerabilidades</td></tr>';
    return;
  }

  tbody.innerHTML = findings.map(finding => {
    const severityClass = `severity-${finding.severity}`;
    return `
      <tr>
        <td><strong>${finding.line}</strong></td>
        <td>${finding.filename}</td>
        <td><span class="severity-badge ${severityClass}">${finding.severity.toUpperCase()}</span></td>
        <td><code>${finding.ruleId}</code></td>
        <td>${finding.description}</td>
        <td>${finding.recommendation}</td>
      </tr>
    `;
  }).join('');
}

// Renderizar resumen y grupos de vulnerabilidades
function renderSummaryAndGroups(summary, groups) {
  const summaryContainer = document.getElementById('aiSummary');
  const typesContainer = document.getElementById('vulnerabilityTypes');
  
  // Resumen global
  const riskClass = `risk-${summary.riskLevel === 'crítico' ? 'critical' : 
                              summary.riskLevel === 'alto' ? 'high' :
                              summary.riskLevel.includes('medio') ? 'medium' : 'low'}`;
  
  summaryContainer.innerHTML = `
    <div class="ai-summary">
      <div>
        <span class="risk-level ${riskClass}">Nivel de riesgo: ${summary.riskLevel.toUpperCase()}</span>
      </div>
      <p style="margin-top: 15px; line-height: 1.8; color: #555;">
        ${summary.message}
      </p>
    </div>
  `;

  // Grupos de vulnerabilidades
  if (groups.length === 0) {
    typesContainer.innerHTML = '<p style="text-align: center; color: #00695C; padding: 20px;">No hay vulnerabilidades que mostrar</p>';
    return;
  }

  typesContainer.innerHTML = groups.map(vuln => {
    const severityClass = `severity-${vuln.severity}`;
    
    return `
      <div class="vulnerability-type">
        <h4>${vuln.name}</h4>
        <div class="vulnerability-meta">
          <span class="severity-badge ${severityClass}">${vuln.severity.toUpperCase()}</span>
          <span><strong>${vuln.count}</strong> ocurrencia${vuln.count > 1 ? 's' : ''}</span>
        </div>
        <div class="vulnerability-content">
          <p><strong>¿Qué es?</strong> ${vuln.explanation}</p>
          <p><strong>Impacto:</strong> ${vuln.impact}</p>
          <p><strong>Recomendación:</strong> ${vuln.remediation}</p>
        </div>
      </div>
    `;
  }).join('');
}
