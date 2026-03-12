// src/hooks/useDashboard.ts
// Hook que agrega todas las métricas del Dashboard.
// Estrategia: carga inicial con Promise.all (paralelo) + Realtime para auto-refrescar al detectar cambios.
import { useState, useEffect, useCallback } from 'react'
import { supabase }           from '../lib/supabaseClient'
import { dashboardService }   from '../services/dashboardService'

// ── Tipos de datos para las métricas del Dashboard ─────────────────────────
interface Stats {
    total: number        // total de tareas
    completadas: number  // cuántas están marcadas como completadas
    pendientes: number   // total - completadas
    porcentaje: number   // progreso global (0–100)
    creadasHoy: number   // tareas creadas en el día de hoy
}

interface ActivityDay {
    fecha: string        // etiqueta del eje X (ej: "lun 9")
    creadas: number      // tareas creadas ese día
    completadas: number  // tareas completadas ese día
}

interface DistributionItem {
    name: string   // "Completadas" o "Pendientes"
    value: number  // cantidad
    color: string  // color para la gráfica de dona
}

interface RecentItem {
    id: string
    titulo: string
    completada: boolean | null
    created_at: string
}

export function useDashboard() {
    const [stats,        setStats]        = useState<Stats | null>(null)
    const [activity,     setActivity]     = useState<ActivityDay[]>([])
    const [distribution, setDistribution] = useState<DistributionItem[]>([])
    const [recentFeed,   setRecentFeed]   = useState<RecentItem[]>([])
    const [loading,      setLoading]      = useState(true)
    const [lastUpdated,  setLastUpdated]  = useState<Date | null>(null)

    // refresh es estable (useCallback) — se puede invocar manualmente desde el botón del Dashboard
    const refresh = useCallback(async () => {
        try {
            // Las 4 consultas corren en paralelo — mucho más rápido que en serie
            const [s, a, d, f] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getActivityByDay(),
                dashboardService.getDistribution(),
                dashboardService.getRecentActivity(10),
            ])
            setStats(s); setActivity(a); setDistribution(d); setRecentFeed(f)
            setLastUpdated(new Date())
        } catch (err) { console.error('Dashboard error:', err) }
        finally { setLoading(false) }
    }, [])

    useEffect(() => {
        refresh()

        // Canal Realtime: al detectar cualquier cambio en Tareas, recalcula todas las métricas
        // Esto mantiene el dashboard sincronizado cuando otros usuarios modifican tareas
        const ch = supabase
            .channel('dashboard-realtime')
            .on('postgres_changes',
                { event:'*', schema:'public', table:'Tareas' },
                () => refresh()
            )
            .subscribe()

        return () => { supabase.removeChannel(ch) }
    }, [refresh])

    return { stats, activity, distribution, recentFeed, loading, lastUpdated, refresh }
}
