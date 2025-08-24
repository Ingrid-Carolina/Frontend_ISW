import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Dialog,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const jugadores = [
  {
    name: "Juan Pérez",
    foto: "/Images/jugador.jpg",
    G: 20, PA: 80, AB: 70, R: 15, H: 25, B: 5, "1B": 15, "2B": 5, "3B": 2, HR: 3,
    XBH: 10, TB: 40, OB: 30, RC: 12, RBI: 18, AVG: 0.357, BB: 8, BBi: 1,
    Xc: 0, Ks: 5, SO: 5, "BB/K": 1.6, "BB/PA": 0.1, HBP: 2, SB: 4, CS: 1,
    PK: 0, SCB: 0, SF: 1, SAC: 0, RPA: 0.25, OBP: 0.400, OBPE: 0.395,
    SLG: 0.500, OPS: 0.895, GPA: 0.34, LOBi: 3, LOB: 10, ROE: 1, FC: 0, CH: 100,
  },
  {
    name: "Carlos Gómez",
    foto: "/Images/jugador.jpg",
    G: 18, PA: 70, AB: 60, R: 10, H: 18, B: 4, "1B": 12, "2B": 4, "3B": 1, HR: 1,
    XBH: 6, TB: 28, OB: 20, RC: 9, RBI: 14, AVG: 0.300, BB: 6, BBi: 0,
    Xc: 0, Ks: 8, SO: 8, "BB/K": 0.75, "BB/PA": 0.08, HBP: 1, SB: 2, CS: 1,
    PK: 0, SCB: 1, SF: 0, SAC: 0, RPA: 0.21, OBP: 0.350, OBPE: 0.340,
    SLG: 0.466, OPS: 0.816, GPA: 0.29, LOBi: 4, LOB: 12, ROE: 0, FC: 1, CH: 95,
  },
  {
    name: "Luis Martinez",
    foto: "/Images/jugador.jpg",
    G: 22, PA: 85, AB: 75, R: 18, H: 28, B: 6, "1B": 18, "2B": 7, "3B": 1, HR: 2,
    XBH: 10, TB: 42, OB: 35, RC: 14, RBI: 20, AVG: 0.373, BB: 7, BBi: 1,
    Xc: 0, Ks: 6, SO: 6, "BB/K": 1.1, "BB/PA": 0.08, HBP: 2, SB: 3, CS: 0,
    PK: 0, SCB: 0, SF: 2, SAC: 0, RPA: 0.26, OBP: 0.410, OBPE: 0.400,
    SLG: 0.520, OPS: 0.930, GPA: 0.35, LOBi: 2, LOB: 11, ROE: 0, FC: 0, CH: 102,
  },
  {
    name: "Pedro López",
    foto: "/Images/jugador.jpg",
    G: 19, PA: 72, AB: 65, R: 12, H: 20, B: 3, "1B": 14, "2B": 4, "3B": 0, HR: 2,
    XBH: 6, TB: 30, OB: 22, RC: 8, RBI: 15, AVG: 0.307, BB: 5, BBi: 0,
    Xc: 0, Ks: 10, SO: 10, "BB/K": 0.5, "BB/PA": 0.07, HBP: 1, SB: 2, CS: 1,
    PK: 0, SCB: 1, SF: 1, SAC: 0, RPA: 0.22, OBP: 0.340, OBPE: 0.330,
    SLG: 0.461, OPS: 0.801, GPA: 0.28, LOBi: 5, LOB: 13, ROE: 1, FC: 1, CH: 90,
  },
  {
    name: "Andrés Castro",
    foto: "/Images/jugador.jpg",
    G: 21, PA: 78, AB: 68, R: 14, H: 22, B: 4, "1B": 15, "2B": 6, "3B": 0, HR: 1,
    XBH: 7, TB: 32, OB: 25, RC: 10, RBI: 16, AVG: 0.323, BB: 6, BBi: 0,
    Xc: 0, Ks: 7, SO: 7, "BB/K": 0.85, "BB/PA": 0.07, HBP: 1, SB: 1, CS: 0,
    PK: 0, SCB: 0, SF: 1, SAC: 0, RPA: 0.23, OBP: 0.355, OBPE: 0.345,
    SLG: 0.470, OPS: 0.825, GPA: 0.30, LOBi: 3, LOB: 9, ROE: 0, FC: 1, CH: 92,
  },
  {
    name: "Miguel Martinez",
    foto: "/Images/jugador.jpg",
    G: 17, PA: 65, AB: 55, R: 9, H: 15, B: 2, "1B": 10, "2B": 3, "3B": 0, HR: 2,
    XBH: 5, TB: 25, OB: 18, RC: 6, RBI: 12, AVG: 0.272, BB: 4, BBi: 0,
    Xc: 0, Ks: 9, SO: 9, "BB/K": 0.44, "BB/PA": 0.06, HBP: 0, SB: 1, CS: 1,
    PK: 0, SCB: 1, SF: 0, SAC: 0, RPA: 0.19, OBP: 0.310, OBPE: 0.300,
    SLG: 0.455, OPS: 0.765, GPA: 0.25, LOBi: 4, LOB: 10, ROE: 1, FC: 0, CH: 85,
  },
  {
    name: "David Torres",
    foto: "/Images/jugador.jpg",
    G: 23, PA: 90, AB: 80, R: 20, H: 30, B: 7, "1B": 20, "2B": 6, "3B": 1, HR: 3,
    XBH: 10, TB: 50, OB: 38, RC: 15, RBI: 22, AVG: 0.375, BB: 8, BBi: 1,
    Xc: 0, Ks: 6, SO: 6, "BB/K": 1.33, "BB/PA": 0.09, HBP: 1, SB: 5, CS: 1,
    PK: 0, SCB: 0, SF: 1, SAC: 0, RPA: 0.28, OBP: 0.420, OBPE: 0.410,
    SLG: 0.530, OPS: 0.950, GPA: 0.36, LOBi: 2, LOB: 8, ROE: 0, FC: 0, CH: 105,
  },
  {
    name: "José Herrera",
    foto: "/Images/jugador.jpg",
    G: 16, PA: 60, AB: 52, R: 8, H: 14, B: 3, "1B": 9, "2B": 3, "3B": 0, HR: 2,
    XBH: 5, TB: 22, OB: 16, RC: 7, RBI: 11, AVG: 0.269, BB: 3, BBi: 0,
    Xc: 0, Ks: 11, SO: 11, "BB/K": 0.27, "BB/PA": 0.05, HBP: 0, SB: 1, CS: 0,
    PK: 0, SCB: 0, SF: 1, SAC: 0, RPA: 0.18, OBP: 0.300, OBPE: 0.290,
    SLG: 0.423, OPS: 0.723, GPA: 0.22, LOBi: 5, LOB: 12, ROE: 1, FC: 1, CH: 80,
  },
];

