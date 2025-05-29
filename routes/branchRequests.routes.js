/**
 * Rutas de Solicitudes de Productos desde Sucursales
 * Define todas las rutas relacionadas con solicitudes de productos
 */

const express = require("express")
const router = express.Router()
const branchRequestController = require("../controllers/branchRequestController")
// Temporalmente comentado para pruebas
// const { authenticate } = require("../middleware/auth")
const { validateRequestData } = require("../middleware/validation")

// Middleware de validación para solicitudes
const validateRequest = (req, res, next) => {
  const { sucursal_id, producto_id, cantidad } = req.body;
  
  let errors = [];
  
  if (!sucursal_id || isNaN(parseInt(sucursal_id))) {
    errors.push("La sucursal es obligatoria y debe ser un número válido");
  }
  
  if (!producto_id || isNaN(parseInt(producto_id))) {
    errors.push("El producto es obligatorio y debe ser un número válido");
  }
  
  if (!cantidad || isNaN(parseInt(cantidad)) || parseInt(cantidad) <= 0) {
    errors.push("La cantidad es obligatoria y debe ser un número mayor a cero");
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Error de validación",
      errors: errors
    });
  }
  
  next();
};

// Middleware para verificar si un ID es válido
const validateId = (req, res, next) => {
  const id = req.params.id;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: "ID inválido",
      error: "El ID debe ser un número válido"
    });
  }
  
  next();
};

// POST - Crear nueva solicitud de producto
router.post("/", validateRequest, branchRequestController.createRequest);

// GET - Obtener todas las solicitudes (con filtro opcional de estado)
router.get("/", branchRequestController.getAllRequests);

// GET - Obtener solicitud por ID
router.get("/:id", validateId, branchRequestController.getRequestById);

// GET - Obtener solicitudes por sucursal
router.get("/branch/:sucursalId", branchRequestController.getRequestsByBranch);

// PUT - Aprobar solicitud
router.put("/:id/approve", validateId, branchRequestController.approveRequest);

// PUT - Rechazar solicitud
router.put("/:id/reject", validateId, branchRequestController.rejectRequest);

// PUT - Marcar solicitud como enviada
router.put("/:id/ship", validateId, branchRequestController.markAsShipped);

// PUT - Marcar solicitud como recibida
router.put("/:id/receive", validateId, branchRequestController.markAsReceived);

// DELETE - Eliminar solicitud
router.delete("/:id", validateId, branchRequestController.deleteRequest);

module.exports = router;

