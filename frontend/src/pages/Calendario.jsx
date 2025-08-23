import React, { useState, useEffect } from 'react';
import './stylesCalendario.css';
import { Padding } from '@mui/icons-material';
//import axios from 'axios';
import { api } from '../api/api';

// Componentes de iconos SVG simples
const ChevronLeft = () => (
	<svg
		width='20'
		height='20'
		viewBox='0 0 24 24'
		fill='none'
		stroke='#000000'
		strokeWidth='2'
	>
		<polyline points='15,18 9,12 15,6'></polyline>
	</svg>
);

const ChevronRight = () => (
	<svg
		width='20'
		height='20'
		viewBox='0 0 24 24'
		fill='none'
		stroke='#000000'
		strokeWidth='2'
	>
		<polyline points='9,18 15,12 9,6'></polyline>
	</svg>
);

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

const Calendar = () => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
	>
		<rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
		<line x1='16' y1='2' x2='16' y2='6'></line>
		<line x1='8' y1='2' x2='8' y2='6'></line>
		<line x1='3' y1='10' x2='21' y2='10'></line>
	</svg>
);

const Clock = () => (
	<svg
		width='12'
		height='12'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
	>
		<circle cx='12' cy='12' r='10'></circle>
		<polyline points='12,6 12,12 16,14'></polyline>
	</svg>
);

const FileText = () => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
	>
		<path d='M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z'></path>
		<polyline points='14,2 14,8 20,8'></polyline>
		<line x1='16' y1='13' x2='8' y2='13'></line>
		<line x1='16' y1='17' x2='8' y2='17'></line>
		<polyline points='10,9 9,9 8,9'></polyline>
	</svg>
);

const Lock = () => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
	>
		<rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect>
		<circle cx='12' cy='16' r='1'></circle>
		<path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
	</svg>
);

const Plus = () => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
	>
		<line x1='12' y1='5' x2='12' y2='19'></line>
		<line x1='5' y1='12' x2='19' y2='12'></line>
	</svg>
);

const EditIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='18'
		height='18'
		viewBox='0 0 24 24'
		fill='none'
		stroke='#3b82f6'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<path d='M12 20h9' />
		<path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' />
	</svg>
);

