import { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import UserTable from './components/UserTable';
import Swal from 'sweetalert2';
import './App.css'; // Importaremos los estilos

// Esta es la URL de tu backend (el server Spring Boot)
const API_URL = `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_BASE}`;

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Para editar
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar usuarios cuando el componente se monta
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- FUNCIÓN 1: OBTENER TODOS (GET) ---
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo obtener la lista`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener usuarios:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNCIÓN 2: CREAR (POST) y ACTUALIZAR (PUT) ---
  const handleSave = async (user) => {
    let method = 'POST';
    let url = API_URL;

    // Si el usuario tiene ID, es una actualización (PUT)
    if (user.id) {
      method = 'PUT';
      url = `${API_URL}/${user.id}`;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo guardar el usuario`);
      }

      // await response.json(); // Descomenta si tu backend devuelve el usuario guardado

      // Refrescar la lista de usuarios y limpiar el formulario
      fetchUsers();
      setSelectedUser(null);

      // Agregar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: user.id ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message
      });
      setError(err.message);
      console.error('Error al guardar usuario:', err);
    }
  };

  // --- FUNCIÓN 3: ELIMINAR (DELETE) ---
  const handleDelete = async (userId) => {
    // Usar SweetAlert2 para la confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo eliminar el usuario`);
        }

        // Mostrar mensaje de éxito
        await Swal.fire(
          '¡Eliminado!',
          'El usuario ha sido eliminado.',
          'success'
        );

        // Refrescar la lista de usuarios
        fetchUsers();
      } catch (err) {
        // Mostrar mensaje de error
        await Swal.fire(
          'Error',
          err.message,
          'error'
        );
        setError(err.message);
        console.error('Error al eliminar usuario:', err);
      }
    }
  };

  // --- Funciones auxiliares para el formulario ---
  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
  };

  // --- Renderizado ---
 return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sistema de Gestión de Usuarios</h1>
        <p>SGU-AGB-10A</p>
      </header>

      <div className="form-section">
        <UserForm
          currentUser={selectedUser}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      </div>

      <div className="table-section">
        <h2>Lista de Usuarios</h2>
        {isLoading && <p>Cargando usuarios...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && (
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}


export default App;
