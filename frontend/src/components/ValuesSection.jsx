// Componente ValuesSection.jsx es un componente de React que muestra una sección de valores con títulos y descripciones en un diseño estilizado.
// Utiliza CSS para los estilos y presenta los valores en un formato claro y atractivo.
import React from 'react';
import './ValuesSection.css';
const ValuesSection = () => {
  const values = [
    { value: "Respeto", description: "Fomentamos el respeto entre jugadores, entrenadores y comunidad." },
    { value: "Disciplina", description: "Promovemos la constancia y el esfuerzo en cada entrenamiento." },
    { value: "Trabajo en equipo", description: "Creemos que juntos somos más fuertes y logramos grandes metas." },
  ];

  return (
    <section className="values-section">
      <div className="values-list">
        {values.map(({ value, description }) => (
          <div key={value} className="value-item">
            <p className="value-title">{value}</p>
            <p className="value-description">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValuesSection;
