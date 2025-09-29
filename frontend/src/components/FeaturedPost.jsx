// FeaturedPost.jsx es un componente de React que muestra una publicación destacada con un título, 
// una parte resaltada del título y una fecha. 
// El componente utiliza CSS para los estilos y permite personalizar el estilo del contenedor a través de props.
import React from "react";
import './FeaturedPost.css'

// Componente FeaturedPost, utiliza titulo, highlight (parte del título a resaltar), fecha y estilo personalizado
const FeaturedPost = ({ title, highlight, date, style }) => {
    const [beforeHighlight, afterHighlight] = title.split(highlight);

    return (
        <div className="featured-post"  style={style}>
            <span className="featured-label">PUBLICACION DESTACADA</span>
            <h2 className="featured-title">
                {beforeHighlight}
                <span className="highlight-year">{highlight}</span>
                {afterHighlight}
            </h2>
            <p className="featured-date">{date}</p>
        </div>
    );
}

export default FeaturedPost;