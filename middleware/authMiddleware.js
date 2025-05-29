/**
 * Middleware de autenticación con Firebase
 * Proporciona verificación de tokens y protección de rutas
 */

const { verifyFirebaseToken } = require('../config/firebase');
const { errorResponse } = require('../utils/responseHelper');

/**
 * Middleware para verificar token de Firebase en la cabecera de autorización
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const verifyAuth = async (req, res, next) => {
  try {
    // Obtener el token del encabezado Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Se requiere token de autenticación', 401);
    }
    
    // Extraer el token
    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return errorResponse(res, 'Token de autenticación inválido', 401);
    }
    
    try {
      // Verificar el token con Firebase
      const decodedToken = await verifyFirebaseToken(idToken);
      
      // Añadir información del usuario al objeto request para uso posterior
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        name: decodedToken.name || '',
        role: decodedToken.role || 'cliente',
      };
      
      next();
    } catch (error) {
      console.error('Error al verificar token:', error);
      return errorResponse(res, 'Token inválido o expirado', 401);
    }
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return errorResponse(res, 'Error de autenticación', 500);
  }
};

/**
 * Middleware para verificar roles de usuario
 * @param {string[]} allowedRoles - Roles permitidos
 * @returns {Function} - Middleware para verificar roles
 */
const verifyRoles = (allowedRoles = ['admin']) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return errorResponse(res, 'Se requiere autenticación', 401);
      }
      
      const userRole = req.user.role || 'cliente';
      
      if (!allowedRoles.includes(userRole)) {
        return errorResponse(res, 'No tienes permiso para acceder a este recurso', 403);
      }
      
      next();
    } catch (error) {
      console.error('Error en verificación de roles:', error);
      return errorResponse(res, 'Error de autorización', 500);
    }
  };
};

/**
 * Middleware opcional que verifica token si está presente
 * pero no bloquea solicitudes sin token
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Sin token, continuar sin información de usuario
      req.user = null;
      return next();
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      req.user = null;
      return next();
    }
    
    try {
      const decodedToken = await verifyFirebaseToken(idToken);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        name: decodedToken.name || '',
        role: decodedToken.role || 'cliente',
      };
    } catch (error) {
      // Error al verificar token, pero no bloqueamos la solicitud
      req.user = null;
      console.warn('Token inválido pero continuando como anónimo:', error.message);
    }
    
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación opcional:', error);
    req.user = null;
    next();
  }
};

module.exports = {
  verifyAuth,
  verifyRoles,
  optionalAuth
};

