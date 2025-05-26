/**
 * Modelo de Contacto
 * Define la estructura y operaciones de base de datos para mensajes de contacto
 */

const { pool } = require("../config/database")

/**
 * Valida los datos del contacto
 * @param {Object} data - Datos a validar
 * @returns {Object} - { isValid, errors }
 */
const validateContacto = (data) => {
  const errors = [];
  
  // Validar campos obligatorios
  if (!data.nombre || data.nombre.trim() === '') {
    errors.push('El nombre es obligatorio');
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.push('El email es obligatorio');
  } else if (!data.email.includes('@')) {
    errors.push('El email no es válido');
  }
  
  if (!data.mensaje || data.mensaje.trim() === '') {
    errors.push('El mensaje es obligatorio');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

class Contacto {
  /**
   * Crear nuevo mensaje de contacto
   * @param {Object} contactoData - Datos del mensaje de contacto
   * @returns {Promise<Object>} - Mensaje de contacto creado
   */
  static async create(contactoData) {
    // Validar datos
    const validation = validateContacto(contactoData);
    if (!validation.isValid) {
      throw new Error(`Datos de contacto inválidos: ${validation.errors.join(', ')}`);
    }
    
    // Extraer datos con valores por defecto para campos opcionales
    const { 
      nombre, 
      email, 
      asunto = 'Contacto desde el sitio web', // Valor por defecto para asunto
      mensaje, 
      fecha = new Date() 
    } = contactoData;
    
    // Log para debugging
    console.log(`Creando contacto: ${nombre} <${email}>, asunto: ${asunto}`);
    
    const query = `
      INSERT INTO contactos (nombre, email, asunto, mensaje, fecha) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    
    try {
      const values = [nombre, email, asunto, mensaje, fecha];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error en Contacto.create:', error.message);
      throw new Error(`Error al guardar contacto: ${error.message}`);
    }
  }

  /**
   * Obtener todos los mensajes de contacto
   * @returns {Promise<Array>} - Array de mensajes de contacto
   */
  static async getAll() {
    try {
      const query = "SELECT * FROM contactos ORDER BY fecha DESC";
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error en Contacto.getAll:', error.message);
      throw new Error(`Error al obtener contactos: ${error.message}`);
    }
  }

  /**
   * Obtener mensaje de contacto por ID
   * @param {number} id - ID del mensaje
   * @returns {Promise<Object|null>} - Mensaje encontrado o null
   */
  static async getById(id) {
    try {
      const query = "SELECT * FROM contactos WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Error en Contacto.getById(${id}):`, error.message);
      throw new Error(`Error al obtener contacto: ${error.message}`);
    }
  }

  /**
   * Eliminar mensaje de contacto por ID
   * @param {number} id - ID del mensaje
   * @returns {Promise<Object|null>} - Mensaje eliminado o null
   */
  static async delete(id) {
    try {
      const query = "DELETE FROM contactos WHERE id = $1 RETURNING *";
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error(`Error en Contacto.delete(${id}):`, error.message);
      throw new Error(`Error al eliminar contacto: ${error.message}`);
    }
  }
}

module.exports = Contacto
