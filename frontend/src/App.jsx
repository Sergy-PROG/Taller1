import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Clientes from './components/Clientes';
import Productos from './components/Productos';
import Ventas from './components/Ventas';
import DetalleVenta from './components/DetalleVenta';

function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<h2 className="container mt-4">Bienvenido 👋</h2>} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/ventas/:id" element={<DetalleVenta />} />
      </Routes>
    </>
  );
}

export default App;