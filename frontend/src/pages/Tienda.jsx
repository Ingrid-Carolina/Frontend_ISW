import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
	Box,
	Container,
	Drawer,
	AppBar,
	Toolbar,
	TextField,
	IconButton,
	Button,
	Badge,
	Typography,
	Paper,
	List,
	ListItem,
	Divider,
	Snackbar,
	Alert,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Stack,
	OutlinedInput,
} from '@mui/material';
import {
	Search as SearchIcon,
	ShoppingCart as ShoppingCartIcon,
	Close as CloseIcon,
	Add as AddIcon,
	Remove as RemoveIcon,
	Delete as DeleteIcon,
	Add as Add,
} from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';

import  jsPDF  from 'jspdf';
import autoTable from 'jspdf-autotable';


import { api } from '../api/api';

import EditableText from '../components/EditableText'; // Importar el componente


const TALLAS = [
	'6',
	'8',
	'10',
	'12',
	'14',
	'16',
	'XS',
	'S',
	'M',
	'L',
	'XL',
	'2XL',
];

// Helpers
const productoRequiereTalla = producto => {
	const nombre = (producto?.nombre_producto || '').toLowerCase();
	return nombre.includes('camisa') || nombre.includes('camiseta');
};

const getPrecioByTalla = (producto, talla) => {
	if (!producto) return 0;
	const base = Number(producto.precio_unitario) || 0;
	if (!talla) return base;
	const tallasNino = ['6', '8', '10', '12'];
	return tallasNino.includes(talla) ? base - 50 : base;
};

const buscarPorCategoria = (producto, searchTerm) => {
	const nombre = (producto.nombre_producto || '').toLowerCase();
	const categorias = {
		camisa: ['camisa', 'camiseta'],
		camiseta: ['camisa', 'camiseta'],
		gorra: ['gorra', 'gorras'],
		gorras: ['gorra', 'gorras'],
		bandera: ['bandera', 'banderas', 'banderin', 'banderines'],
		niño: ['niño', 'niña', 'infantil', 'kid'],
		local: ['local', 'casa', 'home'],
		visita: ['visita', 'visitante', 'away'],
		angelito: ['angelito', 'angelitos', 'fundacion'],
		conmemorativa: ['conmemorativa', 'especial', 'edicion'],
	};
	for (const [termino, sinonimos] of Object.entries(categorias)) {
		if (searchTerm.includes(termino)) {
			return sinonimos.some(s => nombre.includes(s));
		}
	}
	return false;
};

export default function Tienda() {
	// Estado UI
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedSizes, setSelectedSizes] = useState({});
	const [cartItems, setCartItems] = useState([]);
	const [cartModalOpen, setCartModalOpen] = useState(false);
	const [bannerMsg, setBannerMsg] = useState('');
	const [bannerType, setBannerType] = useState('success');
	const [showBanner, setShowBanner] = useState(false);
	const [productos, setProductos] = useState([]);
	const [loadingProductos, setLoadingProductos] = useState(false);
	const [errorProductos, setErrorProductos] = useState(null);
	const contentRef= useRef();

	const head = [['Producto', 'Talla', 'Cantidad', 'Precio Unitario', 'Precio Total']];

const body = cartItems.map(item => {
  const unit = getPrecioByTalla(item, item.talla);
  return [
    item.nombre_producto,
    item.talla || '-',
    item.cantidad,
    `L.${unit.toFixed(2)}`,
    `L.${(unit * item.cantidad).toFixed(2)}`
  ];
});


const generateFacturaPDF = (idorden) => {
  const doc = new jsPDF();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Factura del Cliente', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-HN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`, 14, 30);

  doc.text('PILOTOS FAH. Campo de la Fuerza Aérea Hondureña.', 14, 38);

  autoTable(doc, {
    startY: 50,
    head,
    body,
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 10 },
    headStyles: { fillColor: [44, 26, 153], textColor: 255 },
    margin: { left: 14, right: 14 },
  });

  const finalY = doc.lastAutoTable.finalY || 60;

  const total = cartItems.reduce((acc, item) => {
    const unit = getPrecioByTalla(item, item.talla);
    return acc + unit * item.cantidad;
  }, 0);
  const isv = total * 0.15;
  const subtotal = total - isv;

  doc.setFontSize(12);
  doc.text(`Subtotal: L.${subtotal.toFixed(2)}`, 14, finalY + 10);
  doc.text(`I.S.V 15%: L.${isv.toFixed(2)}`, 14, finalY + 18);
  doc.text(`Total a Pagar: L.${total.toFixed(2)}`, 14, finalY + 26);

  doc.setFontSize(10);
  doc.text('Esta factura debera ser cancelada a la siguiente cuenta:', doc.internal.pageSize.getWidth() / 2, finalY + 40, { align: 'center' });

  doc.text('Numero de Cuenta: 748728881', 14, finalY + 50);
  doc.text('Banco: BAC', 14, finalY + 56);
  doc.text('Nombre: Melissa Rosales', 14, finalY + 62);

  doc.setTextColor(255, 0, 0);
  doc.text('Esta factura es necesaria para reclamar su producto en el punto de entrega. Por favor, no la pierda.', doc.internal.pageSize.getWidth() / 2, finalY + 80, { align: 'center' });

  doc.save(`Orden-${idorden}.pdf`);
};


	


