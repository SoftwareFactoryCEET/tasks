// src/pages/Home.tsx
import { useTasks } from '../hooks/useTasks'
import { TaskForm } from '../components/TaskForm'
import { TaskItem } from '../components/TaskItem'

export function Home() {
    const { tareas, loading, error, crearTarea, actualizarTarea, eliminarTarea } = useTasks()

    if (loading) return <div className="estado-cargando">Cargando tareas...</div>
    if (error)   return <div className="estado-error">Error: {error}</div>

    const completadas = tareas.filter(t => t.completada).length

    return (
        <>
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
        </>
    )
}