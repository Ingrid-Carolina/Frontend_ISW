import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import parsePhoneNumberFromString from "libphonenumber-js";

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
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import fondo from "/Images/TestimonioFondo1.jpg";
import { api } from "../api/api";
import { red } from "@mui/material/colors";

const DonarIndumentarea = () => {
  const navigate = useNavigate();
  const [seleccion, setSeleccion] = useState([]);
  const [open, setOpen] = useState(false);
  const [errores, setErrores] = useState({});
  const [producto, setproducto] = useState("");
  const [cantidad, setcantidad] = useState("");
  const [displayPhone, setDisplayPhone] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    dia: "",
    horario: "",
    pais: "",
    descripcion: "",
    nombre_producto: "",
    cantidad: "",
  });

  // ✅ Estado para notificaciones
  const [notificacion, setNotificacion] = useState({ open: false, mensaje: "", tipo: "info" });

  // 🔹 Modal para ficha completa
  const [modalFicha, setModalFicha] = useState({ open: false, producto: null });

  const getImagen = (imagen) => {
    if (!imagen) return "/Images/producto_defecto.png";
    if (imagen.startsWith("http")) return imagen;       // Supabase u otro CDN
    if (imagen.startsWith("/Images/")) return imagen;   // Imágenes locales antiguas
    return "/Images/producto_defecto.png";              // Fallback
  };



  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await api.get("/auth/donaciones/productos");
        const productos = res.data.productos || [];
        const productosActivos = productos
          .filter((p) => p.estado === true)
          .map((p) => ({ ...p, checked: false, cantidad: 0 }));

        console.log(productosActivos);
        setSeleccion(productosActivos);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        // ❌ Antes: alert()
        setNotificacion({ open: true, mensaje: "No se pudieron cargar los productos.", tipo: "error" });
      }
    };
    fetchProductos();
  }, []);

  const handleCheckbox = (id) => {
    setSeleccion((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked, cantidad: !item.checked ? 1 : 0 }
          : item
      );

      const seleccionados = updated.filter((item) => item.checked);
      console.log("Productos seleccionados:", seleccionados);
      return updated;
    });
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
      // ❌ Antes: alert()
      setNotificacion({ open: true, mensaje: "Selecciona al menos una pieza de indumentaria.", tipo: "warning" });
      return;
    }
    setOpen(true);
  };

  // 🔹 Validaciones
  const ValidarErrores = () => {
    const errors = {};
    if (!formData.nombre || formData.nombre.trim().length < 3) {
      errors.nombre = "El nombre debe tener por lo menos 3 caracteres";
    }
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(formData.nombre.trim())) {
      errors.nombre = "El nombre solo debe contener letras y espacios válidos";
    }
    if (!formData.correo.trim()) {
      errors.email = "El correo electrónico es obligatorio";
    } else if (!/@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com)$/i.test(formData.correo)) {
      errors.email = "Solo se permiten correos de Gmail, Outlook, Hotmail o Yahoo";
    }
    if (formData.descripcion.trim().length < 15) {
      errors.descripcion = "Escribe al menos 15 caracteres";
    }
    setErrores(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ValidarErrores()) return;

    const donaciones = seleccion

      .filter((item) => item.checked && item.cantidad > 0)
      .map((item) => ({ nombre: item.nombre, cantidad: item.cantidad }));

    // Validar teléfono
    const rawPhone = formData.telefono?.replace(/\s+/g, "");
    const countryCode = formData.pais?.toUpperCase();
    const parsedPhone = parsePhoneNumberFromString(rawPhone, countryCode);
    formData.telefono = parsedPhone?.formatInternational?.() || formData.telefono;

    const body = {
      nombre: formData.nombre,
      telefono: formData.telefono,
      correo: formData.correo,
      dia: formData.dia,
      horario: formData.horario,
      descripcion: formData.descripcion,
    }


    try {

      const res = await api.post('/auth/registrardonacion', body, {
        headers: { "Content-Type": "application/json" }
      })

      const donaciondata = res.data;

      console.log(donaciondata);


    } catch (error) {

      const msg =
        error?.data?.mensaje || error?.message || 'Error en la Red';
      console.log(msg);

      setNotificacion({ open: true, mensaje: msg, tipo: "error" });
      setOpen(false);


    }


    setFormData({
      nombre: '',
      correo: '',
      telefono: '',
      pais: '',
      dia: '',
      horario: '',
      descripcion: ''
    });

    console.log(formData)

    // ✅ Éxito al enviar
    setNotificacion({ open: true, mensaje: "Donación enviada correctamente. ¡Gracias!", tipo: "success" });
    setOpen(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "2rem",
        paddingBottom: "14rem",
        position: "relative",
      }}
    >
      {/* ✅ Notificación flotante */}
      <Snackbar
        open={notificacion.open}
        autoHideDuration={4000}
        onClose={() => setNotificacion({ ...notificacion, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={notificacion.tipo}
          onClose={() => setNotificacion({ ...notificacion, open: false })}
          sx={{ width: "100%" }}
        >
          {notificacion.mensaje}
        </Alert>
      </Snackbar>

      {/* Fondo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundColor: "#10045c",
        }}
      />
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
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "2rem",
          paddingTop: "6rem",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontFamily: "GroteskBold",
            color: "#fff",
          }}
        >
          Donación de Indumentaria
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            justifyContent: "center",  // centra toda la grid, incluida la última fila
            justifyItems: "center",    // centra cada tarjeta dentro de su celda
            alignItems: "start",
            width: "100%",
          }}
        >
          {seleccion.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "1rem",
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "#000",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",       // se ajusta al minmax
                maxWidth: "300px",   // ancho uniforme de las tarjetas
                minHeight: "400px",  // altura uniforme
                position: "relative",
              }}
            >
              <img
                src={getImagen(p.imagen)}
                alt={p.nombre}
                onError={(e) => (e.target.src = "/Images/producto_defecto.png")}
                style={{
                  width: "80%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "0.5rem",
                  marginInline: "auto", // asegura que la imagen esté centrada
                }}
              />
              <h3
                style={{
                  fontFamily: "GroteskBold",
                  margin: "0.5rem 0",
                  fontSize: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.nombre}
              </h3>
              <p
                style={{
                  fontFamily: "GroteskRegular",
                  fontSize: "0.9rem",
                  flexGrow: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {p.descripcion}
              </p>

              <div
                style={{
                  margin: "0.3rem 0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={p.checked}
                  onChange={() => handleCheckbox(p.id)}
                />
                <span>Seleccionar</span>
              </div>

              <div
                style={{
                  marginBottom: "0.3rem",
                  textAlign: "center",
                }}
              >
                {p.checked && (
                  <span style={{ marginRight: "0.5rem" }}>Cantidad: {p.cantidad}</span>
                )}
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={p.cantidad}
                  disabled={!p.checked}
                  onChange={(e) => handleCantidad(p.id, e.target.value)}
                  style={{ width: "60px", textAlign: "center" }}
                />
              </div>

              <IconButton
                onClick={() => setModalFicha({ open: true, producto: p })}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "1px",
                  color: "#10045c",
                }}
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

      {/* Modal formulario con validaciones */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Completar información de la donación</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errores.nombre}
              helperText={errores.nombre}
            />
            <PhoneInput
              country={"us"}
              name="telefono"
              value={formData.telefono || ""}
              onChange={(value, country) => {
                const sanitized = value.replace(
                  new RegExp(`^\\+?${country.dialCode}`),
                  ""
                );
                const finalValue = `+${country.dialCode}${sanitized}`;
                setFormData({
                  ...formData,
                  telefono: finalValue,
                  pais: country.countryCode,
                });
                setErrores((prev) => ({ ...prev, telefono: "" }));
              }}
              onBlur={() => setDisplayPhone(formData.telefono)}
              inputProps={{
                name: "telefono",
                required: true,
                style: errores.telefono ? { borderColor: "red" } : {},
              }}
            />
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errores.email}
              helperText={errores.email}
            />
            <TextField
              fullWidth
              label="Día disponible"
              type="date"
              name="dia"
              value={formData.dia}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().split("T")[0] }}
            />
            <TextField
              fullWidth
              label="Hora disponible"
              type="time"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 60, min: "00:00", max: "23:59" }}
            />
            <TextField
              fullWidth
              label="Descripción de lo donado"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              required
              error={!!errores.descripcion}
              helperText={errores.descripcion}
            />
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="contained">
                Enviar Donación
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal ficha completa rediseñado */}
<Dialog
  open={modalFicha.open}
  onClose={() => setModalFicha({ open: false, producto: null })}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    style: {
      borderRadius: "20px",
      padding: "1rem",
      backgroundColor: "#f5f5f5",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    },
  }}
