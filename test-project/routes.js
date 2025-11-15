/**
 * Rutas de Express sin autenticación
 */

const express = require('express');
const router = express.Router();

// Ruta vulnerable sin autenticación
router.get('/users', (req, res) => {
  res.json({ users: getAllUsers() });
});

// Ruta POST vulnerable
router.post('/delete', (req, res) => {
  const id = req.body.id;
  deleteUser(id);
  res.json({ success: true });
});

// Ruta admin sin protección
router.get('/admin/config', (req, res) => {
  res.json({ config: getConfig() });
});

// Esta ruta SÍ tiene autenticación (no debería detectarse)
router.get('/protected', requireAuth, (req, res) => {
  res.json({ data: "Protected" });
});

function getAllUsers() {
  return [];
}

function deleteUser(id) {
  // Eliminar usuario
}

function getConfig() {
  return {};
}

function requireAuth(req, res, next) {
  next();
}

module.exports = router;

