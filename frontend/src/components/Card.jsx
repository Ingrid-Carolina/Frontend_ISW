/*Card.jsx es el archivo principal de las tarjetas que se encuentran en la homepage*/
import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MediaCard({ title, to, content, image, date }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      sx={{//Ajustes de la base de la tarjeta
        maxWidth: 400,
        width: '100%',
        margin: '15px',
        backgroundColor: '#10045c',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardMedia
        component="img"//Imagen de la tarjeta
        alt="card image"
        image={image}
        sx={{
          objectFit: 'cover',
          height: { xs: 180, sm: 200, md: 240 },
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}> {/* Contenido de la tarjeta */}
        <Typography
          gutterBottom
          variant="h4"
          component="div"
          sx={{ //Estilos del título de la tarjeta
            textAlign: 'left',
            fontWeight: 'bold',
            fontFamily: 'GroteskBold, sans-serif',
            color: isHovered ? '#2949fe' : 'white',
            transition: 'color 0.3s ease',
            cursor: 'pointer',
            fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' },
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link // Enlace al detalle de la noticia
            to={to}
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={() => window.scrollTo(0, 0)}
          >
            {title}
          </Link>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            fontFamily: 'PeterMedium, sans-serif',
            textAlign: 'left',
            lineHeight: 1.6,
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
          }}
        >
          {content}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Typography
          variant="subtitle1"
          color="white"
          sx={{
            textAlign: 'center',
            fontFamily: 'PeterMedium, sans-serif',
            mb: 2,
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
          }}
        >
          {date}
        </Typography>
      </CardActions>
    </Card>
  );
}
