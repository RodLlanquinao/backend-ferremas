const express = require('express');
const router = express.Router();

// Ruta para obtener usuarios
router.get('/', (req, res) => {
  res.send('Lista de usuarios FERREMAS');
});

module.exports = router;
