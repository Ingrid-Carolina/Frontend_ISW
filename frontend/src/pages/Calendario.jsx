import React, { useState } from 'react';
import './stylesCalendario.css';
import { Padding } from '@mui/icons-material';



// Componentes de iconos SVG simples
const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

const X = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Calendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Clock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

const FileText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10,9 9,9 8,9"></polyline>
  </svg>
);

const Lock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const User = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogOut = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16,17 21,12 16,7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const Plus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    time: '',
    description: '',
    type: 'event'
  });
  const [view, setView] = useState('month'); // 'week' o 'month'
  const [showMonthEvents, setShowMonthEvents] = useState(false);

  // Estados de autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');

  // Credenciales del admin (en una app real, esto estaría en el backend)
  const ADMIN_CREDENTIALS = {
    username: 'Admin',
    password: 'Admin123'
  };

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date) => {
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
        fullDate: prevDate
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate
      });
    }

    // Días del siguiente mes
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: nextDate
      });
    }

    return days;
  };

  const getWeekDays = (date) => {
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
        fullDate: dayDate
      });
    }
    return weekDays;
  };

  // Función de navegación unificada que funciona para ambas vistas
  const navigate = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        newDate.setMonth(prev.getMonth() + direction);
      } else {
        newDate.setDate(prev.getDate() + (direction * 7));
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const openModal = (date) => {
    setSelectedDate(date);
    setShowModal(true);
    setEventForm({
      title: '',
      time: '',
      description: '',
      type: 'event'
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setEventForm({
      title: '',
      time: '',
      description: '',
      type: 'event'
    });
  };

  const addEvent = () => {
    if (!isLoggedIn) {
      alert('Solo el administrador puede agregar eventos');
      return;
    }

    if (!eventForm.title.trim()) return;

    const dateKey = formatDateKey(selectedDate);
    const newEvent = {
      id: Date.now(),
      ...eventForm,
      date: selectedDate
    };

    setEvents(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newEvent]
    }));

    closeModal();
  };

  const deleteEvent = (dateKey, eventId) => {
    if (!isLoggedIn) {
      alert('Solo el administrador puede eliminar eventos');
      return;
    }

    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(event => event.id !== eventId)
    }));
  };

  const getEventsForDate = (date) => {
    const dateKey = formatDateKey(date);
    return events[dateKey] || [];
  };

