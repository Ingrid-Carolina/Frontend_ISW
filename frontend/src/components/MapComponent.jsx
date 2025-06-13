import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import PropTypes from 'prop-types';

const MapComponent = ({ isInteractive = true }) => {
	const mapRef = useRef(null);
	// const latRef = useRef(null);
	// const lonRef = useRef(null);

	useEffect(() => {
		const coord = [14.051398595688246, -87.21678472908647];
		mapRef.current = L.map('map').setView(coord, 15);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(mapRef.current);

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

	useEffect(() => {
		if (!mapRef.current) return;

		if (isInteractive) {
			mapRef.current.dragging.enable();
			mapRef.current.scrollWheelZoom.enable();
			mapRef.current.doubleClickZoom.enable();
			mapRef.current.boxZoom.enable();
			mapRef.current.keyboard.enable();
			if (mapRef.current.tap) mapRef.current.tap.enable();
			mapRef.current.touchZoom.enable();
		} else {
			mapRef.current.dragging.disable();
			mapRef.current.scrollWheelZoom.disable();
			mapRef.current.doubleClickZoom.disable();
			mapRef.current.boxZoom.disable();
			mapRef.current.keyboard.disable();
			if (mapRef.current.tap) mapRef.current.tap.disable();
			mapRef.current.touchZoom.disable();
		}
	}, [isInteractive]);

	/**
	 * Handle wheel event
	 * @param {React.WheelEvent} event - The wheel event object
	 */
	const wheelMoving = event => {
		event.preventDefault();
	};

	return (
		<div onWheel={wheelMoving} className='map-container'>
			<div id='map'></div>
		</div>
	);
};

MapComponent.propTypes = {
	isInteractive: PropTypes.bool,
};

export default MapComponent;
