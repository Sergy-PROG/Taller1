const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /clientes → listar todos
router.get('/', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET /clientes/:id → uno solo
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ msg: 'Cliente no encontrado' });
    res.json(results[0]);
  });
});

module.exports = router;