import { useState, useEffect } from 'react';
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import { SUPABASE_URL, supabaseHeaders } from './supabaseConfig';
import { useAuth } from '../Context/AuthContext';

export const ServAlovaGetPrendas = () => {
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const instanceAlova = createAlova({
        baseURL: `${SUPABASE_URL}/rest/v1`,
        requestAdapter: adapterFetch(),
        beforeRequest(method) {
            method.config.headers = supabaseHeaders;
        },
        responded: (response) => response.json()
    });

    const cargarPrendas = () => {
        if (user) {
            setLoading(true);
            instanceAlova.Get(`/Prenda?select=*&order=prendaID.desc&usuario_id=eq.${user.id}`)
                .then((respuesta: any) => {
                    setData(respuesta);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError("Error al cargar tus prendas.");
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        cargarPrendas();
    }, [user]);

    const generarCodigoCupon = (id: number, tipo: string) => {
        return `FALA-${tipo.substring(0, 3).toUpperCase()}-${id}X`;
    };

    if (loading) return <div style={{textAlign:'center', padding:'40px'}}>⏳ Actualizando lista...</div>;

    return (
        <div>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            
            <div style={{overflowX: 'auto'}}>
                <table className="trazabilidad-table">
                    <thead>
                        <tr>
                            <th>Prenda</th>
                            <th>Foto / Evidencia</th>
                            <th>Estado</th>
                            <th>Aprobación Admin</th>
                            <th>Tu Recompensa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item: any) => (
                            <tr key={item.prendaID}>
                                {/* 1. Datos */}
                                <td>
                                    <div style={{fontWeight:'bold', fontSize:'15px'}}>{item.tipo}</div>
                                    <div style={{fontSize:'13px', color:'#666'}}>Talla: {item.talla}</div>
                                    <div style={{fontSize:'12px', color:'#999'}}>ID: #{item.prendaID}</div>
                                </td>

                                <td>
                                    {item.imagen_url ? (
                                        <a href={item.imagen_url} target="_blank" rel="noreferrer" title="Ver foto original">
                                            <img 
                                                src={item.imagen_url} 
                                                alt="Evidencia" 
                                                style={{
                                                    width: '80px', height: '80px', 
                                                    objectFit: 'cover', borderRadius: '8px',
                                                    border: '1px solid #ddd'
                                                }}
                                            />
                                        </a>
                                    ) : (
                                        <div style={{width:'80px', height:'80px', background:'#f0f0f0', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#aaa'}}>Sin Foto</div>
                                    )}
                                </td>

                                <td>
                                    <span style={{
                                        padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold',
                                        backgroundColor: item.estado === 'Reciclado' ? '#e8f5e9' : '#e3f2fd',
                                        color: item.estado === 'Reciclado' ? 'green' : '#1565c0'
                                    }}>
                                        {item.estado}
                                    </span>
                                </td>

                                <td>
                                    {item.estado_aprobacion === 'Aprobado' ? (
                                        <span style={{color:'green', fontWeight:'bold'}}>✅ Aceptado</span>
                                    ) : item.estado_aprobacion === 'Rechazado' ? (
                                        <span style={{color:'red', fontWeight:'bold'}}>❌ Rechazado</span>
                                    ) : (
                                        <span style={{color:'orange', fontWeight:'bold'}}>⏳ Pendiente</span>
                                    )}
                                </td>

                                <td style={{verticalAlign: 'middle'}}>
                                    {item.estado_aprobacion === 'Aprobado' ? (
                                        <div style={{
                                            border: '1px dashed var(--fala-green)',
                                            background: 'rgba(190, 208, 0, 0.1)',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            textAlign: 'center',
                                            animation: 'slideUp 0.3s ease-out'
                                        }}>
                                            <div style={{fontWeight:'900', color:'var(--fala-green)', fontSize:'13px'}}>
                                                {generarCodigoCupon(item.prendaID, item.tipo)}
                                            </div>
                                            <div style={{fontSize:'10px', color:'#555'}}>¡20% OFF DISPONIBLE!</div>
                                        </div>
                                    ) : item.estado_aprobacion === 'Rechazado' ? (
                                        <span style={{fontSize:'12px', color:'#999'}}>No cumple requisitos</span>
                                    ) : (
                                        <div style={{
                                            fontSize:'12px', 
                                            color:'#f57f17', 
                                            fontStyle:'italic', 
                                            background: '#fff3e0', 
                                            padding: '5px', 
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }}>
                                            🕐 A la espera del Administrador
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mensaje si la lista está vacía de verdad */}
            {data.length === 0 && !loading && (
                <div style={{textAlign: 'center', padding: '30px', color: '#666'}}>
                    <p>No tienes prendas registradas aún.</p>
                </div>
            )}
        </div>
    );
};