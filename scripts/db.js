const { Pool } = require('pg');
const { DATABASE_URL } = require('../config/environment');

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/**
 * Función para probar la conexión a la base de datos
 * @returns {Promise<boolean>} - True si la conexión es exitosa
 */
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('🔗 Conexión exitosa a PostgreSQL:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    return false;
  }
};

module.exports = { 
  pool,
  testConnection
};
