import type { LoaderFunction, LinksFunction } from "react-router"; 
import { useLoaderData, useSearchParams, Link } from "react-router";
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
  
  const [searchParams] = useSearchParams();
  const userName = searchParams.get("name") || "Compañero Politécnico";

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
            <div className="flex items-center gap-3 bg-[#5a152a] px-4 py-1.5 rounded-full border border-[#8f3a52]">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#6F1D35] font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-300">Bienvenido,</p>
                <p className="text-sm font-semibold leading-none">{userName}</p>
              </div>
            </div>
            <Link to="/login" className="text-sm text-gray-200 hover:text-white font-medium hover:underline">
              Salir
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
            <h2 className="text-lg font-bold text-gray-700 mb-2 border-l-4 border-[#6F1D35] pl-2">
              Resultados ({jobs.length})
            </h2>
            
            {jobs.length === 0 && (
              <p className="text-gray-500 italic">No hay ofertas disponibles por ahora.</p>
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
          
          <div className="lg:col-span-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative flex flex-col" style={{ minHeight: '500px' }}>
            {selectedJob ? (
              <div className="h-full overflow-y-auto p-1">
                <JobDetail job={selectedJob} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-10">
                <span className="text-6xl mb-4">👈</span>
                <h3 className="text-xl font-medium">Selecciona una vacante</h3>
                <p>Haz clic en una oferta de la izquierda para ver los detalles completos.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}