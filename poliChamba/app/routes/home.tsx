import type { LoaderFunction, LinksFunction } from "react-router"; 
import { useLoaderData, Link } from "react-router";
import React, { useState } from 'react';

import homeStyles from './home.css?url';
import searchBarStyles from '../components/SearchBar.css?url';
import jobCardStyles from '../components/JobCard.css?url';
import jobDetailStyles from '../components/JobDetail.css?url';

import { SearchBar } from '../components/SearchBar';
import { JobCard } from '../components/JobCard';
import { JobDetail } from '../components/JobDetail';
import type { JobType } from '../components/JobDetail';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: homeStyles },
  { rel: "stylesheet", href: searchBarStyles },
  { rel: "stylesheet", href: jobCardStyles },
  { rel: "stylesheet", href: jobDetailStyles },
];

export const loader: LoaderFunction = async () => {
  try {
    const response = await fetch('http://localhost:4000/job-posting');
    if (!response.ok) {
      throw new Error('No se pudo conectar a la API');
    }
    const jobs = await response.json();
    return jobs; 
  } catch (error) {
    console.error("Error en el loader:", error);
    return [];
  }
};

export default function HomeRoute() {
  const jobs = useLoaderData() as any[];
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const selectedJob = jobs.find(job => job.id === selectedJobId);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      <nav className="bg-[#6F1D35] text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦅</span>
            <span className="text-xl font-extrabold tracking-tight">PoliChamba</span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="hidden md:block text-sm text-gray-200 hover:text-white font-medium hover:underline"
            >
              ¿Eres empresa?
            </Link>
            <div className="h-4 w-px bg-white/30 hidden md:block"></div>
            
            <Link 
              to="/login" 
              className="text-sm font-semibold text-white hover:text-gray-200"
            >
              Iniciar Sesión
            </Link>
            
            <Link 
              to="/register" 
              className="bg-white text-[#6F1D35] px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition shadow-sm text-sm"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
          <SearchBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-full">
          
          <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="flex justify-between items-center mb-2 border-l-4 border-[#6F1D35] pl-2">
              <h2 className="text-lg font-bold text-gray-700">
                Empleos Recientes
              </h2>
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{jobs.length}</span>
            </div>
            
            {jobs.length === 0 && (
              <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                <p>No se encontraron ofertas activas.</p>
              </div>
            )}

            {jobs.map((job) => (
              <div key={job.id} onClick={() => setSelectedJobId(job.id)} className="cursor-pointer transition-transform hover:scale-[1.01]">
                <div className={`rounded-lg border-2 ${job.id === selectedJobId ? 'border-[#6F1D35] shadow-md bg-blue-50' : 'border-transparent'}`}>
                  <JobCard
                    title={job.title}
                    companyName={job.company?.name || "Empresa Confidencial"} 
                    location={job.location}
                    salary={job.salary ? `$${job.salary}` : "Salario no mostrado"} 
                    jobType={job.jobType}
                    isActive={job.id === selectedJobId} 
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative flex flex-col" style={{ minHeight: '500px', maxHeight: 'calc(100vh - 200px)' }}>
            {selectedJob ? (
              <div className="h-full overflow-y-auto p-1 scrollbar-hide">
                <JobDetail job={selectedJob} />
                
                <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 flex justify-end">
                   <Link to="/login" className="text-sm text-blue-600 hover:underline mr-4 flex items-center">
                     Inicia sesión para aplicar
                   </Link>
                   <Link to="/register" className="bg-[#6F1D35] text-white px-6 py-2 rounded font-bold hover:bg-[#5a152a]">
                     Aplicar ahora
                   </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-10 text-center">
                <span className="text-6xl mb-4">🦅</span>
                <h3 className="text-xl font-bold text-gray-600">Bienvenido a PoliChamba</h3>
                <p className="max-w-md mt-2">Selecciona una vacante de la lista para ver los detalles completos, requisitos y beneficios.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}