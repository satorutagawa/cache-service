class SomeTable {
  dao: AppDAO

  constructor(dao: AppDAO) {
    this.dao = dao
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS some_table (
        id INTEGER PRIMARY KEY,
        data TEXT)`
    return this.dao.run(sql)
  }

  insert(id: number, data: string) {
    return this.dao.run(
      'INSERT INTO some_table (id, data) VALUES (?, ?)',
      [id, data]
    )
  }

  delete(id: number) {
    return this.dao.run(
      `DELETE FROM some_table WHERE id = ?`,
      [id]
    )
  }

  getById(id: number) {
    return this.dao.get(
      `SELECT * FROM some_table WHERE id = ?`,
      [id]
    )
  }

  getAll() {
    return this.dao.all(`SELECT * FROM some_table`)
  }
}

module.exports = SomeTable;