const Calendario = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [events, setEvents] = useState({});
	const [editingIndex, setEditingIndex] = useState(null); // null si es nuevo
	const [originalDateKey, setOriginalDateKey] = useState(null);
	const [eventData, setEventData] = useState({ titulo: '', descripcion: '' });
	const [showModal, setShowModal] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [eventToDelete, setEventToDelete] = useState(null); // { dateKey, id }
	const [selectedDate, setSelectedDate] = useState(null);
	const [eventForm, setEventForm] = useState({
		title: '',
		time: '',
		endTime: '',
		endDate: '',
		description: '',
		type: 'event',
		date: '',
		img_url: '',
	});
	const [view, setView] = useState('month'); // 'week' o 'month'
	const [showMonthEvents, setShowMonthEvents] = useState(false);

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	function createDateFromInput(dateStr, timeStr = '00:00') {
		const [year, month, day] = dateStr.split('-').map(Number);
		const [hours, minutes] = timeStr.split(':').map(Number);
		return new Date(year, month - 1, day, hours, minutes);
	}

	useEffect(() => {
		// Si cualquiera de los dos modales está abierto, bloquea el scroll de fondo
		if (!showMonthEvents && !selectedDate) return;

		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	}, [showMonthEvents, selectedDate]);

	useEffect(() => {
		const userRole = localStorage.getItem('userRole');
		setIsLoggedIn(userRole === 'admin-calendario' || userRole === 'admin');
	}, []);

	const months = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];

	const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

	const getDaysInMonth = date => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days = [];

		// Días del mes anterior
		for (let i = startingDayOfWeek - 1; i >= 0; i--) {
			const prevDate = new Date(year, month, -i);
			days.push({
				date: prevDate.getDate(),
				isCurrentMonth: false,
				fullDate: prevDate,
			});
		}

		// Días del mes actual
		for (let day = 1; day <= daysInMonth; day++) {
			const fullDate = new Date(year, month, day);
			days.push({
				date: day,
				isCurrentMonth: true,
				fullDate,
			});
		}

		// Días del siguiente mes
		const remainingDays = 42 - days.length;
		for (let day = 1; day <= remainingDays; day++) {
			const nextDate = new Date(year, month + 1, day);
			days.push({
				date: day,
				isCurrentMonth: false,
				fullDate: nextDate,
			});
		}

		return days;
	};

	const getWeekDays = date => {
		const startOfWeek = new Date(date);
		const day = startOfWeek.getDay();
		const diff = startOfWeek.getDate() - day;
		startOfWeek.setDate(diff);

		const weekDays = [];
		for (let i = 0; i < 7; i++) {
			const dayDate = new Date(startOfWeek);
			dayDate.setDate(startOfWeek.getDate() + i);
			weekDays.push({
				date: dayDate.getDate(),
				isCurrentMonth: true,
				fullDate: dayDate,
			});
		}
		return weekDays;
	};

	// Función de navegación unificada que funciona para ambas vistas
	const navigate = direction => {
		setCurrentDate(prev => {
			const newDate = new Date(prev);
			if (view === 'month') {
				newDate.setMonth(prev.getMonth() + direction);
			} else {
				newDate.setDate(prev.getDate() + direction * 7);
			}
			return newDate;
		});
	};

	const goToToday = () => {
		setCurrentDate(new Date());
	};

	const formatDateKey = date => {
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
	};

	const openModal = date => {
		setSelectedDate(date);
		setShowModal(true);

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const localDateString = `${year}-${month}-${day}`;

		setEventForm({
			title: '',
			time: '',
			description: '',
			type: 'event',
			date: localDateString,
			img_url: '',
		});
	};

	const closeModal = () => {
		setShowModal(false);
		setEditingIndex(null);
		setOriginalDateKey(null);
		setEventForm({
			title: '',
			time: '',
			description: '',
			type: 'event',
			date: '',
		});
	};

	const editEvent = index => {
		const dateKey = formatDateKey(selectedDate);
		const event = events[dateKey][index];

		// event.date es Date, endDate es ISO string
		const { date: fi, time: hi } =
			event.date instanceof Date
				? splitISO(event.date.toISOString())
				: splitISO(event.date);

		const { date: ff, time: hf } = splitISO(event.endDate);

		setEditingIndex(index);
		setOriginalDateKey(dateKey);
		setShowModal(true);

		setEventForm({
			title: event.title || '',
			time: event.time || hi || '',
			endTime: event.endTime || hf || '',
			date: fi || formatDateKey(event.date || selectedDate),
			endDate: ff || fi, // si no había fin, usa el inicio
			description: event.description || '',
			type: event.type || 'event',
			img_url: event.img_url || '',
		});
	};

	const actualizarEvento = async (id, eventoActualizado) => {
		try {
			const toISO = (d) => {
				if (!d) return null;
				return d instanceof Date ? d.toISOString() : new Date(d).toISOString();
			};

			const body = {
				nombre: eventoActualizado.title ?? '',
				fecha_inicio: toISO(eventoActualizado.date),
				fecha_final: toISO(eventoActualizado.endDate),
				descripcion: eventoActualizado.description ?? '',
				img_url: eventoActualizado?.img_url ?? null, // <- null-safe
			};

			const res = await api.put(`/auth/evento/${id}`, body);
			console.log('Evento actualizado:', res.data?.mensaje);
			window.alert(res.data?.mensaje);
		} catch (error) {
			console.error('Error al actualizar evento:', error);
			window.alert('No se pudo actualizar el evento.');
		}
	};

	const deleteEvent = (dateKey, eventId) => {
		if (!isLoggedIn) {
			alert('Solo el modificaristrador puede eliminar eventos');
			return;
		}
		setEventToDelete({ dateKey, eventId });
		setShowConfirmModal(true);
	};

	const getEventsForDate = date => {
		const dateKey = formatDateKey(date);
		return events[dateKey] || [];
	};

	// 2. AGREGAR FUNCIÓN PARA OBTENER EVENTOS DEL MES
	const getEventsForMonth = date => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const monthEvents = [];

		// Recorrer todos los días del mes actual
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		for (let day = 1; day <= daysInMonth; day++) {
			const currentDate = new Date(year, month, day);
			const dateKey = formatDateKey(currentDate);
			const dayEvents = events[dateKey] || [];

			dayEvents.forEach(event => {
				monthEvents.push({
					...event,
					date: currentDate,
					dateKey,
				});
			});
		}

		// Ordenar eventos por fecha y hora
		return monthEvents.sort((a, b) => {
			const dateCompare = a.date.getTime() - b.date.getTime();
			if (dateCompare !== 0) return dateCompare;

			if (a.time && b.time) {
				return a.time.localeCompare(b.time);
			}
			return 0;
		});
	};

	const isToday = date => {
		const today = new Date();
		return date.toDateString() === today.toDateString();
	};

	const getWeekDateRange = () => {
		const weekDays = getWeekDays(currentDate);
		const firstDay = weekDays[0].fullDate;
		const lastDay = weekDays[6].fullDate;

		if (firstDay.getMonth() === lastDay.getMonth()) {
			return `${firstDay.getDate()} - ${lastDay.getDate()} ${months[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
		} else {
			return `${firstDay.getDate()} ${months[firstDay.getMonth()]} - ${lastDay.getDate()} ${months[lastDay.getMonth()]} ${firstDay.getFullYear()}`;
		}
	};

	const datesBetween = (start, end) => {
		const result = [];

		const current = new Date(start);
		const endCopy = new Date(end);

		// Normalizar ambas fechas a medianoche para comparar solo día/mes/año
		current.setHours(0, 0, 0, 0);
		endCopy.setHours(0, 0, 0, 0);

		while (current <= endCopy) {
			result.push(formatDateKey(new Date(current)));
			current.setDate(current.getDate() + 1);
		}

		return result;
	};

	// '2025-08-07T13:30:00.000Z' -> { date: '2025-08-07', time: '13:30' }
	const splitISO = iso => {
		if (!iso) return { date: '', time: '' };
		const d = new Date(iso);
		const pad = n => n.toString().padStart(2, '0');
		const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
		const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
		return { date, time };
	};

	const toHHMM = d => {
		if (!d) return '';
		const pad = n => n.toString().padStart(2, '0');
		return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
	};

	const realizarPeticion = async (date, endDate) => {
		const body = {
			nombre: eventForm.title,
			fecha_inicio: date,
			fecha_final: endDate,
			descripcion: eventForm.description,
			img_url: eventForm.img_url || null,
		};

		try {
			const res = await api.post('/auth/registrarevento', body);
			console.log('response data: ', res.data.mensaje);
			window.alert(res.data.mensaje);
			return res.data;
		} catch (error) {
			if (error.response) {
				console.log('Error data:', error.response.data.mensaje);
				window.alert(error.response.data.mensaje);
			} else if (error.request) {
				window.alert('Ninguna respuesta del servidor. Por favor verifique su red.');
			} else {
				window.alert('Error en la red.');
			}
		}
	};

	useEffect(() => {
		const fetchEventos = async () => {
			try {
				const res = await api.get('/auth/obtenereventos');
				const eventos = res.data;

				const eventosMap = {};

				eventos.forEach(ev => {
					const fechaInicio = new Date(ev.fecha_inicio);
					const fechaFinal = ev.fecha_final ? new Date(ev.fecha_final) : null;

					// Detecta “todo el día” si se usa por ejemplo 00:00 → 23:59
					const isAllDay =
						fechaFinal &&
						fechaInicio.getHours() === 0 &&
						fechaInicio.getMinutes() === 0 &&
						fechaFinal.getHours() === 23 &&
						fechaFinal.getMinutes() === 59;

					if (ev.ishabilitado) {
						const eventoObj = {
							id: ev.id,
							title: ev.nombre,
							description: ev.descripcion,
							date: fechaInicio, // Date en estado
							endDate: fechaFinal || fechaInicio, // Date
							time: isAllDay ? '' : toHHMM(fechaInicio),
							endTime: isAllDay || !fechaFinal ? '' : toHHMM(fechaFinal),
							type: 'event',
							img_url: ev.img_url,
						};

						const fechas = datesBetween(fechaInicio, fechaFinal || fechaInicio);
						fechas.forEach(f => {
							if (!eventosMap[f]) eventosMap[f] = [];
							eventosMap[f].push(eventoObj);
						});
					}
				});

				setEvents(eventosMap);
			} catch (err) {
				console.error('Error al obtener eventos:', err);
			}
		};

		fetchEventos();
	}, []);

	// Función para abrir modal de agregar evento
	const handleAddButtonClick = () => {
		if (!isLoggedIn) {
			alert('Solo el administrador puede agregar eventos');
			return;
		}
		const today = new Date();
		let targetDate;

		if (view === 'month') {
			// Para vista mensual, usa una fecha de la tercera semana del mes actual
			const year = currentDate.getFullYear();
			const month = currentDate.getMonth();
			targetDate = new Date(year, month, 15); // Día 15 del mes

			// Si el día 15 ya pasó, usa el día 15 del siguiente mes
			if (targetDate < today) {
				targetDate = new Date(year, month + 1, 15);
			}
		} else {
			// Para vista semanal, usa el día actual o el siguiente día disponible
			targetDate = new Date(today);
			targetDate.setDate(today.getDate() + 1);
		}

		openModal(targetDate);
	};

	const days =
		view === 'month' ? getDaysInMonth(currentDate) : getWeekDays(currentDate);

	return (
		<div className='calendar-container'>
			{/* Header del calendario */}
			<div className='calendar-header'>
				{/* Lado izquierdo: Navegación y título */}
				<div className='header-left'>
					<button className='today-button' onClick={goToToday}>
						Hoy
					</button>

					<button className='nav-button' onClick={() => navigate(-1)}>
						<ChevronLeft />
					</button>

					<h2 className='month-title'>
						{view === 'month'
							? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
							: getWeekDateRange()}
					</h2>

					<button className='nav-button' onClick={() => navigate(1)}>
						<ChevronRight />
					</button>
				</div>

				{/* Lado derecho: Login/Logout y botones de vista */}
				<div className='header-right'>
					{/* Botones de vista */}
					<div className='view-buttons'>
						<button
							className={`view-button${view === 'week' ? ' active' : ''}`}
							onClick={() => setView('week')}
						>
							Semana
						</button>
						<button
							className={`view-button${view === 'month' ? ' active' : ''}`}
							onClick={() => setView('month')}
						>
							Mes
						</button>
						<button
							className='view-button'
							onClick={() => setShowMonthEvents(true)}
							style={{
								backgroundColor: '#8b5cf6',
								color: 'white',
								border: '1px solid #8b5cf6',
							}}
						>
							📅 Eventos del Mes
						</button>
					</div>

					{/* Botón de agregar solo se muestra si es admin*/}
					{isLoggedIn && (
						<button className='add-button' onClick={handleAddButtonClick}>
							<Plus />
						</button>
					)}
				</div>
			</div>

			{/* Headers de los días */}
			<div className='days-header'>
				{daysOfWeek.map(day => (
					<div key={day} className='day-header'>
						{day}
					</div>
				))}
			</div>

			{/* Grid del calendario */}
			<div className='calendar-grid'>
				{days.map((day, index) => {
					const dayEvents = getEventsForDate(day.fullDate);
					const hasEvents = dayEvents.length > 0;

					let cellClasses = 'day-cell';
					if (isToday(day.fullDate)) cellClasses += ' today';
					if (!day.isCurrentMonth) cellClasses += ' inactive';

					let numberClasses = 'day-number';
					if (isToday(day.fullDate)) numberClasses += ' today';
					if (!day.isCurrentMonth) numberClasses += ' inactive';

					return (
						<div
							key={index}
							className={cellClasses}
							onClick={() => openModal(day.fullDate)}
						>
							<div className={numberClasses}>
								<span>{day.date}</span>
								{hasEvents && <div className='event-indicator'></div>}
							</div>

							<div className='events-container'>
								{dayEvents.slice(0, 2).map(event => (
									<div
										key={event.id}
										className={`event-item ${event.type === 'event' ? 'event-type' : 'note-type'}`}
									>
										{event.time && (
											<span style={{ fontWeight: '600' }}>{event.time}</span>
										)}
										<span style={event.time ? { marginLeft: '4px' } : {}}>
											{event.title}
										</span>
									</div>
								))}
								{dayEvents.length > 2 && (
									<div className='more-events'>+{dayEvents.length - 2} más</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* Modal de Eventos */}
			{showModal && (
				<div className='modal'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h3 className='modal-title'>
								{selectedDate?.toLocaleDateString('es-ES', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</h3>
							<button className='close-button' onClick={closeModal}>
								<X />
							</button>
						</div>

						{/* Formulario */}
						{isLoggedIn && (
							<>
								<div className='event-form'>
									<div>
										<label className='form-label'>Fecha de Inicio*</label>
										<input
											type='date'
											value={eventForm.date}
											onChange={e => {
												if (isLoggedIn) {
													setEventForm({ ...eventForm, date: e.target.value });
													const [year, month, day] = e.target.value.split('-');
													const newSelectedDate = new Date(
														parseInt(year),
														parseInt(month) - 1,
														parseInt(day),
													);
													setSelectedDate(newSelectedDate);
												}
											}}
											className='form-input'
											disabled={!isLoggedIn}
										/>
									</div>

									<div>
										<label className='form-label'>Título *</label>
										<input
											type='text'
											value={eventForm.title}
											onChange={e =>
												isLoggedIn &&
												setEventForm({ ...eventForm, title: e.target.value })
											}
											className='form-input'
											placeholder='Título del evento o nota'
											disabled={!isLoggedIn}
										/>
									</div>

									{eventForm.type === 'event' && (
										<div>
											<label className='form-label'>Hora de Inicio</label>
											<input
												type='time'
												value={eventForm.time}
												onChange={e =>
													isLoggedIn &&
													setEventForm({ ...eventForm, time: e.target.value })
												}
												className='form-input'
												disabled={!isLoggedIn}
											/>
										</div>
									)}

									<div>
										<label className='form-label'>Fecha de finalización</label>
										<input
											type='date'
											value={eventForm.endDate}
											onChange={e =>
												isLoggedIn &&
												setEventForm({ ...eventForm, endDate: e.target.value })
											}
											className='form-input'
											disabled={!isLoggedIn}
										/>
									</div>

									<div>
										<label className='form-label'>Hora de finalización</label>
										<input
											type='time'
											value={eventForm.endTime}
											onChange={e =>
												isLoggedIn &&
												setEventForm({ ...eventForm, endTime: e.target.value })
											}
											className='form-input'
											disabled={!isLoggedIn}
										/>
									</div>

									<div>
										<label className='form-label'>Descripción</label>
										<textarea
											value={eventForm.description}
											onChange={e =>
												isLoggedIn &&
												setEventForm({
													...eventForm,
													description: e.target.value,
												})
											}
											className='form-textarea'
											placeholder='Descripción opcional'
											disabled={!isLoggedIn}
										/>
									</div>

									<div>

										{/*Placeholder para subir imagen */}
										<label className='form-label'>URL de imangen</label>
										<textarea
											value={eventForm.img_url}
											onChange={e =>
												isLoggedIn &&
												setEventForm({
													...eventForm,
													img_url: e.target.value,
												})
											}
											className='form-textarea'
											placeholder='URL de la imagen'
											disabled={!isLoggedIn}
										/>
									</div>
								</div>
							</>
						)}

						{isLoggedIn && (
							<>
								{/* Botones */}
								<div className='button-group'>
									<button
										className='cancel-button'
										onClick={() => {
											closeModal();
											setEditingIndex(null);
										}}
									>
										Cancelar
									</button>
									<button
										className='submit-button'
										onClick={async () => {
											if (!isLoggedIn || !eventForm.title.trim()) return;

											if (
												eventForm.date === eventForm.endDate &&
												eventForm.time &&
												eventForm.endTime &&
												eventForm.endTime < eventForm.time
											) {
												alert(
													'La hora de finalización no puede ser anterior a la hora de inicio',
												);
												return;
											}

											if (editingIndex !== null) {
												// EDITAR
												const now = new Date();
												const timeToUse =
													eventForm.time || now.toTimeString().slice(0, 5);
												const endTimeToUse = eventForm.endTime || '';
												const endDateToUse =
													eventForm.endDate || eventForm.date;

												const eventDate = createDateFromInput(
													eventForm.date,
													timeToUse,
												);
												const endEventDate = createDateFromInput(
													endDateToUse,
													endTimeToUse,
												);

												// Crear evento actualizado
												const updatedEvent = {
													...eventForm,
													id: events[originalDateKey][editingIndex].id,
													time: timeToUse,
													endTime: endTimeToUse,
													endDate: endEventDate,
													date: eventDate,
													img_url: eventForm.img_url || '',
												};

												// Guardar en backend
												console.log('updatedEvent ->', updatedEvent);
												await actualizarEvento(updatedEvent.id, updatedEvent);

												// Rango original y nuevo
												const oldEvent = events[originalDateKey][editingIndex];
												const oldStart = oldEvent.date;
												const oldEnd = oldEvent.endDate
													? new Date(oldEvent.endDate)
													: oldEvent.date;
												const oldKeys = datesBetween(oldStart, oldEnd);
												const newKeys = datesBetween(eventDate, endEventDate);

												// Actualizar eventos
												setEvents(prev => {
													const updated = { ...prev };

													// Eliminar de fechas antiguas
													oldKeys.forEach(key => {
														updated[key] = (updated[key] || []).filter(
															e => e.id !== oldEvent.id,
														);
													});

													// Insertar en nuevas fechas
													newKeys.forEach(key => {
														const filtered = (updated[key] || []).filter(
															e => e.id !== updatedEvent.id,
														);
														updated[key] = [...filtered, updatedEvent];
													});

													return updated;
												});

												setEditingIndex(null);
												setOriginalDateKey(null);
												setSelectedDate(new Date(eventForm.date)); // mantener vista actualizada
											} else {
												// AGREGAR
												const now = new Date();
												const timeToUse =
													eventForm.time || now.toTimeString().slice(0, 5);
												const endTimeToUse = eventForm.endTime || '';
												const endDateToUse =
													eventForm.endDate || eventForm.date;

												const eventDate = createDateFromInput(
													eventForm.date,
													timeToUse,
												);
												const endEventDate = createDateFromInput(
													endDateToUse,
													endTimeToUse,
												);

												const newEvent = {
													id: Date.now(),
													...eventForm,
													time: timeToUse,
													endTime: endTimeToUse,
													endDate: endEventDate,
													date: eventDate,
												};

												const data = await realizarPeticion(
													newEvent.date.toISOString(),
													newEvent.endDate.toISOString(),
												);
												console.log(data);

												const allDates = datesBetween(eventDate, endEventDate);

												setEvents(prev => {
													const updated = { ...prev };
													allDates.forEach(key => {
														updated[key] = [...(updated[key] || []), newEvent];
													});
													return updated;
												});
											}

											closeModal();
										}}
									>
										{editingIndex !== null ? 'Guardar cambios' : 'Agregar'}
									</button>
								</div>
							</>
						)}

						{/* Lista de eventos existentes */}
						{selectedDate && getEventsForDate(selectedDate).length > 0 && (
							<div className='events-list'>
								<h4 className='events-list-title'>Eventos del día:</h4>
								<div>
									{getEventsForDate(selectedDate).map((event, index) => (
										<div
											key={event.id}
											className={`event-card ${event.type === 'event' ? 'event-type' : 'note-type'}`}
										>
											<div className='event-card-header'>
												<div className='event-card-content'>
													<div className='event-card-title'>
														{event.type === 'event' ? (
															<Calendar />
														) : (
															<FileText />
														)}
														<span>{event.title}</span>
													</div>
													{event.time && event.endTime ? (
														<div className='event-time'>
															<Clock />
															<span>
																{event.time} - {event.endTime}
															</span>
														</div>
													) : event.time ? (
														<div className='event-time'>
															<Clock />
															<span>{event.time}</span>
														</div>
													) : (
														<div className='event-time'>
															<Clock />
															<span>Todo el día</span>
														</div>
													)}

													{event.description && (
														<p className='event-description'>
															{event.description}
														</p>
													)}
												</div>
												{isLoggedIn && (
													<div style={{ display: 'flex', gap: '6px' }}>
														<button
															onClick={() => editEvent(index)}
															className='edit-button'
															title='Editar'
														>
															<EditIcon />
														</button>

														<button
															onClick={() =>
																deleteEvent(
																	formatDateKey(selectedDate),
																	event.id,
																)
															}
															className='delete-button'
															disabled={!isLoggedIn}
														>
															<X />
														</button>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Modal de Eventos del Mes */}
			{showMonthEvents && (
				<div className='mx-overlay'>
					<div className='mx-box'>
						{/* Header */}
						<div className='mx-header'>
							<h3 className='mx-title'>
								Eventos De {months[currentDate.getMonth()]}{' '}
								{currentDate.getFullYear()}
							</h3>
							<button
								className='mx-close'
								onClick={() => setShowMonthEvents(false)}
							>
								<X />
							</button>
						</div>

						{/* LISTA SCROLLEABLE */}
						<div className='mx-body-list'>
							{(() => {
								const monthEvents = getEventsForMonth(currentDate);

								if (monthEvents.length === 0) {
									return (
										<div className='mx-empty'>
											No hay eventos programados para este mes
										</div>
									);
								}

								// Agrupar por fecha
								const eventsByDate = {};
								monthEvents.forEach(event => {
									const dateStr = event.date.toLocaleDateString('es-ES', {
										weekday: 'long',
										day: 'numeric',
										month: 'long',
									});
									if (!eventsByDate[dateStr]) eventsByDate[dateStr] = [];
									eventsByDate[dateStr].push(event);
								});

								return Object.entries(eventsByDate).map(
									([dateStr, dateEvents]) => (
										<section key={dateStr} className='mx-day'>
											<h4 className='mx-day-header'>{dateStr}</h4>

											<ul className='mx-list'>
												{dateEvents
													.sort((a, b) =>
														(a.time || '99:99').localeCompare(
															b.time || '99:99',
														),
													)
													.map(event => (
														<li key={event.id} className='mx-card'>
															<div className='mx-card-color' aria-hidden />
															<div className='mx-card-main'>
																<div className='mx-card-top'>
																	<div className='mx-title-row'>
																		<Calendar /> <span>{event.title}</span>
																	</div>
																	{isLoggedIn && (
																		<button
																			className='mx-delete'
																			title='Eliminar'
																			onClick={() =>
																				deleteEvent(event.dateKey, event.id)
																			}
																		>
																			<X />
																		</button>
																	)}
																</div>

																<div className='mx-meta'>
																	{!event.time && !event.endTime ? (
																		<span className='mx-pill'>Todo el día</span>
																	) : event.time && event.endTime ? (
																		<span className='mx-pill'>
																			{event.time} – {event.endTime}
																		</span>
																	) : event.time ? (
																		<span className='mx-pill'>
																			{event.time}
																		</span>
																	) : null}
																</div>

																{event.description && (
																	<p className='mx-desc'>{event.description}</p>
																)}
															</div>
														</li>
													))}
											</ul>
										</section>
									),
								);
							})()}
						</div>

						{/* Estadísticas del mes */}
						<div
							style={{
								borderTop: '1px solid #e5e7eb',
								paddingTop: '16px',
								marginTop: '16px',
								display: 'flex',
								justifyContent: 'space-around',
								backgroundColor: '#f9fafb',
								padding: '16px',
								borderRadius: '8px',
							}}
						>
							{(() => {
								const monthEvents = getEventsForMonth(currentDate);
								const eventCount = monthEvents.filter(
									e => e.type === 'event',
								).length;
								return (
									<>
										<div style={{ textAlign: 'center' }}>
											<div
												style={{
													fontSize: '24px',
													fontWeight: 'bold',
													color: '#1e40af',
												}}
											>
												{eventCount}
											</div>
											<div style={{ fontSize: '14px', color: '#1e40af' }}>
												Eventos de Este Mes
											</div>
										</div>
									</>
								);
							})()}
						</div>
					</div>
				</div>
			)}
			{showConfirmModal && (
				<div className='modal modal-confirm'>
					<div className='modal-content'>
						<h3>¿Estás seguro?</h3>
						<p>Esta acción eliminará el evento de forma permanente.</p>
						<div className='modal-confirm-buttons'>
							<button
								className='cancel-button'
								onClick={() => setShowConfirmModal(false)}
							>
								Cancelar
							</button>
							<button
								className='submit-button'
								onClick={async () => {
									if (eventToDelete) {
										const { eventId } = eventToDelete;
										try {
											await api.delete(`/auth/evento/${eventId}`);

											// Eliminar del estado local
											setEvents(prev => {
												const updated = {};
												for (const [key, dayEvents] of Object.entries(prev)) {
													updated[key] = dayEvents.filter(
														event => event.id !== eventId,
													);
												}
												return updated;
											});
										} catch (error) {
											console.error('Error al eliminar evento:', error);
										}
									}
									setShowConfirmModal(false);
									setEventToDelete(null);
								}}
							>
								Eliminar
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Calendario;
