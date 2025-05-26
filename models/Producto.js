/**
 * Modelo de Producto
 * Define la estructura y operaciones de base de datos para productos
 */

const { pool } = require("../config/database")

// Función de validación básica para datos de producto
const validateProducto = (data) => {
  const errors = [];
  
  if (!data.nombre || data.nombre.trim() === '') {
    errors.push('El nombre es obligatorio');
  }
  
  if (data.precio === undefined || isNaN(data.precio) || data.precio < 0) {
    errors.push('El precio debe ser un número válido mayor o igual a cero');
  }
  
  if (!data.categoria || data.categoria.trim() === '') {
    errors.push('La categoría es obligatoria');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

class Producto {
  /**
   * Obtener todos los productos ordenados por nombre
   * @returns {Promise<Array>} - Array de productos
   */
  static async getAll() {
    const query = "SELECT * FROM productos ORDER BY nombre ASC"
    const result = await pool.query(query)
    return result.rows
  }

  /**
   * Obtener producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise<Object|null>} - Producto encontrado o null
   */
  static async getById(id) {
    const query = "SELECT * FROM productos WHERE id = $1"
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }

  /**
   * Obtener productos por categoría
   * @param {string} categoria - Nombre de la categoría
   * @returns {Promise<Array>} - Array de productos de la categoría
   */
  static async getByCategoria(categoria) {
    const query = "SELECT * FROM productos WHERE categoria = $1 ORDER BY nombre ASC"
    const result = await pool.query(query, [categoria])
    return result.rows
  }

  /**
   * Crear nuevo producto
   * @param {Object} productoData - Datos del producto
   * @returns {Promise<Object>} - Producto creado
   */
  static async create(productoData) {
    try {
      // Validar datos
      const validation = validateProducto(productoData);
      if (!validation.isValid) {
        throw new Error(`Datos de producto inválidos: ${validation.errors.join(', ')}`);
      }
      
      const { nombre, modelo, marca, codigo, precio, stock, categoria, descripcion } = productoData;
      
      console.log(`Creando producto: ${nombre}, precio: ${precio}, categoría: ${categoria}`);
      
      const query = `
        INSERT INTO productos (nombre, modelo, marca, codigo, precio, stock, categoria, descripcion) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
      `;
      
      const values = [
        nombre, 
        modelo || null, 
        marca || null, 
        codigo || null, 
        precio, 
        stock || 0, 
        categoria, 
        descripcion || null
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error en Producto.create:', error.message);
      throw error; // Re-lanzar para manejar en el controlador
    }
  }

  /**
   * Actualizar producto por ID
   * @param {number} id - ID del producto
   * @param {Object} productoData - Datos actualizados del producto
   * @returns {Promise<Object|null>} - Producto actualizado o null
   */
  static async update(id, productoData) {
    try {
      // Validar datos
      const validation = validateProducto(productoData);
      if (!validation.isValid) {
        throw new Error(`Datos de producto inválidos: ${validation.errors.join(', ')}`);
      }
      
      console.log(`Actualizando producto ID ${id} con datos:`, JSON.stringify({
        nombre: productoData.nombre,
        precio: productoData.precio,
        categoria: productoData.categoria
      }));
      
      const { nombre, modelo, marca, codigo, precio, stock, categoria, descripcion } = productoData;
      
      // Remover la referencia a updated_at que no existe en la tabla
      const query = `
        UPDATE productos 
        SET nombre = $1, modelo = $2, marca = $3, codigo = $4, precio = $5, 
            stock = $6, categoria = $7, descripcion = $8
        WHERE id = $9 
        RETURNING *
      `;
      
      const values = [
        nombre, 
        modelo || null, 
        marca || null, 
        codigo || null, 
        precio, 
        stock || 0, 
        categoria, 
        descripcion || null, 
        id
      ];
      
      // Log detallado de la consulta para debugging
      console.log("[DEBUG-SQL] Intentando ejecutar consulta UPDATE:", {
        query: query,
        values: values.map((v, i) => i === 8 ? id : (i === 4 ? precio : v)), // Mostrar valores importantes
        id: id,
        precio_tipo: typeof precio,
        precio_valor: precio
      });
      
      try {
        const result = await pool.query(query, values);
      
      const updatedProduct = result.rows[0];
      if (updatedProduct) {
        console.log(`Producto ID ${id} actualizado exitosamente`);
      } else {
        console.log(`No se encontró producto con ID ${id} para actualizar`);
      }
      
      return updatedProduct || null;
      } catch (dbError) {
        console.error(`[ERROR-SQL] Error ejecutando UPDATE para ID ${id}:`, {
          message: dbError.message,
          code: dbError.code,
          detail: dbError.detail,
          table: dbError.table,
          constraint: dbError.constraint,
          query: query.replace(/\s+/g, ' ').trim(),
          parametros: JSON.stringify(values)
        });
        throw dbError;
      }
    } catch (error) {
      console.error(`[ERROR-GENERAL] Error en Producto.update para ID ${id}:`, {
        message: error.message,
        name: error.name,
        code: error.code,
        stack: error.stack && error.stack.split('\n').slice(0, 3).join('\n')
      });
      
      // Agregar información adicional al error para mejor diagnóstico
      error.updateInfo = {
        productId: id,
        attemptedUpdate: true,
        timestamp: new Date().toISOString()
      };
      
      throw error; // Re-lanzar para manejar en el controlador
    }
  }

  /**
   * Eliminar producto por ID
   * @param {number} id - ID del producto
   * @returns {Promise<Object|null>} - Producto eliminado o null
   */
  static async delete(id) {
    try {
      console.log(`Eliminando producto con ID: ${id}`);
      
      const query = "DELETE FROM productos WHERE id = $1 RETURNING *";
      const result = await pool.query(query, [id]);
      
      const deletedProduct = result.rows[0];
      if (deletedProduct) {
        console.log(`Producto ID ${id} eliminado exitosamente`);
      } else {
        console.log(`No se encontró producto con ID ${id} para eliminar`);
      }
      
      return deletedProduct || null;
    } catch (error) {
      console.error(`Error en Producto.delete para ID ${id}:`, error.message);
      throw error; // Re-lanzar para manejar en el controlador
    }
  }
}

module.exports = Producto
