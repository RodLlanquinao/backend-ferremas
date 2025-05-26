const express = require('express');
const router = express.Router();
const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys } = require('transbank-sdk');
const { pool } = require("../config/database");
const Pedido = require('../models/Pedido');

// Configuración de Webpay
const options = new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,
  IntegrationApiKeys.WEBPAY,
  'https://webpay3gint.transbank.cl'
);

// URL de retorno basada en el ambiente
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-dominio-produccion.com'
  : 'http://localhost:3000';

// Función auxiliar para actualizar el pedido con datos de Transbank
async function actualizarPedido(id, datos) {
  try {
    console.log('[Webpay] Intentando actualizar pedido:', { id, datos });
    
    // Utilizamos el modelo Pedido para mantener consistencia
    const pedidoActualizado = await Pedido.update(id, {
      transbank_token: datos.token,
      transbank_status: datos.status,
      buy_order: datos.buyOrder,
      estado: datos.nuevoEstado || undefined // Actualizar estado del pedido si se proporciona
    });
    
    if (!pedidoActualizado) {
      throw new Error(`No se pudo actualizar el pedido ${id}`);
    }
    
    console.log('[Webpay] Pedido actualizado exitosamente:', pedidoActualizado);
    return pedidoActualizado;
  } catch (error) {
    console.error('[Webpay] Error al actualizar pedido:', error);
    throw error;
  }
}

