const sql = require('mysql2/promise');
require('dotenv').config()


async function connect() {
    try {
        const connection = await sql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'BankApp',
            port: 3306
        });
        console.log('Connection created');
        return connection;
    } catch (err) {
        console.log('Error trying to connect to database: ' + err);
        throw err;
    }
}

module.exports = connect;