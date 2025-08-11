// src/services/eventService.js

import axios from 'axios';

export async function obtenerEventosProximos(cantidad = 3) {
	const hoy = new Date();
	hoy.setHours(0, 0, 0, 0);

	try {
		const res = await axios.get('http://localhost:3000/auth/obtenereventos');
		const eventos = res.data;

		const proximos = eventos
			.map(ev => {
				const fecha = new Date(ev.fecha_inicio);
				return {
					id: ev.id,
					titulo: ev.nombre,
					fecha: fecha,
					lugar: ev.descripcion,
				};
			})
			.filter(ev => ev.fecha >= hoy)
			.sort((a, b) => a.fecha - b.fecha)
			.slice(0, cantidad);

		return proximos;
	} catch (err) {
		console.error('Error al obtener eventos:', err);
		return [];
	}
}
