const express = require('express');
const router = express.Router();
const db = require('../db');

// POST - Enviar mensaje de contacto
router.post('/', async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  // 🔥 Generar la fecha automáticamente
  const fecha = new Date().toISOString();

  try {
    const result = await db.query(
      'INSERT INTO contactos (nombre, email, asunto, mensaje, fecha) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, email, asunto, mensaje, fecha]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al enviar mensaje de contacto:', error);
    res.status(500).json({ error: 'Error al enviar mensaje de contacto' });
  }
});

module.exports = router;