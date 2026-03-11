// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { NavBar } from './NavBar'

export function PrivateRoute() {
    const { user, loading } = useAuthContext()
    if (loading) return <div className="estado-cargando">Cargando...</div>
    if (!user)   return <Navigate to='/login' replace />
    return (
        <>
            <NavBar />
            <main className="app-main">
                <Outlet />
            </main>
        </>
    )
}
