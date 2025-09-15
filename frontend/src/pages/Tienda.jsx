import React, { useState, useMemo, useEffect } from 'react';
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
import { api } from '../api/api';

const TALLAS = ["6", "8", "10", "12", "14", "16", "XS", "S", "M", "L", "XL", "2XL"];

// Helpers
const productoRequiereTalla = (producto) => {
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
    'camisa': ['camisa', 'camiseta'],
    'camiseta': ['camisa', 'camiseta'],
    'gorra': ['gorra', 'gorras'],
    'gorras': ['gorra', 'gorras'],
    'bandera': ['bandera', 'banderas', 'banderin', 'banderines'],
    'niño': ['niño', 'niña', 'infantil', 'kid'],
    'local': ['local', 'casa', 'home'],
    'visita': ['visita', 'visitante', 'away'],
    'angelito': ['angelito', 'angelitos', 'fundacion'],
    'conmemorativa': ['conmemorativa', 'especial', 'edicion'],
  };
  for (const [termino, sinonimos] of Object.entries(categorias)) {
    if (searchTerm.includes(termino)) {
      return sinonimos.some((s) => nombre.includes(s));
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

  // Form Dialog
  const [addOpen, setAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre_producto: '',
    descripcion: '',
    precio_unitario: '',
    cantidad: '',
    talla: '',              // ← ahora es string
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const isShirt = useMemo(() => {
    const n = (formData.nombre_producto || '').toLowerCase();
    return n.includes('camisa') || n.includes('camiseta');
  }, [formData.nombre_producto]);

  const handleClose = () => {
    if (saving) return;
    setAddOpen(false);
    setFormErrors({});
  };

  const handleChangeForm = (field) => (e) => {
    const value = e.target.value;
    setFormData((s) => ({ ...s, [field]: value }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.nombre_producto?.trim()) e.nombre_producto = 'Requerido';
    if (formData.precio_unitario === '' || isNaN(Number(formData.precio_unitario))) e.precio_unitario = 'Precio inválido';
    if (formData.cantidad === '' || isNaN(Number(formData.cantidad))) e.cantidad = 'Cantidad inválida';
    if (isShirt && !formData.talla) e.talla = 'Selecciona una talla';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      const payload = {
        nombre_producto: formData.nombre_producto.trim(),
        descripcion: formData.descripcion?.trim() || null,
        precio_unitario: Number(formData.precio_unitario),
        cantidad: Number(formData.cantidad),
        talla: isShirt ? formData.talla : null, // ← una sola talla o null
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
        : {
            idproducto: Date.now(),
            ...payload,
          };

      setProductos((prev) => [nuevo, ...prev]);

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
      setFormErrors((s) => ({
        ...s,
        submit: err?.response?.data?.message || err.message || 'Error al guardar producto',
      }));
    } finally {
      setSaving(false);
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
        const mapeadas = lista.map((p) => ({
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
            err?.response?.data?.message || err.message || 'Error cargando productos de la tienda'
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
    [cartItems]
  );

  // Filtrado
  const filteredProducts = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return productos;
    const palabras = q.split(' ').filter(Boolean);
    return productos.filter((p) => {
      const nombre = (p.nombre_producto || '').toLowerCase();
      const desc = (p.descripcion || '').toLowerCase();
      const nombreMatch = nombre.includes(q);
      const descripcionMatch = desc.includes(q);
      const palabrasMatch = palabras.some((w) => nombre.includes(w) || desc.includes(w));
      const categoriaMatch = buscarPorCategoria(p, q);
      return nombreMatch || descripcionMatch || palabrasMatch || categoriaMatch;
    });
  }, [searchQuery, productos]);

  // Carrito
  const addToCart = (producto) => {
    const requiere = productoRequiereTalla(producto);
    const tallaSel = selectedSizes[producto.idproducto] || null;
    if (requiere && !tallaSel) {
      alert('Por favor selecciona una talla antes de agregar al carrito.');
      return;
    }

    setCartItems((prev) => {
      const existente = prev.find(
        (it) => it.idproducto === producto.idproducto && (requiere ? it.talla === tallaSel : true)
      );
      if (existente) {
        return prev.map((it) =>
          it.idproducto === producto.idproducto && (requiere ? it.talla === tallaSel : true)
            ? { ...it, cantidad: it.cantidad + 1 }
            : it
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
    setCartItems((prev) =>
      prev.map((it) =>
        it.idproducto === productId && it.talla === talla ? { ...it, cantidad: it.cantidad + 1 } : it
      )
    );
  };

  const disminuirCantidad = (productId, talla) => {
    setCartItems((prev) =>
      prev.map((it) =>
        it.idproducto === productId && it.talla === talla && it.cantidad > 1
          ? { ...it, cantidad: it.cantidad - 1 }
          : it
      )
    );
  };

  const eliminarDelCarrito = (productId, talla) => {
    setCartItems((prev) => prev.filter((it) => !(it.idproducto === productId && it.talla === talla)));
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
        <AppBar position="static" elevation={2} sx={{ backgroundColor: 'white', minHeight: '70px', marginTop: '60px' }}>
          <Toolbar sx={{ justifyContent: 'center', py: 1, minHeight: '70px !important' }}>
            <Box
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{ flexGrow: 1, maxWidth: 500, mx: { xs: 1, sm: 3 } }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 2,
                    height: '45px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '2px solid #e0e0e0',
                    '& fieldset': { borderColor: '#2c1a99', borderWidth: '2px' },
                    '&:hover': {
                      borderColor: '#2c1a99',
                      '& fieldset': { borderColor: '#2c1a99', borderWidth: '2px' },
                    },
                    '&.Mui-focused': {
                      borderColor: '#2c1a99',
                      boxShadow: '0 0 0 3px rgba(44, 26, 153, 0.2)',
                      '& fieldset': { borderColor: '#2c1a99', borderWidth: '3px' },
                    },
                  },
                  '& .MuiInputBase-input': { padding: '10px 14px', fontSize: '16px', fontWeight: 500 },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              <IconButton type="submit" sx={{ color: 'black', backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.4)' } }} size="large">
                <SearchIcon sx={{ fontSize: 30 }} />
              </IconButton>

              <IconButton onClick={() => setCartModalOpen(true)} sx={{ color: 'black', backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.4)' } }} size="large">
                <Badge badgeContent={totalItems} color="error">
                  <ShoppingCartIcon sx={{ fontSize: 30 }} />
                </Badge>
              </IconButton>

              <IconButton
                onClick={() => setAddOpen(true)}
                sx={{ color: 'black', backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.4)' } }}
              >
                <Add />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Contenido */}
        <Box sx={{ flex: 1, backgroundColor: '#ffffff', overflow: 'hidden' }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ color: '#2c1a99', fontWeight: 'bold', fontFamily: 'Varsity' }}>
              Bienvenido a la Tienda de Pilotos
            </Typography>

            {/* Dialog */}
            <Dialog
              open={addOpen}
              onClose={handleClose}
              fullWidth
              maxWidth="sm"
              keepMounted
              PaperProps={{ component: 'form', onSubmit: handleSubmit }}
            >
              <DialogTitle>Agregar producto</DialogTitle>
              <DialogContent dividers>
                <Stack spacing={2} sx={{ mt: 0.5 }}>
                  <TextField
                    label="Nombre del producto"
                    value={formData.nombre_producto}
                    onChange={handleChangeForm('nombre_producto')}
                    error={!!formErrors.nombre_producto}
                    helperText={formErrors.nombre_producto}
                    required
                    fullWidth
                  />

                  <TextField
                    label="Descripción"
                    value={formData.descripcion}
                    onChange={handleChangeForm('descripcion')}
                    multiline
                    minRows={2}
                    fullWidth
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      label="Precio (L)"
                      type="number"
                      inputMode="decimal"
                      value={formData.precio_unitario}
                      onChange={handleChangeForm('precio_unitario')}
                      error={!!formErrors.precio_unitario}
                      helperText={formErrors.precio_unitario}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Cantidad"
                      type="number"
                      inputMode="numeric"
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
                      <InputLabel id="talla-label">Talla</InputLabel>
                      <Select
                        labelId="talla-label"
                        label="Talla"
                        value={formData.talla}
                        onChange={handleChangeForm('talla')}
                        input={<OutlinedInput label="Talla" />}
                      >
                        {TALLAS.map((t) => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                      {formErrors.talla && <Box sx={{ color: 'error.main', fontSize: 12, mt: 0.5 }}>{formErrors.talla}</Box>}
                    </FormControl>
                  )}

                  {formErrors.submit && (
                    <Box sx={{ color: 'error.main', fontSize: 14 }}>{formErrors.submit}</Box>
                  )}
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} disabled={saving}>Cancelar</Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Grid de productos */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mt: 3 }}>
              {filteredProducts.map((p) => {
                const tallaSel = selectedSizes[p.idproducto];
                const precioCard = getPrecioByTalla(p, tallaSel).toFixed(2);
                return (
                  <Paper
                    key={p.idproducto}
                    elevation={2}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
                      border: '2px solid transparent',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px #2c1a99',
                        border: '2px solid #2c1a99',
                      },
                      height: 'fit-content',
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontFamily: 'Varsity' }}>
                      {p.nombre_producto}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'PeterMedium', fontWeight: 'bold' }}>
                      {p.descripcion}
                    </Typography>

                    {productoRequiereTalla(p) && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                        {TALLAS.map((size) => (
                          <Button
                            key={size}
                            onClick={() => setSelectedSizes((prev) => ({ ...prev, [p.idproducto]: size }))}
                            variant={tallaSel === size ? 'contained' : 'outlined'}
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
                              border: tallaSel === size ? '2px solid #2c1a99' : '2px solid #999',
                              '&:hover': { bgcolor: '#2c1a99', color: '#fff' },
                            }}
                          >
                            {size}
                          </Button>
                        ))}
                      </Box>
                    )}

                    <Typography variant="h5" sx={{ color: '#2c1a99', fontWeight: 'bold', fontFamily: 'Varsity' }}>
                      L.{precioCard}
                    </Typography>

                    <Button
                      variant="contained"
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

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400, md: 550 }, overflowX: 'hidden', overflowY: 'hidden' } }}
      >
        <Box sx={{ p: 3, pt: { xs: '130px', sm: '130px' }, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ color: '#2c1a99', fontFamily: 'Varsity', fontWeight: 'bold' }}>
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
              <Typography variant="h6" color="text.secondary" sx={{ fontFamily: 'Varsity', fontWeight: 'bold' }}>
                Tu carrito está vacío
              </Typography>
            </Box>
          ) : (
            <>
              <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {cartItems.map((item, index) => {
                  const key = item.talla ? `${item.idproducto}-${item.talla}` : item.idproducto;
                  const unit = getPrecioByTalla(item, item.talla);
                  return (
                    <React.Fragment key={key}>
                      <ListItem disableGutters sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontSize: '1.05rem', color: '#2c1a99', fontFamily: 'Varsity', fontWeight: 'bold' }}>
                              {item.nombre_producto}
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: '0.95rem', color: 'text.secondary' }}>
                              L{unit.toLocaleString('es-HN', { minimumFractionDigits: 2 })} c/u
                            </Typography>
                            {item.talla && (
                              <Typography variant="body2" color="text.secondary">
                                Talla: {item.talla}
                              </Typography>
                            )}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 3, mr: 1 }}>
                            <IconButton size="small" onClick={() => disminuirCantidad(item.idproducto, item.talla)} disabled={item.cantidad <= 1}>
                              <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ mx: 1, minWidth: 30, textAlign: 'center', fontWeight: 'bold' }}>
                              {item.cantidad}
                            </Typography>
                            <IconButton size="small" onClick={() => aumentarCantidad(item.idproducto, item.talla)}>
                              <AddIcon />
                            </IconButton>
                          </Box>

                          <Box sx={{ minWidth: 110, textAlign: 'right', mr: 1 }}>
                            <Typography fontWeight="bold" noWrap>
                              L.{(unit * item.cantidad).toLocaleString('es-HN', { minimumFractionDigits: 2 })}
                            </Typography>
                          </Box>

                          <IconButton
                            onClick={() => eliminarDelCarrito(item.idproducto, item.talla)}
                            sx={{
                              color: '#d32f2f',
                              '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)', transform: 'scale(1.1)' },
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

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Total: L{parseFloat(calcularTotal).toLocaleString('es-HN', { minimumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  sx={{ bgcolor: '#E06C14', fontWeight: 'bold', '&:hover': { bgcolor: '#28a428' } }}
                  onClick={() => {
                    setBannerMsg('Compra procesada correctamente');
                    setBannerType('success');
                    setShowBanner(true);
                    setCartItems([]);
                    setTimeout(() => {
                      setShowBanner(false);
                      setCartModalOpen(false);
                    }, 1500);
                  }}
                >
                  Proceder al Pago
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}
