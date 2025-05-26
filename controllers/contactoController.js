/**
 * Controlador de Contacto
 * Maneja toda la lógica de negocio relacionada con mensajes de contacto
 */

const Contacto = require("../models/Contacto")
const { successResponse, errorResponse, notFoundResponse } = require("../utils/responseHelper")

/**
 * Crear nuevo mensaje de contacto
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const createContacto = async (req, res) => {
  try {
    console.log("Recibida solicitud de contacto:", JSON.stringify(req.body));
    
    // Validar campos requeridos
    const { nombre, email, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
      console.error("Error de validación en contacto:", {
        nombre: !!nombre,
        email: !!email,
        mensaje: !!mensaje
      });
      return errorResponse(
        res, 
        "Campos requeridos faltantes. Se requiere nombre, email y mensaje.", 
        400
      );
    }
    
    // Validar formato de email básico
    if (!email.includes('@')) {
      return errorResponse(res, "Formato de email inválido", 400);
    }
    
    // Generar fecha automáticamente
    const contactoData = {
      ...req.body,
      fecha: new Date().toISOString(),
    };
    
    console.log("Intentando crear contacto con datos:", {
      nombre: contactoData.nombre,
      email: contactoData.email,
      mensaje: contactoData.mensaje ? `${contactoData.mensaje.substring(0, 20)}...` : 'vacío',
      fecha: contactoData.fecha
    });
    
    const contacto = await Contacto.create(contactoData);
    console.log("Contacto creado exitosamente con ID:", contacto.id);
    return successResponse(res, contacto, "Mensaje de contacto enviado exitosamente", 201);
  } catch (error) {
    console.error("Error detallado al enviar mensaje de contacto:", {
      message: error.message,
      stack: error.stack,
      data: req.body
    });
    
    // Proporcionar mensaje más específico basado en el tipo de error
    let errorMsg = "Error al enviar mensaje de contacto";
    let statusCode = 500;
    
    if (error.message.includes("inválidos")) {
      errorMsg = error.message;
      statusCode = 400;
    } else if (error.message.includes("duplicate key")) {
      errorMsg = "Ya existe un mensaje con estos datos";
      statusCode = 409;
    } else if (error.message.includes("relation") && error.message.includes("does not exist")) {
      errorMsg = "Error de configuración en el servidor. Contactar al administrador.";
      console.error("ERROR CRÍTICO: La tabla 'contactos' no existe en la base de datos");
      statusCode = 500;
    }
    
    return errorResponse(res, errorMsg, statusCode);
  }
}

/**
 * Obtener todos los mensajes de contacto
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getAllContactos = async (req, res) => {
  try {
    console.log("Obteniendo todos los mensajes de contacto");
    const contactos = await Contacto.getAll();
    console.log(`Obtenidos ${contactos.length} mensajes de contacto`);
    return successResponse(res, contactos, "Mensajes de contacto obtenidos exitosamente");
  } catch (error) {
    console.error("Error detallado al obtener mensajes de contacto:", {
      message: error.message,
      stack: error.stack
    });
    
    let errorMsg = "Error al obtener mensajes de contacto";
    let statusCode = 500;
    
    if (error.message.includes("relation") && error.message.includes("does not exist")) {
      errorMsg = "Error de configuración en el servidor. Contactar al administrador.";
      console.error("ERROR CRÍTICO: La tabla 'contactos' no existe en la base de datos");
    }
    
    return errorResponse(res, errorMsg, statusCode);
  }
}

/**
 * Obtener mensaje de contacto por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getContactoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea un número
    if (isNaN(parseInt(id))) {
      return errorResponse(res, "ID de mensaje inválido", 400);
    }
    
    console.log(`Buscando mensaje de contacto con ID: ${id}`);
    const contacto = await Contacto.getById(id);

    if (!contacto) {
      console.log(`Mensaje de contacto con ID ${id} no encontrado`);
      return notFoundResponse(res, "Mensaje de contacto");
    }

    console.log(`Mensaje de contacto con ID ${id} encontrado`);
    return successResponse(res, contacto, "Mensaje de contacto obtenido exitosamente");
  } catch (error) {
    console.error(`Error detallado al obtener mensaje de contacto con ID ${req.params.id}:`, {
      message: error.message,
      stack: error.stack
    });
    
    return errorResponse(res, `Error al obtener mensaje de contacto: ${error.message}`, 500);
  }
}

/**
 * Eliminar mensaje de contacto por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const deleteContacto = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea un número
    if (isNaN(parseInt(id))) {
      return errorResponse(res, "ID de mensaje inválido", 400);
    }
    
    console.log(`Intentando eliminar mensaje de contacto con ID: ${id}`);
    
    // Verificar primero si el contacto existe
    const contactoExistente = await Contacto.getById(id);
    if (!contactoExistente) {
      console.log(`Mensaje de contacto con ID ${id} no encontrado para eliminar`);
      return notFoundResponse(res, "Mensaje de contacto");
    }
    
    const contacto = await Contacto.delete(id);

    if (!contacto) {
      return notFoundResponse(res, "Mensaje de contacto");
    }

    console.log(`Mensaje de contacto con ID ${id} eliminado correctamente`);
    return successResponse(res, null, "Mensaje de contacto eliminado correctamente");
  } catch (error) {
    console.error(`Error detallado al eliminar mensaje de contacto con ID ${req.params.id}:`, {
      message: error.message,
      stack: error.stack
    });
    
    return errorResponse(res, `Error al eliminar mensaje de contacto: ${error.message}`, 500);
  }
}

module.exports = {
  createContacto,
  getAllContactos,
  getContactoById,
  deleteContacto,
}
