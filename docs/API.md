# FERREMAS API Documentation v2.1

## Índice

1. [Introducción](#1-introducción)
2. [Autenticación](#2-autenticación)
3. [Productos](#3-productos)
4. [Usuarios](#4-usuarios)
5. [Pedidos](#5-pedidos)
6. [Contacto](#6-contacto)
7. [Webpay (Pagos)](#7-webpay-pagos)
8. [Catálogo de Bodega](#8-catálogo-de-bodega)
9. [Solicitudes de Sucursales](#9-solicitudes-de-sucursales)
10. [Gestión de Errores](#10-gestión-de-errores)

## 1. Introducción

La API de FERREMAS proporciona acceso programático al catálogo de productos, gestión de usuarios, sistema de pedidos, procesamiento de pagos con Webpay, catálogo de productos en bodega y sistema de solicitudes desde sucursales.

### Base URL

```
http://localhost:8000
```

### Formato de Respuestas

Todas las respuestas siguen la siguiente estructura:

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {},
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

- `success`: Booleano que indica si la operación fue exitosa
- `message`: Mensaje descriptivo sobre el resultado
- `data`: Datos de la respuesta (puede ser un objeto, array o null)
- `timestamp`: Fecha y hora de la respuesta

### Códigos de Estado HTTP

- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Error en los datos enviados
- `401 Unauthorized`: No autenticado o token inválido
- `403 Forbidden`: No tiene permisos suficientes
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error en el servidor

## 2. Autenticación

La API utiliza Firebase Authentication para la gestión de usuarios. Para acceder a endpoints protegidos, se debe incluir un token JWT en el encabezado `Authorization`.

### Encabezado de Autenticación

```
Authorization: Bearer <token_jwt>
```

### Endpoints de Autenticación

#### Registrar nuevo usuario

- **URL**: `/auth/register`
- **Método**: `POST`
- **Autenticación**: No requerida
- **Descripción**: Registra un nuevo usuario en Firebase

##### Cuerpo de la Petición

```json
{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "nombre": "Nombre Usuario",
  "telefono": "912345678",
  "direccion": "Av. Ejemplo 123"
}
```

##### Respuesta Exitosa

- **Código**: 201 Created
- **Contenido**:

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "uid": "firebase-uid-123456",
    "email": "usuario@example.com",
    "nombre": "Nombre Usuario"
  },
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

#### Iniciar sesión

- **URL**: `/auth/login`
- **Método**: `POST`
- **Autenticación**: No requerida
- **Descripción**: Proporciona información para iniciar sesión con Firebase en el cliente

##### Cuerpo de la Petición

```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

##### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Datos para inicio de sesión",
  "data": {
    "apiKey": "firebase-api-key",
    "authDomain": "proyecto-firebase.firebaseapp.com",
    "projectId": "proyecto-firebase"
  },
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

#### Verificar Token

- **URL**: `/auth/verify-token`
- **Método**: `POST`
- **Autenticación**: Requerida
- **Descripción**: Verifica si un token JWT es válido

##### Cuerpo de la Petición

```json
{
  "token": "token-jwt-firebase"
}
```

##### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "uid": "firebase-uid-123456",
    "email": "usuario@example.com"
  },
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

## 3. Productos

Endpoints para la gestión de productos.

### Obtener todos los productos

- **URL**: `/productos`
- **Método**: `GET`
- **Autenticación**: No requerida
- **Descripción**: Obtiene todos los productos

#### Parámetros de Consulta (Query)

- Ninguno

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Martillo de carpintero",
      "modelo": "H100",
      "marca": "Stanley",
      "codigo": "STN-M100",
      "precio": 5990,
      "stock": 25,
      "categoria": "Herramientas Manuales",
      "descripcion": "Martillo ergonómico con cabeza de acero templado",
      "bodega_id": 1,
      "stock_bodega": 20,
      "ubicacion_bodega": "Estante A2-B3",
      "stock_minimo": 5
    },
    // ... más productos
  ],
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

### Obtener producto por ID

- **URL**: `/productos/:id`
- **Método**: `GET`
- **Autenticación**: No requerida
- **Descripción**: Obtiene los detalles de un producto específico

#### Parámetros de Ruta

- `id` - ID del producto a obtener

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Producto obtenido exitosamente",
  "data": {
    "id": 1,
    "nombre": "Martillo de carpintero",
    "modelo": "H100",
    "marca": "Stanley",
    "codigo": "STN-M100",
    "precio": 5990,
    "stock": 25,
    "categoria": "Herramientas Manuales",
    "descripcion": "Martillo ergonómico con cabeza de acero templado",
    "bodega_id": 1,
    "stock_bodega": 20,
    "ubicacion_bodega": "Estante A2-B3",
    "stock_minimo": 5
  },
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

### Obtener productos por categoría

- **URL**: `/productos/categoria/:nombre`
- **Método**: `GET`
- **Autenticación**: No requerida
- **Descripción**: Obtiene productos filtrados por categoría

#### Parámetros de Ruta

- `nombre` - Nombre de la categoría

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Similar a la respuesta de "Obtener todos los productos" pero filtrado por categoría

### Crear producto

- **URL**: `/productos`
- **Método**: `POST`
- **Autenticación**: Requerida (admin)
- **Descripción**: Crea un nuevo producto

#### Cuerpo de la Petición

```json
{
  "nombre": "Alicate universal",
  "modelo": "AL-UNI",
  "marca": "Total",
  "codigo": "TTL-ALUNI",
  "precio": 4990,
  "stock": 30,
  "categoria": "Herramientas Manuales",
  "descripcion": "Alicate de alta calidad para trabajos de precisión",
  "bodega_id": 1,
  "stock_bodega": 25,
  "ubicacion_bodega": "Estante A3-B4",
  "stock_minimo": 5
}
```

#### Respuesta Exitosa

- **Código**: 201 Created
- **Contenido**:

```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 8,
    "nombre": "Alicate universal",
    "modelo": "AL-UNI",
    "marca": "Total",
    "codigo": "TTL-ALUNI",
    "precio": 4990,
    "stock": 30,
    "categoria": "Herramientas Manuales",
    "descripcion": "Alicate de alta calidad para trabajos de precisión",
    "bodega_id": 1,
    "stock_bodega": 25,
    "ubicacion_bodega": "Estante A3-B4",
    "stock_minimo": 5,
    "created_at": "2025-05-29T15:30:00.000Z",
    "updated_at": "2025-05-29T15:30:00.000Z"
  },
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

### Actualizar producto

- **URL**: `/productos/:id`
- **Método**: `PUT`
- **Autenticación**: Requerida (admin)
- **Descripción**: Actualiza un producto existente

#### Parámetros de Ruta

- `id` - ID del producto a actualizar

#### Cuerpo de la Petición

```json
{
  "nombre": "Alicate universal actualizado",
  "precio": 5990,
  "stock_bodega": 30,
  "ubicacion_bodega": "Estante A3-B5"
}
```

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Producto actualizado con todos sus campos

### Eliminar producto

- **URL**: `/productos/:id`
- **Método**: `DELETE`
- **Autenticación**: Requerida (admin)
- **Descripción**: Elimina un producto existente

#### Parámetros de Ruta

- `id` - ID del producto a eliminar

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Producto \"Alicate universal\" eliminado correctamente",
  "data": null,
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

## 4. Usuarios

Endpoints para la gestión de usuarios.

### Obtener todos los usuarios

- **URL**: `/usuarios`
- **Método**: `GET`
- **Autenticación**: Requerida (admin)
- **Descripción**: Obtiene todos los usuarios registrados

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Admin Usuario",
      "email": "admin@ferremas.com",
      "telefono": "912345678",
      "direccion": "Av. Admin 123",
      "rol": "admin",
      "firebase_uid": "firebase-uid-123456"
    },
    // ... más usuarios
  ],
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

### Obtener usuario por ID

- **URL**: `/usuarios/:id`
- **Método**: `GET`
- **Autenticación**: Requerida
- **Descripción**: Obtiene los detalles de un usuario específico

#### Parámetros de Ruta

- `id` - ID del usuario a obtener

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Usuario con el ID especificado

### Crear usuario

- **URL**: `/usuarios`
- **Método**: `POST`
- **Autenticación**: Requerida (admin)
- **Descripción**: Crea un nuevo usuario (solo datos locales, no en Firebase)

#### Cuerpo de la Petición

```json
{
  "nombre": "Nuevo Usuario",
  "email": "nuevo@example.com",
  "telefono": "987654321",
  "direccion": "Av. Nueva 456",
  "rol": "cliente",
  "firebase_uid": "firebase-uid-654321"
}
```

#### Respuesta Exitosa

- **Código**: 201 Created
- **Contenido**: Usuario creado con todos sus campos

### Actualizar usuario

- **URL**: `/usuarios/:id`
- **Método**: `PUT`
- **Autenticación**: Requerida
- **Descripción**: Actualiza un usuario existente

#### Parámetros de Ruta

- `id` - ID del usuario a actualizar

#### Cuerpo de la Petición

```json
{
  "nombre": "Usuario Actualizado",
  "telefono": "987654321",
  "direccion": "Av. Actualizada 789"
}
```

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Usuario actualizado con todos sus campos

### Eliminar usuario

- **URL**: `/usuarios/:id`
- **Método**: `DELETE`
- **Autenticación**: Requerida (admin)
- **Descripción**: Elimina un usuario existente

#### Parámetros de Ruta

- `id` - ID del usuario a eliminar

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Mensaje de confirmación

## 5. Pedidos

Endpoints para la gestión de pedidos.

### Obtener pedido por ID

- **URL**: `/pedidos/:id`
- **Método**: `GET`
- **Autenticación**: Requerida
- **Descripción**: Obtiene los detalles de un pedido específico

#### Parámetros de Ruta

- `id` - ID del pedido a obtener

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Pedido obtenido exitosamente",
  "data": {
    "id": 1,
    "usuario_id": 1,
    "producto_id": 8,
    "cantidad": 2,
    "estado": "pendiente",
    "fecha_pedido": "2025-05-29T15:30:00.000Z",
    "monto": 9980,
    "transbank_token": null,
    "transbank_status": null,
    "buy_order": "ORD-1-123456",
    "created_at": "2025-05-29T15:30:00.000Z",
    "updated_at": "2025-05-29T15:30:00.000Z",
    "producto": {
      "nombre": "Alicate universal",
      "precio": 4990
    },
    "usuario": {
      "nombre": "Admin Usuario",
      "email": "admin@ferremas.com"
    }
  },
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

### Obtener pedidos por usuario

- **URL**: `/pedidos/usuario/:usuarioId`
- **Método**: `GET`
- **Autenticación**: Requerida
- **Descripción**: Obtiene todos los pedidos de un usuario específico

#### Parámetros de Ruta

- `usuarioId` - ID del usuario

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Lista de pedidos del usuario

### Crear pedido

- **URL**: `/pedidos`
- **Método**: `POST`
- **Autenticación**: Requerida
- **Descripción**: Crea un nuevo pedido

#### Cuerpo de la Petición

```json
{
  "usuario_id": 1,
  "producto_id": 8,
  "cantidad": 2
}
```

#### Respuesta Exitosa

- **Código**: 201 Created
- **Contenido**: Pedido creado con todos sus campos

### Actualizar pedido

- **URL**: `/pedidos/:id`
- **Método**: `PUT`
- **Autenticación**: Requerida
- **Descripción**: Actualiza un pedido existente

#### Parámetros de Ruta

- `id` - ID del pedido a actualizar

#### Cuerpo de la Petición

```json
{
  "cantidad": 3,
  "estado": "pendiente"
}
```

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Pedido actualizado con todos sus campos

### Eliminar pedido

- **URL**: `/pedidos/:id`
- **Método**: `DELETE`
- **Autenticación**: Requerida
- **Descripción**: Elimina un pedido existente

#### Parámetros de Ruta

- `id` - ID del pedido a eliminar

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Mensaje de confirmación

## 6. Contacto

Endpoints para la gestión de mensajes de contacto.

### Obtener todos los mensajes

- **URL**: `/contacto`
- **Método**: `GET`
- **Autenticación**: Requerida (admin)
- **Descripción**: Obtiene todos los mensajes de contacto

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Lista de mensajes de contacto

### Obtener mensaje por ID

- **URL**: `/contacto/:id`
- **Método**: `GET`
- **Autenticación**: Requerida (admin)
- **Descripción**: Obtiene los detalles de un mensaje específico

#### Parámetros de Ruta

- `id` - ID del mensaje a obtener

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Mensaje de contacto con el ID especificado

### Crear mensaje

- **URL**: `/contacto`
- **Método**: `POST`
- **Autenticación**: No requerida
- **Descripción**: Crea un nuevo mensaje de contacto

#### Cuerpo de la Petición

```json
{
  "nombre": "Usuario Test",
  "email": "test@example.com",
  "asunto": "Consulta de Producto",
  "mensaje": "Me gustaría recibir más información sobre el Alicate universal"
}
```

#### Respuesta Exitosa

- **Código**: 201 Created
- **Contenido**: Mensaje creado con todos sus campos

### Eliminar mensaje

- **URL**: `/contacto/:id`
- **Método**: `DELETE`
- **Autenticación**: Requerida (admin)
- **Descripción**: Elimina un mensaje existente

#### Parámetros de Ruta

- `id` - ID del mensaje a eliminar

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Mensaje de confirmación

## 7. Webpay (Pagos)

Endpoints para el procesamiento de pagos con Webpay Plus de Transbank.

### Crear transacción

- **URL**: `/webpay/crear-transaccion`
- **Método**: `POST`
- **Autenticación**: Requerida
- **Descripción**: Inicia el proceso de pago con Webpay

#### Cuerpo de la Petición

```json
{
  "pedido_id": 1,
  "return_url": "http://localhost:8000/webpay/retorno"
}
```

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Transacción iniciada exitosamente",
  "data": {
    "token": "token-webpay-123456",
    "url": "https://webpay.transbank.cl/...",
    "pedido_id": 1
  },
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

### Retorno de Webpay

- **URL**: `/webpay/retorno`
- **Método**: `POST`
- **Descripción**: Endpoint de retorno para Webpay después del pago

#### Cuerpo de la Petición

Datos enviados por Webpay después del proceso de pago.

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Página HTML con resultado del pago

### Página de resultado

- **URL**: `/webpay/retorno`
- **Método**: `GET`
- **Descripción**: Página que muestra el resultado final del pago

#### Parámetros de Consulta (Query)

- `token_ws` - Token generado por Webpay

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Página HTML con resultado del pago

## 8. Catálogo de Bodega

Endpoints para la gestión del catálogo de productos en bodega.

### Obtener productos disponibles en bodega

- **URL**: `/productos/bodega/disponibles`
- **Método**: `GET`
- **Autenticación**: Requerida
- **Descripción**: Obtiene todos los productos con stock disponible en bodega

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Productos disponibles en bodega obtenidos exitosamente",
  "data": [
    {
      "id": 8,
      "nombre": "Alicate universal",
      "modelo": "AL-UNI",
      "marca": "Total",
      "codigo": "TTL-ALUNI",
      "precio": 4990,
      "stock": 31,
      "categoria": "Herramientas Manuales",
      "descripcion": "Mango aislado, corte preciso",
      "bodega_id": 1,
      "stock_bodega": 26,
      "ubicacion_bodega": "Estante A3-B4",
      "stock_minimo": 5,
      "updated_at": "2025-05-29T23:36:18.145Z"
    },
    // ... más productos
  ],
  "timestamp": "2025-05-29T19:36:22.059Z"
}
```

### Obtener productos bajo stock mínimo

- **URL**: `/productos/bodega/bajo-minimo`
- **Método**: `GET`
- **Autenticación**: Requerida (admin)
- **Descripción**: Obtiene todos los productos que están por debajo del stock mínimo definido

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Productos bajo stock mínimo obtenidos exitosamente",
  "data": [
    {
      "id": 37,
      "nombre": "Martillo Demoledor",
      "stock_bodega": 4,
      "stock_minimo": 5,
      // ... otros campos
    },
    // ... más productos
  ],
  "timestamp": "2025-05-29T19:36:22.059Z"
}
```

### Actualizar stock de bodega

- **URL**: `/productos/:id/stock-bodega`
- **Método**: `PUT`
- **Autenticación**: Requerida (admin)
- **Descripción**: Actualiza el stock de bodega para un producto específico

#### Parámetros de Ruta

- `id` - ID del producto a actualizar

#### Cuerpo de la Petición

```json
{
  "stock_bodega": 30
}
```

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Stock de bodega actualizado exitosamente",
  "data": {
    "id": 8,
    "nombre": "Alicate universal",
    "stock_bodega": 30,
    // ... otros campos
  },
  "timestamp": "2025-05-29T19:36:22.059Z"
}
```

## 9. Solicitudes de Sucursales

Endpoints para la gestión de solicitudes de productos desde sucursales a la bodega central.

### Crear solicitud de producto

- **URL**: `/branch-requests`
- **Método**: `POST`
- **Autenticación**: Requerida
- **Descripción**: Crea una nueva solicitud de productos desde una sucursal a la bodega central

#### Cuerpo de la Petición

```json
{
  "sucursal_id": 1,
  "producto_id": 8,
  "cantidad": 5,
  "notas": "Solicitud de prueba para alicate universal"
}
```

#### Respuesta Exitosa

- **Código**: 201 Created
- **Contenido**:

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

### Obtener todas las solicitudes

- **URL**: `/branch-requests`
- **Método**: `GET`
- **Autenticación**: Requerida
- **Descripción**: Obtiene todas las solicitudes de productos

#### Parámetros de Consulta (Query)

- `estado` (opcional) - Filtrar por estado (pendiente, aprobada, rechazada, enviada, recibida)

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Solicitudes obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "sucursal_id": 1,
      "producto_id": 8,
      "cantidad": 5,
      "estado": "recibida",
      "fecha_solicitud": "2025-05-29T23:36:08.391Z",
      "fecha_respuesta": "2025-05-29T23:36:18.145Z",
      "fecha_entrega": "2025-05-29T23:36:30.397Z",
      "usuario_solicitud": 1,
      "usuario_respuesta": 1,
      "notas": "Solicitud de prueba para alicate universal",
      "created_at": "2025-05-29T23:36:08.391Z",
      "updated_at": "2025-05-29T23:36:35.318Z",
      "producto_nombre": "Alicate universal",
      "sucursal_nombre": "Sucursal Principal"
    },
    // ... más solicitudes
  ],
  "timestamp": "2025-05-29T19:36:40.005Z"
}
```

### Obtener solicitud por ID

- **URL**: `/branch-requests/:id`
- **Método**: `GET`
- **Autenticación**: Requerida
- **Descripción**: Obtiene los detalles de una solicitud específica

#### Parámetros de Ruta

- `id` - ID de la solicitud a obtener

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Solicitud obtenida exitosamente",
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
    "updated_at": "2025-05-29T23:36:08.391Z",
    "producto_nombre": "Alicate universal",
    "sucursal_nombre": "Sucursal Principal"
  },
  "timestamp": "2025-05-29T19:36:12.528Z"
}
```

### Obtener solicitudes por sucursal

- **URL**: `/branch-requests/branch/:sucursalId`
- **Método**: `GET`
- **Autenticación**: Requerida
- **Descripción**: Obtiene todas las solicitudes de una sucursal específica

#### Parámetros de Ruta

- `sucursalId` - ID de la sucursal

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**: Similar a la respuesta de "Obtener Todas las Solicitudes" pero filtrado por sucursal

### Aprobar solicitud

- **URL**: `/branch-requests/:id/approve`
- **Método**: `PUT`
- **Autenticación**: Requerida (admin)
- **Descripción**: Aprueba una solicitud pendiente y reduce el stock de bodega

#### Parámetros de Ruta

- `id` - ID de la solicitud a aprobar

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Solicitud aprobada exitosamente",
  "data": {
    "id": 1,
    "sucursal_id": 1,
    "producto_id": 8,
    "cantidad": 5,
    "estado": "aprobada",
    "fecha_solicitud": "2025-05-29T23:36:08.391Z",
    "fecha_respuesta": "2025-05-29T23:36:18.145Z",
    "fecha_entrega": null,
    "usuario_solicitud": 1,
    "usuario_respuesta": 1,
    "notas": "Solicitud de prueba para alicate universal",
    "created_at": "2025-05-29T23:36:08.391Z",
    "updated_at": "2025-05-29T23:36:18.145Z"
  },
  "timestamp": "2025-05-29T19:36:18.746Z"
}
```

### Rechazar solicitud

- **URL**: `/branch-requests/:id/reject`
- **Método**: `PUT`
- **Autenticación**: Requerida (admin)
- **Descripción**: Rechaza una solicitud pendiente

#### Parámetros de Ruta

- `id` - ID de la solicitud a rechazar

#### Cuerpo de la Petición

```json
{
  "motivo": "Stock insuficiente en bodega"
}
```

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Solicitud rechazada exitosamente",
  "data": {
    "id": 2,
    "estado": "rechazada",
    "fecha_respuesta": "2025-05-29T23:40:18.145Z",
    "usuario_respuesta": 1,
    "notas": "Stock insuficiente en bodega",
    // ... otros campos
  },
  "timestamp": "2025-05-29T19:40:18.746Z"
}
```

### Marcar solicitud como enviada

- **URL**: `/branch-requests/:id/ship`
- **Método**: `PUT`
- **Autenticación**: Requerida (admin)
- **Descripción**: Marca una solicitud aprobada como enviada

#### Parámetros de Ruta

- `id` - ID de la solicitud a marcar como enviada

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Solicitud marcada como enviada exitosamente",
  "data": {
    "id": 1,
    "sucursal_id": 1,
    "producto_id": 8,
    "cantidad": 5,
    "estado": "enviada",
    "fecha_solicitud": "2025-05-29T23:36:08.391Z",
    "fecha_respuesta": "2025-05-29T23:36:18.145Z",
    "fecha_entrega": "2025-05-29T23:36:30.397Z",
    "usuario_solicitud": 1,
    "usuario_respuesta": 1,
    "notas": "Solicitud de prueba para alicate universal",
    "created_at": "2025-05-29T23:36:08.391Z",
    "updated_at": "2025-05-29T23:36:30.397Z"
  },
  "timestamp": "2025-05-29T19:36:30.330Z"
}
```

### Marcar solicitud como recibida

- **URL**: `/branch-requests/:id/receive`
- **Método**: `PUT`
- **Autenticación**: Requerida
- **Descripción**: Marca una solicitud enviada como recibida

#### Parámetros de Ruta

- `id` - ID de la solicitud a marcar como recibida

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Solicitud marcada como recibida exitosamente",
  "data": {
    "id": 1,
    "sucursal_id": 1,
    "producto_id": 8,
    "cantidad": 5,
    "estado": "recibida",
    "fecha_solicitud": "2025-05-29T23:36:08.391Z",
    "fecha_respuesta": "2025-05-29T23:36:18.145Z",
    "fecha_entrega": "2025-05-29T23:36:30.397Z",
    "usuario_solicitud": 1,
    "usuario_respuesta": 1,
    "notas": "Solicitud de prueba para alicate universal",
    "created_at": "2025-05-29T23:36:08.391Z",
    "updated_at": "2025-05-29T23:36:35.318Z"
  },
  "timestamp": "2025-05-29T19:36:35.250Z"
}
```

### Eliminar solicitud

- **URL**: `/branch-requests/:id`
- **Método**: `DELETE`
- **Autenticación**: Requerida
- **Descripción**: Elimina una solicitud pendiente

#### Parámetros de Ruta

- `id` - ID de la solicitud a eliminar

#### Respuesta Exitosa

- **Código**: 200 OK
- **Contenido**:

```json
{
  "success": true,
  "message": "Solicitud eliminada exitosamente",
  "data": null,
  "timestamp": "2025-05-29T19:38:35.250Z"
}
```

### Ciclo de Vida de las Solicitudes

Las solicitudes de productos siguen el siguiente ciclo de vida:

1. **pendiente**: Estado inicial cuando se crea una solicitud
2. **aprobada**: La solicitud ha sido aprobada y el stock en bodega ha sido reducido
3. **rechazada**: La solicitud ha sido rechazada (no hay stock suficiente u otros motivos)
4. **enviada**: Los productos han sido enviados desde la bodega a la sucursal
5. **recibida**: La sucursal ha confirmado la recepción de los productos

#### Diagrama de Transiciones de Estado

```
┌───────────┐      ┌───────────┐      ┌───────────┐
│           │──────►           │──────►           │
│ pendiente │      │ aprobada  │      │  enviada  │
│           │      │           │      │           │
└───────────┘      └───────────┘      └───────────┘
      │                                      │
      │                                      │
      ▼                                      ▼
