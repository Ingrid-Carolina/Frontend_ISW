import React from 'react';
import './Container-derecha.css'

const Container_derecha = ({ titulo, descripcion, imagen }) => {
	return (
		<div className='team-container'>
			<div className='team-body'>
				<h1 className='team-title'> {titulo}</h1>
				<p className='team-description'>{descripcion}</p>
			</div>
			<div className='team-image'>
				<img
					src={imagen} // Replace with your image URL
					alt='Imagen del Container'
				/>
			</div>
		</div>
	);
};

export default Container_derecha;
