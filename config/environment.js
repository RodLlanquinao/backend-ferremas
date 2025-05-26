/**
 * Configuración de variables de entorno para Railway
 * Centraliza todas las configuraciones del sistema
 * Railway inyecta automáticamente variables de entorno en el proceso
 * 
 * VARIABLES DE ENTORNO REQUERIDAS EN RAILWAY:
 * - DATABASE_URL: URL de conexión a PostgreSQL (inyectada automáticamente)
 * - PORT: Puerto para el servidor (inyectado automáticamente)
 * - NODE_ENV: Entorno de ejecución (development, production, test)
 * - CORS_ORIGIN: Orígenes permitidos para CORS (opcional, por defecto "*")
 */

module.exports = {
  // Configuración del servidor
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "production",

  // Configuración de la base de datos - Railway provee automáticamente DATABASE_URL
  // En Railway, esta variable es inyectada automáticamente al deploy
  // Para desarrollo local, usar archivo .env con la URL de conexión
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:jvVmUJruIgzoLJOetRRRnAsTUnkQzcYQ@crossover.proxy.rlwy.net:26319/railway?sslmode=no-verify',
  
  // Configuración explícita de SSL - Usada cuando sslmode en la URL no es suficiente
  DB_SSL_ENABLED: process.env.DB_SSL_ENABLED !== 'false',
  DB_SSL_REJECT_UNAUTHORIZED: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'true',

  // Configuraciones adicionales con valores por defecto
  API_VERSION: "v1",
  MAX_REQUEST_SIZE: "10mb",

  // Configuración de CORS - valor por defecto seguro
  // En producción, recomendado especificar dominios exactos
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",

  // Configuración de logging - valor por defecto
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  
  // Railway específico - URL de la aplicación (automáticamente proporcionada)
  APP_URL: process.env.RAILWAY_STATIC_URL || `http://localhost:${process.env.PORT || 3000}`,
  
  // Railway específico - entorno de ejecución
  RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT || "development",
  
  // Configuración de tiempo de espera de la base de datos
  DB_CONNECTION_TIMEOUT: parseInt(process.env.DB_CONNECTION_TIMEOUT || "5000"),
  
  // Configuración de seguridad
  JWT_SECRET: process.env.JWT_SECRET || "ferremas_dev_secret_key_change_in_production",
  
  // NOTA: En producción, asegúrate de configurar todas las variables de entorno
  // en el dashboard de Railway, especialmente DATABASE_URL y JWT_SECRET
}
