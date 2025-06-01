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
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import StorefrontIcon from '@mui/icons-material/Storefront';

import logo from '../Ima/Logo-pilotos.png';
import { Link } from 'react-router-dom';

const baseMenuItems = [
	{ text: 'Categoria', icon: <GroupsRoundedIcon />, path: '/categoria' },
	{ text: 'Jugadores', icon: <EmojiPeopleRoundedIcon />, path: '/jugadores' },
	{ text: 'Calendario', icon: <CalendarMonthIcon />, path: '/calendario' },
	{ text: 'Noticias y Eventos', icon: <EventIcon />, path: '/eventos' },
	{ text: 'Logros', icon: <EmojiEventsIcon />, path: '/logros' },
	{ text: 'Contactanos', icon: <CallIcon />, path: '/contacto' },
	{ text: 'Voluntariado', icon: <PersonAddIcon />, path: '/voluntariado' },
];

export default function CustomNavbar() {
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [submenuOpen, setSubmenuOpen] = React.useState(false);
	const [donarOpen, setDonarOpen] = React.useState(false);
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
				sx={{ backgroundColor: '#0c005a', zIndex: 1301, height: '90px'}}
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
								<Button sx={navBtnStyle}>Nuestra Historia</Button>
								{submenuOpen && (
									<Box
										sx={submenuBoxStyle}
										onMouseEnter={() => setSubmenuOpen(true)}
										onMouseLeave={() => setSubmenuOpen(false)}
									>
										<MenuItem component={Link} to='/historia' sx={subMenuStyle}>
											Historia
										</MenuItem>
										<MenuItem component={Link} to='/acercade' sx={subMenuStyle}>
											Acerca de
										</MenuItem>
										<MenuItem component={Link} to='/aliados' sx={subMenuStyle}>
											Aliados
										</MenuItem>
									</Box>
								)}
							</Box>

							<Button component={Link} to='/quehacemos' sx={navBtnStyle}>
								Lo Que Hacemos
							</Button>
							<Button component={Link} to='/tienda' sx={navBtnStyle}>
								Tienda
							</Button>

							{/* DONAR Submenu */}
							<Box 
								onMouseEnter={handleDonarEnter}
								onMouseLeave={handleDonarLeave}
								sx={{ position: 'relative' }}
							>
								<Button sx={navBtnStyle}>Donar</Button>
								{donarOpen && (
									<Box
										sx={{ ...submenuBoxStyle, right: 'auto', left: 0 }}
										onMouseEnter={() => setDonarOpen(true)}
										onMouseLeave={() => setDonarOpen(false)}
									>
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
						</Box>
					</Box>

					<IconButton
						onClick={toggleDrawer}
						color="inherit"
						disableRipple
						disableFocusRipple
						sx={{
							'&:hover': { color: '#e06c14' },
							outline: 'none',
							'&:focus': { outline: 'none' },
							'&:focus-visible': { outline: 'none' },
						}}
					>
						{drawerOpen ? <CloseIcon /> : <MenuIcon />}
						<Typography
							sx={{
								ml: 1,
								fontWeight: 'bold',
								fontFamily: '"GroteskBold", sans-serif',
								fontSize: '1.4rem',
							}}
						>
							Menú
						</Typography>
					</IconButton>
				</Toolbar>
			</AppBar>

			{/* Drawer móvil */}
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
				<Box
					sx={{ width: '100%', p: 3 }}
					role='presentation'
					onClick={toggleDrawer}
					onKeyDown={toggleDrawer}
				>
					<List>
						{baseMenuItems.map(item => (
							<ListItem
								key={item.text}
								button
								component={Link}
								to={item.path}
								sx={{
									textDecoration: 'none',
									color: 'inherit',
									'&:hover .MuiListItemText-primary': { color: '#e06c14' },
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
							<ListItem
								button
								component={Link}
								to='/tienda'
								sx={{
									textDecoration: 'none',
									color: 'inherit',
									'&:hover .MuiListItemText-primary': { color: '#e06c14' },
								}}
							>
								<ListItemIcon sx={{ color: 'inherit' }}>
									<StorefrontIcon />
								</ListItemIcon>
								<ListItemText
									primary='Tienda'
									primaryTypographyProps={{
										fontFamily: '"Bebas Neue", sans-serif',
										fontWeight: 'bold',
										fontSize: '0.95rem',
									}}
								/>
							</ListItem>
						)}
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

// 🎨 Estilos Reutilizables
const navBtnStyle = {
	color: 'white',
	fontWeight: 'bold',
	fontSize: '1.4rem',
	fontFamily: 'GroteskBold, sans-serif',
	'&:hover': { color: '#e06c14' },
	textTransform: 'none',
};

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
