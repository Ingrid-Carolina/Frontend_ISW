import './Home.css';
import SeccionInfo from '../components/SeccionInfo';
import ValuesSection from '../components/ValuesSection';
import Acordeon from '../components/Acordeon';
import * as React from 'react';
import MediaCard from '../components/Card';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => (
	<section className='about-us'>
		<h2>Sobre Nosotros</h2>
		<h3>
			Somos una organizacion que fomenta la recreacion del beisbol. Formamos
			Vidas a a traves del Beisbol en Honduras!
		</h3>
	</section>
);

const Mision = () => (
	<SeccionInfo
		titulo='Nuestra Mision'
		descripcion='Fomentar el amor por el béisbol en niños y jóvenes, proporcionando un ambiente seguro, divertido y educativo donde puedan desarrollar sus habilidades atléticas, cultivar valores como el respeto, la disciplina y el trabajo en equipo, y construir amistades duraderas que trasciendan el campo de juego.'
		imagen='/Images/Mision1.jpg'
		bgColor='#e06c14'
		textAlign='left'
	/>
);

const Vision = () => (
	<SeccionInfo
		titulo='Nuestra Vision'
		descripcion='Que cada niño y joven de nuestra comunidad vea en el béisbol no solo un juego, sino un camino para crecer como deportista y persona, soñando en grande y llevando nuestros valores a cada paso de su vida.'
		imagen='/Images/Vision1.jpg'
		invertir
		bgColor='#10045c'
		textAlign='right'
	/>
);

const Valores = () => (
	<section className='values'>
		<h2>Nuestros Valores</h2>
		<h3>Nuestros Valores definen lo que nosotros somos en el area de juego.</h3>
	</section>
);

const Noticias_Eventos = () => (
	<section className='noteve'>
		<h2>Noticias y Eventos</h2>
		<h3>Ultimas novedades de la asociación.</h3>
	</section>
);

const Cards = () => (
	<div className='cards'>
		<MediaCard
			title='Embajadores Fundación Angelitos' to="/Noticia1"
			content='Unidos por una causa que trasciende el deporte, Somos una gran familia que cree en el poder de la solidaridad, en la unión de corazones y en la importancia de tender la mano cuando más se necesita.
    Nos honra compartirles que somos Embajadores de la Fundación Angelitos - Recién Nacidos del Hospital Escuela, y llevaremos su mensaje con orgullo dentro y fuera del campo.'
			image='https://th.bing.com/th/id/OIP.H-VR5oO-zt3RacllWQKGsAHaFj?rs=1&pid=ImgDetMain'
			date='10 de Mayo de 2025'
		/>
		<MediaCard
			title='Torneo LBMM 2025:  ¡Nuestros Pilotos Dejarán Huella en el Torneo LBMM 2025!' to="/Noticia2"
			content='Estamos increíblemente orgullosos de la participación de nuestro equipo menor en el torneo de la Liga de Béisbol Menor Metropolitana (LBMM) 2025. Desde el primer lanzamiento hasta el último out, nuestros jóvenes atletas demostraran un espíritu inquebrantable, una pasión contagiosa por el juego y, sobre todo, una deportividad ejemplar.'
			image='https://www.alamy.com/aggregator-api/download?url=https://c8.alamy.com/comp/P3F3HY/young-soccer-players-holding-trophy-boys-celebrating-soccer-football-championship-winning-team-of-sport-tournament-for-kids-children-P3F3HY.jpg'
			date=' 5 de Abril de 2022'
		/>
		<MediaCard
			title='Noche Benéfica: ¡Únete a Nuestra Noche Benéfica por el Béisbol Menor!' to="/Noticia3"
			content=' ¡Prepárense para una noche inolvidable de diversión, comunidad y, por supuesto, béisbol! Nos complace anunciar nuestra Noche Benéfica, un evento crucial para recaudar fondos y asegurar que nuestros jóvenes atletas sigan teniendo las mejores oportunidades para crecer y brillar en el campo.'
			image='https://th.bing.com/th/id/OIP.9SKrTRCaLbaVmimjan-23AHaD4?rs=1&pid=ImgDetMain'
			date=' 30 de Mayo de 2025'
		/>
	</div>
);

/*Despues de las tres historias, meter un boton de Mas Noticias que redireccione a la subpagina de Noticias*/

function Home() {
	const navigate= useNavigate();

    const onClick=()=>{

        navigate("/Eventos");
        window.scrollTo(0,0); //lo redirecciona exactamente al inicio de la pagina
    };
     
    return (
        <div style={{ paddingTop: '90px' }}>
            {' '}
            {/* Ajusta el valor según la altura real de tu navbar */}
            <div className='header'>
                <div className='header-title'>
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
            <div style={{ textAlign: 'center', margin: '2rem 0 4rem' }}>
                <button className='news-button' onClick={onClick}>Más Noticias</button>
            </div>
        </div>
    );

}

export default Home;
