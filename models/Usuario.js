/**
 * Modelo de Usuario
 * Define la estructura y operaciones de base de datos para usuarios
 */

const { pool } = require("../config/database")

class Usuario {
  /**
   * Obtener usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<Object|null>} - Usuario encontrado o null
   */
  static async getById(id) {
    try {
      console.log(`[Usuario.getById] Getting user with ID: ${id}`);
      const query = "SELECT * FROM usuarios WHERE id = $1"
      const result = await pool.query(query, [id])
      console.log(`[Usuario.getById] Query result: ${result.rows.length > 0 ? 'User found' : 'User not found'}`);
      return result.rows[0] || null
    } catch (error) {
      console.error(`[Usuario.getById] ERROR: ${error.message}`);
      console.error(`[Usuario.getById] Error code: ${error.code}`);
      console.error(`[Usuario.getById] Error detail: ${error.detail || 'No detail'}`);
      console.error(`[Usuario.getById] Error query: ${error.query || 'No query info'}`);
      console.error(`[Usuario.getById] Stack trace: ${error.stack}`);
      throw error;
    }
  }

  /**
   * Obtener usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} - Usuario encontrado o null
   */
  static async getByEmail(email) {
    const query = "SELECT * FROM usuarios WHERE email = $1"
    const result = await pool.query(query, [email])
    return result.rows[0] || null
  }

  /**
   * Crear nuevo usuario
   * @param {Object} usuarioData - Datos del usuario
   * @returns {Promise<Object>} - Usuario creado
   */
  static async create(usuarioData) {
    const { nombre, email, rol = "cliente" } = usuarioData
    const query = `
      INSERT INTO usuarios (nombre, email, rol) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `
    const values = [nombre, email, rol]
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  /**
   * Actualizar usuario por ID
   * @param {number} id - ID del usuario
   * @param {Object} usuarioData - Datos actualizados del usuario
   * @returns {Promise<Object|null>} - Usuario actualizado o null
   */
  static async update(id, usuarioData) {
    const { nombre, email, rol } = usuarioData
    const query = `
      UPDATE usuarios 
      SET nombre = $1, email = $2, rol = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 
      RETURNING *
    `
    const values = [nombre, email, rol, id]
    const result = await pool.query(query, values)
    return result.rows[0] || null
  }

  /**
   * Eliminar usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<Object|null>} - Usuario eliminado o null
   */
  static async delete(id) {
    const query = "DELETE FROM usuarios WHERE id = $1 RETURNING *"
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }
}

module.exports = Usuario
