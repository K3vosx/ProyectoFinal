
import { ServAlovaGetPrendas } from '../Servicios/ServAlovaGetPrendas';

export const CompGetPrendas = () => {
    return (
        <div className="contenedor-trazabilidad">
            <h2>Módulo de Trazabilidad</h2>
            <ServAlovaGetPrendas />
        </div>
    );
};