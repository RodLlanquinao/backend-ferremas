/**
 * Controlador de Usuarios
 * Maneja toda la lógica de negocio relacionada con usuarios
 */

const Usuario = require("../models/Usuario")
const { successResponse, errorResponse, notFoundResponse } = require("../utils/responseHelper")

/**
 * Obtener usuario por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params
    const usuario = await Usuario.getById(id)

    if (!usuario) {
      return notFoundResponse(res, "Usuario")
    }

    return successResponse(res, usuario, "Usuario obtenido exitosamente")
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return errorResponse(res, "Error al obtener usuario")
  }
}

/**
 * Crear nuevo usuario
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const createUsuario = async (req, res) => {
  try {
    // Verificar si el email ya existe
    const existingUser = await Usuario.getByEmail(req.body.email)
    if (existingUser) {
      return errorResponse(res, "Ya existe un usuario con ese email", 409)
    }

    const usuario = await Usuario.create(req.body)
    return successResponse(res, usuario, "Usuario creado exitosamente", 201)
  } catch (error) {
    console.error("Error al crear usuario:", error)

    // Manejo específico de errores de duplicación
    if (error.code === "23505") {
      return errorResponse(res, "Ya existe un usuario con ese email", 409)
    }

    return errorResponse(res, "Error al crear usuario")
  }
}

/**
 * Actualizar usuario por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar si el nuevo email ya existe (si se está cambiando)
    if (req.body.email) {
      const existingUser = await Usuario.getByEmail(req.body.email)
      if (existingUser && existingUser.id !== Number.parseInt(id)) {
        return errorResponse(res, "Ya existe un usuario con ese email", 409)
      }
    }

    const usuario = await Usuario.update(id, req.body)

    if (!usuario) {
      return notFoundResponse(res, "Usuario")
    }

    return successResponse(res, usuario, "Usuario actualizado exitosamente")
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return errorResponse(res, "Error al actualizar usuario")
  }
}

/**
 * Eliminar usuario por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params
    const usuario = await Usuario.delete(id)

    if (!usuario) {
      return notFoundResponse(res, "Usuario")
    }

    return successResponse(res, null, "Usuario eliminado correctamente")
  } catch (error) {
    console.error("Error al eliminar usuario:", error)

    // Manejo específico de errores de referencia
    if (error.code === "23503") {
      return errorResponse(res, "No se puede eliminar el usuario porque tiene pedidos asociados", 400)
    }

    return errorResponse(res, "Error al eliminar usuario")
  }
}

/**
 * Obtener todos los usuarios
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    return successResponse(res, usuarios, "Usuarios obtenidos exitosamente");
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    return errorResponse(res, "Error al obtener usuarios");
  }
};

module.exports = {
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getAllUsuarios,
}
