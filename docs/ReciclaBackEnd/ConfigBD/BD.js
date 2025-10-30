const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'alan',
    password: '996328591705Asd*',
    database: 'Recicla',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('Conexão com o banco de dados estabelecida com sucesso.');

module.exports = pool;