// frontend/src/components/Post.jsx es un componente de React que representa una publicación o noticia. 
// Muestra categorías, título, fecha, imagen, extracto, ubicación y hora. 
// Utiliza CSS para los estilos y está diseñado para ser responsivo.
import React from 'react';
import './Post.css';

const Post = ({ categories = [], title, date, image, excerpt, location, time }) => {
	return (
		<div className="post">
			{categories.length > 0 && (
				<div className="post-categories">
					{categories.map((cat, index) => (
						<span key={index} className="post-category">
							{cat.toUpperCase()}
							{index < categories.length - 1 && ' • '}
						</span>
					))}
				</div>
			)}

			<h3 className="post-title">{title}</h3>
			{date && <p className="post-date">{date}</p>}
			{image && <img src={image} alt="Post" className="post-image" />}
			{location && <p className="post-location">📍 {location}</p>}
			{time && <p className="post-time">🕒 {time}</p>}
			{excerpt && <p className="post-excerpt">{excerpt}</p>}
		</div>
	);
};

export default Post;
