import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const ProdDonaciones = () => {
    const [productos, setProductos] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        nombre: "",
        descripcion: "",
        imagen: "",
        estado: true, // 🔹 por defecto activo
    });

    // 🔹 Validación de imagen igual a tu otro componente
    const getImagen = (imagen) => {
        if (!imagen) return "/Images/producto_defecto.png";
        return imagen.startsWith("/Images/")
            ? imagen
            : "/Images/producto_defecto.png";
    };

    // Cargar productos
    const fetchProductos = async () => {
        try {
            const res = await api.get("/auth/productos");
            setProductos(res.data.productos || []);
        } catch (e) {
            console.error("Error al obtener productos:", e);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    // Abrir modal
    const handleOpen = (producto = null) => {
        if (producto) {
            setFormData({
                id: producto.id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                imagen: producto.imagen,
                estado: producto.estado, // 🔹 cargamos el estado
            });
            setEditMode(true);
        } else {
            setFormData({ id: null, nombre: "", descripcion: "", imagen: "", estado: true });
            setEditMode(false);
        }
        setOpen(true);
    };

    // Cerrar modal
    const handleClose = () => setOpen(false);

    // Guardar producto
    const handleSave = async () => {
        try {
            if (editMode) {
                await api.put(`/auth/productos/${formData.id}`, formData);
            } else {
                await api.post("/auth/productos", formData);
            }
            fetchProductos();
            handleClose();
        } catch (e) {
            console.error("Error al guardar producto:", e);
        }
    };

    // Eliminar producto
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
        try {
            await api.delete(`/auth/productos/${id}`);
            fetchProductos();
        } catch (e) {
            console.error("Error al eliminar producto:", e);
        }
    };

    return (
        <Box sx={{ pt: { xs: 10, sm: 12 }, px: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontFamily: "GroteskBold" }}>
                Administrar Productos de Donación
            </Typography>

            <Button
                variant="contained"
                sx={{ mb: 3, backgroundColor: '#10045c' }}
                onClick={() => handleOpen()}
            >
                Agregar Producto
            </Button>

            <Grid
                container
                spacing={3}
                justifyContent="center" // 🔹 centra horizontalmente
            >
                {productos.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card
                            sx={{
                                width: 300, // 🔹 ancho fijo
                                height: 400, // 🔹 altura fija
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                                <img
                                    src={getImagen(item.imagen)}
                                    alt={item.nombre}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/Images/producto_defecto.png";
                                    }}
                                    style={{
                                        width: "65%",
                                        height: "175px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        margin: "0 auto",
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mt: 2,
                                        fontFamily: "GroteskBold",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {item.nombre}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: "GroteskRegular",
                                        mb: 1,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {item.descripcion}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: "GroteskBold",
                                        color: item.estado ? "green" : "red",
                                    }}
                                >
                                    {item.estado ? "Activo" : "Inactivo"}
                                </Typography>
                            </CardContent>
                            <Box sx={{ textAlign: "center", pb: 2 }}>
                                <IconButton
                                    color="primary"
                                    onClick={() => handleOpen(item)}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    color="error"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Modal */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editMode ? "Editar Producto" : "Agregar Producto"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={formData.nombre}
                        onChange={(e) =>
                            setFormData({ ...formData, nombre: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        value={formData.descripcion}
                        onChange={(e) =>
                            setFormData({ ...formData, descripcion: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Imagen (ruta)"
                        fullWidth
                        value={formData.imagen}
                        onChange={(e) =>
                            setFormData({ ...formData, imagen: e.target.value })
                        }
                    />
                    {/* 🔹 Selector de estado */}
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Estado</InputLabel>
                        <Select
                            value={formData.estado}
                            onChange={(e) =>
                                setFormData({ ...formData, estado: e.target.value })
                            }
                            label="Estado"
                        >
                            <MenuItem value={true}>Activo</MenuItem>
                            <MenuItem value={false}>Inactivo</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProdDonaciones;
