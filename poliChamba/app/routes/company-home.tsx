import { Link, useLoaderData } from "react-router";
import axios from "axios";
import { useState } from "react";

const LOGGED_COMPANY_ID = 2; 

export async function loader() {
  try {
    //const response = await axios.get(`http://localhost:4000/jobs/company/${LOGGED_COMPANY_ID}`);
    const response = await axios.get(`http://localhost:4000/job-posting/company/${LOGGED_COMPANY_ID}`);
    return response.data;
  } catch (error) {
    console.error("Error cargando datos de empresa:", error);
    return [];
  }
}

export default function CompanyHome() {
  const initialJobs = useLoaderData() as any[];
  const [jobs, setJobs] = useState(initialJobs);
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates'>('jobs');

  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({ location: "", salary: 0 });

  const allCandidates = jobs.flatMap(job => 
    job.applications.map((app: any) => ({
      ...app,
      jobTitle: job.title
    }))
  );

  const handleEditClick = (job: any) => {
    setEditingJobId(job.id);
    setEditFormData({ location: job.location, salary: job.salary });
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    setEditFormData({ location: "", salary: 0 });
  };

  const handleSaveEdit = async (jobId: number) => {
    try {
      await axios.patch(`http://localhost:4000/job-posting/${jobId}`, {
        location: editFormData.location,
        salary: Number(editFormData.salary)
      });

      const updatedJobs = jobs.map((job) => 
        job.id === jobId 
          ? { ...job, location: editFormData.location, salary: Number(editFormData.salary) } 
          : job
      );
      
      setJobs(updatedJobs);
      setEditingJobId(null); 
    } catch (error) {
      console.error("Error actualizando:", error);
      alert("Error al actualizar la oferta.");
    }
  };

  const handleDeleteJob = async (jobId: number, jobTitle: string) => {
    const confirm = window.confirm(`¿Estás seguro de que quieres eliminar la oferta "${jobTitle}"?\nEsta acción no se puede deshacer.`);
    
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:4000/job-posting/${jobId}`);
      
      setJobs(jobs.filter(job => job.id !== jobId));
      alert("Oferta eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar la oferta. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-[#6F1D35]">Panel de Empresa</h1>
            <p className="text-gray-500 mt-1">Gestiona tus vacantes y talento.</p>
          </div>
          <Link to="/login" className="text-gray-500 hover:text-[#6F1D35] border border-gray-300 px-4 py-2 rounded-lg transition hover:bg-gray-50">
            Cerrar Sesión
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#6F1D35]">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Ofertas Activas</h3>
            <p className="text-4xl font-extrabold text-gray-800 mt-2">{jobs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Candidatos</h3>
            <p className="text-4xl font-extrabold text-gray-800 mt-2">{allCandidates.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex flex-col justify-center">
             <Link to="/company/jobs/create" className="w-full text-center bg-[#6F1D35] text-white px-4 py-3 rounded-lg font-bold hover:bg-[#501526] transition shadow-md flex items-center justify-center gap-2">
              <span>+</span> Publicar Oferta
            </Link>
          </div>
        </div>

        <div className="flex space-x-8 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 font-bold text-sm transition-all border-b-4 ${activeTab === 'jobs' ? 'text-[#6F1D35] border-[#6F1D35]' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
          >
            Mis Ofertas
          </button>
          <button 
            onClick={() => setActiveTab('candidates')}
            className={`pb-3 font-bold text-sm transition-all border-b-4 ${activeTab === 'candidates' ? 'text-[#6F1D35] border-[#6F1D35]' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
          >
            Candidatos Recientes ({allCandidates.length})
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 min-h-[400px]">
          
          {activeTab === 'jobs' && (
            <>
              {jobs.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Título</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Ubicación</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Salario</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Interesados</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job: any) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition">
                        
                        <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>

                        <td className="px-6 py-4 text-gray-500">
                          {editingJobId === job.id ? (
                            <input 
                              type="text" 
                              value={editFormData.location}
                              onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                              className="border border-gray-300 rounded px-2 py-1 w-full text-sm focus:outline-none focus:border-[#6F1D35]"
                            />
                          ) : (
                            job.location
                          )}
                        </td>

                        <td className="px-6 py-4 text-gray-500 font-mono">
                          {editingJobId === job.id ? (
                            <input 
                              type="number" 
                              value={editFormData.salary}
                              onChange={(e) => setEditFormData({...editFormData, salary: Number(e.target.value)})}
                              className="border border-gray-300 rounded px-2 py-1 w-24 text-sm focus:outline-none focus:border-[#6F1D35]"
                            />
                          ) : (
                            `$${job.salary.toLocaleString()}`
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${job.applications.length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                            {job.applications.length} 👤
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {editingJobId === job.id ? (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleSaveEdit(job.id)}
                                className="text-green-600 hover:text-green-800 font-bold text-sm px-2 py-1 rounded hover:bg-green-50 transition"
                              >
                                Guardar
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                className="text-gray-500 hover:text-gray-700 font-bold text-sm px-2 py-1 rounded hover:bg-gray-100 transition"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEditClick(job)}
                                className="text-blue-600 hover:text-blue-800 font-bold text-sm hover:underline px-2 py-1 rounded hover:bg-blue-50 transition"
                              >
                                Editar
                              </button>
                              <button 
                                onClick={() => handleDeleteJob(job.id, job.title)}
                                className="text-red-600 hover:text-red-800 font-bold text-sm hover:underline px-2 py-1 rounded hover:bg-red-50 transition"
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <p className="text-lg font-medium">No tienes ofertas activas.</p>
                  <Link to="/company/jobs/create" className="mt-2 text-[#6F1D35] hover:underline">¡Crea tu primera oferta!</Link>
                </div>
              )}
            </>
          )}

          {activeTab === 'candidates' && (
            <>
              {allCandidates.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Candidato</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Aplicó a</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contacto</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allCandidates.map((app: any) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm mr-3 border-2 border-white shadow-sm">
                              {app.user?.firstName?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">
                                {app.user?.firstName} {app.user?.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {app.user?.headline || "Candidato"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {app.jobTitle}
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-600 hover:underline cursor-pointer">
                          {app.user?.email}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                            {app.status || 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <button className="text-[#6F1D35] hover:text-[#501526] font-bold hover:underline">
                            Ver Perfil
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <p className="text-lg font-medium">Aún no has recibido aplicaciones.</p>
                  <p className="text-sm">Tus ofertas aparecerán aquí cuando los candidatos apliquen.</p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}