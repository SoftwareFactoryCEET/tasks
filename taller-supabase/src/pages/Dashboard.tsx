// src/pages/Dashboard.tsx
import { Link } from 'react-router-dom'
import { useAuthContext }  from '../context/AuthContext'
import { useTasks }        from '../hooks/useTasks'
import { AvatarUpload }    from '../components/AvatarUpload'

export function Dashboard() {
    const { user }               = useAuthContext()
    const { tareas, loading }    = useTasks()

    const total       = tareas.length
    const completadas = tareas.filter(t => t.completada).length
    const pendientes  = total - completadas
    const porcentaje  = total > 0 ? Math.round((completadas / total) * 100) : 0

    if (loading) return <div className="estado-cargando">Cargando estadísticas...</div>

    return (
        <div className="dashboard">
            <div className="card dashboard-welcome">
                <div className="dashboard-welcome-body">
                    <AvatarUpload />
                    <div>
                        <h2>Bienvenido, <span className="dashboard-email">{user?.email}</span></h2>
                        <p className="dashboard-subtitle">Aquí tienes un resumen del estado de tus tareas.</p>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-number">{total}</span>
                    <span className="stat-label">Total tareas</span>
                </div>
                <div className="stat-card stat-card--success">
                    <span className="stat-number">{completadas}</span>
                    <span className="stat-label">Completadas</span>
                </div>
                <div className="stat-card stat-card--warning">
                    <span className="stat-number">{pendientes}</span>
                    <span className="stat-label">Pendientes</span>
                </div>
                <div className="stat-card stat-card--accent">
                    <span className="stat-number">{porcentaje}%</span>
                    <span className="stat-label">Progreso</span>
                </div>
            </div>

            <div className="card">
                <h3>Progreso general</h3>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${porcentaje}%` }} />
                </div>
                <p className="progress-label">{completadas} de {total} tareas completadas</p>
            </div>

            <div className="card">
                <h3>Acciones rápidas</h3>
                <Link to="/" className="btn-primary btn-block">Ir a mis tareas</Link>
            </div>
        </div>
    )
}