// Función para generar respuestas HTML consistentes
function generarHtmlRespuesta({ titulo, mensaje, detalles = [], esExito = true, redireccion = null, segundosRedireccion = 3, redireccionHtml = null }) {
  const colorTitulo = esExito ? '#28a745' : '#dc3545';
  const icono = esExito ? '✅' : '❌';
  
  let detallesHtml = '';
  if (detalles && detalles.length > 0) {
    detallesHtml = `
      <div class="details">
        ${detalles.map(d => `<p><strong>${d.etiqueta}:</strong> ${d.valor}</p>`).join('')}
      </div>
    `;
  }
  
  let redirHtml = '';
  if (redireccionHtml) {
    // Usar el HTML personalizado para redirección si se proporciona
    redirHtml = redireccionHtml;
  } else if (redireccion) {
    // Usar la redirección estándar si se proporciona una URL
    redirHtml = `
      <p class="loading">Redirigiendo en ${segundosRedireccion} segundos...</p>
      <script>
        setTimeout(function() {
          window.location.href = '${redireccion}';
        }, ${segundosRedireccion * 1000});
      </script>
    `;
  }
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo} - Ferremas</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: white;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 550px;
            width: 100%;
        }
        .header {
            margin-bottom: 2rem;
        }
        .header h1 {
            color: ${colorTitulo};
            margin-bottom: 0.75rem;
            font-size: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .header h1:before {
            content: "${icono}";
            margin-right: 10px;
            font-size: 2.2rem;
        }
        .details {
            margin: 1.5rem 0;
            text-align: left;
            padding: 1.2rem;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 5px solid ${colorTitulo};
        }
        .details p {
            margin: 0.7rem 0;
            color: #2c3e50;
            font-size: 1.1rem;
        }
        .button {
            background-color: ${esExito ? '#28a745' : '#6c757d'};
            color: white;
            padding: 14px 28px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 600;
            margin-top: 1.5rem;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .button:hover {
            background-color: ${esExito ? '#218838' : '#5a6268'};
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .message {
            font-size: 1.1rem;
            line-height: 1.6;
            color: #4a5568;
            margin-bottom: 1.5rem;
        }
        .loading {
            margin-top: 1.5rem;
            color: #6c757d;
            font-size: 1rem;
        }
        @media (max-width: 768px) {
            .container {
                padding: 1.5rem;
            }
            .header h1 {
                font-size: 1.5rem;
            }
            .details p {
                font-size: 1rem;
            }
            .button {
                padding: 12px 24px;
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${titulo}</h1>
        </div>
        <p class="message">${mensaje}</p>
        ${detallesHtml}
        ${redirHtml}
    </div>
</body>
</html>`;
}

// 1. Crear transacción
router.post('/crear-transaccion', async (req, res) => {
    const { pedido_id } = req.body;
    
    if (!pedido_id) {
      return res.status(400).json({ error: 'El ID del pedido es requerido' });
    }

    try {
      // Obtener el pedido y su monto
      const pedido = await Pedido.getById(pedido_id);
      console.log("[Webpay] Pedido original:", pedido);
      
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      if (!pedido.monto || pedido.monto <= 0) {
        return res.status(400).json({ error: 'El pedido no tiene un monto válido' });
      }

      // Verificar si ya tiene un token activo
      if (pedido.transbank_token && pedido.transbank_status === 'INICIADA') {
        console.log('[Webpay] Pedido ya tiene una transacción iniciada, verificando estado del token existente');
        
        // Buscar si la transacción sigue activa en Transbank
        try {
          const transaction = new WebpayPlus.Transaction(options);
          const statusResponse = await transaction.status(pedido.transbank_token);
          console.log('[Webpay] Estado de transacción existente:', statusResponse);
          
          // Verificar si el token sigue siendo válido basado en su estado
          const validTokenStatuses = ['INITIALIZED', 'CREATED'];
          const isTokenValid = validTokenStatuses.includes(statusResponse.status);
          
          if (isTokenValid && statusResponse.url) {
            console.log('[Webpay] Token existente válido, redirigiendo al usuario');
            
            // Actualizamos el estado del pedido para indicar que se está retomando el pago
            await actualizarPedido(pedido_id, {
              token: pedido.transbank_token,
              status: 'RETOMADA',
              nuevoEstado: 'en_proceso'
            });
            
            // Si la transacción está vigente, redirigir inmediatamente al usuario
            const redirectHtml = generarHtmlRespuesta({
              titulo: 'Retomando Pago',
              mensaje: 'Hemos detectado un pago en proceso para este pedido. Serás redirigido automáticamente.',
              detalles: [
                { etiqueta: 'Orden', valor: pedido.buy_order || 'ORD-' + pedido_id },
                { etiqueta: 'Estado', valor: 'Pago en proceso' },
                { etiqueta: 'Acción', valor: 'Redirección automática a Webpay' }
              ],
              esExito: true,
              redireccionHtml: `
                <form id="redirectForm" action="${statusResponse.url}" method="POST" style="display:none;">
                  <input type="hidden" name="token_ws" value="${pedido.transbank_token}" />
                </form>
                <script>
                  // Registrar evento en consola
                  console.log('Redirigiendo a Webpay con token existente');
                  
                  // Enviar formulario automáticamente después de 2 segundos
                  setTimeout(function() {
                    document.getElementById('redirectForm').submit();
                    console.log('Formulario enviado');
                  }, 2000);
                </script>
              `
            });
            
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(redirectHtml);
          } else {
            // El token existe pero no está en un estado válido para continuar
            console.log('[Webpay] Token existente no válido o expirado:', statusResponse.status);
            
            // Actualizar el pedido para indicar que el token expiró
            await actualizarPedido(pedido_id, {
              status: 'EXPIRADA',
              nuevoEstado: 'pendiente'
            });
            
            console.log('[Webpay] Estado de pedido actualizado a EXPIRADA, se creará un nuevo token');
          }
        } catch (tokenError) {
          console.error('[Webpay] Error al verificar token existente:', tokenError);
          
          // Registramos el error específico para mejor diagnóstico
          if (tokenError.message.includes('not found') || tokenError.message.includes('no encontrada')) {
            console.log('[Webpay] El token ya no existe en Transbank, se creará uno nuevo');
          } else if (tokenError.message.includes('timeout') || tokenError.message.includes('tiempo de espera')) {
            console.log('[Webpay] Tiempo de espera agotado al verificar token, se creará uno nuevo');
          } else {
            console.log('[Webpay] Error desconocido al verificar token, se creará uno nuevo:', tokenError.message);
          }
          
          // Actualizar el pedido para indicar que hubo un error con el token
          await actualizarPedido(pedido_id, {
            status: 'ERROR_TOKEN',
            nuevoEstado: 'pendiente'
          });
        }
      }

      const buyOrder = 'ORD-' + pedido_id + '-' + Math.floor(Math.random() * 10000);
      const sessionId = 'SES-' + pedido_id;
      const returnUrl = `${BASE_URL}/api/webpay/retorno`;

      console.log('[Webpay] Iniciando nueva transacción:', { buyOrder, sessionId, monto: pedido.monto, returnUrl });
      
      // Actualizamos el estado del pedido antes de iniciar la transacción
      await actualizarPedido(pedido_id, {
        status: 'PREPARANDO',
        nuevoEstado: 'pendiente'
      });

      const transaction = new WebpayPlus.Transaction(options);
      const response = await transaction.create(buyOrder, sessionId, pedido.monto, returnUrl);
      
      console.log('[Webpay] Respuesta de Webpay:', response);

      // Actualización del pedido usando la función auxiliar
      const pedidoActualizado = await actualizarPedido(pedido_id, {
        token: response.token,
        status: 'INICIADA',
        buyOrder: buyOrder,
        nuevoEstado: 'en_proceso'
      });

      console.log('[Webpay] Pedido actualizado con nuevo token:', pedidoActualizado);

      // Formatear el monto para mostrar
      const montoFormateado = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(pedido.monto);

      // Usar el generador de HTML mejorado
      const html = generarHtmlRespuesta({
        titulo: 'Procesando Pago',
        mensaje: 'Serás redirigido a Webpay para completar tu pago',
        detalles: [
          { etiqueta: 'Orden', valor: buyOrder },
          { etiqueta: 'Monto', valor: montoFormateado },
          { etiqueta: 'Estado', valor: 'Iniciando pago' }
        ],
        esExito: true,
        formulario: {
          action: response.url,
          method: 'POST',
          inputs: [
            { name: 'token_ws', value: response.token }
          ],
          submitText: 'Continuar al Pago'
        }
      });

      // Si llegamos hasta aquí, generamos el HTML con el formulario
      const htmlFormulario = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Procesando Pago - Ferremas</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: white;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 550px;
            width: 100%;
        }
        .header {
            margin-bottom: 2rem;
        }
        .header h1 {
            color: #2c3e50;
            margin-bottom: 0.75rem;
            font-size: 2rem;
        }
        .details {
            margin: 1.5rem 0;
            text-align: left;
            padding: 1.2rem;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 5px solid #3498db;
        }
        .details p {
            margin: 0.7rem 0;
            color: #2c3e50;
            font-size: 1.1rem;
        }
        .button {
            background-color: #28a745;
            color: white;
            padding: 14px 28px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: 600;
            margin-top: 1.5rem;
            transition: all 0.3s ease;
        }
        .button:hover {
            background-color: #218838;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .loading {
            margin-top: 1.5rem;
            color: #6c757d;
            font-size: 1rem;
        }
        .logo {
            margin-bottom: 1.5rem;
            max-width: 150px;
        }
        .secure-badge {
            display: inline-flex;
            align-items: center;
            background-color: #f1f8ff;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            color: #0366d6;
            font-size: 0.9rem;
            margin: 1rem 0;
        }
        .secure-badge:before {
            content: "🔒";
            margin-right: 5px;
        }
        @media (max-width: 768px) {
            .container {
                padding: 1.5rem;
            }
            .header h1 {
                font-size: 1.5rem;
            }
            .details p {
                font-size: 1rem;
            }
            .button {
                padding: 12px 24px;
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Procesando Pago</h1>
            <p>Serás redirigido a Webpay para completar tu pago</p>
            <div class="secure-badge">Pago seguro con Webpay</div>
        </div>
        <div class="details">
            <p><strong>Orden:</strong> ${buyOrder}</p>
            <p><strong>Monto:</strong> ${montoFormateado}</p>
            <p><strong>Estado:</strong> Iniciando pago</p>
        </div>
        <form id="webpay-form" method="POST" action="${response.url}">
            <input type="hidden" name="token_ws" value="${response.token}" />
            <button type="submit" class="button">Continuar al Pago</button>
        </form>
        <p class="loading">Redirigiendo automáticamente en 2 segundos...</p>
    </div>
    <script>
        // Registro de eventos para depuración
        console.log('Formulario de pago cargado correctamente');
        
        // Envío automático del formulario después de 2 segundos
        setTimeout(function() {
            console.log('Enviando formulario automáticamente');
            document.getElementById('webpay-form').submit();
        }, 2000);
        
        // Evento para registro cuando se envía manualmente
        document.getElementById('webpay-form').addEventListener('submit', function() {
            console.log('Formulario enviado manualmente');
        });
    </script>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(htmlFormulario);
    } catch (error) {
      console.error('[Webpay] Error al crear transacción:', error);
      
      // Obtener un mensaje de error más amigable basado en el tipo de error
      let mensajeError = 'Ha ocurrido un error al intentar iniciar el proceso de pago.';
      let detalleError = error.message || 'Error desconocido';
      
      if (error.message.includes('timeout') || error.message.includes('tiempo')) {
        mensajeError = 'La comunicación con el servidor de pagos ha tardado demasiado.';
        detalleError = 'Error de tiempo de espera';
      } else if (error.message.includes('network') || error.message.includes('red')) {
        mensajeError = 'Hubo un problema de red al comunicarse con el servidor de pagos.';
        detalleError = 'Error de red';
      } else if (error.message.includes('token')) {
        mensajeError = 'Hubo un problema con la validación del pago.';
        detalleError = 'Error de validación de token';
      }
      
      // Actualizar el pedido con el estado de error si es posible
      if (pedido_id) {
        try {
          await actualizarPedido(pedido_id, {
            status: 'ERROR_CREACION',
            nuevoEstado: 'error'
          });
          console.log('[Webpay] Pedido marcado con estado de error:', pedido_id);
        } catch (updateError) {
          console.error('[Webpay] Error adicional al intentar actualizar estado de error:', updateError);
        }
      }
      
      // HTML para error
      const htmlError = generarHtmlRespuesta({
        titulo: 'Error al Procesar Pago',
        mensaje: mensajeError,
        detalles: [
          { etiqueta: 'Detalle', valor: detalleError },
          { etiqueta: 'Código', valor: error.code || 'N/A' },
          { etiqueta: 'Acción recomendada', valor: 'Intente nuevamente en unos minutos' }
        ],
        esExito: false,
        redireccion: `${BASE_URL}`,
        segundosRedireccion: 5
      });
      
      res.status(500);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(htmlError);
    }
});

// 2. Ruta de retorno (después del pago)
router.post('/retorno', async (req, res) => {
  const token = req.body.token_ws;
  const tbkToken = req.body.TBK_TOKEN;
  const tbkOrdenCompra = req.body.TBK_ORDEN_COMPRA;
  const tbkIdSesion = req.body.TBK_ID_SESION;

  // Caso de anulación o rechazo por parte del usuario
  if (!token && tbkToken) {
    console.log('[Webpay] Transacción rechazada o anulada por el usuario:', {
      tbkToken,
      tbkOrdenCompra,
      tbkIdSesion
    });

    // Buscar pedido por orden de compra si está disponible
    let pedido = null;
    if (tbkOrdenCompra) {
      try {
        const queryPedido = "SELECT * FROM pedidos WHERE buy_order = $1";
        const pedidoResult = await pool.query(queryPedido, [tbkOrdenCompra]);
        pedido = pedidoResult.rows[0];
      } catch (err) {
        console.error('[Webpay] Error al buscar pedido por orden de compra:', err);
      }
    }

    // Si encontramos el pedido, actualizar su estado
    if (pedido) {
      try {
        await actualizarPedido(pedido.id, {
          token: tbkToken,
          status: 'RECHAZADA',
          nuevoEstado: 'pendiente'
        });
        console.log('[Webpay] Pedido actualizado como RECHAZADO:', pedido.id);
      } catch (updateErr) {
        console.error('[Webpay] Error al actualizar pedido rechazado:', updateErr);
      }
    }

    // Responder con HTML mejorado para transacción rechazada
    const htmlRechazado = generarHtmlRespuesta({
      titulo: 'Pago No Completado',
      mensaje: 'Has cancelado el proceso de pago o la transacción fue rechazada.',
      detalles: [
        { etiqueta: 'Estado', valor: 'Cancelado/Rechazado' },
        ...(tbkOrdenCompra ? [{ etiqueta: 'Orden', valor: tbkOrdenCompra }] : [])
      ],
      esExito: false,
      redireccion: `${BASE_URL}`, // Redirigir a la página principal
      segundosRedireccion: 5
    });
    
    return res.status(200).send(htmlRechazado);
  }

  // Validar token (caso normal de retorno después de intento de pago)
  if (!token) {
    console.log('[Webpay] Token no proporcionado en retorno');
    
    const htmlErrorToken = generarHtmlRespuesta({
      titulo: 'Error en la Transacción',
      mensaje: 'No se recibió información válida de la transacción.',
      detalles: [
        { etiqueta: 'Error', valor: 'Token no proporcionado' }
      ],
      esExito: false,
      redireccion: `${BASE_URL}`,
      segundosRedireccion: 5
    });
    
    return res.status(400).send(htmlErrorToken);
  }

  try {
    console.log('[Webpay] Procesando confirmación de pago con token:', token);
    const transaction = new WebpayPlus.Transaction(options);
    const result = await transaction.commit(token);
    
    console.log('[Webpay] Respuesta de confirmación:', result);

    // Formatear el monto para mostrar
    const montoFormateado = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(result.amount);

    // Buscar el pedido por el token
    const query = "SELECT * FROM pedidos WHERE transbank_token = $1";
    const tokenResult = await pool.query(query, [token]);
    const pedido = tokenResult.rows[0];
    
    if (pedido) {
      console.log('[Webpay] Pedido encontrado:', pedido.id);
      
      // Determinar el nuevo estado basado en la respuesta de Webpay
      const nuevoEstado = result.status === 'AUTHORIZED' ? 'pagado' : 
                          result.status === 'FAILED' ? 'rechazado' : pedido.estado;
      
      try {
        // Actualizar los datos de transacción y estado usando la función auxiliar
        const pedidoActualizado = await actualizarPedido(pedido.id, {
          token: token,
          status: result.status,
          buyOrder: result.buyOrder,
          nuevoEstado: nuevoEstado
        });
        
        console.log("[Webpay] Pedido actualizado después del pago:", pedidoActualizado);
      } catch (error) {
        console.error("[Webpay] Error al actualizar el estado del pedido:", error);
      }
    } else {
      console.warn('[Webpay] No se encontró el pedido asociado al token:', token);
    }

    // Generar respuesta HTML según estado de la transacción
    if (result.status === 'AUTHORIZED') {
      const htmlExito = generarHtmlRespuesta({
        titulo: 'Pago Exitoso',
        mensaje: '¡Tu pago ha sido procesado correctamente!',
        detalles: [
          { etiqueta: 'Orden', valor: result.buyOrder },
          { etiqueta: 'Monto pagado', valor: montoFormateado },
          { etiqueta: 'Estado', valor: 'Autorizado' },
          { etiqueta: 'Fecha', valor: new Date().toLocaleString('es-CL') }
        ],
        esExito: true,
        redireccion: `${BASE_URL}/api/webpay/retorno`,
        segundosRedireccion: 3
      });
      
      return res.status(200).send(htmlExito);
    } else {
      // Transacción no autorizada pero procesada (resultado diferente a AUTHORIZED)
      const htmlNoAutorizado = generarHtmlRespuesta({
        titulo: 'Pago No Autorizado',
        mensaje: 'La transacción fue procesada pero no fue autorizada.',
        detalles: [
          { etiqueta: 'Orden', valor: result.buyOrder },
          { etiqueta: 'Estado', valor: result.status },
          { etiqueta: 'Código', valor: result.responseCode || 'N/A' }
        ],
        esExito: false,
        redireccion: `${BASE_URL}`,
        segundosRedireccion: 5
      });
      
      return res.status(200).send(htmlNoAutorizado);
    }
  } catch (error) {
    console.error('[Webpay] Error al confirmar pago:', error);
    
    // Determinar tipo de error para mensaje más amigable
    let mensajeError = 'Ocurrió un error inesperado al procesar el pago.';
    let detalleError = error.message;
    
    if (error.message.includes('422')) {
      mensajeError = 'La transacción no pudo ser validada. Esto puede ocurrir si la sesión ha expirado.';
      detalleError = 'Sesión inválida o expirada';
    } else if (error.message.includes('timeout')) {
      mensajeError = 'La comunicación con el servidor de pagos ha tardado demasiado.';
      detalleError = 'Tiempo de espera agotado';
    } else if (error.message.includes('network')) {
      mensajeError = 'Hubo un problema de red al comunicarse con el servidor de pagos.';
      detalleError = 'Error de red';
    }
    
    // Intentar buscar el pedido por el token para actualizar su estado
    try {
      const query = "SELECT * FROM pedidos WHERE transbank_token = $1";
      const tokenResult = await pool.query(query, [token]);
      const pedido = tokenResult.rows[0];
      
      if (pedido) {
        // Actualizar estado a error
        await actualizarPedido(pedido.id, {
          status: 'ERROR',
          nuevoEstado: 'error'
        });
        console.log('[Webpay] Pedido marcado con estado de error:', pedido.id);
      }
    } catch (dbError) {
      console.error('[Webpay] Error adicional al intentar actualizar pedido en error:', dbError);
    }
    
    const htmlError = generarHtmlRespuesta({
      titulo: 'Error al Procesar el Pago',
      mensaje: mensajeError,
      detalles: [
        { etiqueta: 'Detalle', valor: detalleError },
        { etiqueta: 'Información', valor: 'Puedes intentar nuevamente más tarde' }
      ],
      esExito: false,
      redireccion: `${BASE_URL}`,
      segundosRedireccion: 5
    });
    
    return res.status(500).send(htmlError);
  }
});

// 3. Ruta GET para mostrar después del pago (pantalla final)
router.get('/retorno', (req, res) => {
  // Usar el generador de HTML para la página final
  const htmlFinal = generarHtmlRespuesta({
    titulo: 'Pago Procesado',
    mensaje: 'Gracias por tu compra. Tu pedido ha sido registrado correctamente.',
    detalles: [
      { etiqueta: 'Estado', valor: 'Completado' },
      { etiqueta: 'Fecha', valor: new Date().toLocaleString('es-CL') }
    ],
    esExito: true
  });
  
  res.status(200).send(htmlFinal);
});

module.exports = router;