/**
 * Controlador de Productos
 * Maneja toda la lógica de negocio relacionada con productos
 */

const Producto = require("../models/Producto")
const { successResponse, errorResponse, notFoundResponse } = require("../utils/responseHelper")

/**
 * Obtener todos los productos
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.getAll()
    return successResponse(res, productos, "Productos obtenidos exitosamente")
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return errorResponse(res, "Error al obtener productos")
  }
}

/**
 * Obtener producto por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getProductoById = async (req, res) => {
  try {
    const { id } = req.params
    const producto = await Producto.getById(id)

    if (!producto) {
      return notFoundResponse(res, "Producto")
    }

    return successResponse(res, producto, "Producto obtenido exitosamente")
  } catch (error) {
    console.error("Error al obtener producto:", error)
    return errorResponse(res, "Error al obtener el producto")
  }
}

/**
 * Obtener productos por categoría
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const getProductosByCategoria = async (req, res) => {
  try {
    const { nombre } = req.params
    const productos = await Producto.getByCategoria(nombre)

    if (productos.length === 0) {
      return notFoundResponse(res, "Productos en esta categoría")
    }

    return successResponse(res, productos, `Productos de la categoría "${nombre}" obtenidos exitosamente`)
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error)
    return errorResponse(res, "Error al obtener productos por categoría")
  }
}

/**
 * Crear nuevo producto
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const createProducto = async (req, res) => {
  try {
    const producto = await Producto.create(req.body)
    return successResponse(res, producto, "Producto creado exitosamente", 201)
  } catch (error) {
    console.error("Error al crear producto:", error)

    // Manejo específico de errores de duplicación
    if (error.code === "23505") {
      return errorResponse(res, "Ya existe un producto con ese código", 409)
    }

    return errorResponse(res, "Error al crear producto")
  }
}

/**
 * Actualizar producto por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el ID sea válido
    if (!id || isNaN(parseInt(id))) {
      return errorResponse(res, "ID de producto inválido", 400);
    }
    
    console.log(`Intentando actualizar producto con ID: ${id}`);
    console.log("Datos de actualización:", JSON.stringify(req.body));
    
    // Validar que existan los campos mínimos requeridos
    const { nombre, precio, categoria } = req.body;
    
    if (!nombre || nombre.trim() === '') {
      return errorResponse(res, "El nombre del producto es obligatorio", 400);
    }
    
    if (precio === undefined || isNaN(precio) || precio < 0) {
      return errorResponse(res, "El precio debe ser un número válido mayor o igual a cero", 400);
    }
    
    if (!categoria || categoria.trim() === '') {
      return errorResponse(res, "La categoría del producto es obligatoria", 400);
    }
    
    // Verificar primero que el producto existe
    const existingProduct = await Producto.getById(id);
    if (!existingProduct) {
      console.log(`Producto con ID ${id} no encontrado`);
      return notFoundResponse(res, "Producto");
    }
    
    console.log(`Producto con ID ${id} encontrado. Procediendo con la actualización.`);
    
    // Preparar los datos de actualización (combinar datos existentes con nuevos)
    const productoData = {
      ...existingProduct, // Mantener datos existentes
      ...req.body,        // Sobrescribir con nuevos datos
    };
    
    // Ejecutar la actualización
    const producto = await Producto.update(id, productoData);

    if (!producto) {
      return notFoundResponse(res, "Producto");
    }

    console.log(`Producto ID ${id} actualizado exitosamente:`, JSON.stringify({
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria
    }));
    
    return successResponse(res, producto, `Producto "${producto.nombre}" actualizado exitosamente`);
  } catch (error) {
    // Log detallado para debugging
    console.error(`[ERROR-DEBUG] Error detallado al actualizar producto ID ${req.params.id}:`, {
      error_message: error.message,
      error_name: error.name,
      error_code: error.code,
      error_stack: error.stack,
      request_body: req.body,
      sql_error: error.sqlState || error.sql || 'No SQL error information'
    });
    
    // Intento imprimir un objeto de error completo
    try {
      console.error('Error completo:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    } catch (e) {
      console.error('No se pudo serializar el error completo');
    }
    
    // Proporcionar mensaje más específico basado en el tipo de error
    let errorMsg = "Error al actualizar producto";
    let statusCode = 500;
    
    if (error.message.includes("syntax error")) {
      errorMsg = "Error en la sintaxis de la consulta SQL";
    } else if (error.message.includes("violates not-null")) {
      errorMsg = "Falta un campo obligatorio";
    } else if (error.message.includes("duplicate key")) {
      errorMsg = "Ya existe un producto con ese código";
      statusCode = 409;
    } else if (error.message.includes("invalid input syntax")) {
      errorMsg = "Formato de datos inválido";
      statusCode = 400;
    }
    
    return errorResponse(res, `${errorMsg}: ${error.message}`, statusCode);
  }
}

/**
 * Eliminar producto por ID
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 */
const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params
    const producto = await Producto.delete(id)

    if (!producto) {
      return notFoundResponse(res, "Producto")
    }

    return successResponse(res, null, `Producto "${producto.nombre}" eliminado correctamente`)
  } catch (error) {
    console.error("Error al eliminar producto:", error)

    // Manejo específico de errores de referencia
    if (error.code === "23503") {
      return errorResponse(res, "No se puede eliminar el producto porque está referenciado en pedidos", 400)
    }

    return errorResponse(res, "Error al eliminar producto")
  }
}

module.exports = {
  getAllProductos,
  getProductoById,
  getProductosByCategoria,
  createProducto,
  updateProducto,
  deleteProducto,
}
