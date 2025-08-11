import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from '/Images/TestimonioFondo1.jpg';`url(${fondo})`
import guante from '/Images/guante.jpg';
import bate from '/Images/bate.jpg';
import pelota from '/Images/pelota.jpg';
import casco from '/Images/casco.jpg';
import uniforme from '/Images/uniforme.jpg';
import guante2 from '/Images/receptor.jpeg';
import mascara from '/Images/mask.jpg';
import protector from '/Images/pechera.jpeg';
import espinilleras from '/Images/espinilleras.jpg';

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
    alert("¡Gracias por tu donación de indumentaria!");
    navigate("/donaciones");
  };

  return (
    <div
  style={{
    minHeight: "100vh",
    position: "relative",
    margin: 0,
    paddingTop: "2rem", // 6rem para dejar espacio a la navbar
    paddingBottom: "14rem", // 6rem para dejar espacio a la navbar
    overflowX: "hidden",
    color: "#fff",
    fontFamily: "GroteskRegular",
    backgroundImage: "linear-gradient(#10045c, #10045c, url('/Images/TestimonioFondo1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>

      {/* Fondo completo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        {/* Capa de color */}
        <div
          style={{
            backgroundColor: "#10045c",
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        ></div>
        {/* Capa de imagen */}
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
          paddingTop: "6rem", // Ajusta según altura navbar
        }}
      >
        <h1 style={{ fontFamily: "GroteskBold", fontSize: "4rem", marginBottom: "1rem" }}>
          Donación de Indumentaria
        </h1>
        <p style={{ marginBottom: "2rem", fontSize: "2rem" }}>
          Selecciona las piezas que deseas donar y la cantidad.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
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
    </div>
  );
};

export default DonarIndumentarea;
