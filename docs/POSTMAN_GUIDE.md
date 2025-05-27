# Guía de Postman para FERREMAS Backend API v2

Esta guía proporciona instrucciones detalladas para utilizar la colección de Postman incluida con el proyecto, que permite probar todos los endpoints de la API de FERREMAS Backend, incluyendo la nueva integración con Transbank para procesamiento de pagos.

**Versión:** 2.0.0  
**Última actualización:** 25 de mayo de 2025

## Índice de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Importación de la Colección](#importación-de-la-colección)
3. [Configuración del Entorno](#configuración-del-entorno)
4. [Pruebas Básicas](#pruebas-básicas)
5. [Pruebas de Autenticación con Firebase](#pruebas-de-autenticación-con-firebase)
6. [Pruebas de Pago con Transbank](#pruebas-de-pago-con-transbank)
6. [Respuestas de Ejemplo](#respuestas-de-ejemplo)
7. [Solución de Problemas](#solución-de-problemas)
8. [Consejos Avanzados](#consejos-avanzados)

## Requisitos Previos

Para utilizar esta colección de Postman, necesitarás:

1. **Postman**: Descargar e instalar la última versión desde [postman.com](https://www.postman.com/downloads/)
2. **FERREMAS Backend**: El servidor debe estar en ejecución en `http://localhost:8000`
3. **Base de datos**: PostgreSQL configurado y funcionando
4. **Firebase**: Configuración de Firebase completada en el backend (variables de entorno configuradas)

## Importación de la Colección

1. Abre Postman
2. Haz clic en el botón "Import" en la esquina superior izquierda
3. Selecciona la pestaña "File" y haz clic en "Upload Files"
4. Navega hasta la ubicación del archivo `postman_collection.json` (en la raíz del proyecto)
5. Selecciona el archivo y haz clic en "Open"
6. Haz clic en "Import" para confirmar

Una vez importada, verás la colección "FERREMAS Backend API" en el panel izquierdo de Postman.

## Configuración del Entorno

Para facilitar las pruebas, es recomendable crear un entorno con variables:

### Crear un Nuevo Entorno

1. Haz clic en el icono de engranaje (⚙️) en la esquina superior derecha
2. Selecciona "Environments" en el menú desplegable
3. Haz clic en el botón "+" para crear un nuevo entorno
4. Nombra el entorno como "FERREMAS Local"

### Configurar Variables de Entorno

Añade las siguientes variables al entorno:

| Variable       | Valor Inicial   | Descripción                              |
|----------------|-----------------|------------------------------------------|
| `base_url`     | `http://localhost:8000` | URL base del servidor               |
| `producto_id`  | `34`            | ID de un producto existente para pruebas |
| `usuario_id`   | `9`             | ID de un usuario existente para pruebas  |
| `pedido_id`    | `10`            | ID de un pedido para pruebas             |
| `mensaje_id`   | `17`            | ID de un mensaje de contacto para pruebas|
| `token_ws`     | _vacío_         | Se llenará automáticamente durante las pruebas de pago |
| `firebase_id_token` | _vacío_     | Token de ID de Firebase para autenticación |
| `test_user_email` | `test@example.com` | Email de usuario de prueba para Firebase |
| `test_user_password` | `password123` | Contraseña de usuario de prueba para Firebase |

5. Haz clic en "Save" para guardar el entorno
6. Selecciona "FERREMAS Local" en el desplegable de entornos en la esquina superior derecha de Postman

## Pruebas Básicas

La colección está organizada en carpetas por funcionalidad. Aquí te explicamos cómo usar cada grupo de endpoints:

### Health Check

1. Expande la carpeta "Health Check"
2. Selecciona "Base endpoint" o "Health check"
3. Haz clic en "Send" para verificar que el servidor está funcionando

### Productos

#### Listar Productos
1. Expande la carpeta "Productos"
2. Selecciona "Listar productos"
3. Haz clic en "Send" para obtener todos los productos

#### Crear un Producto
1. Selecciona "Crear producto"
2. En la pestaña "Body", verifica que los datos JSON del producto sean correctos
3. Haz clic en "Send"
4. Si la creación es exitosa, copia el ID del producto creado
5. Actualiza la variable de entorno `producto_id` con este valor

### Usuarios

#### Crear un Usuario
1. Expande la carpeta "Usuarios"
2. Selecciona "Crear usuario"
3. En la pestaña "Body", verifica que los datos JSON del usuario sean correctos
4. Haz clic en "Send"
5. Si la creación es exitosa, copia el ID del usuario creado
6. Actualiza la variable de entorno `usuario_id` con este valor

### Pedidos

#### Crear un Pedido
1. Expande la carpeta "Pedidos"
2. Selecciona "Crear pedido"
3. En la pestaña "Body", verifica que `producto_id` y `usuario_id` correspondan a registros existentes
4. Haz clic en "Send"
5. Si la creación es exitosa, copia el ID del pedido creado
6. Actualiza la variable de entorno `pedido_id` con este valor

### Contacto

#### Enviar un Mensaje de Contacto
1. Expande la carpeta "Contacto"
2. Selecciona "Crear mensaje"
3. En la pestaña "Body", verifica que los datos JSON del mensaje sean correctos
4. Haz clic en "Send"

## Pruebas de Autenticación con Firebase

La aplicación ahora incluye autenticación con Firebase. La carpeta "Authentication" en la colección contiene todos los endpoints necesarios para probar el flujo de autenticación.

### Requisitos para Pruebas de Autenticación

Para realizar pruebas de autenticación con Firebase, necesitarás:

1. **Proyecto Firebase**: Configurado correctamente en el backend
2. **Variables de Entorno**: Las variables `firebase_id_token`, `test_user_email` y `test_user_password` configuradas en tu entorno Postman

### Flujo de Autenticación Paso a Paso

#### 1. Verificar Estado de Firebase

Antes de iniciar las pruebas de autenticación, es recomendable verificar que Firebase esté correctamente configurado:

1. Expande la carpeta "Authentication"
2. Selecciona "Firebase Status"
3. Haz clic en "Send"
4. Verifica que la respuesta indique que Firebase está inicializado correctamente

#### 2. Registrar un Nuevo Usuario

1. Selecciona "Register"
2. En la pestaña "Body", verifica que los datos JSON tengan el formato:
   ```json
   {
     "email": "{{test_user_email}}",
     "password": "{{test_user_password}}",
     "nombre": "Usuario Test",
     "rol": "cliente"
   }
   ```
3. Haz clic en "Send"
4. Si el registro es exitoso, guarda el ID del usuario en la variable `usuario_id`

> **NOTA**: Para pruebas en un entorno ya configurado, puedes omitir este paso si ya tienes usuarios registrados.

#### 3. Iniciar Sesión y Obtener Token

Para obtener un token de Firebase para las pruebas, hay dos opciones:

**Opción 1: Usando una aplicación cliente de Firebase**
1. Usa una aplicación cliente (web, móvil) para iniciar sesión con Firebase
2. Obtén el token ID (`idToken`) después de la autenticación
3. Copia este token y actualiza la variable de entorno `firebase_id_token` en Postman

**Opción 2: Usando la verificación de token en Postman**
1. Selecciona "Verify Token" en la carpeta "Authentication"
2. En el cuerpo de la solicitud, proporciona un token válido:
   ```json
   {
     "idToken": "tu_token_de_firebase_aquí"
   }
   ```
3. Envía la solicitud para verificar que el token sea válido

#### 4. Obtener Información del Usuario Autenticado

Una vez que tengas un token válido:

1. Selecciona "Get User Info" en la carpeta "Authentication"
2. Verifica que el encabezado de autorización tenga el formato:
   ```
   Authorization: Bearer {{firebase_id_token}}
   ```
3. Haz clic en "Send"
4. La respuesta debe contener la información del usuario autenticado

### Usando Firebase Authentication en Otros Endpoints

Todos los endpoints protegidos ahora requieren un token de Firebase válido. Para usarlos:

1. Asegúrate de tener un valor válido en la variable `firebase_id_token`
2. Verifica que el encabezado de autorización esté presente en las solicitudes:
   ```
   Authorization: Bearer {{firebase_id_token}}
   ```

### Ejemplos de Respuestas de Autenticación

#### Respuesta de Registro Exitoso

```json
{
  "success": true,
  "data": {
    "id": 9,
    "nombre": "Usuario Test",
    "email": "test@example.com",
    "rol": "cliente",
    "uid": "f1r3b4s3u1d123456789"
  },
  "message": "Usuario registrado exitosamente"
}
```

#### Respuesta de Verificación de Token

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 9,
      "uid": "f1r3b4s3u1d123456789",
      "email": "test@example.com",
      "nombre": "Usuario Test",
      "rol": "cliente",
      "emailVerified": true
    }
  },
  "message": "Token verificado correctamente"
}
```

#### Error por Token Inválido

```json
{
  "success": false,
  "error": "Token inválido o expirado",
  "status": 401
}
```

## Pruebas de Pago con Transbank

La carpeta "Webpay" contiene los endpoints para procesar pagos. A continuación se detalla cómo realizar un flujo completo de pago:

### Preparación para Pruebas de Pago

1. **Crear un Pedido**: Primero debes tener un pedido existente para procesar el pago.
   - Usa la solicitud "Crear pedido" en la carpeta "Pedidos"
   - Asegúrate de que se haya creado correctamente y actualiza la variable `pedido_id`

2. **Configurar el Entorno**: Asegúrate de que tu entorno tenga la variable `pedido_id` actualizada con el ID del pedido a pagar.

### Flujo de Pago Paso a Paso

#### 1. Iniciar Transacción

1. Expande la carpeta "Webpay"
2. Selecciona "Crear transacción"
3. En la pestaña "Body", verifica que el JSON tenga el formato:
   ```json
   {
     "pedido_id": {{pedido_id}}
   }
   ```
4. Haz clic en "Send"

> **NOTA**: Esta solicitud retornará una página HTML. Para continuar con el flujo de pago, necesitarás abrir esta página en un navegador web.

#### 2. Guardar la Página HTML

1. En la respuesta, haz clic en la pestaña "Body"
2. Selecciona todo el contenido HTML (Ctrl+A o Cmd+A)
3. Guarda el contenido en un archivo con extensión `.html` (por ejemplo, `payment.html`)
4. Abre este archivo en tu navegador web

#### 3. Completar el Pago en Webpay

Una vez abierta la página en el navegador:

1. El navegador te redirigirá automáticamente a Webpay después de 2 segundos
2. En la página de Webpay, usa una de las tarjetas de prueba:

**Tarjeta de Crédito (Aprobada):**
- **Número**: 4051 8856 0044 6623
- **CVV**: 123
- **Fecha de Expiración**: Cualquier fecha futura
- **Autenticación**:
  - **RUT**: 11.111.111-1
  - **Clave**: 123

3. Completa el proceso de pago en Webpay
4. Serás redirigido a la página de resultado

#### 4. Verificar el Resultado

Para verificar el estado final del pedido después del pago:

1. En Postman, selecciona "Obtener pedido por ID" en la carpeta "Pedidos"
2. Asegúrate de que la URL tenga el formato: `{{base_url}}/pedidos/{{pedido_id}}`
3. Haz clic en "Send"
4. Verifica que:
   - El estado del pedido haya cambiado a "pagado"
   - El campo `transbank_status` muestre "AUTHORIZED"
   - El campo `transbank_token` contenga un valor

### Escenarios de Prueba para Transbank

#### Escenario 1: Pago Exitoso

Sigue los pasos anteriores usando la tarjeta de crédito aprobada.

#### Escenario 2: Pago Rechazado

1. Inicia la transacción como se explicó anteriormente
2. En la página de Webpay, usa la tarjeta de crédito rechazada:
   - **Número**: 5186 0595 5959 0568
   - **CVV**: 123
   - **Fecha de Expiración**: Cualquier fecha futura
3. Completa el proceso y verifica que el pedido mantenga su estado "pendiente"

#### Escenario 3: Pago Cancelado por el Usuario

1. Inicia la transacción como se explicó anteriormente
2. En la página de Webpay, haz clic en "Cancelar" o cierra la ventana
3. Verifica que el pedido mantenga su estado "pendiente"

## Respuestas de Ejemplo

### Respuesta al Crear un Producto

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
    "descripcion": "Sierra circular profesional 1200W",
    "created_at": "2025-05-25T23:30:40.604Z",
    "updated_at": "2025-05-25T23:30:40.604Z"
  },
  "timestamp": "2025-05-25T23:30:40.604Z"
}
```

### Respuesta al Crear un Pedido

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

### Respuesta de Pedido Después del Pago

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

## Solución de Problemas

### El servidor no responde

**Problema**: Al enviar solicitudes, recibes errores de conexión.

**Solución**: 
1. Verifica que el servidor esté en ejecución ejecutando: `node index.js`
2. Comprueba que la URL base sea correcta en el entorno de Postman
3. Prueba el endpoint de health check: `GET /health`

### Errores de autenticación con Firebase

**Problema**: Recibes errores 401 Unauthorized en endpoints protegidos.

**Solución**:
1. Verifica que Firebase esté correctamente configurado con `GET /auth/status`
2. Asegúrate de tener un token válido en la variable `firebase_id_token`
3. Comprueba que el token no haya expirado (duran 1 hora por defecto)
4. Verifica el formato del encabezado: `Authorization: Bearer {{firebase_id_token}}`
5. Obtén un nuevo token realizando el flujo de autenticación desde el principio

### Error al crear un pedido

**Problema**: Recibes un error 400 al crear un pedido.

**Solución**:
1. Verifica que `producto_id` y `usuario_id` existan en la base de datos
2. Asegúrate de que el stock del producto sea suficiente para la cantidad solicitada
3. Comprueba que todos los campos requeridos estén presentes en el cuerpo de la solicitud

### Error al iniciar transacción de pago

**Problema**: La solicitud a `/api/webpay/crear-transaccion` falla.

**Solución**:
1. Verifica que el pedido exista y tenga estado "pendiente"
2. Asegúrate de que el pedido tenga un monto válido (mayor a cero)
3. Comprueba que la solicitud tenga el formato correcto:
   ```json
   {
     "pedido_id": 10
   }
   ```

### No puedo abrir la página HTML de pago

**Problema**: Después de guardar la respuesta HTML, no se abre correctamente en el navegador.

**Solución**:
1. Asegúrate de guardar el archivo con extensión `.html`
2. Verifica que el archivo se haya guardado correctamente con todo el contenido HTML
3. Intenta abrirlo con otro navegador
4. Alternativamente, usa el script incluido en el proyecto para generar la página automáticamente:
   ```bash
   node webpay-test.js
   ```

### El pago se procesa pero el pedido no se actualiza

**Problema**: Completaste el pago en Webpay, pero el estado del pedido sigue como "pendiente".

**Solución**:
1. Verifica los logs del servidor para identificar posibles errores
2. Comprueba que la URL de retorno configurada sea correcta
3. Asegúrate de que el token de la transacción sea válido
4. Intenta consultar el endpoint de obtener pedido por ID para verificar el estado actual

## Consejos Avanzados

### Automatización de Pruebas

Puedes usar la funcionalidad de "Collection Runner" de Postman para ejecutar pruebas automatizadas:

1. Haz clic en la colección "FERREMAS Backend API"
2. Haz clic en el botón "..." (más opciones)
3. Selecciona "Run collection"
4. Configura las iteraciones y el entorno
5. Haz clic en "Run"

### Uso de Scripts de Prueba

Para probar el flujo de pago de forma más sencilla, puedes utilizar los scripts incluidos en el proyecto:

**Para Windows, Mac o Linux**:
```bash
node webpay-test.js
```

**Solo para Mac/Linux**:
```bash
chmod +x webpay-test.sh
./webpay-test.sh
```

Estos scripts generarán automáticamente la página HTML y la abrirán en tu navegador predeterminado.

### Exportar Resultados

Para documentar los resultados de tus pruebas:

1. Después de recibir una respuesta, haz clic en el botón "Save" junto a la solicitud
2. Selecciona "Save as Example"
3. Nombra el ejemplo y haz clic en "Save Example"

### Uso de Variables Dinámicas

Postman permite capturar valores de respuestas y usarlos en solicitudes posteriores:

1. En la pestaña "Tests" de una solicitud, añade el siguiente código para capturar un ID:
   ```javascript
   var jsonData = pm.response.json();
   pm.environment.set("pedido_id", jsonData.data.id);
   ```

2. Esto guardará automáticamente el ID del pedido creado en la variable de entorno `pedido_id`

## Recursos Adicionales

- [Documentación Oficial de Postman](https://learning.postman.com/docs/getting-started/introduction/)
- [Documentación de la API de FERREMAS](./API.md)
- [Documentación de Transbank](https://www.transbankdevelopers.cl/documentacion/webpay-plus)
- [Documentación de Firebase Authentication](https://firebase.google.com/docs/auth)
- [Tokens de ID de Firebase](https://firebase.google.com/docs/auth/admin/verify-id-tokens)

## 📋 Checklist de Pruebas Completas

### ✅ Pruebas Básicas
- [ ] Servidor responde correctamente
- [ ] Health check muestra DB conectada
- [ ] Creación de productos funciona correctamente
- [ ] Creación de usuarios funciona correctamente
- [ ] Creación de pedidos funciona correctamente
- [ ] Se pueden procesar pagos con Webpay

### ✅ Pruebas de Autenticación con Firebase
- [ ] Firebase está correctamente configurado (endpoint /auth/status)
- [ ] Registro de nuevos usuarios funciona
- [ ] Verificación de token funciona correctamente
- [ ] Se puede obtener información del usuario autenticado
- [ ] Los endpoints protegidos requieren token válido
- [ ] Los errores de autenticación son manejados correctamente

### ✅ Pruebas CRUD
- [ ] Crear (POST) funciona para todas las entidades
- [ ] Leer (GET) funciona por ID y listados
- [ ] Actualizar (PUT) modifica correctamente
- [ ] Eliminar (DELETE) remueve recursos

### ✅ Pruebas de Pago Transbank
- [ ] Iniciar transacción con pedido válido
- [ ] Redirección a Webpay funciona correctamente
- [ ] Pago exitoso actualiza estado del pedido
- [ ] Pago rechazado mantiene estado pendiente
- [ ] Cancelación de pago maneja error correctamente

### ✅ Pruebas de Validación
- [ ] Campos requeridos se validan
- [ ] Formatos de email se validan
- [ ] Números negativos se rechazan
- [ ] Recursos no encontrados devuelven 404

---

**¡Felicidades!** 🎉 Ahora tienes una guía completa para probar la API FERREMAS y su integración con Transbank utilizando Postman. Siguiendo estos pasos podrás verificar que todos los endpoints, incluido el procesamiento de pagos, funcionen correctamente.

**💡 Consejo:** Para simplificar el flujo de pruebas de pago, utiliza el script incluido en el proyecto (`node webpay-test.js`), que automatiza la generación y apertura de la página de pago.
