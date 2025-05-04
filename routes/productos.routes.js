const express = require('express');
const router = express.Router();
const db = require('../db');

// Ruta para obtener productos
router.get('/', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM productos');
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
});

module.exports = router;
