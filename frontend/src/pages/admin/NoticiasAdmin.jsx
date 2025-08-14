// NoticiasAdmin.jsx
import { useState, useEffect } from "react";
import "./NoticiasAdmin.css";
import axios from "axios";

function NoticiasAdmin() {
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [editando, setEditando] = useState(null);

  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "https://midominio.com"
      : "http://localhost:3000";

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/auth/noticias`);
        const noticiasLista = res.data.noticias.map((noticia) => ({
          id: noticia.id,
          titulo: noticia.titulo,
          fecha: new Date(noticia.fecha_publicacion).toISOString().slice(0, 10),
          cuerpo: noticia.contenido,
          imagenUrl: noticia.imagen_url,
        }));

        setNoticias(noticiasLista);
      } catch (err) {
        console.error("Error al obtener noticias:", err);
      }
    };

    fetchNoticias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !fecha || !cuerpo || !imagenUrl) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      if (editando) {
        // PUT para modificar
        const res = await axios.put(
          `http://localhost:3000/auth/modificarnoticia/${editando}/cbq1s3VNeMXEdjTJQmpNJEA0Vsk2`, // aquí "1" sería el autor_id real
          {
            titulo,
            contenido: cuerpo,
            imagen_url: imagenUrl,
            fecha
          },
          { withCredentials: true } // si usas cookies para auth
        );

        alert("Noticia actualizada correctamente");

        // Actualizar lista de noticias en el estado
        setNoticias((prev) =>
          prev.map((n) => (n.id === editando ? {
            ...n,
            titulo,
            fecha,
            cuerpo,
            imagenUrl
          } : n))
        );

        // Resetear formulario
        setEditando(null);
        setTitulo("");
        setFecha("");
        setCuerpo("");
        setImagenUrl("");
        setVistaPrevia(null);

      } else {
        // POST para crear
        const res = await axios.post(
          `http://localhost:3000/auth/agregarnoticia/cbq1s3VNeMXEdjTJQmpNJEA0Vsk2`, // aqui esta el autor id
          {
            titulo,
            contenido: cuerpo,
            imagen_url: imagenUrl,
            fecha,
          },
          { withCredentials: true }
        );


        alert("Noticia creada con éxito");
        setNoticias((prev) => [...prev, res.data]);
        setTitulo("");
        setFecha("");
        setCuerpo("");
        setImagenUrl("");
        setVistaPrevia(null);
      }

    } catch (err) {
      console.error("Error al guardar noticia:", err);
      alert("Hubo un error al guardar la noticia");
    }
  };

  const handleImagenUrlChange = (e) => {
    const url = e.target.value;
    setImagenUrl(url);
    setVistaPrevia(url || null);
  };

  const handleEditar = (noticia) => {
    setTitulo(noticia.titulo);
    setFecha(noticia.fecha);
    setCuerpo(noticia.cuerpo);
    setImagenUrl(noticia.imagenUrl);
    setVistaPrevia(noticia.imagenUrl);
    setEditando(noticia.id);
  };

  const eliminacionNoticia = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/auth/eliminarnoticia/${ id }`, {
        withCredentials: true,
      });
      setNoticias((prev) => prev.filter((n) => n.id !== id));
      alert("Noticia eliminada correctamente");
    } catch (err) {
      console.error("Error al eliminar noticia:", err);
      alert("Hubo un error al eliminar la noticia");
    }
  }

  const handleEliminar = async (id) => {
    await eliminacionNoticia(id);

    /*
    if (window.confirm("¿Seguro que quieres eliminar esta noticia?")) {
      fetch(${API_BASE}/auth/eliminarnoticia/${id}, { method: "DELETE", withCredentials: true })
        .then(() => {
          alert("Noticia eliminada");
          setNoticias((prev) => prev.filter((n) => n.id !== id));
        })
        .catch((err) => {
          console.error("Error al eliminar noticia:", err);
          alert("Hubo un error al eliminar la noticia");
        });
    }*/
  };

  return (
    <div className="noticias-admin-container">
      <h1 className="titulo-seccion">Gestión de Noticias</h1>

      <p className="descripcion-seccion">
        En este apartado puedes crear y administrar las noticias del sitio web.
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
          className="textarea-grande"
          placeholder="Cuerpo de la noticia"
          value={cuerpo}
          onChange={(e) => setCuerpo(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL de la imagen"
          value={imagenUrl}
          onChange={handleImagenUrlChange}
        />

        {vistaPrevia && (
          <img className="vista-previa" src={vistaPrevia} alt="Vista previa" />
        )}

        <button type="submit">
          {editando ? "Actualizar" : "Crear"} Noticia
        </button>
      </form>

      <div className="lista-noticias">
        <h2>Noticias existentes</h2>
        {noticias.length === 0 ? (
          <p>No hay noticias creadas.</p>
        ) : (
          noticias.map((n) => (
            <div key={n.id} className="noticia-item">
              <div className="noticia-contenido">
                <h3>{n.titulo}</h3>
                <p>
                  <strong>Fecha:</strong> {n.fecha}
                </p>
                <p>{n.cuerpo}</p>
                <div className="botones">
                  <button onClick={() => handleEditar(n)}>Editar</button>
                  <button onClick={() => handleEliminar(n.id)}>Eliminar</button>
                </div>
              </div>
              <img
                src={n.imagenUrl}
                alt={n.titulo}
                className="noticia-imagen"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NoticiasAdmin;
