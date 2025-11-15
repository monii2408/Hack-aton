// Archivo de ejemplo con vulnerabilidades intencionales para probar CodeScanner

// VULNERABILIDAD 1: Hardcoded secret
const API_KEY = "sk_live_1234567890abcdef";
const password = "admin123";

// VULNERABILIDAD 2: SQL Injection
function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  return db.query(query);
}

// VULNERABILIDAD 3: eval() usage
function processUserInput(userInput) {
  return eval(userInput); // MUY PELIGROSO
}

// VULNERABILIDAD 4: XSS con innerHTML
function displayComment(comment) {
  document.getElementById('comments').innerHTML = comment;
}

// VULNERABILIDAD 5: HTTP inseguro
fetch("http://api.example.com/data");

// VULNERABILIDAD 6: localStorage con datos sensibles
localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');

// VULNERABILIDAD 7: document.write()
document.write("<h1>" + userInput + "</h1>");

