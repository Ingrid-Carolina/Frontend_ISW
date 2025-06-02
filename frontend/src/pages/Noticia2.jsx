import React from "react";
import './Noticia.css';
import Divider from '@mui/material/Divider';
import CampeonatoBeisbol from '/Images/CampeonatoBeisbol.jpg';


const Noticia2=()=>(

    <div style={{ paddingTop: '90px' }}>
                <div className="titulo-noticia">
                <h1>Torneo LBMM 2025:  ¡Nuestros Pilotos Dejarán Huella en el Torneo LBMM 2025!</h1>  
                </div>
            <div className="date-noticia">5 de Abril de 2022</div>
            <Divider style={{ margin: '2rem 0' }} />
            <div className="container-image">
                <img src={CampeonatoBeisbol} alt="Imagen" className="enhanced" />
            </div>
            <div className="contenido-noticia">
                Estamos increíblemente orgullosos de la participación de nuestro equipo menor en el torneo de la Liga de Béisbol Menor Metropolitana (LBMM) 2025. Desde el primer lanzamiento hasta el último out, nuestros jóvenes atletas demostraran un espíritu inquebrantable, una pasión contagiosa por el juego y, sobre todo, una deportividad ejemplar.

A lo largo del torneo, nuestros pequeños gigantes mostrarán no solo sus crecientes habilidades en el campo, sino también los valores que tanto nos esforzamos en inculcar: trabajo en equipo, respeto y disciplina. Cada carrera anotada, cada jugada defensiva y cada out serán un reflejo del esfuerzo y la dedicación que ponen en cada entrenamiento.

¡El futuro de nuestro béisbol brilla con intensidad gracias a estos jóvenes talentos! ¡Formando vidas a travez del Béisbol!
            </div>
            
    </div>

);

export default Noticia2;