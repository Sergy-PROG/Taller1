const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /detalle-venta → listar todos los detalles (con JOIN para traer nombres)
router.get('/', (req, res) => {
  const sql = `
    SELECT d.id_detalle,
           d.id_venta,
           d.id_producto,
           p.nomProducto,
           d.cantidad,
           d.precio_unitario,
           d.subtotal
    FROM detalle_venta d
    INNER JOIN productos p ON p.id_producto = d.id_producto
    ORDER BY d.id_detalle DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /detalle-venta/:id → un detalle específico
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT d.id_detalle,
           d.id_venta,
           d.id_producto,
           p.nomProducto,
           d.cantidad,
           d.precio_unitario,
           d.subtotal
    FROM detalle_venta d
    INNER JOIN productos p ON p.id_producto = d.id_producto
    WHERE d.id_detalle = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ msg: 'Detalle no encontrado' });
    res.json(results[0]);
  });
});

// GET /detalle-venta/venta/:idVenta → todos los detalles de UNA venta
router.get('/venta/:idVenta', (req, res) => {
  const { idVenta } = req.params;
  const sql = `
    SELECT d.id_detalle,
           d.id_venta,
           d.id_producto,
           p.nomProducto,
           d.cantidad,
           d.precio_unitario,
           d.subtotal
    FROM detalle_venta d
    INNER JOIN productos p ON p.id_producto = d.id_producto
    WHERE d.id_venta = ?
  `;
  db.query(sql, [idVenta], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST /detalle-venta → crear un detalle (calcula subtotal automáticamente)
router.post('/', (req, res) => {
  const { id_venta, id_producto, cantidad, precio_unitario } = req.body;
  const subtotal = cantidad * precio_unitario;

  const sql = `
    INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [id_venta, id_producto, cantidad, precio_unitario, subtotal], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      id_detalle: result.insertId,
      id_venta,
      id_producto,
      cantidad,
      precio_unitario,
      subtotal
    });
  });
});

// PUT /detalle-venta/:id → actualizar un detalle
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { id_venta, id_producto, cantidad, precio_unitario } = req.body;
  const subtotal = cantidad * precio_unitario;

  const sql = `
    UPDATE detalle_venta
    SET id_venta = ?, id_producto = ?, cantidad = ?, precio_unitario = ?, subtotal = ?
    WHERE id_detalle = ?
  `;
  db.query(sql, [id_venta, id_producto, cantidad, precio_unitario, subtotal, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ msg: 'Detalle actualizado' });
  });
});

// DELETE /detalle-venta/:id → eliminar un detalle
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM detalle_venta WHERE id_detalle = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ msg: 'Detalle eliminado' });
  });
});

module.exports = router;
