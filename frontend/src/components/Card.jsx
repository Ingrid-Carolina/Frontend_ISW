import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export default function MediaCard({ title, content, image, date }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card sx={{ maxWidth: 345}} style={{margin:100, height:'auto'}}>
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
            textAlign: 'center', 
            fontWeight: 'bold',
            color: isHovered ? '#ADD8E6' : 'inherit', 
            transition: 'color 0.3s ease',
            cursor: 'pointer' 
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {title}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary', 
            textAlign: 'center',  
            lineHeight: 1.6  
          }}
        >
          {content}
        </Typography>
      </CardContent>
      <CardActions>
        <Typography  
          variant="subtitle1"  
          color="text.secondary" 
          sx={{ textAlign: 'center', mb: 2 }}
        >
          {date}
        </Typography>
      </CardActions>
    </Card>
  );
}