// Importa React para crear componentes
import React from "react";
// Importa los estilos específicos para la noticia
import './Noticia.css';
// Importa el componente Divider de Material UI para separar visualmente secciones
import Divider from '@mui/material/Divider';
// Importa la imagen local (no se usa en este render, pero está disponible)
import Angelitos2 from '/Images/Angelitos2.jpeg';


// Componente funcional que muestra la noticia sobre la Fundación Angelitos
const Noticia1 = () => (
    // Contenedor principal con padding superior para separar del header
    <div style={{ paddingTop: '90px' }}>
        {/* Título de la noticia, usa clase para estilos personalizados */}
        <div className="titulo-noticia">
            <h1>Embajadores Fundación Angelitos</h1>  
        </div>
        {/* Fecha de la noticia, estilizada con clase */}
        <div className="date-noticia">10 de Mayo de 2025</div>
        {/* Separador visual entre la fecha y el contenido */}
        <Divider style={{ margin: '2rem 0' }} />
        {/* Imagen principal de la noticia, centrada y con bordes redondeados */}
        <div className="container-image">
            <img 
                src="https://th.bing.com/th/id/OIP.H-VR5oO-zt3RacllWQKGsAHaFj?rs=1&pid=ImgDetMain" 
                alt="Imagen" 
                className="enhanced"
            />
        </div>
        {/* Contenido textual de la noticia, justificado y estilizado */}
        <div className="contenido-noticia">
            {/* Texto que narra la historia y el mensaje de la Fundación Angelitos */}
            Unidos por una causa que trasciende el deporte, Somos una gran familia que cree en el poder de la solidaridad, en la unión de corazones y en la importancia de tender la mano cuando más se necesita.
            Nos honra compartirles que somos Embajadores de la Fundación Angelitos - Recién Nacidos del Hospital Escuela, y llevaremos su mensaje con orgullo dentro y fuera del campo.

            La Fundación Angelitos nos ha permitido ver la vida desde una perspectiva más humana, más sensible, y hoy tenemos el agrado de aportar nuestro granito de arena a una causa que ilumina tantas vidas.

            En conmemoración de este día, y con el valioso apoyo de nuestro patrocinador Mobile Spot Honduras, nos enorgullece presentarles nuestra nueva camisa que llevará consigo algo más que colores: llevará historias, luchas y esperanza. Esta no es solo una prenda deportiva, es un símbolo.

            Un símbolo de nuestros valores que son un estandarte en nuestro equipo: unión, empatía y lucha. Esta camisa refleja los colores de la Fundación Angelitos y también representa nuestro compromiso con causas tan sensibles como el cáncer infantil y el cáncer de mama.

            Cada vez que nuestros niños y jóvenes vistan esta camiseta, llevaremos con orgullo no solo nuestros sueños deportivos, sino también el compromiso de dar visibilidad a quienes luchan día a día con valentía, llevando un mensaje de esperanza a muchas familias. Será un recordatorio de que juntos podemos ser parte del cambio, de que podemos Formar vidas a través del Béisbol y que hay más dicha en dar que en recibir.

            Inculcamos el amor y la alegría por el béisbol en cada práctica y partido, celebrando cada esfuerzo y cada logro.
        </div>
        {/* Fin del contenido de la noticia */}
    </div>
);

// Exporta el componente para que pueda ser usado en rutas u otros componentes
export default Noticia1;