import { Form, redirect, useActionData, useNavigation, Link } from "react-router-dom";
import type { ActionFunctionArgs } from "react-router-dom";
import axios from "axios";
const LOGGED_IN_COMPANY_ID = 2; 

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData); 

  try {
    const response = await axios.post("http://localhost:4000/jobs/create", { 
      title: data.title,
      description: data.description,
      location: data.location,
      salary: parseInt(data.salary as string),
      jobType: data.jobType,
      experienceLevel: data.experienceLevel,
      companyId: LOGGED_IN_COMPANY_ID, 
    });
    
    if (response.status === 201) {
      return redirect("/company/dashboard"); 
    }

  } catch (error: any) {
    console.error("Error al publicar:", error.response?.data);
    return { 
      error: error.response?.data?.message || "Error al publicar la oferta. Revisa el servidor." 
    };
  }
  return null;
}

type ActionData = { error: string } | undefined;

export default function JobCreatePage() {
  const actionData = useActionData() as ActionData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F1D35] focus:border-transparent outline-none";
  const labelStyle = "block text-sm font-bold text-gray-700 mb-1";
  const guindaButton = "bg-[#6F1D35] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#5a152a] transition-colors shadow-md";

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-4xl bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#6F1D35]">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">Publicar Nueva Vacante</h1>
          <Link to="/company/dashboard" className="text-sm text-gray-600 hover:text-[#6F1D35] hover:underline">
             ← Volver al Dashboard
          </Link>
        </div>

        <Form method="post" className="space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className={labelStyle}>Título del Puesto</label>
              <input id="title" name="title" type="text" required className={inputStyle} placeholder="Ej: Ingeniero Backend Node.js" />
            </div>
            <div>
              <label htmlFor="salary" className={labelStyle}>Salario (Mensual MXN)</label>
              <input id="salary" name="salary" type="number" required className={inputStyle} placeholder="Ej: 45000" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label htmlFor="location" className={labelStyle}>Ubicación</label>
              <input id="location" name="location" type="text" required className={inputStyle} placeholder="Ej: Remoto o CDMX" />
            </div>
            <div>
              <label htmlFor="jobType" className={labelStyle}>Tipo de Contrato</label>
              <select id="jobType" name="jobType" required className={inputStyle}>
                <option value="Tiempo Completo">Tiempo Completo</option>
                <option value="Medio Tiempo">Medio Tiempo</option>
                <option value="Contrato">Contrato</option>
              </select>
            </div>
            <div>
              <label htmlFor="experienceLevel" className={labelStyle}>Nivel de Experiencia</label>
              <select id="experienceLevel" name="experienceLevel" required className={inputStyle}>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className={labelStyle}>Descripción del Puesto (Responsabilidades)</label>
            <textarea id="description" name="description" rows={6} required className={inputStyle} placeholder="Detalla las responsabilidades y requisitos..."></textarea>
          </div>

          {actionData?.error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-400">
              ⚠️ {actionData.error}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`${guindaButton} flex items-center gap-2 disabled:bg-gray-400`}
            >
              {isSubmitting ? "Publicando..." : "Publicar Oferta"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}