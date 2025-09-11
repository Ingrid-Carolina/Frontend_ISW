import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, TextField, MenuItem } from '@mui/material';
import { api } from '../api/api';
import Imgjud from '/Images/Fondojugadores.png';

// SVG Icons (los mismos que tienes)
const X = () => (
    <svg
        width='20'
        height='20'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
    >
        <line x1='18' y1='6' x2='6' y2='18'></line>
        <line x1='6' y1='6' x2='18' y2='18'></line>
    </svg>
);

const Edit = () => (
    <svg
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
    >
        <path d='M12 20h9' />
        <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />
    </svg>
);

const Plus = () => (
    <svg
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
    >
        <line x1='12' y1='5' x2='12' y2='19'></line>
        <line x1='5' y1='12' x2='19' y2='12'></line>
    </svg>
);

const Trash = () => (
    <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
    >
        <polyline points='3,6 5,6 21,6'></polyline>
        <path d='m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2'></path>
        <line x1='10' y1='11' x2='10' y2='17'></line>
        <line x1='14' y1='11' x2='14' y2='17'></line>
    </svg>
);

// Roles disponibles para la junta directiva
const rolesDisponibles = [
    'Presidente',
    'Vicepresidente', 
    'Secretaria',
    'Tesorera',
    'Fiscal',
    'Vocal I',
    'Vocal II',
    'Vocal III'
];

