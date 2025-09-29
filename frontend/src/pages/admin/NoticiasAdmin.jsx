// NoticiasAdmin.jsx
// Importa hooks de React para manejar estado y ciclo de vida
import { useState, useEffect } from "react";
// Importa los estilos CSS específicos para la página de noticias
import "./NoticiasAdmin.css";
// Importa axios (no se usa directamente, pero está disponible)
import axios from "axios";
// Importa el cliente API personalizado
import { api } from "../../api/api";
// Importa componentes de Material UI para la interfaz
import { Box, Typography } from '@mui/material';
// Importa el ícono de subida de imagen
import upload from '../../../public/Images/upload.svg'

// Componente principal para la administración de noticias
function NoticiasAdmin() {
  // Estados para los campos del formulario de noticia
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [cuerpo, setCuerpo] = useState("");

  // Estados para la lógica de imagen
  const [error, setError] = useState("");
  const [image, setImage] = useState(null); // archivo de imagen seleccionado
  const [imagenUrl, setImagenUrl] = useState(null); // url de la imagen subida

  // Estado para la vista previa de la imagen
  const [vistaPrevia, setVistaPrevia] = useState(null);

  // Estado para la lista de noticias obtenidas del backend
  const [noticias, setNoticias] = useState([]);
  // Estado para saber si se está editando una noticia (id de la noticia)
  const [editando, setEditando] = useState(null);

  // Estados para el banner de mensajes (éxito/error)
  const [bannerMsg, setBannerMsg] = useState('');
  const [bannerType, setBannerType] = useState('success'); // 'success' o 'error'
  const [showBanner, setShowBanner] = useState(false);

  // ID del autor (puede venir de autenticación en una app real)
  const AUTOR_ID = "cbq1s3VNeMXEdjTJQmpNJEA0Vsk2";

  // Base de la API según entorno
  const API_BASE =
    process.env.NODE_ENV === "production"
      ? "https://midominio.com"
      : "http://localhost:3000";

  // useEffect para cargar las noticias al montar el componente
  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        // Obtiene las noticias del backend
        const res = await api.get("/auth/noticias");
        // Formatea la respuesta para el frontend
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

  // Maneja el envío del formulario para crear o editar una noticia
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
    const needsImage = !editando && !image && !imagenUrl;
    if (!titulo || !fecha || !cuerpo || needsImage) {
      setBannerMsg("Todos los campos son obligatorios");
      setBannerType("error");
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      return;
    }

    try {
      let finalUrl = imagenUrl || null;

      // Si hay imagen seleccionada, súbela al backend
      if (image) {
        const form = new FormData();
        form.append("file", image);
        const uploadRes = await api.post("/auth/upload", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        finalUrl = uploadRes.data.url;
        setImagenUrl(finalUrl);
      }

      // Prepara el payload para el backend
      const payload = {
        titulo,
        contenido: cuerpo,
        imagen_url: finalUrl,
        fecha, 
      };

      if (editando) {
        // Si está editando, actualiza la noticia existente
        const res = await api.put(`/auth/modificarnoticia/${editando}/${AUTOR_ID}`, payload);

        setBannerMsg(res.data.mensaje || "Noticia actualizada");
        setBannerType("success");
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 4000);

        // Actualiza la noticia en el estado local
        setNoticias((prev) =>
          prev.map((n) =>
            n.id === editando
              ? { ...n, titulo, fecha, cuerpo, imagenUrl: finalUrl }
              : n
          )
        );

        // Limpia los campos y estados
        setEditando(null);
        setTitulo("");
        setFecha("");
        setCuerpo("");
        setImagenUrl(null);
        setVistaPrevia(null);
        setImage(null);
      } else {
        // Si no está editando, crea una nueva noticia
        const res = await api.post(`/auth/agregarnoticia/${AUTOR_ID}`, payload);

        setBannerMsg(res.data.mensaje || "Noticia creada");
        setBannerType("success");
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 4000);

        // Agrega la nueva noticia al estado local
        const newId = res?.data?.id || crypto.randomUUID();
        setNoticias((prev) => [
          ...prev,
          { id: newId, titulo, fecha, cuerpo, imagenUrl: finalUrl },
        ]);

        // Limpia los campos y estados
        setTitulo("");
        setFecha("");
        setCuerpo("");
        setImagenUrl(null);
        setVistaPrevia(null);
        setImage(null);
      }
    } catch (error) {
      // Manejo de errores en el envío
      const mensaje = error?.response?.data?.mensaje || error?.message || "Error en la Red";
      setBannerMsg(mensaje);
      setBannerType("error");
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    }
  };

  // Maneja el cambio de la URL de la imagen (si se usa un link en vez de subir archivo)
  const handleImagenUrlChange = (e) => {
    const url = e.target.value;
    setImagenUrl(url);
    setVistaPrevia(url || null);
  };

  // Prepara el formulario para editar una noticia existente
  const handleEditar = (noticia) => {
    setTitulo(noticia.titulo);
    setFecha(noticia.fecha);
    setCuerpo(noticia.cuerpo);
    setImagenUrl(noticia.imagenUrl || null);
    setVistaPrevia(noticia.imagenUrl || null);
    setImage(null);
    setEditando(noticia.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Elimina una noticia del backend y del estado local
  const eliminacionNoticia = async (id) => {
    try {
      const res = await api.delete(`/auth/eliminarnoticia/${id}`);
      setNoticias((prev) => prev.filter((n) => n.id !== id));
      setBannerMsg(res.data.mensaje)
      setBannerType('success');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error al eliminar noticia:", error);
      const mensaje = error?.data?.mensaje || error?.message || 'Error en la Red';
      setBannerMsg(mensaje)
      setBannerType('error');
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 4000);
    }
  }

  // Handler para eliminar una noticia
  const handleEliminar = async (id) => {
    await eliminacionNoticia(id);
  };

  // Maneja el cambio de archivo de imagen (drag & drop o selección)
  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Validación de tipo de archivo permitido
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(f.type)) {
      setError("Tipo de archivo inválido. Solo se permiten imágenes (JPG, PNG, WEBP, AVIF)");
      setImage(null);
      setVistaPrevia(null);
      return;
    } 
    setError("");
    setImage(f);
    setVistaPrevia(URL.createObjectURL(f));
  };

  // Renderizado del componente
  return (
    <div className="noticias-admin-container">
      {/* Título principal */}
      <h1 className="titulo-seccion">Gestión de Noticias</h1>

      {/* Descripción de la sección */}
      <p className="descripcion-seccion">
        En este apartado puedes crear y administrar las noticias del sitio web.
      </p>

      {/* Formulario para crear o editar noticias */}
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

        {/* Área para subir imagen */}
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

          {/* Mensaje de error si el archivo no es válido */}
          {error && <p className="error-text">{error}</p>}
          {/* Vista previa de la imagen seleccionada */}
          {image && (
            <div className="preview">
              <img src={URL.createObjectURL(image)} alt="preview" />
              <p>{image.name}</p>
            </div>
          )}
        </div>

        {/* Banner para mostrar mensajes de éxito o error */}
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

        {/* Vista previa de la imagen (si existe) */}
        {vistaPrevia && (
          <img className="vista-previa" src={vistaPrevia} alt="Vista previa" />
        )}

        {/* Botón para crear o actualizar noticia */}
        <button type="submit">
          {editando ? "Actualizar" : "Crear"} Noticia
        </button>
      </form>

      {/* Listado de noticias existentes */}
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
                  {/* Botón para editar la noticia */}
                  <button onClick={() => handleEditar(n)}>Editar</button>
                  {/* Botón para eliminar la noticia */}
                  <button onClick={() => handleEliminar(n.id)}>Eliminar</button>
                </div>
              </div>
              {/* Imagen de la noticia */}
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
