// frontend/src/components/ScrollToTop.jsx es un componente de React que asegura que la página se desplace automáticamente hacia arriba cada vez que el usuario navega a una nueva ruta en la aplicación. Utiliza los hooks useEffect y useLocation de React Router para detectar cambios en la ruta y ejecutar el desplazamiento.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
};

export default ScrollToTop;
