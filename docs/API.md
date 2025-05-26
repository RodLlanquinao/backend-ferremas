# FERREMAS Backend API v2 - Documentación

Esta documentación proporciona detalles completos sobre todos los endpoints disponibles en la API de FERREMAS Backend, incluyendo la nueva integración con Transbank para procesamiento de pagos.

**Versión:** 2.0.0  
**Base URL:** `http://localhost:3000`  
**Última actualización:** 25 de mayo de 2025

## Índice de Contenidos

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Convenciones de la API](#convenciones-de-la-api)
4. [Códigos de Estado](#códigos-de-estado)
5. [Health Check](#health-check)
6. [Productos](#productos)
7. [Usuarios](#usuarios)
8. [Pedidos](#pedidos)
9. [Contacto](#contacto)
10. [Procesamiento de Pagos (Transbank)](#procesamiento-de-pagos-transbank)
11. [Manejo de Errores](#manejo-de-errores)
12. [Ejemplos Completos](#ejemplos-completos)

## Introducción

La API de FERREMAS proporciona endpoints para gestionar productos, usuarios, pedidos, mensajes de contacto y procesamiento de pagos. Esta API está construida con Node.js, Express.js y utiliza PostgreSQL como base de datos.

### Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **PostgreSQL**: Base de datos relacional
- **Transbank SDK**: Para integración de pagos
- **WebpayPlus**: Servicio de pago de Transbank

## Autenticación

La API actualmente no requiere autenticación para acceder a los endpoints. Sin embargo, se recomienda implementar un sistema de autenticación basado en tokens JWT para entornos de producción.

## Convenciones de la API

### Formato de Respuesta

Todas las respuestas de la API siguen un formato estándar:

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {},
  "timestamp": "2025-05-25T23:30:36.415Z"
}
```

Donde:
- `success`: Indica si la operación fue exitosa (boolean)
- `message`: Mensaje descriptivo sobre el resultado de la operación (string)
- `data`: Datos de respuesta específicos del endpoint (object)
- `timestamp`: Marca de tiempo de la respuesta (ISO 8601)

### Formatos de Fecha

Todas las fechas utilizan el formato ISO 8601: `YYYY-MM-DDThh:mm:ss.sssZ`

## Códigos de Estado

La API utiliza los siguientes códigos de estado HTTP:

- `200 OK`: La solicitud se procesó correctamente
- `201 Created`: El recurso se creó correctamente
- `400 Bad Request`: La solicitud contiene datos inválidos
- `404 Not Found`: El recurso solicitado no existe
- `422 Unprocessable Entity`: Los datos de la solicitud son válidos pero no se pueden procesar
- `500 Internal Server Error`: Error interno del servidor

## Health Check

### GET /

Endpoint base que confirma que el servidor está funcionando.

**Respuesta Exitosa (200 OK)**

```json
{
  "status": "OK",
  "message": "FERREMAS Backend API v2 is running",
  "version": "2.0.0",
  "timestamp": "2025-05-25T23:30:32.145Z"
}
```

### GET /health

Verifica el estado del servidor y la conexión a la base de datos.

**Respuesta Exitosa (200 OK)**

```json
{
  "status": "OK",
  "database": "Connected",
  "timestamp": "2025-05-25T23:30:32.145Z",
  "uptime": 23.036652459
}
```

## Productos

### GET /productos

Obtiene todos los productos disponibles.

**Parámetros de consulta (opcionales)**

| Nombre      | Tipo    | Descripción                                 |
|-------------|---------|---------------------------------------------|
| `categoria` | string  | Filtrar por categoría                       |
| `limit`     | integer | Número máximo de resultados (default: 50)   |
| `offset`    | integer | Número de resultados a omitir (default: 0)  |

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 34,
      "nombre": "Sierra Circular",
      "modelo": "SC-1200",
      "marca": "DeWalt",
      "codigo": "DW-SC1200",
      "precio": 89990,
      "stock": 15,
      "categoria": "Herramientas Eléctricas",
      "descripcion": "Sierra circular profesional 1200W"
    },
    {
      "id": 35,
      "nombre": "Martillo",
      "modelo": "M-500",
      "marca": "Stanley",
      "codigo": "ST-M500",
      "precio": 9990,
      "stock": 50,
      "categoria": "Herramientas Manuales",
      "descripcion": "Martillo de carpintero 500g"
    }
  ],
  "timestamp": "2025-05-25T23:30:36.415Z"
}
```

### GET /productos/:id

Obtiene un producto específico por su ID.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del producto    |

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Producto obtenido exitosamente",
  "data": {
    "id": 34,
    "nombre": "Sierra Circular",
    "modelo": "SC-1200",
    "marca": "DeWalt",
    "codigo": "DW-SC1200",
    "precio": 89990,
    "stock": 15,
    "categoria": "Herramientas Eléctricas",
    "descripcion": "Sierra circular profesional 1200W"
  },
  "timestamp": "2025-05-25T23:30:36.415Z"
}
```

**Respuesta de Error (404 Not Found)**

```json
{
  "success": false,
  "message": "Producto no encontrado",
  "timestamp": "2025-05-25T23:30:36.415Z"
}
```

### GET /productos/categoria/:nombre

Obtiene todos los productos de una categoría específica.

**Parámetros de ruta**

| Nombre   | Tipo   | Descripción           |
|----------|--------|-----------------------|
| `nombre` | string | Nombre de la categoría |

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 34,
      "nombre": "Sierra Circular",
      "modelo": "SC-1200",
      "marca": "DeWalt",
      "codigo": "DW-SC1200",
      "precio": 89990,
      "stock": 15,
      "categoria": "Herramientas Eléctricas",
      "descripcion": "Sierra circular profesional 1200W"
    },
    {
      "id": 36,
      "nombre": "Taladro Eléctrico",
      "modelo": "TE-750",
      "marca": "Bosch",
      "codigo": "BS-TE750",
      "precio": 69990,
      "stock": 12,
      "categoria": "Herramientas Eléctricas",
      "descripcion": "Taladro eléctrico 750W con percutor"
    }
  ],
  "timestamp": "2025-05-25T23:30:36.415Z"
}
```

### POST /productos

Crea un nuevo producto en el sistema.

**Cuerpo de la Solicitud (JSON)**

```json
{
  "nombre": "Sierra Circular",
  "modelo": "SC-1200",
  "marca": "DeWalt",
  "codigo": "DW-SC1200",
  "precio": 89990,
  "stock": 15,
  "categoria": "Herramientas Eléctricas",
  "descripcion": "Sierra circular profesional 1200W"
}
```

**Respuesta Exitosa (201 Created)**

```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 56,
    "nombre": "Sierra Circular",
    "modelo": "SC-1200",
    "marca": "DeWalt",
    "codigo": "DW-SC1200",
    "precio": 89990,
    "stock": 15,
    "categoria": "Herramientas Eléctricas",
    "descripcion": "Sierra circular profesional 1200W"
  },
  "timestamp": "2025-05-25T23:30:40.604Z"
}
```

### PUT /productos/:id

Actualiza un producto existente.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del producto    |

**Cuerpo de la Solicitud (JSON)**

```json
{
  "nombre": "Sierra Circular",
  "modelo": "SC-1200",
  "marca": "DeWalt",
  "codigo": "DW-SC1200",
  "precio": 94990,
  "stock": 20,
  "categoria": "Herramientas Eléctricas",
  "descripcion": "Sierra circular profesional 1200W con maleta"
}
```

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 56,
    "nombre": "Sierra Circular",
    "modelo": "SC-1200",
    "marca": "DeWalt",
    "codigo": "DW-SC1200",
    "precio": 94990,
    "stock": 20,
    "categoria": "Herramientas Eléctricas",
    "descripcion": "Sierra circular profesional 1200W con maleta"
  },
  "timestamp": "2025-05-25T23:30:50.123Z"
}
```

### DELETE /productos/:id

Elimina un producto del sistema.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del producto    |

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Producto eliminado correctamente",
  "timestamp": "2025-05-25T23:31:05.789Z"
}
```

## Usuarios

### GET /usuarios/:id

Obtiene los datos de un usuario específico.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del usuario     |

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Usuario obtenido exitosamente",
  "data": {
    "id": 9,
    "nombre": "Ana Martínez",
    "email": "ana.martinez@example.com",
    "telefono": "+56912345678",
    "direccion": "Av. Principal 123",
    "rol": "cliente",
    "created_at": "2025-05-24T15:30:00.000Z",
    "updated_at": "2025-05-24T15:30:00.000Z"
  },
  "timestamp": "2025-05-25T23:31:10.456Z"
}
```

### POST /usuarios

Crea un nuevo usuario en el sistema.

**Cuerpo de la Solicitud (JSON)**

```json
{
  "nombre": "Carlos Rodríguez",
  "email": "carlos.rodriguez@test.com",
  "telefono": "+56912345681",
  "direccion": "Av. Principal 789"
}
```

**Respuesta Exitosa (201 Created)**

```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 10,
    "nombre": "Carlos Rodríguez",
    "email": "carlos.rodriguez@test.com",
    "telefono": "+56912345681",
    "direccion": "Av. Principal 789",
    "rol": "cliente",
    "created_at": "2025-05-25T23:31:20.123Z",
    "updated_at": "2025-05-25T23:31:20.123Z"
  },
  "timestamp": "2025-05-25T23:31:20.123Z"
}
```

### PUT /usuarios/:id

Actualiza los datos de un usuario existente.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del usuario     |

**Cuerpo de la Solicitud (JSON)**

```json
{
  "nombre": "Carlos Alberto Rodríguez",
  "email": "carlos.rodriguez@test.com",
  "rol": "cliente"
}
```

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "data": {
    "id": 10,
    "nombre": "Carlos Alberto Rodríguez",
    "email": "carlos.rodriguez@test.com",
    "telefono": "+56912345681",
    "direccion": "Av. Principal 789",
    "rol": "cliente",
    "created_at": "2025-05-25T23:31:20.123Z",
    "updated_at": "2025-05-25T23:31:30.456Z"
  },
  "timestamp": "2025-05-25T23:31:30.456Z"
}
```

### DELETE /usuarios/:id

Elimina un usuario del sistema.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del usuario     |

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Usuario eliminado correctamente",
  "timestamp": "2025-05-25T23:31:40.789Z"
}
```

## Pedidos

### GET /pedidos/:id

Obtiene los detalles de un pedido específico.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del pedido      |

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Pedido obtenido exitosamente",
  "data": {
    "id": 7,
    "usuario_id": 9,
    "producto_id": 34,
    "cantidad": 1,
    "estado": "pendiente",
    "fecha_pedido": "2025-05-25T20:00:00.000Z",
    "monto": 89990,
    "transbank_token": null,
    "transbank_status": null,
    "buy_order": null,
    "created_at": "2025-05-25T20:00:00.000Z",
    "updated_at": "2025-05-25T20:00:00.000Z",
    "producto_nombre": "Sierra Circular",
    "usuario_nombre": "Ana Martínez"
  },
  "timestamp": "2025-05-25T23:31:50.123Z"
}
```

### GET /pedidos/usuario/:usuarioId

Obtiene todos los pedidos de un usuario específico.

**Parámetros de ruta**

| Nombre      | Tipo    | Descripción         |
|-------------|---------|---------------------|
| `usuarioId` | integer | ID del usuario      |

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Pedidos del usuario obtenidos exitosamente",
  "data": [
    {
      "id": 7,
      "usuario_id": 9,
      "producto_id": 34,
      "cantidad": 1,
      "estado": "pendiente",
      "fecha_pedido": "2025-05-25T20:00:00.000Z",
      "monto": 89990,
      "transbank_token": null,
      "transbank_status": null,
      "buy_order": null,
      "created_at": "2025-05-25T20:00:00.000Z",
      "updated_at": "2025-05-25T20:00:00.000Z",
      "producto_nombre": "Sierra Circular",
      "usuario_nombre": "Ana Martínez"
    },
    {
      "id": 8,
      "usuario_id": 9,
      "producto_id": 35,
      "cantidad": 2,
      "estado": "pagado",
      "fecha_pedido": "2025-05-24T18:30:00.000Z",
      "monto": 19980,
      "transbank_token": "01abc123def456...",
      "transbank_status": "AUTHORIZED",
      "buy_order": "ORD-8-123",
      "created_at": "2025-05-24T18:30:00.000Z",
      "updated_at": "2025-05-24T18:35:00.000Z",
      "producto_nombre": "Martillo",
      "usuario_nombre": "Ana Martínez"
    }
  ],
  "timestamp": "2025-05-25T23:32:00.456Z"
}
```

### POST /pedidos

Crea un nuevo pedido en el sistema.

**Cuerpo de la Solicitud (JSON)**

```json
{
  "producto_id": 34,
  "usuario_id": 9,
  "cantidad": 1,
  "estado": "pendiente"
}
```

**Respuesta Exitosa (201 Created)**

```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "id": 10,
    "usuario_id": 9,
    "producto_id": 34,
    "cantidad": 1,
    "estado": "pendiente",
    "fecha_pedido": "2025-05-25T23:32:10.123Z",
    "monto": 89990,
    "transbank_token": null,
    "transbank_status": null,
    "buy_order": null,
    "created_at": "2025-05-25T23:32:10.123Z",
    "updated_at": "2025-05-25T23:32:10.123Z"
  },
  "timestamp": "2025-05-25T23:32:10.123Z"
}
```

### PUT /pedidos/:id

Actualiza el estado u otros datos de un pedido existente.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del pedido      |

**Cuerpo de la Solicitud (JSON)**

```json
{
  "estado": "completado"
}
```

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Pedido actualizado exitosamente",
  "data": {
    "id": 10,
    "usuario_id": 9,
    "producto_id": 34,
    "cantidad": 1,
    "estado": "completado",
    "fecha_pedido": "2025-05-25T23:32:10.123Z",
    "monto": 89990,
    "transbank_token": "01abc123def456...",
    "transbank_status": "AUTHORIZED",
    "buy_order": "ORD-10-456",
    "created_at": "2025-05-25T23:32:10.123Z",
    "updated_at": "2025-05-25T23:32:20.456Z"
  },
  "timestamp": "2025-05-25T23:32:20.456Z"
}
```

