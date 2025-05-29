/**
 * Script para generar tokens de prueba para Firebase Authentication
 * 
 * Este script crea un usuario de prueba en Firebase y genera tokens para probar la API
 * sin necesidad de un frontend. Solo para uso en desarrollo.
 * 
 * Usa el Firebase Client SDK para generar tokens ID directamente.
 * 
 * Uso: node scripts/generate-test-token.js
 */

// Importar Firebase Client SDK
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
require('dotenv').config();

// Configuración de Firebase Client SDK
const firebaseConfig = {
  apiKey: "AIzaSyDxUSQ1UzDGNA-P3a2F_lLaNPIuiZsqckY",
  authDomain: "ferremas-backend-a1e13.firebaseapp.com",
  projectId: "ferremas-backend-a1e13",
  storageBucket: "ferremas-backend-a1e13.firebasestorage.app",
  messagingSenderId: "1051361101439",
  appId: "1:1051361101439:web:d5ce173cd519e3fa66a14a",
  measurementId: "G-DGQ6F8RK80"
};

// Inicializar Firebase Client
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Datos de prueba
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  displayName: 'Test User'
};

/**
 * Función principal para generar tokens de prueba
 */
async function generateTestToken() {
  try {
    console.log('🔥 Generando token de ID para Firebase Authentication...\n');
    
    let userCredential;
    
    try {
      // Intentar crear el usuario primero
      console.log('⚠️ Intentando crear nuevo usuario...');
      userCredential = await createUserWithEmailAndPassword(auth, TEST_USER.email, TEST_USER.password);
      console.log('✅ Usuario creado exitosamente');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // Si el usuario ya existe, intentar iniciar sesión
        console.log('📝 Usuario ya existe, intentando iniciar sesión...');
        userCredential = await signInWithEmailAndPassword(auth, TEST_USER.email, TEST_USER.password);
        console.log('✅ Inicio de sesión exitoso');
      } else {
        console.error('❌ Error al crear/autenticar usuario:', error.code);
        throw error;
      }
    }

    // Obtener el token ID
    const idToken = await userCredential.user.getIdToken();
    
    console.log(`\n✅ Usuario autenticado: ${userCredential.user.email}`);
    console.log(`UID: ${userCredential.user.uid}`);
    
    console.log('\n🔑 Token ID generado:');
    console.log(idToken);
    
    console.log('\n⚙️ Para usar en Postman:');
    console.log('- Copia este token y añádelo a la variable de entorno "firebase_id_token"');
    console.log('- O usa este header en tus peticiones: Authorization: Bearer ' + idToken);
    
    console.log('\n📝 NOTAS IMPORTANTES:');
    console.log('- Este token expira después de 1 hora');
    console.log('- Puedes verificarlo en /auth/verify-token');
    
    console.log('\n📋 Información para pruebas:');
    console.log('- Email:', TEST_USER.email);
    console.log('- Password:', TEST_USER.password);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
generateTestToken();

