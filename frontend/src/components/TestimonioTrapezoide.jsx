import React from "react";
import { motion } from "framer-motion";
import "./TestimonioTrapezoide.css";

const TestimonioTrapezoide = ({
  nombre,
  cita,
  rol,
  imagen,
  colorFondo,
  invertir = false,
  superponer = false,
  zIndex = 1, // valor por defecto
  invertirDiagonal = false, // nuevo prop
  finalTest = false, // nuevo prop para el test final
}) => {
  return (
    <section
      className={`testimonio-container ${invertir ? "invertir" : ""} ${superponer ? "superpuesto" : ""} ${invertirDiagonal ? "invertir-diagonal": ""} ${finalTest ? "final-testim": ""}` }
      style={{ backgroundColor: colorFondo, zIndex: zIndex, position: 'relative' }}
    >
      <div className="testimonio-texto">
        <motion.h2
          initial={{ opacity: 0, x: invertir ? 100 : -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {nombre}
        </motion.h2>
        <motion.p
          className="cita"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          “{cita}”
        </motion.p>
        <p className="rol">{rol}</p>
      </div>

      <motion.div
        className="testimonio-imagen"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src={imagen} alt={`Foto de ${nombre}`} />
      </motion.div>
    </section>
  );
};

export default TestimonioTrapezoide;

