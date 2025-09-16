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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { api } from "../api/api";
import EditableImageCircular from "../components/EditableImageCircular";


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

function PartnerSection({ name, img, links, reverse = false, onImageUpload, isAdmin }) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const textOrder = isMdUp ? (reverse ? 2 : 1) : 1;
  const imgOrder = isMdUp ? (reverse ? 1 : 2) : 2;

  const imgSlideDir = reverse ? "left" : "right";
  const textSlideDir = reverse ? "right" : "left";

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
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  lineHeight: { xs: 1.7, md: 1.9 },
                  maxWidth: { xs: "100%", md: "80%" },
                  mb: 3,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Gracias al apoyo de nuestros aliados estratégicos, hemos podido
                implementar proyectos sociales, apoyar comunidades vulnerables y
                promover la educación ambiental en distintas regiones del país.
              </Typography>

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
  const [isAdmin, setIsAdmin] = useState(false); // ← rol

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
  }, []);

  // Cargar imágenes
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await api.get("/auth/images");
        const imagesMap = response.data.reduce((acc, current) => {
          if (current?.type) acc[current.type] = current.url;
          return acc;
        }, {});
        setImages(imagesMap);
      } catch (err) {
        console.error("Error al cargar las imágenes:", err);
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

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await api.post("/auth/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const finalUrl = uploadResponse.data.url;

      await api.put("/auth/images", { type, url: finalUrl });

      setImages((prev) => ({ ...prev, [type]: finalUrl }));
    } catch (err) {
      console.error(`Error al actualizar la imagen de tipo ${type}:`, err);
      setError(`Error al actualizar la imagen.`);
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
    <Box sx={{ py: 0, px: 0, bgcolor: "#fff", textAlign: "center" }}>
      {/* Encabezado */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          bgcolor: "#fff",
          minHeight: { xs: "65vh", md: "80vh" },
          backgroundImage: `url(${images.aliados_header})`,
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
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom right, rgba(12,0,90,0.85), rgba(0,0,0,0.7))",
            zIndex: 1,
          }}
        />
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
              variant="h2"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "2.8rem", md: "5rem" },
                fontFamily: "Varsity, sans-serif",
                textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
                mb: 2,
              }}
            >
              Nuestros Aliados
            </Typography>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={fadeUp}
          >
            <Typography
              variant="h6"
              sx={{
                maxWidth: 800,
                fontSize: { xs: "1rem", md: "1.3rem" },
                color: "rgba(255,255,255,0.9)",
                textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                fontWeight: 300,
                fontFamily: "ManropeEB, sans-serif",
              }}
            >
              Gracias a nuestros patrocinadores por impulsar el desarrollo deportivo de nuestros jóvenes atletas y fortalecer el espíritu del béisbol en nuestra comunidad.
            </Typography>
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
          <Typography
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
          >
            Nuestros Socios
          </Typography>
        </motion.div>

        <Typography
          variant="body1"
          sx={{
            maxWidth: { xs: "95vw", md: "75vw" },
            mx: "auto",
            mb: { xs: 6, md: 10 },
            color: "text.secondary",
          }}
          className="section-text"
        >
          La Asociación de Béisbol Menor Pilotos de Honduras (FAH) cuenta con
          más de 76 años de historia desde su formación en 1948. Nuestro
          principal objetivo es la formación integral de jóvenes atletas, no
          solo en el juego del béisbol, sino también en la generación de líderes
          y ciudadanos de sus comunidades y país.
        </Typography>

        {partners.map((p, idx) => (
          <PartnerSection
            key={p.name}
            {...p}
            img={images[p.type]}
            reverse={idx % 2 !== 0}
            onImageUpload={(file) => handleImageChange(p.type, file)}
            isAdmin={isAdmin}
          />
        ))}

        <Typography
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
        >
          Alianzas Estratégicas
        </Typography>

        <Typography
          variant="h6"
          sx={{
            maxWidth: { xs: "95vw", md: "75vw" },
            mx: "auto",
            mb: { xs: 6, md: 10 },
            color: "text.secondary",
            fontFamily: "ManropeEB",
          }}
          className="section-text"
        >
          Unidos con nuestros aliados estratégicos, impulsamos el deporte y transformamos comunidades.
        </Typography>

        {strategicAllies.map((ally, idx) => (
          <PartnerSection
            key={ally.name}
            {...ally}
            img={images[ally.type]}
            reverse={idx % 2 === 0}
            onImageUpload={(file) => handleImageChange(ally.type, file)}
            isAdmin={isAdmin}
          />
        ))}
      </Container>
    </Box>
  );
}
