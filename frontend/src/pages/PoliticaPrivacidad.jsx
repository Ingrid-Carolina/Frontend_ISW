
import React from "react";
import "./PoliticaPrivacidad.css";

const PoliticaPrivacidad = () => {
  return (
    <div className="privacidad-container">
      <h1 className="privacidad-title">Política de Privacidad</h1>

      <section>
        <h2>1. Información que recopilamos</h2>
        <p>
          Podemos recopilar la siguiente información: nombre, correo
          electrónico, datos de navegación mediante cookies y cualquier
          información opcional que decidas compartir (comentarios,
          testimonios, registros).
        </p>
      </section>

      <section>
        <h2>2. Uso de la información</h2>
        <p>
          La información recopilada se utiliza para responder consultas,
          mejorar el funcionamiento del sitio y enviar noticias o eventos (solo
          si aceptaste recibirlos).
        </p>
      </section>

      <section>
        <h2>3. Cookies</h2>
        <p>
          Este sitio utiliza cookies para mejorar la experiencia de navegación.
          Puedes desactivarlas desde la configuración de tu navegador en
          cualquier momento.
        </p>
      </section>

      <section>
        <h2>4. Compartir información</h2>
        <p>
          No compartimos tu información personal con terceros, salvo que sea
          requerido por ley o con tu consentimiento expreso.
        </p>
      </section>

      <section>
        <h2>5. Seguridad de la información</h2>
        <p>
          Implementamos medidas razonables para proteger tus datos personales.
        </p>
      </section>

      <section>
        <h2>6. Derechos de los usuarios</h2>
        <p>
          Puedes acceder, modificar o eliminar tus datos personales, así como
          solicitar que dejemos de enviarte comunicaciones. Escríbenos a:
          <b> contacto@tusitio.com</b>
        </p>
      </section>

      <section>
        <h2>7. Cambios en esta política</h2>
        <p>
          Podemos actualizar esta Política de Privacidad ocasionalmente. Los
          cambios se publicarán en esta página.
        </p>
      </section>

      <section>
        <h2>8. Contacto</h2>
        <p>
          Si tienes dudas sobre esta Política de Privacidad, contáctanos en:
          <b> contacto@tusitio.com</b>
        </p>
      </section>
    </div>
  );
};

export default PoliticaPrivacidad;
