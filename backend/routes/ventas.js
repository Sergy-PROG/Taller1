const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /ventas → listar con JOIN para traer el nombre del cliente
router.get('/', (req, res) => {
  const sql = `
    SELECT v.id_venta,
           v.id_cliente,
           c.nomCliente,
           v.fecha_venta,
           v.total,
           v.estado
    FROM ventas v
    INNER JOIN clientes c ON v.id_cliente = c.id_cliente
    ORDER BY v.id_venta DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /ventas/:id → una venta con su detalle (JOIN triple)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT v.id_venta, v.fecha_venta, v.total, v.estado,
           c.nomCliente, c.contacto, c.ciudad,
           d.id_detalle, d.cantidad, d.precio_unitario, d.subtotal,
           p.nomProducto
    FROM ventas v
    INNER JOIN clientes c ON v.id_cliente = c.id_cliente
    INNER JOIN detalle_venta d ON d.id_venta = v.id_venta
    INNER JOIN productos p ON p.id_producto = d.id_producto
    WHERE v.id_venta = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ msg: 'Venta no encontrada' });
    res.json(results);
  });
});

// POST /ventas → crear una venta completa (venta + detalle) con TRANSACCIÓN
router.post('/', (req, res) => {
  const { id_cliente, fecha_venta, estado, detalles } = req.body;
  // detalles = [{ id_producto, cantidad, precio_unitario }]

  const total = detalles.reduce((acc, d) => acc + d.cantidad * d.precio_unitario, 0);

  db.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.beginTransaction((err) => {
      if (err) {
        conn.release();
        return res.status(500).json({ error: err.message });
      }

      const sqlVenta = 'INSERT INTO ventas (id_cliente, fecha_venta, total, estado) VALUES (?, ?, ?, ?)';
      conn.query(sqlVenta, [id_cliente, fecha_venta, total, estado], (err, resultVenta) => {
        if (err) {
          return conn.rollback(() => {
            conn.release();
            res.status(500).json({ error: err.message });
          });
        }

        const idVenta = resultVenta.insertId;

        const sqlDetalle = 'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES ?';
        const valores = detalles.map(d => [
          idVenta,
          d.id_producto,
          d.cantidad,
          d.precio_unitario,
          d.cantidad * d.precio_unitario
        ]);

        conn.query(sqlDetalle, [valores], (err) => {
          if (err) {
            return conn.rollback(() => {
              conn.release();
              res.status(500).json({ error: err.message });
            });
          }

          conn.commit((err) => {
            if (err) {
              return conn.rollback(() => {
                conn.release();
                res.status(500).json({ error: err.message });
              });
            }
            conn.release();
            res.status(201).json({ msg: 'Venta registrada', id_venta: idVenta, total });
          });
        });
      });
    });
  });
});

module.exports = router;