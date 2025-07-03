/**
 * Configuración de la base de datos PostgreSQL para Railway
 * Maneja la conexión y configuración SSL para Railway
 * Implementa estrategias de resiliencia y reconexión
 */

const { Pool } = require("pg")
const { 
  DATABASE_URL, 
  DB_SSL_ENABLED, 
  DB_SSL_REJECT_UNAUTHORIZED,
  DB_CONNECTION_TIMEOUT,
  NODE_ENV
} = require("../config/environment")

/**
 * Configuración del pool de conexiones PostgreSQL
 * Utiliza la configuración de Railway con parámetros optimizados
 */
// Configurar las opciones SSL según las variables de entorno
const sslConfig = DB_SSL_ENABLED ? {
  rejectUnauthorized: false  // Siempre false para Railway
} : false;

console.log("🔒 Configuración de SSL:", sslConfig ? "Habilitado" : "Deshabilitado");
console.log("🔌 Usando conexión:", DATABASE_URL.replace(/:[^:@]*@/, ":****@")); // Ocultar contraseña

// Determinar la configuración óptima del pool según el entorno
const getPoolConfig = () => {
  // Configuración base compartida
  const baseConfig = {
    connectionString: DATABASE_URL,
    ssl: sslConfig,
    // Tiempo de espera para adquirir una conexión
    connectionTimeoutMillis: parseInt(DB_CONNECTION_TIMEOUT) || 10000,
  };
  
  // Configuración específica por entorno
  if (NODE_ENV === 'production') {
    // En producción necesitamos ser más conservadores con las conexiones
    return {
      ...baseConfig,
      max: 5,                 // Máximo de 5 conexiones simultáneas
      min: 1,                 // Mantener al menos 1 conexión activa
      idleTimeoutMillis: 30000,     // 30 segundos antes de cerrar conexiones inactivas
      allowExitOnIdle: false,       // No cerrar el pool al estar inactivo
      // Verificación periódica de conexiones
      keepAlive: true,              // Mantener conexiones activas
      keepAliveInitialDelayMillis: 10000, // Primer keepalive después de 10s
    };
  } else {
    // Configuración de desarrollo mejorada para mayor estabilidad
    return {
      ...baseConfig,
      max: 5,                 // Aumentado de 3 a 5 para más conexiones disponibles
      min: 1,                 // Mantener al menos una conexión activa
      idleTimeoutMillis: 30000,     // Reducido a 30 segundos
      // Habilitar keepAlive incluso en desarrollo para mayor estabilidad
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    };
  }
};

// Crear el pool con la configuración determinada
const poolConfig = {
  ...getPoolConfig(),
  query: (e) => {
    console.log('\n🔍 ================================');
    console.log('📝 Ejecutando consulta SQL:');
    console.log(e.text);
    if (e.values) {
      console.log('📊 Valores:', e.values);
    }
    console.log('🔍 ================================\n');
  }
};
console.log("🛢️ Configuración del pool para entorno:", NODE_ENV);
console.log(`🔄 Conexiones: max=${poolConfig.max}, min=${poolConfig.min}, timeout=${poolConfig.connectionTimeoutMillis}ms`);
console.log("🔒 Configuración de SSL:", sslConfig ? "Habilitado" : "Deshabilitado");

const pool = new Pool(poolConfig);
// Gestión avanzada de eventos en el pool
pool.on('error', (err) => {
  console.error('🔥 Error detallado del pool PostgreSQL:', {
    message: err.message,
    code: err.code,
    detail: err.detail || 'No detail',
    hint: err.hint || 'No hint',
    position: err.position,
    internalPosition: err.internalPosition,
    internalQuery: err.internalQuery,
    where: err.where,
    schema: err.schema,
    table: err.table,
    column: err.column,
    dataType: err.dataType,
    constraint: err.constraint,
    file: err.file,
    line: err.line,
    routine: err.routine
  });
  
  // Clasificar errores para mejor diagnóstico
  if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'EPIPE') {
    console.error('🔌 Error de red detectado, intentando reconexión...');
    // No lanzar para permitir reconexión automática
  } else if (err.code === '57P01') {
    console.error('💤 Conexión terminada por el administrador');
  } else if (err.code === '57P02') {
    console.error('🚫 Conexión terminada por crash del backend');
  } else if (err.code === '57P03') {
    console.error('⏱️ Conexión terminada por timeout');
  } else {
    console.error('❓ Error desconocido en el pool:', err);
  }
});

