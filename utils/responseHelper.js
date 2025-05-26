/**
 * Utilidades para estandarizar las respuestas de la API
 * Proporciona métodos consistentes para respuestas exitosas y de error
 */

/**
 * Respuesta exitosa estándar
 * @param {Object} res - Objeto response de Express
 * @param {*} data - Datos a enviar
 * @param {string} message - Mensaje opcional
 * @param {number} statusCode - Código de estado HTTP
 */
const successResponse = (res, data, message = "Operación exitosa", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Respuesta de error estándar
 * @param {Object} res - Objeto response de Express
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP
 * @param {*} error - Detalles del error (opcional)
 */
const errorResponse = (res, message = "Error interno del servidor", statusCode = 500, error = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  }

  // Solo incluir detalles del error en desarrollo
  if (process.env.NODE_ENV === "development" && error) {
    response.error = error
  }

  return res.status(statusCode).json(response)
}

/**
 * Respuesta para recursos no encontrados
 * @param {Object} res - Objeto response de Express
 * @param {string} resource - Nombre del recurso no encontrado
 */
const notFoundResponse = (res, resource = "Recurso") => {
  return errorResponse(res, `${resource} no encontrado`, 404)
}

/**
 * Respuesta para errores de validación
 * @param {Object} res - Objeto response de Express
 * @param {Array|string} errors - Errores de validación
 */
const validationErrorResponse = (res, errors) => {
  return errorResponse(res, "Errores de validación", 400, errors)
}

module.exports = {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
}
