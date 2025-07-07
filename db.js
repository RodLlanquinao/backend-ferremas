const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:YaDXYoFazfxtVWIKaxLZJicAQcLkJcXF@shinkansen.proxy.rlwy.net:24430/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
