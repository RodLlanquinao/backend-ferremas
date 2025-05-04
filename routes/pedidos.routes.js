const express = require('express');
const router = express.Router();

// Ruta para obtener pedidos
router.get('/', (req, res) => {
  res.send('Lista de pedidos FERREMAS');
});

module.exports = router;
