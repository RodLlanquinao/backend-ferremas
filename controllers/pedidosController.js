/**
 * Controlador de Pedidos
 * Maneja toda la lógica de negocio relacionada con pedidos
 */

const Pedido = require("../models/Pedido")
const Producto = require("../models/Producto")
const Usuario = require("../models/Usuario")
const { successResponse, errorResponse, notFoundResponse } = require("../utils/responseHelper")

// Debug check
console.log('Loaded dependencies:', {
  Pedido: !!Pedido,
  Producto: !!Producto,
  Usuario: !!Usuario,
  responseHelpers: !!(successResponse && errorResponse && notFoundResponse)
});

// Add debug wrapper to getByUsuario
const originalGetByUsuario = Usuario.getById;
Usuario.getById = async (id) => {
  console.log(`[Usuario.getById] Debug: Called with id ${id}`);
  try {
    const result = await originalGetByUsuario.call(Usuario, id);
    console.log(`[Usuario.getById] Debug: Result:`, result);
    return result;
  } catch (error) {
    console.error(`[Usuario.getById] Debug: Error:`, error);
    throw error;
  }
};

/**
 * Obtener pedido por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params
    const pedido = await Pedido.getById(id)

    if (!pedido) {
      return notFoundResponse(res, "Pedido")
    }

    return successResponse(res, pedido, "Pedido obtenido exitosamente")
  } catch (error) {
    console.error("Error al obtener pedido:", error)
    return errorResponse(res, "Error al obtener pedido")
  }
}

/**
 * Obtener pedidos por usuario
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getPedidosByUsuario = async (req, res) => {
  console.log('[getPedidosByUsuario] Starting request...');
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    console.log('[getPedidosByUsuario] Parsed usuarioId:', usuarioId);

    if (isNaN(usuarioId)) {
      console.error('[getPedidosByUsuario] Invalid usuarioId format');
      try {
        return errorResponse(res, "ID de usuario inválido", 400);
      } catch (responseError) {
        console.error('[getPedidosByUsuario] Error sending error response:', responseError);
        return res.status(400).json({ success: false, message: "ID de usuario inválido" });
      }
    }

    // Verificar si el usuario existe
    console.log('[getPedidosByUsuario] Checking if user exists...');
    let usuario;
    try {
      usuario = await Usuario.getById(usuarioId);
      console.log('[getPedidosByUsuario] Usuario.getById result:', usuario);
    } catch (userError) {
      console.error('[getPedidosByUsuario] Error getting user:', userError);
      throw userError;
    }
    
    if (!usuario) {
      console.log('[getPedidosByUsuario] User not found:', usuarioId);
      try {
        return notFoundResponse(res, "Usuario");
      } catch (responseError) {
        console.error('[getPedidosByUsuario] Error sending not found response:', responseError);
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }
    }
    
    console.log('[getPedidosByUsuario] User found, fetching orders...');
    let pedidos;
    try {
      pedidos = await Pedido.getByUsuario(usuarioId);
      console.log('[getPedidosByUsuario] Pedidos result:', pedidos);
    } catch (ordersError) {
      console.error('[getPedidosByUsuario] Error getting orders:', ordersError);
      throw ordersError;
    }
    
    // Even if no orders are found, return an empty array with success status
    console.log(`[getPedidosByUsuario] Found ${pedidos?.length || 0} orders for user`);
    try {
      return successResponse(
        res, 
        pedidos || [], 
        pedidos?.length > 0 
          ? "Pedidos del usuario obtenidos exitosamente"
          : "No se encontraron pedidos para este usuario"
      );
    } catch (responseError) {
      console.error('[getPedidosByUsuario] Error sending success response:', responseError);
      return res.status(200).json({
        success: true,
        data: pedidos || [],
        message: pedidos?.length > 0 
          ? "Pedidos del usuario obtenidos exitosamente"
          : "No se encontraron pedidos para este usuario",
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('[getPedidosByUsuario] Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      query: error.query,
      stack: error.stack
    });
    
    try {
      return errorResponse(
        res,
        "Error al obtener pedidos del usuario",
        500,
        process.env.NODE_ENV === 'development' ? {
          message: error.message,
          code: error.code,
          detail: error.detail,
          query: error.query
        } : undefined
      );
    } catch (responseError) {
      console.error('[getPedidosByUsuario] Error sending error response:', responseError);
      return res.status(500).json({
        success: false,
        message: "Error al obtener pedidos del usuario",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        timestamp: new Date().toISOString()
      });
    }
  }
}

/**
 * Crear nuevo pedido
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const createPedido = async (req, res) => {
  console.log('==== START createPedido ====');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Request URL: ${req.originalUrl}`);
  console.log(`Request Method: ${req.method}`);
  console.log(`Request Headers:`, {
    'content-type': req.headers['content-type'],
    'accept': req.headers['accept']
  });
  
  try {
    const { producto_id, usuario_id, cantidad } = req.body
    
    // Log incoming request parameters in detail
    console.log('[createPedido] Detailed request body:', JSON.stringify(req.body, null, 2));
    console.log('[createPedido] Parsed parameters:', {
      producto_id: producto_id + ' (type: ' + typeof producto_id + ')',
      usuario_id: usuario_id + ' (type: ' + typeof usuario_id + ')', 
      cantidad: cantidad + ' (type: ' + typeof cantidad + ')',
      estado: req.body.estado + ' (type: ' + typeof req.body.estado + ')',
      fecha_pedido: req.body.fecha_pedido + ' (type: ' + typeof req.body.fecha_pedido + ')',
    });

    console.log('[createPedido] Verificando existencia del producto ID:', producto_id);
    // Verificar que el producto existe
    const producto = await Producto.getById(producto_id)
    if (!producto) {
      console.log('[createPedido] ERROR: Producto no encontrado con ID:', producto_id);
      return errorResponse(res, "El producto especificado no existe", 400)
    }
    console.log('[createPedido] Producto encontrado:', {
      id: producto.id,
      nombre: producto.nombre,
      stock: producto.stock
    });

    console.log('[createPedido] Verificando existencia del usuario ID:', usuario_id);
    // Verificar que el usuario existe
    const usuario = await Usuario.getById(usuario_id)
    if (!usuario) {
      console.log('[createPedido] ERROR: Usuario no encontrado con ID:', usuario_id);
      return errorResponse(res, "El usuario especificado no existe", 400)
    }
    console.log('[createPedido] Usuario encontrado:', {
      id: usuario.id,
      nombre: usuario.nombre
    });

    console.log('[createPedido] Verificando stock disponible. Solicitado:', cantidad, 'Disponible:', producto.stock);
    // Verificar stock disponible
    if (producto.stock < cantidad) {
      console.log('[createPedido] ERROR: Stock insuficiente para producto ID:', producto_id);
      return errorResponse(res, `Stock insuficiente. Disponible: ${producto.stock}`, 400)
    }
    console.log('[createPedido] Stock verificado y disponible');

    console.log('[createPedido] Preparando datos para crear pedido:', {
      producto_id,
      usuario_id,
      cantidad,
      estado: req.body.estado || 'pendiente',
      fecha_pedido: req.body.fecha_pedido || new Date().toISOString()
    });
    
    // Crear el pedido con datos validados
    const pedidoData = {
      producto_id,
      usuario_id,
      cantidad,
      estado: req.body.estado || 'pendiente',
      fecha_pedido: req.body.fecha_pedido ? new Date(req.body.fecha_pedido) : new Date()
    };
    
    console.log('[createPedido] Llamando a Pedido.create() con datos sanitizados');
    const pedido = await Pedido.create(pedidoData)
    console.log('[createPedido] Pedido creado exitosamente con ID:', pedido ? pedido.id : 'unknown');

    console.log('[createPedido] Actualizando stock del producto');
    try {
      // Actualizar stock del producto (una sola vez)
      await Producto.update(producto_id, {
        ...producto,
        stock: producto.stock - cantidad,
      });
      console.log('[createPedido] Stock actualizado exitosamente de', producto.stock, 'a', (producto.stock - cantidad));
    } catch (stockError) {
      console.error('[createPedido] Error al actualizar stock del producto:', stockError);
      console.error('[createPedido] Detalles del error:', {
        message: stockError.message,
        code: stockError.code || 'No error code',
        detail: stockError.detail || 'No detail available',
        stack: stockError.stack
      });
      // No relanzamos el error ya que el pedido ya se creó
      // pero registramos que hubo un problema con la actualización del stock
      console.warn('[createPedido] El pedido se creó pero hubo un error al actualizar el stock');
    }
    
    console.log('[createPedido] Preparando respuesta exitosa');
    console.log('==== END createPedido SUCCESS ====');
    return successResponse(res, pedido, "Pedido creado exitosamente", 201)
  } catch (error) {
    // Detailed error logging
    console.error("=== ERROR EN CREATE PEDIDO ===")
    console.error(`Error message: ${error.message}`)
    console.error(`Error code: ${error.code || 'No error code'}`)
    console.error(`Error detail: ${error.detail || 'No detail available'}`)
    console.error(`Error query: ${error.query || 'No query available'}`)
    console.error(`Error constraint: ${error.constraint || 'No constraint info'}`)
    console.error(`Stack trace: ${error.stack || 'No stack trace available'}`)
    console.error("Request body:", req.body)
    console.error("Last successful step: The error occurred after validation checks but before or during database operations")
    console.error("=== FIN ERROR CREATE PEDIDO ===")
    console.log('==== END createPedido ERROR ====');
    
    // Pass error details in development mode
    const errorDetails = process.env.NODE_ENV === 'development' ? {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      query: error.query?.replace(/\s+/g, ' ') // Compact query string
    } : null;
    
    return errorResponse(res, "Error al crear pedido", 500, errorDetails)
  }
}

/**
 * Actualizar pedido por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const updatePedido = async (req, res) => {
  try {
    const { id } = req.params
    const { producto_id, usuario_id } = req.body

    // Verificar que el pedido existe
    const pedidoExistente = await Pedido.getById(id)
    if (!pedidoExistente) {
      return notFoundResponse(res, "Pedido")
    }

    // Verificar que el producto existe (si se está cambiando)
    if (producto_id && producto_id !== pedidoExistente.producto_id) {
      const producto = await Producto.getById(producto_id)
      if (!producto) {
        return errorResponse(res, "El producto especificado no existe", 400)
      }
    }

    // Verificar que el usuario existe (si se está cambiando)
    if (usuario_id && usuario_id !== pedidoExistente.usuario_id) {
      const usuario = await Usuario.getById(usuario_id)
      if (!usuario) {
        return errorResponse(res, "El usuario especificado no existe", 400)
      }
    }

    const pedido = await Pedido.update(id, req.body)
    return successResponse(res, pedido, "Pedido actualizado exitosamente")
  } catch (error) {
    console.error("Error al actualizar pedido:", error)
    return errorResponse(res, "Error al actualizar pedido")
  }
}

/**
 * Eliminar pedido por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const deletePedido = async (req, res) => {
  try {
    const { id } = req.params
    const pedido = await Pedido.delete(id)

    if (!pedido) {
      return notFoundResponse(res, "Pedido")
    }

    return successResponse(res, null, "Pedido eliminado correctamente")
  } catch (error) {
    console.error("Error al eliminar pedido:", error)
    return errorResponse(res, "Error al eliminar pedido")
  }
}

module.exports = {
  getPedidoById,
  getPedidosByUsuario,
  createPedido,
  updatePedido,
  deletePedido,
}
