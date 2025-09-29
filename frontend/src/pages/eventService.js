// src/services/eventService.js

//import axios from 'axios';
import { api } from '../api/api';

// Función asíncrona para obtener los próximos eventos desde el backend
export async function obtenerEventosProximos() {
    // Obtiene la fecha actual y la normaliza a medianoche
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    try {
        // Realiza la petición GET al endpoint de eventos
        const res = await api.get('/auth/obtenereventos');
        const eventos = res.data;

        // Mapea los eventos recibidos a un formato estándar
        const proximos = eventos
            .map(ev => {
                const fecha = new Date(ev.fecha_inicio); // Convierte la fecha de inicio a objeto Date
                return {
                    id: ev.id,                  // ID único del evento
                    titulo: ev.nombre,          // Nombre/título del evento
                    fecha: fecha,               // Fecha de inicio como objeto Date
                    lugar: ev.descripcion,      // Descripción/lugar del evento
                    img_url: ev.img_url         // URL de la imagen del evento
                };
            })
            // Filtra solo los eventos cuya fecha es igual o posterior a hoy
            .filter(ev => ev.fecha >= hoy)
            // Ordena los eventos por fecha ascendente
            .sort((a, b) => a.fecha - b.fecha);

        return proximos; // Devuelve el array de eventos próximos
    } catch (err) {
        // Si ocurre un error, lo muestra en consola y retorna un array vacío
        console.error('Error al obtener eventos:', err);
        return [];
    }
}
