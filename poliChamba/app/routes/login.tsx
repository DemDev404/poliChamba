import { Form, redirect, useNavigation } from "react-router";
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

    if (userRole === 'admin') {
        return redirect("/admin/dashboard");
    } else if (userRole === 'recruiter') {
        return redirect("/company/dashboard");
    } else {
        return redirect("/home");
    }

  } catch (error: any) {
    if (error.response) {
       return { error: error.response.data.message || "Credenciales incorrectas" };
    }
    return { error: "No se pudo conectar con el servidor (Revisa el puerto 4000)" };
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>

        <Form method="post" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 mt-1 border rounded focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {actionData?.error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded border border-red-400">
              {actionData.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Conectando..." : "Entrar"}
          </button>
        </Form>
      </div>
    </div>
  );
}