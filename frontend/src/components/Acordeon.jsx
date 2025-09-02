
import './Acordeon.css';
import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const valores = [
  {
    titulo: 'Pasión por el Juego',
    descripcion: 'Inculcamos el amor y la alegría por el béisbol en cada práctica y partido, celebrando cada esfuerzo y cada logro.'
  },
  {
    titulo: 'Desarrollo Integral',
    descripcion: 'Nos enfocamos no solo en las habilidades deportivas, sino también en el crecimiento personal, académico y social de cada jugador.'
  },
  {
    titulo: 'Respeto',
    descripcion: 'Promovemos el respeto mutuo entre jugadores, entrenadores, padres y árbitros.'
  },
  {
    titulo: 'Trabajo en Equipo',
    descripcion: 'Enseñamos que el éxito se construye juntos, valorando la colaboración, la comunicación y el apoyo entre compañeros.'
  },
  {
    titulo: 'Disciplina y Esfuerzo',
    descripcion: 'Fomentamos la dedicación, la constancia y el compromiso con el entrenamiento y la mejora continua.'
  },
  {
    titulo: 'Integridad',
    descripcion: 'Actuamos con honestidad y transparencia en todas nuestras acciones.'
  }
];

const Acordeon = () => (
  <section className="acordeon">
    <div className="content">
      {valores.map((valor, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">{valor.titulo}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{valor.descripcion}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  </section>
);

export default Acordeon;

