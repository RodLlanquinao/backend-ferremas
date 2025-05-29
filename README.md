# FERREMAS Backend API v2.0
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
│   └── webpayController.js  # Controlador para pagos
├── middleware/
│   ├── authMiddleware.js    # Verificación de tokens Firebase
│   ├── errorHandler.js      # Manejo centralizado de errores
│   ├── validation.js        # Validaciones de datos
│   └── cors.js             # Configuración CORS
├── models/
│   ├── BaseModel.js        # Modelo base con métodos comunes
│   ├── Producto.js
│   ├── Usuario.js          # Con campos Firebase
│   ├── Pedido.js           # Con campos Webpay
│   └── Contacto.js
├── routes/
│   ├── auth.routes.js      # Autenticación Firebase
│   ├── productos.routes.js 
│   ├── usuarios.routes.js
│   ├── pedidos.routes.js
│   ├── contacto.routes.js
│   └── webpay.routes.js    # Rutas Webpay Plus
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

- ✅ `productos` - Catálogo de productos
- ✅ `usuarios` - Gestión de usuarios
- ✅ `pedidos` - Sistema de pedidos (ahora con campos de pago)
- ✅ `contactos` - Mensajes de contacto

### Campos adicionales para pagos

La tabla `pedidos` ahora incluye los siguientes campos adicionales:

- ✅ `monto` - Monto total del pedido
- ✅ `transbank_token` - Token de la transacción generado por Webpay
- ✅ `transbank_status` - Estado de la transacción (INICIADA, AUTHORIZED, FAILED, etc.)
- ✅ `buy_order` - Número de orden de compra generado para Webpay

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

### Procesamiento de Pagos (Nuevo)
- `POST /webpay/crear-transaccion` - Iniciar proceso de pago
- `POST /webpay/retorno` - Endpoint de retorno para Webpay
- `GET  /webpay/retorno` - Página final después del pago

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
    "descripcion": "Producto de prueba API"
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

## 🧪 Pruebas y Documentación

### Colección de Postman
El proyecto incluye una colección completa de Postman (`postman_collection.json`) que contiene todos los endpoints disponibles, incluyendo la integración con Transbank.

### Importar la Colección en Postman
1. Abrir Postman
2. Hacer clic en "Import" (Importar)
3. Seleccionar el archivo `postman_collection.json` ubicado en la raíz del proyecto
4. Todas las solicitudes estarán organizadas en carpetas por funcionalidad

### Variables de Entorno en Postman
La colección utiliza las siguientes variables que puedes configurar en tu entorno:
- `producto_id`: ID del producto para pruebas
- `usuario_id`: ID del usuario para pruebas
- `pedido_id`: ID del pedido para pruebas
- `mensaje_id`: ID del mensaje de contacto para pruebas
- `token_ws`: Token de transacción generado por Webpay

### Grupos de Endpoints en la Colección

#### Authentication
- **POST** `/auth/register`: Registrar nuevo usuario con Firebase
- **POST** `/auth/login`: Iniciar sesión (información para cliente)
- **POST** `/auth/verify-token`: Verificar token de Firebase
- **GET** `/auth/me`: Obtener información del usuario autenticado
- **GET** `/auth/status`: Verificar estado de configuración de Firebase

#### Health Check
- **GET** `/`: Endpoint base
- **GET** `/health`: Verificar estado del servidor y BD

#### Productos
- **GET**    `/productos`: Listar todos los productos
- **GET**    `/productos/:id`: Obtener producto por ID
- **GET**    `/productos/categoria/:nombre`: Productos por categoría
- **POST**   `/productos`: Crear producto
- **PUT**    `/productos/:id`: Actualizar producto
- **DELETE** `/productos/:id`: Eliminar producto

#### Usuarios
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
- **POST** `/webpay/crear-transaccion`: Iniciar pago
- **POST** `/webpay/retorno`: Endpoint de retorno tras pago
- **GET**  `/webpay/retorno`: Página final post-pago

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

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abrir un Pull Request

## 📚 Documentación Adicional

- [Documentación de la API](docs/API.md)
- [Guía de Postman](docs/POSTMAN_GUIDE.md) - Incluye instrucciones para pruebas de Firebase

## 🆘 Soporte

Para soporte técnico:
1. Revisar los logs en el archivo `server.log`
2. Verificar el estado de la base de datos PostgreSQL
3. Consultar la documentación de la API
4. Verificar la configuración en el archivo `.env`

---

**Nota sobre Variables de Entorno**: ⚠️ Las variables de entorno están incluidas intencionalmente en el repositorio ya que este es un ambiente académico controlado y las credenciales son de prueba (Webpay Integration).

**Estado**: ✅ Listo para evaluación académica EV3
**Institución**: Instituto Profesional DuocUC - Escuela de Informática
**Equipo**: Felipe López, Rodrigo Llanquinao, Alex Cayuqueo
**Base de Datos**: ✅ Configurada para entorno local
**Última actualización**: 26 de mayo de 2025
**Pruebas Completas**: ✅ Todos los endpoints verificados y funcionales
**Firebase Authentication**: ✅ Sistema de autenticación implementado y probado
**Integración Transbank**: ✅ Funcionando en ambiente de integración
**Pagos con Webpay**: ✅ Flujo completo implementado y probado
