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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';

import logo from '/Images/Logo-pilotos.png';
import { Link } from 'react-router-dom';

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

//exports funciones navbar
export default function CustomNavbar() {
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [submenuOpen, setSubmenuOpen] = React.useState(false);
	const [donarOpen, setDonarOpen] = React.useState(false);
	const [mobileSubmenuOpen, setMobileSubmenuOpen] = React.useState(false);
	const submenuTimer = React.useRef(null);
	const donarTimer = React.useRef(null);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const toggleDrawer = () => setDrawerOpen(prev => !prev);

	const handleSubmenuEnter = () => {
		clearTimeout(submenuTimer.current);
		setSubmenuOpen(true);
	};

	const handleSubmenuLeave = () => {
		submenuTimer.current = setTimeout(() => setSubmenuOpen(false), 200);
	};

	const handleDonarEnter = () => {
		clearTimeout(donarTimer.current);
		setDonarOpen(true);
	};

	const handleDonarLeave = () => {
		donarTimer.current = setTimeout(() => setDonarOpen(false), 200);
	};

	return (
		<>
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
						justifyContent: 'space-between',
						alignItems: 'center',
						minHeight: '90px !important',
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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
								display: { xs: 'none', md: 'flex' },
								gap: 3,
								position: 'relative',
							}}
						>
							{/* Nuestra Historia Submenu */}
							<Box
								onMouseEnter={handleSubmenuEnter}
								onMouseLeave={handleSubmenuLeave}
								sx={{ position: 'relative' }}
							>
								<Button sx={navBtnStyle(drawerOpen)}>Nuestra Historia</Button>
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
											to='/acercade'
											onClick={() => setDrawerOpen(false)}
											sx={subMenuStyle}
										>
											Acerca de
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

							{/* Donar Submenu */}
							<Box
								onMouseEnter={handleDonarEnter}
								onMouseLeave={handleDonarLeave}
								sx={{ position: 'relative' }}
							>
								<Button sx={navBtnStyle(drawerOpen)}>Donar</Button>
								{donarOpen && (
									<Box sx={{ ...submenuBoxStyle }}>
										<MenuItem
											component={Link}
											to='/donar-indumentaria'
											sx={subMenuStyle}
										>
											Donar Indumentaria/Equipo
										</MenuItem>
										<MenuItem
											component={Link}
											to='/donar-dinero'
											sx={subMenuStyle}
										>
											Donar Dinero
										</MenuItem>
									</Box>
								)}
							</Box>
							<Button
								component={Link}
								to='/envivo'
								onClick={() => setDrawerOpen(false)}
								sx={navBtnStyle(drawerOpen)}
							>
								En Vivo
							</Button>
						</Box>
					</Box>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Button
							component={Link}
							to='/login'
							variant='text'
							onClick={() => setDrawerOpen(false)}
							sx={{
								color: drawerOpen ? '#0c005a' : 'white',
								borderColor: drawerOpen ? '#0c005a' : 'white',
								fontWeight: 'bold',
								fontSize: '1.4rem',
								fontFamily: '"GroteskBold", sans-serif',
								textTransform: 'none',
								height: '40px',
								px: 2.5,
								borderWidth: '2px',
								'&:hover': {
									color: '#e06c14',
									borderColor: '#e06c14',
									backgroundColor: 'transparent',
								},
							}}
						>
							Iniciar Sesión
						</Button>

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
									fontSize: '1.4rem',
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
						{/* SubMenú nuestra historia móvil*/}
						{isMobile && (
							<>
								<ListItem
									button
									onClick={() => setMobileSubmenuOpen(prev => !prev)}
									sx={{
										textDecoration: 'none',
										color: 'inherit',
										'&:hover .MuiListItemText-primary': { color: '#e06c14' },
										'&:hover .MuiListItemIcon-root': { color: '#e06c14' },
									}}
								>
									<ListItemIcon sx={{ color: 'inherit' }}>
										<HistoryEduOutlinedIcon />
									</ListItemIcon>
									<ListItemText
										primary='Nuestra Historia'
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
											sx={mobileSubItem}
										>
											<ListItemText
												primary='Historia'
												primaryTypographyProps={mobileTypography}
											/>
										</ListItem>
										<ListItem
											button
											component={Link}
											to='/acercade'
											sx={mobileSubItem}
										>
											<ListItemText
												primary='Acerca de'
												primaryTypographyProps={mobileTypography}
											/>
										</ListItem>
										<ListItem
											button
											component={Link}
											to='/aliados'
											sx={mobileSubItem}
										>
											<ListItemText
												primary='Aliados'
												primaryTypographyProps={mobileTypography}
											/>
										</ListItem>
										<ListItem
											button
											component={Link}
											to='/NuestroEquipo'
											sx={mobileSubItem}
										>
											<ListItemText
												primary='Nuestro Equipo'
												primaryTypographyProps={mobileTypography}
											/>
										</ListItem>
										<ListItem
											button
											component={Link}
											to='/categoria'
											sx={mobileSubItem}
										>
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
								{/* Contáctanos solo en móvil */}
								<ListItem
									button
									component={Link}
									to='/contacto'
									sx={{
										textDecoration: 'none',
										color: 'inherit',
										'&:hover .MuiListItemText-primary': { color: '#e06c14' },
										'&:hover .MuiListItemIcon-root': { color: '#e06c14' },
									}}
								>
									<ListItemIcon sx={{ color: 'inherit' }}>
										<CallIcon />
									</ListItemIcon>
									<ListItemText
										primary='Contáctanos'
										primaryTypographyProps={{
											fontFamily: '"Franklin Gothic Medium", sans-serif',
											fontWeight: 'bold',
											fontSize: '0.95rem',
											color: 'inherit',
										}}
									/>
								</ListItem>

								{/* En Vivo solo en móvil*/}
								<ListItem
									button
									component={Link}
									to='/envivo'
									sx={{
										textDecoration: 'none',
										color: 'inherit',
										'&:hover .MuiListItemText-primary': { color: '#e06c14' },
										'&:hover .MuiListItemIcon-root': { color: '#e06c14' },
									}}
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
								sx={{
									textDecoration: 'none',
									color: 'inherit',
									'&:hover .MuiListItemText-primary': { color: '#e06c14' },
									'&:hover .MuiListItemIcon-root': { color: '#e06c14' },
								}}
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
