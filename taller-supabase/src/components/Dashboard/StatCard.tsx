// src/components/Dashboard/StatCard.tsx
// Tarjeta KPI para el Dashboard. Muestra un indicador con borde de color, icono, valor y subtítulo.
// El color se aplica tanto al borde izquierdo como al valor numérico para refuerzo visual.
interface Props {
    titulo:     string
    valor:      number | string
    icono:      string
    color:      string        // color CSS que identifica el KPI (ej: '#10b981' para completadas)
    subtitulo?: string        // texto auxiliar debajo del valor (opcional)
}

export function StatCard({ titulo, valor, icono, color, subtitulo }: Props) {
    return (
        <div style={{ background:'white', borderLeft:`5px solid ${color}`,
            border:`1px solid ${color}20`, borderRadius:'12px', padding:'1.5rem',
            boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontSize:'0.85rem', color:'#64748b', fontWeight:600 }}>
          {titulo}
        </span>
                <span style={{ fontSize:'1.5rem' }}>{icono}</span>
            </div>
            <div style={{ fontSize:'2.5rem', fontWeight:800, color, lineHeight:1,
                margin:'0.4rem 0' }}>
                {valor}
            </div>
            {subtitulo && <span style={{ fontSize:'0.8rem', color:'#94a3b8' }}>
        {subtitulo}
      </span>}
        </div>
    )
}