pool.on('connect', (client) => {
  console.log('🔗 Nueva conexión establecida al pool');
});

pool.on('acquire', (client) => {
  // Un cliente ha sido obtenido del pool (menos verboso)
});

pool.on('remove', (client) => {
  console.log('👋 Conexión removida del pool');
});

/**
 * Intenta ejecutar una función con reintentos
 * @param {Function} fn - Función a ejecutar
 * @param {number} maxRetries - Número máximo de reintentos
 * @param {number} delay - Retraso entre reintentos en ms
 * @returns {Promise<any>} - Resultado de la función
 */
/**
 * Intenta ejecutar una función con reintentos y backoff exponencial
 * Implementa mejor manejo de errores y logging detallado
 * 
 * @param {Function} fn - Función a ejecutar
 * @param {number} maxRetries - Número máximo de reintentos
 * @param {number} initialDelay - Retraso inicial entre reintentos en ms
 * @param {number} maxDelay - Retraso máximo entre reintentos en ms
 * @param {Function} shouldRetry - Función que determina si se debe reintentar según el error
 * @returns {Promise<any>} - Resultado de la función
 */
const withRetry = async (
  fn, 
  maxRetries = 3, 
  initialDelay = 1000,
  maxDelay = 10000,
  shouldRetry = (error) => true // Por defecto reintentar para cualquier error
) => {
  let lastError;
  let delay = initialDelay;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Determinar si debemos reintentar basado en el tipo de error
      if (!shouldRetry(error)) {
        console.log(`❌ Error no recuperable, no se reintentará: ${error.code || 'desconocido'}`);
        throw error;
      }
      
      if (attempt < maxRetries) {
        console.log(`🔄 Intento ${attempt}/${maxRetries} fallido: ${error.message}`);
        console.log(`⏱️ Reintentando en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Incrementar el delay exponencialmente con límite máximo (backoff)
        delay = Math.min(delay * 1.5, maxDelay);
      } else {
        console.log(`❌ Todos los reintentos fallidos. Último error: ${error.message}`);
      }
    }
  }
  
  throw lastError;
};

/**
 * Función para probar la conexión a la base de datos con reintentos
 * @returns {Promise<boolean>} - True si la conexión es exitosa
 */
/**
 * Función para probar la conexión a la base de datos con reintentos
 * Incluye mejor detección de errores y sugerencias de solución
 * 
 * @returns {Promise<boolean>} - True si la conexión es exitosa
 */
const testConnection = async () => {
  try {
    // Definir función para determinar si se debe reintentar basado en el tipo de error
    const shouldRetry = (error) => {
      // Errores de red son generalmente transitorios y se pueden reintentar
      const retryableCodes = ['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET', 'EPIPE'];
      // Errores de autenticación o configuración no se deberían reintentar
      const nonRetryableCodes = ['28P01', '28000', '3D000', '42P01'];
      
      if (nonRetryableCodes.includes(error.code)) {
        return false; // No reintentar errores de configuración
      }
      
      return retryableCodes.includes(error.code) || !error.code;
    };
    
    return await withRetry(
      async () => {
        const client = await pool.connect();
        try {
          // Consulta más completa para verificar la conexión
          const result = await client.query(`
            SELECT 
              current_database() as db_name,
              current_user as db_user,
              version() as db_version,
              NOW() as server_time,
              (SELECT COUNT(*) FROM pg_stat_activity) as active_connections
          `);
          
          const dbInfo = result.rows[0];
          console.log("🔗 Conexión exitosa a PostgreSQL en Railway:");
          console.log(`📊 Base de datos: ${dbInfo.db_name}`);
          console.log(`👤 Usuario: ${dbInfo.db_user}`);
          console.log(`🔢 Versión PostgreSQL: ${dbInfo.db_version.split(' ')[1]}`);
          console.log(`🕒 Tiempo del servidor: ${dbInfo.server_time}`);
          console.log(`👥 Conexiones activas: ${dbInfo.active_connections}`);
          
          // Verificar configuración SSL
          const sslResult = await client.query('SHOW ssl');
          console.log(`🔒 SSL en el servidor: ${sslResult.rows[0].ssl}`);
          
          // Verificar estado del pool
          const poolStatus = {
            total: pool.totalCount,
            idle: pool.idleCount,
            waiting: pool.waitingCount
          };
          console.log(`📈 Estado del pool: ${JSON.stringify(poolStatus)}`);
          
          return true;
        } finally {
          // Asegurarse de que el cliente siempre se libere
          client.release();
        }
      }, 
      5,          // Aumentar a 5 reintentos
      1000,       // Empezar con 1 segundo
      15000,      // Máximo 15 segundos entre reintentos
      shouldRetry // Función para determinar si se debe reintentar
    );
  } catch (error) {
    // Diagnóstico avanzado de errores
    console.error("❌ Error al conectar a la base de datos:");
    
    // Proporcionar mensajes de error más específicos y sugerencias de solución
    if (error.code === 'ECONNREFUSED') {
      console.error("🔍 Diagnóstico: Conexión rechazada");
      console.error("💡 Solución: Verifica que el host sea accesible y que el puerto esté abierto");
      console.error("📋 Pasos a seguir:");
      console.error("   1. Confirma que la URL de la base de datos sea correcta");
      console.error("   2. Verifica que el servidor PostgreSQL esté funcionando");
      console.error("   3. Asegúrate de que no haya firewalls bloqueando la conexión");
    } else if (error.code === 'ETIMEDOUT') {
      console.error("🔍 Diagnóstico: Tiempo de espera agotado");
      console.error("💡 Solución: La red podría estar lenta o el host inaccesible");
      console.error("📋 Pasos a seguir:");
      console.error("   1. Aumenta el DB_CONNECTION_TIMEOUT en las variables de entorno");
      console.error("   2. Verifica la conectividad de red");
      console.error("   3. Confirma que el servidor de base de datos no esté sobrecargado");
    } else if (error.message.includes('SSL')) {
      console.error("🔍 Diagnóstico: Error relacionado con SSL");
      console.error("💡 Solución: Ajusta la configuración SSL o desactívala para desarrollo");
      console.error("📋 Pasos a seguir:");
      console.error("   1. Agrega ?sslmode=no-verify a la URL de conexión");
      console.error("   2. Establece DB_SSL_ENABLED=false para desarrollo local");
      console.error("   3. Asegúrate que DB_SSL_REJECT_UNAUTHORIZED=false para Railway");
    } else if (error.code === '28P01') {
      console.error("🔍 Diagnóstico: Error de autenticación");
      console.error("💡 Solución: Verifica las credenciales de acceso");
      console.error("📋 Pasos a seguir:");
      console.error("   1. Confirma que el usuario y contraseña sean correctos");
      console.error("   2. Verifica que el usuario tenga permisos de acceso");
    } else if (error.code === '3D000') {
      console.error("🔍 Diagnóstico: Base de datos inexistente");
      console.error("💡 Solución: Verifica el nombre de la base de datos");
      console.error("📋 Pasos a seguir:");
      console.error("   1. Confirma que la base de datos exista en el servidor");
      console.error("   2. Crea la base de datos si es necesario");
    } else {
      console.error(`🔍 Diagnóstico: Error desconocido (${error.code || 'sin código'})`);
      console.error(`💡 Mensaje: ${error.message}`);
      console.error("📋 Pasos a seguir:");
      console.error("   1. Revisa los logs del servidor de base de datos");
      console.error("   2. Verifica la configuración general de la conexión");
    }
    
    console.error("🔍 Error detallado:", error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection,
}
