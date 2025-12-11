import { ServAlovaAuth } from '../Servicios/ServAlovaAuth';

export const CompLogin = () => {
    return (
        // Usamos la clase CSS en lugar de estilos en línea
        <div className="login-container">
            <ServAlovaAuth />
        </div>
    );
};