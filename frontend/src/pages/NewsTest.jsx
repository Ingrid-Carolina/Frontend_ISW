// Importa el componente NewsSection, que se encarga de mostrar la noticia en formato visual
import NewsSection from '../components/NewsSection'; // Ajusta la ruta si tu carpeta es diferente

// Componente funcional que muestra una noticia de prueba usando NewsSection
function NewsTest() {
  // Texto de la noticia, puede ser reemplazado por datos dinámicos o props en el futuro
  const contenido = `La emoción y la pasión del béisbol se vivieron al máximo este fin de semana en la esperada final del Torneo Infantil de la Asociación de Béisbol Menor. Con un estadio completamente lleno, padres, amigos, entrenadores y amantes del deporte se reunieron para presenciar un enfrentamiento inolvidable entre los Halcones del Norte y los Tigres del Sur.\n
Desde el primer inning, los Halcones demostraron su enfoque ofensivo. Con jugadas cuidadosamente ensayadas durante semanas de entrenamiento, lograron abrir el marcador con un doblete al jardín izquierdo seguido de una excelente carrera al home. El entusiasmo de los asistentes creció con cada entrada, y los cánticos de las barras no cesaron en ningún momento.\n
Los Tigres, por su parte, no se dejaron intimidar. Respondieron en la tercera entrada con un batazo largo que puso a dos corredores en posición anotadora. Gracias a una excelente lectura del pitcher rival, lograron empatar el juego, aumentando la tensión del encuentro y encendiendo la rivalidad entre las dos escuadras más fuertes del campeonato. Fue en el sexto inning cuando ocurrió la jugada más memorable del partido. Luisito Fernández, el capitán de los Halcones con apenas 11 años, conectó un impresionante jonrón con bases llenas. La pelota voló por encima del jardín central y cayó más allá de la barda, provocando una euforia generalizada en las gradas. El público estalló en gritos y aplausos, mientras sus compañeros lo recibían en el plato con abrazos y lágrimas de alegría.\n
Ese batazo cambió el rumbo del encuentro. Los Halcones tomaron una ventaja que los Tigres ya no pudieron alcanzar. A pesar de varios intentos por remontar, la defensa de los Halcones se mantuvo sólida, destacando las atrapadas espectaculares de su jardinero derecho y las rápidas reacciones del receptor detrás del plato.\n
El marcador final de 8 a 4 le dio a los Halcones el campeonato del torneo, pero más allá del resultado, ambos equipos demostraron un nivel técnico y una disciplina deportiva que reflejan el arduo trabajo realizado por jugadores, entrenadores y familias.\n
Al finalizar el juego, se llevó a cabo una emotiva ceremonia de premiación. Se entregaron medallas a todos los jugadores, se reconoció al mejor bateador, al lanzador más efectivo y al jugador más valioso del torneo, distinción que recayó, merecidamente, en Luisito Fernández. También se premió al equipo con mayor espíritu deportivo, destacando la actitud ejemplar de los Tigres del Sur, quienes a pesar de la derrota, felicitaron a sus rivales con respeto y compañerismo.\n
El evento concluyó con un desfile improvisado de los campeones, quienes recorrieron el campo saludando a sus seguidores y tomándose fotografías con sus trofeos. 
Las familias aprovecharon el momento para compartir comidas, celebrar los logros y recordar que el verdadero triunfo está en la experiencia vivida, el trabajo en equipo y los valores que el deporte infunde en los más jóvenes.\n
Esta final no solo coronó a un equipo campeón, sino que también dejó en claro que el béisbol infantil está más vivo que nunca, lleno de talentos emergentes, pasión por el juego y una comunidad que lo respalda con orgullo. 
¡Felicidades a todos los participantes por regalarnos una jornada inolvidable y por seguir construyendo, desde el diamante, el futuro del deporte nacional!`;

  // Renderiza el componente NewsSection con los datos de la noticia
  // El padding superior separa la noticia del header o menú
  return (
    <div style={{ paddingTop: '50px' }}>
      {/* NewsSection recibe props para mostrar título, fecha, imagen y contenido de la noticia */}
      <NewsSection
        titulo="Gran Final de la Liga Infantil"
        fecha="6 de Agosto, 2025"
        imagen="/Images/JugadorPrueba2.jpg" // Asegúrate de que esta ruta exista
        contenido={contenido}
      />
    </div>
  );
}

// Exporta el componente para que pueda ser usado en rutas u otros componentes
export default NewsTest;
