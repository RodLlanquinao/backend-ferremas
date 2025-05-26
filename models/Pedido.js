/**
 * Modelo de Pedido
 * Define la estructura y operaciones de base de datos para pedidos
 */

const { pool } = require("../config/database")

class Pedido {
  /**
   * Obtener pedido por ID con información de producto y usuario
   * @param {number} id - ID del pedido
   * @returns {Promise<Object|null>} - Pedido encontrado o null
   */
  static async getById(id) {
    try {
      const query = `
        SELECT p.*, pr.nombre as producto_nombre, u.nombre as usuario_nombre
        FROM pedidos p
        LEFT JOIN productos pr ON p.producto_id = pr.id
        LEFT JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.id = $1
      `
      console.log(`[Pedido.getById] Executing query for id: ${id}`)
      const result = await pool.query(query, [id])
      console.log(`[Pedido.getById] Query result:`, result.rows.length > 0 ? 'Pedido found' : 'Pedido not found')
      return result.rows[0] || null
    } catch (error) {
      console.error(`[Pedido.getById] ERROR: ${error.message}`)
      console.error(`[Pedido.getById] Error code: ${error.code || 'No error code'}`)
      console.error(`[Pedido.getById] Stack trace: ${error.stack}`)
      throw error
    }
  }

  /**
   * Obtener pedidos por usuario
   * @param {number} usuarioId - ID del usuario
   * @returns {Promise<Array>} - Array de pedidos del usuario
   */
  static async getByUsuario(usuarioId) {
    try {
      console.log(`[Pedido.getByUsuario] Starting query for usuarioId: ${usuarioId}`);
      const query = `
        SELECT 
          p.*,
          pr.nombre as producto_nombre,
          u.nombre as usuario_nombre
        FROM pedidos p
        LEFT JOIN productos pr ON p.producto_id = pr.id
        LEFT JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.usuario_id = $1
        ORDER BY p.fecha_pedido DESC
      `;
      
      console.log(`[Pedido.getByUsuario] Executing query...`);
      const result = await pool.query(query, [usuarioId]);
      console.log(`[Pedido.getByUsuario] Query successful, returned ${result.rows.length} rows`);
      
      // Ensure we always return an array, even if empty
      return result.rows;
    } catch (error) {
      console.error(`[Pedido.getByUsuario] ERROR: ${error.message}`);
      console.error(`[Pedido.getByUsuario] Error code: ${error.code}`);
      console.error(`[Pedido.getByUsuario] Error detail: ${error.detail || 'No detail'}`);
      console.error(`[Pedido.getByUsuario] Error query: ${error.query || 'No query info'}`);
      console.error(`[Pedido.getByUsuario] Stack trace: ${error.stack}`);
      throw error;
    }
  }

  /**
   * Crear nuevo pedido
   * @param {Object} pedidoData - Datos del pedido
   * @returns {Promise<Object>} - Pedido creado
   */
  static async create(pedidoData) {
    try {
      const { 
        producto_id, 
        usuario_id, 
        cantidad, 
        estado = 'pendiente',
        fecha_pedido = new Date() 
      } = pedidoData
      
      const now = new Date();
      
      console.log(`[Pedido.create] Creating pedido with data:`, {
        producto_id,
        usuario_id,
        cantidad,
        estado,
        fecha_pedido: fecha_pedido.toISOString(),
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      })
      
      const query = `
        INSERT INTO pedidos (
          producto_id, 
          usuario_id, 
          cantidad, 
          estado, 
          fecha_pedido, 
          created_at, 
          updated_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *
      `
      
      const values = [
        producto_id, 
        usuario_id, 
        cantidad, 
        estado, 
        fecha_pedido,
        now, // created_at
        now  // updated_at
      ]
      
      console.log(`[Pedido.create] Executing query with values:`, values)
      
      const result = await pool.query(query, values)
      console.log(`[Pedido.create] Pedido created successfully with ID: ${result.rows[0]?.id || 'unknown'}`)
      return result.rows[0]
    } catch (error) {
      console.error(`[Pedido.create] ERROR: ${error.message}`)
      console.error(`[Pedido.create] Error code: ${error.code}`)
      console.error(`[Pedido.create] Error detail: ${error.detail || 'No detail'}`)
      console.error(`[Pedido.create] Error query: ${error.query || 'No query info'}`)
      console.error(`[Pedido.create] Error parameters:`, pedidoData)
      console.error(`[Pedido.create] Stack trace: ${error.stack}`)
      throw error
    }
  }

