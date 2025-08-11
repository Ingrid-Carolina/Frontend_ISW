import { useState, useEffect } from "react";
import "./NoticiasAdmin.css";
import axios from "axios";

function NoticiasAdmin() {
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [imagen, setImagen] = useState(null);
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
        const res = await axios.get(`${API_BASE}/auth/noticias`);
        const noticiasRaw = res.data.noticias;  // <- acceso al array dentro del objeto JSON
        const noticiasLista = noticiasRaw.map((noticia) => ({
          id: noticia.id,
          titulo: noticia.titulo,
          fecha: new Date(noticia.fecha_publicacion).toISOString().slice(0, 10),
          cuerpo: noticia.contenido,
          imagenUrl: noticia.imagen_url,
        }));

        setNoticias(noticiasLista);
        console.log(noticiasLista);
      } catch (err) {
        console.error("Error al obtener noticias:", err);
      }
    };

    fetchNoticias();
  }, []);



  const handleSubmit = async (e) => {
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

    try {
      const res = await axios.post(
        "http://localhost:3000/agregarnoticia/1", // cambia "1" por el autor_id correcto
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Noticia creada con éxito");
      setNoticias((prev) => [...prev, res.data]);
      setTitulo("");
      setFecha("");
      setCuerpo("");
      setImagen(null);
      setVistaPrevia(null);
    } catch (err) {
      console.error("Error al crear noticia:", err);
      alert("Hubo un error al crear la noticia");
    }
  };
  
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);

    // Para mostrar la vista previa de la imagen que el usuario selecciona:
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVistaPrevia(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setVistaPrevia(null);
    }
  };


  const handleEditar = (noticia) => {
    setTitulo(noticia.titulo);
    setFecha(noticia.fecha);
    setCuerpo(noticia.cuerpo);
    setVistaPrevia(noticia.imagenUrl);
    setEditando(noticia.id);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta noticia?")) {
      fetch(`${API_BASE}/api/noticias/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          alert("Noticia eliminada");
          fetchNoticias();
        })
        .catch((err) => {
          console.error("Error al eliminar noticia:", err);
          alert("Hubo un error al eliminar la noticia");
        });
    }
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
          placeholder="Cuerpo de la noticia"
          value={cuerpo}
          onChange={(e) => setCuerpo(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImagenChange} />

        {vistaPrevia && (
          <img className="vista-previa" src={vistaPrevia} alt="Vista previa" />
        )}

        <button type="submit">{editando ? "Actualizar" : "Crear"} Noticia</button>
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
                <button onClick={() => handleEditar(n)}>Editar</button>
                <button onClick={() => handleEliminar(n.id)}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NoticiasAdmin;

