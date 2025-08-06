import React from 'react';
import TestimonioTrapezoide from '../components/TestimonioTrapezoide';
import VidCarousel from '../components/VideoCarousel';
import ReactPlayer from 'react-player';
import Hero from '../components/Hero';

const videos = [
	{ url: 'https://youtu.be/4VNYG77bQA4?si=mvj9fQJ2bgo5S_Lj' },
	{ url: 'https://youtu.be/7AU0m2Du_VY?si=LTod5L0RJbvHzoPS' },
	{ url: 'https://youtu.be/bx242zV3_ME?si=9_1EAN8m6DVhIagp' },
];
const freaky = [
	{ url: 'https://youtu.be/CkMF9adhlkM?si=yfuo1aen3TCEcAjp' },
	{ url: 'https://youtu.be/2gj9wficEdk?si=fTXQXqSKCMhKaXz6' },
	{ url: 'https://youtu.be/u5NqO2v_xnY?si=oVtEUlkh4iDo_eEb' },
];

const PaginaTestimonios = () => {
  return (
    <div>
      <Hero /> 
      <TestimonioTrapezoide
        nombre="Diego Sánchez"
        cita="Me gusta mucho venir a entrenar porque juego con mis amigos y aprendemos cosas nuevas todos los días. Cada práctica es divertida y me hace sentir parte de algo grande."
        rol="Jugador Profesional – Categoría Infantil"
        imagen="/Images/JugadorPrueba1.jpg"
        colorFondo="#c65402"
        invertir={false}
        superponer={false}
        zIndex={4}
        invertirDiagonal={true}
      />
      <TestimonioTrapezoide
        nombre="Juan Carlos Rivera"
        cita="Antes era muy tímido, pero gracias al equipo aprendí a confiar en mí y a trabajar con los demás. Ahora me esfuerzo más en todo lo que hago, tanto en el campo como en la escuela."
        rol="Jugador Profesional – Categoría Intermedia"
        imagen="/Images/JugadorPrueba2.jpg"
        colorFondo="#044c94"
        invertir={true}
        superponer={true}
        zIndex={3}
        invertirDiagonal={false}
      />
      <TestimonioTrapezoide
        nombre="Mateo López"
        cita="Esta liga me ayudó a crecer como persona y jugador. Hoy tengo metas más claras, quiero seguir entrenando fuerte y llegar lejos en el béisbol."
        rol="Madre de jugador – Categoría Juvenil"
        imagen="/Images/JugadorPrueba3.jpg"
        colorFondo="#c65402"
        invertir={false}
        superponer={true}
        zIndex={2}
        invertirDiagonal={true}
      />
      <TestimonioTrapezoide
        nombre="Miguel Hernández"
        cita="Esta liga me ayudó a crecer como persona y jugador. Hoy tengo metas más claras, quiero seguir entrenando fuerte y llegar lejos en el béisbol."
        rol="Jugador Profesional – Categoría Juvenil"
        imagen="/Images/JugadorPrueba4.jpg"
        colorFondo="#044c94"
        invertir={true}
        superponer={true}
        zIndex={1}
        invertirDiagonal={true}
        finalTest={true}
      /> 
      <section className="testimonios-titulo">
        <h1>Testimonios en Video</h1>
      </section>
      <div style={{ marginTop: '50px', marginBottom:'50px' }}>
			<VidCarousel videos={videos} />
      </div>
      
		</div>
    
  );
};

export default PaginaTestimonios;
