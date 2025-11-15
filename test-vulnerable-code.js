/**
 * Archivo de Prueba para CodeScanner
 * Este archivo contiene múltiples vulnerabilidades intencionales
 * para demostrar las capacidades del scanner.
 * 
 * ⚠️ ADVERTENCIA: Este código es solo para pruebas. NO usar en producción.
 */

// ============================================
// 1. SQL INJECTION - Alta Severidad
// ============================================
function getUserData(userId) {
  // ❌ VULNERABLE: SQL construido concatenando strings
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.query(query);
}

function deleteUser(userId) {
  // ❌ VULNERABLE: SQL injection en DELETE
  const sql = "DELETE FROM users WHERE id = " + userId;
  return db.execute(sql);
}

// ============================================
// 2. EVAL() USAGE - Alta Severidad
// ============================================
function processUserInput(userInput) {
  // ❌ VULNERABLE: Uso peligroso de eval()
  return eval(userInput);
}

function calculateExpression(expr) {
  // ❌ VULNERABLE: eval() permite ejecución de código arbitrario
  const result = eval("(" + expr + ")");
  return result;
}

// ============================================
// 3. SECRETOS HARDCODEADOS - Alta Severidad
// ============================================
const API_KEY = "sk_live_1234567890abcdef";
const password = "admin123";
const SECRET = "my-super-secret-key-2024";
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

// Configuración de base de datos con credenciales expuestas
const dbConfig = {
  host: "localhost",
  user: "admin",
  password: "root123",
  database: "mydb"
};

// ============================================
// 4. TOKENS JWT EXPUESTOS - Alta Severidad
// ============================================
const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// ============================================
// 5. XSS - Cross-Site Scripting - Media Severidad
// ============================================
function displayUserContent(userContent) {
  // ❌ VULNERABLE: innerHTML permite inyección de código
  document.getElementById("content").innerHTML = userContent;
}

function writeToPage(data) {
  // ❌ VULNERABLE: document.write() es inseguro
  document.write("<div>" + data + "</div>");
}

function updateElement(elementId, content) {
  // ❌ VULNERABLE: innerHTML sin sanitizar
  const element = document.getElementById(elementId);
  element.innerHTML = content;
}

// ============================================
// 6. HTTP INSECURO - Media Severidad
// ============================================
function fetchUserData() {
  // ❌ VULNERABLE: Usa HTTP en lugar de HTTPS
  fetch("http://api.example.com/users")
    .then(response => response.json())
    .then(data => console.log(data));
}

const apiUrl = "http://api.example.com/data";
const imageUrl = "http://cdn.example.com/image.jpg";

// ============================================
// 7. LOCALSTORAGE SENSIBLE - Media Severidad
// ============================================
function saveUserToken(token) {
  // ❌ VULNERABLE: Guardar token en localStorage sin cifrado
  localStorage.setItem("authToken", token);
}

function savePassword(password) {
  // ❌ VULNERABLE: Nunca guardar contraseñas en localStorage
  localStorage.setItem("userPassword", password);
}

function saveApiKey(key) {
  // ❌ VULNERABLE: API keys no deben estar en localStorage
  localStorage.setItem("apiKey", key);
}

// ============================================
// 8. RUTAS EXPRESS SIN AUTENTICACIÓN - Media Severidad
// ============================================
const express = require('express');
const app = express();

// ❌ VULNERABLE: Ruta sin middleware de autenticación
app.get('/api/users', (req, res) => {
  res.json({ users: getAllUsers() });
});

// ❌ VULNERABLE: Ruta POST sin protección
app.post('/api/delete-user', (req, res) => {
  const userId = req.body.id;
  deleteUser(userId);
  res.json({ success: true });
});

// ❌ VULNERABLE: Ruta GET sin autenticación
app.get('/api/admin/settings', (req, res) => {
  res.json({ settings: getAdminSettings() });
});

// ✅ CORRECTO: Ruta con middleware de autenticación
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ data: "Protected data" });
});

// ============================================
// Código Auxiliar (no vulnerable, solo para contexto)
// ============================================
function getAllUsers() {
  return [];
}

function getAdminSettings() {
  return {};
}

function authenticate(req, res, next) {
  // Middleware de autenticación
  next();
}

// Exportar para pruebas
module.exports = {
  getUserData,
  deleteUser,
  processUserInput,
  displayUserContent,
  fetchUserData,
  saveUserToken
};

