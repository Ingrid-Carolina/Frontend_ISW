import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MediaCard({title,to, content, image, date }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card sx={{ maxWidth: 400, height: 'auto', margin: '15px', backgroundColor: '#10045c'}}>
      <CardMedia
        component="img"
        alt="card image"
        height="240"
        image={image}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography 
          gutterBottom 
          variant="h4" 
          component="div"
          sx={{ 
            textAlign: 'left', 
            fontWeight: 'bold',
            fontFamily: 'GroteskBold, sans-serif',
            color: isHovered ? '#e06c14' : 'white', 
            transition: 'color 0.3s ease',
            cursor: 'pointer' 
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
      <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => window.scrollTo(0, 0)}>
        {title}
      </Link>

        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'white', 
            fontFamily: 'PeterMedium, sans-serif',
            textAlign: 'left',  
            lineHeight: 1.6  
          }}
        >
          {content}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Typography  
          variant="subtitle1"  
          color="white" 
          sx={{ textAlign: 'center', fontFamily: 'PeterMedium, sans-serif', mb: 2 }}
        >
          {date}
        </Typography>
      </CardActions>
    </Card>
  );
}