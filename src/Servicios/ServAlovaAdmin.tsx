import { useState, useEffect } from 'react';
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import { SUPABASE_URL, supabaseHeaders } from './supabaseConfig';

export const ServAlovaAdmin = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const instanceAlova = createAlova({
        baseURL: `${SUPABASE_URL}/rest/v1`,
        requestAdapter: adapterFetch(),
        beforeRequest(method) {
            method.config.headers = supabaseHeaders;
        },
        responded: (response) => response.json()
    });

    const cargarPendientes = () => {
        setLoading(true);
        instanceAlova.Get("/Prenda?select=*,Usuario(username)&order=prendaID.desc")
            .then((res: any) => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        cargarPendientes();
    }, []);

    const handleDecision = (id: number, nuevoEstado: string) => {
        instanceAlova.Patch(`/Prenda?prendaID=eq.${id}`, { estado_aprobacion: nuevoEstado })
            .then(() => {
                cargarPendientes();
            })
            .catch(err => console.error(err));
    };

    if(loading) return <div style={{textAlign:'center', padding:'20px'}}>⏳ Cargando solicitudes...</div>;

    return (
        <div>
            <h3 className="panel-title" style={{fontSize: '1.2rem', color: '#666', marginBottom:'20px'}}>
                Gestión de Aprobaciones
            </h3>
            
            <div style={{overflowX: 'auto'}}>
            <table className="trazabilidad-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Prenda</th>
                        <th>Usuario / Cliente</th> 
                        <th>Estado Actual</th>
                        <th>Foto</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item: any) => (
                        <tr key={item.prendaID}>
                            <td>#{item.prendaID}</td>
                            
                            <td>
                                <div style={{fontWeight:'bold'}}>{item.tipo}</div>
                                <div style={{fontSize:'12px', color:'#777'}}>{item.descripcion || 'Sin descripción'}</div>
                            </td>
                            
                            <td>
                                <div style={{fontWeight:'bold', textTransform: 'capitalize', color: 'var(--text-primary)'}}>
                                    👤 {item.Usuario?.username || 'Desconocido'}
                                </div>
                                <div style={{fontSize:'11px', color:'#999'}}>
                                    ID Cliente: {item.usuario_id}
                                </div>
                            </td>

                            <td>
                                <span style={{
                                    padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px',
                                    backgroundColor: item.estado_aprobacion === 'Aprobado' ? '#e8f5e9' : 
                                                     item.estado_aprobacion === 'Rechazado' ? '#ffebee' : '#fff3e0',
                                    color: item.estado_aprobacion === 'Aprobado' ? 'green' : 
                                           item.estado_aprobacion === 'Rechazado' ? 'red' : 'orange'
                                }}>
                                    {item.estado_aprobacion}
                                </span>
                            </td>

                            <td>
                                {item.imagen_url ? (
                                    <a href={item.imagen_url} target="_blank" rel="noreferrer" style={{color:'blue', textDecoration:'underline', fontSize:'13px'}}>
                                        Ver
                                    </a>
                                ) : (
                                    <span style={{color:'#ccc', fontSize:'13px'}}>No</span>
                                )}
                            </td>

                            <td>
                                {item.estado_aprobacion === 'Pendiente' ? (
                                    <div style={{display:'flex', gap:'8px'}}>
                                        <button 
                                            onClick={() => handleDecision(item.prendaID, 'Aprobado')} 
                                            title="Aprobar y generar cupón"
                                            style={{
                                                background:'#4caf50', color:'white', border:'none', 
                                                width:'30px', height:'30px', borderRadius:'50%', cursor:'pointer',
                                                display: 'flex', alignItems:'center', justifyContent:'center'
                                            }}
                                        >
                                            ✓
                                        </button>
                                        <button 
                                            onClick={() => handleDecision(item.prendaID, 'Rechazado')} 
                                            title="Rechazar prenda"
                                            style={{
                                                background:'#f44336', color:'white', border:'none', 
                                                width:'30px', height:'30px', borderRadius:'50%', cursor:'pointer',
                                                display: 'flex', alignItems:'center', justifyContent:'center'
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <span style={{fontSize:'12px', color:'#999'}}>—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

            {data.length === 0 && <p style={{textAlign:'center', padding:'20px', color:'#777'}}>No hay prendas pendientes.</p>}
        </div>
    );
};