// NUEVO: Estado para textos editables
	const [textos, setTextos] = useState({});

	// Menú contextual por tarjeta
	const [menuAnchorEl, setMenuAnchorEl] = useState(null);
	const [menuProduct, setMenuProduct] = useState(null);

	// Edit dialog
	const [editOpen, setEditOpen] = useState(false);
	const [editFormData, setEditFormData] = useState({
		idproducto: null,
		nombre_producto: '',
		descripcion: '',
		precio_unitario: '',
		cantidad: '',
		talla: '',
	});
	const [editErrors, setEditErrors] = useState({});
	const [editSaving, setEditSaving] = useState(false);

	// Delete dialog
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleteProduct, setDeleteProduct] = useState(null);

	// Form Dialog
	const [addOpen, setAddOpen] = useState(false);
	const [formData, setFormData] = useState({
		nombre_producto: '',
		descripcion: '',
		precio_unitario: '',
		cantidad: '',
		talla: '',
	});
	const [formErrors, setFormErrors] = useState({});
	const [saving, setSaving] = useState(false);

	// Rol desde backend (no localStorage)
	const [isAdmin, setIsAdmin] = useState(false);
	

//función para cargar textos editables
const fetchTextos = async () => {
    try {
        console.log('🔍 TIENDA: Iniciando carga de textos...');
        console.log('🔍 TIENDA: URL:', '/auth/tienda/textos');
        
        const res = await api.get('/auth/tienda/textos', {
            withCredentials: true,
            skipAuthRedirect: true,
        });
        
        console.log('📦 TIENDA: Status:', res.status);
        console.log('📦 TIENDA: Response completa:', res);
        console.log('📦 TIENDA: Response data:', res.data);
        
        if (res.data.success) {
            console.log('✅ TIENDA: Textos cargados exitosamente:', res.data.data);
            setTextos(res.data.data);
        } else {
            console.error('❌ TIENDA: Success = false:', res.data);
        }
    } catch (error) {
        console.error('❌ TIENDA: Error completo:', error);
        console.error('❌ TIENDA: Error response:', error.response);
        console.error('❌ TIENDA: Error message:', error.message);
        if (error.response) {
            console.error('❌ TIENDA: Status:', error.response.status);
            console.error('❌ TIENDA: Status text:', error.response.statusText);
            console.error('❌ TIENDA: Data:', error.response.data);
        }
    }
};
//  Función para guardar textos editables
	const handleTextSave = async (clave, nuevoTexto) => {
    try {
        console.log('💾 TIENDA: Guardando texto:', { clave, nuevoTexto });
        
        const res = await api.put('/auth/tienda/textos', {
            clave,
            valor: nuevoTexto
        }, {
            withCredentials: true
        });

        console.log('📤 TIENDA: Respuesta de guardado:', res);

        if (res.data.success) {
            setBannerMsg('Texto actualizado correctamente');
            setBannerType('success');
            setShowBanner(true);
            fetchTextos(); // Recargar textos
        } else {
            console.error('❌ TIENDA: Error en respuesta:', res.data);
            setBannerMsg('Error al actualizar el texto');
            setBannerType('error');
            setShowBanner(true);
        }
    } catch (error) {
        console.error('❌ TIENDA: Error al guardar:', error);
        setBannerMsg('Error al guardar el texto');
        setBannerType('error');
        setShowBanner(true);
    }
};
	useEffect(() => {
		const checkRole = async () => {
			try {
				const r = await api.get('/auth/obtenerperfil', {
					withCredentials: true,
					skipAuthRedirect: true,
				});
				const p = Array.isArray(r.data) ? r.data[0] : r.data;
				const role = String(p?.rol || '').toLowerCase();
				setIsAdmin(role === 'admin');
			} catch {
				setIsAdmin(false);
			}
		};
		checkRole();

		fetchTextos();

		const onAuthRefresh = () => {
			checkRole(); 
			fetchTextos();

		};
		window.addEventListener('auth:refresh', onAuthRefresh);
		return () => window.removeEventListener('auth:refresh', onAuthRefresh);
	}, []);

	const isShirt = useMemo(() => {
		const n = (formData.nombre_producto || '').toLowerCase();
		return n.includes('camisa') || n.includes('camiseta');
	}, [formData.nombre_producto]);

	const handleClose = () => {
		if (saving) return;
		setAddOpen(false);
		setFormErrors({});
	};

	const handleChangeForm = field => e => {
		const value = e.target.value;
		setFormData(s => ({ ...s, [field]: value }));
	};

	const validateForm = () => {
		const e = {};
		if (!formData.nombre_producto?.trim()) e.nombre_producto = 'Requerido';
		if (
			formData.precio_unitario === '' ||
			isNaN(Number(formData.precio_unitario))||formData.precio_unitario<1
		)
			e.precio_unitario = 'Precio inválido';
		if (formData.cantidad === '' || isNaN(Number(formData.cantidad))||formData.cantidad<0) 
			e.cantidad = 'Cantidad inválida';
		if (isShirt && !formData.talla) e.talla = 'Selecciona una talla';
		setFormErrors(e);
		return Object.keys(e).length === 0;
	};

	const handleSubmit = async e => {
		e.preventDefault();
		if (!validateForm()) return;
		setSaving(true);
		try {
			const payload = {
				nombre_producto: formData.nombre_producto.trim(),
				descripcion: formData.descripcion?.trim() || null,
				precio_unitario: Number(formData.precio_unitario),
				cantidad: Number(formData.cantidad),
				talla: isShirt ? formData.talla : null,
			};

			const { data } = await api.post('/auth/tienda/agregarproducto', payload);
			const nuevo = data?.producto
				? {
						idproducto: data.producto.idproducto,
						nombre_producto: data.producto.nombre_producto,
						descripcion: data.producto.descripcion,
						precio_unitario: data.producto.precio_unitario,
						cantidad: data.producto.cantidad,
						talla: data.producto.talla,
					}
				: { idproducto: Date.now(), ...payload };

			setProductos(prev => [nuevo, ...prev]);

			setBannerMsg('Producto agregado con éxito');
			setBannerType('success');
			setShowBanner(true);

			setFormData({
				nombre_producto: '',
				descripcion: '',
				precio_unitario: '',
				cantidad: '',
				talla: '',
			});
			setFormErrors({});
			setAddOpen(false);
		} catch (err) {
			setFormErrors(s => ({
				...s,
				submit:
					err?.response?.data?.message ||
					err.message ||
					'Error al guardar producto',
			}));
		} finally {
			setSaving(false);
		}
	};

	// Abrir/cerrar menú
	const handleMenuOpen = (event, product) => {
		setMenuAnchorEl(event.currentTarget);
		setMenuProduct(product);
	};
	const handleMenuClose = () => {
		setMenuAnchorEl(null);
		setMenuProduct(null);
	};

	// ---- EDITAR ----
	const handleEditOpen = () => {
		if (!menuProduct) return;
		setEditFormData({
			idproducto: menuProduct.idproducto,
			nombre_producto: menuProduct.nombre_producto || '',
			descripcion: menuProduct.descripcion || '',
			precio_unitario: String(menuProduct.precio_unitario ?? ''),
			cantidad: String(menuProduct.cantidad ?? ''),
			talla: menuProduct.talla || '',
		});
		setEditErrors({});
		setEditOpen(true);
		handleMenuClose();
	};

	const handleEditClose = () => {
		if (editSaving) return;
		setEditOpen(false);
		setEditErrors({});
	};

	const handleEditChange = field => e => {
		const value = e.target.value;
		setEditFormData(s => ({ ...s, [field]: value }));
	};

	const isShirtEdit = useMemo(() => {
		const n = (editFormData.nombre_producto || '').toLowerCase();
		return n.includes('camisa') || n.includes('camiseta');
	}, [editFormData.nombre_producto]);

	const validateEdit = () => {
		const e = {};
		if (!editFormData.nombre_producto?.trim()) e.nombre_producto = 'Requerido';
		if (
			editFormData.precio_unitario === '' ||
			isNaN(Number(editFormData.precio_unitario))
		)
			e.precio_unitario = 'Precio inválido';
		if (editFormData.cantidad === '' || isNaN(Number(editFormData.cantidad)))
			e.cantidad = 'Cantidad inválida';
		if (isShirtEdit && !editFormData.talla) e.talla = 'Selecciona una talla';
		setEditErrors(e);
		return Object.keys(e).length === 0;
	};

	const handleEditSubmit = async e => {
		e.preventDefault();
		if (!validateEdit()) return;
		setEditSaving(true);
		try {
			const payload = {
				nombre_producto: editFormData.nombre_producto.trim(),
				descripcion: editFormData.descripcion?.trim() || null,
				precio_unitario: Number(editFormData.precio_unitario),
				cantidad: Number(editFormData.cantidad),
				talla: isShirtEdit ? editFormData.talla : null,
        estado: 'recibido',
			};

			const { data } = await api.put(
				`/auth/tienda/modificarproducto/${editFormData.idproducto}`,
				payload,
			);

			setProductos(prev =>
				prev.map(p =>
					p.idproducto === editFormData.idproducto
						? { ...p, ...data.producto }
						: p,
				),
			);

			setBannerMsg('Producto actualizado');
			setBannerType('success');
			setShowBanner(true);
			setEditOpen(false);
		} catch (err) {
			setEditErrors(s => ({
				...s,
				submit:
					err?.response?.data?.message ||
					err.message ||
					'Error al actualizar producto',
			}));
		} finally {
			setEditSaving(false);
		}
	};

	// ---- ELIMINAR ----
	const handleDeleteClick = () => {
		if (!menuProduct) return;
		setDeleteProduct(menuProduct);
		setDeleteOpen(true);
		handleMenuClose();
	};

	const handleDeleteClose = () => {
		setDeleteOpen(false);
		setDeleteProduct(null);
	};

	const handleDeleteConfirm = async () => {
		try {
			await api.delete(
				`/auth/tienda/eliminarproducto/${deleteProduct.idproducto}`,
			);
			setProductos(prev =>
				prev.filter(p => p.idproducto !== deleteProduct.idproducto),
			);

			setBannerMsg('Producto eliminado');
			setBannerType('success');
			setShowBanner(true);
			handleDeleteClose();
		} catch (err) {
			setBannerMsg(
				err?.response?.data?.message ||
					err.message ||
					'Error al eliminar producto',
			);
			setBannerType('error');
			setShowBanner(true);
		}
	};

	// Cargar productos
	useEffect(() => {
		let cancelled = false;
		async function loadProductos() {
			try {
				setLoadingProductos(true);
				setErrorProductos(null);
				const { data } = await api.get('/auth/tienda/productos');
				const lista = Array.isArray(data?.productos) ? data.productos : [];
				const mapeadas = lista.map(p => ({
					idproducto: p.idproducto,
					nombre_producto: p.nombre_producto,
					descripcion: p.descripcion,
					precio_unitario: p.precio_unitario,
					cantidad: p.cantidad,
					talla: p.talla,
				}));
				if (!cancelled) setProductos(mapeadas);
			} catch (err) {
				if (!cancelled) {
					setErrorProductos(
						err?.response?.data?.message ||
							err.message ||
							'Error cargando productos de la tienda',
					);
				}
			} finally {
				if (!cancelled) setLoadingProductos(false);
			}
		}
		loadProductos();
		return () => {
			cancelled = true;
		};
	}, []);

	const totalItems = useMemo(
		() => cartItems.reduce((acc, it) => acc + (parseInt(it.cantidad) || 0), 0),
		[cartItems],
	);

	// Filtrado
	const filteredProducts = useMemo(() => {
		const q = (searchQuery || '').toLowerCase().trim();
		if (!q) return productos;
		const palabras = q.split(' ').filter(Boolean);
		return productos.filter(p => {
			const nombre = (p.nombre_producto || '').toLowerCase();
			const desc = (p.descripcion || '').toLowerCase();
			const nombreMatch = nombre.includes(q);
			const descripcionMatch = desc.includes(q);
			const palabrasMatch = palabras.some(
				w => nombre.includes(w) || desc.includes(w),
			);
			const categoriaMatch = buscarPorCategoria(p, q);
			return nombreMatch || descripcionMatch || palabrasMatch || categoriaMatch;
		});
	}, [searchQuery, productos]);

	// ---- FACTURA ----
	const [open, setopen] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);

	const openFactura = () => {
		if (cartItems.length === 0) {
			setBannerMsg('Tu carrito está vacío.');
			setBannerType('error');
			setShowBanner(true);
			return;
		}
		setopen(true);
	};

	const CerrarModal = async () => {
    try {
        const uidRes = await api.get('/auth/obteneruid', {
            withCredentials: true,
        });
        const id = uidRes?.data?.id;
        if (!id) throw new Error('No autenticado');

        const body = {
            uid: id,
            cartItems,
        };

        await api.post('/auth/agregarorden', body, {
            headers: { 'Content-Type': 'application/json' },
        });

        const res = await api.get('/auth/idorden');
        const idorden = Number(res.data[0]?.idorden);

		await generateFacturaPDF(idorden);
      

        setCartItems([]);
        setOpenSnackbar(true);

    
    } catch (error) {
        console.error('Error al crear la orden:', error?.message || error);
        setBannerMsg(
            error?.response?.data?.message ||
                error.message ||
                'Error al crear la orden',
        );
        setBannerType('error');
        setShowBanner(true);
    }finally{

		setopen(false)
	}
  
};


	// Carrito
	const addToCart = producto => {
		const requiere = productoRequiereTalla(producto);
		const tallaSel = selectedSizes[producto.idproducto] || null;
		if (requiere && !tallaSel) {
			alert('Por favor selecciona una talla antes de agregar al carrito.');
			return;
		}

		setCartItems(prev => {
			const existente = prev.find(
				it =>
					it.idproducto === producto.idproducto &&
					(requiere ? it.talla === tallaSel : true),
			);
			if (existente) {
				return prev.map(it =>
					it.idproducto === producto.idproducto &&
					(requiere ? it.talla === tallaSel : true)
						? { ...it, cantidad: it.cantidad + 1 }
						: it,
				);
			} else {
				return [
					...prev,
					{
						idproducto: producto.idproducto,
						nombre_producto: producto.nombre_producto,
						descripcion: producto.descripcion,
						precio_unitario: producto.precio_unitario,
						cantidad: 1,
						...(requiere && { talla: tallaSel }),
					},
				];
			}
		});
	};

	const aumentarCantidad = (productId, talla) => {
		setCartItems(prev =>
			prev.map(it =>
				it.idproducto === productId && it.talla === talla
					? { ...it, cantidad: it.cantidad + 1 }
					: it,
			),
		);
	};

	const disminuirCantidad = (productId, talla) => {
		setCartItems(prev =>
			prev.map(it =>
				it.idproducto === productId && it.talla === talla && it.cantidad > 1
					? { ...it, cantidad: it.cantidad - 1 }
					: it,
			),
		);
	};

	const eliminarDelCarrito = (productId, talla) => {
		setCartItems(prev =>
			prev.filter(it => !(it.idproducto === productId && it.talla === talla)),
		);
	};

	const calcularTotal = useMemo(() => {
		const total = cartItems.reduce((acc, it) => {
			const unit = getPrecioByTalla(it, it.talla);
			return acc + (parseFloat(unit) || 0) * (parseInt(it.cantidad) || 0);
		}, 0);
		return total;
	}, [cartItems]);

	return (
		<>
			<Box
				sx={{
					minHeight: '100vh',
					width: '100%',
					background: '#f5f5f5',
					display: 'flex',
					flexDirection: 'column',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				<Box sx={{ height: '20px' }} />

				{/* AppBar */}
				<AppBar
					position='static'
					elevation={2}
					sx={{
						backgroundColor: 'white',
						minHeight: '70px',
						marginTop: '60px',
					}}
				>
					<Toolbar
						sx={{
							justifyContent: 'center',
							py: 1,
							minHeight: '70px !important',
						}}
					>
						<Box
							component='form'
							onSubmit={e => e.preventDefault()}
							sx={{ flexGrow: 1, maxWidth: 500, mx: { xs: 1, sm: 3 } }}
						>
							<TextField
								fullWidth
								variant='outlined'
								placeholder='Buscar productos...'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								size='medium'
								sx={{
									'& .MuiOutlinedInput-root': {
										backgroundColor: 'white',
										borderRadius: 2,
										height: '45px',
										boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
										border: '2px solid #e0e0e0',
										'& fieldset': {
											borderColor: '#2c1a99',
											borderWidth: '2px',
										},
										'&:hover': {
											borderColor: '#2c1a99',
											'& fieldset': {
												borderColor: '#2c1a99',
												borderWidth: '2px',
											},
										},
										'&.Mui-focused': {
											borderColor: '#2c1a99',
											boxShadow: '0 0 0 3px rgba(44, 26, 153, 0.2)',
											'& fieldset': {
												borderColor: '#2c1a99',
												borderWidth: '3px',
											},
										},
									},
									'& .MuiInputBase-input': {
										padding: '10px 14px',
										fontSize: '16px',
										fontWeight: 500,
									},
								}}
							/>
						</Box>

						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
							<IconButton
								sx={{
									color: 'black',
									backgroundColor: 'rgba(255,255,255,0.2)',
									'&:hover': { backgroundColor: 'rgba(255,255,255,0.4)' },
								}}
								size='large'
							>
								<SearchIcon sx={{ fontSize: 30 }} />
							</IconButton>

							<IconButton
								onClick={() => setCartModalOpen(true)}
								sx={{
									color: 'black',
									backgroundColor: 'rgba(255,255,255,0.2)',
									'&:hover': { backgroundColor: 'rgba(255,255,255,0.4)' },
								}}
								size='large'
							>
								<Badge badgeContent={totalItems} color='error'>
									<ShoppingCartIcon sx={{ fontSize: 30 }} />
								</Badge>
							</IconButton>

							{isAdmin && (
								<IconButton
									onClick={() => setAddOpen(true)}
									sx={{
										color: 'black',
										backgroundColor: 'rgba(255,255,255,0.2)',
										'&:hover': { backgroundColor: 'rgba(255,255,255,0.4)' },
									}}
								>
									<Add />
								</IconButton>
							)}
						</Box>
					</Toolbar>
				</AppBar>

				{/* Contenido */}
				<Box sx={{ flex: 1, backgroundColor: '#ffffff', overflow: 'hidden' }}>
					<Container maxWidth='lg' sx={{ py: 4 }}>
						{/*  Título editable */}
						<EditableText
								text={textos.tienda_titulo_principal || "Bienvenido a la Tienda de Pilotos"}
								onTextSave={(newText) => handleTextSave("tienda_titulo_principal", newText)}
								isAdmin={isAdmin}
								variant="h4"
								sx={{
									color: '#2c1a99',
									fontWeight: 'bold',
									fontFamily: 'Varsity',
									mb: 3,
								}}
							/>

						{/* Dialog de agregar */}
						<Dialog
							open={addOpen}
							onClose={handleClose}
							fullWidth
							maxWidth='sm'
							keepMounted
							PaperProps={{ component: 'form', onSubmit: handleSubmit }}
						>
							<DialogTitle>Agregar producto</DialogTitle>
							<DialogContent dividers>
								<Stack spacing={2} sx={{ mt: 0.5 }}>
									<TextField
										label='Nombre del producto'
										value={formData.nombre_producto}
										onChange={handleChangeForm('nombre_producto')}
										error={!!formErrors.nombre_producto}
										helperText={formErrors.nombre_producto}
										required
										fullWidth
									/>

									<TextField
										label='Descripción'
										value={formData.descripcion}
										onChange={handleChangeForm('descripcion')}
										multiline
										minRows={2}
										fullWidth
									/>

									<Box
										sx={{
											display: 'grid',
											gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
											gap: 2,
										}}
									>
										<TextField
											label='Precio (L)'
											type='number'
											inputMode='decimal'
											value={formData.precio_unitario}
											onChange={handleChangeForm('precio_unitario')}
											error={!!formErrors.precio_unitario}
											helperText={formErrors.precio_unitario}
											required
											fullWidth
										/>
										<TextField
											label='Cantidad'
											type='number'
											inputMode='numeric'
											value={formData.cantidad}
											onChange={handleChangeForm('cantidad')}
											error={!!formErrors.cantidad}
											helperText={formErrors.cantidad}
											required
											fullWidth
										/>
									</Box>

									{isShirt && (
										<FormControl fullWidth error={!!formErrors.talla}>
											<InputLabel id='talla-label'>Talla</InputLabel>
											<Select
												labelId='talla-label'
												label='Talla'
												value={formData.talla}
												onChange={handleChangeForm('talla')}
												input={<OutlinedInput label='Talla' />}
											>
												{TALLAS.map(t => (
													<MenuItem key={t} value={t}>
														{t}
													</MenuItem>
												))}
											</Select>
											{formErrors.talla && (
												<Box
													sx={{ color: 'error.main', fontSize: 12, mt: 0.5 }}
												>
													{formErrors.talla}
												</Box>
											)}
										</FormControl>
									)}

									{formErrors.submit && (
										<Box sx={{ color: 'error.main', fontSize: 14 }}>
											{formErrors.submit}
										</Box>
									)}
								</Stack>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleClose} disabled={saving}>
									Cancelar
								</Button>
								<Button type='submit' variant='contained' disabled={saving}>
									{saving ? 'Guardando...' : 'Guardar'}
								</Button>
							</DialogActions>
						</Dialog>

						{/* Dialog de editar */}
						<Dialog
							open={editOpen}
							onClose={handleEditClose}
							fullWidth
							maxWidth='sm'
							keepMounted
							PaperProps={{ component: 'form', onSubmit: handleEditSubmit }}
						>
							<DialogTitle>Editar producto</DialogTitle>
							<DialogContent dividers>
								<Stack spacing={2} sx={{ mt: 0.5 }}>
									<TextField
										label='Nombre del producto'
										value={editFormData.nombre_producto}
										onChange={handleEditChange('nombre_producto')}
										error={!!editErrors.nombre_producto}
										helperText={editErrors.nombre_producto}
										required
										fullWidth
									/>

									<TextField
										label='Descripción'
										value={editFormData.descripcion}
										onChange={handleEditChange('descripcion')}
										multiline
										minRows={2}
										fullWidth
									/>

									<Box
										sx={{
											display: 'grid',
											gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
											gap: 2,
										}}
									>
										<TextField
											label='Precio (L)'
											type='number'
											inputMode='decimal'
											value={editFormData.precio_unitario}
											onChange={handleEditChange('precio_unitario')}
											error={!!editErrors.precio_unitario}
											helperText={editErrors.precio_unitario}
											required
											fullWidth
										/>
										<TextField
											label='Cantidad'
											type='number'
											inputMode='numeric'
											value={editFormData.cantidad}
											onChange={handleEditChange('cantidad')}
											error={!!editErrors.cantidad}
											helperText={editErrors.cantidad}
											required
											fullWidth
										/>
									</Box>

									{isShirtEdit && (
										<FormControl fullWidth error={!!editErrors.talla}>
											<InputLabel id='edit-talla-label'>Talla</InputLabel>
											<Select
												labelId='edit-talla-label'
												label='Talla'
												value={editFormData.talla}
												onChange={handleEditChange('talla')}
												input={<OutlinedInput label='Talla' />}
											>
												{TALLAS.map(t => (
													<MenuItem key={t} value={t}>
														{t}
													</MenuItem>
												))}
											</Select>
											{editErrors.talla && (
												<Box
													sx={{ color: 'error.main', fontSize: 12, mt: 0.5 }}
												>
													{editErrors.talla}
												</Box>
											)}
										</FormControl>
									)}

									{editErrors.submit && (
										<Box sx={{ color: 'error.main', fontSize: 14 }}>
											{editErrors.submit}
										</Box>
									)}
								</Stack>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleEditClose} disabled={editSaving}>
									Cancelar
								</Button>
								<Button type='submit' variant='contained' disabled={editSaving}>
									{editSaving ? 'Guardando...' : 'Actualizar'}
								</Button>
							</DialogActions>
						</Dialog>

						{/* Dialog de eliminar */}
						<Dialog
							open={deleteOpen}
							onClose={handleDeleteClose}
							maxWidth='xs'
							fullWidth
						>
							<DialogTitle>Eliminar producto</DialogTitle>
							<DialogContent dividers>
								<Typography>
									¿Seguro que quieres eliminar{' '}
									<b>{deleteProduct?.nombre_producto}</b>?
								</Typography>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleDeleteClose}>Cancelar</Button>
								<Button
									onClick={handleDeleteConfirm}
									variant='contained'
									color='error'
								>
									Eliminar
								</Button>
							</DialogActions>
						</Dialog>

						{/* Grid de productos */}
						<Box
							sx={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
								gap: 3,
								mt: 3,
							}}
						>
							{filteredProducts.map(p => {
								const tallaSel = selectedSizes[p.idproducto];
								const precioCard = getPrecioByTalla(p, tallaSel).toFixed(2);
								return (
									<Paper
										key={p.idproducto}
										elevation={2}
										sx={{
											p: 2,
											borderRadius: 2,
											transition:
												'transform 0.2s, box-shadow 0.2s, border 0.2s',
											border: '2px solid transparent',
											'&:hover': {
												transform: 'translateY(-4px)',
												boxShadow: '0 8px 25px #2c1a99',
												border: '2px solid #2c1a99',
											},
											height: 'fit-content',
										}}
									>
										{/* Tres puntitos */}
										{isAdmin && (
											<Box sx={{ position: 'relative' }}>
												<IconButton
													size='small'
													onClick={e => handleMenuOpen(e, p)}
													sx={{ position: 'absolute', top: 4, right: 4 }}
													aria-label='Más acciones'
												>
													<MoreVertIcon />
												</IconButton>
											</Box>
										)}

										{/* Dropdown */}
										<Menu
											anchorEl={menuAnchorEl}
											open={Boolean(menuAnchorEl)}
											onClose={handleMenuClose}
											anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
											transformOrigin={{ vertical: 'top', horizontal: 'right' }}
										>
											<MenuItem onClick={handleEditOpen}>Editar</MenuItem>
											<MenuItem
												onClick={handleDeleteClick}
												sx={{ color: 'error.main' }}
											>
												Eliminar
											</MenuItem>
										</Menu>

										<Typography
											variant='h6'
											gutterBottom
											sx={{ fontWeight: 'bold', fontFamily: 'Varsity' }}
										>
											{p.nombre_producto}
										</Typography>

										<Typography
											variant='body2'
											color='text.secondary'
											sx={{ fontFamily: 'PeterMedium', fontWeight: 'bold' }}
										>
											{p.descripcion}
										</Typography>

										{productoRequiereTalla(p) && (
											<Box
												sx={{
													display: 'flex',
													flexWrap: 'wrap',
													gap: 1,
													my: 2,
												}}
											>
												{TALLAS.map(size => (
													<Button
														key={size}
														onClick={() =>
															setSelectedSizes(prev => ({
																...prev,
																[p.idproducto]: size,
															}))
														}
														variant={
															tallaSel === size ? 'contained' : 'outlined'
														}
														sx={{
															minWidth: 0,
															width: 36,
															height: 36,
															borderRadius: '50%',
															p: 0,
															fontFamily: 'Varsity',
															fontWeight: 'bold',
															bgcolor: tallaSel === size ? '#2c1a99' : '#fff',
															color: tallaSel === size ? '#fff' : '#999',
															border:
																tallaSel === size
																	? '2px solid #2c1a99'
																	: '2px solid #999',
															'&:hover': { bgcolor: '#2c1a99', color: '#fff' },
														}}
													>
														{size}
													</Button>
												))}
											</Box>
										)}

										<Typography
											variant='h5'
											sx={{
												color: '#2c1a99',
												fontWeight: 'bold',
												fontFamily: 'Varsity',
											}}
										>
											L.{precioCard}
										</Typography>

										<Button
											variant='contained'
											fullWidth
											sx={{
												bgcolor: '#E06C14',
												fontFamily: 'GroteskBold',
												color: 'white',
												fontWeight: 'bold',
												mt: 2,
												'&:hover': { bgcolor: '#28a428' },
											}}
											onClick={() => addToCart(p)}
										>
											Agregar al Carrito
										</Button>
									</Paper>
								);
							})}
						</Box>
					</Container>
				</Box>
			</Box>

			{/* Drawer Carrito */}
			<Drawer
				anchor='right'
				open={cartModalOpen}
				onClose={() => setCartModalOpen(false)}
				PaperProps={{
					sx: {
						width: { xs: '100%', sm: 400, md: 550 },
						overflowX: 'hidden',
						overflowY: 'hidden',
					},
				}}
			>
				<Box
					sx={{
						p: 3,
						pt: { xs: '130px', sm: '130px' },
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 2,
						}}
					>
						<Typography
							variant='h5'
							sx={{
								color: '#2c1a99',
								fontFamily: 'Varsity',
								fontWeight: 'bold',
							}}
						>
							Carrito de Compras
						</Typography>
						<IconButton onClick={() => setCartModalOpen(false)}>
							<CloseIcon />
						</IconButton>
					</Box>

					{showBanner && (
						<Box
							sx={{
								width: '100%',
								mb: 2,
								backgroundColor: bannerType === 'error' ? '#f44336' : '#4caf50',
								color: '#fff',
								borderRadius: 1,
								p: 1,
								boxShadow: 2,
							}}
						>
							<Typography sx={{ fontWeight: 'bold' }}>{bannerMsg}</Typography>
						</Box>
					)}

					{cartItems.length === 0 ? (
						<Box
							sx={{
								flexGrow: 1,
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 2,
								py: 4,
							}}
						>
							<ShoppingCartIcon sx={{ fontSize: 48, color: 'grey.500' }} />
							<Typography
								variant='h6'
										color='text.secondary'
										sx={{ fontFamily: 'Varsity', fontWeight: 'bold' }}
									>
										<EditableText
											text={textos.tienda_mensaje_carrito_vacio || "Tu carrito está vacío"}
											onTextSave={(newText) => handleTextSave("tienda_mensaje_carrito_vacio", newText)}
											isAdmin={isAdmin}
											variant="h6"
										/>
							</Typography>
						</Box>
					) : (
						<>
							<List sx={{ flexGrow: 1, overflowY: 'auto' }}>
								{cartItems.map((item, index) => {
									const key = item.talla
										? `${item.idproducto}-${item.talla}`
										: item.idproducto;
									const unit = getPrecioByTalla(item, item.talla);
									return (
										<React.Fragment key={key}>
											<ListItem disableGutters sx={{ px: 1 }}>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														width: '100%',
													}}
												>
													<Box sx={{ flexGrow: 1 }}>
														<Typography
															variant='h6'
															sx={{
																fontSize: '1.05rem',
																color: '#2c1a99',
																fontFamily: 'Varsity',
																fontWeight: 'bold',
															}}
														>
															{item.nombre_producto}
														</Typography>
														<Typography
															variant='body1'
															sx={{
																fontSize: '0.95rem',
																color: 'text.secondary',
															}}
														>
															L
															{unit.toLocaleString('es-HN', {
																minimumFractionDigits: 2,
															})}{' '}
															c/u
														</Typography>
														{item.talla && (
															<Typography
																variant='body2'
																color='text.secondary'
															>
																Talla: {item.talla}
															</Typography>
														)}
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															ml: 3,
															mr: 1,
														}}
													>
														<IconButton
															size='small'
															onClick={() =>
																disminuirCantidad(item.idproducto, item.talla)
															}
															disabled={item.cantidad <= 1}
														>
															<RemoveIcon />
														</IconButton>
														<Typography
															sx={{
																mx: 1,
																minWidth: 30,
																textAlign: 'center',
																fontWeight: 'bold',
															}}
														>
															{item.cantidad}
														</Typography>
														<IconButton
															size='small'
															onClick={() =>
																aumentarCantidad(item.idproducto, item.talla)
															}
														>
															<AddIcon />
														</IconButton>
													</Box>

													<Box
														sx={{ minWidth: 110, textAlign: 'right', mr: 1 }}
													>
														<Typography fontWeight='bold' noWrap>
															L.
															{(unit * item.cantidad).toLocaleString('es-HN', {
																minimumFractionDigits: 2,
															})}
														</Typography>
													</Box>

													<IconButton
														onClick={() =>
															eliminarDelCarrito(item.idproducto, item.talla)
														}
														sx={{
															color: '#d32f2f',
															'&:hover': {
																bgcolor: 'rgba(211, 47, 47, 0.1)',
																transform: 'scale(1.1)',
															},
															transition: 'all 0.2s ease',
														}}
													>
														<DeleteIcon />
													</IconButton>
												</Box>
											</ListItem>
											{index < cartItems.length - 1 && <Divider />}
										</React.Fragment>
									);
								})}
							</List>

							<Divider sx={{ my: 2 }} />

							<Box
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Box>
									<Typography variant='h5' sx={{ fontWeight: 'bold' }}>
										Total: L
										{parseFloat(calcularTotal).toLocaleString('es-HN', {
											minimumFractionDigits: 2,
										})}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										{totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
									</Typography>
								</Box>

								<Button
									variant='contained'
									sx={{
										bgcolor: '#E06C14',
										fontWeight: 'bold',
										'&:hover': { bgcolor: '#28a428' },
									}}
									onClick={() => {
										if (cartItems.length === 0) {
											setBannerMsg('Tu carrito está vacío.');
											setBannerType('error');
											setShowBanner(true);
											return;
										}
										setBannerMsg('Compra procesada correctamente');
										setBannerType('success');
										setShowBanner(true);
										setTimeout(() => {
											setShowBanner(false);
											setCartModalOpen(false);
											openFactura();
										}, 1000);
									}}
								>
									Confirmar Factura
								</Button>
							</Box>
						</>
					)}
				</Box>
			</Drawer>

			{/* Modal factura de cliente */}
			<Dialog
				open={open}
				onClose={() => setopen(false)}
				fullWidth
				maxWidth='sm'
				sx={{ zIndex: 1300, marginTop:5  }}
			>
				<DialogContent ref={contentRef}  >
        
					<DialogTitle
						variant='h5'
						sx={{
							color: '#2c1a99',
							fontFamily: 'Varsity',
							fontWeight: 'bold',
							textAlign: 'center',
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						Factura del Cliente
					</DialogTitle>

					<Typography
						variant='body1'
						sx={{ fontFamily: 'PeterMedium', mb: 2, ml: 5 }}
					>
						Fecha:{' '}
						{new Date().toLocaleDateString('es-HN', {
							day: 'numeric',
							month: 'long',
							year: 'numeric',
						})}
					</Typography>
					<Typography
						variant='body1'
						sx={{ fontFamily: 'PeterMedium', mb: 2, ml: 5 }}
					>
						PILOTOS FAH. Campo de la Fuerza Aérea Hondureña.
					</Typography>

					<p>Resumen de su orden:</p>

					{cartItems.length === 0 ? (
						<p>No hay productos en el carrito.</p>
					) : (
						<table
							style={{
								width: '100%',
								borderCollapse: 'collapse',
								marginTop: '1rem',
							}}
						>
							<thead>
								<tr style={{ backgroundColor: '#2c1a99' }}>
									<th
										style={{
											padding: '8px',
											border: '1px solid #ccc',
											color: 'white',
										}}
									>
										Producto
									</th>
									<th
										style={{
											padding: '8px',
											border: '1px solid #ccc',
											color: 'white',
										}}
									>
										Talla
									</th>
									<th
										style={{
											padding: '8px',
											border: '1px solid #ccc',
											color: 'white',
										}}
									>
										Cantidad
									</th>
									<th
										style={{
											padding: '8px',
											border: '1px solid #ccc',
											color: 'white',
										}}
									>
										Precio Unitario
									</th>
									<th
										style={{
											padding: '8px',
											border: '1px solid #ccc',
											color: 'white',
										}}
									>
										Precio Total
									</th>
								</tr>
							</thead>
							<tbody>
								{cartItems.map((item, index) => {
									const unit = getPrecioByTalla(item, item.talla);
									return (
										<tr key={index}>
											<td style={{ padding: '8px', border: '1px solid #ccc' }}>
												{item.nombre_producto}
											</td>
											<td style={{ padding: '8px', border: '1px solid #ccc' }}>
												{item.talla || '-'}
											</td>
											<td style={{ padding: '8px', border: '1px solid #ccc' }}>
												{item.cantidad}
											</td>
											<td style={{ padding: '8px', border: '1px solid #ccc' }}>
												L.{unit.toFixed(2)}
											</td>
											<td style={{ padding: '8px', border: '1px solid #ccc' }}>
												L.{(unit * item.cantidad).toFixed(2)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}

					{cartItems.length > 0 && (
						<div
							style={{
								marginTop: '2.5rem',
								textAlign: 'right',
								fontWeight: 'bold',
							}}
						>
							{(() => {
								const total = cartItems.reduce((acc, item) => {
									const unit = getPrecioByTalla(item, item.talla);
									return acc + unit * item.cantidad;
								}, 0);
								const isv = total * 0.15;
								const subtotal = total - isv;

								return (
									<>
										<div>Subtotal: L.{subtotal.toFixed(2)}</div>
										<div>I.S.V 15%: L.{isv.toFixed(2)}</div>
										<div>Total a Pagar: L.{total.toFixed(2)}</div>
										  <Typography
                                            variant='body2'
                                            sx={{
                                                color: 'black',
                                                fontWeight: 'bold',
                                                fontFamily: 'PeterMedium',
                                                m: 3,
                                                textAlign: 'center',
                                                fontSize: '1rem',
                                            }}
                                        >
                                            Esta factura debera ser cancelada a la siguiente cuenta:
                                        </Typography>
                                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                                            <Box component="ul" sx={{ display: 'inline-block', textAlign: 'left', fontFamily: 'PeterMedium', listStyleType: 'none', p: 0 }}>
                                                  <li>Numero de Cuenta: 748728881</li>
                                                  <li>Banco: BAC</li>
                                                  <li>Nombre: Melissa Rosales</li>
                                            </Box>
                                        </Box>


										<Typography
											variant='body2'
											sx={{
												color: 'red',
												fontWeight: 'bold',
												fontFamily: 'PeterMedium',
												m: 3,
												textAlign: 'center',
												fontSize: '1rem',
											}}
										>
											Esta factura es necesaria para reclamar su producto en el
											punto de entrega. Por favor, no la pierda.
										</Typography>
									</>
								);
							})()}
						</div>
					)}
			
				</DialogContent>

				<Button
                variant='contained'
                onClick={CerrarModal}
                sx={{
                    mt: 2,
                    backgroundColor: '#ff6600',
                    color: '#fff',
                    fontFamily: 'PeterMedium',
                    '&:hover': { backgroundColor: '#e65c00' },
                    width: '30%',
                    m: 3,
                    borderRadius: '10px',
                    '&:disabled': {
                        backgroundColor: '#cccccc',
                    }
                }}
            >
              Proceder Orden
            </Button>
			</Dialog>

			<Snackbar
				open={openSnackbar}
				autoHideDuration={4000}
				onClose={() => setOpenSnackbar(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={() => setOpenSnackbar(false)}
					severity='success'
					sx={{ width: '100%' }}
					elevation={6}
					variant='filled'
				>
					¡Orden registrada exitosamente!
				</Alert>
			</Snackbar>
		</>
	);
}
