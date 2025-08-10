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

    // Sistema de breakpoints responsive
    const getScreenSize = () => {
        const width = window.innerWidth;
        if (width < 576) return 'xs';
        if (width < 768) return 'sm';
        if (width < 992) return 'md';
        if (width < 1200) return 'lg';
        return 'xl';
    };

    const [screenSize, setScreenSize] = useState(getScreenSize());

    useEffect(() => {
        const handleResize = () => setScreenSize(getScreenSize());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Estilos responsive principales - SOLUCION: Eliminar completamente el espacio extra
    const rootStyles = {
        width: '100%',
        // Usar height: auto para que se ajuste al contenido
        height: 'auto',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: screenSize === 'xs' ? '16px 8px' : screenSize === 'sm' ? '24px 16px' : '32px',
        overflowX: 'hidden',
        // Eliminar paddingBottom extra
        paddingBottom: '0'
    };

    const containerStyles = {
        width: '100%',
        maxWidth: screenSize === 'xs' ? '100%' : screenSize === 'sm' ? '600px' : '1000px',
        display: 'flex',
        flexDirection: screenSize === 'xs' || screenSize === 'sm' ? 'column' : 'row',
        gap: screenSize === 'xs' ? '16px' : '24px',
        padding: screenSize === 'xs' ? '0' : screenSize === 'sm' ? '16px' : '32px',
        // Eliminar margen superior extra
        marginTop: '0'
        
    };

    const leftPanelStyles = {
        flex: screenSize === 'xs' || screenSize === 'sm' ? 'none' : 2,
        width: screenSize === 'xs' || screenSize === 'sm' ? '100%' : 'auto',
        padding: screenSize === 'xs' ? '20px' : screenSize === 'sm' ? '24px' : '32px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
        order: screenSize === 'xs' || screenSize === 'sm' ? 1 : 0
    };

    const rightPanelStyles = {
        flex: screenSize === 'xs' || screenSize === 'sm' ? 'none' : 1,
        width: screenSize === 'xs' || screenSize === 'sm' ? '100%' : 'auto',
        padding: screenSize === 'xs' ? '20px' : screenSize === 'sm' ? '24px' : '32px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        order: screenSize === 'xs' || screenSize === 'sm' ? 2 : 1,
        // Mantener sticky solo en móviles si es necesario
        position: screenSize === 'xs' ? 'static' : 'static',
        bottom: 'auto',
        zIndex: 'auto'
    };

    const backButtonStyles = {
        marginBottom: '16px',
        color: '#e6691d',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: screenSize === 'xs' ? '0.9rem' : '1rem',
        padding: '8px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const titleStyles = {
        marginBottom: '24px',
        fontWeight: 'bold',
        fontSize: screenSize === 'xs' ? '1.25rem' : screenSize === 'sm' ? '1.35rem' : '1.5rem',
        margin: '0 0 24px 0',
        lineHeight: 1.3
    };

    const gridStyles = {
        display: 'grid',
        gridTemplateColumns: screenSize === 'xs' ? '1fr' : screenSize === 'sm' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
        gap: screenSize === 'xs' ? '12px' : '16px',
        marginBottom: '16px'
    };

    const optionCardStyles = (isSelected) => ({
        height: screenSize === 'xs' ? '60px' : screenSize === 'sm' ? '80px' : '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${isSelected ? '#e6691d' : '#ccc'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        backgroundColor: isSelected ? 'rgba(230, 105, 29, 0.1)' : 'white',
        boxShadow: isSelected ? '0 0 5px rgba(230, 105, 29, 0.5)' : 'none',
        minHeight: '48px'
    });

    const amountTextStyles = {
        fontSize: screenSize === 'xs' ? '1rem' : screenSize === 'sm' ? '1.1rem' : '1.25rem',
        fontWeight: '500',
        margin: 0
    };

    const customAmountContainerStyles = {
        marginTop: '16px'
    };

    const customAmountCardStyles = (isSelected) => ({
        minHeight: screenSize === 'xs' ? '60px' : '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${isSelected ? '#e6691d' : '#ccc'}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        backgroundColor: isSelected ? 'rgba(230, 105, 29, 0.1)' : 'white',
        padding: screenSize === 'xs' ? '12px' : '8px'
    });

    const customInputStyles = {
        width: '100%',
        padding: screenSize === 'xs' ? '14px 12px' : '12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: screenSize === 'xs' ? '1rem' : '1rem',
        outline: 'none',
        transition: 'border-color 0.3s',
        minHeight: '44px',
        boxSizing: 'border-box'
    };

    const contributionTitleStyles = {
        fontWeight: 'bold',
        fontSize: screenSize === 'xs' ? '1.1rem' : '1.25rem',
        margin: 0,
        textAlign: screenSize === 'xs' || screenSize === 'sm' ? 'center' : 'left'
    };

    const totalRowStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: screenSize === 'xs' || screenSize === 'sm' ? '16px 0' : '0',
        borderTop: screenSize === 'xs' || screenSize === 'sm' ? '1px solid #eee' : 'none',
        borderBottom: screenSize === 'xs' || screenSize === 'sm' ? '1px solid #eee' : 'none'
    };

    const totalLabelStyles = {
        fontSize: screenSize === 'xs' ? '1rem' : '1rem',
        fontWeight: '500'
    };

    const totalAmountStyles = {
        fontWeight: 'bold',
        fontSize: screenSize === 'xs' ? '1.25rem' : '1rem',
        color: '#e6691d'
    };

    const continueButtonStyles = (disabled) => ({
        backgroundColor: disabled ? '#e0e0e0' : '#e6691d',
        color: disabled ? '#a0a0a0' : 'white',
        border: 'none',
        padding: screenSize === 'xs' ? '16px 24px' : '12px 24px',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: screenSize === 'xs' ? '1.1rem' : '1rem',
        transition: 'background-color 0.3s',
        fontWeight: '500',
        minHeight: '48px',
        width: screenSize === 'xs' || screenSize === 'sm' ? '100%' : 'auto'
    });

    const mobileInstructionStyles = {
        fontSize: '0.9rem',
        color: '#666',
        textAlign: 'center',
        marginBottom: '16px',
        display: screenSize === 'xs' ? 'block' : 'none'
    };

    const sectionDividerStyles = {
        height: '1px',
        backgroundColor: '#eee',
        margin: '24px 0',
        display: screenSize === 'xs' || screenSize === 'sm' ? 'block' : 'none'
    };

    // Funciones de manejo
    const handleSelectAmount = (amount) => {
        setSelectedAmount(amount);
        setIsCustomSelected(false);
        setCustomAmount('');
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
        console.log(`Donación de L.${amount} confirmada.`);
        
        if (screenSize === 'xs') {
            if (window.confirm(`¿Confirmas tu donación de L.${amount}?`)) {
                alert(`¡Gracias por tu donación de L.${amount}!`);
            }
        } else {
            alert(`¡Gracias por tu donación de L.${amount}!`);
        }
    };

    return (
        <div style={rootStyles}>
            <div style={containerStyles}>
                {/* Panel izquierdo - Selección de donación */}
                <div style={leftPanelStyles}>
                    <button 
                        style={backButtonStyles}
                        onClick={handleBack}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                        <span>←</span>
                        <span>Regresar</span>
                    </button>
                    
                    <h2 style={titleStyles}>
                        Selecciona una cantidad para donar
                    </h2>

                    <div style={mobileInstructionStyles}>
                        Toca una opción para seleccionar tu donación
                    </div>
                    
                    <div style={gridStyles}>
                        {donationOptions.map((amount) => (
                            <div
                                key={amount}
                                style={optionCardStyles(selectedAmount === amount)}
                                onClick={() => handleSelectAmount(amount)}
                                onMouseEnter={(e) => {
                                    if (selectedAmount !== amount) {
                                        e.target.style.borderColor = '#e6691d';
                                        e.target.style.boxShadow = '0 0 5px rgba(230, 105, 29, 0.5)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedAmount !== amount) {
                                        e.target.style.borderColor = '#ccc';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleSelectAmount(amount);
                                    }
                                }}
                            >
                                <span style={amountTextStyles}>{amount}</span>
                            </div>
                        ))}
                    </div>

                    <div style={customAmountContainerStyles}>
                        <div 
                            style={customAmountCardStyles(isCustomSelected)}
                            onClick={() => setIsCustomSelected(true)}
                        >
                            <input
                                type="number"
                                placeholder="Cantidad personalizada (ej: 150.50)"
                                style={{
                                    ...customInputStyles,
                                    borderColor: isCustomSelected ? '#e6691d' : '#ccc'
                                }}
                                value={customAmount}
                                onChange={handleCustomAmountChange}
                                min="0"
                                step="0.01"
                                onFocus={handleCustomFocus}
                                onMouseEnter={(e) => {
                                    if (!isCustomSelected) {
                                        e.target.style.borderColor = '#e6691d';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isCustomSelected) {
                                        e.target.style.borderColor = '#ccc';
                                    }
                                }}
                                inputMode="decimal"
                            />
                        </div>
                    </div>

                    <div style={sectionDividerStyles}></div>
                </div>

                {/* Panel derecho - Resumen de contribución */}
                <div style={rightPanelStyles}>
                    <h3 style={contributionTitleStyles}>Tu contribución</h3>
                    
                    <div style={totalRowStyles}>
                        <span style={totalLabelStyles}>Total a donar:</span>
                        <span style={totalAmountStyles}>L.{getSelectedAmountValue()}</span>
                    </div>
                    
                    <button
                        style={continueButtonStyles(getSelectedAmountValue() === '0.00')}
                        disabled={getSelectedAmountValue() === '0.00'}
                        onClick={handleContinue}
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
                        aria-label={`Continuar con donación de L.${getSelectedAmountValue()}`}
                    >
                        {screenSize === 'xs' ? `Donar L.${getSelectedAmountValue()}` : 'Continuar'}
                    </button>

                    {screenSize === 'xs' && getSelectedAmountValue() === '0.00' && (
                        <div style={{
                            fontSize: '0.9rem',
                            color: '#666',
                            textAlign: 'center',
                            marginTop: '8px'
                        }}>
                            Selecciona una cantidad para continuar
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonarcionSubpagina;