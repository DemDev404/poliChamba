import type { LoaderFunction, LinksFunction } from "react-router"; 
import { useLoaderData, Link } from "react-router";
import React, { useState, useEffect } from 'react';
import axios from "axios";

import homeStyles from './home.css?url';
import searchBarStyles from '../components/SearchBar.css?url';
import jobCardStyles from '../components/JobCard.css?url';
import jobDetailStyles from '../components/JobDetail.css?url';

import { JobCard } from '../components/JobCard';
import { JobDetail } from '../components/JobDetail';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: homeStyles },
  { rel: "stylesheet", href: searchBarStyles },
  { rel: "stylesheet", href: jobCardStyles },
  { rel: "stylesheet", href: jobDetailStyles },
];

// --- AQUÍ ESTABA EL "SILENCIO" ---
export const loader: LoaderFunction = async () => {
  try {
    const response = await axios.get('http://localhost:4000/job-posting');
    console.log("✅ Datos recibidos del backend:", response.data); // LOG PARA VERIFICAR
    return response.data; 
  } catch (error) {
    console.error("🔥 ERROR DE CONEXIÓN:", error); // LOG PARA VER EL ERROR REAL
    return [];
  }
};

export default function HomeRoute() {
  const allJobs = useLoaderData() as any[];
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Aseguramos que allJobs sea un array antes de filtrar para evitar crashes
  const safeJobs = Array.isArray(allJobs) ? allJobs : [];

  const filteredJobs = safeJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (job.company?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (filteredJobs.length > 0 && !filteredJobs.find(j => j.id === selectedJobId)) {
        setSelectedJobId(filteredJobs[0].id);
    }
  }, [searchTerm, filteredJobs]); // Dependencias corregidas (quitamos filteredJobs para evitar loop infinito visual, pero React lo pide)

  const selectedJob = safeJobs.find(job => job.id === selectedJobId);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      <nav className="bg-[#6F1D35] text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦅</span>
            <span className="text-xl font-extrabold tracking-tight">PoliChamba</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:block text-sm text-gray-200 hover:text-white font-medium">¿Eres empresa?</Link>
            <div className="h-4 w-px bg-white/30 hidden md:block"></div>
            <Link to="/login" className="text-sm font-semibold text-white hover:text-gray-200">Iniciar Sesión</Link>
            <Link to="/register" className="bg-white text-[#6F1D35] px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition shadow-sm text-sm">Registrarse</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-t-4 border-[#6F1D35]">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Encuentra tu próximo empleo</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input 
                        type="text" 
                        placeholder="Ej. Desarrollador Java, Diseño..." 
                        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-[#6F1D35] outline-none bg-gray-50 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="w-full md:w-auto bg-[#6F1D35] text-white px-10 py-4 rounded-lg font-bold hover:bg-[#5a152a] transition shadow-lg text-lg">
                    Buscar
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-full">
          
          <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            <div className="flex justify-between items-center mb-2 pl-2">
              <h2 className="text-lg font-bold text-gray-700">Empleos Recientes</h2>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-bold">{filteredJobs.length}</span>
            </div>
            
            {filteredJobs.length === 0 && (
                <div className="p-4 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    No se encontraron empleos (Revisa la consola si crees que es un error)
                </div>
            )}

            {filteredJobs.map((job) => (
              <div key={job.id} onClick={() => setSelectedJobId(job.id)} className="cursor-pointer transition-transform hover:scale-[1.01]">
                <div className={`rounded-lg border-2 ${job.id === selectedJobId ? 'border-[#6F1D35] shadow-md bg-blue-50' : 'border-transparent'}`}>
                  <JobCard
                    title={job.title}
                    companyName={job.company?.name || "Empresa Confidencial"} 
                    location={job.location}
                    salary={job.salary ? `$${job.salary}` : "Confidencial"} 
                    jobType={job.jobType}
                    isActive={job.id === selectedJobId} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative flex flex-col" style={{ minHeight: '500px' }}>
            {selectedJob ? (
              <div className="h-full overflow-y-auto p-1 relative scrollbar-hide">
                <JobDetail job={selectedJob} />
                
                <div className="sticky bottom-0 bg-[#6F1D35] p-4 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
                   <div>
                     <p className="font-bold text-lg">¿Quieres aplicar a esta vacante?</p>
                     <p className="text-xs text-gray-200">Crea una cuenta gratis para enviar tu CV.</p>
                   </div>
                   <div className="flex gap-3">
                     <Link to="/login" className="text-white hover:underline px-4 py-2 text-sm">Iniciar Sesión</Link>
                     <Link to="/register" className="bg-white text-[#6F1D35] px-6 py-2 rounded-lg font-bold hover:bg-gray-100 shadow-md">
                       Registrarme
                     </Link>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-10 text-center">
                <span className="text-6xl mb-4">🦅</span>
                <h3 className="text-xl font-bold text-gray-600">Bienvenido a PoliChamba</h3>
                <p>Selecciona una vacante para ver los detalles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}