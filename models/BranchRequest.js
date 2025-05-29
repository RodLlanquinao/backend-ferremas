/**
 * Modelo de Solicitud de Productos desde Sucursales
 * Define la estructura y operaciones de base de datos para solicitudes de productos
 */

const { pool } = require("../config/database");
const Producto = require("./Producto");

// Estados válidos para solicitudes
const ESTADOS_SOLICITUD = {
  PENDIENTE: 'pendiente',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
  ENVIADA: 'enviada',
  RECIBIDA: 'recibida'
};

// Función de validación básica para datos de solicitud
const validateSolicitud = (data) => {
  const errors = [];
  
  if (!data.sucursal_id || isNaN(parseInt(data.sucursal_id))) {
    errors.push('La sucursal es obligatoria');
  }
  
  if (!data.producto_id || isNaN(parseInt(data.producto_id))) {
    errors.push('El producto es obligatorio');
  }
  
  if (!data.cantidad || isNaN(parseInt(data.cantidad)) || parseInt(data.cantidad) <= 0) {
    errors.push('La cantidad debe ser un número válido mayor a cero');
  }
  
  if (data.estado && !Object.values(ESTADOS_SOLICITUD).includes(data.estado)) {
    errors.push(`El estado debe ser uno de los siguientes: ${Object.values(ESTADOS_SOLICITUD).join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

class BranchRequest {
  /**
   * Crear nueva solicitud de producto desde una sucursal
   * @param {Object} requestData - Datos de la solicitud
   * @returns {Promise<Object>} - Solicitud creada
   */
  static async createRequest(requestData) {
    try {
      // Validar datos
      const validation = validateSolicitud(requestData);
      if (!validation.isValid) {
        throw new Error(`Datos de solicitud inválidos: ${validation.errors.join(', ')}`);
      }
      
      const { 
        sucursal_id, 
        producto_id, 
        cantidad, 
        usuario_solicitud,
        notas
      } = requestData;
      
      // Verificar que el producto existe y tiene stock en bodega
      const producto = await Producto.getById(producto_id);
      if (!producto) {
        throw new Error(`El producto con ID ${producto_id} no existe`);
      }
      
      console.log(`Creando solicitud de producto ID ${producto_id} para sucursal ID ${sucursal_id}, cantidad: ${cantidad}`);
      
      const query = `
        INSERT INTO solicitudes_productos (
          sucursal_id, producto_id, cantidad, estado, 
          usuario_solicitud, notas, created_at, updated_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
        RETURNING *
      `;
      
      const values = [
        sucursal_id,
        producto_id,
        cantidad,
        ESTADOS_SOLICITUD.PENDIENTE, // Estado inicial siempre es pendiente
        usuario_solicitud || null,
        notas || null
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error en BranchRequest.createRequest:', error.message);
      throw error; // Re-lanzar para manejar en el controlador
    }
  }

  /**
   * Obtener solicitud por ID
   * @param {number} id - ID de la solicitud
   * @returns {Promise<Object|null>} - Solicitud encontrada o null
   */
  static async getRequestById(id) {
    try {
      const query = `
        SELECT sp.*, p.nombre as producto_nombre, s.nombre as sucursal_nombre
        FROM solicitudes_productos sp
        JOIN productos p ON sp.producto_id = p.id
        JOIN sucursales s ON sp.sucursal_id = s.id
        WHERE sp.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Error al obtener solicitud ID ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Obtener todas las solicitudes
   * @returns {Promise<Array>} - Array de solicitudes
   */
  static async getAllRequests() {
    try {
      const query = `
        SELECT sp.*, p.nombre as producto_nombre, s.nombre as sucursal_nombre
        FROM solicitudes_productos sp
        JOIN productos p ON sp.producto_id = p.id
        JOIN sucursales s ON sp.sucursal_id = s.id
        ORDER BY sp.fecha_solicitud DESC
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener solicitudes:", error.message);
      throw error;
    }
  }

  /**
   * Obtener solicitudes por sucursal
   * @param {number} sucursalId - ID de la sucursal
   * @returns {Promise<Array>} - Array de solicitudes de la sucursal
   */
  static async getRequestsByBranch(sucursalId) {
    try {
      const query = `
        SELECT sp.*, p.nombre as producto_nombre
        FROM solicitudes_productos sp
        JOIN productos p ON sp.producto_id = p.id
        WHERE sp.sucursal_id = $1
        ORDER BY sp.fecha_solicitud DESC
      `;
      const result = await pool.query(query, [sucursalId]);
      return result.rows;
    } catch (error) {
      console.error(`Error al obtener solicitudes para sucursal ID ${sucursalId}:`, error.message);
      throw error;
    }
  }

  /**
   * Obtener solicitudes por estado
   * @param {string} estado - Estado de la solicitud
   * @returns {Promise<Array>} - Array de solicitudes en ese estado
   */
  static async getRequestsByStatus(estado) {
    try {
      if (!Object.values(ESTADOS_SOLICITUD).includes(estado)) {
        throw new Error(`Estado inválido: ${estado}`);
      }
      
      const query = `
        SELECT sp.*, p.nombre as producto_nombre, s.nombre as sucursal_nombre
        FROM solicitudes_productos sp
        JOIN productos p ON sp.producto_id = p.id
        JOIN sucursales s ON sp.sucursal_id = s.id
        WHERE sp.estado = $1
        ORDER BY sp.fecha_solicitud DESC
      `;
      const result = await pool.query(query, [estado]);
      return result.rows;
    } catch (error) {
      console.error(`Error al obtener solicitudes con estado ${estado}:`, error.message);
      throw error;
    }
  }

  /**
   * Actualizar estado de solicitud
   * @param {number} id - ID de la solicitud
   * @param {string} nuevoEstado - Nuevo estado de la solicitud
   * @param {number} usuarioId - ID del usuario que realiza la actualización
   * @returns {Promise<Object|null>} - Solicitud actualizada o null
   */
  static async updateRequestStatus(id, nuevoEstado, usuarioId = null) {
    try {
      if (!Object.values(ESTADOS_SOLICITUD).includes(nuevoEstado)) {
        throw new Error(`Estado inválido: ${nuevoEstado}`);
      }
      
      // Obtener solicitud actual para validar transición de estado
      const solicitudActual = await this.getRequestById(id);
      if (!solicitudActual) {
        throw new Error(`Solicitud con ID ${id} no encontrada`);
      }
      
      console.log(`Actualizando estado de solicitud ID ${id} de '${solicitudActual.estado}' a '${nuevoEstado}'`);
      
      // Preparar campos a actualizar según el nuevo estado
      let camposActualizar = "estado = $1, updated_at = CURRENT_TIMESTAMP";
      let valoresActualizar = [nuevoEstado];
      
      // Añadir campos específicos según el estado
      if (nuevoEstado === ESTADOS_SOLICITUD.APROBADA) {
        camposActualizar += ", fecha_respuesta = CURRENT_TIMESTAMP, usuario_respuesta = $2";
        valoresActualizar.push(usuarioId);
      } else if (nuevoEstado === ESTADOS_SOLICITUD.ENVIADA) {
        camposActualizar += ", fecha_entrega = CURRENT_TIMESTAMP";
      }
      
      const query = `
        UPDATE solicitudes_productos 
        SET ${camposActualizar}
        WHERE id = $${valoresActualizar.length + 1} 
        RETURNING *
      `;
      
      valoresActualizar.push(id);
      
      const result = await pool.query(query, valoresActualizar);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Error al actualizar estado de solicitud ID ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Aprobar solicitud y actualizar stock de bodega
   * @param {number} id - ID de la solicitud
   * @param {number} usuarioId - ID del usuario que aprueba
   * @returns {Promise<Object|null>} - Solicitud aprobada o null
   */
  static async approveRequest(id, usuarioId = null) {
    // Comenzar una transacción para garantizar consistencia
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Obtener detalles de la solicitud
      const query = "SELECT * FROM solicitudes_productos WHERE id = $1";
      const result = await client.query(query, [id]);
      
      const solicitud = result.rows[0];
      if (!solicitud) {
        throw new Error(`Solicitud con ID ${id} no encontrada`);
      }
      
      if (solicitud.estado !== ESTADOS_SOLICITUD.PENDIENTE) {
        throw new Error(`No se puede aprobar la solicitud porque no está en estado pendiente. Estado actual: ${solicitud.estado}`);
      }
      
      // Verificar stock disponible en bodega
      const productoQuery = "SELECT stock_bodega FROM productos WHERE id = $1";
      const productoResult = await client.query(productoQuery, [solicitud.producto_id]);
      
      if (productoResult.rows.length === 0) {
        throw new Error(`Producto con ID ${solicitud.producto_id} no encontrado`);
      }
      
      const stockBodega = productoResult.rows[0].stock_bodega || 0;
      
      if (stockBodega < solicitud.cantidad) {
        throw new Error(`Stock insuficiente en bodega. Solicitado: ${solicitud.cantidad}, Disponible: ${stockBodega}`);
      }
      
      // Actualizar stock en bodega
      const nuevoStockBodega = stockBodega - solicitud.cantidad;
      const updateProductoQuery = `
        UPDATE productos 
        SET stock_bodega = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $2
      `;
      await client.query(updateProductoQuery, [nuevoStockBodega, solicitud.producto_id]);
      
      // Actualizar solicitud a estado aprobado
      const updateSolicitudQuery = `
        UPDATE solicitudes_productos 
        SET estado = $1, fecha_respuesta = CURRENT_TIMESTAMP, usuario_respuesta = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3 
        RETURNING *
      `;
      
      const updateResult = await client.query(updateSolicitudQuery, [
        ESTADOS_SOLICITUD.APROBADA,
        usuarioId,
        id
      ]);
      
      await client.query('COMMIT');
      
      console.log(`Solicitud ID ${id} aprobada. Stock en bodega actualizado de ${stockBodega} a ${nuevoStockBodega}`);
      
      return updateResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Error al aprobar solicitud ID ${id}:`, error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Rechazar solicitud
   * @param {number} id - ID de la solicitud
   * @param {number} usuarioId - ID del usuario que rechaza
   * @param {string} motivo - Motivo del rechazo
   * @returns {Promise<Object|null>} - Solicitud rechazada o null
   */
  static async rejectRequest(id, usuarioId = null, motivo = null) {
    try {
      // Obtener detalles de la solicitud
      const solicitud = await this.getRequestById(id);
      if (!solicitud) {
        throw new Error(`Solicitud con ID ${id} no encontrada`);
      }
      
      if (solicitud.estado !== ESTADOS_SOLICITUD.PENDIENTE) {
        throw new Error(`No se puede rechazar la solicitud porque no está en estado pendiente. Estado actual: ${solicitud.estado}`);
      }
      
      // Actualizar solicitud a estado rechazado
      const query = `
        UPDATE solicitudes_productos 
        SET estado = $1, fecha_respuesta = CURRENT_TIMESTAMP, usuario_respuesta = $2, notas = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4 
        RETURNING *
      `;
      
      const values = [
        ESTADOS_SOLICITUD.RECHAZADA,
        usuarioId,
        motivo || solicitud.notas,
        id
      ];
      
      const result = await pool.query(query, values);
      
      console.log(`Solicitud ID ${id} rechazada. Motivo: ${motivo || 'No especificado'}`);
      
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Error al rechazar solicitud ID ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Marcar solicitud como enviada
   * @param {number} id - ID de la solicitud
   * @returns {Promise<Object|null>} - Solicitud marcada como enviada o null
   */
  static async markAsShipped(id) {
    try {
      // Obtener detalles de la solicitud
      const solicitud = await this.getRequestById(id);
      if (!solicitud) {
        throw new Error(`Solicitud con ID ${id} no encontrada`);
      }
      
      if (solicitud.estado !== ESTADOS_SOLICITUD.APROBADA) {
        throw new Error(`No se puede marcar como enviada porque la solicitud no está aprobada. Estado actual: ${solicitud.estado}`);
      }
      
      return await this.updateRequestStatus(id, ESTADOS_SOLICITUD.ENVIADA);
    } catch (error) {
      console.error(`Error al marcar solicitud ID ${id} como enviada:`, error.message);
      throw error;
    }
  }

  /**
   * Marcar solicitud como recibida
   * @param {number} id - ID de la solicitud
   * @returns {Promise<Object|null>} - Solicitud marcada como recibida o null
   */
  static async markAsReceived(id) {
    try {
      // Obtener detalles de la solicitud
      const solicitud = await this.getRequestById(id);
      if (!solicitud) {
        throw new Error(`Solicitud con ID ${id} no encontrada`);
      }
      
      if (solicitud.estado !== ESTADOS_SOLICITUD.ENVIADA) {
        throw new Error(`No se puede marcar como recibida porque la solicitud no está enviada. Estado actual: ${solicitud.estado}`);
      }
      
      return await this.updateRequestStatus(id, ESTADOS_SOLICITUD.RECIBIDA);
    } catch (error) {
      console.error(`Error al marcar solicitud ID ${id} como recibida:`, error.message);
      throw error;
    }
  }

  /**
   * Eliminar solicitud por ID
   * @param {number} id - ID de la solicitud
   * @returns {Promise<Object|null>} - Solicitud eliminada o null
   */
  static async deleteRequest(id) {
    try {
      // Solo se pueden eliminar solicitudes en estado pendiente
      const solicitud = await this.getRequestById(id);
      if (!solicitud) {
        throw new Error(`Solicitud con ID ${id} no encontrada`);
      }
      
      if (solicitud.estado !== ESTADOS_SOLICITUD.PENDIENTE) {
        throw new Error(`Solo se pueden eliminar solicitudes en estado pendiente. Estado actual: ${solicitud.estado}`);
      }
      
      const query = "DELETE FROM solicitudes_productos WHERE id = $1 RETURNING *";
      const result = await pool.query(query, [id]);
      
      console.log(`Solicitud ID ${id} eliminada`);
      
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Error al eliminar solicitud ID ${id}:`, error.message);
      throw error;
    }
  }
}

// Exportar la clase y los estados para uso externo
module.exports = {
  BranchRequest,
  ESTADOS_SOLICITUD
};

