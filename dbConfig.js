

const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'ISS',
  server: '127.0.0.1', 
  database: 'saurabh_db',
  options: {
    encrypt: true, 
    trustServerCertificate: true 
  }
};

module.exports = config;