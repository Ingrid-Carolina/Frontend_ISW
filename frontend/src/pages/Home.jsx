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

const AboutUs = () => (
	<section className='about-us'>
		<h2>Sobre Nosotros</h2>
		<h3>
			Somos una organización que fomenta la recreación del beisbol. Formamos
			Vidas a través del Beisbol en Honduras!
		</h3>
	</section>
);

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

const Vision = ({ onImageChange, visionImageUrl, isAdmin }) => (
	<SeccionInfo
		titulo='Nuestra Visión'
		descripcion='Que cada niño y joven de nuestra comunidad vea en el béisbol no solo un juego, sino un camino para crecer como deportista y persona, soñando en grande y llevando nuestros valores a cada paso de su vida.'
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

	const formatFecha = iso =>
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
			<Box display='flex' justifyContent='center' my={3}>
				<CircularProgress />
			</Box>
		);
	}
	if (err) {
		return (
			<Alert severity='error' sx={{ my: 2 }}>
				{err}
			</Alert>
		);
	}
	if (news.length === 0) {
		return (
			<Typography sx={{ color: 'white', textAlign: 'center', my: 2 }}>
				No hay noticias recientes.
			</Typography>
		);
	}

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

function Home() {
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
	const [misionText, setMisionText] = useState({
		mision_titulo: 'Nuestra Misión',
		mision_desc:
			'Fomentar el amor por el béisbol en niños y jóvenes, proporcionando un ambiente seguro, divertido y educativo donde puedan desarrollar sus habilidades atléticas, cultivar valores como el respeto, la disciplina y el trabajo en equipo, y construir amistades duraderas que trasciendan el campo de juego.',
	});

	const [isAdmin, setIsAdmin] = useState(false);

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

	const saveHeaderText = async (clave, valor) => {
		// Optimistic update
		setHeaderText(prev => ({ ...prev, [clave]: valor }));
		try {
			await api.put('/auth/home/textos', { clave, valor }, { withCredentials: true });
		} catch {
			// si falla el backend, no rompemos la UI
		}
	};

	const saveMisionText = async (clave, valor) => {
		// Optimistic update
		setMisionText(prev => ({ ...prev, [clave]: valor }));
		try {
			await api.put('/auth/home/textos', { clave, valor }, { withCredentials: true });
		} catch {
			// si falla, dejamos el cambio visual; puedes recargar con GET si prefieres
		}
	};

	const navigate = useNavigate();
	const onClick = () => {
		navigate('/Eventos');
		window.scrollTo(0, 0);
	};

	return (
		<div style={{ paddingTop: '90px' }}>
			<div
				className='header'
				style={{ backgroundImage: `url(${images.header})` }}
			>
				{' '}
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
				{isAdmin && (
					<EditableHeaderImage
						onImageUpload={file => handleImageChange('header', file)}
					/>
				)}
				{/* Usa el nuevo componente aquí */}
			</div>

			<AboutUs />
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
			<Vision
				isAdmin={isAdmin}
				visionImageUrl={images.vision}
				onImageChange={imgFile => handleImageChange('vision', imgFile)}
			/>

			<Valores />
			<Acordeon />
			<Noticias_Eventos />

			<HomeNewsCards />

			<div style={{ textAlign: 'center', margin: '2rem 0 4rem' }}>
				<button className='news-button' onClick={onClick}>
					Más Noticias
				</button>
			</div>
			{error && (
				<Alert severity='error' sx={{ my: 2 }}>
					{error}
				</Alert>
			)}
		</div>
	);
}

export default Home;
