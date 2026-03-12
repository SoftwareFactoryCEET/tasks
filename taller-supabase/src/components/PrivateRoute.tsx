// src/components/PrivateRoute.tsx
// Guarda de rutas protegidas. Actúa como layout compartido para todas las páginas autenticadas.
// Patrón: envuelve las rutas privadas en App.tsx con <Route element={<PrivateRoute />}>
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { NavBar } from './NavBar'

export function PrivateRoute() {
    const { user, loading } = useAuthContext()
    // Espera a que se resuelva la sesión inicial antes de decidir redirigir
    if (loading) return <div className="estado-cargando">Cargando...</div>
    // Sin usuario autenticado → redirige al login (replace evita volver con el botón Atrás)
    if (!user)   return <Navigate to='/login' replace />
    // Con sesión activa → muestra NavBar + la página hija (<Outlet />)
    return (
        <>
            <NavBar />
            <main className="app-main">
                <Outlet />
            </main>
        </>
    )
}
