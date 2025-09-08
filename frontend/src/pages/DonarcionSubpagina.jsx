import React, { useState, useEffect } from 'react';

const donationOptions = [
    'L.100',
    'L.200',
    'L.500',
    'L.1000',
];

const DonarcionSubpagina = ({ onClose }) => {
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [isCustomSelected, setIsCustomSelected] = useState(false);
    const [screenSize, setScreenSize] = useState("xl");
    const [notification, setNotification] = useState({ message: "", type: "" });

    // Enhanced responsive system with more breakpoints
    const getScreenSize = () => {
        if (typeof window === 'undefined') return 'xl';
        const width = window.innerWidth;
        if (width < 480) return 'xs';      // Extra small phones (320px-479px)
        if (width < 768) return 'sm';      // Small phones/tablets (480px-767px)
        if (width < 1024) return 'md';     // Tablets/small laptops (768px-1023px)
        if (width < 1280) return 'lg';     // Laptops (1024px-1279px)
        if (width < 1536) return 'xl';     // Desktop (1280px-1535px)
        return 'xxl';                      // Large desktop (1536px+)
    };


    useEffect(() => {
        const handleResize = () => setScreenSize(getScreenSize());
        setScreenSize(getScreenSize());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Enhanced responsive styles with fluid design
    const rootStyles = {
        width: '100%',
        minHeight: '100vh',
        backgroundColor: screenSize === 'xs' ? '#ffffff' : '#f8fafc',
        display: 'flex',
        alignItems: screenSize === 'xs' ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: screenSize === 'xs' ? '0' : 
                 screenSize === 'sm' ? '20px 16px' : 
                 screenSize === 'md' ? '40px 32px' : '60px 40px',
        overflowX: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    };

    const containerStyles = {
        width: '100%',
        maxWidth: screenSize === 'xs' ? '100%' : 
                  screenSize === 'sm' ? '100%' : 
                  screenSize === 'md' ? '800px' : 
                  screenSize === 'lg' ? '1000px' : '1200px',
        display: 'flex',
        flexDirection: screenSize === 'xs' || screenSize === 'sm' ? 'column' : 'row',
        gap: screenSize === 'xs' ? '0' : screenSize === 'sm' ? '20px' : '32px',
        backgroundColor: screenSize === 'xs' ? 'transparent' : 'transparent',
        borderRadius: screenSize === 'xs' ? '0' : '16px',
        overflow: 'hidden',
        boxShadow: screenSize === 'xs' ? 'none' : '0 10px 40px rgba(0, 0, 0, 0.1)',
        minHeight: screenSize === 'xs' ? '100vh' : 'auto'
    };

    const leftPanelStyles = {
        flex: screenSize === 'xs' || screenSize === 'sm' ? 'none' : 2,
        width: '100%',
        padding: screenSize === 'xs' ? '20px 16px' : 
                 screenSize === 'sm' ? '30px 24px' : 
                 screenSize === 'md' ? '40px 32px' : '48px 40px',
        backgroundColor: '#ffffff',
        borderRadius: screenSize === 'xs' ? '0' : 
                      screenSize === 'sm' ? '12px' : '16px',
        boxShadow: screenSize === 'xs' ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        order: 1,
        minHeight: screenSize === 'xs' ? 'calc(100vh - 200px)' : 'auto',
        display: 'flex',
        flexDirection: 'column'
    };

    const rightPanelStyles = {
        flex: screenSize === 'xs' || screenSize === 'sm' ? 'none' : 1,
        width: '100%',
        padding: screenSize === 'xs' ? '20px 16px 30px' : 
                 screenSize === 'sm' ? '30px 24px' : 
                 screenSize === 'md' ? '40px 32px' : '48px 40px',
        backgroundColor: '#ffffff',
        borderRadius: screenSize === 'xs' ? '0' : 
                      screenSize === 'sm' ? '12px' : '16px',
        boxShadow: screenSize === 'xs' ? '0 -4px 12px rgba(0, 0, 0, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: screenSize === 'xs' ? '16px' : '20px',
        order: 2,
        position: screenSize === 'xs' ? 'sticky' : 'static',
        bottom: screenSize === 'xs' ? '0' : 'auto',
        zIndex: screenSize === 'xs' ? 100 : 'auto',
        borderTop: screenSize === 'xs' ? '2px solid #f1f5f9' : 'none'
    };

    const backButtonStyles = {
        marginBottom: screenSize === 'xs' ? '20px' : '24px',
        color: '#e6691d',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: screenSize === 'xs' ? '1rem' : '1.1rem',
        padding: screenSize === 'xs' ? '12px 0' : '8px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '500',
        transition: 'color 0.3s ease',
        alignSelf: 'flex-start'
    };

    const titleStyles = {
        marginBottom: screenSize === 'xs' ? '24px' : '32px',
        fontWeight: '700',
        fontSize: screenSize === 'xs' ? 'clamp(1.25rem, 5vw, 1.5rem)' : 
                   screenSize === 'sm' ? '1.5rem' : 
                   screenSize === 'md' ? '1.75rem' : '2rem',
        margin: '0 0 32px 0',
        lineHeight: 1.2,
        color: '#1e293b',
        letterSpacing: '-0.01em'
    };

    const gridStyles = {
        display: 'grid',
        gridTemplateColumns: screenSize === 'xs' ? '1fr 1fr' : 
                            screenSize === 'sm' ? 'repeat(2, 1fr)' : 
                            'repeat(2, 1fr)',
        gap: screenSize === 'xs' ? '12px' : 
             screenSize === 'sm' ? '16px' : '20px',
        marginBottom: screenSize === 'xs' ? '20px' : '24px',
        flex: 1
    };

    const optionCardStyles = (isSelected) => ({
        height: screenSize === 'xs' ? 'clamp(60px, 15vw, 80px)' : 
                screenSize === 'sm' ? '90px' : 
                screenSize === 'md' ? '100px' : '110px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${isSelected ? '#e6691d' : '#e2e8f0'}`,
        borderRadius: screenSize === 'xs' ? '12px' : '16px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: isSelected ? 'rgba(230, 105, 29, 0.1)' : '#ffffff',
        boxShadow: isSelected ? '0 4px 20px rgba(230, 105, 29, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        minHeight: '56px',
        transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden'
    });

    const amountTextStyles = {
        fontSize: screenSize === 'xs' ? 'clamp(1rem, 4vw, 1.25rem)' : 
                   screenSize === 'sm' ? '1.25rem' : 
                   screenSize === 'md' ? '1.4rem' : '1.5rem',
        fontWeight: '600',
        margin: 0,
        color: '#1e293b',
        letterSpacing: '-0.01em'
    };

    const customAmountContainerStyles = {
        marginTop: screenSize === 'xs' ? '20px' : '24px'
    };

    const customAmountLabelStyles = {
        display: 'block',
        fontSize: screenSize === 'xs' ? '0.95rem' : '1rem',
        fontWeight: '500',
        color: '#475569',
        marginBottom: '8px',
        letterSpacing: '-0.01em'
    };

    const customAmountCardStyles = (isSelected) => ({
        minHeight: screenSize === 'xs' ? '60px' : '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${isSelected ? '#e6691d' : '#e2e8f0'}`,
        borderRadius: screenSize === 'xs' ? '12px' : '16px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: isSelected ? 'rgba(230, 105, 29, 0.05)' : '#ffffff',
        padding: screenSize === 'xs' ? '12px 16px' : '16px 20px',
        boxShadow: isSelected ? '0 4px 20px rgba(230, 105, 29, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
        transform: isSelected ? 'translateY(-1px)' : 'translateY(0)'
    });

    const customInputStyles = {
        width: '100%',
        padding: screenSize === 'xs' ? '16px 16px' : '16px 20px',
        border: 'none',
        borderRadius: screenSize === 'xs' ? '8px' : '12px',
        fontSize: screenSize === 'xs' ? '1rem' : '1.1rem',
        outline: 'none',
        backgroundColor: 'transparent',
        color: '#1e293b',
        fontWeight: '500',
        minHeight: screenSize === 'xs' ? '24px' : '28px',
        boxSizing: 'border-box',
        '::placeholder': {
            color: '#94a3b8',
            fontSize: screenSize === 'xs' ? '0.95rem' : '1rem'
        }
    };

    const contributionTitleStyles = {
        fontWeight: '700',
        fontSize: screenSize === 'xs' ? '1.25rem' : 
                   screenSize === 'sm' ? '1.35rem' : '1.5rem',
        margin: 0,
        textAlign: 'center',
        color: '#1e293b',
        letterSpacing: '-0.01em',
        marginBottom: screenSize === 'xs' ? '16px' : '20px'
    };

    const summaryCardStyles = {
        backgroundColor: '#f8fafc',
        borderRadius: screenSize === 'xs' ? '12px' : '16px',
        padding: screenSize === 'xs' ? '20px 16px' : '24px 20px',
        border: '1px solid #e2e8f0',
        marginBottom: screenSize === 'xs' ? '20px' : '24px'
    };

    const totalRowStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0',
        marginBottom: '8px'
    };

    const totalLabelStyles = {
        fontSize: screenSize === 'xs' ? '1rem' : '1.1rem',
        fontWeight: '500',
        color: '#64748b'
    };

    const totalAmountStyles = {
        fontWeight: '700',
        fontSize: screenSize === 'xs' ? '1.5rem' : '1.75rem',
        color: '#e6691d',
        letterSpacing: '-0.02em'
    };

    const continueButtonStyles = (disabled) => ({
        backgroundColor: disabled ? '#f1f5f9' : '#e6691d',
        color: disabled ? '#94a3b8' : 'white',
        border: 'none',
        padding: screenSize === 'xs' ? '18px 24px' : '16px 32px',
        borderRadius: screenSize === 'xs' ? '12px' : '50px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: screenSize === 'xs' ? '1.1rem' : '1rem',
        fontWeight: '600',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: screenSize === 'xs' ? '56px' : '50px',
        width: '100%',
        boxShadow: disabled ? 'none' : '0 4px 15px rgba(230, 105, 29, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        transform: disabled ? 'none' : 'translateY(0)',
        position: 'relative',
        overflow: 'hidden'
    });

    const instructionStyles = {
        fontSize: screenSize === 'xs' ? '0.9rem' : '0.95rem',
        color: '#64748b',
        textAlign: 'center',
        marginBottom: '16px',
        lineHeight: 1.5,
        fontWeight: '400'
    };

    const safeAreaStyles = {
        paddingBottom: screenSize === 'xs' ? 'env(safe-area-inset-bottom, 20px)' : '0'
    };

    // Animation styles
    const pulseKeyframes = `
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        @keyframes slideUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        @keyframes buttonPress {
            0% { transform: scale(1); }
            50% { transform: scale(0.98); }
            100% { transform: scale(1); }
        }
    `;

    // Event handlers
    const handleSelectAmount = (amount) => {
        setSelectedAmount(amount);
        setIsCustomSelected(false);
        setCustomAmount('');
        
        // Add haptic feedback for mobile
        if (screenSize === 'xs' && 'vibrate' in navigator) {
            navigator.vibrate(50);
        }
    };

    const handleCustomAmountChange = (event) => {
        const value = event.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setCustomAmount(value);
            setSelectedAmount(null);
            setIsCustomSelected(true);
        }
    };

    const getSelectedAmountValue = () => {
        if (isCustomSelected && customAmount) {
            const parsed = parseFloat(customAmount);
            return isNaN(parsed) ? '0.00' : parsed.toFixed(2);
        }
        if (selectedAmount) {
            return parseFloat(selectedAmount.replace('L.', '')).toFixed(2);
        }
        return '0.00';
    };

    const handleBack = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleCustomFocus = () => {
        setSelectedAmount(null);
        setIsCustomSelected(true);
    };

    const handleContinue = () => {
        const amount = getSelectedAmountValue();

        if (amount === "0.00") {
            setNotification({ message: "Debes seleccionar o ingresar una cantidad válida.", type: "error" });
            return;
        }

        // ✅ Mostrar notificación en lugar de alert()
        setNotification({ message: `¡Gracias por tu donación de L.${amount}!`, type: "success" });

        // Limpieza después de 4s
        setTimeout(() => setNotification({ message: "", type: "" }), 4000);
    };

    const handleCardTouch = (e, amount) => {
        // Add touch feedback
        if (screenSize === 'xs') {
            e.currentTarget.style.transform = 'scale(0.98)';
            setTimeout(() => {
                if (e.currentTarget) {
                    e.currentTarget.style.transform = selectedAmount === amount ? 'translateY(-2px)' : 'translateY(0)';
                }
            }, 150);
        }
    };

    return (
        <>
        {/* Notificación flotante */}
            {notification.message && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        backgroundColor: notification.type === "success" ? "#16a34a" : "#dc2626",
                        color: "white",
                        padding: "12px 20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        zIndex: 2000,
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        transition: "opacity 0.3s ease-in-out"
                    }}
                >
                    {notification.message}
                </div>
            )}
            
            <style>{pulseKeyframes}</style>
            <div style={rootStyles}>
                <div style={containerStyles}>
                    {/* Left Panel - Donation Selection */}
                    <div style={leftPanelStyles}>
                        <button 
                            style={backButtonStyles}
                            onClick={handleBack}
                            onMouseEnter={(e) => e.target.style.color = '#d65a0c'}
                            onMouseLeave={(e) => e.target.style.color = '#e6691d'}
                            aria-label="Regresar a la página anterior"
                        >
                            <span style={{ fontSize: '1.2em' }}>←</span>
                            <span>Regresar</span>
                        </button>
                        
                        <h1 style={titleStyles}>
                            Selecciona una cantidad para donar
                        </h1>

                        {screenSize === 'xs' && (
                            <p style={instructionStyles}>
                                Toca una opción o ingresa una cantidad personalizada
                            </p>
                        )}
                        
                        <div style={gridStyles}>
                            {donationOptions.map((amount) => (
                                <div
                                    key={amount}
                                    style={optionCardStyles(selectedAmount === amount)}
                                    onClick={() => handleSelectAmount(amount)}
                                    onTouchStart={(e) => handleCardTouch(e, amount)}
                                    onMouseEnter={(e) => {
                                        if (selectedAmount !== amount) {
                                            e.target.style.borderColor = '#e6691d';
                                            e.target.style.boxShadow = '0 4px 20px rgba(230, 105, 29, 0.15)';
                                            e.target.style.transform = 'translateY(-1px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedAmount !== amount) {
                                            e.target.style.borderColor = '#e2e8f0';
                                            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                                            e.target.style.transform = 'translateY(0)';
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleSelectAmount(amount);
                                        }
                                    }}
                                    aria-pressed={selectedAmount === amount}
                                    aria-label={`Seleccionar donación de ${amount}`}
                                >
                                    <span style={amountTextStyles}>{amount}</span>
                                    {selectedAmount === amount && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            backgroundColor: '#e6691d',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            ✓
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={customAmountContainerStyles}>
                            <label style={customAmountLabelStyles}>
                                Cantidad personalizada
                            </label>
                            <div 
                                style={customAmountCardStyles(isCustomSelected)}
                                onClick={() => setIsCustomSelected(true)}
                            >
                                <span style={{
                                    fontSize: screenSize === 'xs' ? '1.1rem' : '1.2rem',
                                    fontWeight: '500',
                                    color: '#64748b',
                                    marginRight: '8px'
                                }}>L.</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    style={customInputStyles}
                                    value={customAmount}
                                    onChange={handleCustomAmountChange}
                                    min="0"
                                    step="0.01"
                                    onFocus={handleCustomFocus}
                                    inputMode="decimal"
                                    aria-label="Ingresar cantidad personalizada en Lempiras"
                                />
                                {isCustomSelected && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: '#e6691d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        ✓
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Contribution Summary */}
                    <div style={{ ...rightPanelStyles, ...safeAreaStyles }}>
                        <h2 style={contributionTitleStyles}>Tu contribución</h2>
                        
                        <div style={summaryCardStyles}>
                            <div style={totalRowStyles}>
                                <span style={totalLabelStyles}>Total a donar:</span>
                                <span style={totalAmountStyles}>
                                    L.{getSelectedAmountValue()}
                                </span>
                            </div>
                            
                            {getSelectedAmountValue() !== '0.00' && (
                                <div style={{
                                    fontSize: '0.9rem',
                                    color: '#64748b',
                                    textAlign: 'center',
                                    marginTop: '8px'
                                }}>
                                    {screenSize === 'xs' ? 'Desliza hacia arriba para continuar' : ''}
                                </div>
                            )}
                        </div>
                        
                        <button
                            style={continueButtonStyles(getSelectedAmountValue() === '0.00')}
                            disabled={getSelectedAmountValue() === '0.00'}
                            onClick={handleContinue}
                            onMouseEnter={(e) => {
                                if (!e.target.disabled) {
                                    e.target.style.backgroundColor = '#d65a0c';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 20px rgba(230, 105, 29, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!e.target.disabled) {
                                    e.target.style.backgroundColor = '#e6691d';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 15px rgba(230, 105, 29, 0.3)';
                                }
                            }}
                            aria-label={`Proceder con donación de L.${getSelectedAmountValue()}`}
                        >
                            {screenSize === 'xs' ? 
                                `Donar L.${getSelectedAmountValue()}` : 
                                'Continuar con la donación'
                            }
                        </button>

                        {getSelectedAmountValue() === '0.00' && (
                            <div style={{
                                fontSize: '0.9rem',
                                color: '#94a3b8',
                                textAlign: 'center',
                                fontStyle: 'italic'
                            }}>
                                {screenSize === 'xs' ? 
                                    'Selecciona una cantidad arriba para continuar' :
                                    'Selecciona una cantidad para continuar'
                                }
                            </div>
                        )}

                        {screenSize === 'xs' && (
                            <div style={{
                                fontSize: '0.8rem',
                                color: '#94a3b8',
                                textAlign: 'center',
                                marginTop: '12px',
                                lineHeight: 1.4
                            }}>
                                Tu donación ayudará a transformar vidas a través del deporte
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DonarcionSubpagina;