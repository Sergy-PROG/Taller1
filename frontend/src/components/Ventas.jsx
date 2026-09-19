import { useEffect, useState } from 'react';
import api from '../services/api';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/ventas')
      .then(response => {
        setVentas(response.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de ventas');
        setCargando(false);
        console.error(err);
      });
  }, []);

  if (cargando) return <p className="container mt-4">Cargando ventas...</p>;
  if (error) return <p className="container mt-4 text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Lista de Ventas</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id_venta}>
              <td>{v.id_venta}</td>
              <td>{v.nomCliente}</td>
              <td>{new Date(v.fecha_venta).toLocaleDateString('es-CO')}</td>
              <td>${Number(v.total).toLocaleString('es-CO')}</td>
              <td>{v.estado}</td>
              <td>
                <Button
                  as={Link}
                  to={`/ventas/${v.id_venta}`}
                  variant="primary"
                  size="sm"
                >
                  Ver detalle
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Ventas;