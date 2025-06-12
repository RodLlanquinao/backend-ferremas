# FERREMAS Backend API v2.1
## Instituto Profesional DuocUC - Escuela de Informática

![DuocUC](https://img.shields.io/badge/DuocUC-Integración%20de%20Plataformas-orange)
![Evaluación](https://img.shields.io/badge/Evaluación-EV2-orange)

### Equipo de Desarrollo
- **Felipe López**
- **Rodrigo Llanquinao** 
- **Alex Cayuqueo** 

![Node.js](https://img.shields.io/badge/Node.js-v16.13.1-green)
![Express.js](https://img.shields.io/badge/Express.js-v4.17.1-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14.1-orange)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-yellow)
![CORS](https://img.shields.io/badge/CORS-enabled-yellow)
![SSL](https://img.shields.io/badge/SSL-enabled-purple)
![Transbank](https://img.shields.io/badge/Transbank-integrated-red)
![Webpay](https://img.shields.io/badge/Webpay%20Plus-v6.0.0-brightgreen)

# 🎯 Estado del Proyecto: LISTO PARA EVALUACIÓN EV2

Este proyecto está completamente preparado para su evaluación académica. Incluye:

- ✅ Sistema de pedidos completamente funcional
- ✅ Autenticación con Firebase implementada
- ✅ Integración con Webpay implementada y probada
- ✅ Colección de Postman actualizada con pruebas de Firebase
- ✅ Variables de entorno incluidas (ambiente académico controlado)
- ✅ Documentación completa y actualizada
- ✅ Catálogo de productos de bodega implementado
- ✅ Sistema de solicitudes de productos desde sucursales

## ℹ️ Nota Importante

Este proyecto está configurado específicamente para una evaluación académica en un ambiente controlado. Por esta razón:

- El archivo `.env` está incluido en el repositorio
- Las credenciales de Webpay son de prueba (ambiente de integración)
- La configuración está optimizada para desarrollo local
- El acceso está limitado al equipo evaluador

Esta configuración no sigue las prácticas de seguridad estándar para un ambiente de producción, ya que su propósito es académico y de evaluación dentro del contexto del Instituto Profesional DuocUC.

## 🗺️ Descripción del Proyecto

FERREMAS Backend es una API REST desarrollada en Node.js y Express.js para gestionar un sistema de ferretería con autenticación y procesamiento de pagos integrado. La aplicación proporciona endpoints para manejar productos, usuarios, pedidos, mensajes de contacto, autenticación con Firebase y procesamiento de pagos con Webpay de Transbank, utilizando PostgreSQL como base de datos.

### URL de Desarrollo
```
http://localhost:8000
```
### Documentación de la API 🚀

## Características Principales

- ✅ **Autenticación con Firebase**: Sistema completo de registro, inicio de sesión y verificación de tokens
- ✅ **Gestión de Productos**: CRUD completo para productos con categorías
- ✅ **Gestión de Usuarios**: Administración de usuarios con roles e integración con Firebase
- ✅ **Sistema de Pedidos**: Creación y gestión de pedidos con autenticación
- ✅ **Formulario de Contacto**: Recepción y almacenamiento de mensajes
- ✅ **Procesamiento de Pagos**: Integración completa con Webpay Plus de Transbank
- ✅ **Catálogo de Bodega**: Gestión de productos en bodega con control de stock
- ✅ **Solicitudes de Sucursales**: Sistema para solicitar productos desde sucursales a bodega central
- ✅ **Base de Datos PostgreSQL**: Conexión segura con SSL
- ✅ **Arquitectura MVC**: Separación clara de responsabilidades
- ✅ **Scripts de Prueba**: Herramientas multiplataforma para probar pagos y autenticación

## 📁 Estructura del Proyecto

```
backend-ferremas/
├── config/
│   ├── database.js          # Configuración de PostgreSQL DB
│   ├── environment.js       # Variables de entorno y configuración
│   └── firebase.js         # Config Firebase Auth
├── controllers/
│   ├── productosController.js
│   ├── usuariosController.js 
│   ├── pedidosController.js
│   ├── contactoController.js
│   ├── webpayController.js  # Controlador para pagos
│   └── branchRequestController.js # Controlador para solicitudes de sucursales
├── middleware/
│   ├── authMiddleware.js    # Verificación de tokens Firebase
│   ├── errorHandler.js      # Manejo centralizado de errores
│   ├── validation.js        # Validaciones de datos
│   └── cors.js             # Configuración CORS
├── models/
│   ├── BaseModel.js        # Modelo base con métodos comunes
│   ├── Producto.js         # Extendido con campos de bodega
│   ├── Usuario.js          # Con campos Firebase
│   ├── Pedido.js           # Con campos Webpay
│   ├── Contacto.js
│   └── BranchRequest.js    # Modelo para solicitudes de sucursales
├── routes/
│   ├── auth.routes.js       # Autenticación Firebase
│   ├── productos.routes.js 
│   ├── usuarios.routes.js
│   ├── pedidos.routes.js
│   ├── contacto.routes.js
│   ├── webpay.routes.js     # Rutas Webpay Plus
│   └── branchRequests.routes.js # Rutas para solicitudes de sucursales
├── utils/
│   ├── responseHelper.js   # Formato respuestas API
│   ├── logger.js          # Sistema de logs
│   ├── validators.js      # Funciones de validación
│   └── webpayHelper.js    # Helpers para Webpay
├── tests/
│   ├── integration/       # Pruebas de integración
│   └── unit/             # Pruebas unitarias
├── scripts/
│   ├── test-db.js        # Pruebas conexión DB
│   ├── test-firebase.js  # Pruebas Firebase
│   └── test-webpay.js    # Pruebas Webpay
├── docs/
│   ├── API.md            # Documentación API
│   ├── FIREBASE.md       # Guía Firebase
│   └── WEBPAY.md         # Guía Webpay
├── .env                  # Variables de entorno
├── index.js             # Punto de entrada 
└── package.json
```

## 🔧 Configuración y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd backend-ferremas
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Variables de entorno**
   El archivo `.env` ya está incluido en el proyecto con todas las configuraciones necesarias para el ambiente de evaluación académica, incluyendo las configuraciones de Firebase Authentication y Transbank.

4. **Iniciar el servidor**
   ```bash
   node index.js
   ```

El servidor estará disponible en http://localhost:8000

## Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL
- npm, yarn o pnpm
- Proyecto Firebase (configuración incluida en .env)

## 🗄️ Base de Datos

### Configuración Local
La base de datos PostgreSQL debe estar configurada localmente con las credenciales especificadas en el archivo `.env` incluido en el proyecto.

### Tablas Disponibles

Las siguientes tablas están disponibles en la base de datos:

- ✅ `productos` - Catálogo de productos (extendido con campos de bodega)
- ✅ `usuarios` - Gestión de usuarios
- ✅ `pedidos` - Sistema de pedidos (ahora con campos de pago)
- ✅ `contactos` - Mensajes de contacto
- ✅ `bodegas` - Información de bodegas centrales
- ✅ `sucursales` - Información de sucursales
- ✅ `solicitudes_productos` - Solicitudes de productos desde sucursales a bodega central
- ✅ `inventario_sucursales` - Inventario de productos en sucursales

### Campos adicionales para pagos

La tabla `pedidos` ahora incluye los siguientes campos adicionales:

- ✅ `monto` - Monto total del pedido
- ✅ `transbank_token` - Token de la transacción generado por Webpay
- ✅ `transbank_status` - Estado de la transacción (INICIADA, AUTHORIZED, FAILED, etc.)
- ✅ `buy_order` - Número de orden de compra generado para Webpay

### Campos de bodega en productos

La tabla `productos` ahora incluye los siguientes campos adicionales para gestión de bodega:

- ✅ `bodega_id` - ID de la bodega donde se almacena el producto
- ✅ `stock_bodega` - Cantidad de unidades disponibles en bodega
- ✅ `ubicacion_bodega` - Ubicación física dentro de la bodega (pasillo, estante, etc.)
- ✅ `stock_minimo` - Cantidad mínima que debe mantenerse en stock para reordenar

### Solicitudes de productos desde sucursales

La tabla `solicitudes_productos` contiene los siguientes campos:

- ✅ `id` - ID único de la solicitud
- ✅ `sucursal_id` - ID de la sucursal que realiza la solicitud
- ✅ `producto_id` - ID del producto solicitado
- ✅ `cantidad` - Cantidad solicitada
- ✅ `estado` - Estado de la solicitud (pendiente, aprobada, rechazada, enviada, recibida)
- ✅ `fecha_solicitud` - Fecha de creación de la solicitud
- ✅ `fecha_respuesta` - Fecha de aprobación/rechazo de la solicitud
- ✅ `fecha_entrega` - Fecha de envío/entrega de los productos
- ✅ `usuario_solicitud` - ID del usuario que creó la solicitud
- ✅ `usuario_respuesta` - ID del usuario que aprobó/rechazó la solicitud
- ✅ `notas` - Observaciones adicionales

## 🔌 Endpoints Disponibles

### Estado del Servidor
- `GET /` - Información básica
- `GET /health` - Estado de salud y DB
- `GET /auth/status` - Estado de configuración de Firebase

### Productos
- `GET /productos` - Obtener todos los productos
- `GET /productos/:id` - Obtener producto por ID
- `GET /productos/categoria/:nombre` - Obtener productos por categoría
- `POST /productos` - Crear nuevo producto
- `PUT /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario con Firebase
- `POST /auth/login` - Iniciar sesión de usuario (información para cliente)
- `POST /auth/verify-token` - Verificar token de Firebase
- `GET /auth/me` - Obtener información del usuario autenticado
- `GET /auth/status` - Verificar estado de configuración de Firebase

### Usuarios
- `GET /usuarios` - Obtener todos los usuarios (requiere autenticación)
- `GET /usuarios/:id` - Obtener usuario por ID (requiere autenticación)
- `POST /usuarios` - Crear nuevo usuario (requiere autenticación)
- `PUT /usuarios/:id` - Actualizar usuario (requiere autenticación)
- `DELETE /usuarios/:id` - Eliminar usuario (requiere autenticación)

### Pedidos
- `GET /pedidos/:id` - Obtener pedido por ID (requiere autenticación)
- `GET /pedidos/usuario/:usuarioId` - Por usuario (requiere autenticación)
- `POST /pedidos` - Crear nuevo pedido (requiere autenticación)
- `PUT /pedidos/:id` - Actualizar pedido (requiere autenticación)
- `DELETE /pedidos/:id` - Eliminar pedido (requiere autenticación)

### Contacto
- `GET /contacto` - Obtener todos
- `GET /contacto/:id` - Obtener por ID
- `POST /contacto` - Crear mensaje
- `DELETE /contacto/:id` - Eliminar

### Procesamiento de Pagos
- `POST /webpay/crear-transaccion` - Iniciar proceso de pago
- `POST /webpay/retorno` - Endpoint de retorno para Webpay
- `GET  /webpay/retorno` - Página final después del pago

### Catálogo de Bodega y Solicitudes de Sucursales (Nuevo)
- `GET /productos` - Obtener productos con información de bodega
- `GET /branch-requests` - Obtener todas las solicitudes de productos
- `GET /branch-requests/:id` - Obtener una solicitud específica
- `GET /branch-requests/branch/:sucursalId` - Obtener solicitudes de una sucursal
- `POST /branch-requests` - Crear nueva solicitud de productos
- `PUT /branch-requests/:id/approve` - Aprobar solicitud (reduce stock en bodega)
- `PUT /branch-requests/:id/reject` - Rechazar solicitud
- `PUT /branch-requests/:id/ship` - Marcar solicitud como enviada
- `PUT /branch-requests/:id/receive` - Marcar solicitud como recibida
- `DELETE /branch-requests/:id` - Eliminar una solicitud pendiente

## 📋 Ejemplos de Respuestas

### Formato de Respuesta Estándar
Todas las respuestas de la API siguen este formato estándar:
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {},
  "timestamp": "2025-05-25T23:30:36.415Z"
}
```

### Health Check
```json
{
  "status": "OK",
  "database": "Connected",
  "timestamp": "2025-05-25T23:30:32.145Z",
  "uptime": 23.036652459
}
```

### Productos
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 56,
    "nombre": "Test Product API",
    "modelo": "TEST-API",
    "marca": "TestAPI",
    "codigo": "API-TEST-001",
    "precio": 9990,
    "stock": 10,
    "categoria": "Test",
    "descripcion": "Producto de prueba API",
    "bodega_id": 1,
    "stock_bodega": 15,
    "ubicacion_bodega": "A-12-3",
    "stock_minimo": 5
  },
  "timestamp": "2025-05-25T23:30:40.604Z"
}
```

### Pedidos
```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "id": 10,
    "usuario_id": 10,
    "producto_id": 56,
    "cantidad": 2,
    "estado": "pendiente",
    "fecha_pedido": "2025-05-25T23:30:59.845Z",
    "created_at": "2025-05-25T23:30:59.845Z",
    "updated_at": "2025-05-25T23:30:59.845Z"
  },
  "timestamp": "2025-05-25T23:31:00.275Z"
}
```

### Contacto
```json
{
  "success": true,
  "message": "Mensaje de contacto enviado exitosamente",
  "data": {
    "id": 18,
    "nombre": "Usuario Test API",
    "email": "test.api@example.com",
    "asunto": "Test API Message",
    "mensaje": "Este es un mensaje de prueba enviado a través de la API",
    "fecha": "2025-05-25T04:00:00.000Z"
  },
  "timestamp": "2025-05-25T23:31:07.164Z"
}
```

### Solicitud de Productos desde Sucursal
```json
{
  "success": true,
  "message": "Solicitud de producto creada exitosamente",
  "data": {
    "id": 1,
    "sucursal_id": 1,
    "producto_id": 8,
    "cantidad": 5,
    "estado": "pendiente",
    "fecha_solicitud": "2025-05-29T23:36:08.391Z",
    "fecha_respuesta": null,
    "fecha_entrega": null,
    "usuario_solicitud": 1,
    "usuario_respuesta": null,
    "notas": "Solicitud de prueba para alicate universal",
    "created_at": "2025-05-29T23:36:08.391Z",
    "updated_at": "2025-05-29T23:36:08.391Z"
  },
  "timestamp": "2025-05-29T19:36:08.326Z"
}
```

## 🧪 Pruebas y Documentación

### Colección de Postman
El proyecto incluye una colección completa de Postman (`postman_collection.json`) en español que contiene todos los endpoints disponibles, incluyendo la integración con Transbank y la gestión de bodega. La colección está completamente documentada en español para facilitar su uso.

### Importar la Colección en Postman
1. Abrir Postman
2. Hacer clic en "Import" (Importar)
3. Seleccionar el archivo `postman_collection.json` ubicado en la raíz del proyecto
4. Todas las solicitudes estarán organizadas en carpetas por funcionalidad, con nombres y descripciones en español

### Variables de Entorno en Postman
La colección utiliza las siguientes variables que puedes configurar en tu entorno:
- `producto_id`: ID del producto para pruebas
- `usuario_id`: ID del usuario para pruebas
- `pedido_id`: ID del pedido para pruebas
- `mensaje_id`: ID del mensaje de contacto para pruebas
- `token_ws`: Token de transacción generado por Webpay

### Grupos de Endpoints en la Colección

#### Autenticación
- **POST** `/auth/register`: Registrar nuevo usuario
- **POST** `/auth/login`: Iniciar sesión
- **POST** `/auth/verify-token`: Verificar token
- **GET** `/auth/me`: Obtener información del usuario actual
- **GET** `/auth/status`: Verificar estado de la configuración

#### Verificación de Salud
- **GET** `/`: Endpoint base
- **GET** `/health`: Verificar estado del servidor y BD

#### Productos y Gestión de Bodega
- **GET**    `/productos`: Listar todos los productos
- **GET**    `/productos/:id`: Obtener producto por ID
- **GET**    `/productos/categoria/:nombre`: Productos por categoría
- **POST**   `/productos`: Crear producto
- **PUT**    `/productos/:id`: Actualizar producto
- **DELETE** `/productos/:id`: Eliminar producto
- **GET**    `/productos/bodega/disponibles`: Productos disponibles en almacén
- **GET**    `/productos/:id/stock-bodega`: Consultar stock en almacén
- **PUT**    `/productos/:id/stock-bodega`: Actualizar stock en almacén
- **GET**    `/productos/bodega/bajo-stock`: Productos bajo stock mínimo

#### Usuarios
- **GET**    `/usuarios`: Listar todos los usuarios
- **GET**    `/usuarios/:id`: Obtener usuario
- **POST**   `/usuarios`: Crear usuario
- **PUT**    `/usuarios/:id`: Actualizar usuario
- **DELETE** `/usuarios/:id`: Eliminar usuario

#### Pedidos
- **GET**    `/pedidos/:id`: Obtener pedido
- **GET**    `/pedidos/usuario/:usuarioId`: Pedidos por usuario
- **POST**   `/pedidos`: Crear pedido
- **PUT**    `/pedidos/:id`: Actualizar pedido
- **DELETE** `/pedidos/:id`: Eliminar pedido

#### Contacto
- **GET**    `/contacto`: Listar mensajes
- **GET**    `/contacto/:id`: Obtener mensaje
- **POST**   `/contacto`: Crear mensaje
- **DELETE** `/contacto/:id`: Eliminar mensaje

#### Webpay (Procesamiento de Pagos)
- **POST** `/api/webpay/crear-transaccion`: Iniciar proceso de pago
- **POST** `/api/webpay/retorno`: Retorno después del pago
- **GET**  `/api/webpay/retorno`: Página final post-pago

#### Gestión de Solicitudes de Sucursales
- **GET**  `/branch-requests`: Listar solicitudes
- **GET**  `/branch-requests/:id`: Obtener solicitud por ID
- **GET**  `/branch-requests/branch/:sucursalId`: Solicitudes por sucursal
- **POST** `/branch-requests`: Crear solicitud de productos
- **PUT**  `/branch-requests/:id/approve`: Aprobar solicitud
- **PUT**  `/branch-requests/:id/reject`: Rechazar solicitud
- **PUT**  `/branch-requests/:id/ship`: Marcar como enviada
- **PUT**  `/branch-requests/:id/receive`: Marcar como recibida

### Pruebas de Procesamiento de Pagos con Transbank

#### Flujo Completo de Prueba de Pago

1. **Crear un pedido** (usando Postman)
   - Usar la solicitud "Crear pedido" en la carpeta "Pedidos"
   - Configurar la variable `pedido_id` con el ID recibido

2. **Iniciar el pago** (3 opciones)
   - **Opción 1 - Postman**: Usar la solicitud "Crear transacción" en la carpeta "Webpay"
   - **Opción 2 - Script Node.js** (multiplataforma):
     ```bash
     # Funciona en Windows, Mac y Linux
     node webpay-test.js
     ```

3. **Completar el pago en Webpay**
   - Se abrirá una página web con el formulario de pago
   - Utilizar las tarjetas de prueba (información más abajo)

4. **Verificar resultado**
   - Después del pago, serás redirigido a la página de confirmación
   - Verificar en la base de datos que el pedido se ha actualizado correctamente

### Datos de prueba para Transbank

#### Tarjeta de Crédito VISA (Aprobada)
- Número: 4051 8856 0044 6623
- CVV: 123
- Fecha expiración: Cualquiera en el futuro
- RUT: 11.111.111-1
- Clave: 123

#### Tarjeta de Débito (Aprobada)
- Número Tarjeta: 4051 8842 3993 7763
- RUT: 11.111.111-1
- Clave: 123

#### Para RECHAZAR un pago
- Tarjeta: 5186 0595 5959 0568
- CVV: 123
- Expiración: Cualquiera en el futuro

### Diagrama de Flujo de Pago

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. Crear   │     │ 2. Iniciar  │     │  3. Webpay  │
│   Pedido    │────▶│    Pago     │────▶│  Formulario │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
┌─────────────┐     ┌─────────────┐            ▼
│ 6. Mostrar  │     │ 5. Procesar │     ┌─────────────┐
│Confirmación │◀────│  Resultado  │◀────│ 4. Ingresar │
└─────────────┘     └─────────────┘     │   Tarjeta   │
                                        └─────────────┘
```

## 🔒 Seguridad

- ✅ **Firebase Authentication**: Autenticación segura con Firebase
- ✅ **JWT Tokens**: Verificación de tokens para rutas protegidas
- ✅ **CORS**: Configurado para desarrollo y producción
- ✅ **Validación**: Validación de entrada en todos los endpoints
- ✅ **SSL**: Conexión segura a la base de datos
- ✅ **Error Handling**: Manejo seguro de errores sin exposición de datos

### Validaciones Implementadas

El sistema implementa validaciones exhaustivas en todos los endpoints:

#### Productos
- ✅ **Nombre**: Obligatorio, string
- ✅ **Modelo**: Obligatorio, string único
- ✅ **Marca**: Obligatorio, string
- ✅ **Código**: Obligatorio, string único
- ✅ **Precio**: Obligatorio, numérico positivo
- ✅ **Stock**: Obligatorio, entero positivo
- ✅ **Categoría**: Obligatorio, string
- ✅ **Descripción**: Obligatorio, string
- ✅ **Stock de Bodega**: Opcional, entero positivo
- ✅ **Ubicación en Bodega**: Opcional, string
- ✅ **Stock Mínimo**: Opcional, entero positivo

#### Usuarios
- ✅ **Nombre**: Obligatorio, string
- ✅ **Email**: Obligatorio, formato válido, único
- ✅ **Teléfono**: Opcional, formato válido
- ✅ **Dirección**: Opcional, string
- ✅ **Rol**: Asignado automáticamente como "cliente"

#### Pedidos
- ✅ **Producto ID**: Obligatorio, debe existir
- ✅ **Usuario ID**: Obligatorio, debe existir
- ✅ **Cantidad**: Obligatorio, entero positivo
- ✅ **Stock**: Verificación automática de disponibilidad
- ✅ **Estado**: Valores permitidos: "pendiente", "pagado", "enviado", "completado", "cancelado", "error"
- ✅ **Monto**: Calculado automáticamente en base al precio del producto y cantidad
- ✅ **Token Transbank**: Generado automáticamente al iniciar un pago
- ✅ **Estado Transbank**: Actualizado automáticamente según respuesta de Webpay
- ✅ **Orden de Compra**: Generado automáticamente con formato ORD-{id}-{random}

#### Contacto
- ✅ **Nombre**: Obligatorio, string
- ✅ **Email**: Obligatorio, formato válido
- ✅ **Asunto**: Obligatorio, string
- ✅ **Mensaje**: Obligatorio, string

#### Solicitudes de Productos
- ✅ **Sucursal ID**: Obligatorio, debe existir
- ✅ **Producto ID**: Obligatorio, debe existir
- ✅ **Cantidad**: Obligatorio, entero positivo
- ✅ **Estado**: Valores permitidos: "pendiente", "aprobada", "rechazada", "enviada", "recibida"
- ✅ **Usuario Solicitud**: ID del usuario que crea la solicitud
- ✅ **Notas**: Opcional, string

## 📊 Monitoreo y Logging

### Health Check
El endpoint `/health` proporciona:
- Estado del servidor
- Conectividad de la base de datos
- Tiempo de actividad
- Timestamp actual

### Sistema de Logs Detallado

El backend implementa un sistema de logs detallado que captura:

- ✅ **Conexiones a la Base de Datos**: Inicio, estado del pool y actividad
- ✅ **Requests HTTP**: Método, ruta, parámetros y timestamp
- ✅ **Operaciones CRUD**: Detalles de las operaciones en la base de datos
- ✅ **Validaciones**: Resultados de las validaciones de datos
- ✅ **Gestión de Stock**: Actualizaciones de stock en tiempo real
- ✅ **Errores**: Captura detallada de excepciones

### Formato de Logs

Los logs utilizan un formato estructurado para facilitar el análisis:

```
📝 [MÉTODO] [RUTA] - [TIMESTAMP]
[COMPONENTE] [ACCIÓN] [DETALLES]
```

Ejemplo real:
```
📝 POST /pedidos - 2025-05-25T23:14:53.646Z
[Pedidos Route] POST /
[createPedido] Verificando existencia del producto ID: 34
[createPedido] Producto encontrado: { id: 34, nombre: 'Sierra Circular', stock: 20 }
[createPedido] Stock actualizado exitosamente de 20 a 19
```

### Monitoreo en Tiempo Real

Los logs están disponibles en el archivo `server.log` en la raíz del proyecto.

## 🚀 Despliegue

Para iniciar el servidor localmente:
```bash
node index.js
```

## Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **PostgreSQL**: Base de datos relacional
- **pg**: Cliente PostgreSQL para Node.js
- **Firebase Admin SDK**: Biblioteca oficial para autenticación con Firebase
- **Transbank SDK**: Biblioteca oficial para integración con Webpay
- **WebpayPlus**: Servicio de pago de Transbank

## 💳 Integración con Transbank

### Flujo de Pago

1. **Creación del Pedido**: Se crea un pedido en la base de datos con estado "pendiente"
2. **Inicio de Pago**: Se inicia el proceso de pago con una petición a `/api/webpay/crear-transaccion`
3. **Generación de Token**: Se genera un token único para la transacción y se actualiza en la base de datos
4. **Redirección a Webpay**: El usuario es redirigido a la página de pago de Webpay
5. **Proceso de Pago**: El usuario ingresa los datos de su tarjeta en Webpay
6. **Retorno**: Webpay redirecciona al usuario al endpoint `/api/webpay/retorno`
7. **Confirmación**: Se verifica el estado de la transacción y se actualiza el pedido
8. **Finalización**: Se muestra al usuario una página de confirmación

### Modos de Integración

- **Ambiente**: Integración (Testing)
- **Tipo de Integración**: REST API con SDK oficial
- **Versión SDK**: 6.0.0
- **Tipo de Transacción**: WebpayPlus
- **Estados de Transacción**: INICIADA, AUTHORIZED, FAILED, RECHAZADA, ERROR

### Herramientas de Prueba

- **webpay-test.js**: Script de prueba multiplataforma (Windows, Mac, Linux)
- **webpay-test.sh**: Script bash para Mac/Linux
- **curl**: Ejemplos de peticiones directas a la API

## 📚 Documentación Adicional

- [Documentación de la API](docs/API.md)
- [Guía de Postman](docs/POSTMAN_GUIDE.md) - Incluye instrucciones para pruebas de Firebase

## 🆘 Soporte

Para soporte técnico:
1. Revisar los logs en el archivo `server.log`
2. Verificar el estado de la base de datos PostgreSQL
3. Consultar la documentación de la API
4. Verificar la configuración en el archivo `.env`

## 🏬 Gestión de Bodega y Sucursales

### Flujo de Solicitud de Productos

1. **Creación de Solicitud**: La sucursal crea una solicitud de productos a la bodega central
2. **Revisión de Solicitud**: El administrador de bodega revisa la solicitud
3. **Aprobación**: Si hay stock suficiente, la solicitud es aprobada y se reduce el stock de bodega
4. **Envío**: Los productos son marcados como enviados a la sucursal
5. **Recepción**: La sucursal confirma la recepción de los productos

### Diagrama de Flujo de Solicitudes

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. Crear   │     │ 2. Aprobar  │     │  3. Enviar  │
│  Solicitud  │────▶│  Solicitud  │────▶│  Productos  │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               ▼
┌─────────────┐                         ┌─────────────┐
│ 5. Actualizar│                        │ 4. Recibir  │
│  Inventario  │◀───────────────────────│  Productos  │
└─────────────┘                         └─────────────┘
```

### Características de Gestión de Stock

- ✅ **Control de Stock**: Seguimiento en tiempo real del stock en bodega
- ✅ **Stock Mínimo**: Alerta cuando el stock está por debajo del mínimo definido
- ✅ **Ubicaciones**: Registro de ubicación física de productos en bodega
- ✅ **Validación**: Verificación automática de stock disponible al aprobar solicitudes
- ✅ **Trazabilidad**: Seguimiento completo del ciclo de vida de las solicitudes

---

**Estado**: ✅ Listo para evaluación académica EV2
**Institución**: Instituto Profesional DuocUC - Escuela de Informática
**Equipo**: Felipe López, Rodrigo Llanquinao, Alex Cayuqueo
**Base de Datos**: ✅ Configurada para entorno local
**Última actualización**: 29 de mayo de 2025
**Pruebas Completas**: ✅ Todos los endpoints verificados y funcionales
**Firebase Authentication**: ✅ Sistema de autenticación implementado y probado
**Integración Transbank**: ✅ Funcionando en ambiente de integración
**Pagos con Webpay**: ✅ Flujo completo implementado y probado
**Gestión de Bodega**: ✅ Sistema de catálogo de bodega implementado
**Solicitudes de Sucursales**: ✅ Sistema completo de solicitudes implementado
