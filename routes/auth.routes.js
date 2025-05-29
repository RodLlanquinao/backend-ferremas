/**
 * Rutas de Autenticación con Firebase
 * Define todas las rutas relacionadas con autenticación de usuarios
 */

const express = require("express");
const router = express.Router();
const { createFirebaseUser, verifyFirebaseToken } = require("../config/firebase");
const Usuario = require("../models/Usuario");
const { verifyAuth } = require("../middleware/authMiddleware");
const { successResponse, errorResponse } = require("../utils/responseHelper");

/**
 * Validador para datos de autenticación
 */
const validateAuthData = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push("Email válido es requerido");
  }

  if (!password || password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }

  if (errors.length > 0) {
    return errorResponse(res, "Errores de validación", 400, errors);
  }

  next();
};

/**
 * Función auxiliar para validar formato de email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * @route   POST /auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Público
 */
router.post("/register", validateAuthData, async (req, res) => {
  try {
    const { email, password, nombre, rol = "cliente" } = req.body;

    // Verificar si el email ya existe en nuestra base de datos
    const existingUser = await Usuario.getByEmail(email);
    if (existingUser) {
      return errorResponse(res, "Ya existe un usuario con ese email", 409);
    }

    // Crear usuario en Firebase
    const firebaseUser = await createFirebaseUser(email, password, { nombre });
    
    // Crear usuario en nuestra base de datos con el UID de Firebase
    const usuario = await Usuario.create({
      nombre,
      email,
      rol,
      firebase_uid: firebaseUser.uid,
      email_verified: firebaseUser.emailVerified || false,
      provider: "email"
    });

    // No devolver la contraseña en la respuesta
    return successResponse(
      res, 
      { 
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        uid: firebaseUser.uid
      }, 
      "Usuario registrado exitosamente", 
      201
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    
    // Manejar errores específicos de Firebase
    if (error.code === 'auth/email-already-exists') {
      return errorResponse(res, "El email ya está registrado en Firebase", 409);
    } else if (error.code === 'auth/invalid-email') {
      return errorResponse(res, "El formato de email es inválido", 400);
    } else if (error.code === 'auth/weak-password') {
      return errorResponse(res, "La contraseña es demasiado débil", 400);
    }
    
    return errorResponse(res, "Error al registrar usuario", 500);
  }
});

/**
 * @route   POST /auth/login
 * @desc    Iniciar sesión de usuario
 * @access  Público
 */
router.post("/login", validateAuthData, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Aquí normalmente usaríamos firebase.auth().signInWithEmailAndPassword
    // pero eso es para el cliente. En el servidor, no podemos iniciar sesión directamente.
    // En cambio, responderemos con información para que el cliente pueda hacer login.
    
    // Verificar si el usuario existe en nuestra base de datos
    const usuario = await Usuario.getByEmail(email);
    if (!usuario) {
      return errorResponse(res, "Credenciales inválidas", 401);
    }

    // Enviar información para login
    return successResponse(
      res, 
      { 
        message: "Usa Firebase Authentication en el cliente para iniciar sesión",
        email: email,
        // No enviamos contraseña ni tokens por seguridad
      }, 
      "Información de login enviada"
    );
  } catch (error) {
    console.error("Error en inicio de sesión:", error);
    return errorResponse(res, "Error al iniciar sesión", 500);
  }
});

/**
 * @route   POST /auth/verify-token
 * @desc    Verificar token de Firebase
 * @access  Público
 */
