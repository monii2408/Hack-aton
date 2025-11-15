const BASE_URL = 'http://localhost:3000';

document.getElementById('btnScan').addEventListener('click', async () => {
  const code = document.getElementById('codeInput').value.trim();

  if (!code) {
    document.getElementById('output').textContent = 'No hay código para analizar';
    return;
  }

  const res = await fetch(BASE_URL + '/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      files: [
        {
          filename: 'pasted.js',
          content: code
        }
      ]
    })
  });

  const findings = await res.json();
  document.getElementById('output').textContent =
    JSON.stringify(findings, null, 2);
});

