const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clientesRouter = require('./routes/clientes');
const productosRouter = require('./routes/productos');
const ventasRouter = require('./routes/ventas');
const detalleVentaRouter = require('./routes/detalleVenta');   // 👈 NUEVO

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/clientes', clientesRouter);
app.use('/productos', productosRouter);
app.use('/ventas', ventasRouter);
app.use('/detalle-venta', detalleVentaRouter);                 // 👈 NUEVO

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.json({ msg: 'API funcionando 🚀' });
});

// Al final del archivo, cambia el listen por esto:
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});