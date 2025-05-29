/**
 * FERREMAS Backend API
 * Servidor principal de la aplicación
 *
 * @author FERREMAS Team
 * @version 1.0.0
 */

// Load environment variables from .env file first
require('dotenv').config();
console.log('Environment variables loaded:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- CORS_ORIGIN:', process.env.CORS_ORIGIN);

const express = require("express")
const cors = require("cors")

// Importar configuraciones
const { PORT, NODE_ENV, CORS_ORIGIN, MAX_REQUEST_SIZE } = require("./config/environment")
const { testConnection } = require("./config/database")
const { initializeFirebaseAdmin } = require("./config/firebase")

// Importar middleware
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler")

// Importar rutas
const productosRoutes = require("./routes/productos.routes")
const usuariosRoutes = require("./routes/usuarios.routes")
const pedidosRoutes = require("./routes/pedidos.routes")
const contactoRoutes = require("./routes/contacto.routes")
const webpayRoutes = require("./routes/webpay.routes")
const authRoutes = require("./routes/auth.routes")
const branchRequestsRoutes = require("./routes/branchRequests.routes")

// Crear aplicación Express
const app = express()

/**
 * Configuración de middleware global
 */
// CORS - Permitir peticiones desde diferentes orígenes
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
)

// Parser de JSON con límite de tamaño
app.use(express.json({ limit: MAX_REQUEST_SIZE }))

// Parser de URL encoded
app.use(express.urlencoded({ extended: true, limit: MAX_REQUEST_SIZE }))

// Logging de peticiones en desarrollo
if (NODE_ENV === "development") {
  app.use((req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    
    console.log('\n🔄 ================================');
    console.log(`📝 Nueva solicitud - ${timestamp}`);
    console.log(`🛣️  Ruta: ${req.method} ${req.path}`);
    console.log(`📦 Cuerpo:`, req.body);
    console.log(`🔍 Parámetros:`, req.params);
    console.log(`❓ Query:`, req.query);
    console.log('🔄 ================================\n');

    // Capturar la finalización de la respuesta
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log('\n✅ ================================');
      console.log(`📝 Respuesta enviada - ${new Date().toISOString()}`);
      console.log(`⏱️  Duración: ${duration}ms`);
      console.log(`📊 Estado: ${res.statusCode}`);
      console.log('✅ ================================\n');
    });

    next();
  });
}

/**
 * Configuración de rutas
 */
// Ruta de salud del servidor
app.get("/", (req, res) => {
  res.json({
    message: "¡Hola FERREMAS Backend!",
    version: "1.0.0",
    status: "OK",
    timestamp: new Date().toISOString(),
  })
})

// Ruta de health check
app.get("/health", async (req, res) => {
  const dbStatus = await testConnection()
  res.json({
    status: "OK",
    database: dbStatus ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Rutas de la API
app.use("/productos", productosRoutes)
app.use("/usuarios", usuariosRoutes)
app.use("/pedidos", pedidosRoutes)
app.use("/contacto", contactoRoutes)
app.use("/api/webpay", webpayRoutes)
app.use("/auth", authRoutes)
app.use("/branch-requests", branchRequestsRoutes)

/**
 * Middleware de manejo de errores
 */
// Manejo de rutas no encontradas
app.use(notFoundHandler)

// Manejo global de errores
app.use(errorHandler)

/**
 * Inicialización del servidor
 */
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    console.log("🔄 Probando conexión a la base de datos...")
    const dbConnected = await testConnection()

    if (!dbConnected) {
      console.error("❌ No se pudo conectar a la base de datos")
      process.exit(1)
    }
    
    // Inicializar Firebase Admin SDK
    try {
      console.log("🔄 Inicializando Firebase Admin SDK...")
      initializeFirebaseAdmin()
      console.log("✅ Firebase Admin SDK inicializado correctamente")
    } catch (error) {
      console.warn("⚠️ Error al inicializar Firebase Admin SDK:", error.message)
      console.warn("⚠️ La autenticación con Firebase podría no funcionar correctamente")
      // No detenemos el servidor, pero advertimos del problema
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log("🚀 ================================")
      console.log(`🚀 FERREMAS Backend iniciado`)
      console.log(`🚀 Puerto: ${PORT}`)
      console.log(`🚀 Entorno: ${NODE_ENV}`)
      console.log(`🚀 URL: http://localhost:${PORT}`)
      console.log(`🔐 Autenticación: Firebase Authentication`)
      console.log("🚀 ================================")
    })
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error)
    process.exit(1)
  }
}

// Manejo de errores no capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason)
  process.exit(1)
})

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error)
  process.exit(1)
})

// Iniciar el servidor
startServer()
module.exports = app
