#!/usr/bin/env node

/**
 * ============================================================
 *  WEBPAY TEST - Script para generar y abrir página de pago
 * ============================================================
 *
 * Este script:
 * 1. Realiza una petición a la API para crear una transacción
 * 2. Guarda la respuesta HTML en un archivo
 * 3. Abre el archivo en el navegador predeterminado
 *
 * Compatible con Windows y Mac
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const readline = require('readline');
const { exec } = require('child_process');

// Colores para la consola
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Configuración
const CONFIG = {
  outputFile: 'webpay-payment.html',
  serverUrl: 'http://localhost:8000',
  apiPath: '/api/webpay/crear-transaccion'
};

// Información de tarjetas de prueba
const TEST_CARDS_INFO = `
DATOS DE PRUEBA PARA TRANSBANK:
-------------------------------
Tarjeta de Crédito VISA (Aprobada):
  Número: 4051 8856 0044 6623
  CVV: 123
  Fecha expiración: Cualquiera en el futuro
  
Tarjeta de Débito (Aprobada):
  Número Tarjeta: 4051 8842 3993 7763

Autenticación para tarjeta de crédito/débito (Aprobada): 
  RUT: 11.111.111-1
  Clave: 123

Para RECHAZAR un pago use:
  Tarjeta: 5186 0595 5959 0568
  CVV: 123
  Expiración: Cualquiera en el futuro
`;

// Función para mostrar mensajes con colores
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  let coloredMessage;
  
  switch (type) {
    case 'error':
      coloredMessage = `${colors.red}ERROR (${timestamp}): ${message}${colors.reset}`;
      break;
    case 'success':
      coloredMessage = `${colors.green}ÉXITO (${timestamp}): ${message}${colors.reset}`;
      break;
    case 'info':
      coloredMessage = `${colors.blue}INFO (${timestamp}): ${message}${colors.reset}`;
      break;
    case 'warning':
      coloredMessage = `${colors.yellow}AVISO (${timestamp}): ${message}${colors.reset}`;
      break;
    default:
      coloredMessage = message;
  }
  
  console.log(coloredMessage);
}

// Función para abrir un archivo en el navegador (multiplataforma)
function openInBrowser(filePath) {
  const absolutePath = path.resolve(filePath);
  const fileUrl = `file://${absolutePath}`;

  // Determinar el comando según la plataforma
  let command;
  switch (process.platform) {
    case 'darwin': // macOS
      command = `open "${absolutePath}"`;
      break;
    case 'win32': // Windows
      command = `start "" "${fileUrl}"`;
      break;
    default: // Linux y otros
      command = `xdg-open "${fileUrl}"`;
  }

  // Ejecutar el comando
  exec(command, (error) => {
    if (error) {
      log(`No se pudo abrir automáticamente el archivo en el navegador: ${error.message}`, 'error');
      log(`Por favor, abra manualmente el archivo: ${absolutePath}`, 'info');
    }
  });
}

// Función para hacer una petición HTTP
function makeRequest(url, pedidoId) {
  return new Promise((resolve, reject) => {
    // Preparar los datos de la petición
    const postData = JSON.stringify({ pedido_id: pedidoId });
    
    // Opciones de la petición
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    // Hacer la petición
    const req = http.request(url, options, (res) => {
      let data = '';
      
      // Recibir los datos
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // Al finalizar
      res.on('end', () => {
        if (res.statusCode !== 200) {
          // Intentar extraer el mensaje de error si es JSON
          try {
            const errorObj = JSON.parse(data);
            reject({
              statusCode: res.statusCode,
              message: errorObj.error || 'Error desconocido',
              data
            });
          } catch (e) {
            // Si no es JSON, devolver el texto tal cual
            reject({
              statusCode: res.statusCode,
              message: `Error del servidor (HTTP ${res.statusCode})`,
              data
            });
          }
        } else {
          resolve({
            statusCode: res.statusCode,
            data
          });
        }
      });
    });
    
    // Manejar errores de la petición
    req.on('error', (error) => {
      reject({
        statusCode: 0,
        message: `Error de conexión: ${error.message}`,
        error
      });
    });
    
    // Enviar los datos
    req.write(postData);
    req.end();
  });
}

// Función para extraer información del HTML
function extractInfoFromHtml(html) {
  const info = {};
  
  // Extraer el token
  const tokenMatch = html.match(/name="token_ws" value="([^"]+)"/);
  if (tokenMatch && tokenMatch[1]) {
    info.token = tokenMatch[1];
  }
  
  // Extraer la orden
  const ordenMatch = html.match(/<p><strong>Orden:<\/strong> ([^<]+)<\/p>/);
  if (ordenMatch && ordenMatch[1]) {
    info.orden = ordenMatch[1].trim();
  }
  
  // Extraer el monto
  const montoMatch = html.match(/<p><strong>Monto:<\/strong> ([^<]+)<\/p>/);
  if (montoMatch && montoMatch[1]) {
    info.monto = montoMatch[1].trim();
  }
  
  return info;
}

// Función principal
async function main() {
  console.log(`${colors.blue}============================================================${colors.reset}`);
  console.log(`${colors.blue}  WEBPAY TEST - Script para generar y abrir página de pago${colors.reset}`);
  console.log(`${colors.blue}============================================================${colors.reset}`);
  console.log('');
  
  // Mostrar información de las tarjetas de prueba
  console.log(`${colors.yellow}${TEST_CARDS_INFO}${colors.reset}`);
  
  // Crear interfaz para leer la entrada del usuario
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // Solicitar el ID del pedido
  rl.question(`${colors.yellow}Ingrese el ID del pedido que desea pagar: ${colors.reset}`, async (pedidoId) => {
    // Validar la entrada
    if (!pedidoId || !/^\d+$/.test(pedidoId)) {
      log('El ID del pedido debe ser un número válido.', 'error');
      rl.close();
      return;
    }
    
    // Convertir a número
    const pedidoIdNum = parseInt(pedidoId, 10);
    
    try {
      // Verificar que el servidor esté en línea
      log(`Verificando conexión con el servidor (${CONFIG.serverUrl})...`, 'info');
      
      // Construir la URL completa
      const apiUrl = new URL(CONFIG.apiPath, CONFIG.serverUrl).toString();
      
      // Realizar la petición
      log(`Solicitando página de pago para el pedido ${pedidoIdNum}...`, 'info');
      const response = await makeRequest(apiUrl, pedidoIdNum);
      
      // Guardar la respuesta en un archivo
      const outputPath = path.resolve(CONFIG.outputFile);
      fs.writeFileSync(outputPath, response.data);
      
      // Verificar que la respuesta sea HTML
      if (!response.data.includes('<!DOCTYPE html>')) {
        log('La respuesta no es un archivo HTML válido.', 'error');
        rl.close();
        return;
      }
      
      // Extraer información del HTML
      const info = extractInfoFromHtml(response.data);
      
      // Mostrar información
      log(`Página de pago generada correctamente en: ${CONFIG.outputFile}`, 'success');
      console.log(`${colors.yellow}Detalles de la transacción:${colors.reset}`);
      console.log(`  - Pedido: ${colors.yellow}${pedidoIdNum}${colors.reset}`);
      
      if (info.orden) {
        console.log(`  - Orden: ${colors.yellow}${info.orden}${colors.reset}`);
      }
      
      if (info.monto) {
        console.log(`  - Monto: ${colors.yellow}${info.monto}${colors.reset}`);
      }
      
      if (info.token) {
        // Mostrar sólo parte del token por seguridad
        const tokenStart = info.token.substring(0, 10);
        const tokenEnd = info.token.substring(info.token.length - 10);
        console.log(`  - Token: ${colors.yellow}${tokenStart}...${tokenEnd}${colors.reset}`);
      }
      
      // Abrir el archivo en el navegador
      log('Abriendo la página de pago en su navegador...', 'info');
      openInBrowser(outputPath);
      
      log('Proceso completado. Se ha abierto la página de pago en su navegador.', 'success');
      console.log(`${colors.yellow}Recuerde utilizar los datos de prueba que aparecen arriba para completar el pago.${colors.reset}`);
      
      // Instrucciones finales
      console.log('');
      console.log(`${colors.blue}===============================================${colors.reset}`);
      console.log(`${colors.yellow}Para realizar otro pago, ejecute este script nuevamente.${colors.reset}`);
      console.log(`${colors.blue}===============================================${colors.reset}`);
      
    } catch (error) {
      log(`${error.message}`, 'error');
      if (error.data) {
        console.log(`Respuesta detallada: ${error.data.substring(0, 200)}...`);
      }
    } finally {
      rl.close();
    }
  });
}

// Ejecutar el script
main();

