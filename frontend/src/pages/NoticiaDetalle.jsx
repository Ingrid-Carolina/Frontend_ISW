// Importa hooks de React para manejar estado y efectos
import { useEffect, useState } from "react";
// Importa hook para obtener parámetros de la URL (id de la noticia)
import { useParams } from "react-router-dom";
// Importa el cliente API para hacer peticiones al backend
import { api } from '../api/api';
// Importa el componente que muestra la noticia en formato visual
import NewsSection from "../components/NewsSection";

// Componente que muestra el detalle de una noticia obtenida por su id
export default function NoticiaDetalle() {
  // Obtiene el parámetro 'id' de la URL
  const { id } = useParams();
  // Estado para almacenar la noticia obtenida
  const [noticia, setNoticia] = useState(null);
  // Estado para controlar si está cargando
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);

  // Efecto que se ejecuta cuando cambia el id (cuando se navega a otra noticia)
  useEffect(() => {
    // Variable para evitar actualizar el estado si el componente se desmonta
    let cancelled = false;

    // Función asíncrona para obtener la noticia desde el backend
    async function fetchNoticia() {
      try {
        setLoading(true); // Indica que está cargando
        setError(null);   // Limpia errores previos

        // Llama a la API usando el id de la noticia
        const { data } = await api.get(`/auth/noticias/${id}`);

        // Si el componente sigue montado, actualiza el estado con los datos recibidos
        if (!cancelled) {
          setNoticia({
            id: data.id,
            titulo: data.titulo,
            contenido: data.contenido,
            imagen: data.imagen_url,
            // Formatea la fecha a formato legible en español
            fecha: new Date(data.fecha_publicacion).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          });
        }
      } catch (err) {
        // Si ocurre un error y el componente sigue montado, muestra mensaje de error
        if (!cancelled) {
          setError("Noticia no encontrada");
        }
      } finally {
        // Finaliza la carga si el componente sigue montado
        if (!cancelled) setLoading(false);
      }
    }

    // Ejecuta la función para obtener la noticia
    fetchNoticia();
    // Cleanup: marca como cancelado si el componente se desmonta antes de terminar la petición
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Renderiza mensaje de carga mientras se obtiene la noticia
  if (loading) return <p>Cargando noticia...</p>;
  // Renderiza mensaje de error si ocurre algún problema
  if (error) return <p>{error}</p>;
  // Renderiza mensaje si no se encuentra la noticia
  if (!noticia) return <p>No se encontró la noticia</p>;

  // Renderiza el componente NewsSection con los datos de la noticia obtenida
  return (
    <NewsSection
      titulo={noticia.titulo}
      fecha={noticia.fecha}
      contenido={noticia.contenido}
      imagen={noticia.imagen}
    />
  );
}