### DELETE /pedidos/:id

Elimina un pedido del sistema.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del pedido      |

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Pedido eliminado correctamente",
  "timestamp": "2025-05-25T23:32:30.789Z"
}
```

## Contacto

### GET /contacto

Obtiene todos los mensajes de contacto.

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Mensajes de contacto obtenidos exitosamente",
  "data": [
    {
      "id": 17,
      "nombre": "Juan Pérez",
      "email": "juan.perez@example.com",
      "asunto": "Consulta sobre productos",
      "mensaje": "Me gustaría saber si tienen taladros inalámbricos disponibles.",
      "fecha": "2025-05-24T16:00:00.000Z"
    },
    {
      "id": 18,
      "nombre": "María González",
      "email": "maria.gonzalez@example.com",
      "asunto": "Problema con mi pedido",
      "mensaje": "Mi pedido número 5 no ha llegado aún.",
      "fecha": "2025-05-25T12:30:00.000Z"
    }
  ],
  "timestamp": "2025-05-25T23:32:40.123Z"
}
```

### GET /contacto/:id

Obtiene un mensaje de contacto específico.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del mensaje     |

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Mensaje de contacto obtenido exitosamente",
  "data": {
    "id": 18,
    "nombre": "María González",
    "email": "maria.gonzalez@example.com",
    "asunto": "Problema con mi pedido",
    "mensaje": "Mi pedido número 5 no ha llegado aún.",
    "fecha": "2025-05-25T12:30:00.000Z"
  },
  "timestamp": "2025-05-25T23:32:50.456Z"
}
```

### POST /contacto

Crea un nuevo mensaje de contacto.

**Cuerpo de la Solicitud (JSON)**

```json
{
  "nombre": "Carlos Rodríguez",
  "email": "carlos.rodriguez@test.com",
  "asunto": "Consulta sobre herramientas eléctricas",
  "mensaje": "Me gustaría saber si tienen más modelos de sierras circulares disponibles."
}
```

**Respuesta Exitosa (201 Created)**

```json
{
  "success": true,
  "message": "Mensaje de contacto enviado exitosamente",
  "data": {
    "id": 19,
    "nombre": "Carlos Rodríguez",
    "email": "carlos.rodriguez@test.com",
    "asunto": "Consulta sobre herramientas eléctricas",
    "mensaje": "Me gustaría saber si tienen más modelos de sierras circulares disponibles.",
    "fecha": "2025-05-25T23:33:00.789Z"
  },
  "timestamp": "2025-05-25T23:33:00.789Z"
}
```

### DELETE /contacto/:id

Elimina un mensaje de contacto.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del mensaje     |

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Mensaje de contacto eliminado correctamente",
  "timestamp": "2025-05-25T23:33:10.123Z"
}
```

