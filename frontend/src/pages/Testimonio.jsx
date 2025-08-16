import React, { useState, useEffect } from 'react';
import TestimonioTrapezoide from '../components/TestimonioTrapezoide';
import VidCarousel from '../components/VideoCarousel';
import ReactPlayer from 'react-player';
import Hero from '../components/Hero';
//import axios from 'axios';
import { api } from '../api/api';

const videos = [
	{ url: 'https://youtu.be/CSfEwT8x6B0?si=OJpKv5GCK71caBu6' },
	{ url: 'https://youtu.be/7AU0m2Du_VY?si=LTod5L0RJbvHzoPS' },
	{ url: 'https://youtu.be/bx242zV3_ME?si=9_1EAN8m6DVhIagp' },
];


const PaginaTestimonios = () => {

  const [testimonios, setTestimonios] = useState([]);
  const roles = [
  "Jugador Profesional – Categoría Infantil",
  "Jugador Profesional – Categoría Intermedia",
  "Jugador Profesional – Categoría Juvenil",
  "Madre de jugador – Categoría Juvenil",
];


   useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        const res = await api.get('/auth/obtenertestimonios');
        const testimonios = res.data; //estoy trasladando a testimonios el fetch de la tabla del formato JSON sended del res en Authcontroller
 
       
 
        const testimoniosLista = testimonios.map(testimonio => ({ //transformo my res.data en un array que el frontend pueda leer
            id: testimonio.id_testimonio,
            nombre: testimonio.nombre,
            cita: testimonio.contenido,
            imagen: testimonio.imagen,
        }));

        setTestimonios(testimoniosLista);
        console.log(testimonios);

 
      } catch (err) {
        console.error('Error al obtener testimonios:', err);
      }
    };
 
    fetchTestimonios();
  }, []);

return (
    <div>
      <Hero/>
      {testimonios.map((testimonio, index) => {
        const invertir = index % 2 === 1;
        const superponer = index !== 0;
        const invertirDiagonal = index % 2 === 0;
        const zIndex = 6 - (index % 6);
        const rol = roles[Math.floor(Math.random() * roles.length)];

        return (
          <TestimonioTrapezoide
            key={index}
            {...testimonio}
            rol={rol}
            invertir={invertir}
            superponer={superponer}
            invertirDiagonal={invertirDiagonal}
            colorFondo={index % 2 === 0 ? '#c65402' : '#044c94'}
            zIndex={zIndex}
            finalTest={index === testimonios.length - 1}
          />
        );
      })}
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
