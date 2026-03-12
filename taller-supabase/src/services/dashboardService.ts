// src/services/dashboardService.ts
// Consultas de solo lectura para alimentar el Dashboard.
// Todas son funciones async que calculan métricas en el cliente a partir de datos crudos de Supabase.
// El hook useDashboard las ejecuta en paralelo con Promise.all para minimizar el tiempo de carga.
import { supabase } from '../lib/supabaseClient'

export const dashboardService = {

    // ─── KPIs globales ───────────────────────────────────────
    // Calcula: total, completadas, pendientes, porcentaje de avance y tareas creadas hoy
    getStats: async () => {
        const { data, error } = await supabase
            .from('Tareas')
            .select('completada, created_at')
        if (error) throw error

        const total       = data!.length
        const completadas = data!.filter(t => t.completada === true).length
        const pendientes  = total - completadas
        const porcentaje  = total > 0 ? Math.round((completadas / total) * 100) : 0
        const hoy         = new Date().toISOString().split('T')[0]
        const creadasHoy  = data!.filter(t => t.created_at.startsWith(hoy)).length

        return { total, completadas, pendientes, porcentaje, creadasHoy }
    },

    // ─── Actividad por día — últimos 7 días ──────────────────
    getActivityByDay: async () => {
        const hace7 = new Date()
        hace7.setDate(hace7.getDate() - 7)

        const { data, error } = await supabase
            .from('Tareas')
            .select('created_at, completada')
            .gte('created_at', hace7.toISOString())
            .order('created_at', { ascending: true })
        if (error) throw error

        // Agrupar por fecha
        const grouped: Record<string,{creadas:number;completadas:number}> = {}
        data!.forEach(t => {
            const d = t.created_at.split('T')[0]
            if (!grouped[d]) grouped[d] = { creadas:0, completadas:0 }
            grouped[d].creadas++
            if (t.completada === true) grouped[d].completadas++
        })
        return Object.entries(grouped).map(([fecha, v]) => ({
            fecha: new Date(fecha).toLocaleDateString('es-CO',
                { weekday:'short', day:'numeric' }),
            ...v
        }))
    },

    // ─── Distribución para gráfica de dona ───────────────────
    getDistribution: async () => {
        const { data, error } = await supabase.from('Tareas').select('completada')
        if (error) throw error
        const completadas = data!.filter(t => t.completada === true).length
        const pendientes  = data!.length - completadas
        return [
            { name:'Completadas', value:completadas, color:'#10b981' },
            { name:'Pendientes',  value:pendientes,  color:'#f59e0b' },
        ]
    },

    // ─── Actividad reciente ───────────────────────────────────
    getRecentActivity: async (limit = 10) => {
        const { data, error } = await supabase
            .from('Tareas')
            .select('id, titulo, completada, created_at')
            .order('created_at', { ascending: false })
            .limit(limit)
        if (error) throw error
        return data!
    },
}
