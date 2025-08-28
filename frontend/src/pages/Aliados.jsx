import React from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import luz from "/Images/LUFUS.jpg";
import mobile from "/Images/Mob.jpg";
import dental from "/Images/d.jpg";
import angelitos from "/Images/fundacion.jpg";
import Faerea from "/Images/fuerzaAerea.jpg";
import { motion } from "framer-motion";

const partners = [
  {
    name: "Luz y Fuerza de San Lorenzo S.A. (Lufussa)",
    img: luz,
    links: [
      { label: "Visitar Página", href: "https://lufussa.com/es/inicio/" },
      { label: "Visita Facebook", href: "https://www.facebook.com/LufussaHonduras/?locale=es_LA" },
    ],
  },
  {
    name: "Mobile Spot Honduras",
    img: mobile,
    links: [
      { label: "Visita Facebook", href: "https://www.facebook.com/MobileSpothonduras" },
      { label: "Visita Instagram", href: "https://www.instagram.com/mobilespothn/?hl=es-la" },
    ],
  },
  {
    name: "Dental D.",
    img: dental,
    links: [
      { label: "Visita Facebook", href: "https://www.facebook.com/Dentaldhn" },
      { label: "Visita Instagram", href: "https://www.instagram.com/dentaldhn/" },
    ],
  },
];

const strategicAllies = [
  {
    name: "Fundacion Angelitos",
    img: angelitos,
    links: [
      { label: "Visita Fundación", href: "http://www.fundacionangelitos.org" },
      { label: "Visita Facebook", href: "https://www.facebook.com/fundacionangelitoshn" },
      { label: "Visita Instagram", href: "https://www.instagram.com/fundacionangelitoshn/" },
    ],
  },
  {
    name: "Fuerza Aérea Hondureña",
    img: Faerea,
    links: [
      { label: "Visita Facebook", href: "https://www.facebook.com/FuerzaAereaHN/?locale=es_LA" },
      { label: "Visita Instagram", href: "https://www.instagram.com/fuerzaaereahn/?hl=es" },
    ],
  },
];

// NEW: variantes de animación
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// NEW: slide desde la izquierda o derecha (según posición de la imagen)
const slideFrom = (dir) => ({
  hidden: { opacity: 0, x: dir === "left" ? -60 : 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
});

// Opcional: pequeño stagger para botones/enlaces
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};


function PartnerSection({ name, img, links, reverse = false }) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // En móviles apilamos; en desktop alternamos con "reverse"
  const textOrder = isMdUp ? (reverse ? 2 : 1) : 1;
  const rightOrder = isMdUp ? (reverse ? 1 : 2) : 2;

  const imgSlideDir = reverse ? "left" : "right";
  const textSlideDir = reverse ? "right" : "left";

  return (
    <Box
      component="section"
      sx={{
        my: { xs: 6, md: 10 } 
      }}
    >
      <Grid
        container
        spacing={{ xs: 4, md: 6 }}
        alignItems="center"
        justifyContent="space-between"
        wrap="wrap"
      >
        {/* Titulo */}
        <Grid item xs={12} md={7} order={textOrder}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            variants={slideFrom(isMdUp ? textSlideDir : "right")}
          >
            <Box sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },   // <- apilar en xs
              alignItems: { xs: "center", lg: "stretch" },  // <- centrar en xs
              gap: { xs: 3, md: 0 },                        // <- aire en xs

            }}>
              <Box>
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

                {/*Subrayado*/}
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

                {/*Texto */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    lineHeight: { xs: 1.7, md: 1.9 },
                    maxWidth: { xs: "100%", md: "80%" },
                    mb: 3,
                    textAlign: { xs: "center", md: "left" }
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


              <Grid item xs={12} md={5} order={rightOrder}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={slideFrom(isMdUp ? imgSlideDir : "left")}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: reverse ? "flex-start" : "flex-end" },
                      mt: { xs: 3, md: 0 },
                      width: "100%",
                    }}
                  >
                    <Box
                      component="img"
                      src={img}
                      alt={name}
                      sx={{
                        width: { xs: 240, sm: 260, md: 300 },
                        height: { xs: 240, sm: 260, md: 300 },
                        objectFit: "contain",
                        borderRadius: "50%",
                        border: { xs: "4px solid #E06C14", md: "6px solid #E06C14" },
                        p: { xs: 1.15, md: 2 },
                        bgcolor: "white",
                        boxShadow: "0 2px 0 rgba(0,0,0,0.05)",
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            </Box>

          </motion.div>


        </Grid>


      </Grid>
    </Box>
  );
}

export default function Aliados() {
  return (
    <Box
      sx={{
        py: 0,
        px: 0,
        bgcolor: "#f9f9f9",
        textAlign: "center",
      }}
    >

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: '65vh', md: '80vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(https://scontent.ftgu2-3.fna.fbcdn.net/v/t39.30808-6/480163521_947789290859942_4018030677925717705_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGgaEHWfw5QqKvsPxfooL5O-zdtk3OFSnL7N22Tc4VKchfM9zSoTqkgCcrs2gFvwph7Ts4JNI0oMfL_V13WbF5x&_nc_ohc=6ZIJPgxs2BAQ7kNvwGRcYiz&_nc_oc=AdnHo4dVpUd1uaJMZmI1gfgUGI7TQCsV5Kblg-eFIrSiHWcG1u5SGzYS-yJRHmuMLY8&_nc_zt=23&_nc_ht=scontent.ftgu2-3.fna&_nc_gid=32Fs-3E_HXpaJRh_HMKztw&oh=00_AfWvFAdWUGXntKtB23D_jXQNvDpxtE9p2Dq6QePWiQZ0pA&oe=68B161C3)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 6, md: 8 },
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom right, rgba(12,0,90,0.85), rgba(0,0,0,0.7))',
          }}
        />

        {/* Contenido */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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
                textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
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
              variant='h6'
              sx={{
                maxWidth: 800,
                fontSize: { xs: '1rem', md: '1.3rem' },
                color: 'rgba(255,255,255,0.9)',
                textShadow: '1px 1px 4px rgba(0,0,0,0.6)',
                fontWeight: 300,
                fontFamily: 'ManropeEB, sans-serif',
              }}
            >
              Gracias a nuestros patrocinadores por impulsar el desarrollo deportivo de nuestros jóvenes atletas y fortalecer el espíritu del béisbol en nuestra comunidad.
            </Typography>

          </motion.div>
        </Box>
      </Box>

      <Container maxWidth="xl">

        {/*Titulo Nuestros Socios */}

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
              fontFamily: 'Varsity, sans-serif',
              color: "#E06C14",
              mb: { xs: 4 },
              mt: { xs: 4, md: 6 },
            }}
            className="heading-title"
          >
            Nuestros Socios
          </Typography>

        </motion.div>

       

        {/* Título Patrocinadores */}
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
          principal objetivo es la formación integral de jovenes atletas, no
          solo en el juego del béisbol, sino también en la generación de líderes
          y ciudadanos de sus comunidades y país.
        </Typography>

        {/* Partners */}
        {partners.map((p, idx) => (
          <PartnerSection key={p.name} {...p} reverse={idx % 2 !== 0} />
        ))}

        {/* Título Alianzas */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "2.8rem", md: "5rem" },
            fontWeight: 800,
            fontFamily: 'Varsity, sans-serif',
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

        {/* Strategic Allies */}
        {strategicAllies.map((ally, idx) => (
          <PartnerSection key={ally.name} {...ally} reverse={idx % 2 === 0} />
        ))}
      </Container>
    </Box >
  );
}
