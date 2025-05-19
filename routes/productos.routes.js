const express = require('express');
const router = express.Router();
const db = require('../db');


//   GET - Obtener todos los productos ordenados
router.get('/', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM productos ORDER BY nombre ASC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
});


//  GET - Obtener productos por categoría
router.get('/categoria/:nombre', async (req, res) => {
    const { nombre } = req.params;
  
    try {
      const result = await db.query(
        'SELECT * FROM productos WHERE categoria = $1',
        [nombre]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron productos en esta categoría' });
      }
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      res.status(500).json({ error: 'Error al obtener productos por categoría' });
    }
});


//  GET - Obtener producto por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await db.query(
        'SELECT * FROM productos WHERE id = $1',
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Ruta post obtener productos
router.post('/', async (req, res) => {
    const { nombre, modelo, marca, codigo, precio, stock, categoria, descripcion} = req.body;
  
    try {
      const result = await db.query(
        'INSERT INTO productos (nombre, modelo, marca, codigo, precio, stock, categoria, descripcion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [nombre, modelo, marca, codigo, precio, stock, categoria, descripcion]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error al crear producto:', error);
      res.status(500).json({ error: 'Error al crear producto' });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {nombre, modelo, marca, codigo, precio, stock, categoria, descripcion} = req.body;
  
    try {
      const result = await db.query(
        'UPDATE productos SET nombre = $1, modelo = $2, marca = $3, codigo = $4, precio = $5, stock = $6, categoria = $7, descripcion = $8 WHERE id = $9 RETURNING *',
        [nombre, modelo, marca, codigo, precio, stock, categoria, descripcion]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
});


//  DELETE - Eliminar producto por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await db.query(
        'DELETE FROM productos WHERE id = $1 RETURNING *',
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      res.json({ mensaje: `Producto "${result.rows[0].nombre}" eliminado correctamente` });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
});


module.exports = router;
