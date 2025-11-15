/**
 * Archivo de configuración con secretos expuestos
 */

// Tokens y secretos hardcodeados
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const SECRET_KEY = "my-secret-key-12345";
const API_SECRET = "sk_live_secret_key_abcdef";

// Configuración de base de datos con credenciales
const database = {
  host: "localhost",
  user: "admin",
  password: "root123",
  port: 3306
};

// URL insegura
const uploadUrl = "http://storage.example.com/upload";

module.exports = {
  JWT_TOKEN,
  SECRET_KEY,
  database,
  uploadUrl
};

