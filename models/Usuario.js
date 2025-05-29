/**
 * Modelo de Usuario
 * Define la estructura y operaciones de base de datos para usuarios
 * Integra autenticación con Firebase
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
   * Obtener usuario por UID de Firebase
   * @param {string} firebaseUid - UID de Firebase del usuario
   * @returns {Promise<Object|null>} - Usuario encontrado o null
   */
  static async getByFirebaseUid(firebaseUid) {
    try {
      console.log(`[Usuario.getByFirebaseUid] Getting user with Firebase UID: ${firebaseUid}`);
      const query = "SELECT * FROM usuarios WHERE firebase_uid = $1"
      const result = await pool.query(query, [firebaseUid])
      console.log(`[Usuario.getByFirebaseUid] Query result: ${result.rows.length > 0 ? 'User found' : 'User not found'}`);
      return result.rows[0] || null
    } catch (error) {
      console.error(`[Usuario.getByFirebaseUid] ERROR: ${error.message}`);
      console.error(`[Usuario.getByFirebaseUid] Error code: ${error.code}`);
      console.error(`[Usuario.getByFirebaseUid] Error detail: ${error.detail || 'No detail'}`);
      throw error;
    }
  }

  /**
   * Crear nuevo usuario
   * @param {Object} usuarioData - Datos del usuario
   * @returns {Promise<Object>} - Usuario creado
   */
  static async create(usuarioData) {
    try {
      const { 
        nombre, 
        email, 
        rol = "cliente",
        firebase_uid = null,
        email_verified = false,
        provider = "email",
        password_hash = null
      } = usuarioData
      
      console.log(`[Usuario.create] Creating user with email: ${email}, firebase_uid: ${firebase_uid || 'none'}`);
      
      const query = `
        INSERT INTO usuarios (
          nombre, 
          email, 
          rol, 
          firebase_uid, 
          email_verified, 
          provider,
          password_hash,
          last_login
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP) 
        RETURNING *
      `
      const values = [
        nombre, 
        email, 
        rol, 
        firebase_uid, 
        email_verified, 
        provider,
        password_hash
      ]
      
      const result = await pool.query(query, values)
      console.log(`[Usuario.create] User created successfully with ID: ${result.rows[0].id}`);
      return result.rows[0]
    } catch (error) {
      console.error(`[Usuario.create] ERROR: ${error.message}`);
      console.error(`[Usuario.create] Error code: ${error.code}`);
      console.error(`[Usuario.create] Error detail: ${error.detail || 'No detail'}`);
      throw error;
    }
  }

  /**
   * Actualizar usuario por ID
   * @param {number} id - ID del usuario
   * @param {Object} usuarioData - Datos actualizados del usuario
   * @returns {Promise<Object|null>} - Usuario actualizado o null
   */
  static async update(id, usuarioData) {
    try {
      const { 
        nombre, 
        email, 
        rol,
        firebase_uid,
        email_verified,
        provider,
        password_hash
      } = usuarioData
      
      // Construir query dinámicamente basado en los campos proporcionados
      let updateFields = [];
      let values = [];
      let paramCount = 1;
      
      if (nombre !== undefined) {
        updateFields.push(`nombre = $${paramCount}`);
        values.push(nombre);
        paramCount++;
      }
      
      if (email !== undefined) {
        updateFields.push(`email = $${paramCount}`);
        values.push(email);
        paramCount++;
      }
      
      if (rol !== undefined) {
        updateFields.push(`rol = $${paramCount}`);
        values.push(rol);
        paramCount++;
      }
      
      if (firebase_uid !== undefined) {
        updateFields.push(`firebase_uid = $${paramCount}`);
        values.push(firebase_uid);
        paramCount++;
      }
      
      if (email_verified !== undefined) {
        updateFields.push(`email_verified = $${paramCount}`);
        values.push(email_verified);
        paramCount++;
      }
      
      if (provider !== undefined) {
        updateFields.push(`provider = $${paramCount}`);
        values.push(provider);
        paramCount++;
      }
      
      if (password_hash !== undefined) {
        updateFields.push(`password_hash = $${paramCount}`);
        values.push(password_hash);
        paramCount++;
      }
      
      // Siempre actualizar updated_at
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      
      // Si no hay campos para actualizar, retornar el usuario actual
      if (updateFields.length === 1) {
        return this.getById(id);
      }
      
      const query = `
        UPDATE usuarios 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount} 
        RETURNING *
      `;
      
      values.push(id);
      
      console.log(`[Usuario.update] Updating user ID: ${id}`);
      const result = await pool.query(query, values);
      console.log(`[Usuario.update] User updated successfully: ${result.rows.length > 0}`);
      
      return result.rows[0] || null;
    } catch (error) {
      console.error(`[Usuario.update] ERROR: ${error.message}`);
      console.error(`[Usuario.update] Error code: ${error.code}`);
      console.error(`[Usuario.update] Error detail: ${error.detail || 'No detail'}`);
      throw error;
    }
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
  
  /**
   * Actualizar la marca de tiempo del último inicio de sesión
   * @param {number} id - ID del usuario
   * @returns {Promise<boolean>} - True si se actualizó correctamente
   */
  static async updateLastLogin(id) {
    try {
      console.log(`[Usuario.updateLastLogin] Updating last_login for user ID: ${id}`);
      const query = `
        UPDATE usuarios 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = $1
        RETURNING id
      `;
      
      const result = await pool.query(query, [id]);
      const success = result.rowCount > 0;
      console.log(`[Usuario.updateLastLogin] Last login updated: ${success}`);
      
      return success;
    } catch (error) {
      console.error(`[Usuario.updateLastLogin] ERROR: ${error.message}`);
      console.error(`[Usuario.updateLastLogin] Error code: ${error.code}`);
      console.error(`[Usuario.updateLastLogin] Error detail: ${error.detail || 'No detail'}`);
      throw error;
    }
  }
  
  /**
   * Vincular cuenta de Firebase a un usuario existente
   * @param {number} id - ID del usuario
   * @param {string} firebaseUid - UID de Firebase
   * @param {string} provider - Proveedor de autenticación
   * @returns {Promise<Object|null>} - Usuario actualizado o null
   */
  static async linkFirebaseAccount(id, firebaseUid, provider = 'email') {
    try {
      console.log(`[Usuario.linkFirebaseAccount] Linking Firebase UID ${firebaseUid} to user ID: ${id}`);
      
      const query = `
        UPDATE usuarios 
        SET 
          firebase_uid = $1, 
          provider = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3 
        RETURNING *
      `;
      
      const result = await pool.query(query, [firebaseUid, provider, id]);
      console.log(`[Usuario.linkFirebaseAccount] Account linked: ${result.rows.length > 0}`);
      
      return result.rows[0] || null;
    } catch (error) {
      console.error(`[Usuario.linkFirebaseAccount] ERROR: ${error.message}`);
      console.error(`[Usuario.linkFirebaseAccount] Error code: ${error.code}`);
      console.error(`[Usuario.linkFirebaseAccount] Error detail: ${error.detail || 'No detail'}`);
      throw error;
    }
  }
  
  /**
   * Obtener todos los usuarios
   * @returns {Promise<Array>} - Lista de todos los usuarios
   */
  static async getAll() {
    try {
      console.log(`[Usuario.getAll] Getting all users from database`);
      const query = "SELECT * FROM usuarios ORDER BY id ASC";
      const result = await pool.query(query);
      console.log(`[Usuario.getAll] Retrieved ${result.rows.length} users successfully`);
      return result.rows;
    } catch (error) {
      console.error(`[Usuario.getAll] ERROR: ${error.message}`);
      console.error(`[Usuario.getAll] Error code: ${error.code}`);
      console.error(`[Usuario.getAll] Error detail: ${error.detail || 'No detail'}`);
      console.error(`[Usuario.getAll] Error query: ${error.query || 'No query info'}`);
      console.error(`[Usuario.getAll] Stack trace: ${error.stack}`);
      throw error;
    }
  }
}

module.exports = Usuario
