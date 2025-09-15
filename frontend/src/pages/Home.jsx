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
import EditableHeaderImage from '../components/EditableHeaderImage';

const AboutUs = () => (
  <section className='about-us'>
    <h2>Sobre Nosotros</h2>
    <h3>
      Somos una organización que fomenta la recreación del beisbol.
      Formamos Vidas a través del Beisbol en Honduras!
    </h3>
  </section>
);

const Mision = ({ onImageChange, misionImageUrl }) => (
  <SeccionInfo
    titulo='Nuestra Misión'
    descripcion='Fomentar el amor por el béisbol en niños y jóvenes, proporcionando un ambiente seguro, divertido y educativo donde puedan desarrollar sus habilidades atléticas, cultivar valores como el respeto, la disciplina y el trabajo en equipo, y construir amistades duraderas que trasciendan el campo de juego.'
    imagenComponent={<EditableImage
      src={misionImageUrl}
      alt="Imagen de Misión"
      onImageUpload={onImageChange} // Este prop ahora recibirá la URL persistente
    />}
    bgColor='#e06c14'
    textAlign='left'
  />
);

const Vision = ({ onImageChange, visionImageUrl }) => (
  <SeccionInfo
    titulo='Nuestra Visión'
    descripcion='Que cada niño y joven de nuestra comunidad vea en el béisbol no solo un juego, sino un camino para crecer como deportista y persona, soñando en grande y llevando nuestros valores a cada paso de su vida.'
    imagenComponent={<EditableImage
      src={visionImageUrl}
      alt="Imagen de Visión"
      onImageUpload={onImageChange} // Este prop ahora recibirá la URL persistente
    />}
    invertir
    bgColor='#10045c'
    textAlign='right'
  />
);

const Valores = () => (
  <section className='values'>
    <h2>Nuestros Valores</h2>
    <h3>Nuestros Valores definen lo que nosotros somos en el área de juego.</h3>
  </section>
);

const Noticias_Eventos = () => (
  <section className='noteve'>
    <h2>Noticias y Eventos</h2>
    <h3>Ultimas novedades de la asociación.</h3>
  </section>
);

function HomeNewsCards() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/auth/noticias');
        const lista = Array.isArray(data?.noticias) ? data.noticias : [];
        const ordenadas = [...lista].sort(
          (a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion)
        );
        const ultimas3 = ordenadas.slice(0, 3);
        if (!cancelled) setNews(ultimas3);
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Error al cargar noticias');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const formatFecha = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      : '';

  const clampText = (txt = '', max = 220) =>
    txt.length > max ? txt.slice(0, max).trim() + '…' : txt;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress />
      </Box>
    );
  }
  if (err) {
    return <Alert severity="error" sx={{ my: 2 }}>{err}</Alert>;
  }
  if (news.length === 0) {
    return <Typography sx={{ color: 'white', textAlign: 'center', my: 2 }}>No hay noticias recientes.</Typography>;
  }

  return (
    <div className='cards' style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      placeItems: 'stretch'
    }}>
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

function Home() {
  const [error, setError] = useState("");
  const [images, setImages] = useState({
    mision: '/Images/Mision1.jpg',
    vision: '/Images/Vision1.jpg',
    header: '/Images/header.jpg', // Agrega la URL del header al estado
  });

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
        console.error('Error al cargar las imágenes de la página de inicio:', error);
        setError('No se pudieron cargar las imágenes. Inténtelo de nuevo más tarde.');
      }
    };
    fetchImages();
  }, []);

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
      console.log(`Imagen de ${type} guardada y actualizada exitosamente en la base de datos con URL: ${finalUrl}.`);

    } catch (error) {
      console.error(`Error al manejar/guardar la imagen de ${type}:`, error);
      setError(`Error al actualizar la imagen de ${type}.`);
    }
  };

  const navigate = useNavigate();
  const onClick = () => {
    navigate("/Eventos");
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ paddingTop: '90px' }}>
      <div className='header' style={{ backgroundImage: `url(${images.header})` }}> {/* Usa la URL del header del estado */}
        <div className='header-title'>
          <p>ASOCIACIóN DE</p>
          <p>DEPORTE MENOR</p>
          <p>PILOTOS DE HONDURAS</p>
        </div>
        <EditableHeaderImage onImageUpload={(file) => handleImageChange('header', file)} /> {/* Usa el nuevo componente aquí */}
      </div>

      <AboutUs />
      <Mision misionImageUrl={images.mision} onImageChange={(imgFile) => handleImageChange('mision', imgFile)} />
      <Vision visionImageUrl={images.vision} onImageChange={(imgFile) => handleImageChange('vision', imgFile)} />

      <Valores />
      <Acordeon />
      <Noticias_Eventos />

      <HomeNewsCards />

      <div style={{ textAlign: 'center', margin: '2rem 0 4rem' }}>
        <button className='news-button' onClick={onClick}>Más Noticias</button>
      </div>
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
    </div>
  );
}

export default Home;