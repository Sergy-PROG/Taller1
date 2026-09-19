const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /productos → listar todos
router.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /productos/:id → uno solo
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM productos WHERE id_producto = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ msg: 'Producto no encontrado' });
    res.json(results[0]);
  });
});

// POST /productos → crear
router.post('/', (req, res) => {
  const { nomProducto, cantidad, precio } = req.body;
  const sql = 'INSERT INTO productos (nomProducto, cantidad, precio) VALUES (?, ?, ?)';
  db.query(sql, [nomProducto, cantidad, precio], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, nomProducto, cantidad, precio });
  });
});

// PUT /productos/:id → actualizar
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nomProducto, cantidad, precio } = req.body;
  const sql = 'UPDATE productos SET nomProducto = ?, cantidad = ?, precio = ? WHERE id_producto = ?';
  db.query(sql, [nomProducto, cantidad, precio, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ msg: 'Producto actualizado' });
  });
});

// DELETE /productos/:id → eliminar
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id_producto = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ msg: 'Producto eliminado' });
  });
});

module.exports = router;