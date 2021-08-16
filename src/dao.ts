// dao.js

const sqlite3 = require('sqlite3').verbose()

class AppDAO {
  db: any;

  constructor(dbFilePath: string) {
    this.db = new sqlite3.Database(dbFilePath, (err: Error) => {
      if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('Connected to database')
      }
    });
  }

  run(sql: string, params: any[] = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err: Error) => {
        if (err) {
          console.log('Error running sql ' + sql)
          console.log(err)
          reject(err)
        } else {
          //resolve({ id: this.lastID })
          resolve(`${this.db.changes}`);
        }
      })
    })
  }

  get(sql: string, params: any[] = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err: Error, result: any) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result) 
        }
      })
    })
  }

  all(sql: string, params: any[] = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err: Error, rows: any) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
}

module.exports = AppDAO
