import { useState, useEffect } from 'react';
import './EditarPerfil.css';
import { Link, useSearchParams } from 'react-router-dom';
//import axios from 'axios';
import { api } from '../api/api';
import SeleccionarAvatar from './SeleccionarAvatar';

// Componente principal para editar el perfil del usuario
function EditarPerfil() {
	// Estado para mostrar el modal de selección de avatar
	const [pickerOpen, setPickerOpen] = useState(false);
	// Estado para el nombre del usuario
	const [nombre, setNombre] = useState('');
	// Estado para la descripción del usuario
	const [descripcion, setDescripcion] = useState('');
	// Estado para la imagen del avatar
	const [avatar, setAvatar] = useState('/Images/AvatarBboy.jpeg');
	// Estado para el popup de feedback (éxito/error)
	const [popup, setPopup] = useState({
		visible: false,
		titulo: '',
		mensaje: '',
		tipo: '',
	});
	// Hook para leer parámetros de la URL (ej: avatar desde otra página)
	const [searchParams] = useSearchParams();

	// Normaliza la URL del avatar para asegurar el formato correcto
	const normalizeAvatar = url => {
		if (!url) return '';
		// quita "public/" si llega así y fuerza la carpeta correcta
		return url
			.replace(/^\.?\.?\/?public\//i, '/')
			.replace(/^\/images\//, '/Images/')
			.replace(/^images\//, '/Images/')
			.replace(/^\/?\/?Images\//, '/Images/'); // asegura formato final
	};

	// Obtiene los datos del perfil del usuario desde el backend
	const fetchPerfil = async () => {
		try {
			const res = await api.get('/auth/obtenerperfil', {
				skipAuthRedirect: true, 
			});
			const perfil = Array.isArray(res.data) ? res.data[0] : res.data;
			setNombre(perfil?.nombre ?? '');
			setDescripcion(perfil?.descripcion ?? '');
			if (perfil?.avatar) setAvatar(normalizeAvatar(perfil.avatar));
		} catch (err) {
			if (err.status === 401) {
				// Sin sesión: simplemente no rellenes el formulario
				return;
			}
			console.error('Error al obtener el perfil:', err);
		}
	};

	// useEffect para cargar el perfil y detectar si se pasa un avatar por parámetro en la URL
	useEffect(() => {
		const nuevoAvatar = searchParams.get('avatar');
		if (nuevoAvatar) {
			setAvatar(decodeURIComponent(nuevoAvatar));
		}

		fetchPerfil();
	}, [searchParams]);

	// Muestra el popup de feedback con título, mensaje y tipo (success/error)
	const mostrarPopup = (titulo, mensaje, tipo) => {
		setPopup({ visible: true, titulo, mensaje, tipo });
	};

	// Cierra el popup de feedback
	const cerrarPopup = () => {
		setPopup({ visible: false, titulo: '', mensaje: '', tipo: '' });
	};

	// Maneja el cambio de avatar desde input file (no usado en UI actual)
	const handleAvatarChange = e => {
		const file = e.target.files[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setAvatar(url);
		}
	};

	// Guarda los cambios del perfil en el backend
	const handleGuardar = async () => {
		if (!nombre.trim()) {
			mostrarPopup(
				'Cambio fallido',
				'El nombre no puede estar vacío.',
				'error',
			);
			return;
		}

		try {
			const response = await api.put('/auth/editarperfil', {
				nombre,
				descripcion,
				avatar: normalizeAvatar(avatar),
			});
			const data = response.data || {};
			mostrarPopup(
				'Cambio exitoso',
				data.mensaje || 'Perfil actualizado correctamente.',
				'success',
			);

			// Notifica a la Navbar y actualiza el avatar en localStorage
			if (data.avatar) {
				localStorage.setItem('userAvatar', data.avatar);
				window.dispatchEvent(
					new CustomEvent('profile:updated', {
						detail: { avatar: data.avatar },
					}),
				);
			}
		} catch (err) {
			// Soporta tanto error de interceptor (err.message) como error.response
			const data = err?.response?.data;
			if (data?.errors && Array.isArray(data.errors)) {
				const mensajes = data.errors.map(e => e.msg).join('\n');
				mostrarPopup('Cambio fallido', mensajes, 'error');
			} else {
				mostrarPopup(
					'Cambio fallido',
					data?.mensaje || err?.message || 'Error desconocido.',
					'error',
				);
			}
			console.error(err);
		}
	};

	// Cancela los cambios y limpia los campos
	const handleCancelar = () => {
		setNombre('');
		setDescripcion('');
	};

	// Renderizado principal del componente
	return (
		<div className='perfil-container'>
			<div className='perfil-content'>
				{/* Sección del avatar */}
				<div className='avatar-section'>
					<img src={avatar} alt='Avatar' className='avatar-img' />

					{/* Botón para abrir el modal de selección de avatares */}
					<button
						type='button'
						className='avatar-button'
						onClick={() => setPickerOpen(true)}
					>
						Cambiar Avatar
					</button>
				</div>

				{/* Sección de información del usuario */}
				<div className='info-section'>
					<label>Nombre</label>
					<input
						type='text'
						value={nombre}
						onChange={e => setNombre(e.target.value)}
						className='input-field'
					/>

					<label>Descripción</label>
					<textarea
						value={descripcion}
						onChange={e => setDescripcion(e.target.value)}
						className='textarea-field'
						rows={4}
					/>

					<div className='botones'>
						<button className='guardar-btn' onClick={handleGuardar}>
							Guardar
						</button>
						<button className='cancelar-btn' onClick={handleCancelar}>
							Cancelar
						</button>
					</div>
				</div>
			</div>

			{/* Modal para seleccionar avatar */}
			<SeleccionarAvatar
				open={pickerOpen}
				current={avatar}
				onSelect={url => {
					setAvatar(url);
					setPickerOpen(false); // cierra el modal al seleccionar
				}}
				onClose={() => setPickerOpen(false)}
			/>

			{/* Popup de feedback (éxito/error) */}
			{popup.visible && (
				<div className='popup'>
					<div
						className={`popup-content ${popup.tipo === 'success' ? 'popup-success' : 'popup-error'}`}
					>
						<h2>{popup.titulo}</h2>
						<p>{popup.mensaje}</p>
						<button onClick={cerrarPopup}>OK</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default EditarPerfil;
