import React from 'react';
import './SeccionInfo.css';

const SeccionInfo = ({ titulo, descripcion, imagen, invertir, bgColor, textAlign, imagenComponent }) => {
  return (
    <section className={`seccion-info ${invertir ? 'invertir' : ''}`} style={{ backgroundColor: bgColor, textAlign }}>
      <div className="seccion-texto">
        <h2>{titulo}</h2>
        <p>{descripcion}</p>
      </div>
      <div className="seccion-imagen">
        {imagenComponent ? (
          // Si se pasa un componente de imagen, lo renderizamos
          imagenComponent
        ) : (
          // De lo contrario, renderizamos una etiqueta <img> estándar
          <img src={imagen} alt={titulo} />
        )}
      </div>
    </section>
  );
};

export default SeccionInfo;