## Procesamiento de Pagos (Transbank)

### POST /api/webpay/crear-transaccion

Inicia una transacción de pago con Webpay para un pedido específico.

**Cuerpo de la Solicitud (JSON)**

```json
{
  "pedido_id": 10
}
```

**Respuesta Exitosa (200 OK)**

Retorna un documento HTML con un formulario que redirige automáticamente a Webpay. El documento incluye:

- Token de la transacción
- Formulario con acción hacia la URL de Webpay
- JavaScript para auto-redirigir después de 2 segundos
- Detalles del pedido y monto

El HTML generado contiene:
- Input oculto con el token: `<input type="hidden" name="token_ws" value="01abc123def456..." />`
- Botón para enviar manualmente: `<button type="submit" class="button">Continuar al Pago</button>`
- Auto-redirección: `setTimeout(function() { document.getElementById('webpay-form').submit(); }, 2000);`

### POST /api/webpay/retorno

Endpoint de retorno después del proceso de pago en Webpay. Este endpoint es llamado por Webpay para confirmar el resultado de la transacción.

**Cuerpo de la Solicitud (form-urlencoded)**

```
token_ws=01abc123def456...
```

**Respuesta Exitosa (200 OK)**

Retorna un documento HTML con el resultado de la transacción:

Para transacción exitosa:
- Muestra mensaje de éxito
- Detalles de la orden
- Monto pagado
- Estado de la transacción
- Auto-redirección a la página final

