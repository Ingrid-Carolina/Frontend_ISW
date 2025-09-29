// Home.jsx

import './Home.css';
import SeccionInfo from '../components/SeccionInfo';
import ValuesSection from '../components/ValuesSection';
import Acordeon from '../components/Acordeon';
import * as React from 'react';
import MediaCard from '../components/Card';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Box, CircularProgress, Alert } from '@mui/material';
import EditableImage from '../components/EditableImage';
import EditableText from '../components/EditableText';
import EditableHeaderImage from '../components/EditableHeaderImage';

// Componente para la sección "Sobre Nosotros"
const AboutUs = ({ titulo, descripcion }) => (
    <section className='about-us'>
        <h2>{titulo}</h2>
        <h3>{descripcion}</h3>
    </section>
);

// Componente para la sección "Misión" con imagen editable si es admin
const Mision = ({ onImageChange, misionImageUrl, isAdmin, titulo, descripcion }) => (
    <SeccionInfo
        titulo={titulo}
        descripcion={descripcion}
        imagenComponent={
            isAdmin ? (
                <EditableImage
                    src={misionImageUrl}
                    alt='Imagen de Misión'
                	onImageUpload={onImageChange}
                />
            ) : (
                <img
                    src={misionImageUrl}
                    alt='Imagen de Misión'
                    style={{ width: '100%', height: 'auto' }}
                />
            )
        }
        bgColor='#e06c14'
        textAlign='left'
    />
);

// Componente para la sección "Visión" con imagen editable si es admin
const Vision = ({ onImageChange, visionImageUrl, isAdmin, titulo, descripcion }) => (
    <SeccionInfo
        titulo={titulo}
        descripcion={descripcion}
        imagenComponent={
            isAdmin ? (
                <EditableImage
                    src={visionImageUrl}
                    alt="Imagen de Visión"
                    onImageUpload={onImageChange}
                />
            ) : (
                <img src={visionImageUrl} alt="Imagen de Visión" style={{ width: '100%', height: 'auto' }} />
            )
        }
        invertir
        bgColor='#10045c'
        textAlign='right'
    />
);

// Componente para la sección "Valores"
const Valores = ({ titulo, descripcion }) => (
    <section className='values'>
        <h2>{titulo}</h2>
        <h3>{descripcion}</h3>
    </section>
);

// Componente para la sección de noticias y eventos
const Noticias_Eventos = () => (
    <section className='noteve'>
        <h2>Noticias y Eventos</h2>
        <h3>Ultimas novedades de la asociación.</h3>
    </section>
);

// Componente para mostrar las 3 últimas noticias en tarjetas
function HomeNewsCards() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    // Carga las noticias al montar el componente
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/auth/noticias');
                const lista = Array.isArray(data?.noticias) ? data.noticias : [];
                const ordenadas = [...lista].sort(
                    (a, b) =>
                        new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion),
                );
                const ultimas3 = ordenadas.slice(0, 3);
                if (!cancelled) setNews(ultimas3);
            } catch (e) {
                if (!cancelled) setErr(e.message || 'Error al cargar noticias');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Formatea la fecha en español
    const formatFecha = iso =>
        iso
            ? new Date(iso).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
            : '';

    // Limita el texto de la noticia a un máximo de caracteres
    const clampText = (txt = '', max = 220) =>
        txt.length > max ? txt.slice(0, max).trim() + '…' : txt;

    // Muestra spinner mientras carga
    if (loading) {
        return (
            <Box display='flex' justifyContent='center' my={3}>
                <CircularProgress />
            </Box>
        );
    }
    // Muestra error si falla la carga
    if (err) {
        return (
            <Alert severity='error' sx={{ my: 2 }}>
                {err}
            </Alert>
        );
    }
    // Si no hay noticias
    if (news.length === 0) {
        return (
            <Typography sx={{ color: 'white', textAlign: 'center', my: 2 }}>
                No hay noticias recientes.
            </Typography>
        );
    }

    // Renderiza las tarjetas de noticias
    return (
        <div
            className='cards'
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                placeItems: 'stretch',
            }}
        >
            {news.map(n => (
                <MediaCard
                    key={n.id}
                    title={n.titulo}
                    to={`/noticia/${n.id}`}
                    content={clampText(n.contenido, 240)}
                    image={n.imagen_url || '/placeholder.jpg'}
                    date={formatFecha(n.fecha_publicacion)}
                />
            ))}
        </div>
    );
}

