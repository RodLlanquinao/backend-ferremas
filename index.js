const express = require('express');
const productosRoutes = require('./routes/productos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const pedidosRoutes = require('./routes/pedidos.routes');



const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const db = require('./db'); 

app.use('/productos', productosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/pedidos', pedidosRoutes);

app.get('/', (req, res) => {
  res.send('¡Hola FERREMAS Backend!');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

db.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
    } else {
      console.log('Conexión exitosa a PostgreSQL:', res.rows[0]);
    }
});