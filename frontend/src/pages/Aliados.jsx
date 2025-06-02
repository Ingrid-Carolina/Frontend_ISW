import React from 'react';
import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';
import luz from '/Images/LUFUS.jpg';
import mobile from '/Images/Mob.jpg';
import dental from '/Images/d.jpg';
import angelitos from '/Images/fundacion.jpg';
import Faerea from '/Images/fuerzaAerea.jpg';
import './Aliados.css'; // Asegúrate de importar el CSS con fuentes y estilos

const partners = [
  {
    name: 'Luz y Fuerza de San Lorenzo S.A. (Lufussa)',
    img: luz,
    links: [
      { label: 'Visitar Página', href: 'https://lufussa.com/es/inicio/' },
      { label: 'Visita Facebook', href: 'https://www.facebook.com/LufussaHonduras/?locale=es_LA' }
    ]
  },
  {
    name: 'Mobile Spot Honduras',
    img: mobile,
    links: [
      { label: 'Visita Facebook', href: 'https://www.facebook.com/MobileSpothonduras' },
      { label: 'Visita Instagram', href: 'https://www.instagram.com/mobilespothn/?hl=es-la' }
    ]
  },
  {
    name: 'Dental D.',
    img: dental,
    links: [
      { label: 'Visita Facebook', href: 'https://www.facebook.com/Dentaldhn' },
      { label: 'Visita Instagram', href: 'https://www.instagram.com/dentaldhn/' }
    ]
  }
];

const strategicAllies = [
  {
    name: 'Fundacion Angelitos',
    img: angelitos,
    links: [
      { label: 'Visita Fundación', href: 'http://www.fundacionangelitos.org' },
      { label: 'Visita Facebook', href: 'https://www.facebook.com/fundacionangelitoshn' },
      { label: 'Visita Instagram', href: 'https://www.instagram.com/fundacionangelitoshn/' }
    ]
  },
  {
    name: 'Fuerza Aérea Hondureña',
    img: Faerea,
    links: [
      { label: 'Visita Facebook', href: 'https://www.facebook.com/FuerzaAereaHN/?locale=es_LA' },
      { label: 'Visita Instagram', href: 'https://www.instagram.com/fuerzaaereahn/?hl=es' }
    ]
  }
];

const PartnerSection = ({ name, img, links, reverse }) => (
  <section
    style={{
      maxWidth: '90vw',
      margin: '0 auto 5rem',
      display: 'flex',
      flexDirection: reverse ? 'row-reverse' : 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '2rem'
    }}
  >
    <div>
      <img src={img} alt={name} className='responsive-img' />
    </div>
    <div style={{ flex: 1 }}>
      <h2 className='partner-title'>{name}</h2>
      <Divider sx={{ height: '0.50vh', width: '38vw', backgroundColor: '#e06c14' }} />
      <p className='section-text'>
        Gracias al apoyo de nuestros aliados estratégicos, hemos podido implementar proyectos sociales,
        apoyar comunidades vulnerables y promover la educación ambiental en distintas regiones del país.
      </p>
      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        {links.map((link, index) => (
          <Button
            key={index}
            variant='outlined'
            href={link.href}
            target='_blank'
            rel='noopener noreferrer'
            sx={{
              mr: 2,
              mt: 1,
              border: '2px solid #e06c14',
              color: '#e06c14',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'white',
                color: '#10045c',
                borderColor: '#10045c'
              }
            }}
          >
            {link.label}
          </Button>
        ))}
      </div>
    </div>
  </section>
);

const Aliados = () => (
  <div style={{ padding: '4rem 2rem', backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
    <h1 className='heading-title' style={{ fontSize:'5rem' }}>Patrocinadores</h1>

    <p className='section-text' style={{ maxWidth: '75vw', margin: '0 auto 5rem', textAlign: 'center' }}>
      La Asociación de Béisbol Menor Pilotos de Honduras (FAH) cuenta con más de 76 años de historia desde su formación
      en 1948. Nuestro principal objetivo es la formación integral de jovenes atletas, no solo en el juego del béisbol,
      sino también en la generación de líderes y ciudadanos de sus comunidades y país.
    </p>

    {partners.map((partner, idx) => (
      <PartnerSection key={idx} {...partner} reverse={idx % 2 !== 0} />
    ))}

    <h1 className='heading-title' style={{ marginBottom: '5rem', fontSize:'5rem' }}>Alianzas Estrategicas</h1>

    {strategicAllies.map((ally, idx) => (
      <PartnerSection key={idx} {...ally} reverse={idx % 2 === 0} />
    ))}
  </div>
);

export default Aliados;