Para transacción fallida:
- Muestra mensaje de error
- Detalles del error
- Opciones para reintentar

### GET /api/webpay/retorno

Página final mostrada después del proceso de pago, a la cual se redirige tras completar el pago.

**Respuesta Exitosa (200 OK)**

Retorna un documento HTML con confirmación final del proceso de pago:
- Mensaje de agradecimiento
- Estado final del pedido
- Instrucciones para continuar

## Manejo de Errores

### Estructura de Respuesta de Error

```json
{
  "success": false,
  "message": "Mensaje descriptivo del error",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detalles técnicos del error (solo en desarrollo)"
  },
  "timestamp": "2025-05-25T23:33:50.789Z"
}
```

### Códigos de Error Comunes

| Código HTTP | Descripción                                           |
|-------------|------------------------------------------------------|
| 400         | Datos de entrada inválidos o incompletos             |
| 404         | Recurso no encontrado                                |
| 422         | Datos válidos pero no procesables (ej. stock insuficiente) |
| 500         | Error interno del servidor                           |

### Errores Específicos de Transbank

| Código | Descripción                             |
|--------|-----------------------------------------|
| TB001  | Error al crear transacción              |
| TB002  | Token inválido o expirado               |
| TB003  | Transacción rechazada por el banco      |
| TB004  | Error de comunicación con Transbank     |

