// src/components/Navbar.jsx es un componente de React que implementa una barra de navegación responsiva utilizando Material-UI.
// La barra de navegación incluye enlaces a diferentes secciones del sitio, un menú desplegable para "Sobre Nosotros",
// y opciones de autenticación como inicio de sesión y perfil de usuario.
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventIcon from '@mui/icons-material/Event';
import CallIcon from '@mui/icons-material/Call';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import { useNavigate, Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import axios from 'axios';
axios.defaults.withCredentials = true; // importante para cookies HttpOnly
import { Global } from '@emotion/react';
import logo from '/Images/Logo-pilotos.png';
import { api } from '../api/api';

// Items base del menú
const baseMenuItems = [
	{ text: 'Calendario', icon: <CalendarMonthIcon />, path: '/calendario' },
	{ text: 'Noticias y Eventos', icon: <EventIcon />, path: '/eventos' },
	{ text: 'Voluntariado', icon: <PersonAddIcon />, path: '/voluntariado' },
	{ text: 'Contacto', icon: <CallIcon />, path: '/Contacto' },
];

const pulseAnimation = (
	<Global
		styles={`
    @keyframes pulse {
      0% { transform: scale(0.8); opacity: .4; }
      50% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(0.8); opacity: .4; }
    }
  `}
	/>
);
// Estilos para el botón de navegación
const UserAvatarMenu = ({
	user,
	avatarVer,
	onEditProfile,
	onLogout,
	drawerOpen,
}) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const [imgError, setImgError] = React.useState(false);

	const cacheBustedSrc =
		user.avatar && !imgError
			? `${user.avatar}${user.avatar.includes('?') ? '&' : '?'}v=${avatarVer}`
			: undefined;

	const handleClick = event =>
		setAnchorEl(prev => (prev ? null : event.currentTarget));
	const handleClose = () => setAnchorEl(null);

	return (
		<>
			<IconButton onClick={handleClick} sx={{ ml: 1 }}>
				<Avatar
					src={cacheBustedSrc}
					alt={user.name || 'Usuario'}
					onError={() => setImgError(true)}
					sx={{
						bgcolor: !cacheBustedSrc ? user.color || '#3f51b5' : 'transparent',
						color: drawerOpen ? '#0c005a' : 'white',
						width: 40,
						height: 40,
						fontWeight: 'bold',
						fontSize: '1rem',
						border: drawerOpen ? '2.3px solid #0c005a' : '2.3px solid white',
						transition: 'all 0.3s ease',
					}}
				>
					{!cacheBustedSrc && (user.name?.charAt(0)?.toUpperCase() || 'U')}
				</Avatar>
			</IconButton>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				disableScrollLock
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				PaperProps={{
					elevation: 3,
					sx: {
						mt: 1,
						borderRadius: 2,
						bgcolor: 'rgb(16, 4, 92)',
						color: 'white',
						minWidth: 200,
						border: '1px solid #333',
						overflow: 'visible',
						zIndex: 1400,
						'&::before': {
							content: '""',
							position: 'absolute',
							top: -8,
							right: 16,
							width: 0,
							height: 0,
							borderLeft: '8px solid transparent',
							borderRight: '8px solid transparent',
							borderBottom: '8px solid #121212',
							zIndex: 1400,
						},
					},
				}}
			>
				<MenuItem
					onClick={() => {
						handleClose();
						onEditProfile();
					}}
					sx={{
						gap: 1,
						py: 1,
						color: 'white',
						fontFamily: '"GroteskBold", sans-serif',
						'&:hover': { color: '#e06c14' },
						'& svg': { color: 'inherit' },
					}}
				>
					<EditIcon fontSize='small' />
					Editar perfil
				</MenuItem>

				<MenuItem
					onClick={() => {
						handleClose();
						onLogout();
					}}
					sx={{
						gap: 1,
						py: 1,
						color: 'white',
						fontFamily: '"GroteskBold", sans-serif',
						'&:hover': { color: '#e06c14' },
						'& svg': { color: 'inherit' },
					}}
				>
					<LogoutIcon fontSize='small' />
					Cerrar sesión
				</MenuItem>
			</Menu>
		</>
	);
};
// Validación de props para UserAvatarMenu
UserAvatarMenu.propTypes = {
	user: PropTypes.shape({
		name: PropTypes.string.isRequired,
		color: PropTypes.string,
		avatar: PropTypes.string,
	}).isRequired,
	avatarVer: PropTypes.number.isRequired,
	onEditProfile: PropTypes.func.isRequired,
	onLogout: PropTypes.func.isRequired,
	drawerOpen: PropTypes.bool.isRequired,
};

