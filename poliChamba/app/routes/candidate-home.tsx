import type { LoaderFunction, LinksFunction, ActionFunctionArgs } from "react-router"; 
import { useLoaderData, useSearchParams, Link, Form, useActionData } from "react-router";
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

export const loader: LoaderFunction = async () => {
  try {
    const response = await axios.get('http://localhost:4000/job-posting');
    return response.data; 
  } catch (error) {
    return [];
  }
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const jobId = formData.get("jobId");
  
  const CANDIDATE_ID = 1; 

  try {
    await axios.post('http://localhost:4000/apply', {
      userId: CANDIDATE_ID,
      jobId: parseInt(jobId as string)
    });
    return { success: true, message: "¡Postulación enviada con éxito! 🚀" };
  } catch (error: any) {
    const msg = error.response?.data?.message || "Error al aplicar.";
    return { success: false, message: msg };
  }
}

export default function CandidateHome() {
  const allJobs = useLoaderData() as any[];
  const actionData = useActionData() as { success: boolean, message: string } | undefined;
  
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  const [searchParams] = useSearchParams();

  const userName = searchParams.get("userName") || "Compañero Politécnico";

  console.log('userName:', user)
  console.log('userName:', userName)

  const filteredJobs = allJobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (filteredJobs.length > 0 && !filteredJobs.find(j => j.id === selectedJobId)) {
        setSelectedJobId(filteredJobs[0].id);
    }
  }, [searchTerm, filteredJobs]);

  const selectedJob = allJobs.find(job => job.id === selectedJobId);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      <nav className="bg-[#6F1D35] text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦅</span>
            <span className="text-xl font-extrabold tracking-tight">PoliChamba</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold hidden sm:block">Hola, {userName}</span>
            <Link to="/login" className="text-sm text-gray-200 hover:text-white underline">Salir</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Qué</label>
                    <input 
                        type="text" 
                        placeholder="Puesto, empresa o palabra clave..." 
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#6F1D35] outline-none bg-gray-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-end">
                    <button 
                        className="w-full md:w-auto bg-[#6F1D35] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#5a152a] transition shadow-md"
                        onClick={() => {}}
                    >
                        Buscar Empleos
                    </button>
                </div>
            </div>
        </div>

        {actionData && (
          <div className={`p-4 mb-6 rounded-lg text-center font-bold border shadow-sm animate-fade-in ${
            actionData.success 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-amber-100 text-amber-800 border-amber-200'
          }`}>
            {actionData.success ? '✅ ' : '⚠️ '} {actionData.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-full">
          
          <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            <div className="flex justify-between items-center mb-2 border-l-4 border-[#6F1D35] pl-2">
              <h2 className="text-lg font-bold text-gray-700">Resultados</h2>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-bold">{filteredJobs.length}</span>
            </div>
            
            {filteredJobs.length === 0 && (
                <p className="text-gray-500 italic text-center py-10">No encontramos ofertas con esa búsqueda.</p>
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
                  {job.id === selectedJobId && (
                      <div className="px-4 pb-4 md:hidden">
                          <span className="text-xs text-[#6F1D35] font-bold">Ver detalles abajo ↓</span>
                      </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative flex flex-col" style={{ minHeight: '500px' }}>
            {selectedJob ? (
              <div className="h-full overflow-y-auto p-1 relative scrollbar-hide">
                <JobDetail job={selectedJob} />
                
                <div className="sticky bottom-0 bg-white p-6 border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] flex justify-between items-center">
                   <div>
                        <p className="text-sm text-gray-500">¿Te interesa este puesto?</p>
                        <p className="font-bold text-gray-800">{selectedJob.title}</p>
                   </div>
                   <Form method="post">
                     <input type="hidden" name="jobId" value={selectedJob.id} />
                     <button type="submit" className="bg-[#6F1D35] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#5a152a] transition shadow-lg transform active:scale-95 flex items-center gap-2">
                       🚀 Aplicar a esta vacante
                     </button>
                   </Form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-10 text-center">
                <span className="text-6xl mb-4">👈</span>
                <h3 className="text-xl font-medium">Selecciona una vacante</h3>
                <p>Haz clic en la lista para ver los detalles.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}