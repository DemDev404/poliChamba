import { useLoaderData, useNavigate, useSearchParams, Link } from "react-router";
import { useState } from "react";
import axios from "axios";

export async function loader() {
  try {
    const response = await axios.get("http://localhost:4000/users");
    return response.data;
  } catch (error) {
    return [];
  }
}

export default function AdminHome() {
  const initialUsers = useLoaderData() as any[];
  const [users, setUsers] = useState(initialUsers);
  const [searchParams] = useSearchParams();
  const adminName = searchParams.get("name") || "Admin Supremo";
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("¿Estás seguro de eliminar a este usuario permanentemente?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:4000/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      alert("Usuario eliminado correctamente.");
    } catch (error) {
      alert("Error al eliminar usuario.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="text-xl font-bold leading-none">Panel de Administración</h1>
              <p className="text-xs text-gray-400">PoliChamba Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm hidden sm:block">Hola, {adminName}</span>
            <Link to="/login" className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold transition">
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Usuarios</h3>
                <p className="text-4xl font-extrabold text-gray-800">{users.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Candidatos</h3>
                <p className="text-4xl font-extrabold text-gray-800">
                    {users.filter(u => u.role?.name === 'candidate').length}
                </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Empresas</h3>
                <p className="text-4xl font-extrabold text-gray-800">
                    {users.filter(u => u.role?.name === 'recruiter' || u.role?.name === 'company').length}
                </p>
            </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#6F1D35] rounded-full block"></span>
            Gestión de Usuarios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div 
                key={user.id} 
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border-t-4 ${
                    user.role?.name === 'admin' ? 'border-red-500' :
                    user.role?.name === 'recruiter' ? 'border-purple-500' : 'border-blue-500'
                }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${
                        user.role?.name === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role?.name === 'recruiter' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                        {user.role?.name || "Sin Rol"}
                    </span>
                    <span className="text-xs text-gray-400">ID: {user.id}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                    📧 {user.email}
                </p>

                <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-400">Registrado recientemente</span>
                    
                    {user.role?.name !== 'admin' && ( 
                        <button 
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-1.5 rounded-md text-sm font-bold transition-all"
                        >
                            🗑️ Eliminar
                        </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
            <div className="text-center py-20 text-gray-500">
                <p>No hay usuarios registrados (o error de conexión).</p>
            </div>
        )}
      </div>
    </div>
  );
}