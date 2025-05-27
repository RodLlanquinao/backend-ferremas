# Configuración de Autenticación Firebase en Postman

Este documento explica cómo configurar Postman para manejar automáticamente la autenticación con Firebase mediante Pre-request Scripts.

## Configuración

### 1. Configurar Variables de Entorno

Primero, necesitas configurar un entorno en Postman con las siguientes variables:

| Variable           | Valor Inicial          | Descripción                                  |
|--------------------|------------------------|----------------------------------------------|
| `base_url`         | `http://localhost:8000`| URL base del servidor                        |
| `test_user_email`  | `test@example.com`     | Email del usuario de prueba para Firebase    |
| `test_user_password`| `password123`         | Contraseña del usuario de prueba             |
| `firebase_id_token`| _(vacío)_              | Token JWT de Firebase (se llena automáticamente) |

### 2. Configurar Pre-request Script para la Colección

Copia el siguiente código en el Pre-request Script de la colección (no en una solicitud individual):

```javascript
// Pre-request Script para la colección:

// Configuración de Firebase
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDxUSQ1UzDGNA-P3a2F_lLaNPIuiZsqckY",
    projectId: "ferremas-backend-a1e13"
};

// Credenciales de prueba
const TEST_CREDENTIALS = {
    email: pm.environment.get('test_user_email') || 'test@example.com',
    password: pm.environment.get('test_user_password') || 'password123'
};

// Función para verificar si el token ha expirado
function isTokenExpired() {
    const token = pm.environment.get('firebase_id_token');
    if (!token) return true;
    
    try {
        const [, payload] = token.split('.');
        const { exp } = JSON.parse(atob(payload));
        return Date.now() >= exp * 1000;
    } catch (e) {
        return true;
    }
}

// Función para obtener un nuevo token
async function getNewFirebaseToken() {
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_CONFIG.apiKey}`;
    
    try {
        const response = await pm.sendRequest({
            url: signInUrl,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: {
                mode: 'raw',
                raw: JSON.stringify({
                    email: TEST_CREDENTIALS.email,
                    password: TEST_CREDENTIALS.password,
                    returnSecureToken: true
                })
            }
        });

        const jsonResponse = response.json();
        
        if (jsonResponse.idToken) {
            pm.environment.set('firebase_id_token', jsonResponse.idToken);
            console.log('✅ Nuevo token de Firebase obtenido');
            return true;
        } else {
            throw new Error('No se pudo obtener el token');
        }
    } catch (error) {
        console.error('❌ Error al obtener token:', error);
        return false;
    }
}

// Verificar y renovar token si es necesario
if (isTokenExpired()) {
    console.log('🔄 Token expirado o no existe, obteniendo uno nuevo...');
    getNewFirebaseToken();
} else {
    console.log('✅ Token válido encontrado');
}

// Añadir el token al header de la solicitud si existe
const token = pm.environment.get('firebase_id_token');
if (token) {
    pm.request.headers.add({
        key: 'Authorization',
        value: `Bearer ${token}`
    });
}
```

## Cómo Funciona

Este script realiza las siguientes acciones antes de cada solicitud:

1. **Verificación de Token**: Comprueba si existe un token en las variables de entorno y si ha expirado.
2. **Renovación Automática**: Si el token no existe o ha expirado, solicita uno nuevo automáticamente.
3. **Autenticación**: Añade el token como header de autorización (`Authorization: Bearer {token}`) a la solicitud.

## Pasos para Configurarlo en Postman

1. Abre Postman.
2. Selecciona tu colección "FERREMAS Backend API".
3. Haz clic en los tres puntos (...) junto al nombre de la colección.
4. Selecciona "Edit".
5. Ve a la pestaña "Pre-request Script".
6. Pega el código proporcionado anteriormente.
7. Guarda los cambios.

## Verificación

Para verificar que funciona correctamente:

1. Abre la consola de Postman (View > Show Postman Console).
2. Realiza una solicitud a un endpoint protegido, como `GET /auth/me`.
3. En la consola, deberías ver mensajes indicando:
   - Que se está verificando el token
   - Que se está obteniendo uno nuevo (primera vez)
   - Que se está utilizando el token existente (solicitudes posteriores)

## Solución de Problemas

### El token no se obtiene automáticamente

1. Verifica que las credenciales (`test_user_email` y `test_user_password`) sean correctas.
2. Asegúrate de que el usuario exista en Firebase.
3. Comprueba en la consola de Postman si hay errores específicos.

### Error de autenticación en las solicitudes

1. Verifica que el token se esté añadiendo correctamente como header.
2. Comprueba que el endpoint realmente requiera autenticación.
3. Intenta eliminar manualmente la variable `firebase_id_token` para forzar la obtención de un nuevo token.

## Ventajas de Este Enfoque

- **Automatización**: No es necesario obtener y configurar tokens manualmente.
- **Mantenimiento**: El token se renueva automáticamente cuando expira.
- **Consistencia**: Todas las solicitudes utilizan el mismo token y mecanismo de autenticación.
- **Seguridad**: Las credenciales se almacenan en variables de entorno, no en el código.

---

**Nota**: Este enfoque es para desarrollo y pruebas. En un entorno de producción, se recomienda utilizar mecanismos más seguros para el manejo de tokens y credenciales.