## Ejemplos Completos

### Flujo Completo de Pedido y Pago

1. Crear un nuevo pedido:

```json
// POST /pedidos
{
  "producto_id": 34,
  "usuario_id": 9,
  "cantidad": 1,
  "estado": "pendiente"
}
```

2. Iniciar el proceso de pago:

```json
// POST /api/webpay/crear-transaccion
{
  "pedido_id": 10
}
```

3. El usuario es redirigido a Webpay para completar el pago

4. Webpay redirecciona al usuario a `/api/webpay/retorno` con el resultado

5. Verificar el estado final del pedido:

```json
// GET /pedidos/10
{
  "success": true,
  "message": "Pedido obtenido exitosamente",
  "data": {
    "id": 10,
    "usuario_id": 9,
    "producto_id": 34,
    "cantidad": 1,
    "estado": "pagado",
    "fecha_pedido": "2025-05-25T23:32:10.123Z",
    "monto": 89990,
    "transbank_token": "01abc123def456...",
    "transbank_status": "AUTHORIZED",
    "buy_order": "ORD-10-456",
    "created_at": "2025-05-25T23:32:10.123Z",
    "updated_at": "2025-05-25T23:34:00.456Z"
  },
  "timestamp": "2025-05-25T23:34:00.456Z"
}
```

