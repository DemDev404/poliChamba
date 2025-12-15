import { Form, redirect, useNavigation, useActionData, Link } from "react-router";
import axios from "axios";
import type { Route } from "./+types/login";

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { error: "Por favor completa todos los campos." };
    }

    const response = await axios.post("http://localhost:4000/auth/login", {
      email,
      password,
    });

    const userRole = response.data.user.role;
    const userName = response.data.user.firstName || "Usuario";

    if (userRole === 'admin') {
        return redirect(`/admin/dashboard?name=${userName}`);
    } else if (userRole === 'recruiter' || userRole === 'company') {
        return redirect(`/company/dashboard?name=${userName}`);
    } else {
        return redirect(`/home?name=${userName}`);
    }

  } catch (error: any) {
    if (error.response) {
       return { error: error.response.data.message || "Credenciales incorrectas" };
    }
    return { error: "No se pudo conectar con el servidor (Revisa el puerto 4000)" };
  }
}

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const inputStyle = "w-full px-4 py-3 mt-1 border rounded-lg focus:ring-2 focus:ring-[#6F1D35] focus:border-transparent bg-gray-50 border-gray-300 outline-none transition-all";
  const labelStyle = "block text-sm font-bold text-gray-700 mb-1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-2 bg-[#6F1D35]"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#6F1D35] opacity-5 rounded-full transform translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border-t-8 border-[#6F1D35] relative z-10">
        
        <div className="text-center">
          <span className="text-5xl block mb-2">🦅</span>
          <h2 className="text-3xl font-extrabold text-[#6F1D35]">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Bienvenido a la bolsa de trabajo de <span className="font-bold text-[#6F1D35]">PoliChamba</span>
          </p>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className={labelStyle}>Correo Institucional / Personal</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                className={inputStyle} 
                placeholder="ejemplo@ipn.mx" 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className={labelStyle}>Contraseña</label>
                <a href="#" className="text-xs text-[#6F1D35] hover:underline font-medium">¿Olvidaste tu contraseña?</a>
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password" 
                required 
                className={inputStyle} 
                placeholder="••••••••" 
              />
            </div>
          </div>

          {actionData?.error && (
            <div className="p-4 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200 flex items-center gap-3 animate-pulse">
              <span className="text-xl">⚠️</span>
              <span>{actionData.error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#6F1D35] hover:bg-[#501526] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6F1D35] transition duration-200 ease-in-out shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Ingresar a mi cuenta"
              )}
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              ¿Aún no tienes cuenta?{' '}
              <Link to="/register" className="font-bold text-[#6F1D35] hover:underline transition duration-150 ease-in-out">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Form>
      </div>
      
      <div className="absolute bottom-4 text-center w-full text-xs text-gray-400">
        © 2025 PoliChamba - Conectando talento politécnico
      </div>
    </div>
  );
}