import React, { useState, useEffect } from 'react';

// Estado inicial del formulario vacío
const emptyForm = { fullName: '', email: '', phoneNumber: '' };

// Recibimos 3 props de App.jsx
function UserForm({ currentUser, onSave, onCancel }) {
  const [formData, setFormData] = useState(emptyForm);

  // Este useEffect se dispara CADA VEZ que 'currentUser' cambia
  useEffect(() => {
    if (currentUser) {
      // Si hay un usuario para editar, llenamos el formulario con sus datos
      setFormData(currentUser);
    } else {
      // Si no (currentUser es null), reseteamos el formulario
      setFormData(emptyForm);
    }
  }, [currentUser]); // Dependencia: se ejecuta si currentUser cambia

  // Maneja los cambios en CUALQUIER input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    onSave(formData); // Llama a la función 'handleSave' en App.jsx
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      {/* El título cambia si estamos editando o creando */}
      <h3>{currentUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
      
      <div className="form-group">
        <label htmlFor="fullName">Nombre Completo:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="phoneNumber">Número de Teléfono:</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          {currentUser ? 'Actualizar' : 'Guardar'}
        </button>
        
        {/* Mostramos "Cancelar" solo si estamos editando */}
        {currentUser && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default UserForm;