router.post("/verify-token", async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return errorResponse(res, "Token no proporcionado", 400);
    }
    
    try {
      // Verificar token con Firebase
      const decodedToken = await verifyFirebaseToken(idToken);
      
      // Buscar el usuario en nuestra base de datos
      let usuario = await Usuario.getByFirebaseUid(decodedToken.uid);
      
      // Si no existe en nuestra base pero sí en Firebase, lo creamos
      if (!usuario) {
        usuario = await Usuario.create({
          nombre: decodedToken.name || decodedToken.email.split('@')[0],
          email: decodedToken.email,
          rol: "cliente", // Rol por defecto
          firebase_uid: decodedToken.uid,
          email_verified: decodedToken.email_verified || false,
          provider: decodedToken.firebase.sign_in_provider || "email"
        });
      } else {
        // Actualizar el último login
        await Usuario.updateLastLogin(usuario.id);
      }
      
      return successResponse(
        res, 
        {
          user: {
            id: usuario.id,
            uid: decodedToken.uid,
            email: decodedToken.email,
            nombre: usuario.nombre,
            rol: usuario.rol,
            emailVerified: decodedToken.email_verified || false
          },
          // No incluir el token en la respuesta por seguridad
        }, 
        "Token verificado correctamente"
      );
    } catch (error) {
      console.error("Error al verificar token:", error);
      return errorResponse(res, "Token inválido o expirado", 401);
    }
  } catch (error) {
    console.error("Error en verificación de token:", error);
    return errorResponse(res, "Error al verificar token", 500);
  }
});

/**
 * @route   GET /auth/me
 * @desc    Obtener información del usuario autenticado
 * @access  Privado (requiere autenticación)
 */
router.get("/me", verifyAuth, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;
    
    // Buscar usuario en nuestra base de datos
    const usuario = await Usuario.getByFirebaseUid(firebaseUid);
    
    if (!usuario) {
      return errorResponse(res, "Usuario no encontrado", 404);
    }
    
    return successResponse(
      res, 
      {
        id: usuario.id,
        uid: firebaseUid,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        emailVerified: req.user.emailVerified || false
      }, 
      "Información del usuario obtenida exitosamente"
    );
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);
    return errorResponse(res, "Error al obtener información del usuario", 500);
  }
});

/**
 * @route   GET /auth/status
 * @desc    Verificar el estado de la configuración de Firebase
 * @access  Público (útil para diagnóstico)
 */
router.get("/status", async (req, res) => {
  try {
    // Importar el módulo admin directamente para acceder a más información
    const { admin } = require("../config/firebase");
    
    // Verificar si Firebase está inicializado correctamente
    const isInitialized = admin.apps.length > 0;
    
    if (!isInitialized) {
      return errorResponse(res, "Firebase Admin SDK no está inicializado", 500);
    }
    
    // Obtener información del proyecto de Firebase (segura para compartir)
    const app = admin.app();
    const projectId = app.options.projectId || process.env.FIREBASE_PROJECT_ID || 'desconocido';
    
    // Verificar si hay conexión a la base de datos de Firebase (si está configurada)
    let databaseStatus = 'No configurado';
    if (app.options.databaseURL) {
      try {
        // Intento simple de conexión a Firebase Realtime Database
        const testRef = admin.database().ref('test_connection');
        await testRef.once('value');
        databaseStatus = 'Conectado';
      } catch (dbError) {
        console.error("Error al probar conexión a Firebase Database:", dbError);
        databaseStatus = `Error: ${dbError.code || dbError.message}`;
      }
    }
    
    // Verificar auth
    let authStatus = 'Desconocido';
    try {
      // Intento simple de operación de Auth
      await admin.auth().listUsers(1);
      authStatus = 'Funcional';
    } catch (authError) {
      console.error("Error al probar Firebase Auth:", authError);
      authStatus = `Error: ${authError.code || authError.message}`;
    }
    
    return successResponse(
      res, 
      {
        status: "Firebase Admin SDK inicializado correctamente",
        initialized: isInitialized,
        projectId: projectId,
        environment: process.env.NODE_ENV,
        auth: {
          status: authStatus
        },
        database: {
          configured: !!app.options.databaseURL,
          status: databaseStatus
        },
        config: {
          hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
          hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
          hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
          hasDatabaseUrl: !!process.env.FIREBASE_DATABASE_URL
        }
      }, 
      "Estado de Firebase obtenido exitosamente"
    );
  } catch (error) {
    console.error("Error al verificar estado de Firebase:", error);
    return errorResponse(
      res, 
      `Error al verificar estado de Firebase: ${error.message}`, 
      500,
      { stack: process.env.NODE_ENV === 'development' ? error.stack : undefined }
    );
  }
});

module.exports = router;

