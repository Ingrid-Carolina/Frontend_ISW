import React, { useState } from 'react';

// Componentes de iconos SVG simples
const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
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

  const days = getDaysInMonth(currentDate);

  const styles = {
    // Navbar styles
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '85px',
      backgroundColor: '#4c1d95',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    },
    
    navbarLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },

    navbarTitle: {
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold',
      margin: 0
    },

    navbarRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },

    adminStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'white',
      fontSize: '14px'
    },

    loginButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },

    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    
    // Contenedor principal ajustado
    container: {
      marginTop: '70px',
      maxWidth: '1000px',
      margin: '70px auto 0 auto',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: 'calc(100vh - 70px)'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    navButton: {
      padding: '8px',
      border: 'none',
      borderRadius: '50%',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#374151',
      margin: 0
    },
    todayButton: {
      padding: '8px 16px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    daysHeader: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
      marginBottom: '8px'
    },
    dayHeader: {
      padding: '12px',
      textAlign: 'center',
      fontWeight: '600',
      color: '#6b7280',
      backgroundColor: '#f9fafb',
      borderRadius: '8px'
    },
    calendar: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
      marginBottom: '24px'
    },
    dayCell: {
      minHeight: '120px',
      padding: '8px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: 'white'
    },
    dayCellInactive: {
      backgroundColor: '#f9fafb',
      color: '#9ca3af'
    },
    dayCellToday: {
      border: '2px solid #3b82f6',
      backgroundColor: '#eff6ff'
    },
    dayNumber: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    dayNumberToday: {
      color: '#2563eb'
    },
    eventIndicator: {
      width: '8px',
      height: '8px',
      backgroundColor: '#3b82f6',
      borderRadius: '50%'
    },
    eventsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    eventItem: {
      fontSize: '12px',
      padding: '4px',
      borderRadius: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    eventTypeEvent: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    eventTypeNote: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    moreEvents: {
      fontSize: '12px',
      color: '#6b7280',
      fontWeight: '600'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      width: '100%',
      maxWidth: '500px',
      margin: '16px',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#374151',
      margin: 0
    },
    closeButton: {
      padding: '4px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: 'transparent',
      cursor: 'pointer'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '24px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '4px'
    },
    typeButtons: {
      display: 'flex',
      gap: '8px'
    },
    typeButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '8px 12px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    typeButtonActive: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    typeButtonInactive: {
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    typeButtonDisabled: {
      backgroundColor: '#f3f4f6',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    inputDisabled: {
      backgroundColor: '#f9fafb',
      color: '#6b7280',
      cursor: 'not-allowed'
    },
    textarea: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '80px'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px',
      marginBottom: '16px'
    },
    cancelButton: {
      padding: '8px 16px',
      color: '#6b7280',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      transition: 'background-color 0.2s'
    },
    addButton: {
      padding: '8px 16px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    addButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    eventsList: {
      borderTop: '1px solid #e5e7eb',
      paddingTop: '16px'
    },
    eventsListTitle: {
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    eventCard: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid',
      marginBottom: '8px'
    },
    eventCardEvent: {
      backgroundColor: '#eff6ff',
      borderColor: '#bfdbfe'
    },
    eventCardNote: {
      backgroundColor: '#f0fdf4',
      borderColor: '#bbf7d0'
    },
    eventCardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    eventCardContent: {
      flex: 1
    },
    eventCardTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontWeight: '600',
      marginBottom: '4px'
    },
    eventTime: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '4px'
    },
    eventDescription: {
      fontSize: '14px',
      color: '#6b7280'
    },
    deleteButton: {
      padding: '4px',
      color: '#ef4444',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      marginLeft: '8px'
    },
    deleteButtonDisabled: {
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    notAdminMessage: {
      backgroundColor: '#fef3c7',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#92400e'
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    errorMessage: {
      color: '#dc2626',
      fontSize: '14px',
      marginTop: '8px'
    }
  };

  return (
    <div>
      {/* Navbar Principal */}
      <nav style={styles.navbar}>
        
      </nav>

      {/* Calendario */}
      <div style={styles.container}>
        {/* Header del calendario */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.navButton}
              onClick={() => navigateMonth(-1)}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <ChevronLeft />
            </button>
            <h2 style={styles.title}>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              style={styles.navButton}
              onClick={() => navigateMonth(1)}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <ChevronRight />
            </button>
          </div>

			<div style={styles.navbarRight}>
          {isLoggedIn ? (
            <>
              <div style={styles.adminStatus}>
                <User />
                <span>Admin</span>
              </div>
              <button
                style={styles.logoutButton}
                onClick={handleLogout}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
              >
                <LogOut />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button
              style={styles.loginButton}
              onClick={openLoginModal}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
            >
              <Lock />
              Iniciar Sesión
            </button>
          )}
        </div>





          <button
            style={styles.todayButton}
            onClick={() => setCurrentDate(new Date())}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Hoy
          </button>
        </div>

        {/* Días de la semana */}
        <div style={styles.daysHeader}>
          {daysOfWeek.map(day => (
            <div key={day} style={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>

        {/* Grid del calendario */}
        <div style={styles.calendar}>
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.fullDate);
            const hasEvents = dayEvents.length > 0;
            const todayStyle = isToday(day.fullDate) ? styles.dayCellToday : {};
            const inactiveStyle = !day.isCurrentMonth ? styles.dayCellInactive : {};
            
            return (
              <div
                key={index}
                style={{...styles.dayCell, ...todayStyle, ...inactiveStyle}}
                onClick={() => openModal(day.fullDate)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => {
                  if (isToday(day.fullDate)) {
                    e.target.style.backgroundColor = '#eff6ff';
                  } else if (!day.isCurrentMonth) {
                    e.target.style.backgroundColor = '#f9fafb';
                  } else {
                    e.target.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={styles.dayNumber}>
                  <span style={isToday(day.fullDate) ? styles.dayNumberToday : {}}>
                    {day.date}
                  </span>
                  {hasEvents && <div style={styles.eventIndicator}></div>}
                </div>
                
                <div style={styles.eventsContainer}>
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      style={{
                        ...styles.eventItem,
                        ...(event.type === 'event' ? styles.eventTypeEvent : styles.eventTypeNote)
                      }}
                    >
                      {event.time && <span style={{fontWeight: '600'}}>{event.time}</span>}
                      <span style={event.time ? {marginLeft: '4px'} : {}}>{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div style={styles.moreEvents}>
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
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Iniciar Sesión como Admin</h3>
                <button
                  style={styles.closeButton}
                  onClick={closeLoginModal}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <X />
                </button>
              </div>

              <div style={styles.loginForm}>
                <div>
                  <label style={styles.label}>Usuario</label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    style={styles.input}
                    placeholder="**********"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                <div>
                  <label style={styles.label}>Contraseña</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    style={styles.input}
                    placeholder="**********"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>

                {loginError && (
                  <div style={styles.errorMessage}>{loginError}</div>
                )}

                <div style={styles.buttonGroup}>
                  <button
                    style={styles.cancelButton}
                    onClick={closeLoginModal}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    Cancelar
                  </button>
                  <button
                    style={styles.addButton}
                    onClick={handleLogin}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Eventos */}
        {showModal && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>
                  {selectedDate?.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <button
                  style={styles.closeButton}
                  onClick={closeModal}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <X />
                </button>
              </div>

              {/* Mensaje de advertencia si no es admin */}
              {!isLoggedIn && (
                <div style={styles.notAdminMessage}>
                  <Lock />
                  <span>Solo el administrador puede agregar o eliminar eventos</span>
                </div>
              )}

              {/* Formulario */}
              <div style={styles.form}>
                <div>
                  <div style={styles.label}>Tipo</div>
                  <div style={styles.typeButtons}>
                    <button
                      onClick={() => isLoggedIn && setEventForm({...eventForm, type: 'event'})}
                      disabled={!isLoggedIn}
                      style={{
                        ...styles.typeButton,
                        ...(eventForm.type === 'event' ? styles.typeButtonActive : 
                            !isLoggedIn ? styles.typeButtonDisabled : styles.typeButtonInactive)
                      }}
                    >
                      <Calendar />
                      <span>Evento</span>
                    </button>
                    <button
                      onClick={() => isLoggedIn && setEventForm({...eventForm, type: 'note'})}
                      disabled={!isLoggedIn}
                      style={{
                        ...styles.typeButton,
                        ...(eventForm.type === 'note' ? 
                          {...styles.typeButtonActive, backgroundColor: '#10b981'} : 
                          !isLoggedIn ? styles.typeButtonDisabled : styles.typeButtonInactive)
                      }}
                    >
                      <FileText />
                      <span>Nota</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label style={styles.label}>Título *</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => isLoggedIn && setEventForm({...eventForm, title: e.target.value})}
                    style={{
                      ...styles.input,
                      ...(isLoggedIn ? {} : styles.inputDisabled)
                    }}
                    placeholder="Título del evento o nota"
                    disabled={!isLoggedIn}
                    onFocus={(e) => isLoggedIn && (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>

                {eventForm.type === 'event' && (
                  <div>
                    <label style={styles.label}>Hora</label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => isLoggedIn && setEventForm({...eventForm, time: e.target.value})}
                      style={{
                        ...styles.input,
                        ...(isLoggedIn ? {} : styles.inputDisabled)
                      }}
                      disabled={!isLoggedIn}
                      onFocus={(e) => isLoggedIn && (e.target.style.borderColor = '#3b82f6')}
                      onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    />
                  </div>
                )}

                <div>
                  <label style={styles.label}>Descripción</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => isLoggedIn && setEventForm({...eventForm, description: e.target.value})}
                    style={{
                      ...styles.textarea,
                      ...(isLoggedIn ? {} : styles.inputDisabled)
                    }}
                    placeholder="Descripción opcional"
                    disabled={!isLoggedIn}
                    onFocus={(e) => isLoggedIn && (e.target.style.borderColor = '#3b82f6')}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              {/* Botones */}
              <div style={styles.buttonGroup}>
                <button
                  style={styles.cancelButton}
                  onClick={closeModal}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  Cancelar
                </button>
                <button
                  style={{
                    ...styles.addButton,
                    ...(isLoggedIn ? {} : styles.addButtonDisabled)
                  }}
                  onClick={addEvent}
                  disabled={!isLoggedIn}
                  onMouseEnter={(e) => isLoggedIn && (e.target.style.backgroundColor = '#2563eb')}
                  onMouseLeave={(e) => isLoggedIn && (e.target.style.backgroundColor = '#3b82f6')}
                >
                  Agregar
                </button>
              </div>

              {/* Lista de eventos existentes */}
              {selectedDate && getEventsForDate(selectedDate).length > 0 && (
                <div style={styles.eventsList}>
                  <h4 style={styles.eventsListTitle}>Eventos del día:</h4>
                  <div>
                    {getEventsForDate(selectedDate).map(event => (
                      <div
                        key={event.id}
                        style={{
                          ...styles.eventCard,
                          ...(event.type === 'event' ? styles.eventCardEvent : styles.eventCardNote)
                        }}
                      >
                        <div style={styles.eventCardHeader}>
                          <div style={styles.eventCardContent}>
                            <div style={styles.eventCardTitle}>
                              {event.type === 'event' ? <Calendar /> : <FileText />}
                              <span>{event.title}</span>
                            </div>
                            {event.time && (
                              <div style={styles.eventTime}>
                                <Clock />
                                <span>{event.time}</span>
                              </div>
                            )}
                            {event.description && (
                              <p style={styles.eventDescription}>{event.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteEvent(formatDateKey(selectedDate), event.id)}
                            style={{
                              ...styles.deleteButton,
                              ...(isLoggedIn ? {} : styles.deleteButtonDisabled)
                            }}
                            disabled={!isLoggedIn}
                            onMouseEnter={(e) => isLoggedIn && (e.target.style.backgroundColor = '#fee2e2')}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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
      </div>
    </div>
  );
};

export default Calendario;
