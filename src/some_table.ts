// some_table.ts

export {};
const AsyncLock = require('async-lock')

// sleep time expects milliseconds
function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    });
}

class SomeTable {
    _dao: AppDAO
    _lock: typeof AsyncLock

    constructor(dao: AppDAO) {
        this._dao = dao
        this._lock = new AsyncLock()
    }

    createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS some_table (
                id INTEGER PRIMARY KEY,
                data TEXT)`
        return this._dao.run(sql)
    }

    insert(id: number, data: string) {
        return this._dao.run(
            'INSERT INTO some_table (id, data) VALUES (?, ?)',
            [id, data]
        )
    }

    delete(id: number) {
        return this._dao.run(
            `DELETE FROM some_table WHERE id = ?`,
            [id]
        )
    }

    getById(id: number) {
        return this._dao.get(
            `SELECT * FROM some_table WHERE id = ?`,
            [id]
        )
    }

    getAll() {
        return this._dao.all(`SELECT * FROM some_table`)
    }

    insert_to_db_with_lock(id: number, data: string) {
        return new Promise((resolve) => {
            this._lock.acquire("key2", () => {
                console.log(`lock_db enter for ${id}`)
                console.log(`Sleep start: ${new Date().toISOString()}`)
                sleep(3000)
                .then(() => {
                    console.log(`Sleep End: ${new Date().toISOString()}`)

                    this.insert(id, data)
                    .then(() => {
                        resolve( `Added ${id}: ${data}\n` );                        
                    })
                    .catch((err: Error) => {
                        resolve( `Data already exists for ${id}\n`)
                    })
                })
                console.log(`lock_db exit for ${id}`)
            })
        })
    }

    delete_from_db_with_lock(id: number) {
        return new Promise((resolve) => {
            this._lock.acquire("key2", () => {
                console.log(`lock_db enter for ${id}`)

                console.log(`Sleep start: ${new Date().toISOString()}`)
                sleep(3000)
                .then(() => {
                    console.log(`Sleep End: ${new Date().toISOString()}`)

                    this.delete(id)
                    .then(() => {
                        console.log('lock_db exit')
                        resolve(`Deleted ${id}\n`)
                    })
                    .catch((err: Error) => {
                        console.log('Error in delete_from_db_with_lock: ')
                        console.log(JSON.stringify(err))
                        resolve(`Error during delete for ${id}\n`)
                    })
                })
            })
        })
    }    
}

module.exports = SomeTable;
