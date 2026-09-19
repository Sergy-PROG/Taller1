import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from 'react-bootstrap/Table';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/productos')
      .then(response => {
        setProductos(response.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de productos');
        setCargando(false);
        console.error(err);
      });
  }, []);

  if (cargando) return <p className="container mt-4">Cargando productos...</p>;
  if (error) return <p className="container mt-4 text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Lista de Productos</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nomProducto}</td>
              <td>{p.cantidad}</td>
              <td>${Number(p.precio).toLocaleString('es-CO')}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Productos;