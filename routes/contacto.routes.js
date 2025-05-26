/**
 * Rutas de Contacto
 * Define todas las rutas relacionadas con mensajes de contacto
 */

const express = require("express")
const router = express.Router()
const contactoController = require("../controllers/contactoController")
const { validateContacto } = require("../middleware/validation")

// GET - Obtener todos los mensajes de contacto
router.get("/", contactoController.getAllContactos)

// GET - Obtener mensaje de contacto por ID
router.get("/:id", contactoController.getContactoById)

// POST - Enviar mensaje de contacto (con validación)
router.post("/", validateContacto, contactoController.createContacto)

// DELETE - Eliminar mensaje de contacto por ID
router.delete("/:id", contactoController.deleteContacto)

module.exports = router
