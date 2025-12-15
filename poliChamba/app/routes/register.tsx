import type { LinksFunction, ActionFunctionArgs } from "react-router"; 
import { Form, useActionData, redirect, Link, useNavigation } from "react-router"; 

function json(data: any, init?: ResponseInit) {
    return new Response(JSON.stringify(data), {
        ...init,
        headers: {
            ...init?.headers,
            "Content-Type": "application/json",
        },
    });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as any; 
  const roleId = parseInt(data.roleType);

  try {
    const response = await fetch("http://localhost:4000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
          email: data.email, 
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          roleId: roleId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return json({ error: errorData.message || "Error al registrar usuario." }, { status: response.status });
    }
    
    return redirect("/login"); 

  } catch (error) {
    return json({ error: "No se pudo conectar con el servidor." }, { status: 500 });
  }
}

type ActionData = { error: string } | undefined;

export default function RegisterPage() {
  const actionData = useActionData() as ActionData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Estilos Guinda (IPN)
  const inputStyle = "w-full px-3 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-[#6F1D35] focus:border-transparent bg-gray-50 border-gray-300 outline-none";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-2xl border-t-8 border-[#6F1D35]">
        <div className="text-center">
          <span className="text-4xl">🦅</span>
          <h2 className="mt-2 text-3xl font-extrabold text-[#6F1D35]">
            Crear Nueva Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a la comunidad de <span className="font-bold text-[#6F1D35]">PoliChamba</span>
          </p>
        </div>
        
        <Form method="post" className="mt-8 space-y-6">
          
          <div className="bg-[#f9f1f4] p-4 rounded-lg border border-[#dcbac4]">
            <label htmlFor="roleType" className="block text-sm font-bold text-[#6F1D35] mb-2">
              ¿Cuál es tu objetivo?
            </label>
            <select 
              id="roleType" 
              name="roleType" 
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#6F1D35] focus:border-transparent bg-white border-[#6F1D35] text-[#6F1D35] font-medium cursor-pointer"
            >
              <option value="1">👨‍💻 Buscar Trabajo (Candidato)</option>
              <option value="2">🏢 Publicar Ofertas (Empresa)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelStyle}>Nombre</label>
              <input id="firstName" name="firstName" type="text" required className={inputStyle} placeholder="Tu nombre" />
            </div>
            <div>
              <label htmlFor="lastName" className={labelStyle}>Apellido</label>
              <input id="lastName" name="lastName" type="text" required className={inputStyle} placeholder="Tus apellidos" />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className={labelStyle}>Correo Institucional / Personal</label>
            <input id="email" name="email" type="email" required className={inputStyle} placeholder="ejemplo@ipn.mx" />
          </div>
          
          <div>
            <label htmlFor="password" className={labelStyle}>Contraseña</label>
            <input id="password" name="password" type="password" required className={inputStyle} placeholder="••••••••" />
          </div>

          {actionData?.error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-400 flex items-center gap-2">
              ⚠️ <span>{actionData.error}</span>
            </div>
          )}
          
          <div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-[#6F1D35] hover:bg-[#501526] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6F1D35] transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? "Registrando..." : "Crear Cuenta"}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-bold text-[#6F1D35] hover:underline transition duration-150 ease-in-out">
                Inicia Sesión aquí
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}