import React from 'react';
import './SeccionInfo.css';

const SeccionInfo = ({ titulo, descripcion, imagen, invertir, bgColor, textAlign }) => {
  return (
    <div className={`seccion-info ${invertir ? 'invertir' : ''}`} style={{ backgroundColor: bgColor}}>
      <div className="seccion-texto" style={{ textAlign: textAlign || 'left' }}>
        <h2>{titulo}</h2>
        <p>{descripcion}</p>
      </div>
      <div className="seccion-imagen">
        <img src={imagen} alt={`Imagen de ${titulo}`} />
      </div>
    </div>
  );
};

export default SeccionInfo;