const Jugadores = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [cuerpoTecnico, setCuerpoTecnico] = useState([]); // Inicializar vacío
    const [formData, setFormData] = useState({
        id: null,
        nombre: '',
        rol: ''
    });
    const [bannerMsg, setBannerMsg] = useState('');
    const [bannerType, setBannerType] = useState('success');
    const [showBanner, setShowBanner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Función para obtener la junta directiva desde el backend
    const fetchCuerpoTecnico = async () => {
        try {
            const res = await api.get('/auth/junta-directiva', {
                withCredentials: true,
                skipAuthRedirect: true,
            });
            
            // Mapear los datos del backend al formato esperado por el frontend
            const miembros = res.data.map(miembro => ({
                id: miembro.id_miembro,
                nombre: miembro.nombre,
                rol: miembro.rol
            }));
            
            setCuerpoTecnico(miembros);
            console.log('Junta directiva cargada:', miembros);
        } catch (error) {
            console.error('Error al cargar junta directiva:', error);
            showMessage('Error al cargar los datos de la junta directiva', 'error');
        }
    };

    // Check if user is admin - No bloquea el acceso si falla
    useEffect(() => {
        const fetchRole = async () => {
            try {
                const res = await api.get('/auth/obtenerperfil', {
                    withCredentials: true,
                    skipAuthRedirect: true,
                });
                const perfil = Array.isArray(res.data) ? res.data[0] : res.data;

                const role = String(perfil?.rol || '')
                    .toLowerCase()
                    .trim();
                const isAdminUser = role === 'admin';

                setIsLoggedIn(!!perfil);
                setIsAdmin(isAdminUser);

                console.log(
                    '🔍 User role:',
                    role,
                    'isAdmin:',
                    isAdminUser,
                    'isLoggedIn:',
                    !!perfil,
                );
            } catch (error) {
                console.log('Usuario no logueado o sin permisos:', error.message);
                setIsLoggedIn(false);
                setIsAdmin(false);
            } finally {
                setCheckingAuth(false);
            }
        };

        fetchRole();
        fetchCuerpoTecnico(); // Cargar datos iniciales

        // Listen for auth refresh events
        const onAuthRefresh = () => {
            setCheckingAuth(true);
            fetchRole();
        };
        window.addEventListener('auth:refresh', onAuthRefresh);
        return () => window.removeEventListener('auth:refresh', onAuthRefresh);
    }, []);

    const showMessage = (message, type = 'success') => {
        setBannerMsg(message);
        setBannerType(type);
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 4000);
    };

    const openModal = (mode = 'add', member = null) => {
        if (!isLoggedIn) {
            showMessage('Debes iniciar sesión para modificar la junta directiva', 'error');
            return;
        }

        if (!isAdmin) {
            showMessage('Solo el administrador puede modificar la junta directiva', 'error');
            return;
        }

        setModalMode(mode);
        if (mode === 'edit' && member) {
            setFormData({
                id: member.id,
                nombre: member.nombre,
                rol: member.rol
            });
        } else {
            setFormData({
                id: null,
                nombre: '',
                rol: rolesDisponibles[0]
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            id: null,
            nombre: '',
            rol: ''
        });
        setShowBanner(false);
    };

    const validateForm = () => {
        if (!formData.nombre.trim()) {
            showMessage('El nombre es requerido', 'error');
            return false;
        }

        if (!formData.rol.trim()) {
            showMessage('El rol es requerido', 'error');
            return false;
        }

        // Verificar si el rol ya está ocupado (excepto en modo edición por el mismo miembro)
        const rolExistente = cuerpoTecnico.find(m => 
            m.rol === formData.rol && 
            (modalMode === 'add' || m.id !== formData.id)
        );

        if (rolExistente) {
            showMessage(`El rol "${formData.rol}" ya está ocupado por ${rolExistente.nombre}`, 'error');
            return false;
        }

        return true;
    };

    const saveMember = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const requestBody = {
                nombre: formData.nombre.trim(),
                rol: formData.rol
            };

            if (modalMode === 'add') {
                // Agregar nuevo miembro via API - RUTA CORREGIDA
                const res = await api.post('/auth/junta-directiva', requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                if (res.data) {
                    // Recargar datos desde el servidor
                    await fetchCuerpoTecnico();
                    showMessage('Miembro agregado correctamente', 'success');
                }
            } else {
                // Editar miembro existente via API - RUTA CORREGIDA
                const res = await api.put(`/auth/junta-directiva/${formData.id}`, requestBody, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                if (res.data) {
                    // Recargar datos desde el servidor
                    await fetchCuerpoTecnico();
                    showMessage('Miembro actualizado correctamente', 'success');
                }
            }

            setTimeout(() => {
                closeModal();
            }, 1500);

        } catch (error) {
            console.error('Error:', error);
            
            let mensaje = 'Error al guardar los cambios';
            
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 404) {
                    mensaje = 'Endpoint no encontrado. Verifica la ruta del backend';
                } else if (status === 401 || status === 403) {
                    mensaje = 'No tienes permisos para realizar esta acción';
                } else if (status === 400) {
                    mensaje = data?.mensaje || 'Datos inválidos enviados al servidor';
                } else if (status === 500) {
                    mensaje = 'Error interno del servidor. Revisa los logs del backend';
                } else {
                    mensaje = data?.mensaje || `Error ${status}: ${error.response.statusText}`;
                }
            } else if (error.request) {
                mensaje = 'No se pudo conectar con el servidor. Verifica que el backend esté funcionando';
            } else {
                mensaje = `Error en la petición: ${error.message}`;
            }

            showMessage(mensaje, 'error');
        } finally {
            setLoading(false);
        }
    };

    const deleteMember = async (memberId) => {
        if (!isLoggedIn || !isAdmin) {
            showMessage('Solo el administrador puede eliminar miembros', 'error');
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar este miembro?')) {
            try {
                setLoading(true);

                // RUTA CORREGIDA
                const res = await api.delete(`/auth/junta-directiva/${memberId}`, {
                    withCredentials: true,
                });

                if (res.data) {
                    // Recargar datos desde el servidor
                    await fetchCuerpoTecnico();
                    showMessage('Miembro eliminado correctamente', 'success');
                }

            } catch (error) {
                console.error('Error al eliminar miembro:', error);
                
                let mensaje = 'Error al eliminar el miembro';
                
                if (error.response) {
                    const status = error.response.status;
                    const data = error.response.data;

                    if (status === 404) {
                        mensaje = 'Miembro no encontrado';
                    } else if (status === 401 || status === 403) {
                        mensaje = 'No tienes permisos para eliminar miembros';
                    } else {
                        mensaje = data?.mensaje || `Error ${status}: ${error.response.statusText}`;
                    }
                } else if (error.request) {
                    mensaje = 'No se pudo conectar con el servidor';
                } else {
                    mensaje = `Error: ${error.message}`;
                }

                showMessage(mensaje, 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    // Resto del componente igual (MemberCard, VerticalLine, etc.)
    const MemberCard = ({ member }) => (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 1.5, md: 2 },
                textAlign: 'center',
                bgcolor: 'white',
                borderRadius: 2,
                minWidth: { xs: 140, md: 180 },
                border: '2px solid #10045c',
                position: 'relative',
            }}
        >
            {/* Botones de administración */}
            {isAdmin && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        display: 'flex',
                        gap: 0.5,
                    }}
                >
                    <Button
                        onClick={() => openModal('edit', member)}
                        sx={{
                            minWidth: 'auto',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            color: '#3b82f6',
                            '&:hover': {
                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            },
                            p: 0,
                        }}
                    >
                        <Edit />
                    </Button>
                    <Button
                        onClick={() => deleteMember(member.id)}
                        sx={{
                            minWidth: 'auto',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            color: '#f44336',
                            '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                            },
                            p: 0,
                        }}
                    >
                        <Trash />
                    </Button>
                </Box>
            )}

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#10045c', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                {member.rol}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray', fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                {member.nombre}
            </Typography>
        </Paper>
    );

    // Línea vertical
    const VerticalLine = ({ height = 30 }) => (
        <Box sx={{ width: '2px', height: { xs: height / 2, md: height }, bgcolor: '#10045c', mx: 'auto' }} />
    );

    // Contenedor con línea horizontal conectando hijos
    const HorizontalConnector = ({ children }) => (
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%'
        }}>
            <Box sx={{
                position: 'absolute',
                top: { xs: '0', md: '20px' },
                left: 0,
                right: 0,
                height: '2px',
                bgcolor: '#10045c'
            }} />
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'center',
                gap: { xs: 4, md: 6 },
                width: '100%'
            }}>
                {children}
            </Box>
        </Box>
    );

    if (checkingAuth) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#10045c',
                }}
            >
                <Typography variant='h6' sx={{ color: 'white' }}>
                    Cargando...
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {/* HEADER */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    minHeight: { xs: '60vh', md: '90vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url(${Imgjud})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: { xs: 6, md: 8 },
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '3rem', md: '7rem' },
                            fontFamily: '"Varsity", cursive',
                        }}
                    >
                        NUESTRO EQUIPO
                    </Typography>
                </Box>
            </Box>

            {/* SECCIÓN JUGADORES */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 4,
                    px: { xs: 3, md: 10 },
                    py: 6,
                    bgcolor: '#e6691d',
                    color: 'white',
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: '"Varsity", cursive',
                            fontWeight: 'bold',
                            mb: 2,
                            fontSize: { xs: '2.5rem', md: '4rem' },
                        }}
                    >
                        LOS JUGADORES
                    </Typography>
                </Box>
            </Box>

            {/* ORGANIGRAMA */}
            <Box sx={{ px: { xs: 3, md: 10 }, py: 6, bgcolor: '#f1f1f1', position: 'relative' }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontFamily: '"Varsity", cursive',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 6,
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        color: '#10045c',
                    }}
                >
                    Junta Directiva
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    
                    {/* PRESIDENTE */}
                    {cuerpoTecnico.find(m => m.rol === 'Presidente') && (
                        <MemberCard member={cuerpoTecnico.find(m => m.rol === 'Presidente')} />
                    )}

                    {/* Conexión hacia Vice, Secretaria y Tesorera */}
                    <VerticalLine />
                    <HorizontalConnector>
                        {cuerpoTecnico
                            .filter(m => ['Vicepresidente', 'Secretaria', 'Tesorera'].includes(m.rol))
                            .map((persona) => (
                                <Box key={persona.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <VerticalLine height={20} />
                                    <MemberCard member={persona} />
                                </Box>
                            ))}
                    </HorizontalConnector>

                    {/* Conexión hacia Fiscal */}
                    {cuerpoTecnico.find(m => m.rol === 'Fiscal') && (
                        <>
                            <VerticalLine />
                            <MemberCard member={cuerpoTecnico.find(m => m.rol === 'Fiscal')} />
                        </>
                    )}

                    {/* Conexión hacia Vocales */}
                    {cuerpoTecnico.filter(m => m.rol.includes('Vocal')).length > 0 && (
                        <>
                            <VerticalLine />
                            <HorizontalConnector>
                                {cuerpoTecnico
                                    .filter(m => m.rol.includes('Vocal'))
                                    .map((persona) => (
                                        <Box key={persona.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <VerticalLine height={20} />
                                            <MemberCard member={persona} />
                                        </Box>
                                    ))}
                            </HorizontalConnector>
                        </>
                    )}
                </Box>

                {/* Botón de administración en la parte inferior */}
                {isAdmin && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 6,
                            gap: 2,
                        }}
                    >
                        <Button
                            onClick={() => openModal('add')}
                            variant="contained"
                            startIcon={<Plus />}
                            sx={{
                                backgroundColor: '#10045c',
                                color: 'white',
                                borderRadius: '25px',
                                px: 3,
                                py: 1.5,
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#0d0345',
                                },
                            }}
                        >
                            Agregar Miembro
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Banner Global */}
            {showBanner && !showModal && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1001,
                        minWidth: '300px',
                        maxWidth: '500px',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: bannerType === 'error' ? '#f44336' : '#4caf50',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        animation: 'slideDown 0.3s ease-in-out',
                    }}
                >
                    <Typography
                        sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}
                    >
                        {bannerMsg}
                    </Typography>
                </Box>
            )}

            {/* Modal para editar/agregar miembros */}
            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '24px',
                            width: '90%',
                            maxWidth: '500px',
                            maxHeight: '80vh',
                            overflow: 'auto',
                        }}
                    >
                        {/* Modal Header */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px',
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
                                {modalMode === 'add' ? 'Agregar Miembro' : 'Editar Miembro'}
                            </h3>
                            <button
                                onClick={closeModal}
                                disabled={loading}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: loading ? 0.5 : 1,
                                }}
                            >
                                <X />
                            </button>
                        </div>

                        {/* Form */}
                        <div
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <TextField
                                label="Nombre Completo"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                disabled={loading}
                                fullWidth
                                required
                                variant="outlined"
                            />

                            <TextField
                                label="Rol"
                                value={formData.rol}
                                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                disabled={loading}
                                select
                                fullWidth
                                required
                                variant="outlined"
                            >
                                {rolesDisponibles.map((rol) => (
                                    <MenuItem key={rol} value={rol}>
                                        {rol}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>

                        {/* Banner dentro del modal */}
                        {showBanner && (
                            <Box
                                sx={{
                                    mt: 3,
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor:
                                        bannerType === 'error' ? '#f44336' : '#4caf50',
                                    color: 'white',
                                    animation: 'slideDown 0.3s ease-in-out',
                                }}
                            >
                                <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>
                                    {bannerMsg}
                                </Typography>
                            </Box>
                        )}

                        {/* Buttons */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end',
                                marginTop: '24px',
                            }}
                        >
                            <button
                                onClick={closeModal}
                                disabled={loading}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    opacity: loading ? 0.7 : 1,
                                    transition: 'all 0.2s',
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveMember}
                                disabled={loading}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: loading ? '#93c5fd' : '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {loading ? 'Guardando...' : modalMode === 'add' ? 'Agregar Miembro' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Jugadores;