// 2. AGREGAR FUNCIÓN PARA OBTENER EVENTOS DEL MES 
  const getEventsForMonth = (date) => {
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
        dateKey
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




  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Funciones de autenticación
  const handleLogin = () => {
    if (loginForm.username === ADMIN_CREDENTIALS.username && 
        loginForm.password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setLoginForm({ username: '', password: '' });
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowModal(false);
    setShowLoginModal(false);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setLoginError('');
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setLoginForm({ username: '', password: '' });
    setLoginError('');
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

  const days = view === 'month' ? getDaysInMonth(currentDate) : getWeekDays(currentDate);

  return (
    <div className="calendar-container">
      {/* Header del calendario */}
      <div className="calendar-header">
        {/* Lado izquierdo: Navegación y título */}
        <div className="header-left">
          <button className="today-button" onClick={goToToday}>
            Hoy
          </button>
          
          <button className="nav-button" onClick={() => navigate(-1)}>
            <ChevronLeft />
          </button>
          
          <h2 className="month-title">
            {view === 'month' 
                ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : getWeekDateRange()
              }
            </h2>
          
          <button className="nav-button" onClick={() => navigate(1)}>
            <ChevronRight />
          </button>
        </div>

        {/* Lado derecho: Login/Logout y botones de vista */}
        <div className="header-right">
          {/* Botones de vista */}
          <div className="view-buttons">
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
                className="view-button"
                onClick={() => setShowMonthEvents(true)}
                style={{ backgroundColor: '#8b5cf6', color: 'white', border: '1px solid #8b5cf6' }}
              >
                📅 Eventos del Mes
              </button>
          </div>

          {/* Botón de agregar */}
          <button className="add-button"
          onClick={handleAddButtonClick}>
            <Plus />
          </button>

          {/* Login/Logout */}
          {isLoggedIn ? (
            <>
              <div className="admin-status">
                <User />
                <span>Admin</span>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                <LogOut />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button className="login-button" onClick={openLoginModal}>
              <Lock />
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Headers de los días */}
      <div className="days-header">
        {daysOfWeek.map(day => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>

      {/* Grid del calendario */}
      <div className="calendar-grid">
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
                {hasEvents && <div className="event-indicator"></div>}
              </div>
              
              <div className="events-container">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className={`event-item ${event.type === 'event' ? 'event-type' : 'note-type'}`}
                  >
                    {event.time && <span style={{fontWeight: '600'}}>{event.time}</span>}
                    <span style={event.time ? {marginLeft: '4px'} : {}}>{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="more-events">
                    +{dayEvents.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Iniciar Sesión como Admin</h3>
              <button className="close-button" onClick={closeLoginModal}>
                <X />
              </button>
            </div>

            <div className="event-form">
              <div>
                <label className="form-label">Usuario</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="form-input"
                  placeholder="Admin"
                />
              </div>

              <div>
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="form-input"
                  placeholder="**********"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              {loginError && (
                <div className="error-message">{loginError}</div>
              )}

              <div className="button-group">
                <button className="cancel-button" onClick={closeLoginModal}>
                  Cancelar
                </button>
                <button className="submit-button" onClick={handleLogin}>
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Eventos */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedDate?.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button className="close-button" onClick={closeModal}>
                <X />
              </button>
            </div>

            {/* Mensaje de advertencia si no es admin */}
            {!isLoggedIn && (
              <div className="warning-message">
                <Lock />
                <span>Solo el administrador puede agregar o eliminar eventos</span>
              </div>
            )}

            {/* Formulario */}
            <div className="event-form">
              <div>
                <div className="form-label">Tipo</div>
                <div className="type-buttons">
                  <button
                    onClick={() => isLoggedIn && setEventForm({...eventForm, type: 'event'})}
                    disabled={!isLoggedIn}
                    className={`type-button ${eventForm.type === 'event' ? 'active' : ''} ${!isLoggedIn ? 'disabled' : ''}`}
                  >
                    <Calendar />
                    <span>Evento</span>
                  </button>
                  <button
                    onClick={() => isLoggedIn && setEventForm({...eventForm, type: 'note'})}
                    disabled={!isLoggedIn}
                    className={`type-button ${eventForm.type === 'note' ? 'note-active' : ''} ${!isLoggedIn ? 'disabled' : ''}`}
                  >
                    <FileText />
                    <span>Nota</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Título *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => isLoggedIn && setEventForm({...eventForm, title: e.target.value})}
                  className="form-input"
                  placeholder="Título del evento o nota"
                  disabled={!isLoggedIn}
                />
              </div>

              {eventForm.type === 'event' && (
                <div>
                  <label className="form-label">Hora</label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => isLoggedIn && setEventForm({...eventForm, time: e.target.value})}
                    className="form-input"
                    disabled={!isLoggedIn}
                  />
                </div>
              )}

              <div>
                <label className="form-label">Descripción</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => isLoggedIn && setEventForm({...eventForm, description: e.target.value})}
                  className="form-textarea"
                  placeholder="Descripción opcional"
                  disabled={!isLoggedIn}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="button-group">
              <button className="cancel-button" onClick={closeModal}>
                Cancelar
              </button>
              <button
                className="submit-button"
                onClick={addEvent}
                disabled={!isLoggedIn}
              >
                Agregar
              </button>
            </div>

            {/* Lista de eventos existentes */}
            {selectedDate && getEventsForDate(selectedDate).length > 0 && (
              <div className="events-list">
                <h4 className="events-list-title">Eventos del día:</h4>
                <div>
                  {getEventsForDate(selectedDate).map(event => (
                    <div
                      key={event.id}
                      className={`event-card ${event.type === 'event' ? 'event-type' : 'note-type'}`}
                    >
                      <div className="event-card-header">
                        <div className="event-card-content">
                          <div className="event-card-title">
                            {event.type === 'event' ? <Calendar /> : <FileText />}
                            <span>{event.title}</span>
                          </div>
                          {event.time && (
                            <div className="event-time">
                              <Clock />
                              <span>{event.time}</span>
                            </div>
                          )}
                          {event.description && (
                            <p className="event-description">{event.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteEvent(formatDateKey(selectedDate), event.id)}
                          className="delete-button"
                          disabled={!isLoggedIn}
                        >
                          <X />
                        </button>
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
                  <div className="modal">
                    <div className="modal-content" style={{ maxWidth: '700px' }}>
                      <div className="modal-header">
                        <h3 className="modal-title">
                          Eventos de {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <button className="close-button" onClick={() => setShowMonthEvents(false)}>
                          <X />
                        </button>
                      </div>

                      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {(() => {
                          const monthEvents = getEventsForMonth(currentDate);
                          
                          if (monthEvents.length === 0) {
                            return (
                              <div style={{ 
                                textAlign: 'center', 
                                padding: '40px 20px',
                                color: '#6b7280',
                                fontSize: '16px'
                              }}>
                                No hay eventos programados para este mes
                              </div>
                            );
                          }

                          // Agrupar eventos por fecha
                          const eventsByDate = {};
                          monthEvents.forEach(event => {
                            const dateStr = event.date.toLocaleDateString('es-ES', { 
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            });
                            if (!eventsByDate[dateStr]) {
                              eventsByDate[dateStr] = [];
                            }
                            eventsByDate[dateStr].push(event);
                          });

                          return Object.entries(eventsByDate).map(([dateStr, dateEvents]) => (
                            <div key={dateStr} style={{ marginBottom: '24px' }}>
                              <h4 style={{ 
                                margin: '0 0 12px 0',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#374151',
                                borderBottom: '2px solid #e5e7eb',
                                paddingBottom: '8px',
                                textTransform: 'capitalize'
                              }}>
                                {dateStr}
                              </h4>
                              
                              <div style={{ paddingLeft: '16px' }}>
                                {dateEvents.map(event => (
                                  <div
                                    key={event.id}
                                    className={`event-card ${event.type === 'event' ? 'event-type' : 'note-type'}`}
                                    style={{ marginBottom: '12px' }}
                                  >
                                    <div className="event-card-header">
                                      <div className="event-card-content">
                                        <div className="event-card-title">
                                          {event.type === 'event' ? <Calendar /> : <FileText />}
                                          <span>{event.title}</span>
                                        </div>
                                        {event.time && (
                                          <div className="event-time">
                                            <Clock />
                                            <span>{event.time}</span>
                                          </div>
                                        )}
                                        {event.description && (
                                          <p className="event-description">{event.description}</p>
                                        )}
                                      </div>
                                      {isLoggedIn && (
                                        <button
                                          onClick={() => {
                                            deleteEvent(event.dateKey, event.id);
                                            // Actualizar la vista si es necesario
                                          }}
                                          className="delete-button"
                                        >
                                          <X />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>

                      {/* Estadísticas del mes */}
                      <div style={{ 
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '16px',
                        marginTop: '16px',
                        display: 'flex',
                        justifyContent: 'space-around',
                        backgroundColor: '#f9fafb',
                        padding: '16px',
                        borderRadius: '8px'
                      }}>
                        {(() => {
                          const monthEvents = getEventsForMonth(currentDate);
                          const totalEvents = monthEvents.length;
                          const eventCount = monthEvents.filter(e => e.type === 'event').length;
                          const noteCount = monthEvents.filter(e => e.type === 'note').length;
                          
                          return (
                            <>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                                  {totalEvents}
                                </div>
                                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                  Total
                                </div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                                  {eventCount}
                                </div>
                                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                  Eventos
                                </div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#166534' }}>
                                  {noteCount}
                                </div>
                                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                  Notas
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

    </div>
  );
};

export default Calendario;