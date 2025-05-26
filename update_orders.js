/**
 * Script para actualizar pedidos sin monto en la base de datos
 * 
 * Este script identifica todos los pedidos que no tienen un monto asignado,
 * calcula el monto correcto basado en la cantidad y el precio del producto,
 * y actualiza cada pedido con el monto calculado.
 */

const { pool } = require('./config/database');
const Pedido = require('./models/Pedido');

async function updateOrdersWithMissingAmounts() {
    console.log('🔍 Iniciando actualización de pedidos sin monto...');
    
    try {
        // Consulta para encontrar pedidos sin monto y sus detalles de producto
        const query = `
            SELECT 
                p.id as pedido_id,
                p.cantidad,
                p.monto,
                pr.id as producto_id,
                pr.precio,
                pr.nombre as producto_nombre
            FROM pedidos p 
            JOIN productos pr ON p.producto_id = pr.id 
            WHERE p.monto IS NULL
        `;
        
        const result = await pool.query(query);
        console.log(`📊 Se encontraron ${result.rows.length} pedidos sin monto`);
        
        // Actualizar cada pedido con su monto calculado
        for (const order of result.rows) {
            try {
                const calculatedAmount = order.cantidad * order.precio;
                console.log(`💰 Calculando monto para pedido ${order.pedido_id}:`, {
                    producto: order.producto_nombre,
                    cantidad: order.cantidad,
                    precio: order.precio,
                    monto_calculado: calculatedAmount
                });
                
                // Actualizar el pedido con el monto calculado
                await Pedido.update(order.pedido_id, {
                    monto: calculatedAmount
                });
                
                console.log(`✅ Pedido ${order.pedido_id} actualizado con monto: ${calculatedAmount}`);
            } catch (updateError) {
                console.error(`❌ Error al actualizar pedido ${order.pedido_id}:`, updateError.message);
            }
        }
        
        console.log('🎉 Finalizada la actualización de pedidos sin monto');
    } catch (error) {
        console.error('❌ Error durante el proceso de actualización:', error);
    } finally {
        await pool.end();
    }
}

// Ejecutar la actualización
updateOrdersWithMissingAmounts().catch(console.error);