# 💳 Procesamiento de Pagos con Transbank (Webpay)

La API incluye integración completa con Transbank a través de Webpay Plus para el procesamiento de pagos en línea, permitiendo a los usuarios pagar sus pedidos con tarjetas de crédito y débito.

## Características de la Integración

- **SDK Oficial**: Utiliza la biblioteca oficial de Transbank (v6.0.0)
- **Ambiente**: Integración/Testing
- **Tipo de Transacción**: WebpayPlus
- **Estados**: INICIADA, AUTHORIZED, FAILED, RECHAZADA, ERROR
- **Flujo completo**: Desde la creación de la transacción hasta la confirmación del pago
- **Almacenamiento**: Guarda todos los datos relevantes de la transacción en la base de datos

## 💳 Tarjetas de Prueba

Para realizar pruebas en el ambiente de integración, utiliza las siguientes tarjetas:

### Tarjeta de Crédito VISA (Aprobada)
- **Número**: 4051 8856 0044 6623
- **CVV**: 123
- **Fecha expiración**: Cualquier fecha futura
- **Autenticación**:
  - **RUT**: 11.111.111-1
  - **Clave**: 123

### Tarjeta de Débito (Aprobada)
- **Número**: 4051 8842 3993 7763
- **Autenticación**:
  - **RUT**: 11.111.111-1
  - **Clave**: 123

### Tarjeta de Crédito (Rechazada)
- **Número**: 5186 0595 5959 0568
- **CVV**: 123
- **Fecha expiración**: Cualquier fecha futura

## 🔄 Flujo de Pago

1. **Crear Pedido**: Primero se crea un pedido con estado "pendiente"
2. **Iniciar Transacción**: Se inicia el proceso de pago enviando el ID del pedido
3. **Redirección a Webpay**: El usuario es redirigido a la página de pago de Webpay
4. **Procesamiento de Pago**: El usuario introduce los datos de su tarjeta
5. **Retorno**: Webpay redirige al usuario al endpoint de retorno con el resultado
6. **Confirmación**: Se verifica y registra el resultado de la transacción
7. **Actualización de Pedido**: Se actualiza el estado del pedido en la base de datos
8. **Página Final**: Se muestra una página de confirmación al usuario

## Endpoints de Pago

### POST /api/webpay/crear-transaccion

Inicia una transacción de pago con Webpay para un pedido específico.

**Cuerpo de la Solicitud (JSON)**
```json
{
  "pedido_id": 10
}
```

**Respuesta**

Retorna una página HTML con un formulario que redirige automáticamente a Webpay, incluyendo:
- Token único de la transacción
- Detalles del pedido (número de orden, monto)
- Auto-redirección después de 2 segundos

### POST /api/webpay/retorno

Endpoint de retorno al que Webpay redirige al usuario después del proceso de pago.

**Cuerpo de la Solicitud (form-urlencoded)**
```
token_ws=01abc123def456...
```

En caso de rechazo por parte del usuario, recibe:
```
TBK_TOKEN=01abc123def456...
TBK_ORDEN_COMPRA=ORD-10-456
TBK_ID_SESION=SES-10
```

**Respuesta**

