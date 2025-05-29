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

  // Validación de campos de bodega
  if (data.stock_bodega !== undefined && (isNaN(data.stock_bodega) || data.stock_bodega < 0)) {
    errors.push('El stock de bodega debe ser un número válido mayor o igual a cero');
  }

  if (data.stock_minimo !== undefined && (isNaN(data.stock_minimo) || data.stock_minimo < 0)) {
    errors.push('El stock mínimo debe ser un número válido mayor o igual a cero');
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
      
      const { 
        nombre, modelo, marca, codigo, precio, stock, categoria, descripcion,
        bodega_id, stock_bodega, ubicacion_bodega, stock_minimo
      } = productoData;
      
      console.log(`Creando producto: ${nombre}, precio: ${precio}, categoría: ${categoria}, stock bodega: ${stock_bodega || 0}`);
      
      const query = `
        INSERT INTO productos (
          nombre, modelo, marca, codigo, precio, stock, categoria, descripcion,
          bodega_id, stock_bodega, ubicacion_bodega, stock_minimo
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
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
        bodega_id || null,
        stock_bodega || 0,
        ubicacion_bodega || null,
        stock_minimo || 5
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
      
      const { 
        nombre, modelo, marca, codigo, precio, stock, categoria, descripcion,
        bodega_id, stock_bodega, ubicacion_bodega, stock_minimo
      } = productoData;
      
      // Actualizar incluyendo los campos de bodega
      const query = `
        UPDATE productos 
        SET nombre = $1, modelo = $2, marca = $3, codigo = $4, precio = $5, 
            stock = $6, categoria = $7, descripcion = $8, bodega_id = $9,
            stock_bodega = $10, ubicacion_bodega = $11, stock_minimo = $12,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $13 
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
        bodega_id || null,
        stock_bodega || 0,
        ubicacion_bodega || null,
        stock_minimo || 5,
        id
      ];
      
      // Log detallado de la consulta para debugging
      console.log("[DEBUG-SQL] Intentando ejecutar consulta UPDATE:", {
        query: query,
        values: values.map((v, i) => i === 12 ? id : (i === 4 ? precio : v)), // Mostrar valores importantes
        id: id,
        precio_tipo: typeof precio,
        precio_valor: precio,
        stock_bodega: stock_bodega
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

  /**
   * Obtener productos disponibles en bodega
   * @returns {Promise<Array>} - Array de productos con stock en bodega
   */
  static async getAvailableInWarehouse() {
    try {
      const query = "SELECT * FROM productos WHERE stock_bodega > 0 ORDER BY nombre ASC";
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener productos disponibles en bodega:", error.message);
      throw error; // Re-lanzar para manejar en el controlador
    }
  }

  /**
   * Obtener stock de bodega para un producto
   * @param {number} id - ID del producto
   * @returns {Promise<number>} - Stock en bodega del producto
   */
  static async getWarehouseStock(id) {
    try {
      const query = "SELECT stock_bodega FROM productos WHERE id = $1";
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }
      
      return result.rows[0].stock_bodega || 0;
    } catch (error) {
      console.error(`Error al obtener stock de bodega para producto ID ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Actualizar stock de bodega para un producto
   * @param {number} id - ID del producto
   * @param {number} newStock - Nuevo valor de stock
   * @returns {Promise<Object|null>} - Producto actualizado o null
   */
  static async updateWarehouseStock(id, newStock) {
    try {
      if (newStock === undefined || isNaN(newStock) || newStock < 0) {
        throw new Error('El stock de bodega debe ser un número válido mayor o igual a cero');
      }

      console.log(`Actualizando stock de bodega para producto ID ${id}: ${newStock}`);
      
      const query = `
        UPDATE productos 
        SET stock_bodega = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 
        RETURNING *
      `;
      
      const result = await pool.query(query, [newStock, id]);
      
      const updatedProduct = result.rows[0];
      if (updatedProduct) {
        console.log(`Stock de bodega actualizado para producto ID ${id}: ${newStock}`);
      } else {
        console.log(`No se encontró producto con ID ${id} para actualizar stock de bodega`);
      }
      
      return updatedProduct || null;
    } catch (error) {
      console.error(`Error al actualizar stock de bodega para producto ID ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Verificar si un producto está por debajo del stock mínimo en bodega
   * @param {number} id - ID del producto
   * @returns {Promise<boolean>} - True si está por debajo del mínimo
   */
  static async checkMinimumStock(id) {
    try {
      const query = "SELECT stock_bodega, stock_minimo FROM productos WHERE id = $1";
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }
      
      const producto = result.rows[0];
      const stockBodega = producto.stock_bodega || 0;
      const stockMinimo = producto.stock_minimo || 5;
      
      const bajoCantidadMinima = stockBodega < stockMinimo;
      
      if (bajoCantidadMinima) {
        console.log(`ALERTA: Producto ID ${id} por debajo del stock mínimo. Stock actual: ${stockBodega}, Mínimo: ${stockMinimo}`);
      }
      
      return bajoCantidadMinima;
    } catch (error) {
      console.error(`Error al verificar stock mínimo para producto ID ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Obtener todos los productos que están por debajo del stock mínimo en bodega
   * @returns {Promise<Array>} - Array de productos por debajo del stock mínimo
   */
  static async getProductsBelowMinimumStock() {
    try {
      const query = "SELECT * FROM productos WHERE stock_bodega < stock_minimo ORDER BY nombre ASC";
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener productos por debajo del stock mínimo:", error.message);
      throw error;
    }
  }
}

module.exports = Producto
