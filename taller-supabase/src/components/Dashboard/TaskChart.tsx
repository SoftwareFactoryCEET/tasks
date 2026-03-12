// src/components/Dashboard/TaskChart.tsx
// Gráfica de barras que muestra la actividad de los últimos 7 días.
// Cada barra de día tiene dos series: tareas creadas (azul) y tareas completadas (verde).
// Los datos vienen de dashboardService.getActivityByDay() a través de useDashboard.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer } from 'recharts'

export function TaskChart({ data }: { data: any[] }) {
    if (!data.length) return <p style={{ color:'#94a3b8' }}>Sin actividad aún</p>
    return (
        <div style={{ background:'white', borderRadius:'12px', padding:'1.5rem',
            boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin:'0 0 1rem', fontSize:'1rem' }}>
                📅 Actividad últimos 7 días
            </h3>
            <ResponsiveContainer width='100%' height={220}>
                <BarChart data={data} margin={{ top:5, right:10, left:-10, bottom:5 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f1f5f9' />
                    <XAxis dataKey='fecha' tick={{ fontSize:11, fill:'#64748b' }} />
                    <YAxis tick={{ fontSize:11, fill:'#64748b' }} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius:'8px', border:'none',
                        boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }} />
                    <Legend wrapperStyle={{ fontSize:'12px' }} />
                    <Bar dataKey='creadas'     name='Creadas'     fill='#3b82f6' radius={[4,4,0,0]} />
                    <Bar dataKey='completadas' name='Completadas' fill='#10b981' radius={[4,4,0,0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