// ----------------------------------------------------------------------

export default function CustomNavbar() {
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [submenuOpen, setSubmenuOpen] = React.useState(false);
	const [mobileSubmenuOpen, setMobileSubmenuOpen] = React.useState(false);
	const submenuTimer = React.useRef(null);
	// dentro de CustomNavbar()
	const [loadingUser, setLoadingUser] = React.useState(true);

	const theme = useTheme();
	const isCompactNav = useMediaQuery(theme.breakpoints.down('lg')); // <= 1200px

	// AVATAR solo en memoria
	const [avatarUrl, setAvatarUrl] = React.useState('');
	const [avatarVer, setAvatarVer] = React.useState(0);

	//NOMBRE Y ROL SOLO EN ESTADO
	const [userName, setUserName] = React.useState('');
	const [userRole, setUserRole] = React.useState('');

	//esta logueado const
	const isLoggedIn = !!userName;
	const avatarLetter = (userName || 'U').charAt(0).toUpperCase();
	const [unauth, setUnauth] = React.useState(false);

	//revisar si esta envivo
	const [isLive, setIsLive] = React.useState(false);

	// estilos drawer
	const drawerItemSx = {
		textDecoration: 'none',
		color: '#0c005a',
		'&:hover .MuiListItemText-primary': { color: '#e06c14' },
		'&:hover .MuiListItemIcon-root': { color: '#e06c14' },
	};
	const drawerSubItemSx = {
		pl: 6,
		color: '#0c005a',
		'& .MuiListItemIcon-root': { minWidth: 36, color: 'inherit' },
		'&:hover .MuiListItemText-primary': { color: '#e06c14' },
		'&:hover .MuiListItemIcon-root': { color: '#e06c14' },
	};

	// Evento de actualización de perfil
	React.useEffect(() => {
		const onProfileUpdated = e => {
			const url = e?.detail?.avatar || '';
			setAvatarUrl(url);
			setAvatarVer(Date.now());
		};
		window.addEventListener('profile:updated', onProfileUpdated);
		return () =>
			window.removeEventListener('profile:updated', onProfileUpdated);
	}, []);

	// Cargar perfil desde backend usando cookie HttpOnly
	React.useEffect(() => {
		let mounted = true;
		let intervalId;

		const fetchProfile = async () => {
			if (!mounted || unauth) return;
			setLoadingUser(true);
			try {
				const res = await api.get('/auth/obtenerperfil', {
					withCredentials: true,
					skipAuthRedirect: true,
				});

				const perfil = Array.isArray(res.data) ? res.data[0] : res.data;

				const nombre = perfil?.nombre ?? perfil?.name ?? '';
				if (mounted) setUserName(nombre);

				const rolesArr = Array.isArray(perfil?.roles)
					? perfil.roles.map(r => String(r).toLowerCase())
					: [];
				const roleStr = String(perfil?.rol ?? perfil?.role ?? '').toLowerCase();
				const effectiveRole =
					roleStr || (rolesArr.includes('admin') ? 'admin' : rolesArr[0] || '');
				if (mounted) setUserRole(effectiveRole);

				if (perfil?.avatar && mounted) setAvatarUrl(perfil.avatar);
				if (mounted) setUnauth(false); // por si veníamos de no autenticado
			} catch (e) {
				console.warn('Error al obtener perfil:', e?.message || e);
				if (!mounted) return;

				if (e?.status === 401) {
					// marca como no autenticado y limpia datos.
					setUserName('');
					setUserRole('');
					setAvatarUrl('');
					setUnauth(true); // marca estado no autenticado
					// Opcional: detener el polling hasta que haya login
					if (intervalId) clearInterval(intervalId);
					return; // evita que el finally vuelva a arrancar spinner
				}

				// Otros errores (500, red, etc.)
				setUserName('');
				setUserRole('');
				setAvatarUrl('');
			} finally {
				if (mounted) setLoadingUser(false);
			}
		};

		// primera carga
		fetchProfile();

		// refresco periódico sólo si hay sesión
		intervalId = setInterval(fetchProfile, 60 * 60 * 1000);

		const onAuthRefresh = () => {
			// Cuando el usuario inicia sesión, intentamos otra vez
			setUnauth(false);
			fetchProfile();
		};
		window.addEventListener('auth:refresh', onAuthRefresh);

		return () => {
			mounted = false;
			clearInterval(intervalId);
			window.removeEventListener('auth:refresh', onAuthRefresh);
		};
	}, [unauth]);

	//verifica si un video esta envivo
	React.useEffect(() => {
		let cancelled = false;

		const fetchLive = async () => {
			try {
				const res = await api.get('/auth/obtenerenvivo', {
					skipAuthRedirect: true,
				});
				const data = Array.isArray(res.data)
					? res.data
					: res.data?.videos || [];

				// ordenar por id_envivo
				const last = data.sort((a, b) => b.id_envivo - a.id_envivo)[0];

				if (!cancelled) {
					const val = last?.activo;
					const isActive =
						val === true ||
						val === 1 ||
						String(val).trim().toUpperCase() === 'TRUE';
					setIsLive(isActive);
				}
			} catch (e) {
				console.error('Error al verificar En Vivo:', e);
				if (!cancelled) setIsLive(false);
			}
		};

		fetchLive();

		// verifica cada 15s
		const interval = setInterval(fetchLive, 15 * 1000);

		return () => {
			cancelled = true;
			clearInterval(interval);
		};
	}, []);

	// Helper de color
	const generateColorFromName = React.useCallback(name => {
		const colors = ['#3f51b5', '#f44336', '#4caf50', '#ff9800', '#009688'];
		const ch = name?.charCodeAt(0) ?? 'U'.charCodeAt(0);
		return colors[ch % colors.length];
	}, []);
	const userColor = generateColorFromName(avatarLetter);

	const toggleDrawer = () => setDrawerOpen(prev => !prev);
	const handleSubmenuEnter = () => {
		clearTimeout(submenuTimer.current);
		setSubmenuOpen(true);
	};
	const handleCloseDrawer = React.useCallback(() => setDrawerOpen(false), []);
	const handleSubmenuLeave = () => {
		submenuTimer.current = setTimeout(() => setSubmenuOpen(false), 200);
	};
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await api.post('/auth/signout');
			// limpiar estado en memoria
			setUserName('');
			setUserRole('');
			setAvatarUrl('');
			//localStorage.removeItem('userRole');
			//window.dispatchEvent(new CustomEvent('auth:role', { detail: { role: '' } }));
			navigate('/');
			window.dispatchEvent(new Event('auth:refresh'));
			// Redirige una sola vez
			if (location.pathname !== '/login') {
				navigate('/login', { replace: true });
			}
		} catch (error) {
			console.error('Error al cerrar sesión:', error);
			alert('Error al cerrar sesión. Inténtalo de nuevo.');
		}
	};

	return (
		<>
			{pulseAnimation}
			<AppBar
				position='fixed'
				elevation={0}
				sx={{
					backgroundColor: drawerOpen ? '#ffffff' : 'rgba(12, 0, 90, 0.9)',
					zIndex: 1301,
					height: '90px',
					transition: 'background-color 0.3s ease',
				}}
			>
				<Toolbar
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						minHeight: { xs: '74px !important', md: '90px !important' },
						pt: { xs: 'max(15px, env(safe-area-inset-top))', md: 0 },
						pb: { xs: 1, md: 0 },
						px: { xs: 1.5, sm: 2, md: 4 },
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: { xs: 1.5, md: 4 },
							flexGrow: 1,
							minWidth: 0,
						}}
					>
						<Link to='/'>
							<Box
								component='img'
								src={logo}
								alt='Logo Pilotos'
								onClick={handleCloseDrawer}
								sx={{ height: { xs: 46, md: 50 }, cursor: 'pointer' }}
							/>
						</Link>

						<Box
							sx={{
								display: { xs: 'none', lg: 'flex' },
								gap: { lg: 3, xl: 4 },
								position: 'relative',
							}}
						>
							{/* Submenú Sobre Nosotros */}
							<Box
								onMouseEnter={handleSubmenuEnter}
								onMouseLeave={handleSubmenuLeave}
								sx={{ position: 'relative' }}
							>
								<Button sx={navBtnStyle(drawerOpen)}>Sobre Nosotros</Button>
								{submenuOpen && (
									<Box sx={submenuBoxStyle}>
										<MenuItem
											component={Link}
											to='/historia'
											onClick={() => setDrawerOpen(false)}
											sx={subMenuStyle}
										>
											Historia
										</MenuItem>
										<MenuItem
											component={Link}
											to='/aliados'
											onClick={() => setDrawerOpen(false)}
											sx={subMenuStyle}
										>
											Aliados
										</MenuItem>
										<MenuItem
											component={Link}
											to='/NuestroEquipo'
											onClick={() => setDrawerOpen(false)}
											sx={subMenuStyle}
										>
											Nuestro Equipo
										</MenuItem>
										<MenuItem
											component={Link}
											to='/categoria'
											onClick={() => setDrawerOpen(false)}
											sx={subMenuStyle}
										>
											Categorías
										</MenuItem>
										<MenuItem
											component={Link}
											to='/Testimonio'
											onClick={() => setDrawerOpen(false)}
											sx={subMenuStyle}
										>
											Testimonios
										</MenuItem>
									</Box>
								)}
							</Box>

							<Button
								component={Link}
								to='/tienda'
								onClick={() => setDrawerOpen(false)}
								sx={navBtnStyle(drawerOpen)}
							>
								Tienda
							</Button>

							<Box sx={{ position: 'relative' }}>
								<Button
									sx={navBtnStyle(drawerOpen)}
									component={Link}
									to='/Donaciones'
								>
									Donar
								</Button>
							</Box>

							<Button
								component={Link}
								to='/envivo'
								sx={navBtnStyle(drawerOpen)}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									{isLive && (
										<Box
											component='span'
											sx={{
												width: 10,
												height: 10,
												borderRadius: '50%',
												bgcolor: '#ff1744',
												animation: 'pulse 1s ease-in-out infinite',
											}}
										/>
									)}
									<span>En Vivo</span>
								</Box>
							</Button>

							{userRole === 'admin' && (
								<Button
									component={Link}
									to='/admin'
									onClick={() => setDrawerOpen(false)}
									sx={navBtnStyle(drawerOpen)}
								>
									Admin
								</Button>
							)}
						</Box>
					</Box>

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: { xs: 1, md: 2 },
							flexShrink: 0,
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: { xs: 1, md: 2 },
								flexShrink: 0,
							}}
						>
							{loadingUser ? (
								<CircularProgress
									size={28}
									sx={{ color: drawerOpen ? '#0c005a' : 'white' }}
								/>
							) : isLoggedIn ? (
								<UserAvatarMenu
									user={{
										name: avatarLetter,
										color: userColor,
										avatar: avatarUrl,
									}}
									avatarVer={avatarVer}
									onEditProfile={() => navigate('/perfil')}
									onLogout={handleLogout}
									drawerOpen={drawerOpen}
								/>
							) : (
								<Button
									component={Link}
									to='/login'
									onClick={() => setDrawerOpen(false)}
									sx={{
										backgroundColor: drawerOpen ? '#0c005a' : '#ffffff',
										color: drawerOpen ? '#ffffff' : '#0c005a',
										border: '2px solid #0c005a',
										fontWeight: 'bold',
										fontFamily: '"GroteskBold", sans-serif',
										textTransform: 'none',
										borderRadius: '6px',
										transition: 'all 0.3s ease',
										height: { xs: 36, md: 40 },
										px: { xs: 1.5, md: 2.5 },
										fontSize: { xs: '0.85rem', md: '0.9rem' },
										whiteSpace: 'nowrap',
										ml: { xs: 0.5, md: 1 },
										'&:hover': {
											color: '#e06c14',
											borderColor: '#e06c14',
											backgroundColor: drawerOpen ? '#0c005a' : '#ffffff',
										},
									}}
								>
									Iniciar Sesión
								</Button>
							)}
						</Box>

						<IconButton
							onClick={toggleDrawer}
							sx={{
								display: 'flex',
								alignItems: 'center',
								color: drawerOpen ? '#0c005a' : 'white',
								outline: 'none',
								'&:hover': { color: drawerOpen ? '#0c005a' : '#e06c14' },
								'&:hover .menu-text': {
									color: drawerOpen ? '#0c005a' : '#e06c14',
								},
								'&:hover .menu-icon': {
									color: drawerOpen ? '#0c005a' : '#e06c14',
								},
								'&:focus': { outline: 'none' },
								'&:focus-visible': { outline: 'none' },
							}}
						>
							{drawerOpen ? (
								<CloseIcon sx={{ color: '#0c005a' }} />
							) : (
								<MenuIcon sx={{ color: 'inherit' }} />
							)}
							<Typography
								className='menu-text'
								sx={{
									ml: 1,
									fontWeight: 'bold',
									fontFamily: '"GroteskBold", sans-serif',
									fontSize: { xs: 0, md: '1.4rem' },
									display: { xs: 'none', md: 'inline' },
									color: drawerOpen ? '#0c005a' : 'white',
								}}
							>
								Menú
							</Typography>
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>

			{/* Drawer superior */}
			<Drawer
				anchor='top'
				open={drawerOpen}
				onClose={toggleDrawer}
				ModalProps={{ keepMounted: true }}
				PaperProps={{
					sx: {
						mt: { xs: '74px', md: '90px' },
						zIndex: 1200,
						maxHeight: 'calc(100vh - 64px)',
						overflowY: 'auto',
						scrollbarWidth: 'none',
						'&::-webkit-scrollbar': { display: 'none' },
					},
				}}
			>
				<Box sx={{ width: '100%', p: 3 }}>
					<List>
						{/* Admin solo móvil */}
						{isCompactNav && userRole === 'admin' && (
							<ListItem
								button
								component={Link}
								to='/admin'
								onClick={handleCloseDrawer}
								sx={drawerItemSx}
							>
								<ListItemIcon sx={{ color: 'inherit' }}>
									<AdminPanelSettingsIcon />
								</ListItemIcon>
								<ListItemText
									primary='Panel de Administrador'
									primaryTypographyProps={{
										fontFamily: '"Franklin Gothic Medium", sans-serif',
										fontWeight: 'bold',
										fontSize: '0.95rem',
										color: 'inherit',
									}}
								/>
							</ListItem>
						)}

						{/* Sobre nosotros (móvil) */}
						{isCompactNav && (
							<>
								<ListItem
									button
									onClick={() => setMobileSubmenuOpen(prev => !prev)}
									sx={drawerItemSx}
								>
									<ListItemIcon sx={{ color: 'inherit' }}>
										<HistoryEduOutlinedIcon />
									</ListItemIcon>
									<ListItemText
										primary='Sobre Nosotros'
										primaryTypographyProps={{
											fontFamily: '"Franklin Gothic Medium", sans-serif',
											fontWeight: 'bold',
											fontSize: '0.95rem',
											color: 'inherit',
										}}
									/>
								</ListItem>

								{mobileSubmenuOpen && (
									<>
										<ListItem
											button
											component={Link}
											to='/historia'
											onClick={handleCloseDrawer}
											sx={drawerSubItemSx}
										>
											<ListItemIcon>
												<AutoStoriesOutlinedIcon />
											</ListItemIcon>
											<ListItemText
												primary='Historia'
												primaryTypographyProps={mobileTypography}
											/>
										</ListItem>
										<ListItem
											button
											component={Link}
											to='/Testimonio'
											onClick={handleCloseDrawer}
											sx={drawerSubItemSx}
										>
											<ListItemIcon>
												<FormatQuoteOutlinedIcon />
											</ListItemIcon>
											<ListItemText
												primary='Testimonios'
												primaryTypographyProps={mobileTypography}
											/>
										</ListItem>
										<ListItem
											button
											component={Link}
											to='/aliados'
											onClick={handleCloseDrawer}
											sx={drawerSubItemSx}
										>
											<ListItemIcon>
												<HandshakeOutlinedIcon />
											</ListItemIcon>
											<ListItemText
												primary='Aliados'
												primaryTypographyProps={mobileTypography}
											/>
										</ListItem>
										<ListItem
											button
											component={Link}
											to='/NuestroEquipo'
											onClick={handleCloseDrawer}
											sx={drawerSubItemSx}
										>
											<ListItemIcon>
												<SportsBaseballIcon />
											</ListItemIcon>
											<ListItemText
												primary='Nuestro Equipo'
												primaryTypographyProps={mobileTypography}
											/>
										</ListItem>
										<ListItem
											button
											component={Link}
											to='/categoria'
											onClick={handleCloseDrawer}
											sx={drawerSubItemSx}
										>
											<ListItemIcon>
												<CategoryOutlinedIcon />
											</ListItemIcon>
											<ListItemText
												primary='Categorías'
												primaryTypographyProps={mobileTypography}
											/>
										</ListItem>
									</>
								)}
							</>
						)}

						{/* Ítems base */}
						{baseMenuItems.map(item => (
							<ListItem
								key={item.text}
								button
								component={Link}
								to={item.path}
								onClick={() => setDrawerOpen(false)}
								sx={drawerItemSx}
							>
								<ListItemIcon sx={{ color: 'inherit' }}>
									{item.icon}
								</ListItemIcon>
								<ListItemText
									primary={item.text}
									primaryTypographyProps={{
										fontFamily: '"Franklin Gothic Medium", sans-serif',
										fontWeight: 'bold',
										fontSize: '0.95rem',
										color: 'inherit',
									}}
								/>
							</ListItem>
						))}

						{/* En vivo móvil */}
						{isCompactNav && (
							<ListItem
								button
								component={Link}
								to='/envivo'
								onClick={handleCloseDrawer}
								sx={{ ...drawerItemSx, pr: 6 }}
							>
								<ListItemIcon sx={{ color: 'inherit' }}>
									<LiveTvOutlinedIcon />
								</ListItemIcon>
								<ListItemText
									primary={
										<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
											{isLive && (
												<Box
													component='span'
													sx={{
														width: 8,
														height: 8,
														borderRadius: '50%',
														bgcolor: '#ff1744',
														animation: 'pulse 1s ease-in-out infinite',
													}}
												/>
											)}
											<span
												style={{
													fontFamily: '"Franklin Gothic Medium", sans-serif',
													fontWeight: 'bold',
													fontSize: '0.95rem',
													color: 'inherit',
												}}
											>
												En Vivo
											</span>
										</Box>
									}
								/>
							</ListItem>
						)}

						{/* Tienda móvil */}
						{isCompactNav && (
							<ListItem
								button
								component={Link}
								to='/tienda'
								onClick={handleCloseDrawer}
								sx={drawerItemSx}
							>
								<ListItemIcon sx={{ color: 'inherit' }}>
									<StorefrontIcon />
								</ListItemIcon>
								<ListItemText
									primary='Tienda'
									primaryTypographyProps={{
										fontFamily: '"Franklin Gothic Medium", sans-serif',
										fontWeight: 'bold',
										fontSize: '0.95rem',
										color: 'inherit',
									}}
								/>
							</ListItem>
						)}

						{/* Donar móvil */}
						<ListItem
							sx={{ justifyContent: 'center', mt: 3, display: { md: 'none' } }}
						>
							<Button
								component={Link}
								to='/donaciones'
								onClick={handleCloseDrawer}
								fullWidth
								sx={{
									backgroundColor: '#c62828',
									color: 'white',
									fontWeight: 'bold',
									fontSize: '0.95rem',
									fontFamily: '"GroteskBold", sans-serif',
									borderRadius: 1,
									maxWidth: { xs: '250px', sm: '300px' },
									mx: 'auto',
									'&:hover': { backgroundColor: '#b71c1c' },
								}}
							>
								Donar
							</Button>
						</ListItem>
					</List>
				</Box>
			</Drawer>
		</>
	);
}

