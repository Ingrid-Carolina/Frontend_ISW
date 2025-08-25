import { useState, useEffect } from 'react';
import './EditarPerfil.css';
import { Link, useSearchParams } from 'react-router-dom';
//import axios from 'axios';
import { api } from '../api/api';
import SeleccionarAvatar from './SeleccionarAvatar';

function EditarPerfil() {
	const [pickerOpen, setPickerOpen] = useState(false);
	const [nombre, setNombre] = useState('');
	const [descripcion, setDescripcion] = useState('');
	const [avatar, setAvatar] = useState('/Images/AvatarBboy.jpeg');
	const [popup, setPopup] = useState({
		visible: false,
		titulo: '',
		mensaje: '',
		tipo: '',
	});
	const [searchParams] = useSearchParams();

	const normalizeAvatar = url => {
		if (!url) return '';
		// quita "public/" si llega así y fuerza la carpeta correcta
		return url
			.replace(/^\.?\.?\/?public\//i, '/')
			.replace(/^\/images\//, '/Images/')
			.replace(/^images\//, '/Images/')
			.replace(/^\/?\/?Images\//, '/Images/'); // asegura formato final
	};

	const fetchPerfil = async () => {
		try {
			const res = await api.get('/auth/obtenerperfil');
			const perfil = Array.isArray(res.data) ? res.data[0] : res.data;
			setNombre(perfil?.nombre ?? '');
			setDescripcion(perfil?.descripcion ?? '');
			if (perfil?.avatar) setAvatar(normalizeAvatar(perfil.avatar));
		} catch (err) {
			console.error('Error al obtener el perfil:', err);
		}
	};

	// Detectar si se pasa un avatar por parámetro en la URL (desde otra página)
	useEffect(() => {
		const nuevoAvatar = searchParams.get('avatar');
		if (nuevoAvatar) {
			setAvatar(decodeURIComponent(nuevoAvatar));
		}

		fetchPerfil();
	}, [searchParams]);

	const mostrarPopup = (titulo, mensaje, tipo) => {
		setPopup({ visible: true, titulo, mensaje, tipo });
	};

	const cerrarPopup = () => {
		setPopup({ visible: false, titulo: '', mensaje: '', tipo: '' });
	};

	const handleAvatarChange = e => {
		const file = e.target.files[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setAvatar(url);
		}
	};

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

			// Notificar a la Navbar y cache-busting
			if (data.avatar) {
				localStorage.setItem('userAvatar', data.avatar);
				window.dispatchEvent(
					new CustomEvent('profile:updated', {
						detail: { avatar: data.avatar },
					}),
				);
			}
		} catch (err) {
			// soporta tanto error de interceptor (err.message) como error.response
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

	const handleCancelar = () => {
		setNombre('');
		setDescripcion('');
		setAvatar('/Images/AvatarBboy.jpeg');
	};

	return (
		<div className='perfil-container'>
			<h1>Editar Perfil</h1>
			<div className='perfil-content'>
				<div className='avatar-section'>
					<img src={avatar} alt='Avatar' className='avatar-img' />

					{/*Boton para ir a la página de selección de avatares */}
					<button
						type='button'
						className='avatar-button'
						onClick={() => setPickerOpen(true)}
					>
						Cambiar Avatar
					</button>

					{/*opción para subir archivo */}
					<label className='avatar-button'>
						Subir Avatar
						<input
							type='file'
							accept='image/*'
							onChange={handleAvatarChange}
							hidden
						/>
					</label>
				</div>

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

			<SeleccionarAvatar
				open={pickerOpen}
				current={avatar}
				onSelect={url => {
					setAvatar(url);
					setPickerOpen(false); // cierra el modal al seleccionar
				}}
				onClose={() => setPickerOpen(false)}
			/>

			{/* POPUP */}
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