Retorna una página HTML con el resultado de la transacción, adaptada según el resultado:
- **Éxito**: Mensaje de confirmación, detalles de la orden y monto pagado
- **Rechazo**: Mensaje informativo sobre el rechazo del pago
- **Error**: Detalles del error y opciones para reintentar

### GET /api/webpay/retorno

Página final mostrada después del proceso de pago, a la cual se redirige automáticamente.

**Respuesta**

Retorna una página HTML con la confirmación final y un mensaje de agradecimiento.

## ✨ Características Técnicas

- **Manejo de Tokens**: Generación y verificación automática de tokens de transacción
- **Verificación de Estado**: Consulta del estado actual de una transacción
- **Registro Detallado**: Almacenamiento completo de la información de pago
- **Respuestas HTML**: Páginas HTML responsive para mejor experiencia de usuario
- **Auto-redirección**: Redirección automática en momentos clave del flujo
- **Manejo de Errores**: Tratamiento específico para cada tipo de error posible

## 🔍 Ejemplos de Respuestas

### Ejemplo 1: Respuesta de Creación de Transacción

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Procesando Pago - Ferremas</title>
    <style>
        /* Estilos CSS responsive */
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
            <p><strong>Orden:</strong> ORD-10-456</p>
            <p><strong>Monto:</strong> $89.990</p>
            <p><strong>Estado:</strong> Iniciando pago</p>
        </div>
        <form id="webpay-form" method="POST" action="https://webpay3gint.transbank.cl/webpayserver/initTransaction">
            <input type="hidden" name="token_ws" value="01abc123def456..." />
            <button type="submit" class="button">Continuar al Pago</button>
        </form>
        <p class="loading">Redirigiendo automáticamente en 2 segundos...</p>
    </div>
    <script>
        setTimeout(function() {
            document.getElementById('webpay-form').submit();
        }, 2000);
    </script>
</body>
</html>
```

### Ejemplo 2: Respuesta de Transacción Exitosa

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pago Exitoso - Ferremas</title>
    <style>
        /* Estilos CSS responsive */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Pago Exitoso</h1>
        </div>
        <p class="message">¡Tu pago ha sido procesado correctamente!</p>
        <div class="details">
            <p><strong>Orden:</strong> ORD-10-456</p>
            <p><strong>Monto pagado:</strong> $89.990</p>
            <p><strong>Estado:</strong> Autorizado</p>
            <p><strong>Fecha:</strong> 25-05-2025 23:34:00</p>
        </div>
        <p class="loading">Redirigiendo en 3 segundos...</p>
        <script>
            setTimeout(function() {
                window.location.href = 'http://localhost:3000/api/webpay/retorno';
            }, 3000);
        </script>
    </div>
</body>
</html>
```

## 🔧 Herramientas de Prueba

El proyecto incluye herramientas específicas para probar el flujo de pago:

1. **Script Node.js Multiplataforma**:
   ```bash
   node webpay-test.js
   ```

2. **Script Bash para Mac/Linux**:
   ```bash
   chmod +x webpay-test.sh
   ./webpay-test.sh
   ```

3. **Colección de Postman**:
   El proyecto incluye una colección completa de Postman con todos los endpoints, incluyendo los de procesamiento de pagos.

## 📋 Verificación Post-Pago

Para verificar el estado final de un pedido después del pago:

```http
GET /pedidos/{id}
```

**Respuesta de Ejemplo (Pedido Pagado)**:
```json
{
  "success": true,
  "message": "Pedido obtenido exitosamente",
  "data": {
    "id": 10,
    "usuario_id": 9,
    "producto_id": 34,
    "cantidad": 1,
    "estado": "pagado",
    "fecha_pedido": "2025-05-25T23:32:10.123Z",
    "monto": 89990,
    "transbank_token": "01abc123def456...",
    "transbank_status": "AUTHORIZED",
    "buy_order": "ORD-10-456",
    "created_at": "2025-05-25T23:32:10.123Z",
    "updated_at": "2025-05-25T23:34:00.456Z",
    "producto_nombre": "Sierra Circular",
    "usuario_nombre": "Ana Martínez"
  },
  "timestamp": "2025-05-25T23:34:00.456Z"
}
```
