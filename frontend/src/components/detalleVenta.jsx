import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function DetalleVenta() {
  const { id } = useParams();
  const [detalle, setDetalle] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/ventas/${id}`)
      .then(response => {
        setDetalle(response.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar el detalle de la venta');
        setCargando(false);
        console.error(err);
      });
  }, [id]);

  if (cargando) return <p className="container mt-4">Cargando detalle...</p>;
  if (error) return <p className="container mt-4 text-danger">{error}</p>;
  if (detalle.length === 0) return <p className="container mt-4">Venta sin detalle.</p>;

  const primera = detalle[0];

  return (
    <div className="container mt-4">
      <h2>Detalle de Venta #{primera.id_venta}</h2>

      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Cliente: {primera.nomCliente}</Card.Title>
          <Card.Text>
            <strong>Contacto:</strong> {primera.contacto} <br />
            <strong>Ciudad:</strong> {primera.ciudad} <br />
            <strong>Fecha:</strong> {new Date(primera.fecha_venta).toLocaleDateString('es-CO')} <br />
            <strong>Estado:</strong> {primera.estado}
          </Card.Text>
        </Card.Body>
      </Card>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalle.map(d => (
            <tr key={d.id_detalle}>
              <td>{d.nomProducto}</td>
              <td>{d.cantidad}</td>
              <td>${Number(d.precio_unitario).toLocaleString('es-CO')}</td>
              <td>${Number(d.subtotal).toLocaleString('es-CO')}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="text-end">
        Total: ${Number(primera.total).toLocaleString('es-CO')}
      </h4>

      <Button as={Link} to="/ventas" variant="secondary" className="mt-3">
        ← Volver a Ventas
      </Button>
    </div>
  );
}

export default DetalleVenta;