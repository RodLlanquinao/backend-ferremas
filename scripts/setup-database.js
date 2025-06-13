/**
 * Script para verificar y crear todas las tablas necesarias en PostgreSQL
 * Asegura que la base de datos tenga todas las tablas requeridas por la aplicación
 */

const { pool } = require("../config/database");

// Definir todas las tablas que necesita la aplicación
const createTablesSQL = `
-- ========================================
-- TABLA DE USUARIOS
-- ========================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255),
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_nacimiento DATE,
    genero VARCHAR(10),
    tipo_usuario VARCHAR(20) DEFAULT 'cliente',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA DE PRODUCTOS
-- ========================================
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    imagen_url TEXT,
    activo BOOLEAN DEFAULT true,
    bodega_id INTEGER,
    stock_bodega INTEGER DEFAULT 0,
    ubicacion_bodega VARCHAR(50),
    stock_minimo INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA DE PEDIDOS
-- ========================================
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    direccion_envio TEXT,
    metodo_pago VARCHAR(50),
    fecha_entrega DATE,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA DE DETALLES DE PEDIDOS
-- ========================================
CREATE TABLE IF NOT EXISTS detalle_pedidos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA DE CONTACTOS
-- ========================================
CREATE TABLE IF NOT EXISTS contactos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    asunto VARCHAR(255),
    mensaje TEXT NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    respondido BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA DE BODEGAS
-- ========================================
CREATE TABLE IF NOT EXISTS bodegas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    encargado VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA DE SUCURSALES
-- ========================================
CREATE TABLE IF NOT EXISTS sucursales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    encargado VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA DE INVENTARIO DE SUCURSALES
-- ========================================
CREATE TABLE IF NOT EXISTS inventario_sucursales (
    id SERIAL PRIMARY KEY,
    sucursal_id INTEGER NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    stock INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(sucursal_id, producto_id)
);

-- ========================================
-- TABLA DE SOLICITUDES DE PRODUCTOS
-- ========================================
CREATE TABLE IF NOT EXISTS solicitudes_productos (
    id SERIAL PRIMARY KEY,
    sucursal_id INTEGER NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP,
    fecha_entrega TIMESTAMP,
    usuario_solicitud INTEGER REFERENCES usuarios(id),
    usuario_respuesta INTEGER REFERENCES usuarios(id),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TABLA DE SOLICITUDES DE SUCURSALES (Branch Requests)
-- ========================================
CREATE TABLE IF NOT EXISTS branch_requests (
    id SERIAL PRIMARY KEY,
    nombre_sucursal VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    encargado VARCHAR(255),
    tipo_solicitud VARCHAR(50) DEFAULT 'nueva_sucursal',
    estado VARCHAR(50) DEFAULT 'pendiente',
    comentarios TEXT,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP,
    usuario_solicitante INTEGER REFERENCES usuarios(id),
    usuario_revisor INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- AGREGAR FOREIGN KEY A PRODUCTOS
-- ========================================
DO $$
BEGIN
    -- Agregar foreign key para bodega_id si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'productos_bodega_id_fkey' 
        AND table_name = 'productos'
    ) THEN
        ALTER TABLE productos ADD CONSTRAINT productos_bodega_id_fkey 
        FOREIGN KEY (bodega_id) REFERENCES bodegas(id) ON DELETE SET NULL;
    END IF;
END
$$;

-- ========================================
-- CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- ========================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_firebase_uid ON usuarios(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_bodega ON productos(bodega_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_detalle_pedidos_pedido ON detalle_pedidos(pedido_id);
CREATE INDEX IF NOT EXISTS idx_detalle_pedidos_producto ON detalle_pedidos(producto_id);
CREATE INDEX IF NOT EXISTS idx_contactos_estado ON contactos(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_sucursal ON solicitudes_productos(sucursal_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_producto ON solicitudes_productos(producto_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_productos(estado);
CREATE INDEX IF NOT EXISTS idx_inventario_sucursal ON inventario_sucursales(sucursal_id);
CREATE INDEX IF NOT EXISTS idx_inventario_producto ON inventario_sucursales(producto_id);
CREATE INDEX IF NOT EXISTS idx_branch_requests_estado ON branch_requests(estado);

-- ========================================
-- INSERTAR DATOS INICIALES
-- ========================================

-- Crear bodega central por defecto
INSERT INTO bodegas (nombre, direccion, telefono, email, encargado)
SELECT 'Bodega Central', 'Av. Principal 1234, Santiago', '+56912345678', 'bodega@ferremas.com', 'Administrador'
WHERE NOT EXISTS (SELECT 1 FROM bodegas);

-- Crear sucursal principal por defecto
INSERT INTO sucursales (nombre, direccion, telefono, email, encargado)
SELECT 'Sucursal Principal', 'Av. Las Condes 4321, Santiago', '+56987654321', 'sucursal@ferremas.com', 'Encargado Principal'
WHERE NOT EXISTS (SELECT 1 FROM sucursales);

-- Actualizar productos existentes para asignarlos a la bodega central
UPDATE productos
SET bodega_id = (SELECT id FROM bodegas ORDER BY id LIMIT 1),
    stock_bodega = COALESCE(stock, 0)
WHERE bodega_id IS NULL;
`;

// Función para verificar qué tablas existen
async function checkExistingTables() {
    const query = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
    `;
    
    const result = await pool.query(query);
    return result.rows.map(row => row.table_name);
}

// Función principal para configurar la base de datos
async function setupDatabase() {
    console.log("🚀 Iniciando configuración de la base de datos...");
    
    try {
        // Verificar conexión
        console.log("🔌 Verificando conexión a la base de datos...");
        await pool.query('SELECT NOW()');
        console.log("✅ Conexión exitosa a PostgreSQL");
        
        // Verificar tablas existentes
        console.log("\n📋 Verificando tablas existentes...");
        const existingTables = await checkExistingTables();
        console.log("Tablas encontradas:", existingTables.length > 0 ? existingTables : "Ninguna");
        
        // Crear todas las tablas
        console.log("\n🏗️  Creando/verificando todas las tablas...");
        await pool.query(createTablesSQL);
        console.log("✅ Todas las tablas han sido creadas/verificadas");
        
        // Verificar tablas después de la creación
        console.log("\n📋 Verificando tablas después de la configuración...");
        const finalTables = await checkExistingTables();
        console.log("Tablas disponibles:", finalTables);
        
        // Mostrar resumen
        console.log("\n📊 RESUMEN DE LA CONFIGURACIÓN:");
        console.log("================================");
        finalTables.forEach(table => {
            console.log(`✅ ${table}`);
        });
        
        console.log(`\n🎉 Base de datos configurada exitosamente!`);
        console.log(`📈 Total de tablas: ${finalTables.length}`);
        
    } catch (error) {
        console.error("❌ Error configurando la base de datos:");
        console.error("Error:", error.message);
        console.error("Código:", error.code);
        console.error("Detalle:", error.detail);
        throw error;
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    setupDatabase()
        .then(() => {
            console.log("\n✅ Configuración completada exitosamente");
            process.exit(0);
        })
        .catch((error) => {
            console.error("\n❌ Error en la configuración:");
            console.error(error);
            process.exit(1);
        });
}

module.exports = { setupDatabase, checkExistingTables };
