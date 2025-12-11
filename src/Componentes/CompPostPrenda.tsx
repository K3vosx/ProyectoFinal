import { ServAlovaPostPrenda } from '../Servicios/ServAlovaPostPrenda';

export const CompPostPrenda = () => {
    return (
        <div className="contenedor-registro">
            <h3 style={{textAlign: 'center', color: 'var(--fala-green)'}}>Paso 1: Registro y Evidencia</h3>
            <p style={{textAlign: 'center', fontSize: '14px', color: '#666'}}>Completa los datos y sube una foto para iniciar el seguimiento en nuestra base de datos.</p>
            <hr />
            <br />
            <ServAlovaPostPrenda />
        </div>
    );
};