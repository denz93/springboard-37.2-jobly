const db = require('../db');

class Technology {
  static async create({name}) {
    const result = await db.query(
      `INSERT INTO technologies (name)
       VALUES ($1)
       RETURNING id, name`,
      [name]
    )
    const technology = result.rows[0]
    return technology
  }

  static async findAll() {
    const result = await db.query(
      `SELECT id, name
       FROM technologies
       ORDER BY name`
    )
    return result.rows
  }

  static async get(id) {
    const result = await db.query(
      `SELECT id, name
       FROM technologies
       WHERE id = $1`,
      [id]
    )
    const technology = result.rows[0]
    return technology
  }

  static async delete(id) {
    await db.query(
      `DELETE FROM technologies
       WHERE id = $1`,
      [id]
    )
    return true
  }
}

module.exports = Technology