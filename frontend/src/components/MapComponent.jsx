// src/components/MapComponent.jsx es un componente de React que muestra un mapa interactivo utilizando Leaflet.
// El mapa está centrado en una ubicación específica y muestra un marcador con un popup.
// El componente acepta una prop isInteractive para habilitar o deshabilitar la interactividad del mapa.
// También incluye estilos CSS específicos en MapComponent.css.
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import PropTypes from 'prop-types';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const MapComponent = ({ isInteractive = true }) => {
	const mapElRef = useRef(null);
	const mapRef = useRef(null);

	useEffect(() => {
		if (!mapElRef.current) return;

		const coord = [14.051398595688246, -87.21678472908647];

		// crear mapa con controles según isInteractive
		mapRef.current = L.map(mapElRef.current, {
			center: coord,
			zoom: 15,
			dragging: isInteractive,
			scrollWheelZoom: isInteractive,
			doubleClickZoom: isInteractive,
			boxZoom: isInteractive,
			keyboard: isInteractive,
			tap: isInteractive,
			touchZoom: isInteractive,
		});

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(mapRef.current);

		// icono por defecto
		const DefaultIcon = L.icon({
			iconUrl: markerIcon,
			iconRetinaUrl: markerIcon2x,
			shadowUrl: markerShadow,
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41],
		});
		L.Marker.prototype.options.icon = DefaultIcon;

		const marker = L.marker(coord, { keyboard: false }).addTo(mapRef.current);
		marker.bindPopup(
			'<b>Asociación de Béisbol Menor - FAH</b><br>Tegucigalpa, Honduras',
		);

		if (!isInteractive) {
			// robustez extra: deshabilita handlers otra vez por si el usuario cambia el prop
			mapRef.current.dragging.disable();
			mapRef.current.touchZoom.disable();
			mapRef.current.doubleClickZoom.disable();
			mapRef.current.scrollWheelZoom.disable();
			mapRef.current.boxZoom.disable();
			mapRef.current.keyboard.disable();
			if (mapRef.current.tap) mapRef.current.tap.disable();
			marker.openPopup();
		}

		return () => {
			if (mapRef.current) mapRef.current.remove();
		};
	}, [isInteractive]);

	return (
		<div
			ref={mapElRef}
			className='map-container'
			style={{
				height: 360,
				width: '100%',
				borderRadius: 8,
				overflow: 'hidden',
			}}
		/>
	);
};

MapComponent.propTypes = {
	isInteractive: PropTypes.bool,
};

export default MapComponent;
