// src/components/Chat.tsx
// Chat flotante con soporte para mensajes públicos y conversaciones privadas.
//
// Funcionalidades:
//   - Botón flotante con badge de mensajes no leídos
//   - Selector de destinatario: "Todos" (broadcast) o un usuario específico (privado)
//   - Filtrado local de mensajes según la conversación activa
//   - Auto-scroll al último mensaje al abrir o recibir nuevos mensajes
//   - Contador de no leídos basado en índice (vistosHasta) para no mutar el array de mensajes
import { useState, useRef, useEffect } from 'react'
import type { Mensaje, UserPresence }  from '../hooks/useRoom'

interface Props {
    miEmail:      string
    onlineUsers:  UserPresence[]
    mensajes:     Mensaje[]
    onEnviar:     (texto: string, destinatario: string | null) => Promise<void>
}

export function Chat({ miEmail, onlineUsers, mensajes, onEnviar }: Props) {
    const [abierto,      setAbierto]      = useState(false)
    const [destinatario, setDestinatario] = useState<string | null>(null)  // null = canal público
    const [texto,        setTexto]        = useState('')
    const [vistosHasta,  setVistosHasta]  = useState(0)  // índice hasta donde el usuario ha visto
    const bottomRef = useRef<HTMLDivElement>(null)

    // Excluye al propio usuario de la lista de destinatarios posibles
    const otrosUsuarios = onlineUsers.filter(u => u.email !== miEmail)

    // Al abrir el panel, marca todos los mensajes actuales como vistos
    useEffect(() => {
        if (abierto) setVistosHasta(mensajes.length)
    }, [abierto, mensajes.length])

    // Cuenta mensajes nuevos que llegaron después de la última vez que el panel estuvo abierto
    // Solo cuenta los que son para mí (directos o públicos)
    const noLeidos = abierto ? 0 : mensajes
        .slice(vistosHasta)
        .filter(m => m.destinatario === miEmail || m.destinatario === null).length

    // Filtra los mensajes según la conversación activa:
    //   - destinatario null → solo mensajes públicos
    //   - destinatario string → intercambio bidireccional entre miEmail y ese usuario
    const mensajesFiltrados = mensajes.filter(m => {
        if (destinatario === null) return m.destinatario === null
        return (
            (m.usuario === miEmail       && m.destinatario === destinatario) ||
            (m.usuario === destinatario  && m.destinatario === miEmail)
        )
    })

    useEffect(() => {
        if (abierto) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [mensajesFiltrados, abierto])

    const handleEnviar = async (e: React.FormEvent) => {
        e.preventDefault()
        const txt = texto.trim()
        if (!txt) return
        setTexto('')
        await onEnviar(txt, destinatario)
    }

    const labelDestinatario = destinatario ? destinatario.split('@')[0] : 'Todos'

    return (
        <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:100 }}>

            {abierto && (
                <div className="card" style={{ width:'320px', marginBottom:'0.75rem',
                    boxShadow:'0 8px 24px rgba(0,0,0,0.15)', padding:0, overflow:'hidden' }}>

                    {/* ── Header ── */}
                    <div style={{ padding:'0.6rem 1rem', background:'var(--sena-dark-green)',
                        color:'white', fontWeight:600, fontSize:'0.88rem' }}>
                        💬 Chat · {labelDestinatario}
                    </div>

                    {/* ── Selector de destinatario ── */}
                    <div style={{ display:'flex', gap:'0.4rem', padding:'0.5rem 0.75rem',
                        background:'#f1f5f9', overflowX:'auto', flexWrap:'nowrap' }}>
                        <button onClick={() => setDestinatario(null)}
                            style={{ padding:'0.25rem 0.7rem', borderRadius:'20px',
                                fontSize:'0.78rem', whiteSpace:'nowrap', cursor:'pointer',
                                border:'1.5px solid',
                                borderColor: !destinatario ? 'var(--sena-green)' : '#cbd5e1',
                                background:  !destinatario ? 'var(--sena-green)' : 'white',
                                color:       !destinatario ? 'white' : '#475569',
                                fontWeight:  !destinatario ? 600 : 400 }}>
                            🌐 Todos
                        </button>

                        {otrosUsuarios.length === 0
                            ? <span style={{ fontSize:'0.78rem', color:'#94a3b8', alignSelf:'center' }}>
                                Sin más usuarios
                              </span>
                            : otrosUsuarios.map(u => {
                                const activo = destinatario === u.email
                                return (
                                    <button key={u.email} onClick={() => setDestinatario(u.email)}
                                        style={{ padding:'0.25rem 0.7rem', borderRadius:'20px',
                                            fontSize:'0.78rem', whiteSpace:'nowrap', cursor:'pointer',
                                            border:'1.5px solid',
                                            borderColor: activo ? 'var(--sena-green)' : '#cbd5e1',
                                            background:  activo ? 'var(--sena-green)' : 'white',
                                            color:       activo ? 'white' : '#475569',
                                            fontWeight:  activo ? 600 : 400 }}>
                                        👤 {u.email.split('@')[0]}
                                    </button>
                                )
                            })
                        }
                    </div>

                    {/* ── Mensajes ── */}
                    <div style={{ height:'240px', overflowY:'auto', padding:'0.75rem',
                        display:'flex', flexDirection:'column', gap:'0.5rem', background:'#f8fafc' }}>
                        {mensajesFiltrados.length === 0
                            ? <p style={{ color:'#94a3b8', fontSize:'0.85rem',
                                textAlign:'center', margin:'auto' }}>
                                Sin mensajes aún. ¡Saluda!
                              </p>
                            : mensajesFiltrados.map(m => {
                                const esPropio = m.usuario === miEmail
                                return (
                                    <div key={m.id} style={{ display:'flex', flexDirection:'column',
                                        alignItems: esPropio ? 'flex-end' : 'flex-start' }}>
                                        {!esPropio && (
                                            <span style={{ fontSize:'0.72rem', color:'#64748b', marginBottom:'2px' }}>
                                                {m.usuario.split('@')[0]}
                                            </span>
                                        )}
                                        <div style={{ padding:'0.4rem 0.75rem', borderRadius:'12px',
                                            maxWidth:'80%', fontSize:'0.88rem',
                                            background: esPropio ? 'var(--sena-green)' : 'white',
                                            color:      esPropio ? 'white' : '#1e293b',
                                            boxShadow:'0 1px 3px rgba(0,0,0,0.08)' }}>
                                            {m.texto}
                                        </div>
                                        <span style={{ fontSize:'0.7rem', color:'#94a3b8', marginTop:'2px' }}>
                                            {m.hora}
                                        </span>
                                    </div>
                                )
                            })
                        }
                        <div ref={bottomRef} />
                    </div>

                    {/* ── Input ── */}
                    <form onSubmit={handleEnviar}
                        style={{ display:'flex', gap:'0.5rem', padding:'0.75rem',
                            borderTop:'1px solid #e2e8f0', background:'white' }}>
                        <input
                            value={texto} onChange={e => setTexto(e.target.value)}
                            placeholder={`Mensaje a ${labelDestinatario}...`}
                            style={{ flex:1, fontSize:'0.88rem' }}
                        />
                        <button type="submit" className="btn-primary"
                            style={{ width:'auto', padding:'0.4rem 0.9rem', fontSize:'0.85rem' }}
                            disabled={!texto.trim()}>
                            Enviar
                        </button>
                    </form>
                </div>
            )}

            {/* ── Botón flotante ── */}
            <div style={{ position:'relative', marginLeft:'auto', width:'52px' }}>
                <button onClick={() => setAbierto(v => !v)}
                    style={{ width:'52px', height:'52px', borderRadius:'50%',
                        background:'var(--sena-dark-green)', color:'white',
                        border:'none', fontSize:'1.4rem', cursor:'pointer',
                        boxShadow:'0 4px 12px rgba(0,0,0,0.2)',
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {abierto ? '✕' : '💬'}
                </button>
                {noLeidos > 0 && (
                    <span style={{ position:'absolute', top:'-4px', right:'-4px',
                        background:'#ef4444', color:'white', borderRadius:'50%',
                        width:'20px', height:'20px', fontSize:'0.72rem', fontWeight:700,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        boxShadow:'0 2px 4px rgba(0,0,0,0.3)' }}>
                        {noLeidos > 9 ? '9+' : noLeidos}
                    </span>
                )}
            </div>
        </div>
    )
}
