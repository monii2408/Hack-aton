/**
 * Archivo principal de la aplicación
 * Contiene lógica de negocio con algunas vulnerabilidades
 */

// Secretos hardcodeados
const API_KEY = "sk_live_abc123xyz789";
const dbPassword = "super_secret_password_2024";

// SQL Injection vulnerable
function getUserById(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return database.query(query);
}

// Uso de eval()
function processData(userInput) {
  return eval(userInput);
}

// HTTP inseguro
const apiEndpoint = "http://api.example.com/data";

module.exports = {
  getUserById,
  processData
};

