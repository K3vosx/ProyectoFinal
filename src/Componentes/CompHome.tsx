import { Link } from 'react-router-dom';

export const CompHome = () => {
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <h1>MODA SOSTENIBLE</h1>
        <p>Dale una segunda vida a tus prendas y gana cupones de descuentos.</p>
        <Link to="/proyecto" className="btn-hero">
          Verificar Trazabilidad de la prenda 
        </Link>
      </div>
    </div>
  );
};