/**
 * Middleware de Validación
 * Proporciona funciones para validar datos de entrada en las peticiones
 */

const { errorResponse } = require("../utils/responseHelper");

/**
 * Función para validar si un valor es un número válido
 * @param {*} value - Valor a validar
 * @param {boolean} allowZero - Si se permite que el valor sea cero
 * @returns {boolean} - true si es válido, false si no
 */
const isValidNumber = (value, allowZero = true) => {
  if (value === undefined || value === null) return false;
  
  const num = Number(value);
  if (isNaN(num)) return false;
  
  if (!allowZero && num === 0) return false;
  
  return true;
};

/**
 * Función para validar si un string tiene contenido válido
 * @param {string} value - String a validar
 * @param {number} minLength - Longitud mínima permitida
 * @returns {boolean} - true si es válido, false si no
 */
const isValidString = (value, minLength = 1) => {
  if (value === undefined || value === null) return false;
  
  return typeof value === 'string' && value.trim().length >= minLength;
};

/**
 * Función para validar un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido, false si no
 */
const isValidEmail = (email) => {
  if (!isValidString(email)) return false;
  
  // Expresión regular para validar emails
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Función de respuesta para errores de validación
 * @param {Object} res - Objeto response de Express
 * @param {Array} errors - Array de mensajes de error
 * @returns {Object} - Respuesta JSON con errores
 */
const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Error de validación',
    errors: Array.isArray(errors) ? errors : [errors]
  });
};

/**
 * Middleware para validar datos de producto
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const validateProducto = (req, res, next) => {
  const { nombre, precio, categoria } = req.body;
  
  const errors = [];
  
  if (!isValidString(nombre)) {
    errors.push('El nombre del producto es obligatorio');
  }
  
  if (!isValidNumber(precio)) {
    errors.push('El precio debe ser un número válido');
  } else if (Number(precio) < 0) {
    errors.push('El precio no puede ser negativo');
  }
  
  if (!isValidString(categoria)) {
    errors.push('La categoría es obligatoria');
  }
  
  // Validar campos de bodega si están presentes
  if (req.body.stock_bodega !== undefined && !isValidNumber(req.body.stock_bodega)) {
    errors.push('El stock de bodega debe ser un número válido');
  }
  
  if (req.body.stock_minimo !== undefined && !isValidNumber(req.body.stock_minimo)) {
    errors.push('El stock mínimo debe ser un número válido');
  }
  
  if (req.body.stock !== undefined && !isValidNumber(req.body.stock)) {
    errors.push('El stock debe ser un número válido');
  }
  
  if (errors.length > 0) {
    return validationErrorResponse(res, errors);
  }
  
  next();
};

/**
 * Middleware para validar datos de solicitud de productos
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const validateRequestData = (req, res, next) => {
  const { sucursal_id, producto_id, cantidad } = req.body;
  
  const errors = [];
  
  if (!isValidNumber(sucursal_id)) {
    errors.push('La sucursal es obligatoria');
  }
  
  if (!isValidNumber(producto_id)) {
    errors.push('El producto es obligatorio');
  }
  
  if (!isValidNumber(cantidad, false)) {
    errors.push('La cantidad debe ser un número mayor a cero');
  }
  
  if (errors.length > 0) {
    return validationErrorResponse(res, errors);
  }
  
  next();
};

/**
 * Middleware para validar ID en parámetros
 * @param {string} paramName - Nombre del parámetro que contiene el ID
 * @returns {Function} Middleware para validar ID
 */
const validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id || !isValidNumber(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido',
        error: `El ${paramName} debe ser un número válido`
      });
    }
    
    next();
  };
};

/**
 * Middleware para validar datos de contacto
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const validateContacto = (req, res, next) => {
  const { nombre, email, mensaje } = req.body;
  
  const errors = [];
  
  if (!isValidString(nombre, 2)) {
    errors.push('El nombre es obligatorio (mínimo 2 caracteres)');
  }
  
  if (!isValidEmail(email)) {
    errors.push('El email no es válido');
  }
  
  if (!isValidString(mensaje, 10)) {
    errors.push('El mensaje es obligatorio (mínimo 10 caracteres)');
  }
  
  if (errors.length > 0) {
    return validationErrorResponse(res, errors);
  }
  
  next();
};

/**
 * Validador para usuarios
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const validateUsuario = (req, res, next) => {
  const { nombre, email } = req.body;
  const errors = [];

  if (!isValidString(nombre)) {
    errors.push("El nombre del usuario es requerido");
  }

  if (!isValidEmail(email)) {
    errors.push("Email válido es requerido");
  }

  if (errors.length > 0) {
    return validationErrorResponse(res, errors);
  }

  next();
};

/**
 * Validador para pedidos
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const validatePedido = (req, res, next) => {
  const { producto_id, usuario_id, cantidad } = req.body;
  const errors = [];

  if (!isValidNumber(producto_id)) {
    errors.push("ID de producto válido es requerido");
  }

  if (!isValidNumber(usuario_id)) {
    errors.push("ID de usuario válido es requerido");
  }

  if (!isValidNumber(cantidad, false)) {
    errors.push("La cantidad debe ser un número mayor a 0");
  }

  if (errors.length > 0) {
    return validationErrorResponse(res, errors);
  }

  next();
};

module.exports = {
  validateProducto,
  validateRequestData,
  validateId,
  validateContacto,
  validateUsuario,
  validatePedido,
  validationErrorResponse,
  // Exportar utilidades de validación para uso en otros lugares
  isValidNumber,
  isValidString,
  isValidEmail
};
