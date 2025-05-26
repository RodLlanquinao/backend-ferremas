/**
 * Middleware de validación para diferentes entidades
 * Valida los datos de entrada antes de procesarlos
 */

const { validationErrorResponse } = require("../utils/responseHelper")

/**
 * Validador para productos
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const validateProducto = (req, res, next) => {
  const { nombre, precio } = req.body
  const errors = []

  // Validaciones requeridas
  if (!nombre || nombre.trim().length === 0) {
    errors.push("El nombre del producto es requerido")
  }

  if (!precio || isNaN(precio) || precio <= 0) {
    errors.push("El precio debe ser un número mayor a 0")
  }

  // Validaciones opcionales
  if (req.body.stock && (isNaN(req.body.stock) || req.body.stock < 0)) {
    errors.push("El stock debe ser un número mayor o igual a 0")
  }

  if (errors.length > 0) {
    return validationErrorResponse(res, errors)
  }

  next()
}

/**
 * Validador para usuarios
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const validateUsuario = (req, res, next) => {
  const { nombre, email } = req.body
  const errors = []

  if (!nombre || nombre.trim().length === 0) {
    errors.push("El nombre del usuario es requerido")
  }

  if (!email || !isValidEmail(email)) {
    errors.push("Email válido es requerido")
  }

  if (errors.length > 0) {
    return validationErrorResponse(res, errors)
  }

  next()
}

/**
 * Validador para pedidos
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const validatePedido = (req, res, next) => {
  const { producto_id, usuario_id, cantidad } = req.body
  const errors = []

  if (!producto_id || isNaN(producto_id)) {
    errors.push("ID de producto válido es requerido")
  }

  if (!usuario_id || isNaN(usuario_id)) {
    errors.push("ID de usuario válido es requerido")
  }

  if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
    errors.push("La cantidad debe ser un número mayor a 0")
  }

  if (errors.length > 0) {
    return validationErrorResponse(res, errors)
  }

  next()
}

/**
 * Validador para contacto
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const validateContacto = (req, res, next) => {
  const { nombre, email, mensaje } = req.body
  const errors = []

  if (!nombre || nombre.trim().length === 0) {
    errors.push("El nombre es requerido")
  }

  if (!email || !isValidEmail(email)) {
    errors.push("Email válido es requerido")
  }

  if (!mensaje || mensaje.trim().length === 0) {
    errors.push("El mensaje es requerido")
  }

  if (errors.length > 0) {
    return validationErrorResponse(res, errors)
  }

  next()
}

/**
 * Función auxiliar para validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si el email es válido
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

module.exports = {
  validateProducto,
  validateUsuario,
  validatePedido,
  validateContacto,
}
