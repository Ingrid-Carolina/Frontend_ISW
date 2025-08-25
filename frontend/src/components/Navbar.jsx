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
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import axios from 'axios';
axios.defaults.withCredentials = true; // <-- importante para logout y rutas protegidas
import logo from '/Images/Logo-pilotos.png';
import { Link } from 'react-router-dom';
import { api } from '../api/api';

{
	/* Items de la navbarbar*/
}
const baseMenuItems = [
	{ text: 'Calendario', icon: <CalendarMonthIcon />, path: '/calendario' },
	{ text: 'Noticias y Eventos', icon: <EventIcon />, path: '/eventos' },
	{ text: 'Logros', icon: <EmojiEventsIcon />, path: '/logros' },
	{ text: 'Voluntariado', icon: <PersonAddIcon />, path: '/voluntariado' },
	{ text: 'Contacto', icon: <CallIcon />, path: '/Contacto' },
];

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

	// Generamos el src con cache-busting
	const cacheBustedSrc =
		user.avatar && !imgError
			? `${user.avatar}${user.avatar.includes('?') ? '&' : '?'}v=${avatarVer}`
			: undefined;

	const handleClick = event => {
		if (anchorEl) {
			setAnchorEl(null);
		} else {
			setAnchorEl(event.currentTarget);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

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
					{!cacheBustedSrc && user.name?.charAt(0).toUpperCase()}
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
						mt: 1.0,
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
						'&:hover': {
							color: '#e06c14',
						},
						'& svg': {
							color: 'inherit',
						},
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
						'&:hover': {
							color: '#e06c14',
						},
						'& svg': {
							color: 'inherit',
						},
					}}
				>
					<LogoutIcon fontSize='small' />
					Cerrar sesión
				</MenuItem>
			</Menu>
		</>
	);
};

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

