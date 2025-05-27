/**
 * Script para ejecutar migraciones de base de datos en Railway
 * 
 * Este script lee y ejecuta los archivos SQL de migraciones
 * para actualizar el esquema de la base de datos.
 * 
 * Uso:
 *   node scripts/migrate.js
 */

// Cargar variables de entorno
require('dotenv').config();

const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../config/database');

// Directorio de migraciones
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

/**
 * Ejecuta un archivo SQL de migración
 * @param {string} filePath - Ruta del archivo SQL
 * @returns {Promise<void>}
 */
async function executeMigration(filePath) {
  console.log(`\n🔄 Ejecutando migración: ${path.basename(filePath)}`);
  
  try {
    // Leer contenido del archivo SQL
    const sqlContent = await fs.readFile(filePath, 'utf8');
    
    // Dividir en sentencias SQL individuales (simple split por ';')
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📊 Encontradas ${statements.length} sentencias SQL para ejecutar`);
    
    // Obtener cliente de conexión
    const client = await pool.connect();
    
    try {
      // Iniciar transacción
      await client.query('BEGIN');
      
      // Ejecutar cada sentencia
      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        console.log(`\n📝 Ejecutando sentencia ${i + 1}/${statements.length}:`);
        console.log(stmt);
        
        await client.query(stmt);
        console.log(`✅ Sentencia ${i + 1} ejecutada correctamente`);
      }
      
      // Confirmar transacción
      await client.query('COMMIT');
      console.log(`\n🎉 Migración ${path.basename(filePath)} completada exitosamente`);
    } catch (error) {
      // Revertir transacción en caso de error
      await client.query('ROLLBACK');
      console.error(`❌ Error en migración ${path.basename(filePath)}:`, error);
      throw error;
    } finally {
      // Liberar cliente
      client.release();
    }
  } catch (error) {
    console.error(`❌ Error al procesar archivo ${path.basename(filePath)}:`, error);
    throw error;
  }
}

/**
 * Ejecuta todas las migraciones pendientes
 */
async function runMigrations() {
  console.log('🚀 Iniciando proceso de migraciones de base de datos...');
  
  try {
    // Verificar si existe la tabla de migraciones
    const client = await pool.connect();
    
    try {
      // Verificar si existe la tabla de control de migraciones
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'migrations'
        );
      `);
      
      // Crear tabla de migraciones si no existe
      if (!tableExists.rows[0].exists) {
        console.log('📊 Creando tabla de control de migraciones...');
        await client.query(`
          CREATE TABLE migrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log('✅ Tabla de migraciones creada correctamente');
      }
      
      // Obtener migraciones ya aplicadas
      const appliedMigrations = await client.query('SELECT name FROM migrations');
      const appliedMigrationNames = appliedMigrations.rows.map(row => row.name);
      
      console.log('📋 Migraciones ya aplicadas:', appliedMigrationNames.length > 0 ? appliedMigrationNames : 'Ninguna');
      
      // Leer archivos de migración
      let migrationFiles = await fs.readdir(MIGRATIONS_DIR);
      
      // Filtrar solo archivos .sql
      migrationFiles = migrationFiles
        .filter(file => file.endsWith('.sql'))
        .sort(); // Ordenar alfabéticamente para ejecución secuencial
      
      console.log('📋 Archivos de migración encontrados:', migrationFiles);
      
      // Filtrar migraciones pendientes
      const pendingMigrations = migrationFiles.filter(file => !appliedMigrationNames.includes(file));
      
      if (pendingMigrations.length === 0) {
        console.log('✅ No hay migraciones pendientes');
        return;
      }
      
      console.log(`🔄 Migraciones pendientes (${pendingMigrations.length}):`, pendingMigrations);
      
      // Ejecutar migraciones pendientes
      for (const migrationFile of pendingMigrations) {
        const migrationPath = path.join(MIGRATIONS_DIR, migrationFile);
        
        // Ejecutar migración
        await executeMigration(migrationPath);
        
        // Registrar migración como aplicada
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [migrationFile]);
        console.log(`📝 Registrada migración ${migrationFile} como aplicada`);
      }
      
      console.log('\n🎉 Todas las migraciones han sido aplicadas correctamente');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error en el proceso de migraciones:', error);
    process.exit(1);
  } finally {
    // Cerrar pool de conexiones
    await pool.end();
  }
}

// Ejecutar migraciones al iniciar el script
runMigrations();

