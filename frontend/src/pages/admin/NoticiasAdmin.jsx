// NoticiasAdmin.jsx
import { useState, useEffect } from "react";
import "./NoticiasAdmin.css";
import axios from "axios";
import { api } from "../../api/api";
import { Box, Typography } from '@mui/material';
import upload from '../../../public/Images/upload.svg'

function NoticiasAdmin() {
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [cuerpo, setCuerpo] = useState("");

  //imagen logica
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");


  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [editando, setEditando] = useState(null);

  // subir imagen estados


  //Declaracion

  const [bannerMsg, setBannerMsg] = useState('');
  const [bannerType, setBannerType] = useState('success'); // or 'error'
  const [showBanner, setShowBanner] = useState(false);

  const AUTOR_ID = "cbq1s3VNeMXEdjTJQmpNJEA0Vsk2";

  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "https://midominio.com"
      : "http://localhost:3000";

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await api.get("/auth/noticias");
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

    // validación
    if (!titulo || !fecha || !cuerpo || (!editando && !image && !imagenUrl)) {
      setBannerMsg("Todos los campos son obligatorios");
      setBannerType("error");
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      return;
    }

    try {

      let finalUrl = imagenUrl || null;

      if (image) {
        const form = new FormData();
        form.append("file", image);

        const uploadRes = await api.post("/auth/upload", form, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        finalUrl = uploadRes.data.url; // 👈 usar variable local
        setImagenUrl(finalUrl); // para que quede en el estado también
      }

      // 2) Crear o actualizar
      if (editando) {
        const res = await api.put(
          `/auth/modificarnoticia/${editando}/${AUTOR_ID}`,
          {
            titulo,
            contenido: cuerpo,
            imagen_url: finalUrl, // 👈 usar la variable, NO el estado
            fecha,
          }
        );

        setBannerMsg(res.data.mensaje);
        setBannerType("success");
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 4000);

        // reflejar cambios en el estado
        setNoticias((prev) =>
          prev.map((n) =>
            n.id === editando
              ? { ...n, titulo, fecha, cuerpo, imagenUrl: finalUrl }
              : n
          )
        );

        // limpiar
        setEditando(null);
        setTitulo("");
        setFecha("");
        setCuerpo("");
        setImagenUrl("");
        setVistaPrevia(null);
        setImage(null);
      } else {
        const res = await api.post(`/auth/agregarnoticia/${AUTOR_ID}`, {
          titulo,
          contenido: cuerpo,
          imagen_url: finalUrl, // 👈 usar la variable
          fecha,
        });

        setBannerMsg(res.data.mensaje);
        setBannerType("success");
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 4000);

        // opcional: si tu API devuelve la noticia creada, úsala
        setNoticias((prev) => [...prev, {
          id: res.data.id,
          titulo,
          fecha,
          cuerpo,
          imagenUrl: finalUrl
        }]);

        // limpiar
        setTitulo("");
        setFecha("");
        setCuerpo("");
        setImagenUrl("");
        setVistaPrevia(null);
        setImage(null);
      }
    } catch (error) {
      const mensaje = error?.response?.data?.mensaje || error?.message || "Error en la Red";
      setBannerMsg(mensaje);
      setBannerType("error");
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
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
      const res = await api.delete(`/auth/eliminarnoticia/${id}`);
      setNoticias((prev) => prev.filter((n) => n.id !== id));
      //alert("Noticia eliminada correctamente");
      setBannerMsg(res.data.mensaje)
      setBannerType('success');
      setShowBanner(true);


      setTimeout(() => setShowBanner(false), 4000);
      window.scrollTo(0, 0);


    } catch (error) {
      console.error("Error al eliminar noticia:", error);
      //alert("Hubo un error al eliminar la noticia");

      const mensaje = error?.data?.mensaje || error?.message || 'Error en la Red';
      setBannerMsg(mensaje)
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);

    }
  }

  const handleEliminar = async (id) => {
    await eliminacionNoticia(id);
  };

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(f.type)) {
      setError("Tipo de archivo inválido. Solo se permiten imágenes (JPG, PNG, WEBP, AVIF)");
      setImage(null);
      setVistaPrevia(null);
    } else {
      setError("");
      setImage(f);
      setVistaPrevia(URL.createObjectURL(f)); 
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
          className="textarea-grande"
          placeholder="Cuerpo de la noticia"
          value={cuerpo}
          onChange={(e) => setCuerpo(e.target.value)}
        />

        <div className={`input-box ${error ? "error" : ""}`}>
          <label className="file-label">
            <img src={upload} alt="upload" className="icon" />
            <p className="title">Elija una imagen para cargar</p>
            <p className="subtitle">Permitidos: JPG, PNG, WEBP, AVIF</p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleChange}
              hidden
            />
          </label>

          {error && <p className="error-text">{error}</p>}
          {image && (
            <div className="preview">
              <img src={URL.createObjectURL(image)} alt="preview" />
              <p>{image.name}</p>
            </div>
          )}
        </div>


        {showBanner && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              mb: 2,
              animation: 'slideDown 0.3s ease-in-out',
              backgroundColor: bannerType === 'error' ? '#f44336' : '#4caf50',
              color: '#fff',
              borderRadius: 1,
              p: 1,
              boxShadow: 2,
            }}
          >
            <Typography sx={{ fontWeight: 'bold' }}>{bannerMsg}</Typography>
          </Box>
        )}




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