//exports funciones navbar
export default function CustomNavbar() {
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [submenuOpen, setSubmenuOpen] = React.useState(false);
	const [mobileSubmenuOpen, setMobileSubmenuOpen] = React.useState(false);
	const submenuTimer = React.useRef(null);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const [avatarUrl, setAvatarUrl] = React.useState(
		localStorage.getItem('userAvatar') || '',
	);
	const [avatarVer, setAvatarVer] = React.useState(0); // versión para cache-busting

	const [userName, setUserName] = React.useState(
		localStorage.getItem('userName') ?? '',
	);
	const [userRole, setUserRole] = React.useState(
		localStorage.getItem('userRole') ?? '',
	);

	// Derivados
	const isLoggedIn = !!userName;
	const avatarLetter = (userName || 'U').charAt(0).toUpperCase();

	//heradr colores de botones navbar movil
	const drawerItemSx = {
		textDecoration: 'none',
		color: '#0c005a', // 🔵 texto azul
		'&:hover .MuiListItemText-primary': { color: '#e06c14' },
		'&:hover .MuiListItemIcon-root': { color: '#e06c14' },
	};

	// colores para los subitems del drawer movil
	const drawerSubItemSx = {
		pl: 6, // indent para subitems
		color: '#0c005a',
		'& .MuiListItemIcon-root': {
			minWidth: 36,
			color: 'inherit',
		},
		'&:hover .MuiListItemText-primary': { color: '#e06c14' },
		'&:hover .MuiListItemIcon-root': { color: '#e06c14' },
	};

	// Escuchar cuando el perfil se actualiza (misma pestaña)
	React.useEffect(() => {
		const onProfileUpdated = e => {
			const url = e?.detail?.avatar || '';
			localStorage.setItem('userAvatar', url);
			setAvatarUrl(url);
			setAvatarVer(Date.now()); // cambia la versión para forzar recarga
		};
		window.addEventListener('profile:updated', onProfileUpdated);

		// También escuchar cambios en storage (otras pestañas)
		const onStorage = () => {
			const url = localStorage.getItem('userAvatar') || '';
			setAvatarUrl(url);
			setAvatarVer(Date.now());
		};
		window.addEventListener('storage', onStorage);

		return () => {
			window.removeEventListener('profile:updated', onProfileUpdated);
			window.removeEventListener('storage', onStorage);
		};
	}, []);

	React.useEffect(() => {
		const cargarPerfil = async () => {
			if (!isLoggedIn) {
				setAvatarUrl('');
				return;
			}
			try {
				const res = await api.get('/auth/obtenerperfil');
				const perfil = Array.isArray(res.data) ? res.data[0] : res.data;
				if (perfil?.avatar) {
					localStorage.setItem('userAvatar', perfil.avatar);
					setAvatarUrl(perfil.avatar);
					setAvatarVer(Date.now());
				}
			} catch {
				setAvatarUrl('');
			}
		};
		cargarPerfil();
	}, [isLoggedIn]);

	// Helper de color
	const generateColorFromName = React.useCallback(name => {
		const colors = ['#3f51b5', '#f44336', '#4caf50', '#ff9800', '#009688'];
		const ch = name?.charCodeAt(0) ?? 'U'.charCodeAt(0);
		return colors[ch % colors.length];
	}, []);

	const userColor = generateColorFromName(avatarLetter);

	// Mantener la navbar sincronizada con cambios en localStorage
	React.useEffect(() => {
		const sync = () => {
			setUserName(localStorage.getItem('userName') ?? '');
			setUserRole(localStorage.getItem('userRole') ?? '');
		};
		window.addEventListener('storage', sync);
		sync();
		return () => window.removeEventListener('storage', sync);
	}, []);

	const toggleDrawer = () => setDrawerOpen(prev => !prev);

	const handleSubmenuEnter = () => {
		clearTimeout(submenuTimer.current);
		setSubmenuOpen(true);
	};

	//funcion para cerrar el drawer movil
	const handleCloseDrawer = React.useCallback(() => setDrawerOpen(false), []);

	const handleSubmenuLeave = () => {
		submenuTimer.current = setTimeout(() => setSubmenuOpen(false), 200);
	};

	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await api.post('/auth/signout');
			localStorage.removeItem('userRole');
			localStorage.removeItem('userName');
			localStorage.removeItem('userEmail');
			alert('Sesion cerrada correctamente.');
			navigate('/');
			//Refrescar la página para limpiar el estado visual y memoria React
			setTimeout(() => {
				window.location.reload();
			}, 100);
		} catch (error) {
			console.error('Error al cerrar sesión:', error);
			alert('Error al cerrar sesión. Inténtalo de nuevo.');
		}
	};

	return (
		<>
			<AppBar
				position='fixed'
				elevation={0}
				sx={{
					backgroundColor: drawerOpen ? '#ffffff' : 'rgba(12, 0, 90, 0.9)',
					zIndex: 1301,
					height: { xs: 72, md: 90 },
					transition: 'background-color 0.3s ease',
				}}
			>
				<Toolbar
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						minHeight: { xs: '72px !important', md: '90px !important' },
						pt: { xs: 'max(8px, env(safe-area-inset-top))', md: 0 }, 
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
								sx={{ height: 50, cursor: 'pointer' }}
							/>
						</Link>

						<Box
							sx={{
								display: { xs: 'none', lg: 'flex' },
								gap: { lg: 3, xl: 4 },
								position: 'relative',
							}}
						>
							{/* Nuestra Historia Submenu */}
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
							{/* Boton donar*/}
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
								onClick={() => setDrawerOpen(false)}
								sx={navBtnStyle(drawerOpen)}
							>
								En Vivo
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
						{isLoggedIn ? (
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

						<IconButton
							onClick={toggleDrawer}
							sx={{
								display: 'flex',
								alignItems: 'center',
								color: drawerOpen ? '#0c005a' : 'white',
								outline: 'none',
								'&:hover': {
									color: drawerOpen ? '#0c005a' : '#e06c14',
								},
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

			{/* Drawer*/}
			<Drawer
				anchor='top'
				open={drawerOpen}
				onClose={toggleDrawer}
				ModalProps={{ keepMounted: true }}
				PaperProps={{
					sx: {
						mt: '64px',
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
						{/* Admin solo en móvil*/}
						{isMobile && userRole === 'admin' && (
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

						{/* SubMenú nuestra historia móvil*/}
						{isMobile && (
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
						{/*items del drawr estilos o acciones*/}
						{baseMenuItems.map(item => (
							<ListItem
								key={item.text}
								button
								component={Link}
								to={item.path}
								onClick={() => setDrawerOpen(false)}
								sx={{
									textDecoration: 'none',
									color: '#0c005a',
									'&:hover .MuiListItemText-primary': { color: '#e06c14' },
									'&:hover .MuiListItemIcon-root': { color: '#e06c14' },
								}}
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

						{isMobile && (
							<>
								{/* En Vivo solo en móvil*/}
								<ListItem
									button
									component={Link}
									to='/envivo'
									onClick={handleCloseDrawer}
									sx={drawerItemSx}
								>
									<ListItemIcon sx={{ color: 'inherit' }}>
										<LiveTvOutlinedIcon />{' '}
									</ListItemIcon>
									<ListItemText
										primary='En Vivo'
										primaryTypographyProps={{
											fontFamily: '"Franklin Gothic Medium", sans-serif',
											fontWeight: 'bold',
											fontSize: '0.95rem',
											color: 'inherit',
										}}
									/>
								</ListItem>
							</>
						)}

						{/* Tienda solo en móvil */}
						{isMobile && (
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

						{/* Donar button móvil */}
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

// Estilos reutilizables
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

const mobileSubItem = {
	pl: 7,
	py: 0.5,
	width: '100%',
	'&:hover .MuiListItemText-primary': {
		color: '#e06c14',
	},
};

const mobileTypography = {
	fontFamily: '"Franklin Gothic Medium", sans-serif',
	fontWeight: 'bold',
	fontSize: '0.85rem',
	color: '#0c005a',
};
