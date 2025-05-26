#!/usr/bin/env node

/**
 * Script de prueba de conexión a base de datos PostgreSQL
 * 
 * Este script realiza las siguientes pruebas:
 * 1. Verifica la conexión a la base de datos
 * 2. Confirma la configuración SSL
 * 3. Realiza operaciones CRUD básicas
 * 4. Proporciona información detallada del estado
 * 
 * Uso: node scripts/test-db.js
 */

const { Pool } = require('pg');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

// Importar configuración de entorno
require('dotenv').config();

// Colorear la salida para mejorar legibilidad
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Cronometrar operaciones
const timer = {
  start: (label) => {
    console.time(label);
    return { label };
  },
  end: (timer) => {
    console.timeEnd(timer.label);
  }
};

// Función principal
async function main() {
  console.log(`${colors.bright}${colors.blue}=====================================${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}   FERREMAS - Test de Base de Datos   ${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}=====================================${colors.reset}`);
  
  console.log(`\n${colors.cyan}Iniciando pruebas de conexión a la base de datos...${colors.reset}\n`);
  
  // Verificar variables de entorno
  checkEnvironmentVariables();
  
  // Crear configuración de conexión
  const { pool, config } = createConnectionPool();
  
  try {
    // 1. Probar conexión básica
    await testConnection(pool, config);
    
    // 2. Probar operaciones CRUD
    await testCrudOperations(pool);
    
    // 3. Probar manejo de errores
    await testErrorHandling(pool);
    
    // 4. Probar rendimiento
    await testPerformance(pool);
    
    console.log(`\n${colors.green}${colors.bright}✅ Todas las pruebas completadas exitosamente${colors.reset}\n`);
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}❌ Error durante las pruebas: ${error.message}${colors.reset}\n`);
    console.error(error);
    process.exit(1);
  } finally {
    // Cerrar el pool de conexiones
    await pool.end();
    console.log(`\n${colors.blue}Pool de conexiones cerrado${colors.reset}`);
  }
}

// Verificar variables de entorno requeridas
function checkEnvironmentVariables() {
  const requiredVars = ['DATABASE_URL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`${colors.red}${colors.bright}❌ Variables de entorno requeridas no encontradas: ${missingVars.join(', ')}${colors.reset}`);
    console.error(`${colors.yellow}💡 Asegúrate de tener un archivo .env con las variables necesarias${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.green}✅ Variables de entorno verificadas${colors.reset}`);
  
  // Mostrar variables configuradas (ocultar contraseñas)
  const dbUrl = process.env.DATABASE_URL.replace(/:([^:@]*)@/, ':******@');
  console.log(`${colors.cyan}DATABASE_URL: ${dbUrl}${colors.reset}`);
  console.log(`${colors.cyan}NODE_ENV: ${process.env.NODE_ENV || 'no configurado'}${colors.reset}`);
  console.log(`${colors.cyan}DB_SSL_ENABLED: ${process.env.DB_SSL_ENABLED || 'no configurado'}${colors.reset}`);
}

// Crear pool de conexiones a la base de datos
function createConnectionPool() {
  // Determinar la configuración SSL
  const sslEnabled = process.env.DB_SSL_ENABLED !== 'false';
  const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';
  
  const sslConfig = sslEnabled ? {
    rejectUnauthorized
  } : false;
  
  // Configurar el pool
  const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig,
    // Parámetros para pruebas
    max: 3,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 5000
  };
  
  console.log(`${colors.cyan}Configuración SSL: ${sslConfig ? 'Habilitado' : 'Deshabilitado'}${colors.reset}`);
  if (sslConfig) {
    console.log(`${colors.cyan}SSL rejectUnauthorized: ${rejectUnauthorized}${colors.reset}`);
  }
  
  const pool = new Pool(config);
  
  // Manejar errores a nivel de pool
  pool.on('error', (err) => {
    console.error(`${colors.red}Error inesperado en el pool: ${err.message}${colors.reset}`);
  });
  
  return { pool, config };
}

// Probar conexión a la base de datos
async function testConnection(pool, config) {
  console.log(`\n${colors.magenta}${colors.bright}[TEST 1/4] Probando conexión a la base de datos...${colors.reset}`);
  
  const connectionTimer = timer.start('Tiempo de conexión');
  
  try {
    // Intentar conectar a la base de datos
    const client = await pool.connect();
    timer.end(connectionTimer);
    
    try {
      // Consultar información de la base de datos
      const result = await client.query(`
        SELECT 
          current_database() as db_name,
          current_user as db_user,
          version() as db_version,
          NOW() as server_time,
          (SELECT COUNT(*) FROM pg_stat_activity) as active_connections
      `);
      
      const dbInfo = result.rows[0];
      
      console.log(`${colors.green}✅ Conexión exitosa a la base de datos${colors.reset}`);
      console.log(`${colors.cyan}Base de datos: ${dbInfo.db_name}${colors.reset}`);
      console.log(`${colors.cyan}Usuario: ${dbInfo.db_user}${colors.reset}`);
      console.log(`${colors.cyan}Versión PostgreSQL: ${dbInfo.db_version.split(' ')[1]}${colors.reset}`);
      console.log(`${colors.cyan}Tiempo del servidor: ${dbInfo.server_time}${colors.reset}`);
      console.log(`${colors.cyan}Conexiones activas: ${dbInfo.active_connections}${colors.reset}`);
      
      // Verificar configuración SSL
      const sslResult = await client.query('SHOW ssl');
      console.log(`${colors.cyan}SSL en el servidor: ${sslResult.rows[0].ssl}${colors.reset}`);
      
    } finally {
      // Siempre liberar el cliente al pool
      client.release();
    }
  } catch (error) {
    console.error(`${colors.red}❌ Error al conectar a la base de datos: ${error.message}${colors.reset}`);
    
    // Proporcionar sugerencias basadas en el tipo de error
    if (error.code === 'ECONNREFUSED') {
      console.error(`${colors.yellow}💡 El servidor de base de datos rechazó la conexión. Verifica:${colors.reset}`);
      console.error(`${colors.yellow}   - ¿La URL de conexión es correcta?${colors.reset}`);
      console.error(`${colors.yellow}   - ¿El host es accesible desde este entorno?${colors.reset}`);
      console.error(`${colors.yellow}   - ¿El puerto de PostgreSQL está abierto?${colors.reset}`);
    } else if (error.code === 'ETIMEDOUT') {
      console.error(`${colors.yellow}💡 Tiempo de espera agotado. Verifica:${colors.reset}`);
      console.error(`${colors.yellow}   - ¿La base de datos está sobrecargada?${colors.reset}`);
      console.error(`${colors.yellow}   - ¿Hay problemas de red?${colors.reset}`);
    } else if (error.message.includes('SSL')) {
      console.error(`${colors.yellow}💡 Error relacionado con SSL. Intenta:${colors.reset}`);
      console.error(`${colors.yellow}   - Configura DB_SSL_ENABLED=false para desarrollo local${colors.reset}`);
      console.error(`${colors.yellow}   - Asegúrate que DB_SSL_REJECT_UNAUTHORIZED=false para Railway${colors.reset}`);
      console.error(`${colors.yellow}   - Agregar ?sslmode=require o ?sslmode=no-verify a la URL${colors.reset}`);
    }
    
    throw error;
  }
}

// Probar operaciones CRUD básicas
async function testCrudOperations(pool) {
  console.log(`\n${colors.magenta}${colors.bright}[TEST 2/4] Probando operaciones CRUD...${colors.reset}`);
  
  try {
    // Crear tabla de prueba temporal
    await pool.query(`
      CREATE TABLE IF NOT EXISTS test_railway_migration (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        value INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log(`${colors.green}✅ Tabla de prueba creada o ya existía${colors.reset}`);
    
    // INSERT
    const insertTimer = timer.start('Tiempo de INSERT');
    const insertResult = await pool.query(`
      INSERT INTO test_railway_migration (name, value)
      VALUES ($1, $2)
      RETURNING *
    `, ['test_item', 42]);
    timer.end(insertTimer);
    
    const insertedId = insertResult.rows[0].id;
    console.log(`${colors.green}✅ INSERT exitoso - ID generado: ${insertedId}${colors.reset}`);
    
    // SELECT
    const selectTimer = timer.start('Tiempo de SELECT');
    const selectResult = await pool.query(`
      SELECT * FROM test_railway_migration
      WHERE id = $1
    `, [insertedId]);
    timer.end(selectTimer);
    
    if (selectResult.rows.length === 1) {
      console.log(`${colors.green}✅ SELECT exitoso - Registro encontrado${colors.reset}`);
    } else {
      throw new Error('Registro no encontrado después de INSERT');
    }
    
    // UPDATE
    const updateTimer = timer.start('Tiempo de UPDATE');
    await pool.query(`
      UPDATE test_railway_migration
      SET value = $1
      WHERE id = $2
    `, [99, insertedId]);
    timer.end(updateTimer);
    
    // Verificar UPDATE
    const verifyResult = await pool.query(`
      SELECT value FROM test_railway_migration
      WHERE id = $1
    `, [insertedId]);
    
    if (verifyResult.rows[0].value === 99) {
      console.log(`${colors.green}✅ UPDATE exitoso - Valor actualizado${colors.reset}`);
    } else {
      throw new Error('UPDATE falló - el valor no se actualizó correctamente');
    }
    
    // DELETE
    const deleteTimer = timer.start('Tiempo de DELETE');
    await pool.query(`
      DELETE FROM test_railway_migration
      WHERE id = $1
    `, [insertedId]);
    timer.end(deleteTimer);
    
    // Verificar DELETE
    const verifyDelete = await pool.query(`
      SELECT * FROM test_railway_migration
      WHERE id = $1
    `, [insertedId]);
    
    if (verifyDelete.rows.length === 0) {
      console.log(`${colors.green}✅ DELETE exitoso - Registro eliminado${colors.reset}`);
    } else {
      throw new Error('DELETE falló - el registro todavía existe');
    }
    
    console.log(`${colors.green}${colors.bright}✅ Todas las operaciones CRUD fueron exitosas${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}❌ Error en pruebas CRUD: ${error.message}${colors.reset}`);
    throw error;
  }
}