>
  <DialogContent
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: "1rem",
    }}
  >
    <img
      src={getImagen(modalFicha.producto?.imagen)}
      alt={modalFicha.producto?.nombre}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "/Images/producto_defecto.png";
      }}
      style={{
        width: "80%",
        maxHeight: "500px",
        objectFit: "cover",
        borderRadius: "15px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
      }}
    />
    <Typography
      variant="h4"
      sx={{
        fontFamily: "GroteskBold",
        fontSize: "1.8rem",
        color: "#10045c",
      }}
    >
      {modalFicha.producto?.nombre}
    </Typography>
    <Typography
      sx={{
        fontSize: "1rem",
        fontFamily: "GroteskRegular",
        color: "#333",
      }}
    >
      {modalFicha.producto?.descripcion}
    </Typography>

    {/* Botón cerrar centrado */}
    <Button
      variant="contained"
      onClick={() => setModalFicha({ open: false, producto: null })}
      sx={{
        mt: 2,
        backgroundColor: "#ff6600",
        color: "#fff",
        fontFamily: "GroteskBold",
        '&:hover': { backgroundColor: "#e65c00" },
        width: "50%",
        borderRadius: "10px",
      }}
    >
      Cerrar
    </Button>
  </DialogContent>
</Dialog>

    </div>
  );
};


export default DonarIndumentarea;