// src/hooks/useRoom.ts
// Hook de sala colaborativa: gestiona PRESENCIA y CHAT en un único canal de Supabase Realtime.
//
// Arquitectura de un solo canal:
//   - Un canal por sala (ej: "home-room") evita conflictos entre múltiples canales.
//   - Presencia: Supabase rastrea quién está conectado usando channel.track().
//   - Broadcast: los mensajes del chat se envían como eventos "mensaje" con destinatario opcional.
//
// Mensajes privados: se implementan con filtrado en el cliente (campo "destinatario").
// Un mensaje llega a todos los suscriptores del canal, pero solo se muestra si el cliente
// es el remitente o el destinatario (o destinatario === null para mensajes públicos).
import { useState, useEffect, useRef } from 'react'
import { supabase }        from '../lib/supabaseClient'
import { useAuthContext }  from '../context/AuthContext'

export interface UserPresence { userId: string; email: string; online_at: string }

export interface Mensaje {
    id:           string
    texto:        string
    usuario:      string        // email del remitente
    hora:         string        // hora formateada para mostrar en el chat
    destinatario: string | null // null = mensaje público para todos
}

export function useRoom(sala: string) {
    const { user }    = useAuthContext()
    const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])
    const [mensajes,    setMensajes]    = useState<Mensaje[]>([])
    // channelRef guarda la referencia activa del canal para usarla en enviarMensaje
    // (no se puede usar una variable local porque enviarMensaje se llama fuera del useEffect)
    const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

    useEffect(() => {
        if (!user) return

        // self:true → el propio remitente también recibe sus mensajes de broadcast
        // (comportamiento por defecto de Supabase es NO enviarlos al remitente)
        const channel = supabase.channel(sala, {
            config: { broadcast: { self: true } },
        })

        // ── Presencia ────────────────────────────────────────
        // El evento 'sync' se dispara cada vez que alguien entra o sale de la sala
        channel.on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState<UserPresence>()
            setOnlineUsers(Object.values(state).flat())
        })

        // ── Chat (broadcast) ─────────────────────────────────
        // Filtra en el cliente: solo agrega el mensaje si corresponde a esta conversación
        channel.on('broadcast', { event: 'mensaje' }, ({ payload }) => {
            const msg = payload as Mensaje
            const visible =
                msg.destinatario === null           ||  // mensaje público
                msg.destinatario === user.email     ||  // soy el destinatario
                msg.usuario      === user.email         // soy el remitente (por self:true)
            if (visible) setMensajes(prev => [...prev, msg])
        })

        // Al conectarse exitosamente, registra la presencia del usuario en el canal
        channel.subscribe(async status => {
            if (status === 'SUBSCRIBED') {
                await channel.track({
                    userId:    user.id,
                    email:     user.email ?? '',
                    online_at: new Date().toISOString(),
                })
            }
        })

        channelRef.current = channel
        // Cleanup: elimina el canal y libera la presencia del usuario al salir de la página
        return () => { supabase.removeChannel(channel); channelRef.current = null }
    }, [user, sala])

    // Envía un mensaje al canal activo usando la referencia almacenada
    // destinatario === null → mensaje público; string → mensaje privado (filtrado en cliente)
    const enviarMensaje = async (texto: string, destinatario: string | null) => {
        if (!channelRef.current || !user) return
        await channelRef.current.send({
            type: 'broadcast', event: 'mensaje',
            payload: {
                id:           crypto.randomUUID(),
                texto,
                usuario:      user.email ?? '',
                destinatario,
                hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
            } satisfies Mensaje,
        })
    }

    return { onlineUsers, mensajes, enviarMensaje }
}
