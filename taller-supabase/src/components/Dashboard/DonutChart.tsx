// src/components/Dashboard/DonutChart.tsx
// Gráfica de dona (PieChart con innerRadius) que muestra la distribución
// de tareas completadas vs pendientes.
// Si no hay tareas (total === 0) muestra un mensaje en lugar de una gráfica vacía.
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DistributionItem { name: string; value: number; color: string }

export function DonutChart({ data }: { data: DistributionItem[] }) {
    // Suma total para detectar el caso sin datos
    const total = data.reduce((s,d)=>s+d.value,0)
    return (
        <div style={{ background:'white', borderRadius:'12px', padding:'1.5rem',
            boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin:'0 0 1rem', fontSize:'1rem' }}>🍩 Distribución</h3>
            {total===0
                ? <p style={{ color:'#94a3b8' }}>Sin tareas</p>
                : <ResponsiveContainer width='100%' height={200}>
                    <PieChart>
                        <Pie data={data} cx='50%' cy='50%'
                             innerRadius={50} outerRadius={80}   // innerRadius = dona
                             paddingAngle={3} dataKey='value'>
                            {data.map((e,i)=><Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip formatter={v=>[`${v} tareas`]} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            }
        </div>
    )
}
