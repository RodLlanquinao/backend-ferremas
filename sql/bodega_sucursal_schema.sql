-- Esquema de base de datos para la gestión de bodegas, sucursales y solicitudes de productos
-- Este script crea las tablas necesarias para la gestión del catálogo de productos de la ferretería
-- y las solicitudes de productos desde sucursales

-- Tabla de bodegas (inventario central)
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

-- Tabla de sucursales
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

-- Modificar tabla de productos para incluir información de bodega
-- Primero, verificamos si la columna ya existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'productos' AND column_name = 'bodega_id') THEN
        ALTER TABLE productos ADD COLUMN bodega_id INTEGER REFERENCES bodegas(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'productos' AND column_name = 'stock_bodega') THEN
        ALTER TABLE productos ADD COLUMN stock_bodega INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'productos' AND column_name = 'ubicacion_bodega') THEN
        ALTER TABLE productos ADD COLUMN ubicacion_bodega VARCHAR(50);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'productos' AND column_name = 'stock_minimo') THEN
        ALTER TABLE productos ADD COLUMN stock_minimo INTEGER DEFAULT 5;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'productos' AND column_name = 'updated_at') THEN
        ALTER TABLE productos ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END
$$;

-- Tabla de inventario de sucursales
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

-- Tabla de solicitudes de productos (desde sucursales a bodega central)
CREATE TABLE IF NOT EXISTS solicitudes_productos (
    id SERIAL PRIMARY KEY,
    sucursal_id INTEGER NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- pendiente, aprobada, rechazada, completada
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP,
    fecha_entrega TIMESTAMP,
    usuario_solicitud INTEGER REFERENCES usuarios(id),
    usuario_respuesta INTEGER REFERENCES usuarios(id),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear una bodega central por defecto si no existe ninguna
INSERT INTO bodegas (nombre, direccion, telefono, email, encargado)
SELECT 'Bodega Central', 'Av. Principal 1234, Santiago', '+56912345678', 'bodega@ferremas.com', 'Administrador'
WHERE NOT EXISTS (SELECT 1 FROM bodegas);

-- Crear una sucursal por defecto si no existe ninguna
INSERT INTO sucursales (nombre, direccion, telefono, email, encargado)
SELECT 'Sucursal Principal', 'Av. Las Condes 4321, Santiago', '+56987654321', 'sucursal@ferremas.com', 'Encargado Principal'
WHERE NOT EXISTS (SELECT 1 FROM sucursales);

-- Actualizar productos existentes para asignarlos a la bodega central
UPDATE productos
SET bodega_id = (SELECT id FROM bodegas ORDER BY id LIMIT 1),
    stock_bodega = stock
WHERE bodega_id IS NULL;

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_productos_bodega ON productos(bodega_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_sucursal ON solicitudes_productos(sucursal_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_producto ON solicitudes_productos(producto_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_productos(estado);
CREATE INDEX IF NOT EXISTS idx_inventario_sucursal ON inventario_sucursales(sucursal_id);
CREATE INDEX IF NOT EXISTS idx_inventario_producto ON inventario_sucursales(producto_id);

