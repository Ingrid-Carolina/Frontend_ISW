import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { api } from "../../api/api";
import {
  Box, Typography, Card, CardContent, CardMedia,
  Button, Grid, Dialog, DialogContent, IconButton,
  Menu, MenuItem, Checkbox, FormControlLabel
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// --- Estadísticas ordenadas ---
const orderStats = [
  "ID", "name", "G", "PA", "AB", "R", "H", "B", "1B", "2B", "3B", "HR",
  "XBH", "TB", "OB", "RC", "RBI", "AVG", "BB", "BBi", "Xc", "Ks", "SO",
  "BB/K", "BB/PA", "HBP", "SB", "CS", "PK", "SCB", "SF", "SAC", "RPA",
  "OBP", "OBPE", "SLG", "OPS", "GPA", "LOBi", "LOB", "ROE", "FC", "CH", "IMG"
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

// --- Mapeo columnas BD -> frontend ---
const mappingBDtoFront = {
  juegos_jugados: "G",
  apar_Plato: "PA",
  turnos_Bate: "AB",
  carreras_Anotadas: "R",
  hits: "H",
  bases_Alcanzadas: "B",
  sencillos: "1B",
  dobles: "2B",
  triples: "3B",
  jonron: "HR",
  extrabases: "XBH",
  total_Bases: "TB",
  veces_base: "OB",
  carreras_creadas: "RC",
  carreras_impulsadas: "RBI",
  promedio_bateo: "AVG",
  bases_bola: "BB",
  bases_bola_int: "BBi",
  extra_contados: "Xc",
  ponches_tirandole: "Ks",
  ponches_totales: "SO",
  boletos_ponche: "BB/K",
  porcentaje_boletos_apa: "BB/PA",
  golpeado_lanzamiento: "HBP",
  bases_robadas: "SB",
  atrapado_robando: "CS",
  pickoffs: "PK",
  sacrificio_bateo: "SCB",
  flies_sacrificio: "SF",
  toques_sacrificio: "SAC",
  carrera_apari_plato: "RPA",
  porcentaje_embasado: "OBP",
  obp_estimado: "OBPE",
  slugging: "SLG",
  obp_mas_slug: "OPS",
  promedio_poder: "GPA",
  corredores_dejados_base_ind: "LOBi",
  corredores_dejados_base_equi: "LOB",
  llegadas_por_error: "ROE",
  jugada_de_seleccion: "FC",
  opor_fildeo: "CH",
  img: "IMG"
};

export default function StatsJugadores() {
  const [jugadores, setJugadores] = useState([]);
  const [open, setOpen] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [modoDetalle, setModoDetalle] = useState("detallado");
  const [busqueda, setBusqueda] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [jugadorMenu, setJugadorMenu] = useState(null);

  const [openComparar, setOpenComparar] = useState(false);
  const [jugadorBase, setJugadorBase] = useState(null);
  const [jugadorComparado, setJugadorComparado] = useState(null);

  const [jugadorEnConflicto, setJugadorEnConflicto] = useState([]);
  const [openConflicto, setOpenConflicto] = useState(false);
  const [seleccionConflictos, setSeleccionConflictos] = useState({});

  // --- Estados popup sin selección ---
  const [openConfirmarSinSeleccion, setOpenConfirmarSinSeleccion] = useState(false);
  const [jugadoresSinSeleccion, setJugadoresSinSeleccion] = useState([]);

  useEffect(() => { fetchJugadores(); }, []);

  const fetchJugadores = async () => {
    try {
      const res = await api.get("/auth/jugadores");
      const data = res.data?.jugadores || [];
      const jugadoresConvertidos = data.map((row) => {
        const jugador = {
          ID: row.id,
          name: row.nombre || row.name,
          foto: row.foto || "/Images/jugador.jpg",
        };
        for (const [colBD, colFront] of Object.entries(mappingBDtoFront)) {
          jugador[colFront] = row[colBD];
        }
        return jugador;
      });
      setJugadores(jugadoresConvertidos);
    } catch (err) {
      console.error("Error al obtener jugadores:", err);
    }
  };

  const obtenerSiguienteID = (listaJugadores) => {
    return listaJugadores.length ? Math.max(...listaJugadores.map(j => j.ID)) + 1 : 1;
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      let jugadoresTemp = [...jugadores];
      const conflictos = [];

      data.forEach(row => {
        const nuevoJugador = { ...row, ID: row.ID, name: row.Name, foto: "/Images/jugador.jpg" };
        const conflictosNombre = jugadoresTemp.filter(j => j.name.toLowerCase() === nuevoJugador.name.toLowerCase());
        if (conflictosNombre.length > 0) {
          conflictos.push({ nuevoJugador, conflictosExistentes: conflictosNombre });
        } else if (jugadoresTemp.find(j => j.ID === nuevoJugador.ID)) {
          nuevoJugador.ID = obtenerSiguienteID(jugadoresTemp);
          jugadoresTemp.push(nuevoJugador);
        } else {
          jugadoresTemp.push(nuevoJugador);
        }
      });

      setJugadores(jugadoresTemp);

      if (conflictos.length > 0) {
        setJugadorEnConflicto(conflictos);
        setOpenConflicto(true);
      }
    };

    reader.readAsBinaryString(file);
  };

  const aplicarCambios = () => {
    let jugadoresTemp = [...jugadores];
    let nextID = obtenerSiguienteID(jugadoresTemp);

    jugadorEnConflicto.forEach(conflicto => {
      const sel = seleccionConflictos[conflicto.nuevoJugador.ID] || {};
      if (sel.actualizar) {
        jugadoresTemp = jugadoresTemp.map(j =>
          j.ID === conflicto.conflictosExistentes[0].ID
            ? { ...conflicto.nuevoJugador, ID: conflicto.conflictosExistentes[0].ID }
            : j
        );
      } else if (sel.agregar) {
        jugadoresTemp.push({ ...conflicto.nuevoJugador, ID: nextID });
        nextID++;
      }
      // si no hay selección, se deja igual
    });

    setJugadores(jugadoresTemp);
    setOpenConflicto(false);
    setJugadorEnConflicto([]);
    setSeleccionConflictos({});
    setOpenConfirmarSinSeleccion(false);
    setJugadoresSinSeleccion([]);
  };

  const handleAplicarConflictos = () => {
    const sinSeleccion = jugadorEnConflicto.filter(conflicto => {
      const sel = seleccionConflictos[conflicto.nuevoJugador.ID];
      return !sel?.actualizar && !sel?.agregar;
    });

    if (sinSeleccion.length > 0) {
      setJugadoresSinSeleccion(sinSeleccion);
      setOpenConfirmarSinSeleccion(true);
      return;
    }

    aplicarCambios();
  };

  const jugadoresFiltrados = jugadores.filter(j => j.name?.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <Box sx={{ width: "100%", pt: 2 }}>
      <Typography variant="h2" sx={{ fontFamily: "GroteskBold", color: "#10045c", mb: 4, textAlign: "center" }}>Estadísticas de Jugadores</Typography>

      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Button variant="contained" component="label" sx={{ backgroundColor: "#10045c" }}>
          Importar Excel con Estadísticas
          <input type="file" accept=".xlsx, .xls" hidden onChange={handleImportExcel} />
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <input type="text" placeholder="Buscar jugador..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ width: "100%", maxWidth: "960px", padding: "12px", borderRadius: "20px", border: "1px solid #ccc", fontSize: "16px" }} />
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {jugadoresFiltrados.map(jugador => (
          <Grid item xs={12} sm={6} md={4} key={jugador.ID}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center", p: 2, position: "relative" }}>
              <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={(e) => { setAnchorEl(e.currentTarget); setJugadorMenu(jugador); }}>
                <MoreVertIcon />
              </IconButton>
              <CardMedia component="img" image={jugador.foto} alt={jugador.name} sx={{ objectFit: "cover", borderRadius: 3, maxWidth: "300px", mx: "auto", mb: 2 }} />
              <CardContent>
                <Typography variant="h6" sx={{ fontFamily: "GroteskBold", mb: 1 }}>{jugador.name}</Typography>
                <Button variant="contained" sx={{ mr: 1, backgroundColor: "#10045c" }} onClick={() => { setJugadorSeleccionado(jugador); setModoDetalle("detallado"); setOpen(true); }}>Ver Estadísticas Detalladas</Button>
                <Button variant="outlined" onClick={() => { setJugadorSeleccionado(jugador); setModoDetalle("resumido"); setOpen(true); }}>Ver Estadísticas Resumidas</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* --- Menú acciones jugador --- */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => { setAnchorEl(null); setJugadorMenu(null); }}>
        <MenuItem onClick={() => { if (jugadorMenu) { setJugadorBase(jugadorMenu); setOpenComparar(true); setAnchorEl(null); setJugadorMenu(null); } }}>
          Comparar jugador
        </MenuItem>
      </Menu>

      {/* --- Popup conflictos --- */}
      <Dialog open={openConflicto} onClose={() => setOpenConflicto(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: "center", p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>¡Conflictos de jugadores!</Typography>
          <Typography sx={{ mb: 3 }}>Selecciona qué acción tomar para cada jugador:</Typography>

          {jugadorEnConflicto.map((conflicto, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, p: 1, border: "1px solid #ccc", borderRadius: 2 }}
            >
              <Box>
                <Typography><b>{conflicto.nuevoJugador.name}</b> (ID: {conflicto.nuevoJugador.ID})</Typography>
                <Typography variant="body2" color="textSecondary">Conflicta con: {conflicto.conflictosExistentes.map(j => `${j.name} (ID: ${j.ID})`).join(", ")}</Typography>
              </Box>

              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seleccionConflictos[conflicto.nuevoJugador.ID]?.actualizar || false}
                      onChange={() =>
                        setSeleccionConflictos(prev => ({
                          ...prev,
                          [conflicto.nuevoJugador.ID]: { actualizar: true, agregar: false }
                        }))
                      }
                    />
                  }
                  label="Actualizar"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={seleccionConflictos[conflicto.nuevoJugador.ID]?.agregar || false}
                      onChange={() =>
                        setSeleccionConflictos(prev => ({
                          ...prev,
                          [conflicto.nuevoJugador.ID]: { actualizar: false, agregar: true }
                        }))
                      }
                    />
                  }
                  label="Agregar Igualmente"
                />
              </Box>
            </Box>
          ))}

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="contained" onClick={handleAplicarConflictos}>Aplicar Selección</Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* --- Popup confirmación sin selección --- */}
      <Dialog open={openConfirmarSinSeleccion} onClose={() => setOpenConfirmarSinSeleccion(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: "center", p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Algunos jugadores no tienen acción seleccionada</Typography>
          <Typography sx={{ mb: 3 }}>
            {jugadoresSinSeleccion.map(j => j.nuevoJugador.name).join(", ")}<br />
            Se dejarán igual que antes. ¿Deseas continuar?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenConfirmarSinSeleccion(false)}>Volver</Button>
            <Button variant="contained" onClick={aplicarCambios}>Continuar de todos modos</Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* --- Dialog detalle jugador --- */}
      <Dialog open={open} onClose={() => { setOpen(false); setJugadorSeleccionado(null); }} maxWidth="md" fullWidth sx={{ "& .MuiDialog-paper": { mt: 15 } }}>
        <DialogContent>
          {jugadorSeleccionado && (
            <Box sx={{ textAlign: "center", p: 2 }}>
              <CardMedia component="img" height="200" image={jugadorSeleccionado.foto} alt={jugadorSeleccionado.name} sx={{ objectFit: "cover", borderRadius: 3, maxWidth: "300px", mx: "auto", mb: 2 }} />
              <Typography variant="h5" sx={{ fontFamily: "GroteskBold", mb: 2 }}>{jugadorSeleccionado.name}</Typography>

              <Card sx={{ borderRadius: 4, boxShadow: 6, p: 3, background: '#10045c', maxWidth: "700px", mx: "auto", mb: 2 }}>
                {modoDetalle === "detallado" ? (
                  <Box sx={{ columnCount: 3, columnGap: "20px", px: 3 }}>
                    {orderStats.filter(statKey => !["name", "IMG"].includes(statKey)).map(statKey => jugadorSeleccionado[statKey] !== undefined && (
                      <Typography key={statKey} sx={{ breakInside: "avoid", color: "#ffffffff" }}>
                        <b>{statKey}:</b> {jugadorSeleccionado[statKey]}
                      </Typography>
                    ))}
                  </Box>
                ) : (
                  Object.entries(resumenStats).map(([key, label]) => jugadorSeleccionado[key] !== undefined && (
                    <Typography key={key} sx={{ mb: 1, fontSize: "16px", color: "#ffffffff" }}><b>{label} ({key}):</b> {jugadorSeleccionado[key]}</Typography>
                  ))
                )}
              </Card>

              <Button onClick={() => { setOpen(false); setJugadorSeleccionado(null); }} variant="contained" sx={{ mt: 2, backgroundColor: "#10045c" }}>Cerrar</Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* --- Dialog comparar jugadores --- */}
      <Dialog
        open={openComparar}
        onClose={() => {
          setOpenComparar(false);
          setJugadorBase(null);
          setJugadorComparado(null);
        }}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 4,
            boxShadow: 8,
            background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
            mt: 15,
          },
        }}
      >
        <DialogContent>
          {!jugadorComparado ? (
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 4, fontFamily: "GroteskBold", color: "#10045c" }}
              >
                Selecciona un Jugador Para Comparar con {jugadorBase?.name}
              </Typography>

              <Grid container spacing={3} justifyContent="center" alignItems="center">
                {jugadores
                  .filter((j) => j.ID !== jugadorBase?.ID)
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
                          background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
                          "&:hover": { transform: "scale(1.05)", boxShadow: 10 },
                        }}
                        onClick={() => setJugadorComparado(j)}
                      >
                        <CardMedia
                          component="img"
                          image={j.foto}
                          alt={j.name}
                          sx={{ objectFit: "cover", borderRadius: 3, height: 180, mb: 2 }}
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
                sx={{ mb: 3, fontFamily: "GroteskBold", color: "#10045c" }}
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
                {/* Cabecera */}
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
                {orderStats.map((statKey, index) =>
                  jugadorBase[statKey] !== undefined && jugadorComparado[statKey] !== undefined ? (
                    <React.Fragment key={statKey}>
                      <Typography
                        sx={{ py: 1, background: index % 2 === 0 ? "#f9f9f9" : "white" }}
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
                        sx={{ py: 1, background: index % 2 === 0 ? "#f9f9f9" : "white" }}
                      >
                        {jugadorComparado[statKey]}
                      </Typography>
                    </React.Fragment>
                  ) : null
                )}
              </Box>

              <Button
                onClick={() => {
                  setOpenComparar(false);
                  setJugadorBase(null);
                  setJugadorComparado(null);
                }}
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
