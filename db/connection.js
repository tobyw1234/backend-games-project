const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';
console.log(process.env)
require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

module.exports = new Pool();
