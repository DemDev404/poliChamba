import type { LinksFunction, ActionFunctionArgs } from "react-router-dom"; 
import { Form, useActionData, redirect, Link, useNavigation } from "react-router-dom"; 

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

  const inputStyle = "w-full px-3 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 border-gray-300";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Crear Nueva Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Únete a PoliChamba hoy mismo
          </p>
        </div>
        
        <Form method="post" className="mt-8 space-y-6">
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <label htmlFor="roleType" className="block text-sm font-bold text-blue-900 mb-2">
              ¿Cuál es tu objetivo?
            </label>
            <select 
              id="roleType" 
              name="roleType" 
              required
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white border-blue-300 text-blue-900 cursor-pointer"
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
            <label htmlFor="email" className={labelStyle}>Correo Electrónico</label>
            <input id="email" name="email" type="email" required className={inputStyle} placeholder="ejemplo@correo.com" />
          </div>
          
          <div>
            <label htmlFor="password" className={labelStyle}>Contraseña</label>
            <input id="password" name="password" type="password" required className={inputStyle} placeholder="••••••••" />
          </div>

          {actionData?.error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-400">
              ⚠️ {actionData.error}
            </div>
          )}
          
          <div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? "Registrando..." : "Crear Cuenta"}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition duration-150 ease-in-out">
                Inicia Sesión aquí
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}