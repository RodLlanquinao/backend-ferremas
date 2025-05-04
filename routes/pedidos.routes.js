const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Obtener pedido por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await db.query('SELECT * FROM pedidos WHERE id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      res.status(500).json({ error: 'Error al obtener pedido' });
    }
});

// POST - Crear nuevo pedido
router.post('/', async (req, res) => {
    const { producto_id, usuario_id, cantidad, fecha } = req.body;
  
    try {
      const result = await db.query(
        'INSERT INTO pedidos (producto_id, usuario_id, cantidad, fecha) VALUES ($1, $2, $3, $4) RETURNING *',
        [producto_id, usuario_id, cantidad, fecha]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error al crear pedido:', error);
      res.status(500).json({ error: 'Error al crear pedido' });
    }
}); 

// PUT - Actualizar pedido por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { producto_id, usuario_id, cantidad, fecha } = req.body;
  
    try {
      const result = await db.query(
        'UPDATE pedidos SET producto_id = $1, usuario_id = $2, cantidad = $3, fecha = $4 WHERE id = $5 RETURNING *',
        [producto_id, usuario_id, cantidad, fecha, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      res.status(500).json({ error: 'Error al actualizar pedido' });
    }
}); 

// DELETE - Eliminar pedido por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await db.query(
        'DELETE FROM pedidos WHERE id = $1 RETURNING *',
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
  
      res.json({ mensaje: 'Pedido eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      res.status(500).json({ error: 'Error al eliminar pedido' });
    }
});

module.exports = router;
