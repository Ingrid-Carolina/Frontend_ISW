import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  CircularProgress,
  Alert,
  Typography,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  LinearProgress,
  Backdrop,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { api } from "../api/api";
import EditableImageCircular from "../components/EditableImageCircular";
import EditableText from "../components/EditableText";
import EditIcon from "@mui/icons-material/Edit";

// Imagen por defecto - definir como string
const DefaultHeaderImg = '/Images/Fondojugadores.png';

// Variantes de animación
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideFrom = (dir) => ({
  hidden: { opacity: 0, x: dir === "left" ? -60 : 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
});

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function PartnerSection({ 
  name, 
  img, 
  links, 
  reverse = false, 
  onImageUpload, 
  isAdmin, 
  textos,
  onTextSave,
  textKey // Nueva prop para identificar qué texto usar
}) {

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const textOrder = isMdUp ? (reverse ? 2 : 1) : 1;
  const imgOrder = isMdUp ? (reverse ? 1 : 2) : 2;

  const imgSlideDir = reverse ? "left" : "right";
  const textSlideDir = reverse ? "right" : "left";

  // Texto por defecto si no existe en la base de datos
   const getDefaultText = (key) => {
    const defaults = {
      aliado_lufussa_descripcion:
        "Gracias al apoyo de Lufussa, hemos podido implementar proyectos de electrificación en comunidades rurales y promover el desarrollo sostenible en distintas regiones del país.",
      aliado_mobile_descripcion:
        "Mobile Spot Honduras nos ha apoyado en la modernización tecnológica de nuestros programas, permitiendo mejor comunicación con nuestras comunidades deportivas.",
      aliado_dental_descripcion:
        "Con el apoyo de Dental D., hemos implementado programas de salud dental para nuestros jóvenes atletas, asegurando su bienestar integral.",
      aliado_angelitos_descripcion:
        "Junto a Fundación Angelitos, hemos desarrollado programas sociales enfocados en la formación de valores y apoyo a comunidades vulnerables.",
      aliado_faerea_descripcion:
        "La Fuerza Aérea Hondureña nos ha brindado apoyo logístico y formativo, fortaleciendo la disciplina y valores cívicos en nuestros atletas.",
    };
    return (
      defaults[key] ||
      "Gracias al apoyo de nuestros aliados estratégicos, hemos podido implementar proyectos sociales, apoyar comunidades vulnerables y promover la educación ambiental en distintas regiones del país."
    );
  };
  return (
    <Box
      component="section"
      sx={{
        backgroundColor: "#fff",
        mt: { xs: 6, md: 10 },
        mb: { xs: 4, md: 6 },
      }}
    >
      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        alignItems="center"
        justifyContent="space-between"
        wrap={isMdUp ? "nowrap" : "wrap"}
      >
        {/* Texto */}
        <Grid item xs={12} md={7} order={textOrder} sx={{ minWidth: 0, flexShrink: 1 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={slideFrom(isMdUp ? textSlideDir : "right")}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                gap: { xs: 3, md: 0 },
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3.25rem" },
                  lineHeight: 1.1,
                  color: "#190B5A",
                  textAlign: { xs: "center", md: "left" },
                  mb: 1,
                }}
              >
                {name}
              </Typography>
              <Box
                sx={{
                  height: 3,
                  width: { xs: 220, md: 520 },
                  bgcolor: "#E06C14",
                  borderRadius: 1,
                  mb: { xs: 3, md: 4 },
                  mx: { xs: "auto", md: 0 },
                }}
              />
              <EditableText
                text={textos[textKey] || getDefaultText(textKey)}
                onTextSave={(newText) => onTextSave(textKey, newText)}
                isAdmin={isAdmin}
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  lineHeight: { xs: 1.7, md: 1.9 },
                  maxWidth: { xs: "100%", md: "80%" },
                  mb: 3,
                  textAlign: { xs: "center", md: "left" },
                }}
                multiline={true}
              />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.35 }}
                style={{ display: "flex", flexWrap: "wrap", gap: 16 }}
                variants={stagger}
              >
                {links.map((link) => (
                  <Button
                    key={link.href}
                    variant="outlined"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      px: 2.5,
                      py: 1.25,
                      borderWidth: 2,
                      borderColor: "#E06C14",
                      color: "#E06C14",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "white",
                        color: "#190B5A",
                        borderColor: "#190B5A",
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </motion.div>
            </Box>
          </motion.div>
        </Grid>

        {/* Imagen */}
        <Grid item xs={12} md={5} order={imgOrder} sx={{ minWidth: 0, flexShrink: 1 }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={slideFrom(isMdUp ? imgSlideDir : "left")}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  md: reverse ? "flex-start" : "flex-end",
                },
                mt: { xs: 3, md: 0 },
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: { xs: 240, sm: 260, md: 300 },
                  maxWidth: "100%",
                  flexShrink: 0,
                }}
              >
                {isAdmin ? (
                  <EditableImageCircular
                    src={img}
                    alt={name}
                    onImageUpload={onImageUpload}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: { xs: "4px solid #E06C14", md: "6px solid #E06C14" },
                      p: { xs: 1.15, md: 2 },
                      bgcolor: "white",
                      boxShadow: "0 2px 0 rgba(0,0,0,0.05)",
                      "& .edit-button": {
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                      },
                    }}
                  />
                ) : (
                  <img
                    src={img}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "6px solid #E06C14",
                      padding: 16,
                      background: "white",
                      boxShadow: "0 2px 0 rgba(0,0,0,0.05)",
                    }}
                  />
                )}
              </Box>
            </Box>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function Aliados() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [images, setImages] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const [textos, setTextos] = useState({});
  const [bannerMsg, setBannerMsg] = useState('');
  const [bannerType, setBannerType] = useState('success');
  const [showBanner, setShowBanner] = useState(false);

  // NUEVO: Estados para el header editable (copiado de NuestroEquipo.jsx)
  const [headerUrl, setHeaderUrl] = useState(null);
  const [headerTitle, setHeaderTitle] = useState('ALIADOS');
  const [openHeaderEdit, setOpenHeaderEdit] = useState(false);
  const [headerTitleInput, setHeaderTitleInput] = useState('ALIADOS');
  const [headerFile, setHeaderFile] = useState(null);
  const [headerUploading, setHeaderUploading] = useState(false);
  const [headerError, setHeaderError] = useState('');
  const [headerPreview, setHeaderPreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // NUEVO: Effect para gestionar preview de imagen del header
  useEffect(() => {
    if (!headerFile) {
      setHeaderPreview(null);
      return;
    }
    const url = URL.createObjectURL(headerFile);
    setHeaderPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [headerFile]);

  const showMessage = (message, type = 'success') => {
    setBannerMsg(message || 'Operación completada');
    setBannerType(type);
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 4000);
  };

  // NUEVO: Funciones para gestionar el header (copiadas de NuestroEquipo.jsx)
  const openHeaderEditor = () => {
    const currentTitle = textos.aliados_titulo_principal || headerTitle || 'ALIADOS';
    setHeaderTitleInput(currentTitle);
    setHeaderFile(null);
    setHeaderError('');
    setOpenHeaderEdit(true);
  };

  const saveHeader = async () => {
    try {
      setHeaderError('');
      setHeaderUploading(true);

      const titleToSave = (headerTitleInput || '').trim() || 'ALIADOS';

      // 1) Actualizar títulos inmediatamente
      setTextos(prevTextos => ({
        ...prevTextos,
        aliados_titulo_principal: titleToSave
      }));
      setHeaderTitle(titleToSave);

      // 2) Subir imagen si se seleccionó
      let newUrl = headerUrl;
      if (headerFile) {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
        if (!allowed.includes(headerFile.type)) {
          throw new Error('Formato no permitido. Usa JPG, PNG, WEBP o AVIF.');
        }
        if (headerFile.size > 8 * 1024 * 1024) {
          throw new Error('La imagen supera los 8 MB.');
        }

        const fd = new FormData();
        fd.append('file', headerFile);
        const up = await api.post('/auth/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        
        if (up.data && up.data.url) {
          newUrl = up.data.url;
          
          await api.put('/auth/images', {
            type: 'aliados_header',
            url: newUrl,
          }, {
            withCredentials: true,
          });
          
          setHeaderUrl(newUrl);
          setImages(prev => ({ 
            ...prev, 
            aliados_header: newUrl 
          }));
        }
      }

      // 3) Guardar título en servidor
      try {
        await handleTextSave('aliados_titulo_principal', titleToSave);
      } catch (textError) {
        console.warn('Error al guardar título:', textError);
      }

      // 4) Limpiar y cerrar
      setHeaderFile(null);
      setHeaderPreview(null);
      setOpenHeaderEdit(false);
      showMessage('Encabezado actualizado correctamente', 'success');
      
    } catch (err) {
      console.error('Error en saveHeader:', err);
      // Revertir cambios
      const originalTitle = textos.aliados_titulo_principal || 'ALIADOS';
      setTextos(prevTextos => ({
        ...prevTextos,
        aliados_titulo_principal: originalTitle
      }));
      setHeaderTitle(originalTitle);
      
      const msg = err?.response?.data?.mensaje || 
                  err?.response?.data?.error || 
                  err?.message || 
                  'Error al actualizar el encabezado.';
      setHeaderError(msg);
    } finally {
      setHeaderUploading(false);
    }
  };

  const partners = [
    {
      name: "Luz y Fuerza de San Lorenzo S.A. (Lufussa)",
      type: "aliado_lufussa",
      links: [
        { label: "Visitar Página", href: "https://lufussa.com/es/inicio/" },
        { label: "Visita Facebook", href: "https://www.facebook.com/LufussaHonduras/?locale=es_LA" },
      ],
    },
    {
      name: "Mobile Spot Honduras",
      type: "aliado_mobile",
      links: [
        { label: "Visita Facebook", href: "https://www.facebook.com/MobileSpothonduras" },
        { label: "Visita Instagram", href: "https://www.instagram.com/mobilespothn/?hl=es-la" },
      ],
    },
    {
      name: "Dental D.",
      type: "aliado_dental",
      links: [
        { label: "Visita Facebook", href: "https://www.facebook.com/Dentaldhn" },
        { label: "Visita Instagram", href: "https://www.instagram.com/dentaldhn/" },
      ],
    },
  ];

  const strategicAllies = [
    {
      name: "Fundación Angelitos",
      type: "aliado_angelitos",
      links: [
        { label: "Visita Fundación", href: "http://www.fundacionangelitos.org" },
        { label: "Visita Facebook", href: "https://www.facebook.com/fundacionangelitoshn" },
        { label: "Visita Instagram", href: "https://www.instagram.com/fundacionangelitoshn/" },
      ],
    },
    {
      name: "Fuerza Aérea Hondureña",
      type: "aliado_faerea",
      links: [
        { label: "Visita Facebook", href: "https://www.facebook.com/FuerzaAereaHN/?locale=es_LA" },
        { label: "Visita Instagram", href: "https://www.instagram.com/fuerzaaereahn/?hl=es" },
      ],
    },
  ];

  const fetchTextos = async () => {
      try {
          console.log('ALIADOS: Iniciando carga de textos...');
          
          const res = await api.get('/auth/aliados/textos', {
              withCredentials: true,
              skipAuthRedirect: true,
          });
          
          console.log('ALIADOS: Response:', res);
          
          if (res.data.success) {
              console.log('ALIADOS: Textos cargados exitosamente:', res.data.data);
              setTextos(prevTextos => ({
                ...prevTextos,
                ...res.data.data
              }));
              
              // Sincronizar headerTitle si existe aliados_titulo_principal
              if (res.data.data.aliados_titulo_principal) {
                setHeaderTitle(res.data.data.aliados_titulo_principal);
              }
          } else {
              console.error('ALIADOS: Success = false:', res.data);
          }
      } catch (error) {
          console.error('ALIADOS: Error al cargar textos:', error);
      }
  };

  
  // Función para guardar textos editables
  const handleTextSave = async (clave, nuevoTexto) => {
      if (!clave || !nuevoTexto) {
        showMessage('Datos inválidos para guardar texto', 'error');
        return;
      }

      try {
          console.log('ALIADOS: Guardando texto:', { clave, nuevoTexto });
          
          // Actualizar estado local inmediatamente
          setTextos(prevTextos => ({
            ...prevTextos,
            [clave]: nuevoTexto
          }));

          // Sincronizar headerTitle si es el título principal
          if (clave === 'aliados_titulo_principal') {
            setHeaderTitle(nuevoTexto);
          }
          
          const res = await api.put('/auth/aliados/textos', {
              clave,
              valor: nuevoTexto
          }, {
              withCredentials: true
          });

          console.log('ALIADOS: Respuesta de guardado:', res);

          if (res.data.success) {
              showMessage('Texto actualizado correctamente', 'success');
          } else {
              throw new Error('Respuesta inválida del servidor');
          }
      } catch (error) {
          console.error('ALIADOS: Error al guardar:', error);
          // Revertir cambio local
          setTextos(prevTextos => ({
            ...prevTextos,
            [clave]: textos[clave] || ''
          }));
          if (clave === 'aliados_titulo_principal') {
            setHeaderTitle(textos.aliados_titulo_principal || 'ALIADOS');
          }
          showMessage('Error al guardar el texto', 'error');
      }
  };

  // Obtener rol
  useEffect(() => {
    const checkRole = async () => {
      try {
        const r = await api.get("/auth/obtenerperfil", {
          withCredentials: true,
          skipAuthRedirect: true,
        });
        const p = Array.isArray(r.data) ? r.data[0] : r.data;
        const roleRaw = String(p?.rol || "").toLowerCase().trim();
        const adminAliases = ["admin", "administrador", "adm"];
        setIsAdmin(adminAliases.includes(roleRaw));
      } catch {
        setIsAdmin(false);
      }
    };
    checkRole();
    fetchTextos();
    
    const onAuthRefresh = () => {
      checkRole(); 
      fetchTextos();
    };
    window.addEventListener('auth:refresh', onAuthRefresh);
    return () => window.removeEventListener('auth:refresh', onAuthRefresh);
  
  }, []);

  // Cargar imágenes
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await api.get("/auth/images", {
          withCredentials: true,
          skipAuthRedirect: true,
        });
        
        if (response.data && Array.isArray(response.data)) {
          const imagesMap = response.data.reduce((acc, current) => {
            if (current?.type) acc[current.type] = current.url;
            return acc;
          }, {});

          const headerImageUrl = imagesMap.aliados_header || DefaultHeaderImg;
          setHeaderUrl(headerImageUrl);
          setImages(prev => ({
            ...prev,
            aliados_header: headerImageUrl,
            ...imagesMap,
          }));
        }
      } catch (err) {
        console.error("Error al cargar imágenes:", err);
        setError("No se pudieron cargar las imágenes. Inténtelo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Guardar imagen
  const handleImageChange = async (type, file) => {
    try {
      if (!(file instanceof File)) return;

      setUploadingImage(true);
      showMessage('Subiendo imagen...', 'info');

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await api.post("/auth/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      const finalUrl = uploadResponse.data.url;

      await api.put("/auth/images", { type, url: finalUrl }, {
        withCredentials: true,
      });

      if (type === 'aliados_header') {
        setHeaderUrl(finalUrl);
      }
      setImages((prev) => ({ ...prev, [type]: finalUrl }));
      showMessage('Imagen actualizada correctamente', 'success');
    } catch (err) {
      console.error(`Error al actualizar la imagen de tipo ${type}:`, err);
      showMessage(`Error al actualizar la imagen.`, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
  }

  return (
    <>
      {/* Backdrop para mostrar carga de imagen */}
      <Backdrop open={uploadingImage} sx={{ zIndex: 1300 }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>Subiendo imagen...</Typography>
        </Box>
      </Backdrop>

      <Box sx={{ py: 0, px: 0, bgcolor: "#fff", textAlign: "center" }}>
        {/* HEADER MEJORADO CON FUNCIONALIDAD COMPLETA DE EDICIÓN */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            bgcolor: "#fff",
            minHeight: { xs: "65vh", md: "80vh" },
            backgroundImage: `url(${headerUrl || DefaultHeaderImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            py: { xs: 6, md: 8 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: 'rgba(12, 0, 90, 0.8)',
              zIndex: 1,
            }}
          />

          {/* Botón único para editar TÍTULO + IMAGEN (solo admin) */}
          {isAdmin && (
            <Tooltip title='Editar título/imagen'>
              <IconButton
                onClick={openHeaderEditor}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                  zIndex: 3,
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Contenido */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              px: 2,
            }}
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
            >
              <Typography
                variant='h2'
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.8rem', md: '5rem' },
                  fontFamily: 'Varsity, sans-serif',
                  color: 'white',
                  textAlign: 'center',
                  textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
                  mb: 2,
                }}
              >
                {headerTitle || 'ALIADOS'}
              </Typography>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
            >
               <EditableText
                text={textos.aliados_subtitulo_hero || "Gracias a nuestros patrocinadores por impulsar el desarrollo deportivo de nuestros jóvenes atletas y fortalecer el espíritu del béisbol en nuestra comunidad."}
                onTextSave={(newText) => handleTextSave("aliados_subtitulo_hero", newText)}
                isAdmin={isAdmin}
                variant="h6"
                sx={{
                  maxWidth: 800,
                  fontSize: { xs: "1rem", md: "1.3rem" },
                  color: "rgba(255,255,255,0.9)",
                  textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                  fontWeight: 300,
                  fontFamily: "ManropeEB, sans-serif",
                }}
                multiline={true}
              />
            </motion.div>
          </Box>
        </Box>

        <Container maxWidth="xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={fadeUp}
          >
            <EditableText
              text={textos.aliados_titulo_socios || "Nuestros Socios"}
              onTextSave={(newText) => handleTextSave("aliados_titulo_socios", newText)}
              isAdmin={isAdmin}
              variant="h2"
              sx={{
                fontSize: { xs: "2.8rem", md: "5rem" },
                fontWeight: 800,
                fontFamily: "Varsity, sans-serif",
                color: "#E06C14",
                mb: { xs: 4 },
                mt: { xs: 4, md: 6 },
              }}
              className="heading-title"
            />
          </motion.div>

          <EditableText
            text={textos.aliados_descripcion_socios || "La Asociación de Béisbol Menor Pilotos de Honduras (FAH) cuenta con más de 76 años de historia desde su formación en 1948. Nuestro principal objetivo es la formación integral de jóvenes atletas, no solo en el juego del béisbol, sino también en la generación de líderes y ciudadanos de sus comunidades y país."}
            onTextSave={(newText) => handleTextSave("aliados_descripcion_socios", newText)}
            isAdmin={isAdmin}
            variant="body1"
            sx={{
              maxWidth: { xs: "95vw", md: "75vw" },
              mx: "auto",
              mb: { xs: 6, md: 10 },
              color: "text.secondary",
            }}
            className="section-text"
            multiline={true}
          />

          {partners.map((p, idx) => (
            <PartnerSection
              key={p.name}
              {...p}
              img={images[p.type]}
              reverse={idx % 2 !== 0}
              onImageUpload={(file) => handleImageChange(p.type, file)}
              isAdmin={isAdmin}
              textos={textos}
              onTextSave={handleTextSave}
              textKey={`${p.type}_descripcion`} //
            />
          ))}

          <EditableText
            text={textos.aliados_titulo_estrategicos || "Alianzas Estratégicas"}
            onTextSave={(newText) => handleTextSave("aliados_titulo_estrategicos", newText)}
            isAdmin={isAdmin}
            variant="h2"
            sx={{
              fontSize: { xs: "2.8rem", md: "5rem" },
              fontWeight: 800,
              fontFamily: "Varsity, sans-serif",
              color: "#E06C14",
              mb: { xs: 4, md: 3 },
              mt: { xs: 4, md: 6 },
            }}
            className="heading-title"
          />

          <EditableText
            text={textos.aliados_subtitulo_estrategicos || "Unidos con nuestros aliados estratégicos, impulsamos el deporte y transformamos comunidades."}
            onTextSave={(newText) => handleTextSave("aliados_subtitulo_estrategicos", newText)}
            isAdmin={isAdmin}
            variant="h6"
            sx={{
              maxWidth: { xs: "95vw", md: "75vw" },
              mx: "auto",
              mb: { xs: 6, md: 10 },
              color: "text.secondary",
              fontFamily: "ManropeEB",
            }}
            className="section-text"
            multiline={true}
          />

          {strategicAllies.map((ally, idx) => (
            <PartnerSection
              key={ally.name}
              {...ally}
              img={images[ally.type]}
              reverse={idx % 2 === 0}
              onImageUpload={(file) => handleImageChange(ally.type, file)}
              isAdmin={isAdmin}
              textos={textos}
              onTextSave={handleTextSave}
              textKey={`${ally.type}_descripcion`} 
            />
          ))}
        </Container>

        {/* Banner Global */}
        {showBanner && (
          <Box
            sx={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1001,
              minWidth: '300px',
              maxWidth: '500px',
              p: 2,
              borderRadius: 2,
              backgroundColor: bannerType === 'error' ? '#f44336' : '#4caf50',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              animation: 'slideDown 0.3s ease-in-out',
            }}
          >
            <Typography
              sx={{ fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}
            >
              {bannerMsg}
            </Typography>
          </Box>
        )}

        {/* MODAL EDITAR HEADER (título + imagen) */}
        <Dialog
          open={openHeaderEdit}
          onClose={() => !headerUploading && setOpenHeaderEdit(false)}
          maxWidth='sm'
          fullWidth
        >
          <DialogTitle>Editar encabezado</DialogTitle>
          <DialogContent dividers sx={{ pt: 1.5, pb: 2, px: 2 }}>
            <TextField
              label='Título del header'
              value={headerTitleInput}
              onChange={e => setHeaderTitleInput(e.target.value)}
              fullWidth
              size='small'
              margin='dense'
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.2 } }}
            />

            <Button
              variant='contained'
              component='label'
              disabled={headerUploading}
              sx={{ mt: 2, fontWeight: 'bold', textTransform: 'none' }}
            >
              {headerFile ? 'Imagen seleccionada' : 'Seleccionar nueva imagen'}
              <input
                type='file'
                hidden
                accept='image/jpeg,image/png,image/webp,image/avif'
                onChange={e => {
                  const f = e.target.files?.[0] || null;
                  setHeaderFile(f); 
                }}
              />
            </Button>
            <Box sx={{ mt: 1, opacity: 0.8, fontSize: 12 }}>
              Formatos: JPG, PNG, WEBP, AVIF.
            </Box>
            
            {/* Vista previa */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: 13, mb: 1, color: 'text.secondary' }}>
                Vista previa
              </Typography>
              <Box
                sx={{
                  width: { xs: 'min(85vw, 150px)', sm: 300 },
                  mx: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  position: 'relative',
                  pt: '30%', 
                  bgcolor: '#f7f7f7',
                  boxShadow: 1,
                }}
              >
                <Box
                  component='img'
                  src={headerPreview || headerUrl || DefaultHeaderImg}
                  alt='Vista previa del encabezado'
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>

              {headerFile && (
                <Button
                  size='small'
                  onClick={() => {
                    setHeaderFile(null);
                    setHeaderPreview(null);
                  }}
                  sx={{ mt: 1 }}
                >
                  Quitar selección
                </Button>
              )}
            </Box>

            {headerError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {headerError}
              </Alert>
            )}

            {headerUploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Guardando encabezado...
                </Typography>
                <LinearProgress />
              </Box>
            )}
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                setOpenHeaderEdit(false);
                setHeaderFile(null);
                setHeaderPreview(null);
              }}
              disabled={headerUploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={saveHeader}
              variant='contained'
              disabled={headerUploading}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
         </Box>
    </>
  );
  };

