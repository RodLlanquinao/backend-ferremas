const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:jvVmUJruIgzoLJOetRRRnAsTUnkQzcYQ@crossover.proxy.rlwy.net:26319/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
