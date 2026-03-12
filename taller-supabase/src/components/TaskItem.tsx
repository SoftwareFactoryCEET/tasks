// src/components/TaskItem.tsx
// Componente de presentación para una tarea individual.
// El checkbox usa checked controlado (no defaultChecked) para reflejar el estado de la BD.
// Las acciones de actualizar y eliminar se delegan al padre (useRealtimeTasks) mediante props.
import { useState } from 'react'
import type { Tables } from '../types/database'

type Tarea = Tables<'Tareas'>

interface Props {
    tarea:        Tarea
    onActualizar: (id: string, completada: boolean) => Promise<void>
    onEliminar:   (id: string) => Promise<void>
}

export function TaskItem({ tarea, onActualizar, onEliminar }: Props) {
    const [eliminando, setEliminando] = useState(false)  // previene doble clic en eliminar

    const handleEliminar = async () => {
        if (!confirm('¿Eliminar esta tarea?')) return  // confirmación del usuario antes de borrar
        setEliminando(true)
        await onEliminar(tarea.id)
    }

    return (
        <div className={`task-item${eliminando ? ' eliminando' : ''}`}>
            {/* checked={...} convierte el checkbox en controlado;
                ?? false maneja el caso en que completada sea null en la BD */}
            <input
                type="checkbox"
                checked={tarea.completada ?? false}
                onChange={() => onActualizar(tarea.id, !tarea.completada)}
            />
            <div className="task-item-content">
                <p className={`task-item-title${tarea.completada ? ' completada' : ''}`}>
                    {tarea.titulo}
                </p>
                {tarea.descripcion && (
                    <p className="task-item-desc">{tarea.descripcion}</p>
                )}
            </div>
            <button className="btn-danger" onClick={handleEliminar} disabled={eliminando}>
                🗑 Eliminar
            </button>
        </div>
    )
}