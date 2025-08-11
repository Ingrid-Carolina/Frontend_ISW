import { useState, useEffect } from "react";
import "./NoticiasAdmin.css";

function NoticiasAdmin() {
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [imagen, setImagen] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [noticias, setNoticias] = useState([]);

  // Cargar noticias al inicio
  useEffect(() => {
    fetch("/api/noticias")
      .then(res => res.json())
      .then(data => setNoticias(data))
      .catch(err => console.error("Error cargando noticias:", err));
  }, []);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    if (file) {
      setVistaPrevia(URL.createObjectURL(file));
    } else {
      setVistaPrevia(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo || !fecha || !cuerpo || !imagen) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("fecha", fecha);
    formData.append("cuerpo", cuerpo);
    formData.append("imagen", imagen);

    fetch("/api/noticias", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        alert("Noticia creada con éxito");
        setNoticias(prev => [...prev, data]); // Agregar nueva noticia a la lista
        setTitulo("");
        setFecha("");
        setCuerpo("");
        setImagen(null);
        setVistaPrevia(null);
      })
      .catch(err => {
        console.error("Error al crear noticia:", err);
        alert("Hubo un error al crear la noticia");
      });
  };

  return (
    <div className="noticias-admin-container">
      <h1 className="titulo-seccion">Gestión de Noticias</h1>

      <p className="descripcion-seccion">
        En este apartado puedes crear nuevas noticias para el sitio web. 
        Ingresa el título, fecha, cuerpo de la noticia y una imagen representativa. 
        Una vez creada, la noticia aparecerá en la lista de abajo y se mostrará en la sección pública.
      </p>

      <form className="form-noticia" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <textarea
          placeholder="Cuerpo de la noticia"
          value={cuerpo}
          onChange={(e) => setCuerpo(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImagenChange} />

        {vistaPrevia && (
          <img className="vista-previa" src={vistaPrevia} alt="Vista previa" />
        )}

        <button type="submit">Crear Noticia</button>
      </form>

      <div className="lista-noticias">
        <h2>Noticias existentes</h2>
        {noticias.length === 0 ? (
          <p>No hay noticias creadas.</p>
        ) : (
          noticias.map((n) => (
            <div key={n.id} className="noticia-item">
              <img src={n.imagenUrl} alt={n.titulo} />
              <div>
                <h3>{n.titulo}</h3>
                <p><strong>Fecha:</strong> {n.fecha}</p>
                <p>{n.cuerpo}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

}

export default NoticiasAdmin;
