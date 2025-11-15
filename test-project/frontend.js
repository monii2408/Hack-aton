/**
 * Código del frontend con vulnerabilidades XSS
 */

// XSS con innerHTML
function displayUserComment(comment) {
  document.getElementById('comments').innerHTML = comment;
}

// XSS con document.write()
function showMessage(message) {
  document.write("<div class='message'>" + message + "</div>");
}

// localStorage con datos sensibles
function saveToken(token) {
  localStorage.setItem("authToken", token);
}

function saveApiKey(key) {
  localStorage.setItem("apiKey", key);
}

// HTTP inseguro
fetch("http://api.example.com/users")
  .then(res => res.json())
  .then(data => console.log(data));

