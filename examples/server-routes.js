// Ejemplo de servidor Express con rutas sin autenticación

const express = require('express');
const app = express();

// VULNERABILIDAD: Ruta sin middleware de autenticación
app.get('/api/users', (req, res) => {
  res.json({ users: getAllUsers() });
});

// VULNERABILIDAD: Otra ruta sin autenticación
app.post('/api/delete-user', (req, res) => {
  const userId = req.body.id;
  deleteUser(userId);
  res.json({ success: true });
});

// Esta ruta SÍ tiene autenticación (no debería detectarse)
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ profile: getUserProfile(req.user.id) });
});

function getAllUsers() {
  return [];
}

function deleteUser(id) {
  // Eliminar usuario
}

function authenticateToken(req, res, next) {
  // Middleware de autenticación
  next();
}

function getUserProfile(userId) {
  return {};
}

