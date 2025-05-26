/**
 * Script para actualizar pedidos con monto cero
 * Actualización: 26 de mayo de 2025
 */

const { Pool } = require('pg');

// Configuración de la conexión
const pool = new Pool({
    connectionString: 'postgresql://postgres:jvVmUJruIgzoLJOetRRRnAsTUnkQzcYQ@crossover.proxy.rlwy.net:26319/railway',
    ssl: false
});

async function updateOrdersWithZeroAmounts() {
    console.log('🔍 Iniciando actualización de pedidos con monto cero...');
    
    // Definir las actualizaciones específicas
    /*const updates = [
        { id: 3, cantidad: 2, precio: 9990, producto: 'Test Producto', monto: 19980 },
        { id: 4, cantidad: 3, precio: 9990, producto: 'Test Producto', monto: 29970 },
        { id: 5, cantidad: 1, precio: 4990, producto: 'Alicate universal', monto: 4990 },
        { id: 6, cantidad: 2, precio: 4990, producto: 'Alicate universal', monto: 9980 },
        { id: 7, cantidad: 1, precio: 94990, producto: 'Sierra Circular', monto: 94990 },
        { id: 8, cantidad: 1, precio: 129990, producto: 'Taladro Inalámbrico', monto: 129990 },
        { id: 9, cantidad: 1, precio: 199990, producto: 'Martillo Demoledor', monto: 199990 },
        { id: 10, cantidad: 2, precio: 10990, producto: 'Test Product API Updated', monto: 21980 },
        { id: 15, cantidad: 1, precio: 94990, producto: 'Sierra Circular', monto: 94990 },
        { id: 16, cantidad: 1, precio: 94990, producto: 'Sierra Circular', monto: 94990 }
    ];*/
    
    try {
        // Mostrar resumen antes de actualizar
        console.log('📋 Resumen de actualizaciones a realizar:');
        updates.forEach(order => {
            console.log(`Pedido ${order.id}:
    - Producto: ${order.producto}
    - Cantidad: ${order.cantidad}
    - Precio unitario: $${order.precio}
    - Monto a establecer: $${order.monto}
    `);
        });

        console.log('\n🔄 Iniciando actualizaciones...');

        // Actualizar cada pedido
        for (const order of updates) {
            try {
                const updateQuery = `
                    UPDATE pedidos 
                    SET monto = $1,
                        updated_at = NOW()
                    WHERE id = $2
                    RETURNING id, monto;
                `;
                
                const updateResult = await pool.query(updateQuery, [order.monto, order.id]);
                
                if (updateResult.rows.length > 0) {
                    console.log(`✅ Pedido ${order.id} actualizado: $${order.monto}`);
                } else {
                    console.warn(`⚠️ No se pudo actualizar el pedido ${order.id}`);
                }
            } catch (error) {
                console.error(`❌ Error actualizando pedido ${order.id}:`, error.message);
            }
        }

        // Verificación final
        const verificationQuery = `
            SELECT p.id, p.monto, pr.nombre as producto
            FROM pedidos p
            JOIN productos pr ON p.producto_id = pr.id
            WHERE p.id IN (${updates.map(u => u.id).join(',')})
            ORDER BY p.id;
        `;
        
        const verification = await pool.query(verificationQuery);
        
        console.log('\n📊 Verificación final de pedidos actualizados:');
        verification.rows.forEach(order => {
            console.log(`Pedido ${order.id}:
    - Producto: ${order.producto}
    - Monto actualizado: $${order.monto}
    `);
        });

        // Verificar si quedan pedidos con monto cero
        const zeroCheck = await pool.query("SELECT COUNT(*) as count FROM pedidos WHERE monto = 0");
        if (zeroCheck.rows[0].count > 0) {
            console.warn(`\n⚠️ Aún quedan ${zeroCheck.rows[0].count} pedidos con monto cero`);
        } else {
            console.log('\n🎉 Todos los pedidos han sido actualizados correctamente');
        }

    } catch (error) {
        console.error('❌ Error durante el proceso:', error);
    } finally {
        await pool.end();
        console.log('👋 Proceso finalizado');
    }
}

// Ejecutar el script
console.log('🚀 Iniciando script de actualización...');
updateOrdersWithZeroAmounts().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
});
