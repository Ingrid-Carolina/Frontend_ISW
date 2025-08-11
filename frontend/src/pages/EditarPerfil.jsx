import { useState, useEffect } from 'react';
import './EditarPerfil.css';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function EditarPerfil() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [avatar, setAvatar] = useState('/Images/AvatarBboy.jpeg');
  const [popup, setPopup] = useState({ visible: false, titulo: '', mensaje: '', tipo: '' });
  const [searchParams] = useSearchParams();

   const fetchPerfil = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3000/auth/obtenerperfil',
        );
        const perfil = res.data; //estoy trasladando a testimonios el fetch de la tabla del formato JSON sended del res en Authcontroller
 

        setNombre(perfil[0].nombre);
        setDescripcion(perfil[0].descripcion);
       
 
      } catch (err) {
        console.error('Error al obtener el perfil:', err);
      }
    };
 


  // ✅ Detectar si se pasa un avatar por parámetro en la URL (desde otra página)
  useEffect(() => {
    const nuevoAvatar = searchParams.get('avatar');
    if (nuevoAvatar) {
      setAvatar(decodeURIComponent(nuevoAvatar));
    }

    fetchPerfil();
    
  }, [searchParams]);

  const mostrarPopup = (titulo, mensaje, tipo) => {
    setPopup({ visible: true, titulo, mensaje, tipo });
  };

  const cerrarPopup = () => {
    setPopup({ visible: false, titulo: '', mensaje: '', tipo: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      mostrarPopup("Cambio fallido", "El nombre no puede estar vacío.", "error");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/editarperfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre, descripcion, avatar }) // 🔹 Enviamos todo
      });

      const data = await response.json();
      console.log("Respuesta backend:", data);

      if (response.ok) {
        mostrarPopup("Cambio exitoso", "Perfil actualizado correctamente.", "success");
      } else if (data.errors && Array.isArray(data.errors)) {
        const mensajes = data.errors.map(err => err.msg).join('\n');
        mostrarPopup("Cambio fallido", mensajes, "error");
      } else {
        mostrarPopup("Cambio fallido", data.mensaje || "Error desconocido.", "error");
      }
    } catch (err) {
      console.error(err);
      mostrarPopup("Cambio fallido", "Hubo un error al guardar los cambios.", "error");
    }
  };

  const handleCancelar = () => {
    setNombre('');
    setDescripcion('');
    setAvatar('/Images/AvatarBboy.jpeg');
  };

  return (
    <div className="perfil-container">
      <h1>Editar Perfil</h1>
      <div className="perfil-content">
        <div className="avatar-section">
          <img src={avatar} alt="Avatar" className="avatar-img" />
          
          {/* 🔹 Link para ir a la página de selección de avatares */}
          <Link to="/Avatars" className="avatar-button" style={{ textDecoration: 'none' }}>
            Cambiar Avatar
          </Link>

          {/* 🔹 También opción para subir archivo */}
          <label className="avatar-button">
            Subir Avatar
            <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
          </label>
        </div>

        <div className="info-section">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input-field"
          />

          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="textarea-field"
            rows={4}
          />

          <div className="botones">
            <button className="guardar-btn" onClick={handleGuardar}>Guardar</button>
            <button className="cancelar-btn" onClick={handleCancelar}>Cancelar</button>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {popup.visible && (
        <div className="popup">
          <div className={`popup-content ${popup.tipo === 'success' ? 'popup-success' : 'popup-error'}`}>
            <h2>{popup.titulo}</h2>
            <p>{popup.mensaje}</p>
            <button onClick={cerrarPopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditarPerfil;
