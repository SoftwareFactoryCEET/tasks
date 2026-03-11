// src/components/TaskForm.tsx
import { useState } from 'react'

interface Props {
    onCrear: (titulo: string, descripcion: string) => Promise<void>
}

export function TaskForm({ onCrear }: Props) {
    const [titulo,      setTitulo]      = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [submitting,  setSubmitting]  = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!titulo.trim()) return
        setSubmitting(true)
        try {
            await onCrear(titulo.trim(), descripcion.trim())
            setTitulo(''); setDescripcion('')
        } catch (err) { console.error(err) }
        finally { setSubmitting(false) }
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2>Nueva tarea</h2>
            <div className="form-fields">
                <input
                    type="text"
                    placeholder="Título *"
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Descripción (opcional)"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                />
                <button type="submit" className="btn-primary" disabled={submitting || !titulo.trim()}>
                    {submitting ? 'Guardando...' : '+ Agregar tarea'}
                </button>
            </div>
        </form>
    )
}