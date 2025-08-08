import { useState } from 'react';
import './EditarPerfil.css';

function EditarPerfil() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [avatar, setAvatar] = useState('/Images/AvatarBboy.jpeg');
  const [popup, setPopup] = useState({ visible: false, titulo: '', mensaje: '', tipo: '' });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const mostrarPopup = (titulo, mensaje, tipo) => {
    setPopup({ visible: true, titulo, mensaje, tipo });
  };

  const cerrarPopup = () => {
    setPopup({ visible: false, titulo: '', mensaje: '', tipo: '' });
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      mostrarPopup("Cambio fallido", "El nombre no puede estar vacío.", "error");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/editarperfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // ✅ Necesario para enviar la cookie
        body: JSON.stringify({ nombre })
      });

      const data = await response.json();
      console.log("Respuesta backend:", data);

      if (response.ok) {
        // Obtener datos actualizados del usuario
        const userDataResponse = await fetch('http://localhost:3000/auth/datosusuario', {
          method: 'GET',
          credentials: 'include' // ✅ También aquí
        });

        const userData = await userDataResponse.json();
        if (userDataResponse.ok) {
          // Podés actualizar el nombre en el estado si querés mostrarlo
          // pero no guardarlo en localStorage
          setNombre(userData.nombre);
        }

        mostrarPopup("Cambio exitoso", "Nombre actualizado correctamente.", "success");
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
    setAvatar('/images/avatar-default.png');
  };

  return (
    <div className="perfil-container">
      <h1>Editar Perfil</h1>
      <div className="perfil-content">
        <div className="avatar-section">
          <img src={avatar} alt="Avatar" className="avatar-img" />
          <label className="avatar-button">
            Cambiar Avatar
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
