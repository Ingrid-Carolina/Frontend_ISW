// NoticiasAdmin.jsx
import { useState, useEffect } from "react";
import "./NoticiasAdmin.css";
import axios from "axios";
import { api } from "../../api/api";
import {Box, Typography} from '@mui/material';

function NoticiasAdmin() {
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [noticias, setNoticias] = useState([]);
  const [editando, setEditando] = useState(null);

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

    if (!titulo || !fecha || !cuerpo || !imagenUrl) {
        setBannerMsg("Todos los campos son obligatorios")
            setBannerType('error');
            setShowBanner(true);

        
        setTimeout(() => setShowBanner(false), 4000); 

      return;
    }

    try {
      if (editando) {
        // PUT para modificar
       const res= await api.put(
          `/auth/modificarnoticia/${editando}/${AUTOR_ID}`,
          {
            titulo,
            contenido: cuerpo,
            imagen_url: imagenUrl,
            fecha,
          }
        );

       // alert("Noticia actualizada correctamente");

       setBannerMsg(res.data.mensaje)
            setBannerType('success');
            setShowBanner(true);
        setTimeout(() => setShowBanner(false), 4000); 


        // Actualizar lista de noticias en el estado
        setNoticias((prev) =>
          prev.map((n) =>
            n.id === editando
              ? { ...n, titulo, fecha, cuerpo, imagenUrl }
              : n
          )
        );

        // Resetear formulario
        setEditando(null);
        setTitulo("");
        setFecha("");
        setCuerpo("");
        setImagenUrl("");
        setVistaPrevia(null);
        setTimeout(() => {
      window.location.reload();
    }, 1000);

      } else {
        // POST para crear
        const res = await api.post(
          `/auth/agregarnoticia/${AUTOR_ID}`,
          {
            titulo,
            contenido: cuerpo,
            imagen_url: imagenUrl,
            fecha,
          }
        );

          setBannerMsg(res.data.mensaje)
            setBannerType('success');
            setShowBanner(true);
            setTimeout(() => setShowBanner(false), 4000); 
           

        setNoticias((prev) => [...prev, res.data]);
        setTitulo("");
        setFecha("");
        setCuerpo("");
        setImagenUrl("");
        setVistaPrevia(null);
        setTimeout(() => {
      window.location.reload();
    }, 1000);
         return res.data;
      }

    } catch (error) {
      const mensaje = error?.data?.mensaje|| error?.message|| 'Error en la Red';
              setBannerMsg(mensaje)
            setBannerType('error');
            setShowBanner(true);
        setTimeout(() => setShowBanner(false), 3000); 
        throw error;


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
         window.scrollTo(0,0);


    } catch (error) {
      console.error("Error al eliminar noticia:", error);
      //alert("Hubo un error al eliminar la noticia");

      const mensaje =   error?.data?.mensaje|| error?.message|| 'Error en la Red';
                setBannerMsg(mensaje)
            setBannerType('error');
            setShowBanner(true);
        setTimeout(() => setShowBanner(false), 4000); 

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
