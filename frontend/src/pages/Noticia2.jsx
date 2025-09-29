// Importa React para crear componentes funcionales
import React from "react";
// Importa los estilos específicos para la noticia
import './Noticia.css';
// Importa el componente Divider de Material UI para separar visualmente secciones
import Divider from '@mui/material/Divider';
// Importa la imagen local del campeonato de béisbol
import CampeonatoBeisbol from '/Images/CampeonatoBeisbol.jpg';


// Componente funcional que muestra la noticia sobre el Torneo LBMM 2025
const Noticia2 = () => (
    // Contenedor principal con padding superior para separar del header
    <div style={{ paddingTop: '90px' }}>
        {/* Título de la noticia, usa clase para estilos personalizados */}
        <div className="titulo-noticia">
            <h1>Torneo LBMM 2025:  ¡Nuestros Pilotos Dejarán Huella en el Torneo LBMM 2025!</h1>  
        </div>
        {/* Fecha de la noticia, estilizada con clase */}
        <div className="date-noticia">5 de Abril de 2022</div>
        {/* Separador visual entre la fecha y el contenido */}
        <Divider style={{ margin: '2rem 0' }} />
        {/* Imagen principal de la noticia, centrada y con bordes redondeados */}
        <div className="container-image">
            <img src={CampeonatoBeisbol} alt="Imagen" className="enhanced" />
        </div>
        {/* Contenido textual de la noticia, justificado y estilizado */}
        <div className="contenido-noticia">
            {/* Texto que narra la participación y valores del equipo en el torneo */}
            Estamos increíblemente orgullosos de la participación de nuestro equipo menor en el torneo de la Liga de Béisbol Menor Metropolitana (LBMM) 2025. Desde el primer lanzamiento hasta el último out, nuestros jóvenes atletas demostraran un espíritu inquebrantable, una pasión contagiosa por el juego y, sobre todo, una deportividad ejemplar.

            A lo largo del torneo, nuestros pequeños gigantes mostrarán no solo sus crecientes habilidades en el campo, sino también los valores que tanto nos esforzamos en inculcar: trabajo en equipo, respeto y disciplina. Cada carrera anotada, cada jugada defensiva y cada out serán un reflejo del esfuerzo y la dedicación que ponen en cada entrenamiento.

            ¡El futuro de nuestro béisbol brilla con intensidad gracias a estos jóvenes talentos! ¡Formando vidas a travez del Béisbol!
        </div>
        {/* Fin del contenido de la noticia */}
    </div>
);

// Exporta el componente para que pueda ser usado en rutas u otros componentes
export default Noticia2;