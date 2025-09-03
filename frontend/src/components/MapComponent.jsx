import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import PropTypes from 'prop-types';
 import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
 import markerIcon from 'leaflet/dist/images/marker-icon.png';
 import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const MapComponent = ({ isInteractive = true }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const coord = [14.051398595688246, -87.21678472908647];
    mapRef.current = L.map('map').setView(coord, 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

   // Configurar ícono por defecto
   const DefaultIcon = L.icon({
     iconUrl: markerIcon,
     iconRetinaUrl: markerIcon2x,
     shadowUrl: markerShadow,
	 iconSize: [25, 41],      // tamaño del icono
   iconAnchor: [12, 41],    // punto exacto de la coordenada (abajo en el centro)
   popupAnchor: [1, -34],   // dónde aparece el popup relativo al icono
   shadowSize: [41, 41],    // tamaño de la sombra
   });
   L.Marker.prototype.options.icon = DefaultIcon;

    const marker = L.marker(coord).addTo(mapRef.current);
    marker
      .bindPopup(
        '<b>Asociación de Béisbol Menor - FAH</b><br>Tegucigalpa, Honduras',
      )
      .openPopup();

    return () => {
      mapRef.current.remove();
    };
  }, []);
}