import React from "react";
import './Noticia.css';
import Divider from '@mui/material/Divider';




const Noticia3=()=>(

    <div style={{ paddingTop: '90px' }}>
                <div className="titulo-noticia">
                <h1>Noche Benéfica: ¡Únete a Nuestra Noche Benéfica por el Béisbol Menor!</h1>  
                </div>
            <div className="date-noticia">30 de Mayo de 2025</div>
            <Divider style={{ margin: '2rem 0' }} />
            <div className="container-image">
                <img src="https://th.bing.com/th/id/OIP.9SKrTRCaLbaVmimjan-23AHaD4?rs=1&pid=ImgDetMain" alt="Imagen" className="enhanced"></img>
            </div>
            <div className="contenido-noticia">
              ¡Prepárense para una noche inolvidable de diversión, comunidad y, por supuesto, béisbol! Nos complace anunciar nuestra Noche Benéfica, un evento crucial para recaudar fondos y asegurar que nuestros jóvenes atletas sigan teniendo las mejores oportunidades para crecer y brillar en el campo.
              Este evento es la oportunidad perfecta para apoyar directamente a nuestros futuros campeones. Los fondos recaudados se destinarán a cubrir gastos esenciales como:
              Mantenimiento y mejora de nuestras instalaciones: Asegurando campos seguros y de calidad para nuestros jugadores.
              Adquisición de equipamiento deportivo: Para que cada niño tenga el material adecuado y seguro para entrenar y competir.
              Becas y apoyo para jugadores: Garantizando que ningún talento se quede fuera por limitaciones económicas.
              La satisfacción de saber que tu contribución está marcando una diferencia real en la vida de muchos niños y jóvenes de nuestra comunidad. ¡Tu apoyo es el jonrón que necesitamos para seguir impulsando el béisbol menor! ¡Esperamos contar con tu presencia y generosidad!
            </div>
            
    </div>

);

export default Noticia3;