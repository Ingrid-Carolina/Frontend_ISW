import './Home.css';
import Container_izquierda from '../components/Container-izquierda';
import Container_derecha from '../components/Container-derecha';
import SeccionInfo from '../components/SeccionInfo';
import * as React from 'react';
import MediaCard from '../components/Card';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';



const Acordeon = () => (
  <section className="acordeon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',width: '100vw',height: 'auto'}}>
    <div className="content" style={{ width: '100%', maxWidth: '800px', textAlign: 'center' }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" style={{ margin: '0 auto' }}>Pasión por el Juego</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography >
            Inculcamos el amor y la alegría por el béisbol en cada práctica y partido, celebrando cada esfuerzo y cada logro.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span" style={{ margin: '0 auto' }}>Desarrollo Integral</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nos enfocamos no solo en las habilidades deportivas, sino también en el crecimiento personal, académico y social de cada jugador, preparándolos para los desafíos dentro y fuera del campo.
          </Typography>
        </AccordionDetails>
      </Accordion>
       <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" style={{ margin: '0 auto' }}>Respeto</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography >
            Promovemos el respeto mutuo entre jugadores, entrenadores, padres y árbitros, reconociendo la importancia de la deportividad y el juego limpio.
          </Typography>
        </AccordionDetails>
      </Accordion>
       <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" style={{ margin: '0 auto' }}>Trabajo en Equipo</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography >
            Enseñamos que el éxito se construye juntos, valorando la colaboración, la comunicación y el apoyo entre compañeros.
          </Typography>
        </AccordionDetails>
      </Accordion>
       <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" style={{ margin: '0 auto' }}>Disciplina y Esfuerzo</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography >
            Fomentamos la dedicación, la constancia y el compromiso con el entrenamiento y la mejora continua, entendiendo que el esfuerzo es la clave del progreso.
          </Typography>
        </AccordionDetails>
      </Accordion>
       <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" style={{ margin: '0 auto' }}>Integridad</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography >
            Actuamos con honestidad y transparencia en todas nuestras acciones, siendo un ejemplo de ética y buenas prácticas en la comunidad.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  </section>
);


const AboutUs = () => (
  <section className="about-us">
    <h2>Sobre Nosotros</h2>
    <h3>Somos una organizacion que fomenta la recreacion del beisbol. Formamos Vidas a a traves del Beisbol en Honduras!</h3>
  </section>
);

const Mision=()=>(
  <SeccionInfo
    titulo="Nuestra Mision"
    descripcion="Fomentar el amor por el béisbol en niños y jóvenes, proporcionando un ambiente seguro, divertido y educativo donde puedan desarrollar sus habilidades atléticas, cultivar valores como el respeto, la disciplina y el trabajo en equipo, y construir amistades duraderas que trasciendan el campo de juego."
    imagen="/src/Ima/Mision1.jpg"
    bgColor="#e06c14"
    textAlign="left"
  />
);

const Vision=()=>(
  <SeccionInfo
    titulo="Nuestra Vision"
    descripcion="Que cada niño y joven de nuestra comunidad vea en el béisbol no solo un juego, sino un camino para crecer como deportista y persona, soñando en grande y llevando nuestros valores a cada paso de su vida."
    imagen="/src/Ima/Vision1.jpg"
    invertir
    bgColor="#10045c"
    textAlign="right"
  />
);

const Valores=()=>(
  <><Container_izquierda titulo="Valores" descripcion="Nuestros Valores definen lo que nosotros somos en el area de juego." imagen="https://th.bing.com/th/id/R.3542c315556f6cd5053c1c6699d503c1?rik=WeUM6r8MwY6Hsw&riu=http%3a%2f%2f2.bp.blogspot.com%2f-oR69JU7Nf3o%2fUnfFlBmAWyI%2fAAAAAAAAAAg%2fM3UmdmJNlKQ%2fs1600%2fBaseball-Player.jpg&ehk=rpekbnnJ%2bTYJndePR3HKkeCQ4P9siU7E48OUb7G1XZ4%3d&risl=&pid=ImgRaw&r=0" /></>
);

const Noticias_Eventos =()=>(

<section className='noticias'>
   <h2>Noticias y Eventos</h2>
    <p>Últimas novedades de la Asociación.</p>
</section>

);

const Cards = () => (

  <section className="cards">
  <MediaCard title="Embajadores Fundación Angelitos"
  content="Unidos por una causa que trasciende el deporte, Somos una gran familia que cree en el poder de la solidaridad, en la unión de corazones y en la importancia de tender la mano cuando más se necesita.
Nos honra compartirles que somos Embajadores de la Fundación Angelitos - Recién Nacidos del Hospital Escuela, y llevaremos su mensaje con orgullo dentro y fuera del campo."
image="https://th.bing.com/th/id/OIP.H-VR5oO-zt3RacllWQKGsAHaFj?rs=1&pid=ImgDetMain"
date="10 de Mayo de 2025"
/>
<MediaCard title="Torneo LBMM 2025:  ¡Nuestros Pilotos Dejarán Huella en el Torneo LBMM 2025!"
content="Estamos increíblemente orgullosos de la participación de nuestro equipo menor en el torneo de la Liga de Béisbol Menor Metropolitana (LBMM) 2025. Desde el primer lanzamiento hasta el último out, nuestros jóvenes atletas demostraran un espíritu inquebrantable, una pasión contagiosa por el juego y, sobre todo, una deportividad ejemplar."
image="https://www.alamy.com/aggregator-api/download?url=https://c8.alamy.com/comp/P3F3HY/young-soccer-players-holding-trophy-boys-celebrating-soccer-football-championship-winning-team-of-sport-tournament-for-kids-children-P3F3HY.jpg"
date=" 5 de Abril de 2022"/>
<MediaCard title="Noche Benéfica: ¡Únete a Nuestra Noche Benéfica por el Béisbol Menor!"
content=" ¡Prepárense para una noche inolvidable de diversión, comunidad y, por supuesto, béisbol! Nos complace anunciar nuestra Noche Benéfica, un evento crucial para recaudar fondos y asegurar que nuestros jóvenes atletas sigan teniendo las mejores oportunidades para crecer y brillar en el campo."
image="https://th.bing.com/th/id/OIP.9SKrTRCaLbaVmimjan-23AHaD4?rs=1&pid=ImgDetMain"
date=" 30 de Mayo de 2025"/>
</section>
);


/*Despues de las tres historias, meter un boton de Mas Noticias que redireccione a la subpagina de Noticias*/


function Home() {
  return (
    <div style={{ paddingTop: '90px' }}> {/* Ajusta el valor según la altura real de tu navbar */}
      <div className="header">
        <div className="header-title">
          <p>ASOCIACION DE</p>
          <p>BEISBOL MENOR</p>
          <p>PILOTOS DE HONDURAS</p>
        </div>
      </div>
      <AboutUs />
      <Mision />
      <Vision />
      <Valores />
      <Acordeon />
      <Noticias_Eventos />
      <Cards />
      <div className="news-button">
        <button>Mas Noticias</button>
      </div>
    </div>
  );
}

export default Home;
