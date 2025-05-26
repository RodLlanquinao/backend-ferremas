/**
 * Middleware para manejo centralizado de errores
 * Captura y procesa todos los errores de la aplicación
 */

const { errorResponse } = require("../utils/responseHelper")

// Definir códigos de error de PostgreSQL para mejor identificación
const PG_ERROR_CODES = {
  // Constraint violations
  "23000": "integrity_constraint_violation",
  "23001": "restrict_violation",
  "23502": "not_null_violation",
  "23503": "foreign_key_violation",
  "23505": "unique_violation",
  "23514": "check_violation",
  // Connection errors
  "08000": "connection_exception",
  "08003": "connection_does_not_exist",
  "08006": "connection_failure",
  // Permission errors
  "42501": "insufficient_privilege",
  // Query errors
  "42P01": "undefined_table",
  "42703": "undefined_column",
  "42P02": "undefined_parameter",
}

/**
 * Middleware de manejo de errores
 * @param {Error} err - Error capturado
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const errorHandler = (err, req, res, next) => {
  // Crear un objeto para almacenar información detallada del error
  const errorInfo = {
    message: err.message,
    code: err.code,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  }
  
  // Agregar información detallada en entorno de desarrollo
  if (process.env.NODE_ENV === 'development') {
    errorInfo.stack = err.stack;
    errorInfo.name = err.name;
    
    // Agregar detalles específicos para errores de base de datos
    if (err.code) {
      errorInfo.pgErrorName = PG_ERROR_CODES[err.code] || 'unknown_pg_error';
      errorInfo.detail = err.detail;
      errorInfo.hint = err.hint;
      errorInfo.table = err.table;
      errorInfo.column = err.column;
      errorInfo.constraint = err.constraint;
    }
    
    // Detalles de la petición
    errorInfo.requestBody = req.body;
    errorInfo.requestParams = req.params;
    errorInfo.requestQuery = req.query;
  }
  
  // Registrar error con nivel apropiado
  console.error("🚨 Error capturado:", errorInfo);

  // Preparar datos para incluir en respuesta (solo en desarrollo)
  const errorDetails = process.env.NODE_ENV === 'development' ? {
    message: err.message,
    code: err.code,
    pgErrorName: PG_ERROR_CODES[err.code],
    detail: err.detail,
    hint: err.hint,
    stack: err.stack,
    table: err.table,
    column: err.column,
    constraint: err.constraint,
  } : null;

  // Error de base de datos PostgreSQL
  if (err.code) {
    // Constraint violations (23xxx)
    if (err.code.startsWith("23")) {
      if (err.code === "23505") {
        return errorResponse(res, "El recurso ya existe (violación de unicidad)", 409, errorDetails)
      }
      if (err.code === "23503") {
        return errorResponse(res, "Referencia inválida (violación de clave foránea)", 400, errorDetails)
      }
      if (err.code === "23502") {
        return errorResponse(res, "Valor nulo no permitido", 400, errorDetails)
      }
      // Otros errores de restricción
      return errorResponse(res, `Error de restricción en base de datos: ${err.detail || err.message}`, 400, errorDetails)
    }
    
    // Connection errors (08xxx)
    if (err.code.startsWith("08")) {
      return errorResponse(res, "Error de conexión a la base de datos", 500, errorDetails)
    }
    
    // Permission errors (42xxx)
    if (err.code === "42501") {
      return errorResponse(res, "Permisos insuficientes en la base de datos", 403, errorDetails)
    }
    
    // Undefined table/column errors
    if (err.code === "42P01" || err.code === "42703") {
      return errorResponse(res, "Error en la estructura de la base de datos", 500, errorDetails)
    }
  }

  // Error de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return errorResponse(res, "JSON inválido en el cuerpo de la petición", 400, errorDetails)
  }
  
  // Validación personalizada
  if (err.name === 'ValidationError' || (err.name === 'Error' && err.message.includes('validación'))) {
    return errorResponse(res, err.message || "Error de validación", 400, errorDetails)
  }

  // Error por defecto
  return errorResponse(res, err.message || "Error interno del servidor", err.status || 500, errorDetails)
}

/**
 * Middleware para rutas no encontradas
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const notFoundHandler = (req, res) => {
  return errorResponse(res, `Ruta ${req.originalUrl} no encontrada`, 404)
}

module.exports = {
  errorHandler,
  notFoundHandler,
}
