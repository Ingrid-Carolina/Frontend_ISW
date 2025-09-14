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
        estado: true,
    });
    const [selectedFile, setSelectedFile] = useState(null);

    // Popup de confirmación
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Manejo de preview de imagen
    const getImagen = (imagen) => {
        if (!imagen) return "/Images/producto_defecto.png";
        if (imagen.startsWith("http")) return imagen;
        if (imagen.startsWith("/Images/")) return imagen;
        return "/Images/producto_defecto.png";
    };

    // Cargar productos
    const fetchProductos = async () => {
        try {
            const res = await api.get("/auth/donaciones/productos");
            setProductos(res.data.productos || []);
        } catch (e) {
            console.error("Error al obtener productos:", e);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    // Abrir modal de agregar/editar
    const handleOpen = (producto = null) => {
        if (producto) {
            setFormData({
                id: producto.id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                imagen: producto.imagen,
                estado: producto.estado,
            });
            setEditMode(true);
        } else {
            setFormData({ id: null, nombre: "", descripcion: "", imagen: "", estado: true });
            setEditMode(false);
        }
        setSelectedFile(null);
        setOpen(true);
    };

    // Cerrar modal
    const handleClose = () => {
        setOpen(false);
        setSelectedFile(null);
    };

    // Guardar producto
    const handleSave = async () => {
        try {
            let imagenUrl = formData.imagen;

            if (selectedFile) {
                const fd = new FormData();
                fd.append("file", selectedFile);

                const uploadRes = await api.post("/auth/upload", fd, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                imagenUrl = uploadRes.data.url;
            }

            const payload = { ...formData, imagen: imagenUrl };

            if (editMode) {
                await api.put(`/auth/donaciones/productos/${formData.id}`, payload);
            } else {
                await api.post("/auth/donaciones/productos", payload);
            }

            fetchProductos();
            handleClose();
        } catch (e) {
            console.error("Error al guardar producto:", e);
        }
    };

    // Eliminar producto
    const handleDelete = async (id) => {
        try {
            await api.delete(`/auth/donaciones/productos/${id}`);
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

            <Grid container spacing={3} justifyContent="center">
                {productos.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card
                            sx={{
                                width: 300,
                                height: 400,
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
                                    onClick={() => {
                                        setDeleteId(item.id);
                                        setDeleteOpen(true);
                                    }}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Modal de agregar/editar */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: "20px", p: 2, background: "#f9f9fc" },
                }}
            >
                <DialogTitle
                    sx={{
                        fontFamily: "GroteskBold",
                        fontSize: "1.5rem",
                        textAlign: "center",
                        color: "#10045c",
                        pb: 1,
                    }}
                >
                    {editMode ? "✏️ Editar Producto" : "🛒 Agregar Producto"}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Grid container spacing={3}>
                        {/* Vista previa */}
                        <Grid item xs={12} md="auto">
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Typography
                                    variant="h6"
                                    sx={{ mb: 2, fontFamily: "GroteskBold", textAlign: "center" }}
                                >
                                    Vista Previa
                                </Typography>

                                <Card
                                    sx={{
                                        width: 320,
                                        height: 400,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        borderRadius: "16px",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                                        <img
                                            src={
                                                selectedFile
                                                    ? URL.createObjectURL(selectedFile)
                                                    : getImagen(formData.imagen)
                                            }
                                            alt="Preview"
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
                                            {formData.nombre || "Nombre del producto"}
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
                                            {formData.descripcion || "Aquí aparecerá la descripción..."}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: "GroteskBold",
                                                color: formData.estado ? "green" : "red",
                                            }}
                                        >
                                            {formData.estado ? "Activo" : "Inactivo"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>

                        {/* Formulario */}
                        <Grid item xs={12} md sx={{ flexGrow: 1, display: "flex" }}>
                            <Box display="flex" flexDirection="column" gap={2} sx={{ width: "100%", mt: 5 }}>
                                <TextField
                                    margin="dense"
                                    label="Nombre del Producto"
                                    placeholder="Ejemplo: Balón de béisbol"
                                    fullWidth
                                    variant="outlined"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    InputProps={{ sx: { borderRadius: "12px", backgroundColor: "#fff" } }}
                                />

                                <TextField
                                    margin="dense"
                                    label="Descripción"
                                    placeholder="Agrega una breve descripción..."
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    variant="outlined"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    InputProps={{ sx: { borderRadius: "12px", backgroundColor: "#fff" } }}
                                />

                                <Box textAlign="center">
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{
                                            px: 4,
                                            py: 1.2,
                                            borderRadius: "12px",
                                            fontFamily: "GroteskBold",
                                            backgroundColor: "#10045c",
                                            "&:hover": { backgroundColor: "#24157a" },
                                        }}
                                    >
                                        {selectedFile ? "✅ Imagen lista" : "📸 Subir Imagen"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                        />
                                    </Button>
                                </Box>

                                <FormControl fullWidth>
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                        value={formData.estado}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        label="Estado"
                                        sx={{ borderRadius: "12px", backgroundColor: "#fff" }}
                                    >
                                        <MenuItem value={true}>Activo</MenuItem>
                                        <MenuItem value={false}>Inactivo</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* Botones centrados abajo del formulario */}
                                <Box display="flex" justifyContent="center" gap={2} mt={2}>
                                    <Button
                                        onClick={handleClose}
                                        variant="outlined"
                                        sx={{
                                            borderRadius: "12px",
                                            px: 4,
                                            py: 1,
                                            borderColor: "#10045c",
                                            color: "#10045c",
                                            fontFamily: "GroteskBold",
                                            "&:hover": { backgroundColor: "#eee" },
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        variant="contained"
                                        sx={{
                                            borderRadius: "12px",
                                            px: 4,
                                            py: 1,
                                            fontFamily: "GroteskBold",
                                            backgroundColor: "#10045c",
                                            "&:hover": { backgroundColor: "#24157a" },
                                        }}
                                    >
                                        Guardar
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                </DialogContent>

            </Dialog>

            {/* Popup de confirmación de eliminación */}
            <Dialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                PaperProps={{ sx: { borderRadius: "16px", p: 2 } }}
            >
                <DialogTitle
                    sx={{
                        fontFamily: "GroteskBold",
                        textAlign: "center",
                        color: "#10045c",
                    }}
                >
                    ⚠️ Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ textAlign: "center", fontFamily: "GroteskRegular" }}>
                        ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setDeleteOpen(false)}
                        sx={{
                            borderRadius: "12px",
                            px: 4,
                            borderColor: "#10045c",
                            color: "#10045c",
                            fontFamily: "GroteskBold",
                            "&:hover": { backgroundColor: "#eee" },
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            await handleDelete(deleteId);
                            setDeleteOpen(false);
                        }}
                        sx={{
                            borderRadius: "12px",
                            px: 4,
                            fontFamily: "GroteskBold",
                            backgroundColor: "#c62828",
                            "&:hover": { backgroundColor: "#b71c1c" },
                        }}
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProdDonaciones;