// Estilos reutilizables para botones y menús de la barra de navegación
const navBtnStyle = drawerOpen => ({
	color: drawerOpen ? '#0c005a' : 'white',
	fontWeight: 'bold',
	fontSize: '1.4rem',
	fontFamily: 'GroteskBold, sans-serif',
	textTransform: 'none',
	whiteSpace: 'nowrap',
	px: { lg: 2, xl: 2.5 },
	lineHeight: 1.2,
	transition: 'color 0.3s ease',
	'&:hover': {
		color: '#e06c14',
	},
	'& .MuiListItemIcon-root': {
		color: drawerOpen ? '#0c005a' : 'inherit',
		transition: 'color 0.3s ease',
	},
});

const subMenuStyle = {
	fontFamily: '"GroteskBold", sans-serif',
	fontWeight: 'bold',
	fontSize: '1.05rem',
	px: 3,
	py: 1.5,
	color: 'white',
	textDecoration: 'none',
	backgroundColor: '#e06c14',
	'&:hover': {
		backgroundColor: '#e06c14',
	},
	borderBottom: '1px solid rgba(255,255,255,0.3)',
	'&:last-of-type': { borderBottom: 'none' },
};

const submenuBoxStyle = {
	position: 'absolute',
	top: '100%',
	left: 0,
	backgroundColor: '#e06c14',
	color: 'white',
	borderRadius: '8px',
	mt: 2,
	zIndex: 1500,
	minWidth: 200,
	paddingY: 1,
	'&::before': {
		content: '""',
		position: 'absolute',
		top: -10,
		left: '30px',
		borderLeft: '10px solid transparent',
		borderRight: '10px solid transparent',
		borderBottom: '10px solid #e06c14',
	},
};

const mobileTypography = {
	fontFamily: '"Franklin Gothic Medium", sans-serif',
	fontWeight: 'bold',
	fontSize: '0.85rem',
	color: '#0c005a',
};
