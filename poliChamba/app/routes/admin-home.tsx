import { Link, useLoaderData, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import axios from "axios";

export async function loader() {
  try {
    const [usersResponse, jobsResponse] = await Promise.all([
      axios.get("http://localhost:4000/users"),
      axios.get("http://localhost:4000/jobs"), 
    ]);
    
    return { 
        users: usersResponse.data, 
        jobs: jobsResponse.data 
    };
  } catch (error) {
    console.error("Error al cargar datos del administrador:", error);
    return { users: [], jobs: [] };
  }
}

export default function AdminHome() {
  const { users: initialUsers, jobs: initialJobs } = useLoaderData() as any;
  
  const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');
  const [users, setUsers] = useState(initialUsers);
  const [jobs, setJobs] = useState(initialJobs);

  const [searchParams] = useSearchParams();
  const adminName = searchParams.get("name") || "Administrador";

  const handleDelete = async (type: 'user' | 'job', id: number, name: string) => {
    const confirmMsg = `¿Seguro que quieres eliminar ${type} "${name}" (ID: ${id})?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await axios.delete(`http://localhost:4000/${type}s/${id}`);
      
      if (type === 'user') {
        setUsers(users.filter((u: any) => u.id !== id));
      } else {
        setJobs(jobs.filter((j: any) => j.id !== id));
      }
      alert(`${type.toUpperCase()} eliminado correctamente.`);
    } catch (error) {
      alert(`Error al eliminar ${type}. Asegúrate de que no haya dependencias (ej. Aplicaciones a esa oferta).`);
    }
  };



  const UserCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user: any) => (
        <div key={user.id} className={`bg-white rounded-xl shadow-md border-t-4 ${
            user.role?.name === 'admin' ? 'border-red-500' :
            user.role?.name === 'recruiter' ? 'border-[#6F1D35]' : 'border-gray-400'
        }`}>
          <div className="p-6">
            <div className="flex justify-between items-start">
                <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${
                    user.role?.name === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role?.name === 'recruiter' ? 'bg-pink-100 text-[#6F1D35]' : 'bg-blue-100 text-blue-800'
                }`}>
                    {user.role?.name || "Sin Rol"}
                </span>
                {user.email.includes('ipn.mx') && <span className="text-xs text-[#6F1D35] font-bold">🎓 IPN</span>}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mt-3 mb-1">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-gray-600 mb-4">📧 {user.email}</p>
            
            <div className="border-t pt-4 flex justify-end">
                {user.role?.name !== 'admin' && (
                    <button 
                        onClick={() => handleDelete('user', user.id, `${user.firstName} ${user.lastName}`)}
                        className="text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-1.5 rounded-md text-sm font-bold transition-all"
                    >
                        🗑️ Eliminar Usuario
                    </button>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const JobCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job: any) => (
            <div key={job.id} className="bg-white p-6 rounded-xl shadow-md border-t-4 border-[#6F1D35]">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                    🏢 {job.company?.name || "Compañía Eliminada"}
                </p>
                <p className="text-xs text-gray-500">📍 {job.location} | $ {job.salary}</p>

                <div className="border-t pt-4 mt-4 flex justify-end">
                    <button 
                        onClick={() => handleDelete('job', job.id, job.title)}
                        className="text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 px-3 py-1.5 rounded-md text-sm font-bold transition-all"
                    >
                        🗑️ Eliminar Empleo
                    </button>
                </div>
            </div>
        ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-[#6F1D35] text-white p-4 shadow-lg sticky top-0 z-50 border-b-4 border-[#B28F3E]"> {/* Borde dorado sutil */}
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="text-xl font-extrabold leading-none tracking-tight">PoliChamba <span className="font-light opacity-80">| Admin Center</span></h1>
              <p className="text-xs text-gray-200 opacity-80">Panel de Control Institucional</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{adminName}</p>
                <p className="text-xs text-gray-300">Superusuario</p>
            </div>
            <Link to="/login" className="bg-white text-[#6F1D35] hover:bg-gray-100 px-4 py-2 rounded text-sm font-bold transition shadow-sm">
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        
        <div className="flex border-b border-gray-300 mb-8">
            <button 
                onClick={() => setActiveTab('users')} 
                className={`py-3 px-6 text-sm font-bold transition-colors border-b-4 ${
                    activeTab === 'users' ? 'text-[#6F1D35] border-[#6F1D35] bg-white rounded-t-lg' : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
                Gestión de Usuarios ({users.length})
            </button>
            <button 
                onClick={() => setActiveTab('jobs')} 
                className={`py-3 px-6 text-sm font-bold transition-colors border-b-4 ${
                    activeTab === 'jobs' ? 'text-[#6F1D35] border-[#6F1D35] bg-white rounded-t-lg' : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
                Gestión de Empleos ({jobs.length})
            </button>
        </div>

        <div className="min-h-[500px]">
            {activeTab === 'users' ? <UserCards /> : <JobCards />}
        </div>
      </div>
    </div>
  );
}