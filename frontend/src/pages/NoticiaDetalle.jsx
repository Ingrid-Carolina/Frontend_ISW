import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from '../api/api';
import NewsSection from "../components/NewsSection";

export default function NoticiaDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchNoticia() {
      try {
        setLoading(true);
        setError(null);

        // Llamada al backend con el id de la URL
        const { data } = await api.get(`/auth/noticias/${id}`);

        if (!cancelled) {
          setNoticia({
            id: data.id,
            titulo: data.titulo,
            contenido: data.contenido,
            imagen: data.imagen_url,
            fecha: new Date(data.fecha_publicacion).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError("Noticia no encontrada");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNoticia();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p>Cargando noticia...</p>;
  if (error) return <p>{error}</p>;
  if (!noticia) return <p>No se encontró la noticia</p>;

  return (
    <NewsSection
      titulo={noticia.titulo}
      fecha={noticia.fecha}
      contenido={noticia.contenido}
      imagen={noticia.imagen}
    />
  );
}
