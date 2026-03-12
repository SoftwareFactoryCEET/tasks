// src/pages/Dashboard.tsx
// Página de métricas y estadísticas.
// Secciones:
//   1. Bienvenida con avatar del usuario y hora de último refresco
//   2. KPIs (5 tarjetas StatCard en grid auto-ajustable)
//   3. Barra de progreso animada con gradiente
//   4. Gráficas: BarChart (actividad 7 días) + DonutChart (distribución)
//   5. Feed de actividad reciente
//   6. Botón de refresco manual
import { useAuthContext }  from '../context/AuthContext'
import { useDashboard }    from '../hooks/useDashboard'
import { AvatarUpload }    from '../components/AvatarUpload'
import { StatCard }        from '../components/Dashboard/StatCard'
import { TaskChart }       from '../components/Dashboard/TaskChart'
import { DonutChart }      from '../components/Dashboard/DonutChart'
import { ActivityFeed }    from '../components/Dashboard/ActivityFeed'

export function Dashboard() {
    const { user }                                                   = useAuthContext()
    const { stats, activity, distribution, recentFeed,
            loading, lastUpdated, refresh }                          = useDashboard()

    if (loading) return <div className="estado-cargando">Cargando estadísticas...</div>

    return (
        <div className="dashboard">

            {/* ── Bienvenida ─────────────────────────────────── */}
            <div className="card dashboard-welcome">
                <div className="dashboard-welcome-body">
                    <AvatarUpload />
                    <div>
                        <h2>Bienvenido, <span className="dashboard-email">{user?.email}</span></h2>
                        <p className="dashboard-subtitle">
                            Resumen en tiempo real del estado de tus tareas.
                            {lastUpdated && (
                                <span style={{ marginLeft:'0.75rem', color:'#10b981', fontWeight:600 }}>
                                    ● Actualizado {lastUpdated.toLocaleTimeString('es-CO')}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── KPIs ───────────────────────────────────────── */}
            {stats && (
                <div style={{ display:'grid',
                    gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',
                    gap:'1rem', marginBottom:'1.5rem' }}>
                    <StatCard titulo="Total"       valor={stats.total}        icono="📋" color="#1a56a0" subtitulo="Todas las tareas" />
                    <StatCard titulo="Completadas" valor={stats.completadas}  icono="✅" color="#10b981" subtitulo={`${stats.porcentaje}% del total`} />
                    <StatCard titulo="Pendientes"  valor={stats.pendientes}   icono="⏳" color="#f59e0b" subtitulo="Por completar" />
                    <StatCard titulo="Progreso"    valor={`${stats.porcentaje}%`} icono="📈" color="#8b5cf6" subtitulo="Completitud" />
                    <StatCard titulo="Hoy"         valor={stats.creadasHoy}   icono="🆕" color="#0f766e" subtitulo="Nuevas hoy" />
                </div>
            )}

            {/* ── Barra de progreso ──────────────────────────── */}
            {stats && (
                <div className="card">
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                        <span style={{ fontWeight:600 }}>Progreso global</span>
                        <span style={{ fontWeight:800, color:'#10b981' }}>{stats.porcentaje}%</span>
                    </div>
                    <div className="progress-bar-bg">
                        <div style={{ width:`${stats.porcentaje}%`, height:'100%',
                            background:'linear-gradient(90deg, #10b981, #059669)',
                            borderRadius:'99px', transition:'width 0.8s ease' }} />
                    </div>
                    <p className="progress-label">{stats.completadas} de {stats.total} tareas completadas</p>
                </div>
            )}

            {/* ── Gráficas ───────────────────────────────────── */}
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr',
                gap:'1.5rem', marginBottom:'1.5rem' }}>
                <TaskChart  data={activity}     />
                <DonutChart data={distribution} />
            </div>

            {/* ── Actividad reciente ─────────────────────────── */}
            <ActivityFeed tareas={recentFeed} />

            {/* ── Refresh manual ─────────────────────────────── */}
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'1rem' }}>
                <button onClick={refresh} className="btn-primary"
                    style={{ width:'auto', padding:'0.4rem 1.2rem', fontSize:'0.88rem' }}>
                    🔄 Actualizar
                </button>
            </div>

        </div>
    )
}
