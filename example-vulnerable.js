// Archivo de ejemplo con vulnerabilidades para probar el CLI

// Contraseña hardcodeada
const password = "admin123";

// API Key expuesta
const api_key = "sk_live_1234567890";

// Token JWT
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjg";

// Uso de eval()
eval("console.log('test')");

// SQL Injection
const query = "SELECT * FROM users WHERE id = " + userId;

// XSS con innerHTML
document.getElementById("div").innerHTML = userInput;

// HTTP inseguro
fetch("http://api.example.com/data");

// localStorage
localStorage.setItem("token", token);

// Rutas Express sin auth
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

