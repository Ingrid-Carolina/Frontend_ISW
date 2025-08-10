import { useState } from 'react';
import './EditarPerfil.css';
import { Link } from 'react-router-dom';

function EditarPerfil() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [avatar, setAvatar] = useState('/Images/AvatarBboy.jpeg'); // imagen por defecto
  const [isLoading, setIsLoading] = useState(true);
  const [popup, setPopup] = useState({ visible: false, titulo: '', mensaje: '', tipo: '' });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const handleGuardar = () => {

    alert('Cambios guardados');
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
          <Link to="/Avatars" className="avatar-button" style={{ textDecoration: 'none' }}>
            Cambiar Avatar
          </Link>
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
