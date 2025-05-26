/**
 * Rutas de Pedidos
 * Define todas las rutas relacionadas con pedidos
 */

const express = require("express")
const router = express.Router()
const pedidosController = require("../controllers/pedidosController")
const { validatePedido } = require("../middleware/validation")

// Add debug middleware for pedidos routes
router.use((req, res, next) => {
  console.log(`[Pedidos Route] ${req.method} ${req.path}`);
  console.log('[Pedidos Route] Query params:', req.query);
  console.log('[Pedidos Route] Route params:', req.params);
  console.log('[Pedidos Route] Body:', req.body);
  next();
});

// GET - Obtener pedidos por usuario (con manejo de errores mejorado)
router.get("/usuario/:usuarioId", async (req, res, next) => {
  console.log(`[Pedidos Route] Getting orders for user ${req.params.usuarioId}`);
  try {
    await pedidosController.getPedidosByUsuario(req, res);
  } catch (error) {
    console.error('[Pedidos Route] Error in getPedidosByUsuario:', error);
    next(error);
  }
});

// GET - Obtener pedido por ID
router.get("/:id", async (req, res, next) => {
  try {
    await pedidosController.getPedidoById(req, res);
  } catch (error) {
    console.error('[Pedidos Route] Error in getPedidoById:', error);
    next(error);
  }
});

// POST - Crear nuevo pedido (con validación)
router.post("/", validatePedido, async (req, res, next) => {
  try {
    await pedidosController.createPedido(req, res);
  } catch (error) {
    console.error('[Pedidos Route] Error in createPedido:', error);
    next(error);
  }
});

// PUT - Actualizar pedido por ID (con validación)
router.put("/:id", validatePedido, async (req, res, next) => {
  try {
    await pedidosController.updatePedido(req, res);
  } catch (error) {
    console.error('[Pedidos Route] Error in updatePedido:', error);
    next(error);
  }
});

// DELETE - Eliminar pedido por ID
router.delete("/:id", async (req, res, next) => {
  try {
    await pedidosController.deletePedido(req, res);
  } catch (error) {
    console.error('[Pedidos Route] Error in deletePedido:', error);
    next(error);
  }
});

module.exports = router
