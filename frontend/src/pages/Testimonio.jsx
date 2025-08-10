import React, { useState, useEffect } from 'react';
import TestimonioTrapezoide from '../components/TestimonioTrapezoide';
import VidCarousel from '../components/VideoCarousel';
import ReactPlayer from 'react-player';
import Hero from '../components/Hero';
import axios from 'axios';

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
        const res = await axios.get(
          'http://localhost:3000/auth/obtenertestimonios',
        );
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
        const zIndex = 4 - (index % 4);
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
