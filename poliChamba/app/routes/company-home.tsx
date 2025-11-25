import { Link } from "react-router";

export async function loader() {
  return null;
}

export default function CompanyHome() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <header className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-[#6F1D35]">Panel de Empresa</h1>
            <p className="text-gray-500 mt-1">Gestiona tus vacantes y talento.</p>
          </div>
          <Link 
            to="/login" 
            className="text-gray-500 hover:text-[#6F1D35] font-medium transition-colors border border-gray-300 px-4 py-2 rounded-lg hover:border-[#6F1D35]"
          >
            Cerrar Sesión
          </Link>
        </header>

        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-[#6F1D35] hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Publicar Nueva Oferta</h2>
            <p className="text-gray-600 mb-6">Crea una vacante atractiva para encontrar al mejor talento politécnico.</p>
            <button className="w-full bg-[#6F1D35] text-white px-4 py-3 rounded-lg font-bold hover:bg-[#501526] transition shadow-md">
              + Crear Empleo
            </button>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-gray-600 hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ver Candidatos</h2>
            <p className="text-gray-600 mb-6">Revisa los perfiles que han aplicado a tus ofertas activas.</p>
            <button className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-900 transition shadow-md">
              Gestionar Aplicaciones
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#6F1D35] rounded-full block"></span>
            Mis Ofertas Activas
          </h3>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Aplicantes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Desarrollador React Senior</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">Remoto</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activa
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#6F1D35] font-bold text-lg">
                    12
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Ingeniero de Datos Jr</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">CDMX, Híbrido</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Revisión
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#6F1D35] font-bold text-lg">
                    5
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}