const orderStats = [
  "name", "G", "PA", "AB", "R", "H", "B", "1B", "2B", "3B", "HR", "XBH", "TB",
  "OB", "RC", "RBI", "AVG", "BB", "BBi", "Xc", "Ks", "SO", "BB/K", "BB/PA",
  "HBP", "SB", "CS", "PK", "SCB", "SF", "SAC", "RPA", "OBP", "OBPE", "SLG",
  "OPS", "GPA", "LOBi", "LOB", "ROE", "FC", "CH"
];

// --- Estadísticas resumidas ---
const resumenStats = {
  G: "Juegos",
  PA: "Apariciones al bate",
  AB: "Turnos al bate",
  H: "Hits",
  HR: "Home Runs",
  RBI: "Carreras Impulsadas",
  AVG: "Promedio de bateo",
  OBP: "Porcentaje de embasado",
  SLG: "Slugging",
  OPS: "On-base Plus Slugging"
};

export default function StatsJugadores() {
  const [open, setOpen] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [modoDetalle, setModoDetalle] = useState("detallado");
  const [busqueda, setBusqueda] = useState("");

  // --- Menú de opciones ---
  const [anchorEl, setAnchorEl] = useState(null);
  const [jugadorMenu, setJugadorMenu] = useState(null);

  // --- Comparación ---
  const [openComparar, setOpenComparar] = useState(false);
  const [jugadorBase, setJugadorBase] = useState(null);
  const [jugadorComparado, setJugadorComparado] = useState(null);

  const handleOpen = (jugador, modo) => {
    setJugadorSeleccionado(jugador);
    setModoDetalle(modo);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setJugadorSeleccionado(null);
  };

  const handleMenuOpen = (event, jugador) => {
    setAnchorEl(event.currentTarget);
    setJugadorMenu(jugador);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setJugadorMenu(null);
  };

  const handleCompararJugador = (jugador) => {
    setJugadorBase(jugador);
    setOpenComparar(true);
    handleMenuClose();
  };

  const handleSeleccionComparado = (jugador) => {
    setJugadorComparado(jugador);
  };

  const handleCerrarComparar = () => {
    setOpenComparar(false);
    setJugadorBase(null);
    setJugadorComparado(null);
  };

  const jugadoresFiltrados = jugadores.filter((jugador) =>
    jugador.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%", pt: 2 }}>
      <Typography
        variant="h2"
        sx={{
          fontFamily: "GroteskBold",
          color: "#10045c",
          mb: 4,
          textAlign: "center",
        }}
      >
        Estadísticas de Jugadores
      </Typography>

      {/* Campo de búsqueda */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <input
          type="text"
          placeholder="Buscar jugador..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "960px",
            padding: "12px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </Box>

      {/* Grid con 3 columnas */}
      <Grid container spacing={2} justifyContent="center">
        {jugadoresFiltrados.map((jugador, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                textAlign: "center",
                p: 2,
                position: "relative",
              }}
            >
              {/* Botón menú (3 puntitos) */}
              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={(e) => handleMenuOpen(e, jugador)}
              >
                <MoreVertIcon />
              </IconButton>

              <CardMedia
                component="img"
                image={jugador.foto}
                alt={jugador.name}
                sx={{
                  objectFit: "cover",
                  borderRadius: 3,
                  maxWidth: "300px",
                  mx: "auto",
                  mb: 2,
                }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "GroteskBold", mb: 1 }}
                >
                  {jugador.name}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mr: 1, backgroundColor: "#10045c" }}
                  onClick={() => handleOpen(jugador, "detallado")}
                >
                  Ver Estadísticas Detalladas
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleOpen(jugador, "resumido")}
                >
                  Ver Estadísticas Resumidas
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Menú de opciones */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleCompararJugador(jugadorMenu)}>
          Comparar jugador
        </MenuItem>
      </Menu>

      {/* Modal de Detalles */}
      <Dialog open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            mt: 15, // 👈 mueve el modal hacia abajo (ajusta 10,12,14 según necesites)
          },
        }}
      >
        <DialogContent>
          {jugadorSeleccionado && (
            <Box sx={{ textAlign: "center", p: 2 }}>
              <CardMedia
                component="img"
                height="200"
                image={jugadorSeleccionado.foto}
                alt={jugadorSeleccionado.name}
                sx={{
                  objectFit: "cover",
                  borderRadius: 3,
                  maxWidth: "300px",
                  mx: "auto",
                  mb: 2,
                }}
              />
              <Typography variant="h5" sx={{ fontFamily: "GroteskBold", mb: 2 }}>
                {jugadorSeleccionado.name}
              </Typography>

              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 6,
                  p: 3,
                  background: '#10045c',
                  maxWidth: "700px",
                  mx: "auto",
                  mb: 2,
                }}
              >
                {modoDetalle === "detallado" ? (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: "GroteskBold", mb: 2, color: "#ffffffff" }}
                    >
                      Estadísticas Detalladas
                    </Typography>
                    <Box sx={{ columnCount: 3, columnGap: "20px", px: 3 }}>
                      {orderStats.map(
                        (statKey) =>
                          jugadorSeleccionado[statKey] !== undefined && (
                            <Typography key={statKey} sx={{ breakInside: "avoid", color: "#ffffffff" }}>
                              <b>{statKey}:</b> {jugadorSeleccionado[statKey]}
                            </Typography>
                          )
                      )}
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: "GroteskBold", mb: 2, color: "#ffffffff" }}
                    >
                      Estadísticas Resumidas
                    </Typography>
                    {Object.entries(resumenStats).map(
                      ([key, label]) =>
                        jugadorSeleccionado[key] !== undefined && (
                          <Typography key={key} sx={{ mb: 1, fontSize: "16px", color: "#ffffffff" }}>
                            <b>
                              {label} ({key}):
                            </b>{" "}
                            {jugadorSeleccionado[key]}
                          </Typography>
                        )
                    )}
                  </>
                )}
              </Card>

              <Button onClick={handleClose} variant="contained" sx={{ mt: 2, backgroundColor: "#10045c" }}>
                Cerrar
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Comparar */}
      <Dialog
        open={openComparar}
        onClose={handleCerrarComparar}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 4,
            boxShadow: 8,
            background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
            mt: 15, // 👈 mueve el modal hacia abajo (ajusta 10,12,14 según necesites)
          },
        }}
      >
        <DialogContent>
          {!jugadorComparado ? (
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  fontFamily: "GroteskBold",
                  color: "#10045c",
                }}
              >
                Selecciona un Jugador Para Comparar con {jugadorBase?.name}
              </Typography>
              <Grid container spacing={3} justifyContent="center" alignItems="center">
                {jugadores
                  .filter((j) => j.name !== jugadorBase?.name)
                  .map((j, i) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={i}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Card
                        sx={{
                          borderRadius: 4,
                          boxShadow: 6,
                          textAlign: "center",
                          p: 2,
                          cursor: "pointer",
                          maxWidth: "220px",
                          transition: "all 0.3s ease",
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: 10,
                          },
                        }}
                        onClick={() => handleSeleccionComparado(j)}
                      >
                        <CardMedia
                          component="img"
                          image={j.foto}
                          alt={j.name}
                          sx={{
                            objectFit: "cover",
                            borderRadius: 3,
                            height: 180,
                            mb: 2,
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{ fontFamily: "GroteskBold", color: "#10045c" }}
                        >
                          {j.name}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontFamily: "GroteskBold",
                  color: "#10045c",
                }}
              >
                Comparando a {jugadorBase.name} vs {jugadorComparado.name}
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  textAlign: "center",
                  maxHeight: "400px",
                  overflowY: "auto",
                  borderRadius: 3,
                  boxShadow: 4,
                  background: "#ffffff",
                }}
              >
                {/* Cabecera fija */}
                <Box
                  sx={{
                    gridColumn: "span 3",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    background: "#10045c",
                    color: "white",
                    py: 1.5,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    fontWeight: "bold",
                  }}
                >
                  <Typography>{jugadorBase.name}</Typography>
                  <Typography>Estadística</Typography>
                  <Typography>{jugadorComparado.name}</Typography>
                </Box>

                {/* Estadísticas comparadas */}
                {orderStats.map(
                  (statKey, index) =>
                    jugadorBase[statKey] !== undefined &&
                    jugadorComparado[statKey] !== undefined && (
                      <React.Fragment key={statKey}>
                        <Typography
                          sx={{
                            py: 1,
                            background: index % 2 === 0 ? "#f9f9f9" : "white",
                          }}
                        >
                          {jugadorBase[statKey]}
                        </Typography>
                        <Typography
                          sx={{
                            py: 1,
                            fontWeight: "bold",
                            background: index % 2 === 0 ? "#f1f4ff" : "#e9ecf5",
                            color: "#10045c",
                          }}
                        >
                          {statKey}
                        </Typography>
                        <Typography
                          sx={{
                            py: 1,
                            background: index % 2 === 0 ? "#f9f9f9" : "white",
                          }}
                        >
                          {jugadorComparado[statKey]}
                        </Typography>
                      </React.Fragment>
                    )
                )}
              </Box>

              <Button
                onClick={handleCerrarComparar}
                variant="contained"
                sx={{
                  mt: 3,
                  px: 4,
                  borderRadius: 3,
                  backgroundColor: "#10045c",
                  "&:hover": { backgroundColor: "#2b1e80" },
                }}
              >
                Cerrar
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}