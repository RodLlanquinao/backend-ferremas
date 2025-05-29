/**
 * Firebase Admin SDK Configuration
 * 
 * Este archivo configura Firebase Admin SDK para autenticación del lado del servidor.
 * Permite verificar tokens, crear usuarios y gestionar la autenticación.
 * 
 * VARIABLES DE ENTORNO REQUERIDAS:
 * - FIREBASE_PROJECT_ID: ID del proyecto en Firebase
 * - FIREBASE_CLIENT_EMAIL: Email del cliente de servicio
 * - FIREBASE_PRIVATE_KEY: Clave privada del servicio (en formato JSON string escapado)
 * - FIREBASE_DATABASE_URL: URL de la base de datos de Firebase (opcional)
 */

const admin = require('firebase-admin');
const { JWT_SECRET } = require('./environment');
const fs = require('fs');
const path = require('path');

// Ruta al archivo de credenciales
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

// Verificar si existe el archivo de credenciales
let serviceAccount;
if (fs.existsSync(serviceAccountPath)) {
  try {
    serviceAccount = require(serviceAccountPath);
    console.log('✅ Archivo de credenciales de Firebase encontrado y cargado');
  } catch (error) {
    console.error('❌ Error al leer el archivo de credenciales de Firebase:', error);
  }
} else {
  console.log('⚠️ Archivo de credenciales no encontrado, se intentará crear uno');
  // Crear un archivo de credenciales a partir de variables de entorno
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
      "type": "service_account",
      "project_id": process.env.FIREBASE_PROJECT_ID,
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID || "key-id",
      "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      "client_email": process.env.FIREBASE_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_CLIENT_ID || "",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
    };
    
    // Guardar el archivo para futuras ejecuciones
    try {
      fs.writeFileSync(serviceAccountPath, JSON.stringify(serviceAccount, null, 2));
      console.log('✅ Archivo de credenciales de Firebase creado correctamente');
    } catch (error) {
      console.error('❌ Error al crear archivo de credenciales de Firebase:', error);
    }
  } else {
    console.warn('⚠️ Variables de entorno de Firebase incompletas');
  }
}

// Base de datos URL (opcional)
const databaseURL = process.env.FIREBASE_DATABASE_URL;

// Inicializar Firebase Admin solo una vez
let firebaseAdmin;

/**
 * Inicializa Firebase Admin SDK si aún no está inicializado
 */
function initializeFirebaseAdmin() {
  if (!firebaseAdmin) {
    try {
      // Comprobar si tenemos las credenciales necesarias
      if (!serviceAccount) {
        console.warn('⚠️ Credenciales de Firebase incompletas. Usando modo de desarrollo.');
        
        // Inicializar en modo de desarrollo con credenciales por defecto
        firebaseAdmin = admin.initializeApp({
          credential: admin.credential.applicationDefault()
        });
      } else {
        // Inicializar con credenciales del archivo JSON
        const firebaseConfig = {
          credential: admin.credential.cert(serviceAccount)
        };
        
        // Añadir URL de base de datos si está disponible
        if (databaseURL) {
          firebaseConfig.databaseURL = databaseURL;
        }
        
        firebaseAdmin = admin.initializeApp(firebaseConfig);
      }
      
      console.log('🔥 Firebase Admin SDK inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Firebase Admin SDK:', error);
      throw error;
    }
  }
  
  return firebaseAdmin;
}

/**
 * Verifica un token de Firebase y devuelve los datos decodificados del usuario
 * @param {string} idToken - Token de ID de Firebase a verificar
 * @returns {Promise<Object>} - Datos del usuario decodificados
 */
async function verifyFirebaseToken(idToken) {
  try {
    // Asegurar que Firebase Admin está inicializado
    initializeFirebaseAdmin();
    
    // Verificar el token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('❌ Error al verificar token de Firebase:', error);
    throw error;
  }
}

/**
 * Crea un nuevo usuario en Firebase Authentication
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @param {Object} userData - Datos adicionales del usuario (opcional)
 * @returns {Promise<Object>} - Datos del usuario creado
 */
async function createFirebaseUser(email, password, userData = {}) {
  try {
    // Asegurar que Firebase Admin está inicializado
    initializeFirebaseAdmin();
    
    // Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: userData.nombre || '',
      emailVerified: false,
      disabled: false
    });
    
    console.log(`✅ Usuario creado en Firebase con UID: ${userRecord.uid}`);
    return userRecord;
  } catch (error) {
    console.error('❌ Error al crear usuario en Firebase:', error);
    throw error;
  }
}

/**
 * Obtiene datos de un usuario desde Firebase por su UID
 * @param {string} uid - UID del usuario en Firebase
 * @returns {Promise<Object>} - Datos del usuario
 */
async function getFirebaseUser(uid) {
  try {
    // Asegurar que Firebase Admin está inicializado
    initializeFirebaseAdmin();
    
    // Obtener usuario de Firebase Auth
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error(`❌ Error al obtener usuario de Firebase con UID ${uid}:`, error);
    throw error;
  }
}

/**
 * Actualiza un usuario existente en Firebase Authentication
 * @param {string} uid - UID del usuario en Firebase
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise<Object>} - Datos del usuario actualizado
 */
async function updateFirebaseUser(uid, userData) {
  try {
    // Asegurar que Firebase Admin está inicializado
    initializeFirebaseAdmin();
    
    // Preparar datos para actualización
    const updateData = {};
    
    if (userData.email) updateData.email = userData.email;
    if (userData.nombre) updateData.displayName = userData.nombre;
    if (userData.password) updateData.password = userData.password;
    if (userData.emailVerified !== undefined) updateData.emailVerified = userData.emailVerified;
    if (userData.disabled !== undefined) updateData.disabled = userData.disabled;
    
    // Actualizar usuario en Firebase Auth
    const userRecord = await admin.auth().updateUser(uid, updateData);
    
    console.log(`✅ Usuario actualizado en Firebase con UID: ${userRecord.uid}`);
    return userRecord;
  } catch (error) {
    console.error(`❌ Error al actualizar usuario en Firebase con UID ${uid}:`, error);
    throw error;
  }
}

/**
 * Elimina un usuario de Firebase Authentication
 * @param {string} uid - UID del usuario en Firebase
 * @returns {Promise<void>}
 */
async function deleteFirebaseUser(uid) {
  try {
    // Asegurar que Firebase Admin está inicializado
    initializeFirebaseAdmin();
    
    // Eliminar usuario de Firebase Auth
    await admin.auth().deleteUser(uid);
    console.log(`✅ Usuario eliminado de Firebase con UID: ${uid}`);
  } catch (error) {
    console.error(`❌ Error al eliminar usuario de Firebase con UID ${uid}:`, error);
    throw error;
  }
}

// No inicializamos Firebase Admin automáticamente
// Se inicializará cuando se llame explícitamente a initializeFirebaseAdmin()

module.exports = {
  admin,
  initializeFirebaseAdmin,
  verifyFirebaseToken,
  createFirebaseUser,
  getFirebaseUser,
  updateFirebaseUser,
  deleteFirebaseUser
};

