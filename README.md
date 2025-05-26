# FERREMAS Backend API

[![Railway Deployment](https://railway.app/button.svg)](https://railway.app/project/ferremas-backend)

![Node.js](https://img.shields.io/badge/Node.js-v16.13.1-green)
![Express.js](https://img.shields.io/badge/Express.js-v4.17.1-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14.1-orange)
![CORS](https://img.shields.io/badge/CORS-enabled-yellow)
![SSL](https://img.shields.io/badge/SSL-enabled-purple)

## Descripción del Proyecto

FERREMAS Backend es una API REST desarrollada en Node.js y Express.js para gestionar un sistema de ferretería. La aplicación proporciona endpoints para manejar productos, usuarios, pedidos y mensajes de contacto, utilizando PostgreSQL como base de datos. La aplicación está desplegada en Railway y utiliza PostgreSQL como base de datos.

## 🚀 Despliegue en Railway

### URL de Producción
```
http://localhost:3000
```
### Documentación de la API

### Configuración Automática

El proyecto está configurado para desplegarse automáticamente en Railway con:

- ✅ **Contenedor Docker**: Despliegue en contenedor para mejor rendimiento
- ✅ **Base de Datos PostgreSQL**: Integración automática con PostgreSQL de Railway
- ✅ **Variables de Entorno**: Configuración automática desde Railway
- ✅ **CORS**: Configurado para permitir peticiones desde cualquier origen
- ✅ **SSL**: Conexión segura a la base de datos

## Características Principales

- ✅ **Gestión de Productos**: CRUD completo para productos con categorías
- ✅ **Gestión de Usuarios**: Administración de usuarios con roles
- ✅ **Sistema de Pedidos**: Creación y gestión de pedidos
- ✅ **Formulario de Contacto**: Recepción y almacenamiento de mensajes
- ✅ **Base de Datos PostgreSQL**: Conexión segura con SSL
- ✅ **Arquitectura MVC**: Separación clara de responsabilidades

## 📁 Estructura del Proyecto

```
backendferremas/
├── config/
│   ├── database.js          # Configuración de PostgreSQL DB
│   └── environment.js       # Variables de entorno
├── controllers/
│   ├── productosController.js
│   ├── usuariosController.js
│   ├── pedidosController.js
│   └── contactoController.js
├── middleware/
│   ├── errorHandler.js      # Manejo de errores
│   └── validation.js        # Validaciones
├── models/
│   ├── Producto.js
│   ├── Usuario.js
│   ├── Pedido.js
│   └── Contacto.js
├── routes/
│   ├── productos.routes.js
│   ├── usuarios.routes.js
│   ├── pedidos.routes.js
│   └── contacto.routes.js
├── utils/
│   └── responseHelper.js    # Helpers para respuestas
├── docs/
│   ├── API.md              # Documentación de la API
│   └── POSTMAN_GUIDE.md    # Guía de Postman
└── package.json
\`\`\`

## 🔧 Configuración Local

### Desarrollo Local

1. **Clonar y configurar**
   ```bash
   git clone <repository-url>
   cd backendferremas
   npm install
   ```

1. **Configurar variables de entorno**
   Crea un archivo `.env` con las siguientes variables:
   ```
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=tu_url_de_postgresql
   CORS_ORIGIN=*
   ```

2. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

### Despliegue en Railway

1. **Instalar Railway CLI** (opcional)
   ```bash
   npm i -g @railway/cli
   ```

2. **Iniciar sesión en Railway**
   ```bash
   railway login
   ```

3. **Vincular proyecto existente**
   ```bash
   railway link
   ```

4. **Desplegar a Railway**
   ```bash
   railway up
   ```

5. **Configurar variables de entorno en Railway** (también se puede hacer desde el dashboard)
   ```bash
   railway variables set KEY=VALUE
   ```

## Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL
- npm o yarn

## 🗄️ Base de Datos

### Configuración Automática

La base de datos está configurada automáticamente a través de la integración de PostgreSQL en Railway:

- **Host**: Proporcionado por Railway
- **SSL**: Habilitado automáticamente
- **Pool de Conexiones**: Optimizado para contenedores
- **Variables**: Configuradas automáticamente

### Tablas Creadas

Las siguientes tablas están disponibles en la base de datos:

- ✅ \`productos\` - Catálogo de productos
- ✅ \`usuarios\` - Gestión de usuarios
- ✅ \`pedidos\` - Sistema de pedidos
- ✅ \`contactos\` - Mensajes de contacto

## 📡 Endpoints Disponibles

### Estado del Servidor
- `GET /` - Información básica
- `GET /health` - Estado de salud y DB

### Productos
- `GET /productos` - Obtener todos los productos
- `GET /productos/:id` - Obtener producto por ID
- `GET /productos/categoria/:nombre` - Obtener productos por categoría
- `POST /productos` - Crear nuevo producto
- `PUT /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto

### Usuarios
- `GET /usuarios/:id` - Obtener usuario por ID
- `POST /usuarios` - Crear nuevo usuario
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

### Pedidos
- `GET /pedidos/:id` - Obtener pedido por ID
- `GET /pedidos/usuario/:usuarioId` - Por usuario
- `POST /pedidos` - Crear nuevo pedido
- `PUT /pedidos/:id` - Actualizar pedido
- `DELETE /pedidos/:id` - Eliminar pedido

### Contacto
- `GET /contacto` - Obtener todos
- `GET /contacto/:id` - Obtener por ID
- `POST /contacto` - Crear mensaje
- `DELETE /contacto/:id` - Eliminar

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

## 🧪 Pruebas

### Verificar Estado
```bash
curl http://localhost:3000/health
```

### Ejemplos de Uso con Casos Reales

#### Obtener Todos los Productos
```bash
curl http://localhost:3000/productos
```

#### Crear un Producto
```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Product API",
    "modelo": "TEST-API",
    "marca": "TestAPI",
    "codigo": "API-TEST-001",
    "precio": 9990,
    "stock": 10,
    "categoria": "Test",
    "descripcion": "Producto de prueba API"
  }'
```

#### Actualizar un Producto
```bash
curl -X PUT http://localhost:3000/productos/56 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Product API Updated",
    "modelo": "TEST-API",
    "marca": "TestAPI",
    "codigo": "API-TEST-001",
    "precio": 10990,
    "stock": 15,
    "categoria": "Test",
    "descripcion": "Producto de prueba API actualizado"
  }'
```

#### Crear un Usuario
```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Usuario Test API",
    "email": "test.api@example.com",
    "telefono": "+56912345999",
    "direccion": "Calle Test 123"
  }'
```

#### Crear un Pedido
```bash
curl -X POST http://localhost:3000/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 56, 
    "usuario_id": 10, 
    "cantidad": 2, 
    "estado": "pendiente"
  }'
```

#### Crear un Mensaje de Contacto
```bash
curl -X POST http://localhost:3000/contacto \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Usuario Test API",
    "email": "test.api@example.com",
    "asunto": "Test API Message",
    "mensaje": "Este es un mensaje de prueba enviado a través de la API"
  }'
```

## 🔒 Seguridad

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
- ✅ **Estado**: Valores permitidos: "pendiente", "enviado", "completado", "cancelado"

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

Los logs están disponibles en:
- Local: Archivo `server.log` en la raíz del proyecto
- Producción: Dashboard de Railway

## 🚀 Despliegue Automático

El proyecto se despliega automáticamente en Railway cuando:
1. Se hace push al repositorio conectado a Railway
2. Se ejecuta `railway up`
3. Se actualiza desde el dashboard de Railway

## Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **PostgreSQL**: Base de datos relacional
- **pg**: Cliente PostgreSQL para Node.js

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abrir un Pull Request

## 📚 Documentación Adicional

- [Documentación de la API](docs/API.md)
- [Guía de Postman](docs/POSTMAN_GUIDE.md)

## 🆘 Soporte

Para soporte técnico:
1. Revisar los logs en Railway Dashboard
2. Verificar el estado de la base de datos PostgreSQL
3. Consultar la documentación de la API
4. Verificar las variables de entorno en Railway

---

**Estado**: ✅ Desplegado y funcionando en Railway
**Base de Datos**: ✅ Railway PostgreSQL conectada
**Última actualización**: 25 de mayo de 2025
**Pruebas Completas**: ✅ Todos los endpoints verificados y funcionales
