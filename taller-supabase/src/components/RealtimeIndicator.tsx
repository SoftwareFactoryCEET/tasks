// src/components/RealtimeIndicator.tsx
// Indicador visual del estado de la conexión Realtime.
// Muestra un punto verde y "Realtime activo" cuando el canal está suscrito,
// o rojo y "Sin conexión" si la suscripción falló o se perdió.
export function RealtimeIndicator({ conectado }: { conectado: boolean }) {
    return (
        <div style={{ display:'inline-flex', alignItems:'center', gap:'6px',
            padding:'4px 12px', borderRadius:'20px', fontSize:'0.8rem',
            background: conectado ? '#d1fae5' : '#fee2e2',
            color:      conectado ? '#065f46' : '#991b1b' }}>
      <span style={{ width:'8px', height:'8px', borderRadius:'50%',
          background: conectado ? '#10b981' : '#ef4444' }} />
            {conectado ? 'Realtime activo' : 'Sin conexión'}
        </div>
    )
}