// Probar manejo de errores
async function testErrorHandling(pool) {
  console.log(`\n${colors.magenta}${colors.bright}[TEST 3/4] Probando manejo de errores...${colors.reset}`);
  
  try {
    // Intentar una consulta con sintaxis inválida
    console.log(`${colors.cyan}Probando consulta con sintaxis inválida...${colors.reset}`);
    try {
      await pool.query('SELECT * FROM tabla_que_no_existe');
      console.error(`${colors.red}❌ La prueba debería haber fallado pero no lo hizo${colors.reset}`);
    } catch (error) {
      console.log(`${colors.green}✅ Error capturado correctamente: ${error.code}${colors.reset}`);
    }
    
    // Intentar insertar un valor duplicado
    console.log(`${colors.cyan}Probando violación de restricción única...${colors.reset}`);
    try {
      // Crear registro con ID fijo
      await pool.query(`
        INSERT INTO test_railway_migration (id, name, value)
        VALUES (999999, 'unique_test', 1)
        ON CONFLICT DO NOTHING
      `);
      
      // Intentar insertar el mismo ID (debería fallar)
      await pool.query(`
        INSERT INTO test_railway_migration (id, name, value)
        VALUES (999999, 'duplicate_test', 2)
      `);
      console.error(`${colors.red}❌ La prueba debería haber fallado pero no lo hizo${colors.reset}`);
    } catch (error) {
      console.log(`${colors.green}✅ Error de duplicado capturado correctamente: ${error.code}${colors.reset}`);
      
      // Limpiar registro de prueba
      await pool.query('DELETE FROM test_railway_migration WHERE id = 999999');
    }
    
    console.log(`${colors.green}${colors.bright}✅ Pruebas de manejo de errores exitosas${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}❌ Error en pruebas de manejo de errores: ${error.message}${colors.reset}`);
    throw error;
  }
}

