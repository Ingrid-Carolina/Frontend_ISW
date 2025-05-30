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

const navLinks = [
	{ text: 'NUESTRA HISTORIA', path: '/historia' },
	{ text: 'LO QUE HACEMOS', path: '/quehacemos' },
	{ text: 'TIENDA', path: '/tienda' },
];

export default function CustomNavbar() {
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [donarAnchorEl, setDonarAnchorEl] = React.useState(null);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const toggleDrawer = () => setDrawerOpen(prev => !prev);
	const handleDonarClick = event => setDonarAnchorEl(event.currentTarget);
	const handleDonarClose = () => setDonarAnchorEl(null);

	return (
		<>
			<AppBar
				position='fixed'
				sx={{ backgroundColor: '#0c005a', zIndex: 1301 }}
			>
				<Toolbar
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
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

						<Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
							{navLinks.map(link => (
								<Button
									key={link.text}
									component={Link}
									to={link.path}
									sx={{
										color: 'white',
										fontWeight: 'bold',
										fontSize: '0.9rem',
										fontFamily: '"Bebas Neue", sans-serif',
										'&:hover': { color: '#c62828' },
									}}
								>
									{link.text}
								</Button>
							))}

							<Button
								onClick={handleDonarClick}
								sx={{
									color: 'white',
									fontWeight: 'bold',
									fontSize: '0.9rem',
									fontFamily: '"Bebas Neue", sans-serif',
									'&:hover': { color: '#c62828' },
								}}
							>
								DONAR
							</Button>

							<Menu
								anchorEl={donarAnchorEl}
								open={Boolean(donarAnchorEl)}
								onClose={handleDonarClose}
								anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
								transformOrigin={{ vertical: 'top', horizontal: 'left' }}
								sx={{ zIndex: 1400 }}
								PaperProps={{
									sx: {
										backgroundColor: '#0c005a',
										color: 'white',
										borderRadius: 1,
										mt: 1,
									},
								}}
								MenuListProps={{ disablePadding: true }}
							>
								<MenuItem
									onClick={handleDonarClose}
									sx={{
										fontFamily: '"Bebas Neue", sans-serif',
										fontWeight: 'bold',
										fontSize: '0.95rem',
										'&:hover': { backgroundColor: '#0c005a', color: '#c62828' },
									}}
								>
									Donar Indumentaria/Equipo
								</MenuItem>
								<MenuItem
									onClick={handleDonarClose}
									sx={{
										fontFamily: '"Bebas Neue", sans-serif',
										fontWeight: 'bold',
										fontSize: '0.95rem',
										'&:hover': { backgroundColor: '#0c005a', color: '#c62828' },
									}}
								>
									Donar Dinero
								</MenuItem>
							</Menu>
						</Box>
					</Box>

					{/* Drawer Button */}
					<IconButton
						onClick={toggleDrawer}
						color='inherit'
						sx={{ '&:hover': { color: '#c62828' } }}
					>
						{drawerOpen ? <CloseIcon /> : <MenuIcon />}
						<Typography
							sx={{
								ml: 1,
								fontWeight: 'bold',
								fontFamily: '"Bebas Neue", sans-serif',
							}}
						>
							MENÚ
						</Typography>
					</IconButton>
				</Toolbar>
			</AppBar>

			{/* Drawer */}
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
						{/* Menu items comunes */}
						{baseMenuItems.map(item => (
							<ListItem
								key={item.text}
								button
								component={Link}
								to={item.path}
								sx={{
									textDecoration: 'none',
									color: 'inherit',
									'&:hover .MuiListItemText-primary': {
										color: '#c62828',
									},
								}}
							>
								<ListItemIcon sx={{ color: 'inherit' }}>
									{item.icon}
								</ListItemIcon>
								<ListItemText
									primary={item.text}
									primaryTypographyProps={{
										fontFamily: '"Bebas Neue", sans-serif',
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
									'&:hover .MuiListItemText-primary': {
										color: '#c62828',
									},
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
									fontFamily: '"Bebas Neue", sans-serif',
									borderRadius: 1,
									maxWidth: { xs: '250px', sm: '300px' },
									mx: 'auto',
									'&:hover': { backgroundColor: '#b71c1c' },
								}}
							>
								DONAR
							</Button>
						</ListItem>
					</List>
				</Box>
			</Drawer>
		</>
	);
}
