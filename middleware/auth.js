/**
 * Middleware de Autenticación
 * Verifica tokens de Firebase para proteger rutas
 */

const { admin, getFirebaseAdmin } = require('../config/firebase');

/**
 * Middleware para verificar autenticación con Firebase
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const authenticate = async (req, res, next) => {
  try {
    // Obtener el token del header de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado',
        error: 'Token de autenticación no proporcionado'
      });
    }
    
    // Extraer el token
    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado',
        error: 'Token de autenticación inválido'
      });
    }
    
    // Modo de prueba para desarrollo
    if (process.env.NODE_ENV === 'development' && idToken === 'test-token-123') {
      console.log('🧪 Usando modo de prueba con token de desarrollo');
      
      // Configurar usuario de prueba con ID numérico compatible con la base de datos
      req.user = {
        id: 1, // ID numérico en lugar de string
        email: 'test@ferremas.com',
        emailVerified: true,
        role: 'admin', // Asegurarse que coincida con los roles en la base de datos
        name: 'Usuario de Prueba'
      };
      
      console.log(`👤 Usuario de prueba: ${req.user.email} (${req.user.id})`);
      
      // Continuar con la siguiente función de middleware
      return next();
    }
    
    // Verificar el token con Firebase para peticiones regulares
    const decodedToken = await getFirebaseAdmin().auth().verifyIdToken(idToken);
    
    // Añadir información del usuario al objeto request
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      role: decodedToken.role || 'user',
      name: decodedToken.name || decodedToken.email
    };
    
    // Log de autenticación exitosa en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`👤 Usuario autenticado: ${req.user.email} (${req.user.id})`);
    }
    
    // Continuar con la siguiente función de middleware
    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    
    // Manejar diferentes tipos de errores
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'No autorizado',
        error: 'Token de autenticación expirado'
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'No autorizado',
        error: 'Token de autenticación revocado'
      });
    }
    
    // Error genérico para otros casos
    return res.status(401).json({
      success: false,
      message: 'No autorizado',
      error: 'Error de autenticación'
    });
  }
};

/**
 * Middleware para verificar rol de usuario
 * @param {string|Array} requiredRoles - Rol o roles requeridos para acceder
 * @returns {Function} Middleware para verificar roles
 */
const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado',
          error: 'Usuario no autenticado'
        });
      }
      
      // Convertir a array si es un string
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      
      // Verificar si el usuario tiene alguno de los roles requeridos
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Acceso denegado',
          error: 'No tienes permiso para realizar esta acción'
        });
      }
      
      // Si tiene el rol adecuado, continuar
      next();
    } catch (error) {
      console.error("Error al verificar rol:", error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: 'Error al verificar permisos'
      });
    }
  };
};

/**
 * Middleware opcional para permitir tanto autenticados como no autenticados
 * Si el usuario está autenticado, agrega la información de usuario, si no, continúa
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función next de Express
 */
const optionalAuth = async (req, res, next) => {
  try {
    // Obtener el token del header de autorización
    const authHeader = req.headers.authorization;
    
    // Si no hay token, continuar sin autenticar
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    // Extraer el token
    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return next();
    }
    
    // Verificar el token con Firebase
    const decodedToken = await getFirebaseAdmin().auth().verifyIdToken(idToken);
    
    // Añadir información del usuario al objeto request
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      role: decodedToken.role || 'user',
      name: decodedToken.name || decodedToken.email
    };
    
    // Continuar con la siguiente función de middleware
    next();
  } catch (error) {
    // En caso de error, solo continuar sin autenticar
    console.warn("Error en autenticación opcional:", error.message);
    next();
  }
};

module.exports = {
  authenticate,
  checkRole,
  optionalAuth
};

