import React from 'react';
import TestimonioTrapezoide from '../components/TestimonioTrapezoide';

const PaginaTestimonios = () => {
  return (
    <div style={{ paddingTop: '90px' }}>
      <section className="testimonios-titulo">
        <h1>Testimonios</h1>
      </section>
      <TestimonioTrapezoide
        nombre="Diego Sánchez"
        cita="Me gusta mucho venir a entrenar porque juego con mis amigos y aprendemos cosas nuevas todos los días. Cada práctica es divertida y me hace sentir parte de algo grande."
        rol="Jugador Profesional – Categoría Infantil"
        imagen="/Images/JugadorPrueba1.jpg"
        colorFondo="#ea6304"
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
        colorFondo="#ea6304"
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
    </div>
  );
};

export default PaginaTestimonios;
