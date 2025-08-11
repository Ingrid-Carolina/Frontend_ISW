import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const visitData = [
  { month: "Ene", Visitas: 120 },
  { month: "Feb", Visitas: 195 },
  { month: "Mar", Visitas: 140 },
  { month: "Abr", Visitas: 175 },
  { month: "May", Visitas: 250 }
];

export default function Dashboard() {
  return (
    <Box sx={{ width: '100%', pt: 2 }}>
      <Typography
        variant="h2"
        sx={{
          fontFamily: 'GroteskBold',
          color: '#10045c',
          mb: 4,
          textAlign: 'center'
        }}
      >
        Estadisticas del Sitio
      </Typography>

      {/* Contenedor centrado y controlado */}
      <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%" }}>
        {/* Tarjetas de resumen */}
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: "center"  }}>
              <Typography variant="h6" fontFamily="ManropeEB">Visitas</Typography>
              <Typography variant="h4" fontFamily="ManropeEB">1000</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: "center", fontFamily: "ManropeEB" }}>
              <Typography variant="h6" fontFamily="ManropeEB">Usuarios Registrados</Typography>
              <Typography variant="h4" fontFamily="ManropeEB">25</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: "center", fontFamily: "ManropeEB" }}>
              <Typography variant="h6" fontFamily="ManropeEB">Noticias Publicadas</Typography>
              <Typography variant="h4" fontFamily="ManropeEB">5</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Box mt={5}>
          <Typography variant="h4" gutterBottom fontFamily="Varsity" color="#10045c" textAlign="center">
            Visitas por mes
          </Typography>
          <Paper sx={{ p: 2 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Visitas" fill="#10045c" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
