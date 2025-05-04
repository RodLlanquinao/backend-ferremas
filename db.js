const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:fUVTpVPReTqMwqFDEQXFBPmIedXiYENm@hopper.proxy.rlwy.net:56544/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
