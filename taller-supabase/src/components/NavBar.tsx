// src/components/NavBar.tsx
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function NavBar() {
    const { user, signOut } = useAuthContext()
    const navigate          = useNavigate()
    const location          = useLocation()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <header className="navbar">
            <div className="navbar-brand">
                <span className="navbar-logo">SENA</span>
                <span className="navbar-title">Gestión de Tareas</span>
            </div>

            <nav className="navbar-nav">
                <Link to="/"          className={`nav-link${location.pathname === '/'          ? ' nav-link--active' : ''}`}>Mis tareas</Link>
                <Link to="/dashboard" className={`nav-link${location.pathname === '/dashboard' ? ' nav-link--active' : ''}`}>Dashboard</Link>
            </nav>

            <div className="navbar-user">
                <span className="navbar-email">{user?.email}</span>
                <button className="btn-logout" onClick={handleSignOut}>Cerrar sesión</button>
            </div>
        </header>
    )
}