  /**
   * Actualizar pedido por ID
   * @param {number} id - ID del pedido
   * @param {Object} pedidoData - Datos actualizados del pedido
   * @returns {Promise<Object|null>} - Pedido actualizado o null
   */
  static async update(id, pedidoData) {
    try {
        // Obtener el pedido actual primero
        const pedidoActual = await this.getById(id);
        if (!pedidoActual) {
            throw new Error(`Pedido con ID ${id} no encontrado`);
        }

        // Combinar datos actuales con nuevos datos
        const pedidoActualizado = {
            producto_id: pedidoData.producto_id || pedidoActual.producto_id,
            usuario_id: pedidoData.usuario_id || pedidoActual.usuario_id,
            cantidad: pedidoData.cantidad || pedidoActual.cantidad,
            estado: pedidoData.estado || pedidoActual.estado,
            fecha_pedido: pedidoData.fecha_pedido || pedidoActual.fecha_pedido,
            monto: pedidoData.monto || pedidoActual.monto,
            transbank_token: pedidoData.transbank_token,  // Puede ser null
            transbank_status: pedidoData.transbank_status,  // Puede ser null
            buy_order: pedidoData.buy_order  // Puede ser null
        };
      
        const now = new Date();
      
        console.log(`[Pedido.update] Updating pedido ID: ${id} with data:`, {
            producto_id: pedidoActualizado.producto_id,
            usuario_id: pedidoActualizado.usuario_id,
            cantidad: pedidoActualizado.cantidad,
            estado: pedidoActualizado.estado,
            fecha_pedido: pedidoActualizado.fecha_pedido ? new Date(pedidoActualizado.fecha_pedido).toISOString() : null,
            monto: pedidoActualizado.monto,
            transbank_token: pedidoActualizado.transbank_token,
            transbank_status: pedidoActualizado.transbank_status,
            buy_order: pedidoActualizado.buy_order,
            updated_at: now.toISOString()
        })
      
        const query = `
            UPDATE pedidos 
            SET 
              producto_id = COALESCE($1, producto_id), 
              usuario_id = COALESCE($2, usuario_id), 
              cantidad = COALESCE($3, cantidad), 
              estado = COALESCE($4, estado),
              fecha_pedido = COALESCE($5, fecha_pedido),
              monto = COALESCE($6, monto),
              transbank_token = $7,
              transbank_status = $8,
              buy_order = $9,
              updated_at = $10
            WHERE id = $11 
            RETURNING *
        `
        const values = [
            pedidoActualizado.producto_id, 
            pedidoActualizado.usuario_id, 
            pedidoActualizado.cantidad, 
            pedidoActualizado.estado,
            pedidoActualizado.fecha_pedido,
            pedidoActualizado.monto,
            pedidoActualizado.transbank_token,
            pedidoActualizado.transbank_status,
            pedidoActualizado.buy_order,
            now, // updated_at
            id
        ]
      console.log(`[Pedido.update] Executing query with values:`, values)
      
      const result = await pool.query(query, values)
      console.log(`[Pedido.update] Pedido update result: ${result.rowCount} row(s) affected`)
      console.log(`[Pedido.update] Updated pedido data:`, result.rows[0])
      return result.rows[0] || null
    } catch (error) {
      console.error(`[Pedido.update] ERROR: ${error.message}`)
      console.error(`[Pedido.update] Error code: ${error.code}`)
      console.error(`[Pedido.update] Error detail: ${error.detail || 'No detail'}`)
      console.error(`[Pedido.update] Error query: ${error.query || 'No query info'}`)
      console.error(`[Pedido.update] Error parameters:`, { id, ...pedidoData })
      console.error(`[Pedido.update] Stack trace: ${error.stack}`)
      throw error
    }
  }

  /**
   * Eliminar pedido por ID
   * @param {number} id - ID del pedido
   * @returns {Promise<Object|null>} - Pedido eliminado o null
   */
  static async delete(id) {
    try {
      console.log(`[Pedido.delete] Deleting pedido with ID: ${id}`)
      const query = "DELETE FROM pedidos WHERE id = $1 RETURNING *"
      const result = await pool.query(query, [id])
      console.log(`[Pedido.delete] Pedido deletion result: ${result.rowCount} row(s) affected`)
      return result.rows[0] || null
    } catch (error) {
      console.error(`[Pedido.delete] ERROR: ${error.message}`)
      console.error(`[Pedido.delete] Error code: ${error.code}`)
      console.error(`[Pedido.delete] Error detail: ${error.detail || 'No detail'}`)
      console.error(`[Pedido.delete] Error query: ${error.query || 'No query info'}`)
      console.error(`[Pedido.delete] Pedido ID: ${id}`)
      console.error(`[Pedido.delete] Stack trace: ${error.stack}`)
      throw error
    }
  }
}

module.exports = Pedido
