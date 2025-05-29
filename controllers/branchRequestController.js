/**
 * Controlador de Solicitudes de Productos desde Sucursales
 * Maneja toda la lógica de negocio relacionada con solicitudes de productos
 */

const { BranchRequest, ESTADOS_SOLICITUD } = require("../models/BranchRequest");
const { successResponse, errorResponse, notFoundResponse } = require("../utils/responseHelper");

/**
 * Crear nueva solicitud de producto
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const createRequest = async (req, res) => {
  try {
    // Verificar datos obligatorios
    const { sucursal_id, producto_id, cantidad } = req.body;
    
    if (!sucursal_id || !producto_id || !cantidad) {
      return errorResponse(res, "Faltan datos obligatorios (sucursal_id, producto_id, cantidad)", 400);
    }
    
    // Extraer usuario del token si está disponible
    let usuario_id = null;
    if (req.user && req.user.id) {
      usuario_id = req.user.id;
    }
    
    const requestData = {
      ...req.body,
      usuario_solicitud: usuario_id
    };
    
    const solicitud = await BranchRequest.createRequest(requestData);
    return successResponse(res, solicitud, "Solicitud de producto creada exitosamente", 201);
  } catch (error) {
    console.error("Error al crear solicitud de producto:", error);
    
    // Manejo específico de errores
    if (error.message.includes("no existe")) {
      return errorResponse(res, error.message, 404);
    }
    
    if (error.message.includes("inválidos")) {
      return errorResponse(res, error.message, 400);
    }
    
    return errorResponse(res, "Error al crear solicitud de producto");
  }
};

/**
 * Obtener todas las solicitudes
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getAllRequests = async (req, res) => {
  try {
    // Filtrar por estado si se proporciona
    const { estado } = req.query;
    
    let solicitudes;
    if (estado && Object.values(ESTADOS_SOLICITUD).includes(estado)) {
      solicitudes = await BranchRequest.getRequestsByStatus(estado);
    } else {
      solicitudes = await BranchRequest.getAllRequests();
    }
    
    return successResponse(res, solicitudes, "Solicitudes obtenidas exitosamente");
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    return errorResponse(res, "Error al obtener solicitudes");
  }
};

/**
 * Obtener solicitud por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await BranchRequest.getRequestById(id);
    
    if (!solicitud) {
      return notFoundResponse(res, "Solicitud");
    }
    
    return successResponse(res, solicitud, "Solicitud obtenida exitosamente");
  } catch (error) {
    console.error("Error al obtener solicitud:", error);
    return errorResponse(res, "Error al obtener la solicitud");
  }
};

/**
 * Obtener solicitudes por sucursal
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getRequestsByBranch = async (req, res) => {
  try {
    const { sucursalId } = req.params;
    
    if (!sucursalId || isNaN(parseInt(sucursalId))) {
      return errorResponse(res, "ID de sucursal inválido", 400);
    }
    
    const solicitudes = await BranchRequest.getRequestsByBranch(sucursalId);
    
    return successResponse(res, solicitudes, `Solicitudes de la sucursal obtenidas exitosamente`);
  } catch (error) {
    console.error("Error al obtener solicitudes por sucursal:", error);
    return errorResponse(res, "Error al obtener solicitudes por sucursal");
  }
};

/**
 * Aprobar una solicitud
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return errorResponse(res, "ID de solicitud inválido", 400);
    }
    
    // Extraer usuario del token si está disponible
    let usuario_id = null;
    if (req.user && req.user.id) {
      usuario_id = req.user.id;
    }
    
    const solicitud = await BranchRequest.approveRequest(id, usuario_id);
    
    return successResponse(res, solicitud, "Solicitud aprobada exitosamente");
  } catch (error) {
    console.error("Error al aprobar solicitud:", error);
    
    // Manejo específico de errores
    if (error.message.includes("no encontrada")) {
      return notFoundResponse(res, "Solicitud");
    }
    
    if (error.message.includes("Stock insuficiente")) {
      return errorResponse(res, error.message, 400);
    }
    
    if (error.message.includes("no está en estado pendiente")) {
      return errorResponse(res, error.message, 400);
    }
    
    return errorResponse(res, "Error al aprobar la solicitud");
  }
};

/**
 * Rechazar una solicitud
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return errorResponse(res, "ID de solicitud inválido", 400);
    }
    
    // Extraer usuario del token si está disponible
    let usuario_id = null;
    if (req.user && req.user.id) {
      usuario_id = req.user.id;
    }
    
    const solicitud = await BranchRequest.rejectRequest(id, usuario_id, motivo);
    
    return successResponse(res, solicitud, "Solicitud rechazada exitosamente");
  } catch (error) {
    console.error("Error al rechazar solicitud:", error);
    
    // Manejo específico de errores
    if (error.message.includes("no encontrada")) {
      return notFoundResponse(res, "Solicitud");
    }
    
    if (error.message.includes("no está en estado pendiente")) {
      return errorResponse(res, error.message, 400);
    }
    
    return errorResponse(res, "Error al rechazar la solicitud");
  }
};

/**
 * Marcar solicitud como enviada
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const markAsShipped = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return errorResponse(res, "ID de solicitud inválido", 400);
    }
    
    const solicitud = await BranchRequest.markAsShipped(id);
    
    return successResponse(res, solicitud, "Solicitud marcada como enviada exitosamente");
  } catch (error) {
    console.error("Error al marcar solicitud como enviada:", error);
    
    // Manejo específico de errores
    if (error.message.includes("no encontrada")) {
      return notFoundResponse(res, "Solicitud");
    }
    
    if (error.message.includes("no está aprobada")) {
      return errorResponse(res, error.message, 400);
    }
    
    return errorResponse(res, "Error al marcar la solicitud como enviada");
  }
};

/**
 * Marcar solicitud como recibida
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const markAsReceived = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return errorResponse(res, "ID de solicitud inválido", 400);
    }
    
    const solicitud = await BranchRequest.markAsReceived(id);
    
    return successResponse(res, solicitud, "Solicitud marcada como recibida exitosamente");
  } catch (error) {
    console.error("Error al marcar solicitud como recibida:", error);
    
    // Manejo específico de errores
    if (error.message.includes("no encontrada")) {
      return notFoundResponse(res, "Solicitud");
    }
    
    if (error.message.includes("no está enviada")) {
      return errorResponse(res, error.message, 400);
    }
    
    return errorResponse(res, "Error al marcar la solicitud como recibida");
  }
};

/**
 * Eliminar solicitud
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return errorResponse(res, "ID de solicitud inválido", 400);
    }
    
    const solicitud = await BranchRequest.deleteRequest(id);
    
    if (!solicitud) {
      return notFoundResponse(res, "Solicitud");
    }
    
    return successResponse(res, null, "Solicitud eliminada exitosamente");
  } catch (error) {
    console.error("Error al eliminar solicitud:", error);
    
    // Manejo específico de errores
    if (error.message.includes("Solo se pueden eliminar solicitudes en estado pendiente")) {
      return errorResponse(res, error.message, 400);
    }
    
    return errorResponse(res, "Error al eliminar la solicitud");
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  getRequestsByBranch,
  approveRequest,
  rejectRequest,
  markAsShipped,
  markAsReceived,
  deleteRequest
};

