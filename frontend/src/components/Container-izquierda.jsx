import React from "react";
import './Container-izquierda.css';

const Container_izquierda = ({ titulo, descripcion, imagen }) => {
	return (
		<div className='team-container-izquierda'>
  <div className='team-image-izquierda'>
    <img src={imagen} alt='Imagen del Container' />
  </div>
  <div className='team-body'>
    <h1 className='team-title'> {titulo}</h1>
    <p className='team-description'>{descripcion}</p>
  </div>
</div>
	);
};

export default Container_izquierda;