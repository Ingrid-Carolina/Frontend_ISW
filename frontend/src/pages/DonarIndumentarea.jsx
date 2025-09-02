import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import fondo from "/Images/TestimonioFondo1.jpg";
import guante from "/Images/guante.jpg";
import bate from "/Images/bate.jpg";
import pelota from "/Images/pelota.jpg";
import casco from "/Images/casco.jpg";
import uniforme from "/Images/uniforme.jpg";
import guante2 from "/Images/receptor.jpeg";
import mascara from "/Images/mask.jpg";
import protector from "/Images/pechera.jpeg";
import espinilleras from "/Images/espinilleras.jpg";

const indumentaria = [
  { id: 1, nombre: "Guante de béisbol", imagen: guante },
  { id: 2, nombre: "Bate", imagen: bate },
  { id: 3, nombre: "Pelota", imagen: pelota },
  { id: 4, nombre: "Casco de bateo", imagen: casco },
  { id: 5, nombre: "Uniforme (camiseta, pantalón, gorra,zapatos, guantes)", imagen: uniforme },
  { id: 6, nombre: "Guante de receptor (catcher’s mitt)", imagen: guante2 },
  { id: 7, nombre: "Máscara de receptor", imagen: mascara },
  { id: 8, nombre: "Protector de pecho", imagen: protector },
  { id: 9, nombre: "Espinilleras de receptor", imagen: espinilleras },
];

const DonarIndumentarea = () => {
  const navigate = useNavigate();
  const [seleccion, setSeleccion] = useState(
    indumentaria.map((pieza) => ({ ...pieza, checked: false, cantidad: 0 }))
  );

  // Estado modal y formulario
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    dia: "",
    horario: "",
    descripcion: "",
  });

  // Manejo selección de indumentaria
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

  // Confirmar donación → abre formulario
  const confirmarDonacion = () => {
    const donaciones = seleccion.filter((item) => item.checked && item.cantidad > 0);
    if (donaciones.length === 0) {
      alert("Por favor selecciona al menos una pieza de indumentaria para donar.");
      return;
    }
    setOpen(true);
  };

  // Manejo del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extraemos las piezas seleccionadas y sus cantidades
    const donaciones = seleccion
      .filter((item) => item.checked && item.cantidad > 0)
      .map((item) => ({
        nombre: item.nombre,
        cantidad: item.cantidad,
      }));

    try {
      await fetch("http://localhost:3000/auth/enviar-donacion", { // <-- tu endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datos: formData,
          donaciones: donaciones, // 👈 ahora se envían también las piezas
        }),
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
    <div
      style={{
        minHeight: "100vh",
        width: "100%",           // 🔹 asegura que nunca exceda el ancho de la pantalla
        maxWidth: "100vw",       // 🔹 nunca más ancho que el viewport
        position: "relative",
        margin: 0,
        paddingTop: "2rem",
        paddingBottom: "14rem",
        overflowX: "hidden",     // 🔹 evita el scroll horizontal
        color: "#fff",
        fontFamily: "GroteskRegular",
        backgroundImage: "linear-gradient(#10045c, #10045c, url('/Images/TestimonioFondo1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxSizing: "border-box", // 🔹 evita que padding aumente el ancho real
      }}
    >
      {/* Fondo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <div
          style={{
            backgroundColor: "#10045c",
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        ></div>
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
        ></div>
      </div>

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
            fontFamily: "GroteskBold",
            fontSize: "clamp(2rem, 5vw, 4rem)", // min 2rem, máx 4rem, fluido en medio
            marginBottom: "1rem",
            color: "#fff", // tu color original
            textAlign: "center", // centrado en pantallas pequeñas
          }}
        >
          Donación de Indumentaria
        </h1>

        <p
          style={{
            fontFamily: "GroteskRegular",
            marginBottom: "2rem",
            fontSize: "clamp(1rem, 3vw, 2rem)", // min 1rem, máx 2rem
            color: "#fff",
            textAlign: "center",
          }}
        >
          Selecciona las piezas que deseas donar y la cantidad.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // 🔹 más flexible
            gap: "1rem",
            width: "100%",       // 🔹 se ajusta al contenedor
            maxWidth: "100%",    // 🔹 no se pasa del viewport
            margin: "0 auto",    // 🔹 siempre centrado
            boxSizing: "border-box",
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
              }}
            >
              <img
                src={item.imagen}
                alt={item.nombre}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <h3 style={{ fontFamily: "GroteskBold", margin: "1rem 0" }}>{item.nombre}</h3>
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

      {/* Modal con formulario */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        sx={{ mt: "80px" }} // mueve el modal más abajo
      >
        <DialogTitle sx={{ fontFamily: "GroteskBold", fontSize: '1.7rem', color: '#10045c' }}>
          Completar información de la donación
        </DialogTitle>
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
              InputLabelProps={{ style: { fontFamily: "PeterMedium" } }}
              InputProps={{ style: { fontFamily: "PeterMedium" } }}
            />
            <TextField
              fullWidth
              label="Telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ style: { fontFamily: "PeterMedium" } }}
              InputProps={{ style: { fontFamily: "PeterMedium" } }}
            />
            <TextField
              fullWidth
              label="Correo electronico"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ style: { fontFamily: "PeterMedium" } }}
              InputProps={{ style: { fontFamily: "PeterMedium" } }}
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
              InputLabelProps={{ shrink: true, style: { fontFamily: "PeterMedium" } }}
              InputProps={{ style: { fontFamily: "PeterMedium" } }}
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
              InputLabelProps={{ shrink: true, style: { fontFamily: "PeterMedium" } }}
              InputProps={{ style: { fontFamily: "PeterMedium" } }}
            />

            <TextField
              fullWidth
              label="Descripcion de lo donado"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              InputLabelProps={{ style: { fontFamily: "PeterMedium" } }}
              InputProps={{ style: { fontFamily: "PeterMedium" } }}
            />

            <DialogActions>
              <Button onClick={() => setOpen(false)} sx={{ color: "#e06c14", fontFamily: "PeterMedium" }}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" backgroundColor="#e06c14" sx={{ color: 'white', fontFamily: "PeterMedium" }}>
                Enviar Donación
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonarIndumentarea;
