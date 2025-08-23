// src/services/eventService.js

//import axios from 'axios';
import { api } from '../api/api';

export async function obtenerEventosProximos() {
	const hoy = new Date();
	hoy.setHours(0, 0, 0, 0);

	try {
		const res = await api.get('/auth/obtenereventos');
		const eventos = res.data;

		const proximos = eventos
			.map(ev => {
				const fecha = new Date(ev.fecha_inicio);
				return {
					id: ev.id,
					titulo: ev.nombre,
					fecha: fecha,
					lugar: ev.descripcion,
					img_url: ev.img_url
				};
			})
			.filter(ev => ev.fecha >= hoy)
			.sort((a, b) => a.fecha - b.fecha)

		return proximos;
	} catch (err) {
		console.error('Error al obtener eventos:', err);
		return [];
	}
}
