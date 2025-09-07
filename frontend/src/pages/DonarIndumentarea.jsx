import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { Visibility } from "@mui/icons-material"; // 👈 icono ojo
import fondo from "/Images/TestimonioFondo1.jpg";
import { api } from "../api/api";

const DonarIndumentarea = () => {
  const navigate = useNavigate();
  const [seleccion, setSeleccion] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    dia: "",
    horario: "",
    descripcion: "",
  });

  // 🔹 Modal para ficha completa
  const [modalFicha, setModalFicha] = useState({ open: false, producto: null });

  const getImagen = (imagen) => {
    if (!imagen) return "/Images/producto_defecto.png";
    return imagen.startsWith("/Images/") ? imagen : "/Images/producto_defecto.png";
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/auth/productos");
        const productos = res.data.productos || [];

        // Filtrar solo los productos activos (estado === true)
        const productosActivos = productos
          .filter(p => p.estado === true)
          .map((p) => ({ ...p, checked: false, cantidad: 0 }));

        setSeleccion(productosActivos);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        alert("No se pudieron cargar los productos.");
      }
    };
    fetchProductos();
  }, []);

  const handleCheckbox = (id) => {
    setSeleccion((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked, cantidad: !item.checked ? 1 : 0 }
          : item
      )
    );
  };

  const handleCantidad = (id, cantidad) => {
    setSeleccion((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: parseInt(cantidad) } : item
      )
    );
  };

  const confirmarDonacion = () => {
    const donaciones = seleccion.filter((item) => item.checked && item.cantidad > 0);
    if (donaciones.length === 0) {
      alert("Por favor selecciona al menos una pieza de indumentaria para donar.");
      return;
    }
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const donaciones = seleccion
      .filter((item) => item.checked && item.cantidad > 0)
      .map((item) => ({ nombre: item.nombre, cantidad: item.cantidad }));

    try {
      await api.post("/auth/enviar-donacion", {
        datos: formData,
        donaciones,
      });
      alert("¡Gracias por tu donación! Te contactaremos pronto.");
      setOpen(false);
      navigate("/donaciones");
    } catch (error) {
      console.error("Error al enviar donación:", error);
      alert("Hubo un error al enviar la donación. Intenta de nuevo.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "2rem", paddingBottom: "14rem", position: "relative" }}>
      {/* Fondo */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundColor: "#10045c" }} />
      <div
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.3,
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      />

      {/* Contenido */}
      <div style={{ position: "relative", zIndex: 2, padding: "2rem", paddingTop: "6rem" }}>
        <h1 style={{ textAlign: "center", marginBottom: "1rem", fontFamily: "GroteskBold", color: "#fff" }}>
          Donación de Indumentaria
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {seleccion.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "1rem",
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "#000",
                position: "relative",
              }}
            >
              <img
                src={getImagen(item.imagen)}
                alt={item.nombre}
                onError={(e) => (e.target.src = "/Images/producto_defecto.png")}
                style={{ width: "70%", height: "50%", objectFit: "cover", borderRadius: "8px" }}
              />
              <h3
                style={{
                  fontFamily: "GroteskBold",
                  margin: "1rem 0",
                  whiteSpace: "nowrap",          // evita salto de línea
                  overflow: "hidden",            // corta el contenido que sobra
                  textOverflow: "ellipsis",      // agrega ...
                }}
              >
                {item.nombre}
              </h3>
              <p
                style={{
                  fontFamily: "GroteskRegular",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  display: "-webkit-box",        // necesario para truncar múltiples líneas
                  WebkitLineClamp: 3,            // máximo de líneas
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.descripcion}
              </p>

              {/* Checkbox y cantidad */}
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheckbox(item.id)}
                />{" "}
                Seleccionar
              </div>
              <input
                type="number"
                min="1"
                max="100"
                value={item.cantidad}
                disabled={!item.checked}
                onChange={(e) => handleCantidad(item.id, e.target.value)}
                style={{ width: "60px", textAlign: "center" }}
              />

              {/* 👁 Botón ojo */}
              <IconButton
                onClick={() => setModalFicha({ open: true, producto: item })}
                style={{ position: "absolute", top: "10px", right: "10px", color: "#10045c" }}
              >
                <Visibility />
              </IconButton>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button
            onClick={confirmarDonacion}
            style={{
              padding: "0.8rem 2rem",
              fontFamily: "GroteskBold",
              fontSize: "1rem",
              backgroundColor: "#ff6600",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Confirmar Donación
          </button>
        </div>
      </div>

      {/* Modal formulario */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Completar información de la donación</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Telefono" name="telefono" value={formData.telefono} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Correo electronico" type="email" name="correo" value={formData.correo} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Día disponible" type="date" name="dia" value={formData.dia} onChange={handleChange} margin="normal" required InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Hora disponible" type="time" name="horario" value={formData.horario} onChange={handleChange} margin="normal" required InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Descripcion de lo donado" name="descripcion" value={formData.descripcion} onChange={handleChange} margin="normal" multiline rows={3} />
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="contained">Enviar Donación</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal ficha completa */}
      <Dialog
        open={modalFicha.open}
        onClose={() => setModalFicha({ open: false, producto: null })}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography
            variant="h4"
            align="center"
            sx={{ fontFamily: "GroteskBold", fontSize: "2rem" }}
          >
            {modalFicha.producto?.nombre}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center" }}>
            <img
              src={modalFicha.producto?.imagen ? `${window.location.origin}${modalFicha.producto.imagen}` : "/Images/producto_defecto.png"}
              alt={modalFicha.producto?.nombre}
              onError={(e) => { e.target.onerror = null; e.target.src = "/Images/producto_defecto.png"; }}
              style={{
                width: "50%",
                height: "50%",
                objectFit: "contain",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            />
            <Typography
              align="center"
              sx={{ fontSize: "1.2rem", fontFamily: "GroteskRegular", mt: 1 }}
            >
              {modalFicha.producto?.descripcion}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalFicha({ open: false, producto: null })}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DonarIndumentarea;
