// src/pages/Home.tsx
// Página principal: lista de tareas en tiempo real + chat colaborativo.
// Orquesta tres hooks:
//   - useRealtimeTasks: CRUD de tareas con Realtime + Optimistic UI
//   - useRoom:          presencia de usuarios + chat broadcast/privado
//   - useAuthContext:   email del usuario para el chat
import { useRealtimeTasks }  from '../hooks/useRealtimeTasks'
import { useRoom }           from '../hooks/useRoom'
import { useAuthContext }    from '../context/AuthContext'
import { RealtimeIndicator } from '../components/RealtimeIndicator'
import { TaskForm }          from '../components/TaskForm'
import { TaskItem }          from '../components/TaskItem'
import { Chat }              from '../components/Chat'

export function Home() {
    const { tareas, loading, conectado, crearTarea, actualizarTarea, eliminarTarea } = useRealtimeTasks()
    const { onlineUsers, mensajes, enviarMensaje } = useRoom('home-room')
    const { user } = useAuthContext()

    if (loading) return <div className="estado-cargando">Cargando tareas...</div>

    const completadas = tareas.filter(t => t.completada).length

    return (
        <>
            <div style={{ display:'flex', gap:'1rem', alignItems:'center',
                marginBottom:'1.5rem', justifyContent:'flex-end' }}>
                <RealtimeIndicator conectado={conectado} />
                <span style={{ fontSize:'0.85rem', color:'#64748b' }}>
                    👥 {onlineUsers.length} en línea
                </span>
            </div>

            <div className="card">
                <TaskForm
                    onCrear={async (titulo, descripcion) => { await crearTarea({ titulo, descripcion }) }}
                />
            </div>

            <div className="card">
                <div className="task-list-header">
                    <h2>Mis tareas</h2>
                    <span className="task-count">{completadas} / {tareas.length} completadas</span>
                </div>

                {tareas.length === 0
                    ? <p className="task-empty">No tienes tareas aún. ¡Crea una arriba!</p>
                    : tareas.map(t => (
                        <TaskItem key={t.id} tarea={t}
                            onActualizar={async (id, completada) => { await actualizarTarea(id, { completada }) }}
                            onEliminar={eliminarTarea}
                        />
                    ))
                }
            </div>

            <Chat
                miEmail={user?.email ?? ''}
                onlineUsers={onlineUsers}
                mensajes={mensajes}
                onEnviar={enviarMensaje}
            />
        </>
    )
}
