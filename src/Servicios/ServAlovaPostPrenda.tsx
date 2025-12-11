/* src/Servicios/ServAlovaPostPrenda.tsx */
import { useState } from 'react';
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY, supabaseHeaders } from './supabaseConfig';
import { useAuth } from '../Context/AuthContext'; // <--- IMPORTANTE

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const ServAlovaPostPrenda = () => {
    // Estados
    const [tipo, setTipo] = useState("");
    const [talla, setTalla] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState({ text: "", isError: false });
    const [cargando, setCargando] = useState(false);

    // Contexto de Usuario
    const { user } = useAuth(); // <--- OBTENEMOS EL USUARIO LOGUEADO

    const instanceAlova = createAlova({
        baseURL: `${SUPABASE_URL}/rest/v1`,
        requestAdapter: adapterFetch(),
        beforeRequest(method) {
            method.config.headers = supabaseHeaders;
        },
        responded: (response) => response.json()
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagenFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validación de usuario
        if (!user) {
            setMensaje({ text: "⚠️ Error: No hay sesión activa. Recarga la página.", isError: true });
            return;
        }

        if (!imagenFile) {
            setMensaje({ text: "⚠️ Debes subir una foto obligatoriamente.", isError: true });
            return;
        }

        setCargando(true);
        setMensaje({ text: "Subiendo imagen...", isError: false });

        try {
            // 1. Subir imagen
            const fileName = `${Date.now()}_${imagenFile.name.replace(/\s/g, '')}`;
            const { error: uploadError } = await supabase.storage
                .from('evidencias')
                .upload(fileName, imagenFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('evidencias')
                .getPublicUrl(fileName);

            // 2. Guardar datos (INCLUYENDO EL ID DEL USUARIO)
            const nuevaPrenda = {
                tipo,
                talla,
                descripcion,
                estado: "Registrado",
                estado_aprobacion: "Pendiente",
                imagen_url: publicUrl,
                usuario_id: user.id // <--- ESTA LÍNEA ES LA CLAVE QUE FALTABA
            };

            await instanceAlova.Post("/Prenda", nuevaPrenda);

            setMensaje({ text: "✅ ¡Prenda enviada! Espera la aprobación.", isError: false });
            
            // Limpiar formulario
            setTipo(""); setTalla(""); setDescripcion(""); 
            setImagenFile(null); setPreview(null);

        } catch (err) {
            console.error(err);
            setMensaje({ text: "❌ Error al guardar. Verifica tu conexión.", isError: true });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{textAlign: 'center', color: 'var(--fala-green)', margin: '10px 0'}}>
                Registro de Prenda
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                        <label style={{fontWeight: 'bold'}}>Tipo</label>
                        <select value={tipo} onChange={e => setTipo(e.target.value)} required className="login-input">
                            <option value="">Seleccione...</option>
                            <option value="Jeans">Jeans</option>
                            <option value="Polera">Polera</option>
                            <option value="Vestido">Vestido</option>
                            <option value="Chaqueta">Chaqueta</option>
                        </select>
                    </div>
                    <div>
                        <label style={{fontWeight: 'bold'}}>Talla</label>
                        <input type="text" value={talla} onChange={e => setTalla(e.target.value)} required placeholder="Ej: M" className="login-input" />
                    </div>
                </div>

                <div>
                    <label style={{fontWeight: 'bold'}}>Descripción</label>
                    <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} required className="login-input" style={{minHeight:'80px'}} />
                </div>

                <div style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{display:'none'}} id="fileInput" />
                    
                    {preview ? (
                        <div style={{position:'relative', display:'inline-block'}}>
                            <img src={preview} alt="Vista" style={{ maxHeight: '150px', borderRadius:'8px' }} />
                            <button type="button" onClick={()=>{setPreview(null);setImagenFile(null)}} style={{position:'absolute', top:-10, right:-10, background:'red', color:'white', border:'none', borderRadius:'50%', width:'25px', height:'25px'}}>X</button>
                        </div>
                    ) : (
                        <label htmlFor="fileInput" style={{cursor:'pointer', display:'block'}}>
                            <div style={{fontSize:'30px'}}>📷</div>
                            <p>Clic para subir foto</p>
                        </label>
                    )}
                </div>

                <button type="submit" className="btn-empezar" disabled={cargando} style={{width:'100%', padding:'15px'}}>
                    {cargando ? "⏳ Enviando..." : "🚀 Registrar Prenda"}
                </button>
            </form>

            {mensaje.text && (
                <div style={{ marginTop: '20px', padding: '10px', borderRadius: '4px', textAlign: 'center',
                    background: mensaje.isError ? '#ffebee' : '#f1f8e9', 
                    color: mensaje.isError ? '#c62828' : '#33691e'
                }}>
                    {mensaje.text}
                </div>
            )}
        </div>
    );
};