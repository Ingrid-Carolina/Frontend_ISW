import React, { useState, useEffect } from 'react';
import { api } from '../api/api';

// Opciones de donación predefinidas
const donationOptions = ['L.100', 'L.200', 'L.500', 'L.1000'];

// Componente principal de la subpágina de donación general
const DonarcionSubpagina = ({ onClose }) => {
	// Estado para la cantidad seleccionada (opción rápida)
	const [selectedAmount, setSelectedAmount] = useState(null);
	// Estado para cantidad personalizada
	const [customAmount, setCustomAmount] = useState('');
	// Estado para saber si el usuario está usando el campo personalizado
	const [isCustomSelected, setIsCustomSelected] = useState(false);
	// Estado para el tamaño de pantalla (responsive)
	const [screenSize, setScreenSize] = useState('xl');
	// Estado para notificaciones (éxito/error)
	const [notification, setNotification] = useState({ message: '', type: '' });
	// Estado para mostrar el modal de pago/comprobante
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	// Estado para el archivo de comprobante subido
	const [uploadedFile, setUploadedFile] = useState(null);
	// Estado para la URL de vista previa del comprobante
	const [previewUrl, setPreviewUrl] = useState(null);
	// Estado para el correo del donante (opcional)
	const [emailDonante, setEmailDonante] = useState('');

	// Función para obtener el tamaño de pantalla actual
	const getScreenSize = () => {
		if (typeof window === 'undefined') return 'xl';
		const width = window.innerWidth;
		if (width < 480) return 'xs';
		if (width < 768) return 'sm';
		if (width < 1024) return 'md';
		if (width < 1280) return 'lg';
		if (width < 1536) return 'xl';
		return 'xxl';
	};

	// Actualiza el tamaño de pantalla al cambiar el tamaño de la ventana
	useEffect(() => {
		const handleResize = () => setScreenSize(getScreenSize());
		setScreenSize(getScreenSize());
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Actualiza la vista previa del comprobante cuando se sube un archivo
	useEffect(() => {
		if (uploadedFile) {
			const url = URL.createObjectURL(uploadedFile);
			setPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		} else {
			setPreviewUrl(null);
		}
	}, [uploadedFile]);

	// --- Estilos en línea para cada sección (responsive) ---
	const rootStyles = {
		width: '100%',
		minHeight: '100vh',
		backgroundColor: screenSize === 'xs' ? '#ffffff' : '#f8fafc',
		display: 'flex',
		alignItems: screenSize === 'xs' ? 'flex-start' : 'center',
		justifyContent: 'center',
		padding:
			screenSize === 'xs'
				? '0'
				: screenSize === 'sm'
					? '20px 16px'
					: screenSize === 'md'
						? '40px 32px'
						: '60px 40px',
		overflowX: 'hidden',
		fontFamily:
			'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
	};

	const containerStyles = {
		width: '100%',
		maxWidth:
			screenSize === 'xs'
				? '100%'
				: screenSize === 'sm'
					? '100%'
					: screenSize === 'md'
						? '800px'
						: screenSize === 'lg'
							? '1000px'
							: '1200px',
		display: 'flex',
		flexDirection:
			screenSize === 'xs' || screenSize === 'sm' ? 'column' : 'row',
		gap: screenSize === 'xs' ? '0' : screenSize === 'sm' ? '20px' : '32px',
		backgroundColor: screenSize === 'xs' ? 'transparent' : 'transparent',
		borderRadius: screenSize === 'xs' ? '0' : '16px',
		overflow: 'hidden',
		boxShadow: screenSize === 'xs' ? 'none' : '0 10px 40px rgba(0, 0, 0, 0.1)',
		minHeight: screenSize === 'xs' ? '100vh' : 'auto',
	};

	const leftPanelStyles = {
		flex: screenSize === 'xs' || screenSize === 'sm' ? 'none' : 2,
		width: '100%',
		padding:
			screenSize === 'xs'
				? '20px 16px'
				: screenSize === 'sm'
					? '30px 24px'
					: screenSize === 'md'
						? '40px 32px'
						: '48px 40px',
		backgroundColor: '#ffffff',
		borderRadius:
			screenSize === 'xs' ? '0' : screenSize === 'sm' ? '12px' : '16px',
		boxShadow: screenSize === 'xs' ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)',
		order: 1,
		minHeight: screenSize === 'xs' ? 'calc(100vh - 200px)' : 'auto',
		display: 'flex',
		flexDirection: 'column',
	};

	const rightPanelStyles = {
		flex: screenSize === 'xs' || screenSize === 'sm' ? 'none' : 1,
		width: '100%',
		padding:
			screenSize === 'xs'
				? '20px 16px 30px'
				: screenSize === 'sm'
					? '30px 24px'
					: screenSize === 'md'
						? '40px 32px'
						: '48px 40px',
		backgroundColor: '#ffffff',
		borderRadius:
			screenSize === 'xs' ? '0' : screenSize === 'sm' ? '12px' : '16px',
		boxShadow:
			screenSize === 'xs'
				? '0 -4px 12px rgba(0, 0, 0, 0.1)'
				: '0 4px 12px rgba(0, 0, 0, 0.1)',
		display: 'flex',
		flexDirection: 'column',
		gap: screenSize === 'xs' ? '16px' : '20px',
		order: 2,
		position: screenSize === 'xs' ? 'sticky' : 'static',
		bottom: screenSize === 'xs' ? '0' : 'auto',
		zIndex: screenSize === 'xs' ? 100 : 'auto',
		borderTop: screenSize === 'xs' ? '2px solid #f1f5f9' : 'none',
	};

	const modalOverlayStyles = {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 2000,
		padding: screenSize === 'xs' ? '16px' : '20px',
		backdropFilter: 'blur(4px)',
	};

	const modalContentStyles = {
		backgroundColor: '#ffffff',
		borderRadius: screenSize === 'xs' ? '16px' : '20px',
		padding: screenSize === 'xs' ? '24px 20px' : '32px 28px',
		width: '100%',
		maxWidth: screenSize === 'xs' ? '100%' : '500px',
		maxHeight: '90vh',
		overflowY: 'auto',
		boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
		position: 'relative',
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
		alignSelf: 'flex-start',
	};

	const titleStyles = {
		marginBottom: screenSize === 'xs' ? '24px' : '32px',
		fontWeight: '700',
		fontSize:
			screenSize === 'xs'
				? 'clamp(1.25rem, 5vw, 1.5rem)'
				: screenSize === 'sm'
					? '1.5rem'
					: screenSize === 'md'
						? '1.75rem'
						: '2rem',
		margin: '0 0 32px 0',
		lineHeight: 1.2,
		color: '#1e293b',
		letterSpacing: '-0.01em',
	};

	const gridStyles = {
		display: 'grid',
		gridTemplateColumns:
			screenSize === 'xs'
				? '1fr 1fr'
				: screenSize === 'sm'
					? 'repeat(2, 1fr)'
					: 'repeat(2, 1fr)',
		gap: screenSize === 'xs' ? '12px' : screenSize === 'sm' ? '16px' : '20px',
		marginBottom: screenSize === 'xs' ? '20px' : '24px',
		flex: 1,
	};

	const optionCardStyles = isSelected => ({
		height:
			screenSize === 'xs'
				? 'clamp(60px, 15vw, 80px)'
				: screenSize === 'sm'
					? '90px'
					: screenSize === 'md'
						? '100px'
						: '110px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: `2px solid ${isSelected ? '#e6691d' : '#e2e8f0'}`,
		borderRadius: screenSize === 'xs' ? '12px' : '16px',
		cursor: 'pointer',
		transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
		backgroundColor: isSelected ? 'rgba(230, 105, 29, 0.1)' : '#ffffff',
		boxShadow: isSelected
			? '0 4px 20px rgba(230, 105, 29, 0.2)'
			: '0 2px 8px rgba(0, 0, 0, 0.1)',
		minHeight: '56px',
		transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
		position: 'relative',
		overflow: 'hidden',
	});

	const amountTextStyles = {
		fontSize:
			screenSize === 'xs'
				? 'clamp(1rem, 4vw, 1.25rem)'
				: screenSize === 'sm'
					? '1.25rem'
					: screenSize === 'md'
						? '1.4rem'
						: '1.5rem',
		fontWeight: '600',
		margin: 0,
		color: '#1e293b',
		letterSpacing: '-0.01em',
	};

	const customAmountContainerStyles = {
		marginTop: screenSize === 'xs' ? '20px' : '24px',
	};

	const customAmountLabelStyles = {
		display: 'block',
		fontSize: screenSize === 'xs' ? '0.95rem' : '1rem',
		fontWeight: '500',
		color: '#475569',
		marginBottom: '8px',
		letterSpacing: '-0.01em',
	};

	const customAmountCardStyles = isSelected => ({
		minHeight: screenSize === 'xs' ? '60px' : '70px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: `2px solid ${isSelected ? '#e6691d' : '#e2e8f0'}`,
		borderRadius: screenSize === 'xs' ? '12px' : '16px',
		transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
		backgroundColor: isSelected ? 'rgba(230, 105, 29, 0.05)' : '#ffffff',
		padding: screenSize === 'xs' ? '12px 16px' : '16px 20px',
		boxShadow: isSelected
			? '0 4px 20px rgba(230, 105, 29, 0.15)'
			: '0 2px 8px rgba(0, 0, 0, 0.08)',
		transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
		position: 'relative',
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
	};

	const contributionTitleStyles = {
		fontWeight: '700',
		fontSize:
			screenSize === 'xs'
				? '1.25rem'
				: screenSize === 'sm'
					? '1.35rem'
					: '1.5rem',
		margin: 0,
		textAlign: 'center',
		color: '#1e293b',
		letterSpacing: '-0.01em',
		marginBottom: screenSize === 'xs' ? '16px' : '20px',
	};

	const summaryCardStyles = {
		backgroundColor: '#f8fafc',
		borderRadius: screenSize === 'xs' ? '12px' : '16px',
		padding: screenSize === 'xs' ? '20px 16px' : '24px 20px',
		border: '1px solid #e2e8f0',
		marginBottom: screenSize === 'xs' ? '20px' : '24px',
	};

	const totalRowStyles = {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '0',
		marginBottom: '8px',
	};

	const totalLabelStyles = {
		fontSize: screenSize === 'xs' ? '1rem' : '1.1rem',
		fontWeight: '500',
		color: '#64748b',
	};

	const totalAmountStyles = {
		fontWeight: '700',
		fontSize: screenSize === 'xs' ? '1.5rem' : '1.75rem',
		color: '#e6691d',
		letterSpacing: '-0.02em',
	};

	const continueButtonStyles = disabled => ({
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
		overflow: 'hidden',
	});

	// Selecciona una cantidad rápida y desactiva el campo personalizado
	const handleSelectAmount = amount => {
		setSelectedAmount(amount);
		setIsCustomSelected(false);
		setCustomAmount('');

		if (screenSize === 'xs' && 'vibrate' in navigator) {
			navigator.vibrate(50);
		}
	};

	// Maneja el cambio en el campo de cantidad personalizada
	const handleCustomAmountChange = event => {
		const value = event.target.value;
		if (value === '' || /^\d*\.?\d*$/.test(value)) {
			setCustomAmount(value);
			setSelectedAmount(null);
			setIsCustomSelected(true);
		}
	};

	// Devuelve el valor de la cantidad seleccionada (rápida o personalizada)
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

	// Regresa a la página anterior
	const handleBack = () => {
		if (onClose) {
			onClose();
		}
	};

	// Activa el campo personalizado al enfocarlo
	const handleCustomFocus = () => {
		setSelectedAmount(null);
		setIsCustomSelected(true);
	};

	// Continúa al modal de pago si la cantidad es válida
	const handleContinue = () => {
		const amount = getSelectedAmountValue();

		if (amount === '0.00') {
			setNotification({
				message: 'Debes seleccionar o ingresar una cantidad válida.',
				type: 'error',
			});
			setTimeout(() => setNotification({ message: '', type: '' }), 4000);
			return;
		}

		setShowPaymentModal(true);
	};

	// Maneja el cambio de archivo para el comprobante
	const handleFileChange = event => {
		const file = event.target.files[0];
		if (!file) return;

		const ok =
			file.type.startsWith('image/') || file.type === 'application/pdf';
		if (ok) {
			setUploadedFile(file);
		} else {
			setNotification({
				message: 'Selecciona una imagen o PDF válido',
				type: 'error',
			});
			setTimeout(() => setNotification({ message: '', type: '' }), 4000);
		}
	};

	// Envía el comprobante y muestra mensaje de éxito
	const handleSubmitPayment = async () => {
		if (!uploadedFile) {
			setNotification({
				message: 'Por favor sube el comprobante de la Donación',
				type: 'error',
			});
			setTimeout(() => setNotification({ message: '', type: '' }), 4000);
			return;
		}

		try {
			const monto = getSelectedAmountValue();
			const form = new FormData();
			form.append('comprobante', uploadedFile);
			if (monto && monto !== '0.00') form.append('monto', monto);
			if (emailDonante) form.append('correo', emailDonante.trim());

			await api.post('/auth/donaciones/enviar-comprobante', form, {
				headers: { 'Content-Type': 'multipart/form-data' },
				withCredentials: true,
				skipAuthRedirect: true,
			});

			setNotification({
				message: `¡Gracias por tu donación de L.${monto || ''}! Tu comprobante fue enviado al administrador.`,
				type: 'success',
			});

			setTimeout(() => {
				setShowPaymentModal(false);
				setUploadedFile(null);
				setPreviewUrl(null);
				setNotification({ message: '', type: '' });
			}, 2000);
		} catch (err) {
			console.error(err);
			const msg =
				err?.response?.data?.error ||
				err?.response?.data?.mensaje ||
				'No se pudo enviar el comprobante. Intenta de nuevo.';
			setNotification({ message: msg, type: 'error' });
			setTimeout(() => setNotification({ message: '', type: '' }), 4000);
		}
	};

	// Efecto visual en tarjetas al tocar en móviles
	const handleCardTouch = (e, amount) => {
		if (screenSize === 'xs') {
			e.currentTarget.style.transform = 'scale(0.98)';
			setTimeout(() => {
				if (e.currentTarget) {
					e.currentTarget.style.transform =
						selectedAmount === amount ? 'translateY(-2px)' : 'translateY(0)';
				}
			}, 150);
		}
	};

	// Renderizado principal del componente
	return (
		<>
			{/* Notificación de éxito/error */}
			{notification.message && (
				<div
					style={{
						position: 'fixed',
						bottom: '20px',
						left: '50%',
						transform: 'translateX(-50%)',
						backgroundColor:
							notification.type === 'success' ? '#16a34a' : '#dc2626',
						color: 'white',
						padding: '12px 20px',
						borderRadius: '12px',
						boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
						zIndex: 9999,
						fontSize: '0.95rem',
						fontWeight: 600,
						letterSpacing: 0.2,
						transition: 'opacity 0.25s ease, transform 0.25s ease',
					}}
				>
					{notification.message}
				</div>
			)}

			<div style={rootStyles}>
				<div style={containerStyles}>
					{/* Panel izquierdo: selección de cantidad */}
					<div style={leftPanelStyles}>
						<button
							style={backButtonStyles}
							onClick={handleBack}
							onMouseEnter={e => (e.target.style.color = '#d65a0c')}
							onMouseLeave={e => (e.target.style.color = '#e6691d')}
						>
							<span style={{ fontSize: '1.2em' }}>←</span>
							<span>Regresar</span>
						</button>

						<h1 style={titleStyles}>Selecciona una cantidad para donar</h1>

						{/* Opciones rápidas */}
						<div style={gridStyles}>
							{donationOptions.map(amount => (
								<div
									key={amount}
									style={optionCardStyles(selectedAmount === amount)}
									onClick={() => handleSelectAmount(amount)}
									onTouchStart={e => handleCardTouch(e, amount)}
								>
									<span style={amountTextStyles}>{amount}</span>
									{selectedAmount === amount && (
										<div
											style={{
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
												fontWeight: 'bold',
											}}
										>
											✓
										</div>
									)}
								</div>
							))}
						</div>

						{/* Campo de cantidad personalizada */}
						<div style={customAmountContainerStyles}>
							<label style={customAmountLabelStyles}>
								Cantidad personalizada
							</label>
							<div style={customAmountCardStyles(isCustomSelected)}>
								<span
									style={{
										fontSize: screenSize === 'xs' ? '1.1rem' : '1.2rem',
										fontWeight: '500',
										color: '#64748b',
										marginRight: '8px',
									}}
								>
									L.
								</span>
								<input
									type='number'
									placeholder='0.00'
									style={customInputStyles}
									value={customAmount}
									onChange={handleCustomAmountChange}
									onFocus={handleCustomFocus}
								/>
								{isCustomSelected && (
									<div
										style={{
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
											fontWeight: 'bold',
										}}
									>
										✓
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Panel derecho: resumen y botón continuar */}
					<div style={rightPanelStyles}>
						<h2 style={contributionTitleStyles}>Tu contribución</h2>

						<div style={summaryCardStyles}>
							<div style={totalRowStyles}>
								<span style={totalLabelStyles}>Total a donar:</span>
								<span style={totalAmountStyles}>
									L.{getSelectedAmountValue()}
								</span>
							</div>
						</div>

						<button
							style={continueButtonStyles(getSelectedAmountValue() === '0.00')}
							disabled={getSelectedAmountValue() === '0.00'}
							onClick={handleContinue}
						>
							Continuar con la donación
						</button>
					</div>
				</div>
			</div>

			{/* Modal para subir comprobante de donación */}
			{showPaymentModal && (
				<div
					style={modalOverlayStyles}
					onClick={() => setShowPaymentModal(false)}
				>
					<div style={modalContentStyles} onClick={e => e.stopPropagation()}>
						<h2
							style={{
								fontSize: screenSize === 'xs' ? '1.4rem' : '1.6rem',
								fontWeight: '700',
								color: '#1e293b',
								marginBottom: '20px',
								textAlign: 'center',
							}}
						>
							Información de la Donacion
						</h2>

						{/* Información de cuenta bancaria */}
						<div
							style={{
								backgroundColor: '#fef3c7',
								border: '2px solid #f59e0b',
								borderRadius: '12px',
								padding: '20px',
								marginBottom: '24px',
							}}
						>
							<p
								style={{
									fontSize: '1rem',
									color: '#92400e',
									margin: '0 0 12px 0',
									fontWeight: '600',
								}}
							>
								Realiza tu depósito a:
							</p>
							<p
								style={{
									fontSize: '1.1rem',
									color: '#1e293b',
									margin: '0',
									fontWeight: '700',
									lineHeight: 1.6,
								}}
							>
								Banco: <span style={{ color: '#e6691d' }}>BAC</span>
								<br />
								Cuenta: <span style={{ color: '#e6691d' }}>748728881</span>
								<br />A nombre de:{' '}
								<span style={{ color: '#e6691d' }}>Melissa Rosales</span>
							</p>
						</div>

						{/* Subida de comprobante */}
						<div
							style={{
								border: '2px dashed #cbd5e1',
								borderRadius: '12px',
								padding: '24px',
								textAlign: 'center',
								marginBottom: '20px',
								backgroundColor: '#f8fafc',
							}}
						>
							<label
								htmlFor='file-upload'
								style={{
									cursor: 'pointer',
									display: 'block',
								}}
							>
								<div
									style={{
										fontSize: '3rem',
										marginBottom: '12px',
										color: '#94a3b8',
									}}
								>
									📤
								</div>
								<p
									style={{
										fontSize: '1rem',
										color: '#64748b',
										margin: '0 0 8px 0',
										fontWeight: '500',
									}}
								>
									{uploadedFile
										? 'Cambiar comprobante'
										: 'Subir comprobante de la Donacion'}
								</p>
								<p
									style={{
										fontSize: '0.85rem',
										color: '#94a3b8',
										margin: 0,
									}}
								>
									Haz clic para seleccionar una imagen o PDF
								</p>
							</label>
							<input
								id='file-upload'
								type='file'
								accept='image/*,application/pdf'
								onChange={handleFileChange}
								style={{ display: 'none' }}
							/>
						</div>

						{/* Vista previa del comprobante */}
						{previewUrl && (
							<div style={{ marginBottom: '20px', textAlign: 'center' }}>
								<p
									style={{
										fontSize: '0.9rem',
										color: '#64748b',
										marginBottom: '8px',
										fontWeight: '500',
									}}
								>
									Vista previa:
								</p>

								{uploadedFile?.type === 'application/pdf' ? (
									<>
										<embed
											src={previewUrl}
											type='application/pdf'
											style={{
												width: '100%',
												height: '260px',
												borderRadius: '8px',
												border: '2px solid #e2e8f0',
											}}
										/>
										<div style={{ marginTop: 8 }}>
											<a
												href={previewUrl}
												target='_blank'
												rel='noopener noreferrer'
											>
												Abrir PDF en nueva pestaña
											</a>
										</div>
									</>
								) : (
									<img
										src={previewUrl}
										alt='Comprobante'
										style={{
											maxWidth: '100%',
											maxHeight: '200px',
											borderRadius: '8px',
											border: '2px solid #e2e8f0',
											objectFit: 'contain',
										}}
									/>
								)}
							</div>
						)}

						{/* Botones de acción en el modal */}
						<div
							style={{
								display: 'flex',
								gap: '12px',
								marginTop: '24px',
							}}
						>
							<button
								onClick={() => setShowPaymentModal(false)}
								style={{
									flex: 1,
									padding: '14px 20px',
									backgroundColor: '#f1f5f9',
									color: '#475569',
									border: 'none',
									borderRadius: '12px',
									fontSize: '1rem',
									fontWeight: '600',
									cursor: 'pointer',
									transition: 'background-color 0.3s',
								}}
							>
								Cancelar
							</button>
							<button
								onClick={handleSubmitPayment}
								disabled={!uploadedFile}
								style={{
									flex: 1,
									padding: '14px 20px',
									backgroundColor: uploadedFile ? '#e6691d' : '#f1f5f9',
									color: uploadedFile ? 'white' : '#94a3b8',
									border: 'none',
									borderRadius: '12px',
									fontSize: '1rem',
									fontWeight: '600',
									cursor: uploadedFile ? 'pointer' : 'not-allowed',
									transition: 'all 0.3s',
									boxShadow: uploadedFile
										? '0 4px 12px rgba(230, 105, 29, 0.3)'
										: 'none',
								}}
							>
								Enviar
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default DonarcionSubpagina;
