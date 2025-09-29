// NewsSection.jsx es un componente de React que muestra una sección de noticias con un título, fecha, contenido e imagen. 
// Utiliza CSS para los estilos y está diseñado para ser responsivo.
import './NewsSection.css';

function NewsSection({ titulo, fecha, contenido, imagen }) {
  return (
    <div className="noticia-container">
      <div className="noticia-header">
        <h1 className="noticia-titulo">{titulo}</h1>
        <p className="noticia-fecha">{fecha}</p>
        <hr className="noticia-separador" />
      </div>
      <div className="noticia-cuerpo">
        <img src={imagen} alt="Imagen de la noticia" className="noticia-img" />
        <p className="noticia-texto">{contenido}</p>
      </div>
    </div>
  );
}
export default NewsSection;