// Componente principal de la página de inicio
function Home() {
    // Estados para errores, imágenes y textos de cada sección
    const [error, setError] = useState('');
    const [images, setImages] = useState({
        mision: '/Images/Mision1.jpg',
        vision: '/Images/Vision1.jpg',
        header: '/Images/header.jpg', // Agrega la URL del header al estado
    });
    const [headerText, setHeaderText] = useState({
        header_l1: 'ASOCIACIÓN DE',
        header_l2: 'BÉISBOL MENOR',
        header_l3: 'PILOTOS DE HONDURAS',
    });
    const [aboutText, setAboutText] = useState({
        about_titulo: 'Sobre Nosotros',
        about_desc:
            'Somos una organización que fomenta la recreación del beisbol. Formamos Vidas a través del Beisbol en Honduras!',
    });
    const [misionText, setMisionText] = useState({
        mision_titulo: 'Nuestra Misión',
        mision_desc:
            'Fomentar el amor por el béisbol en niños y jóvenes, proporcionando un ambiente seguro, divertido y educativo donde puedan desarrollar sus habilidades atléticas, cultivar valores como el respeto, la disciplina y el trabajo en equipo, y construir amistades duraderas que trasciendan el campo de juego.',
    });
    const [visionText, setVisionText] = useState({
        vision_titulo: 'Nuestra Visión',
        vision_desc:
            'Que cada niño y joven de nuestra comunidad vea en el béisbol no solo un juego, sino un camino para crecer como deportista y persona, soñando en grande y llevando nuestros valores a cada paso de su vida.',
    });
    const [valoresText, setValoresText] = useState({
        valores_titulo: 'Nuestros Valores',
        valores_desc: 'Nuestros Valores definen lo que nosotros somos en el área de juego.',
    });

    const [isAdmin, setIsAdmin] = useState(false);

    // Verifica si el usuario es admin para mostrar controles de edición
    useEffect(() => {
        const checkRole = async () => {
            try {
                const r = await api.get('/auth/obtenerperfil', {
                    withCredentials: true,
                    skipAuthRedirect: true,
                });
                const p = Array.isArray(r.data) ? r.data[0] : r.data;
                const role = String(p?.rol || '').toLowerCase();
                setIsAdmin(role === 'admin');
            } catch {
                setIsAdmin(false);
            }
        };
        checkRole();

        const onAuthRefresh = () => checkRole();
        window.addEventListener('auth:refresh', onAuthRefresh);
        return () => window.removeEventListener('auth:refresh', onAuthRefresh);
    }, []);

    // Carga las imágenes de la página desde el backend
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await api.get('/auth/images');
                console.log('Respuesta del backend /auth/images:', response.data);

                const imagesMap = response.data.reduce((acc, current) => {
                    if (current.type && current.url) {
                        acc[current.type] = current.url;
                    }
                    return acc;
                }, {});

                console.log('Mapa de imágenes obtenidas:', imagesMap);
                setImages(prevImages => ({
                    ...prevImages,
                    ...imagesMap,
                }));
            } catch (error) {
                console.error(
                    'Error al cargar las imágenes de la página de inicio:',
                    error,
                );
                setError(
                    'No se pudieron cargar las imágenes. Inténtelo de nuevo más tarde.',
                );
            }
        };
        fetchImages();
    }, []);

    // Carga los textos del header desde el backend
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await api.get('/auth/home/textos', {
                    withCredentials: true,
                    skipAuthRedirect: true,
                });
                if (!cancelled && res?.data?.success && res.data.data) {
                    // merge para no perder defaults si faltara alguna clave
                    setHeaderText(prev => ({ ...prev, ...res.data.data }));
                }
            } catch {
                /* si falla, seguimos con defaults locales */
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Carga los textos de "Sobre Nosotros"
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await api.get('/auth/home/textos', {
                    withCredentials: true,
                    skipAuthRedirect: true,
                });
                if (!cancelled && res?.data?.success && res.data.data) {
                    const { about_titulo, about_desc } = res.data.data;
                    setAboutText(prev => ({
                        ...prev,
                        ...(about_titulo ? { about_titulo } : {}),
                        ...(about_desc ? { about_desc } : {}),
                    }));
                }
            } catch {
                /* si falla, mantenemos defaults */
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Carga los textos de "Misión"
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await api.get('/auth/home/textos', {
                    withCredentials: true,
                    skipAuthRedirect: true,
                });
                if (!cancelled && res?.data?.success && res.data.data) {
                    setMisionText(prev => ({
                        ...prev,
                        ...((({ mision_titulo, mision_desc }) => ({ mision_titulo, mision_desc }))(res.data.data)),
                    }));
                }
            } catch {
                /* si falla, seguimos con defaults locales */
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Carga los textos de "Visión"
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await api.get('/auth/home/textos', {
                    withCredentials: true,
                    skipAuthRedirect: true,
                });
                if (!cancelled && res?.data?.success && res.data.data) {
                    setVisionText(prev => ({
                        ...prev,
                        ...((({ vision_titulo, vision_desc }) => ({ vision_titulo, vision_desc }))(res.data.data)),
                    }));
                }
            } catch {
                /* si falla, seguimos con defaults locales */
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Carga los textos de "Valores"
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await api.get('/auth/home/textos', {
                    withCredentials: true,
                    skipAuthRedirect: true,
                });
                if (!cancelled && res?.data?.success && res.data.data) {
                    const { valores_titulo, valores_desc } = res.data.data;
                    setValoresText(prev => ({
                        ...prev,
                        ...(valores_titulo ? { valores_titulo } : {}),
                        ...(valores_desc ? { valores_desc } : {}),
                    }));
                }
            } catch {
                /* si falla, seguimos con defaults locales */
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Maneja el cambio de imagen (subida y actualización en backend)
    const handleImageChange = async (type, file) => {
        try {
            if (!(file instanceof File)) {
                console.error('El argumento no es un objeto File.');
                setError('Error: No se seleccionó un archivo válido.');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await api.post('/auth/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const finalUrl = uploadResponse.data.url;
            console.log(`URL persistente obtenida tras subir ${type}:`, finalUrl);

            await api.put('/auth/images', {
                type,
                url: finalUrl,
            });

            setImages(prevImages => ({
                ...prevImages,
                [type]: finalUrl,
            }));
            console.log(
                `Imagen de ${type} guardada y actualizada exitosamente en la base de datos con URL: ${finalUrl}.`,
            );
        } catch (error) {
            console.error(`Error al manejar/guardar la imagen de ${type}:`, error);
            setError(`Error al actualizar la imagen de ${type}.`);
        }
    };

    // Funciones para guardar los textos editados en el backend (optimista)
    const saveHeaderText = async (clave, valor) => {
        setHeaderText(prev => ({ ...prev, [clave]: valor }));
        try {
            await api.put('/auth/home/textos', { clave, valor }, { withCredentials: true });
        } catch {
            // si falla el backend, no rompemos la UI
        }
    };

    const saveAboutText = async (clave, valor) => {
        setAboutText(prev => ({ ...prev, [clave]: valor }));
        try {
            await api.put('/auth/home/textos', { clave, valor }, { withCredentials: true });
        } catch {
            // si falla, podrías recargar con GET o dejar el cambio visible
        }
    };

    const saveMisionText = async (clave, valor) => {
        setMisionText(prev => ({ ...prev, [clave]: valor }));
        try {
            await api.put('/auth/home/textos', { clave, valor }, { withCredentials: true });
        } catch {
            // si falla, dejamos el cambio visual; puedes recargar con GET si prefieres
        }
    };

    const saveVisionText = async (clave, valor) => {
        setVisionText(prev => ({ ...prev, [clave]: valor }));
        try {
            await api.put('/auth/home/textos', { clave, valor }, { withCredentials: true });
        } catch {
            // si falla, puedes recargar con GET o dejar el cambio visible
        }
    };

    const saveValoresText = async (clave, valor) => {
        setValoresText(prev => ({ ...prev, [clave]: valor }));
        try {
            await api.put('/auth/home/textos', { clave, valor }, { withCredentials: true });
        } catch {
            // si falla, puedes recargar con GET o dejar el cambio visible
        }
    };

    const navigate = useNavigate();
    const onClick = () => {
        navigate('/Eventos');
        window.scrollTo(0, 0);
    };

    // Render principal de la página de inicio
    return (
        <div style={{ paddingTop: '90px' }}>
            {/* Header con imagen y textos editables */}
            <div
                className='header'
                style={{ backgroundImage: `url(${images.header})` }}
            >
                {/* Usa la URL del header del estado */}
                <div className='header-title'>
                    <EditableText
                        text={headerText.header_l1}
                        onTextSave={(t) => saveHeaderText('header_l1', t)}
                        isAdmin={isAdmin}
                        variant='p'
                    />
                    <EditableText
                        text={headerText.header_l2}
                        onTextSave={(t) => saveHeaderText('header_l2', t)}
                        isAdmin={isAdmin}
                        variant='p'
                    />
                    <EditableText
                        text={headerText.header_l3}
                        onTextSave={(t) => saveHeaderText('header_l3', t)}
                        isAdmin={isAdmin}
                        variant='p'
                    />
                </div>
                {/* Permite al admin cambiar la imagen del header */}
                {isAdmin && (
                    <EditableHeaderImage
                        onImageUpload={file => handleImageChange('header', file)}
                    />
                )}
            </div>

            {/* Sección "Sobre Nosotros" con textos editables */}
            <AboutUs
                titulo={
                    <EditableText
                        text={aboutText.about_titulo}
                        onTextSave={(t) => saveAboutText('about_titulo', t)}
                        isAdmin={isAdmin}
                        variant="h2"
                    />
                }
                descripcion={
                    <EditableText
                        text={aboutText.about_desc}
                        onTextSave={(t) => saveAboutText('about_desc', t)}
                        isAdmin={isAdmin}
                        variant="p"
                        multiline
                    />
                }
            />
            {/* Sección "Misión" con imagen y textos editables */}
            <Mision
                isAdmin={isAdmin}
                misionImageUrl={images.mision}
                onImageChange={imgFile => handleImageChange('mision', imgFile)}
                titulo={
                    <EditableText
                        text={misionText.mision_titulo}
                        onTextSave={(t) => saveMisionText('mision_titulo', t)}
                        isAdmin={isAdmin}
                        variant='h2'
                    />
                }
                descripcion={
                    <EditableText
                        text={misionText.mision_desc}
                        onTextSave={(t) => saveMisionText('mision_desc', t)}
                        isAdmin={isAdmin}
                        variant="p"
                        multiline
                    />
                }
            />
            {/* Sección "Visión" con imagen y textos editables */}
            <Vision
                isAdmin={isAdmin}
                visionImageUrl={images.vision}
                onImageChange={imgFile => handleImageChange('vision', imgFile)}
                titulo={
                    <EditableText
                        text={visionText.vision_titulo}
                        onTextSave={(t) => saveVisionText('vision_titulo', t)}
                        isAdmin={isAdmin}
                        variant="h2"
                    />
                }
                descripcion={
                    <EditableText
                        text={visionText.vision_desc}
                        onTextSave={(t) => saveVisionText('vision_desc', t)}
                        isAdmin={isAdmin}
                        variant="p"
                        multiline
                    />
                }
            />

            {/* Sección "Valores" con textos editables */}
            <Valores
                titulo={
                    <EditableText
                        text={valoresText.valores_titulo}
                        onTextSave={(t) => saveValoresText('valores_titulo', t)}
                        isAdmin={isAdmin}
                        variant="h2"
                    />
                }
                descripcion={
                    <EditableText
                        text={valoresText.valores_desc}
                        onTextSave={(t) => saveValoresText('valores_desc', t)}
                        isAdmin={isAdmin}
                        variant="h3"
                        multiline
                    />
                } />
            {/* Sección de acordeón informativo */}
            <Acordeon />
            {/* Sección de noticias y eventos */}
            <Noticias_Eventos />

            {/* Tarjetas de las últimas noticias */}
            <HomeNewsCards />

            {/* Botón para ver más noticias */}
            <div style={{ textAlign: 'center', margin: '2rem 0 4rem' }}>
                <button className='news-button' onClick={onClick}>
                    Más Noticias
                </button>
            </div>
            {/* Muestra error si ocurre */}
            {error && (
                <Alert severity='error' sx={{ my: 2 }}>
                    {error}
                </Alert>
            )}
        </div>
    );
}

export default Home;
