// src/firebaseConfig.js

// Importa la función para inicializar la app de Firebase
import { initializeApp } from 'firebase/app';
// Importa la función para obtener el módulo de autenticación de Firebase
import { getAuth } from 'firebase/auth';

// Objeto de configuración de Firebase con las credenciales del proyecto
const firebaseConfig = {
  apiKey: "TU_API_KEY",               // Clave de API pública de tu proyecto Firebase
  authDomain: "TU_DOMINIO.firebaseapp.com", // Dominio de autenticación de Firebase
  projectId: "TU_PROJECT_ID",         // ID único de tu proyecto en Firebase
  // Puedes agregar otras propiedades como storageBucket, messagingSenderId, appId, etc.
};

// Inicializa la aplicación de Firebase con la configuración proporcionada
const app = initializeApp(firebaseConfig);

// Obtiene el servicio de autenticación de Firebase asociado a la app
const auth = getAuth(app);

// Exporta el objeto auth para usarlo en otros archivos (login, registro, etc.)
export { auth };
