import React, { useState } from 'react';
import DonarcionSubpagina from './DonarcionSubpagina';

const MediaCard = ({ title, content, image, onDonateClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const cardStyles = {
        width: '100%',
        maxWidth: '345px',
        backgroundColor: '#e0e0e0',
        color: 'black',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        transition: 'transform 0.3s ease-in-out',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        overflow: 'hidden',
        cursor: 'pointer',
        margin: '0 auto'
    };

    const mediaStyles = {
        height: '140px',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    };

    const contentStyles = {
        padding: '16px'
    };

    const titleStyles = {
        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
        fontWeight: 'bold',
        marginBottom: '8px',
        lineHeight: '1.334'
    };

    const descriptionStyles = {
        fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
        color: 'rgba(0, 0, 0, 0.6)',
        lineHeight: '1.43'
    };

    const actionsStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px'
    };

    const buttonStyles = {
        backgroundColor: '#e6691d',
        color: 'white',
        border: 'none',
        padding: '6px 16px',
        borderRadius: '4px',
        fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
        cursor: 'pointer',
        transition: 'background-color 0.3s'
    };

    const buttonHoverStyles = {
        backgroundColor: '#d65a0c'
    };

    return (
        <div 
            style={cardStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={mediaStyles} title={title} />
            <div style={contentStyles}>
                <h5 style={titleStyles}>{title}</h5>
                <p style={descriptionStyles}>{content}</p>
            </div>
            <div style={actionsStyles}>
                <span></span>
                <button
                    style={buttonStyles}
                    onMouseEnter={(e) => e.target.style.backgroundColor = buttonHoverStyles.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = buttonStyles.backgroundColor}
                    onClick={() => onDonateClick(title)}
                >
                    Donar
                </button>
            </div>
        </div>
    );
};

const Donaciones = () => {
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [donationType, setDonationType] = useState('');
    const [donationCard, setDonationCard] = useState('');
    const [showDonarcionSubpagina, setShowDonarcionSubpagina] = useState(false);

    const longText = `Creemos que cada niño merece la oportunidad de practicar el deporte que ama, recibir una educación de calidad y perseguir sus sueños. Hoy, les pedimos su apoyo para hacer realidad esta convicción.
    Gracias a nuestros generosos donantes y socios, hemos logrado avances increíbles en los últimos 15 años. Nuestro dedicado equipo se ha enfocado en abordar los problemas fundamentales que impactan a las comunidades y el crecimiento del béisbol y el sóftbol en Latinoamérica. Desde México y Nicaragua hasta Colombia y Brasil, hemos perfeccionado nuestro enfoque para generar cambios positivos y duraderos en la vida de los niños a través de los valores del trabajo en equipo, la estrategia y el esfuerzo.
    Al apoyar la campaña Habilidades para la Vida, usted brinda esperanza a los niños que enfrentan circunstancias difíciles; muchos de ellos son refugiados lejos de su hogar, sin un camino claro hacia adelante. Su apoyo no solo les proporciona habilidades esenciales para la vida, sino que también les infunde la esperanza y el coraje para aspirar a más. Juntos, estamos construyendo comunidades fuertes e iluminando el camino a seguir.
    Considere hacer una donación única o mensual recurrente hoy mismo. ¡Gracias!`;

    const shortText = `Creemos que cada niño merece la oportunidad de practicar el deporte que ama, recibir una educación de calidad y perseguir sus sueños. Hoy, les pedimos su apoyo para hacer realidad esta convicción.`;

    // Obtener el ancho de la ventana para responsive
    const getScreenSize = () => {
        const width = window.innerWidth;
        if (width < 576) return 'xs';
        if (width < 768) return 'sm';
        if (width < 992) return 'md';
        if (width < 1200) return 'lg';
        return 'xl';
    };

    const [screenSize, setScreenSize] = useState(getScreenSize());

    React.useEffect(() => {
        const handleResize = () => setScreenSize(getScreenSize());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Estilos responsive para diferentes secciones
    const heroSectionStyles = {
        position: 'relative',
        width: '100%',
        minHeight: screenSize === 'xs' ? '70vh' : screenSize === 'sm' ? '80vh' : '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/Images/Categoria.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: screenSize === 'xs' ? '24px 16px' : screenSize === 'sm' ? '32px 24px' : '48px'
    };

    const heroOverlayStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 80, 0.75)',
        zIndex: 1
    };

    const heroContentStyles = {
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        color: 'white',
        padding: screenSize === 'xs' ? '16px' : '32px',
        maxWidth: '100%'
    };

    const heroTitleStyles = {
        fontWeight: 'bold',
        fontSize: screenSize === 'xs' ? '3rem' : screenSize === 'sm' ? '4rem' : screenSize === 'md' ? '5rem' : '7rem',
        fontFamily: '"Varsity", cursive',
        color: 'white',
        textTransform: 'uppercase',
        margin: 0,
        lineHeight: 1.1
    };

    const heroSubtitleStyles = {
        fontSize: screenSize === 'xs' ? '1rem' : screenSize === 'sm' ? '1.2rem' : '1.5rem',
        maxWidth: screenSize === 'xs' ? '100%' : '600px',
        lineHeight: '1.5',
        color: 'white',
        margin: 0,
        padding: screenSize === 'xs' ? '0 8px' : '0'
    };

    const heroButtonsStyles = {
        display: 'flex',
        flexDirection: screenSize === 'xs' ? 'column' : 'row',
        gap: '16px',
        marginTop: '24px',
        width: screenSize === 'xs' ? '100%' : 'auto'
    };

    const primaryButtonStyles = {
        backgroundColor: '#e6691d',
        color: 'white',
        padding: screenSize === 'xs' ? '12px 24px' : '10px 30px',
        borderRadius: '50px',
        border: 'none',
        cursor: 'pointer',
        fontSize: screenSize === 'xs' ? '0.9rem' : '1rem',
        transition: 'background-color 0.3s',
        width: screenSize === 'xs' ? '100%' : 'auto'
    };

    const secondaryButtonStyles = {
        color: 'white',
        borderColor: 'white',
        padding: screenSize === 'xs' ? '12px 24px' : '10px 30px',
        borderRadius: '50px',
        border: '1px solid white',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: screenSize === 'xs' ? '0.9rem' : '1rem',
        transition: 'background-color 0.3s',
        width: screenSize === 'xs' ? '100%' : 'auto'
    };

    const orangeSectionStyles = {
        display: 'flex',
        flexDirection: screenSize === 'md' || screenSize === 'xs' || screenSize === 'sm' ? 'column' : 'row',
        alignItems: 'center',
        gap: '32px',
        padding: screenSize === 'xs' ? '32px 16px' : screenSize === 'sm' ? '40px 24px' : screenSize === 'md' ? '48px 40px' : '48px 80px',
        backgroundColor: '#e6691d'
    };

    const orangeContentStyles = {
        flex: 1,
        color: 'white',
        textAlign: screenSize === 'xs' || screenSize === 'sm' ? 'center' : 'left'
    };

    const orangeTitleStyles = {
        fontFamily: '"Varsity", cursive',
        fontWeight: 'bold',
        marginBottom: '16px',
        fontSize: screenSize === 'xs' ? '2rem' : screenSize === 'sm' ? '2.5rem' : screenSize === 'md' ? '3rem' : '4rem',
        margin: 0,
        lineHeight: 1.2
    };

    const orangeTextStyles = {
        fontFamily: '"PeterMedium", sans-serif',
        fontSize: screenSize === 'xs' ? '1rem' : screenSize === 'sm' ? '1.2rem' : '1.5rem',
        lineHeight: 1.8,
        marginBottom: '16px'
    };

    const textButtonStyles = {
        color: 'white',
        marginTop: '16px',
        fontWeight: 'bold',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: screenSize === 'xs' ? '0.9rem' : '1rem'
    };

    const cardsSectionStyles = {
        backgroundColor: '#000757',
        padding: screenSize === 'xs' ? '32px 16px' : screenSize === 'sm' ? '40px 24px' : screenSize === 'md' ? '48px 40px' : '48px 80px'
    };

    const cardsTitleStyles = {
        fontFamily: '"Varsity", cursive',
        fontWeight: 'bold',
        marginBottom: '32px',
        fontSize: screenSize === 'xs' ? '2rem' : screenSize === 'sm' ? '2.5rem' : screenSize === 'md' ? '3rem' : '4rem',
        color: 'white',
        textAlign: 'center',
        margin: '0 0 32px 0',
        lineHeight: 1.2
    };

    const cardsSubtitleStyles = {
        fontFamily: '"PeterMedium", sans-serif',
        fontSize: screenSize === 'xs' ? '1rem' : screenSize === 'sm' ? '1.2rem' : '1.5rem',
        lineHeight: 1.8,
        color: 'white',
        textAlign: 'center',
        marginBottom: '32px'
    };

    const cardsContainerStyles = {
        display: 'grid',
        gridTemplateColumns: screenSize === 'xs' ? '1fr' : screenSize === 'sm' ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'repeat(auto-fit, minmax(345px, 1fr))',
        gap: screenSize === 'xs' ? '24px' : '32px',
        justifyItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
    };

    const modalOverlayStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px'
    };

    const modalContentStyles = {
        position: 'relative',
        width: '100%',
        maxWidth: screenSize === 'xs' ? '100%' : '600px',
        backgroundColor: 'white',
        border: '2px solid #000',
        borderRadius: '16px',
        boxShadow: '0 24px 24px rgba(0, 0, 0, 0.12)',
        padding: screenSize === 'xs' ? '24px' : '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxHeight: '90vh',
        overflowY: 'auto'
    };

    const modalTitleStyles = {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: screenSize === 'xs' ? '1.2rem' : '1.5rem',
        margin: 0
    };

    const radioGroupStyles = {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    };

    const radioOptionStyles = (isSelected) => ({
        margin: 0,
        borderRadius: '4px',
        padding: screenSize === 'xs' ? '12px' : '16px',
        border: '1px solid #ccc',
        transition: 'background-color 0.3s',
        backgroundColor: isSelected ? 'rgba(230, 106, 29, 0.33)' : 'transparent',
        borderColor: isSelected ? '#e6691d' : '#ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        fontSize: screenSize === 'xs' ? '0.9rem' : '1rem'
    });

    const continueButtonStyles = (disabled) => ({
        backgroundColor: disabled ? 'rgba(0, 0, 0, 0.12)' : '#e6691d',
        color: disabled ? 'rgba(0, 0, 0, 0.26)' : 'white',
        border: 'none',
        padding: screenSize === 'xs' ? '14px 24px' : '12px 24px',
        borderRadius: '4px',
        minHeight: '44px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: screenSize === 'xs' ? '0.9rem' : '1rem',
        transition: 'background-color 0.3s'
    });

    const handleToggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleOpen = (cardTitle) => {
        setOpen(true);
        setDonationCard(cardTitle);
        setDonationType('');
    };

    const handleClose = () => setOpen(false);

    const handleOptionChange = (value) => {
        setDonationType(value);
    };

    const handleContinue = () => {
        console.log('Botón continuar clickeado, tipo de donación:', donationType);
        
        if (donationType === 'general') {
            console.log('Navegando a subpágina de donación...');
            setShowDonarcionSubpagina(true);
            handleClose();
        } else if (donationType === 'campaign') {
            console.log(`Se ha seleccionado la opción de donación: ${donationType} para la tarjeta: ${donationCard}`);
            handleClose();
        }
    };

    if (showDonarcionSubpagina) {
        return <DonarcionSubpagina onClose={() => setShowDonarcionSubpagina(false)} />;
    }

    return (
        <div style={{ width: '100%', overflowX: 'hidden' }}>
            {/* Hero Section */}
            <div style={heroSectionStyles}>
                <div style={heroOverlayStyles}></div>
                <div style={heroContentStyles}>
                    <h1 style={heroTitleStyles}>Donar</h1>
                    <p style={heroSubtitleStyles}>
                        Creemos que cada niño tiene derecho a practicar el deporte de su elección, 
                        recibir una educación de calidad y perseguir sus sueños.
                    </p>
                    <div style={heroButtonsStyles}>
                        <button 
                            style={primaryButtonStyles}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#d65a0c'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#e6691d'}
                        >
                            Unirse
                        </button>
                        <button 
                            style={secondaryButtonStyles}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            onClick={() => handleOpen('Botón Donar del header')}
                        >
                            Donar
                        </button>
                    </div>
                </div>
            </div>

            {/* Orange Section */}
            <div style={orangeSectionStyles}>
                <div style={orangeContentStyles}>
                    <h2 style={orangeTitleStyles}>
                        ¡Empoderemos a los niños con habilidades para la vida!
                    </h2>
                    <p style={orangeTextStyles}>
                        {expanded ? longText : shortText}
                    </p>
                    <button style={textButtonStyles} onClick={handleToggleExpand}>
                        {expanded ? 'Leer menos' : 'Leer más'}
                    </button>
                </div>
            </div>

            {/* Cards Section */}
            <div style={cardsSectionStyles}>
                <h2 style={cardsTitleStyles}>Asociación de Béisbol</h2>
                <p style={cardsSubtitleStyles}>Cada Lempira Cuenta</p>
                
                <div style={cardsContainerStyles}>
                    <MediaCard
                        title='Patrocinara un Jugador'
                        content='Mantenga vivo el sueño del béisbol para un joven jugador de béisbol en América Latina asegurándole que tenga los suministros que necesita para disfrutar del juego durante un año.'
                        image='https://th.bing.com/th/id/OIP.H-VR5oO-zt3RacllWQKGsAHaFj?rs=1&pid=ImgDetMain'
                        onDonateClick={handleOpen}
                    />
                    <MediaCard
                        title='Patrocinar al Equipo'
                        content='Transforma el juego de todo el equipo durante un año. Este patrocinio Ayuda al equipo de béisbol, uniformes nuevos y apoyo para el transporte de los niños.'
                        image='https://www.alamy.com/aggregator-api/download?url=https://c8.alamy.com/comp/P3F3HY/young-soccer-players-holding-trophy-boys-celebrating-soccer-football-championship-winning-team-of-sport-tournament-for-kids-children-P3F3HY.jpg'
                        onDonateClick={handleOpen}
                    />
                    <MediaCard
                        title='Noche Benéfica: ¡Únete a Nuestra Noche Benéfica por el Béisbol Menor!'
                        content='¡Prepárense para una noche inolvidable de diversión, comunidad y, por supuesto, béisbol! Nos complace anunciar nuestra Noche Benéfica...'
                        image='https://th.bing.com/th/id/OIP.9SKrTRCaLbaVmimjan-23AHaD4?rs=1&pid=ImgDetMain'
                        onDonateClick={handleOpen}
                    />
                </div>
            </div>

            {/* Modal */}
            {open && (
                <div style={modalOverlayStyles} onClick={handleClose}>
                    <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
                        <h2 style={modalTitleStyles}>¿Cómo te gustaría donar?</h2>
                        
                        <div style={radioGroupStyles}>
                            <label 
                                style={radioOptionStyles(donationType === 'general')}
                                onClick={() => handleOptionChange('general')}
                            >
                                <span>Haz una donación general con dinero.</span>
                                <input 
                                    type="radio"
                                    name="donation-type"
                                    value="general"
                                    checked={donationType === 'general'}
                                    onChange={(e) => handleOptionChange(e.target.value)}
                                />
                            </label>
                            
                            <label 
                                style={radioOptionStyles(donationType === 'campaign')}
                                onClick={() => handleOptionChange('campaign')}
                            >
                                <span>Donar Equipamiento</span>
                                <input 
                                    type="radio"
                                    name="donation-type"
                                    value="campaign"
                                    checked={donationType === 'campaign'}
                                    onChange={(e) => handleOptionChange(e.target.value)}
                                />
                            </label>
                        </div>

                        <button
                            style={continueButtonStyles(!donationType)}
                            onClick={handleContinue}
                            disabled={!donationType}
                            onMouseEnter={(e) => {
                                if (!e.target.disabled) {
                                    e.target.style.backgroundColor = '#d65a0c';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!e.target.disabled) {
                                    e.target.style.backgroundColor = '#e6691d';
                                }
                            }}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Donaciones;