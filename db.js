const mysql2 = require('mysql2');

class Database {
  constructor(config) {
    this.connection = mysql2.createConnection(config);
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) reject(err);
        console.log('Connected to MySQL database');
        resolve();
      });
    });
  }

  query(sql, args = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) reject(err);
        console.log('Disconnected from MySQL database');
        resolve();
      });
    });
  }
}

module.exports = Database;
