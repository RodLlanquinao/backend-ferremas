/**
 * Rutas de Usuarios
 * Define todas las rutas relacionadas con usuarios
 */

const express = require("express")
const router = express.Router()
const usuariosController = require("../controllers/usuariosController")
const { validateUsuario } = require("../middleware/validation")

// GET - Obtener usuario por ID
router.get("/:id", usuariosController.getUsuarioById)

// POST - Crear nuevo usuario (con validación)
router.post("/", validateUsuario, usuariosController.createUsuario)

// PUT - Actualizar usuario por ID (con validación)
router.put("/:id", validateUsuario, usuariosController.updateUsuario)

// DELETE - Eliminar usuario por ID
router.delete("/:id", usuariosController.deleteUsuario)

module.exports = router