┌───────────┐                         ┌───────────┐
│           │                         │           │
│ rechazada │                         │ recibida  │
│           │                         │           │
└───────────┘                         └───────────┘
```

## 10. Gestión de Errores

Todas las respuestas de error siguen un formato consistente:

```json
{
  "success": false,
  "message": "Mensaje descriptivo del error",
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

### Errores Comunes

#### Recurso No Encontrado

- **Código**: 404 Not Found
- **Contenido**:

```json
{
  "success": false,
  "message": "Producto no encontrado",
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

#### No Autorizado

- **Código**: 401 Unauthorized
- **Contenido**:

```json
{
  "success": false,
  "message": "No autorizado",
  "error": "Token de autenticación no proporcionado",
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

#### Acceso Prohibido

- **Código**: 403 Forbidden
- **Contenido**:

```json
{
  "success": false,
  "message": "Acceso denegado",
  "error": "No tienes permiso para realizar esta acción",
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

#### Error de Validación

- **Código**: 400 Bad Request
- **Contenido**:

```json
{
  "success": false,
  "message": "Error de validación",
  "errors": [
    "El nombre es obligatorio",
    "El precio debe ser un número válido mayor a cero"
  ],
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

#### Error de Stock

- **Código**: 400 Bad Request
- **Contenido**:

```json
{
  "success": false,
  "message": "Stock insuficiente en bodega. Solicitado: 5, Disponible: 3",
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

#### Error de Estado

- **Código**: 400 Bad Request
- **Contenido**:

```json
{
  "success": false,
  "message": "No se puede marcar como recibida porque la solicitud no está enviada. Estado actual: pendiente",
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

#### Error Interno del Servidor

- **Código**: 500 Internal Server Error
- **Contenido**:

```json
{
  "success": false,
  "message": "Error interno del servidor",
  "timestamp": "2025-05-29T15:30:00.000Z"
}
```

# FERREMAS Backend API v2 - Documentación

Esta documentación proporciona detalles completos sobre todos los endpoints disponibles en la API de FERREMAS Backend, incluyendo la autenticación con Firebase y la integración con Transbank para procesamiento de pagos.

**Versión:** 2.0.0  
**Base URL:** `http://localhost:8000`  
**Última actualización:** 26 de mayo de 2025

## Índice de Contenidos

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Firebase Authentication](#firebase-authentication)
4. [Convenciones de la API](#convenciones-de-la-api)
5. [Códigos de Estado](#códigos-de-estado)
6. [Health Check](#health-check)
7. [Productos](#productos)
8. [Usuarios](#usuarios)
9. [Pedidos](#pedidos)
10. [Contacto](#contacto)
11. [Procesamiento de Pagos (Transbank)](#procesamiento-de-pagos-transbank)
12. [Manejo de Errores](#manejo-de-errores)
13. [Ejemplos Completos](#ejemplos-completos)

## Introducción

La API de FERREMAS proporciona endpoints para gestionar productos, usuarios, pedidos, mensajes de contacto, autenticación de usuarios y procesamiento de pagos. Esta API está construida con Node.js, Express.js y utiliza PostgreSQL como base de datos.

### Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **PostgreSQL**: Base de datos relacional
- **Firebase Admin SDK**: Para autenticación de usuarios
- **Transbank SDK**: Para integración de pagos
- **WebpayPlus**: Servicio de pago de Transbank

## Autenticación

La API utiliza Firebase Authentication para gestionar la autenticación de usuarios. Todos los endpoints protegidos requieren un token de ID de Firebase válido que debe enviarse en el encabezado de autorización de la solicitud.

### Headers de Autenticación

Para acceder a los endpoints protegidos, debes incluir el siguiente encabezado HTTP:

```
Authorization: Bearer {firebase_id_token}
```

Donde `{firebase_id_token}` es un token de ID válido generado por Firebase Authentication.

### Obtención del Token

El proceso típico para obtener un token válido es:

1. Registrar un usuario con `/auth/register` (o usar un usuario existente)
2. Iniciar sesión en Firebase desde el cliente
3. Obtener el token de ID de Firebase
4. Verificar el token con `/auth/verify-token`
5. Usar el token en las solicitudes subsiguientes

Para pruebas sin frontend, puedes generar un token de prueba ejecutando:
```bash
node scripts/generate-test-token.js
```

### Endpoints Protegidos

Los siguientes grupos de endpoints requieren autenticación:

- **Usuarios** - Todos los endpoints de usuario requieren autenticación
- **Pedidos** - Todos los endpoints de pedido requieren autenticación
- **Auth** - Los endpoints `/auth/me` requieren autenticación

### Roles de Usuario

La API admite diferentes roles de usuario:

- **cliente** - Acceso básico a sus propios datos y creación de pedidos
- **admin** - Acceso completo a todos los recursos

## Firebase Authentication

La API integra Firebase Authentication para proporcionar un sistema seguro de autenticación de usuarios. Los siguientes endpoints están disponibles para gestionar la autenticación:

### POST /auth/register

Registra un nuevo usuario utilizando Firebase Authentication y crea el registro correspondiente en la base de datos local.

**Cuerpo de la Solicitud (JSON)**

```json
{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "nombre": "Nombre Usuario",
  "rol": "cliente"
}
```

**Respuesta Exitosa (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": 9,
    "nombre": "Nombre Usuario",
    "email": "usuario@example.com",
    "rol": "cliente",
    "uid": "f1r3b4s3u1d123456789"
  },
  "message": "Usuario registrado exitosamente"
}
```

**Respuesta de Error (409 Conflict)**

```json
{
  "success": false,
  "error": "Ya existe un usuario con ese email",
  "status": 409
}
```

### POST /auth/login

Proporciona información para iniciar sesión de usuario. Este endpoint es principalmente informativo - el inicio de sesión real con Firebase debe realizarse en el cliente, que luego enviará el token al backend para verificación.

**Cuerpo de la Solicitud (JSON)**

```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "data": {
    "message": "Usa Firebase Authentication en el cliente para iniciar sesión",
    "email": "usuario@example.com"
  },
  "message": "Información de login enviada"
}
```

**Respuesta de Error (401 Unauthorized)**

```json
{
  "success": false,
  "error": "Credenciales inválidas",
  "status": 401
}
```

### POST /auth/verify-token

Verifica un token de ID de Firebase y devuelve la información del usuario. Este endpoint debe utilizarse después de autenticar en el cliente para obtener la sesión en el backend.

**Cuerpo de la Solicitud (JSON)**

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOTczZWUwZTE..."
}
```

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 9,
      "uid": "f1r3b4s3u1d123456789",
      "email": "usuario@example.com",
      "nombre": "Nombre Usuario",
      "rol": "cliente",
      "emailVerified": true
    }
  },
  "message": "Token verificado correctamente"
}
```

**Respuesta de Error (401 Unauthorized)**

```json
{
  "success": false,
  "error": "Token inválido o expirado",
  "status": 401
}
```

### GET /auth/me

Obtiene la información del usuario autenticado actualmente. Requiere un token de autenticación válido.

**Headers**

```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOTczZWUwZTE...
```

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": 9,
    "uid": "f1r3b4s3u1d123456789",
    "email": "usuario@example.com",
    "nombre": "Nombre Usuario",
    "rol": "cliente",
    "emailVerified": true
  },
  "message": "Información del usuario obtenida exitosamente"
}
```

**Respuesta de Error (401 Unauthorized)**

```json
{
  "success": false,
  "error": "Se requiere token de autenticación",
  "status": 401
}
```

### GET /auth/status

Verifica el estado de la configuración de Firebase en el servidor.

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "data": {
    "status": "Firebase Admin SDK inicializado correctamente",
    "initialized": true,
    "projectId": "ferremas-v2",
    "environment": "development",
    "auth": {
      "status": "Funcional"
    },
    "database": {
      "configured": true,
      "status": "Conectado"
    },
    "config": {
      "hasProjectId": true,
      "hasClientEmail": true,
      "hasPrivateKey": true,
      "hasDatabaseUrl": true
    }
  },
  "message": "Estado de Firebase obtenido exitosamente"
}
```

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
- `401 Unauthorized`: No autenticado o token inválido
- `403 Forbidden`: No autorizado para el recurso solicitado
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

### GET /usuarios

Obtiene todos los usuarios del sistema.

**Headers**

```
Authorization: Bearer {firebase_id_token}
```

**Respuesta Exitosa (200 OK)**

```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Usuario Test",
      "email": "test@example.com",
      "rol": "cliente",
      "created_at": "2025-05-25T23:13:12.386Z",
      "updated_at": "2025-05-25T23:13:12.386Z",
      "firebase_uid": null,
      "email_verified": false,
      "provider": "email",
      "last_login": null,
      "password_hash": null
    },
    {
      "id": 3,
      "nombre": "Cliente Test",
      "email": "cliente.test@test.com",
      "rol": "cliente",
      "created_at": "2025-05-25T23:29:14.599Z",
      "updated_at": "2025-05-25T23:29:14.599Z",
      "firebase_uid": null,
      "email_verified": false,
      "provider": "email",
      "last_login": null,
      "password_hash": null
    }
  ],
  "timestamp": "2025-05-29T16:35:38.391Z"
}
```

### GET /usuarios/:id

Obtiene los datos de un usuario específico.

**Parámetros de ruta**

| Nombre | Tipo    | Descripción        |
|--------|---------|-------------------|
| `id`   | integer | ID del usuario     |

**Headers**

```
Authorization: Bearer {firebase_id_token}
```

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

**Headers**

```
Authorization: Bearer {firebase_id_token}
```

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

**Headers**

```
Authorization: Bearer {firebase_id_token}
```

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

**Headers**

```
Authorization: Bearer {firebase_id_token}
```

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

**Headers**

```
Authorization: Bearer {firebase_id_token}
```

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

**Headers**

```
Authorization: Bearer {firebase_id_token}
```

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

**Headers**

```
Authorization: Bearer {firebase_id_token}
```

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

**Headers**

```
Authorization: Bearer {firebase_id_token}
```

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

**Headers**

```
Authorization: Bearer {firebase_id_token}
```

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
| 401         | No autenticado o token inválido                      |
| 403         | No autorizado para acceder al recurso                |
| 404         | Recurso no encontrado                                |
| 409         | Conflicto (ej. email ya registrado)                  |
| 422         | Datos válidos pero no procesables (ej. stock insuficiente) |
| 500         | Error interno del servidor                           |

### Errores Específicos de Autenticación

| Código | Descripción                                      |
|--------|--------------------------------------------------|
| AUTH001| Credenciales inválidas                           |
| AUTH002| Token expirado                                   |
| AUTH003| Token inválido o malformado                      |
| AUTH004| Usuario no encontrado                            |
| AUTH005| Email ya registrado                              |
| AUTH006| Permisos insuficientes para esta operación       |
| AUTH007| Firebase no inicializado correctamente           |

### Errores Específicos de Transbank

| Código | Descripción                             |
|--------|-----------------------------------------|
| TB001  | Error al crear transacción              |
| TB002  | Token inválido o expirado               |
| TB003  | Transacción rechazada por el banco      |
| TB004  | Error de comunicación con Transbank     |

## Ejemplos Completos

### Flujo Completo de Autenticación y Pedido

1. Registrar un usuario (o usar uno existente):

```json
// POST /auth/register
{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "nombre": "Nombre Usuario",
  "rol": "cliente"
}
```

2. Verificar el token de Firebase obtenido en el cliente:

```json
// POST /auth/verify-token
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOTczZWUwZTE..."
}
```

3. Crear un nuevo pedido (con token de autenticación):

```json
// POST /pedidos
// Headers: Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlOTczZWUwZTE...
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
                window.location.href = 'http://localhost:8000/api/webpay/retorno';
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