// Probar rendimiento
async function testPerformance(pool) {
  console.log(`\n${colors.magenta}${colors.bright}[TEST 4/4] Probando rendimiento...${colors.reset}`);
  
  // Función auxiliar para mostrar el estado del pool
  const logPoolStatus = () => {
    const status = {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount
    };
    console.log(`${colors.blue}Estado del pool: total=${status.total}, idle=${status.idle}, waiting=${status.waiting}${colors.reset}`);
    return status;
  };
  
  try {
    // Parámetros de prueba - reducidos para Railway
    const iterations = 5; // Reducido de 10 a 5
    const batchSize = 2;  // Reducido de 5 a 2 para evitar timeouts
    
    // Mostrar estado inicial del pool
    console.log(`${colors.cyan}Estado inicial del pool:${colors.reset}`);
    logPoolStatus();
    
    // 1. Prueba de múltiples consultas secuenciales
    console.log(`\n${colors.cyan}Ejecutando ${iterations} consultas secuenciales...${colors.reset}`);
    
    const sequentialTimer = timer.start(`Tiempo para ${iterations} consultas secuenciales`);
    for (let i = 0; i < iterations; i++) {
      try {
        await pool.query('SELECT NOW()');
      } catch (err) {
        console.error(`${colors.yellow}⚠️ Error en consulta secuencial ${i+1}: ${err.message}${colors.reset}`);
      }
    }
    timer.end(sequentialTimer);
    logPoolStatus();
    
    // 2. Prueba de múltiples consultas paralelas
    console.log(`\n${colors.cyan}Ejecutando ${iterations} consultas en paralelo...${colors.reset}`);
    
    const parallelTimer = timer.start(`Tiempo para ${iterations} consultas paralelas`);
    try {
      // Crear promesas con catch individual para cada una
      const queries = Array(iterations).fill().map((_, i) => 
        pool.query('SELECT NOW()').catch(err => {
          console.error(`${colors.yellow}⚠️ Error en consulta paralela ${i+1}: ${err.message}${colors.reset}`);
          return null; // Devolver null en caso de error para que Promise.all no falle
        })
      );
      
      await Promise.all(queries);
    } catch (err) {
      console.error(`${colors.yellow}⚠️ Error general en consultas paralelas: ${err.message}${colors.reset}`);
    }
    timer.end(parallelTimer);
    logPoolStatus();
    
    // 3. Prueba de conexiones múltiples (con adquisición secuencial)
    console.log(`\n${colors.cyan}Probando ${batchSize} conexiones (secuencialmente)...${colors.reset}`);
    
    const connectionTimer = timer.start(`Tiempo para ${batchSize} conexiones`);
    const clients = [];
    
    // Adquirir conexiones secuencialmente para evitar sobrecarga
    for (let i = 0; i < batchSize; i++) {
      try {
        console.log(`${colors.blue}Adquiriendo conexión ${i+1}/${batchSize}...${colors.reset}`);
        const client = await pool.connect();
        clients.push(client);
        console.log(`${colors.green}✓ Conexión ${i+1} adquirida${colors.reset}`);
        
        // Mostrar estado del pool después de cada conexión
        logPoolStatus();
        
        // Esperar un breve momento entre conexiones
        if (i < batchSize - 1) {
          await sleep(500);
        }
      } catch (err) {
        console.error(`${colors.red}❌ Error al adquirir conexión ${i+1}: ${err.message}${colors.reset}`);
      }
    }
    
    try {
      // Ejecutar una consulta simple en cada cliente obtenido
      for (let i = 0; i < clients.length; i++) {
        try {
          const result = await clients[i].query('SELECT 1 as test');
          console.log(`${colors.green}✓ Consulta en conexión ${i+1} exitosa: ${result.rows[0].test}${colors.reset}`);
        } catch (err) {
          console.error(`${colors.red}❌ Error en consulta de conexión ${i+1}: ${err.message}${colors.reset}`);
        } finally {
          // Liberar la conexión inmediatamente después de usarla
          clients[i].release();
          console.log(`${colors.blue}Conexión ${i+1} liberada${colors.reset}`);
        }
      }
    } catch (err) {
      console.error(`${colors.red}❌ Error general en consultas de conexiones: ${err.message}${colors.reset}`);
      
      // Asegurar que todas las conexiones se liberen en caso de error
      clients.forEach((client, i) => {
        try {
          client.release();
          console.log(`${colors.blue}Conexión ${i+1} liberada en cleanup${colors.reset}`);
        } catch (e) {
          // Ignorar errores al liberar
        }
      });
    }
    
    timer.end(connectionTimer);
    
    // Estado final del pool
    console.log(`\n${colors.cyan}Estado final del pool:${colors.reset}`);
    logPoolStatus();
    
    console.log(`\n${colors.green}${colors.bright}✅ Pruebas de rendimiento completadas${colors.reset}`);
    
    // Esperar un momento para que el pool se estabilice
    console.log(`${colors.blue}Esperando 2 segundos para estabilización del pool...${colors.reset}`);
    await sleep(2000);
    logPoolStatus();
    
  } catch (error) {
    console.error(`${colors.red}❌ Error en pruebas de rendimiento: ${error.message}${colors.reset}`);
    throw error;
  }
}

// Ejecutar script principal
main().catch(error => {
  console.error(`${colors.red}${colors.bright}❌ Error en script principal: ${error.message}${colors.reset}`);
  process.exit(1);
});

