import React from "react";
import "./PoliticaPrivacidad.css";

const PoliticaPrivacidad = () => {
  return (
    <div className="politica-container">
      <div className="politica-header">
        <h1 className="politica-titulo">Política de Privacidad</h1>
        <hr className="politica-separador" />
      </div>

      <div className="politica-cuerpo">
        <p className="politica-texto">
          En nuestro sitio de béisbol valoramos tu privacidad y nos comprometemos a
          proteger la información personal que nos compartes. Al navegar en nuestra
          página, podemos recopilar datos como tu nombre, correo electrónico y cierta
          información de navegación obtenida mediante cookies. Asimismo, podemos
          recibir información adicional que decidas proporcionarnos de manera
          voluntaria, como comentarios, testimonios o registros en actividades
          relacionadas con el sitio. Toda esta información es utilizada
          exclusivamente con fines legítimos, buscando siempre garantizar una
          experiencia transparente y segura para cada usuario.
        </p>

        <p className="politica-texto">
          La información que recopilamos se emplea principalmente para responder a
          tus consultas, mejorar el funcionamiento y la usabilidad de nuestra
          plataforma, y mantenerte informado sobre noticias, eventos o actividades
          relacionadas con el béisbol infantil, siempre y cuando hayas manifestado tu
          consentimiento para recibir este tipo de comunicaciones. Nos comprometemos
          a no compartir tu información personal con terceros, salvo en los casos en
          que exista una obligación legal o que contemos con tu autorización expresa.
          De esta manera, buscamos que tengas la confianza de que tus datos están en
          buenas manos.
        </p>

        <p className="politica-texto">
          Nuestro sitio utiliza cookies con el propósito de optimizar tu experiencia
          de navegación, permitiendo que el contenido se adapte mejor a tus
          preferencias y necesidades. Si lo deseas, puedes desactivar el uso de
          cookies directamente desde la configuración de tu navegador; sin embargo,
          debes tener en cuenta que al hacerlo algunas funciones o servicios del
          sitio podrían no estar disponibles en su totalidad. Además, implementamos
          medidas de seguridad razonables para proteger la integridad de tu
          información, aunque reconocemos que ningún sistema digital puede garantizar
          una protección absoluta frente a todos los riesgos potenciales.
        </p>

        <p className="politica-texto">
          Como usuario, cuentas con derechos importantes sobre tu información
          personal. Puedes solicitar en cualquier momento el acceso, modificación o
          eliminación de tus datos, así como la suspensión de cualquier tipo de
          comunicación no deseada. Para ejercer estos derechos o realizar cualquier
          consulta relacionada con el tratamiento de tus datos, puedes escribirnos al
          correo electrónico: <b>pilotoshn@outlook.com</b>. Atenderemos tus
          solicitudes de manera oportuna y responsable, respetando siempre los
          principios de transparencia y legalidad.
        </p>

        <p className="politica-texto">
          Finalmente, nos reservamos el derecho de actualizar esta Política de
          Privacidad en cualquier momento para adaptarnos a cambios normativos,
          tecnológicos o de funcionamiento de nuestra plataforma. Las modificaciones
          serán publicadas en esta misma página, por lo que te recomendamos revisarla
          periódicamente con el fin de mantenerte informado. Si tienes dudas,
          comentarios o inquietudes adicionales acerca de esta política, puedes
          ponerte en contacto con nosotros en <b>pilotoshn@outlook.com</b>, donde con
          gusto atenderemos tu consulta.
        </p>
      </div>

    </div>
  );
};

export default PoliticaPrivacidad;
