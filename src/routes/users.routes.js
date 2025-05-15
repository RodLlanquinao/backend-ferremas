const express = require('express');
const router = express.Router();
const db = require('../config/db');


// Ruta para obtener usuarios
// GET todos los usuarios
// GET - Obtener usuario por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await db.query(
        'SELECT * FROM usuarios WHERE id = $1',
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// POST - Crear nuevo usuario
router.post('/', async (req, res) => {
    const { nombre, email, rol } = req.body;
  
    try {
      const result = await db.query(
        'INSERT INTO usuarios (nombre, email, rol) VALUES ($1, $2, $3) RETURNING *',
        [nombre, email, rol]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// PUT - Actualizar usuario por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;
  
    try {
      const result = await db.query(
        'UPDATE usuarios SET nombre = $1, email = $2, rol = $3 WHERE id = $4 RETURNING *',
        [nombre, email, rol, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// DELETE - Eliminar usuario por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await db.query(
        'DELETE FROM usuarios WHERE id = $1 RETURNING *',
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;
