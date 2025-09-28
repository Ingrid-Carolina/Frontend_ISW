import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    TextField, 
    MenuItem, 
    CircularProgress, 
    Alert, 
    Backdrop,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip,
    LinearProgress
} from '@mui/material';
import { api } from '../api/api';
import Imgjud from '/Images/Fondojugadores.png';
import EditableHeaderImage from '../components/EditableHeaderImage';
import EditableText from '../components/EditableText';
import EditIcon from '@mui/icons-material/Edit';
import './NuestroEquipo.css';


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

const NuestroEquipo = () => {
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

    const [textos, setTextos] = useState({});

    // NUEVO: Estados para el header como en Contacto.jsx
    const [headerUrl, setHeaderUrl] = useState(null);
    const [headerTitle, setHeaderTitle] = useState('NUESTRO EQUIPO');
    const [openHeaderEdit, setOpenHeaderEdit] = useState(false);
    const [headerTitleInput, setHeaderTitleInput] = useState('NUESTRO EQUIPO');
    const [headerFile, setHeaderFile] = useState(null);
    const [headerUploading, setHeaderUploading] = useState(false);
    const [headerError, setHeaderError] = useState('');
    const [headerPreview, setHeaderPreview] = useState(null);

    const [galeriaImages, setGaleriaImages] = useState([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');

    // NUEVO: Effect para gestionar preview de imagen del header
    useEffect(() => {
        if (!headerFile) {
            setHeaderPreview(null);
            return;
        }
        const url = URL.createObjectURL(headerFile);
        setHeaderPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [headerFile]);

    const fetchTextos = async () => {
        try {
            const res = await api.get('/auth/nuestroequipo/textos', {
                withCredentials: true
            });
            if (res.data && res.data.success && res.data.data) {
                setTextos(prevTextos => ({
                    ...prevTextos, // Mantener valores por defecto
                    ...res.data.data // Sobrescribir con datos del servidor
                }));
                
                // Sincronizar headerTitle si existe titulo_principal
                if (res.data.data.titulo_principal) {
                    setHeaderTitle(res.data.data.titulo_principal);
                }
            }
        } catch (error) {
            console.error('Error al cargar textos:', error);
        }
    };

    const handleTextSave = async (clave, nuevoTexto) => {
        if (!clave || !nuevoTexto) {
            showMessage('Datos inválidos para guardar texto', 'error');
            return;
        }

        try {
            // Actualizar estado local inmediatamente
            setTextos(prevTextos => ({
                ...prevTextos,
                [clave]: nuevoTexto
            }));

            // Sincronizar headerTitle si es el título principal
            if (clave === 'titulo_principal') {
                setHeaderTitle(nuevoTexto);
            }

            // Enviar al servidor
            const res = await api.put('/auth/nuestroequipo/textos', {
                clave,
                valor: nuevoTexto
            }, {
                withCredentials: true
            });

            if (res.data && res.data.success) {
                showMessage('Texto actualizado correctamente', 'success');
            } else {
                throw new Error('Respuesta inválida del servidor');
            }
        } catch (error) {
            console.error('Error al guardar texto:', error);
            // Revertir cambio local
            setTextos(prevTextos => ({
                ...prevTextos,
                [clave]: textos[clave] || ''
            }));
            if (clave === 'titulo_principal') {
                setHeaderTitle(textos.titulo_principal || 'NUESTRO EQUIPO');
            }
            showMessage('Error al guardar el texto', 'error');
        }
    };

    const [images, setImages] = useState({
        Equipo_header: Imgjud,
    });

    // Función para obtener la junta directiva desde el backend
    const fetchCuerpoTecnico = async () => {
        try {
            const res = await api.get('/auth/junta-directiva', {
                withCredentials: true,
                skipAuthRedirect: true,
            });
            
            if (res.data && Array.isArray(res.data)) {
                const miembros = res.data.map(miembro => ({
                    id: miembro.id_miembro,
                    nombre: miembro.nombre || '',
                    rol: miembro.rol || ''
                }));
                
                setCuerpoTecnico(miembros);
                console.log('Junta directiva cargada:', miembros);
            }
        } catch (error) {
            console.error('Error al cargar junta directiva:', error);
            showMessage('Error al cargar los datos de la junta directiva', 'error');
        }
    };

    const fetchImages = async () => {
        try {
            const response = await api.get('/auth/images', {
                withCredentials: true,
                skipAuthRedirect: true,
            });
            
            if (response.data && Array.isArray(response.data)) {
                const imagesMap = response.data.reduce((acc, current) => {
                    if (current.type && current.url) {
                        acc[current.type] = current.url;
                    }
                    return acc;
                }, {});

                const headerImageUrl = imagesMap.Equipo_header || Imgjud;
                setHeaderUrl(headerImageUrl);
                setImages(prev => ({
                    ...prev,
                    Equipo_header: headerImageUrl,
                }));
            }
        } catch (e) {
            console.error('Error al cargar imágenes:', e);
            setError('No se pudieron cargar las imágenes. Inténtelo de nuevo más tarde.');
        }
    };

    // NUEVO: Funciones para gestionar el header como en Contacto.jsx
     const openHeaderEditor = () => {
        const currentTitle = textos.titulo_principal || headerTitle || 'NUESTRO EQUIPO';
        setHeaderTitleInput(currentTitle);
        setHeaderFile(null);
        setHeaderError('');
        setOpenHeaderEdit(true);
    };

     const saveHeader = async () => {
        try {
            setHeaderError('');
            setHeaderUploading(true);

            const titleToSave = (headerTitleInput || '').trim() || 'NUESTRO EQUIPO';

            // 1) Actualizar títulos inmediatamente
            setTextos(prevTextos => ({
                ...prevTextos,
                titulo_principal: titleToSave
            }));
            setHeaderTitle(titleToSave);

            // 2) Subir imagen si se seleccionó
            let newUrl = headerUrl;
            if (headerFile) {
                const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
                if (!allowed.includes(headerFile.type)) {
                    throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o AVIF.');
                }
                if (headerFile.size > 8 * 1024 * 1024) {
                    throw new Error('La imagen supera los 8 MB.');
                }

                const fd = new FormData();
                fd.append('file', headerFile);
                const up = await api.post('/auth/upload', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                });
                
                if (up.data && up.data.url) {
                    newUrl = up.data.url;
                    
                    await api.put('/auth/images', {
                        type: 'Equipo_header',
                        url: newUrl,
                    }, {
                        withCredentials: true,
                    });
                    
                    setHeaderUrl(newUrl);
                    setImages(prev => ({ 
                        ...prev, 
                        Equipo_header: newUrl 
                    }));
                }
            }

            // 3) Guardar título en servidor
            try {
                await handleTextSave('titulo_principal', titleToSave);
            } catch (textError) {
                console.warn('Error al guardar título:', textError);
            }

            // 4) Limpiar y cerrar
            setHeaderFile(null);
            setHeaderPreview(null);
            setOpenHeaderEdit(false);
            showMessage('Encabezado actualizado correctamente', 'success');
            
        } catch (err) {
            console.error('Error en saveHeader:', err);
            // Revertir cambios
            const originalTitle = textos.titulo_principal || 'NUESTRO EQUIPO';
            setTextos(prevTextos => ({
                ...prevTextos,
                titulo_principal: originalTitle
            }));
            setHeaderTitle(originalTitle);
            
            const msg = err?.response?.data?.mensaje || 
                        err?.response?.data?.error || 
                        err?.message || 
                        'Error al actualizar el encabezado.';
            setHeaderError(msg);
        } finally {
            setHeaderUploading(false);
        }
    };

    // Check if user is admin - No bloquea el acceso si falla
     useEffect(() => {
        const initializeComponent = async () => {
            try {
                // Verificar rol
                const res = await api.get('/auth/obtenerperfil', {
                    withCredentials: true,
                    skipAuthRedirect: true,
                });
                const perfil = Array.isArray(res.data) ? res.data[0] : res.data;
                const role = String(perfil?.rol || '').toLowerCase().trim();
                const isAdminUser = role === 'admin';

                setIsLoggedIn(!!perfil);
                setIsAdmin(isAdminUser);
            } catch (error) {
                console.log('Usuario no logueado:', error.message);
                setIsLoggedIn(false);
                setIsAdmin(false);
            }

            // Cargar datos en paralelo
            await Promise.allSettled([
                fetchTextos(),
                fetchImages(),
                fetchCuerpoTecnico()
            ]);

            setCheckingAuth(false);
        };

        initializeComponent();

        // Event listener para refresh de auth
        const onAuthRefresh = () => {
            setCheckingAuth(true);
            initializeComponent();
        };
        window.addEventListener('auth:refresh', onAuthRefresh);
        return () => window.removeEventListener('auth:refresh', onAuthRefresh);
    }, []);

    // Subida/guardado genérico
    const handleImageChange = async (type, file) => {
        if (!file || !(file instanceof File)) {
            showMessage('Error: No se seleccionó un archivo válido.', 'error');
            return;
        }

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            showMessage('Error: Solo se permiten archivos de imagen.', 'error');
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 8 * 1024 * 1024) {
            showMessage('Error: La imagen no puede exceder 8MB.', 'error');
            return;
        }

        try {
            setUploadingImage(true);
            showMessage('Subiendo imagen...', 'info');

            // Crear FormData para la subida
            const formData = new FormData();
            formData.append('file', file);

            console.log('Subiendo archivo:', file.name, 'Tipo:', file.type, 'Tamaño:', file.size);

            // Subir archivo
            const uploadResponse = await api.post('/auth/upload', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data' 
                },
                withCredentials: true,
            });

            if (!uploadResponse.data?.url) {
                throw new Error('No se recibió URL de la imagen subida');
            }

            const finalUrl = uploadResponse.data.url;
            console.log('Imagen subida exitosamente:', finalUrl);

            // Guardar en base de datos
            await api.put('/auth/images', {
                type,
                url: finalUrl,
            }, {
                withCredentials: true,
            });

            console.log('Imagen guardada en BD:', type, finalUrl);

            // Actualizar estado local
            if (type.startsWith('galeria_')) {
                const index = parseInt(type.split('_')[1], 10) - 1;
                setGaleriaImages(prevImages => {
                    const updated = [...prevImages];
                    updated[index] = finalUrl;
                    return updated;
                });
            } else if (type === 'Equipo_header') {
                // NUEVO: Actualizar también headerUrl
                setHeaderUrl(finalUrl);
                setImages(prev => ({ 
                    ...prev, 
                    [type]: finalUrl 
                }));
            } else {
                setImages(prev => ({ 
                    ...prev, 
                    [type]: finalUrl 
                }));
            }

            showMessage('Imagen actualizada correctamente', 'success');

        } catch (error) {
            console.error(`Error al actualizar imagen de ${type}:`, error);
            
            let mensaje = 'Error al actualizar la imagen';
            
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 413) {
                    mensaje = 'La imagen es demasiado grande. Máximo 5MB.';
                } else if (status === 415) {
                    mensaje = 'Formato de imagen no válido.';
                } else if (status === 401 || status === 403) {
                    mensaje = 'No tienes permisos para subir imágenes.';
                } else if (status === 500) {
                    mensaje = 'Error interno del servidor.';
                } else {
                    mensaje = data?.mensaje || `Error ${status}`;
                }
            } else if (error.request) {
                mensaje = 'No se pudo conectar con el servidor.';
            } else {
                mensaje = error.message || 'Error desconocido';
            }

            showMessage(mensaje, 'error');
        } finally {
            setUploadingImage(false);
        }
    };

   if (loading && checkingAuth) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity='error' sx={{ my: 2 }}>
                {error}
            </Alert>
        );
    }
    const showMessage = (message, type = 'success') => {
        setBannerMsg(message || 'Operación completada');
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

    // Tarjeta de miembro mejorada con diseño más atractivo
    const MemberCard = ({ member }) => (
        <Paper
            elevation={8}
            sx={{
                p: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg,  #2596be 0%, #1e0851 100%)',
                borderRadius: 4,
                minWidth: { xs: 160, md: 220 },
                minHeight: { xs: 120, md: 140 },
                border: 'none',
                position: 'relative',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    pointerEvents: 'none',
                },
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                    '& .member-actions': {
                        opacity: 1,
                        transform: 'translateY(0)',
                    }
                }
            }}
        >
            {/* Efecto de brillo sutil */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    transform: 'rotate(45deg)',
                    animation: 'shimmer 3s ease-in-out infinite',
                    '@keyframes shimmer': {
                        '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
                        '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
                    }
                }}
            />

            {/* Botones de administración mejorados */}
            {isAdmin && (
                <Box
                    className="member-actions"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 0.5,
                        opacity: 0,
                        transform: 'translateY(-10px)',
                        transition: 'all 0.3s ease',
                        zIndex: 10,
                    }}
                >
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal('edit', member);
                        }}
                        sx={{
                            minWidth: 'auto',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: '#3b82f6',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                transform: 'scale(1.1)',
                            },
                            p: 0,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <Edit />
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteMember(member.id);
                        }}
                        sx={{
                            minWidth: 'auto',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: '#f44336',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                transform: 'scale(1.1)',
                            },
                            p: 0,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <Trash />
                    </Button>
                </Box>
            )}

            {/* Avatar placeholder con iniciales */}
            <Box
                sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Typography 
                    sx={{ 
                        color: 'white', 
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                    }}
                >
                    {member.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </Typography>
            </Box>

            <Typography 
                variant="h6" 
                sx={{ 
                    fontWeight: 'bold', 
                    color: 'white', 
                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
            >
                {member.rol}
            </Typography>
            <Typography 
                variant="body2" 
                sx={{ 
                    color: 'rgba(255,255,255,0.9)', 
                    fontSize: { xs: '0.8rem', md: '0.9rem' },
                    fontWeight: 500,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
            >
                {member.nombre}
            </Typography>
        </Paper>
    );

    // Función para organizar miembros por categorías
    const organizarMiembrosPorCategoria = () => {
        const categorias = {
            ejecutiva: ['Presidente', 'Vicepresidente'],
            administrativa: ['Secretaria', 'Tesorera'],
            supervision: ['Fiscal'],
            vocales: ['Vocal I', 'Vocal II', 'Vocal III']
        };

        const resultado = {};
        
        Object.entries(categorias).forEach(([categoria, roles]) => {
            resultado[categoria] = cuerpoTecnico.filter(miembro => 
                roles.includes(miembro.rol)
            );
        });

        return resultado;
    };

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

    const miembrosPorCategoria = organizarMiembrosPorCategoria();

    return (
        <>
            {/* Backdrop para mostrar carga de imagen */}
            <Backdrop open={uploadingImage} sx={{ zIndex: 1300 }}>
                <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <CircularProgress color="inherit" />
                    <Typography sx={{ mt: 2 }}>Subiendo imagen...</Typography>
                </Box>
            </Backdrop>

            {/* HEADER MEJORADO - IGUAL QUE CONTACTO */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    minHeight: { xs: '75vh', md: '90vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url(${headerUrl || Imgjud})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: { xs: 6, md: 8 },
                }}
            >
                {/* Overlay oscuro */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(12, 0, 90, 0.8)',
                        zIndex: 1,
                    }}
                />

                {/* Botón único para editar TÍTULO + IMAGEN (solo admin) */}
                {isAdmin && (
                    <Tooltip title='Editar título/imagen'>
                        <IconButton
                            onClick={openHeaderEditor}
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                right: 16,
                                color: 'white',
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                                zIndex: 3,
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                )}

                {/* Título del header */}
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant='h2'
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '3.5rem', md: '6rem' },
                            fontFamily: 'Varsity, sans-serif',
                            color: 'white',
                            textAlign: 'center',
                            textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
                        }}
                    >
                        {headerTitle || 'NUESTRO EQUIPO'}
                    </Typography>
                </Box>
            </Box>
            <Dialog
                open={openHeaderEdit}
                onClose={() => !headerUploading && setOpenHeaderEdit(false)}
                maxWidth='sm'
                fullWidth
            >
                <DialogTitle>Editar encabezado</DialogTitle>
                <DialogContent dividers sx={{ pt: 1.5, pb: 2, px: 2 }}>
                    <TextField
                        label='Título del header'
                        value={headerTitleInput}
                        onChange={e => setHeaderTitleInput(e.target.value)}
                        fullWidth
                        size='small'
                        margin='dense'
                        InputLabelProps={{ shrink: true }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.2 } }}
                    />

                    <Button
                        variant='contained'
                        component='label'
                        disabled={headerUploading}
                        sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}
                    >
                        {headerFile ? 'Imagen seleccionada' : 'Seleccionar nueva imagen'}
                        <input
                            type='file'
                            hidden
                            accept='image/jpeg,image/png,image/webp,image/avif'
                            onChange={e => {
                                const f = e.target.files?.[0] || null;
                                setHeaderFile(f); 
                            }}
                        />
                    </Button>
                    <Box sx={{ mt: 1, opacity: 0.8, fontSize: 12 }}>
                        Formatos: JPG, PNG, WEBP, AVIF.
                    </Box>
                    
                    {/* Vista previa */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: 13, mb: 1, color: 'text.secondary' }}>
                            Vista previa
                        </Typography>
                        <Box
                            sx={{
                                width: { xs: 'min(85vw, 150px)', sm: 300 },
                                mx: 'auto',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1.5,
                                overflow: 'hidden',
                                position: 'relative',
                                pt: '30%', 
                                bgcolor: '#f7f7f7',
                                boxShadow: 1,
                            }}
                        >
                            <Box
                                component='img'
                                src={headerPreview || headerUrl || Imgjud}
                                alt='Vista previa del encabezado'
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>

                        {headerFile && (
                            <Button
                                size='small'
                                onClick={() => {
                                    setHeaderFile(null);
                                    setHeaderPreview(null);
                                }}
                                sx={{ mt: 1 }}
                            >
                                Quitar selección
                            </Button>
                        )}
                    </Box>

                    {headerError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {headerError}
                        </Alert>
                    )}

                    {headerUploading && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Guardando encabezado...
                            </Typography>
                            <LinearProgress />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenHeaderEdit(false);
                            setHeaderFile(null);
                            setHeaderPreview(null);
                        }}
                        disabled={headerUploading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={saveHeader}
                        variant='contained'
                        disabled={headerUploading}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

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
                    <EditableText
                        text={textos.titulo_jugadores|| "LOS JUGADORES"}
                        onTextSave={(newText) => handleTextSave("titulo_jugadores", newText)}
                        isAdmin={isAdmin}
                        variant="h2"
                        className="varsity-font"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '3rem', md: '4rem' },
                        }}
                        />
                </Box>
            </Box>

            {/* JUNTA DIRECTIVA MEJORADA */}
            <Box 
                sx={{ 
                    px: { xs: 3, md: 10 }, 
                    py: 8, 
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    minHeight: '100vh'
                }}
            >
                <EditableText
                    text={textos.titulo_junta_directiva|| "JUNTA DIRECTIVA"}
                    onTextSave={(newText) => handleTextSave("titulo_junta_directiva", newText)}
                    isAdmin={isAdmin}
                    variant="h2"
                    className="varsity-font"
                    sx={{
                        fontWeight: 'bold',
                        fontFamily: '"Varsity", cursive',
                        textAlign: 'center',
                        mb: 8,
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        background: 'linear-gradient(45deg, #2596be 30%, #1e0851 90%)',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 4px 8px rgba(102, 126, 234, 0.3)',
                    }}
                />

                {/* Liderazgo Ejecutivo */}
                {miembrosPorCategoria.ejecutiva.length > 0 && (
                    <Box sx={{ mb: 8 }}>
                        <EditableText
                            text={textos.categoria_ejecutiva|| "Liderazgo Ejecutivo"}
                            onTextSave={(newText) => handleTextSave("categoria_ejecutiva", newText)}
                            isAdmin={isAdmin}
                            variant="h2"
                            className="varsity-font"
                            sx={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                mb: 4,
                                color: '#17181bff',
                                fontSize: { xs: '1.5rem', md: '1.8rem' }
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 4,
                                mb: 6
                            }}
                        >
                            {miembrosPorCategoria.ejecutiva.map((miembro) => (
                                <MemberCard key={miembro.id} member={miembro} />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Área Administrativa */}
                {miembrosPorCategoria.administrativa.length > 0 && (
                    <Box sx={{ mb: 8 }}>
                        <EditableText
                            text={textos.categoria_administrativa|| "Área Administrativa"}
                            onTextSave={(newText) => handleTextSave("categoria_administrativa", newText)}
                            isAdmin={isAdmin}
                            variant="h2"
                            className="varsity-font"
                            sx={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                mb: 4,
                                color: '#17181bff',
                                fontSize: { xs: '1.5rem', md: '1.8rem' }
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 4,
                                mb: 6
                            }}
                        >
                            {miembrosPorCategoria.administrativa.map((miembro) => (
                                <MemberCard key={miembro.id} member={miembro} />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Supervisión */}
                {miembrosPorCategoria.supervision.length > 0 && (
                    <Box sx={{ mb: 8 }}>
                        <EditableText
                            text={textos.categoria_supervision|| "Supervisión"}
                            onTextSave={(newText) => handleTextSave("categoria_supervision", newText)}
                            isAdmin={isAdmin}
                            variant="h2"
                            className="varsity-font"
                            sx={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                mb: 4,
                                color: '#17181bff',
                                fontSize: { xs: '1.5rem', md: '1.8rem' }
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 4,
                                mb: 6
                            }}
                        >
                            {miembrosPorCategoria.supervision.map((miembro) => (
                                <MemberCard key={miembro.id} member={miembro} />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Vocales */}
                {miembrosPorCategoria.vocales.length > 0 && (
                    <Box sx={{ mb: 8 }}>
                        <EditableText
                            text={textos.categoria_vocales|| "Vocales"}
                            onTextSave={(newText) => handleTextSave("categoria_vocales", newText)}
                            isAdmin={isAdmin}
                            variant="h2"
                            className="varsity-font"
                            sx={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                mb: 4,
                                color: '#17181bff',
                                fontSize: { xs: '1.5rem', md: '1.8rem' }
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: 4,
                                mb: 6
                            }}
                        >
                            {miembrosPorCategoria.vocales.map((miembro) => (
                                <MemberCard key={miembro.id} member={miembro} />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Mensaje cuando no hay miembros */}
                {cuerpoTecnico.length === 0 && (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                        }}
                    >
                        <EditableText
                            text={textos.mensaje_vacio|| " No hay miembros registrados en la junta directiva"}
                            onTextSave={(newText) => handleTextSave("mensaje_vacio", newText)}
                            isAdmin={isAdmin}
                            variant="h3"
                            className="varsity-font"
                            sx={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                mb: 4,
                                color: '#718096',
                                fontSize: { xs: '1.5rem', md: '1.8rem' }
                            }}
                        />

                        {isAdmin && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#a0aec0'
                                }}
                            >
                                Agrega el primer miembro usando el botón de abajo
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Botón de administración mejorado */}
                {isAdmin && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 8,
                        }}
                    >
                        <Button
                            onClick={() => openModal('add')}
                            variant="contained"
                            startIcon={<Plus />}
                            sx={{
                                background: 'linear-gradient(45deg, #2596be 0%, #1e0851 100%)',
                                color: 'white',
                                borderRadius: '50px',
                                px: 4,
                                py: 2,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #2596beff 0%, #230a5fff 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
                                },
                                '&:active': {
                                    transform: 'translateY(0)',
                                }
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

            {/* MODAL EDITAR HEADER (título + imagen) - IGUAL QUE CONTACTO */}
            <Dialog
                open={openHeaderEdit}
                onClose={() => !headerUploading && setOpenHeaderEdit(false)}
                maxWidth='sm'
                fullWidth
            >
                <DialogTitle>Editar encabezado</DialogTitle>
                <DialogContent
                    dividers
                    sx={{
                        pt: 1.5,
                        pb: 2,
                        px: 2,
                    }}
                >
                    <TextField
                        label='Título del header'
                        value={headerTitleInput}
                        onChange={e => setHeaderTitleInput(e.target.value)}
                        fullWidth
                        size='small'
                        margin='dense'
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 1.2 },
                        }}
                    />

                    <Button
                        variant='contained'
                        component='label'
                        disabled={headerUploading}
                        sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}
                    >
                        {headerFile ? 'Imagen seleccionada' : 'Seleccionar nueva imagen'}
                        <input
                            type='file'
                            hidden
                            accept='image/jpeg,image/png,image/webp,image/avif'
                            onChange={e => {
                                const f = e.target.files?.[0] || null;
                                setHeaderFile(f); 
                            }}
                        />
                    </Button>
                    <Box sx={{ mt: 1, opacity: 0.8, fontSize: 12 }}>
                        Formatos: JPG, PNG, WEBP, AVIF.
                    </Box>
                    
                    {/* Vista previa */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography sx={{ fontSize: 13, mb: 1, color: 'text.secondary' }}>
                            Vista previa
                        </Typography>

                        <Box
                            sx={{
                                width: { xs: 'min(85vw, 150px)', sm: 300 },
                                mx: 'auto',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1.5,
                                overflow: 'hidden',
                                position: 'relative',
                                pt: '30%', 
                                bgcolor: '#f7f7f7',
                                boxShadow: 1,
                            }}
                        >
                            <Box
                                component='img'
                                src={headerPreview || headerUrl || undefined}
                                alt='Vista previa del encabezado'
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>

                        {headerFile && (
                            <Box
                                sx={{
                                    mt: 1,
                                    display: 'flex',
                                    gap: 1,
                                    justifyContent: 'center',
                                }}
                            >
                                <Button
                                    size='small'
                                    onClick={() => {
                                        setHeaderFile(null);
                                        setHeaderPreview(null);
                                    }}
                                >
                                    Quitar selección
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {/* Error del header */}
                    {headerError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {headerError}
                        </Alert>
                    )}

                    {/* Progress bar durante la subida */}
                    {headerUploading && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Guardando encabezado...
                            </Typography>
                            <LinearProgress />
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenHeaderEdit(false);
                            setHeaderFile(null);
                            setHeaderPreview(null);
                        }}
                        disabled={headerUploading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={saveHeader}
                        variant='contained'
                        disabled={headerUploading}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

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
                            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
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
                            <h3 style={{ 
                                margin: 0, 
                                fontSize: '1.5rem', 
                                color: '#333',
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                backgroundClip: 'text',
                                textFillColor: 'transparent',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                {modalMode === 'add' ? 'Agregar Miembro' : 'Editar Miembro'}
                            </h3>
                            <button
                                onClick={closeModal}
                                disabled={loading}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: loading ? 0.5 : 1,
                                    transition: 'all 0.2s ease',
                                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                    color: '#f44336',
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.backgroundColor = 'rgba(244, 67, 54, 0.2)';
                                        e.target.style.transform = 'scale(1.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
                                        e.target.style.transform = 'scale(1)';
                                    }
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        '&.Mui-focused': {
                                            color: '#667eea',
                                        },
                                    },
                                }}
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        '&.Mui-focused': {
                                            color: '#667eea',
                                        },
                                    },
                                }}
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
                                    borderRadius: '25px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    opacity: loading ? 0.7 : 1,
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.backgroundColor = '#e5e7eb';
                                        e.target.style.transform = 'translateY(-1px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.backgroundColor = '#f3f4f6';
                                        e.target.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveMember}
                                disabled={loading}
                                style={{
                                    padding: '12px 24px',
                                    background: loading ? 
                                        '#93c5fd' : 
                                        'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s',
                                    boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                                    }
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

export default NuestroEquipo;