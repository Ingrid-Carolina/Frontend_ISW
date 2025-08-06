import { useState } from 'react';
import './EditarPerfil.css';

function EditarPerfil() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [avatar, setAvatar] = useState('/Images/AvatarBboy.jpeg'); // imagen por defecto

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const handleGuardar = () => {
    // Aquí iría la lógica para guardar los cambios (ej. API)
    alert('Cambios guardados');
  };

  const handleCancelar = () => {
    // Reinicia campos (o navegar hacia atrás si prefieres)
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
    </div>
  );
}

export default EditarPerfil;
