import { useEffect, useState } from 'react';
import api from '../services/api';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/clientes')
      .then(response => {
        setClientes(response.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de clientes');
        setCargando(false);
        console.error(err);
      });
  }, []);

  if (cargando) return <p>Cargando clientes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Lista de Clientes</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Contacto</th>
            <th>Departamento</th><th>Ciudad</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id_cliente}>
              <td>{c.id_cliente}</td>
              <td>{c.nomCliente}</td>
              <td>{c.contacto}</td>
              <td>{c.departamento}</td>
              <td>{c.ciudad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;