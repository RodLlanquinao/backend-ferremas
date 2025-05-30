/**
 * Rutas de Productos
 * Define todas las rutas relacionadas con productos
 */

const express = require("express")
const router = express.Router()
const productosController = require("../controllers/productosController")
const { validateProducto } = require("../middleware/validation")

// GET - Obtener todos los productos ordenados
router.get("/", productosController.getAllProductos)

// GET - Obtener productos por categoría
router.get("/categoria/:nombre", productosController.getProductosByCategoria)

// Rutas de bodega
router.get("/bodega/disponibles", productosController.getAvailableInWarehouse)
router.get("/bodega/bajo-stock", productosController.getProductsBelowMinimumStock)
router.get("/:id/stock-bodega", productosController.getWarehouseStock)
router.put("/:id/stock-bodega", productosController.updateWarehouseStock)
router.get("/:id/verificar-stock", productosController.checkMinimumStock)

// GET - Obtener producto por ID
router.get("/:id", productosController.getProductoById)

// POST - Crear nuevo producto (con validación)
router.post("/", validateProducto, productosController.createProducto)

// PUT - Actualizar producto por ID (con validación)
router.put("/:id", validateProducto, productosController.updateProducto)

// DELETE - Eliminar producto por ID
router.delete("/:id", productosController.deleteProducto)

module.exports = router
