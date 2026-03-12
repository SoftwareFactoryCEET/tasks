// src/hooks/useRealtimeTasks.ts
// Hook principal de gestión de tareas con Realtime.
// Combina dos mecanismos de actualización:
//   1. Optimistic UI: el estado local se modifica ANTES de confirmar con el servidor → UI instantánea
//   2. Supabase Realtime (postgres_changes): sincroniza cambios de OTROS usuarios en tiempo real
import { useState, useEffect, useCallback } from 'react'
import { supabase }      from '../lib/supabaseClient'
import { taskService }   from '../services/taskService'
import type { Tables, TablesInsert, TablesUpdate } from '../types/database'
import type { RealtimePostgresChangesPayload }     from '@supabase/supabase-js'

type Tarea       = Tables<'Tareas'>
type TareaInsert = TablesInsert<'Tareas'>
type TareaUpdate = TablesUpdate<'Tareas'>

export function useRealtimeTasks() {
    const [tareas,    setTareas]    = useState<Tarea[]>([])
    const [loading,   setLoading]   = useState(true)
    const [conectado, setConectado] = useState(false)  // refleja si el canal Realtime está activo

    // fetchTareas es estable (useCallback) para poder usarlo como dependencia del useEffect
    const fetchTareas = useCallback(async () => {
        setLoading(true)
        try {
            const { data, error } = await taskService.getAll()
            if (error) throw error
            setTareas(data ?? [])
        } catch (err) {
            console.error('Error al cargar tareas:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        // Carga inicial de tareas desde la base de datos
        fetchTareas()

        // Canal Realtime: escucha INSERT, UPDATE y DELETE en la tabla Tareas
        const channel = supabase
            .channel('tareas-realtime')
            .on<Tarea>(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'Tareas' },
                (payload: RealtimePostgresChangesPayload<Tarea>) => {
                    if (payload.eventType === 'INSERT')
                        // Deduplicación: ignora el INSERT si ya existe (puede llegar duplicado por el optimistic update)
                        setTareas(prev =>
                            prev.some(t => t.id === payload.new.id)
                                ? prev
                                : [payload.new, ...prev]
                        )

                    if (payload.eventType === 'UPDATE')
                        setTareas(prev => prev.map(t =>
                            t.id === payload.new.id ? payload.new : t
                        ))

                    if (payload.eventType === 'DELETE')
                        setTareas(prev => prev.filter(t => t.id !== payload.old?.id))
                }
            )
            .subscribe(status => setConectado(status === 'SUBSCRIBED'))

        // Cleanup: elimina el canal al desmontar el componente
        return () => { supabase.removeChannel(channel) }
    }, [fetchTareas])

    // ── Mutaciones con Optimistic UI ──────────────────────────────────────────
    // crearTarea: inserta en BD y agrega el registro devuelto al estado local inmediatamente
    const crearTarea = async (t: TareaInsert) => {
        const { data, error } = await taskService.create(t)
        if (error) throw error
        if (data) setTareas(prev => [data, ...prev])
    }
    // actualizarTarea: aplica el cambio en UI antes de la respuesta; revierte si hay error
    const actualizarTarea = async (id: string, c: TareaUpdate) => {
        setTareas(prev => prev.map(t => t.id === id ? { ...t, ...c } : t))
        const { error } = await taskService.update(id, c)
        if (error) { fetchTareas(); throw error }
    }
    // eliminarTarea: elimina de UI antes de la respuesta; revierte si hay error
    const eliminarTarea = async (id: string) => {
        setTareas(prev => prev.filter(t => t.id !== id))
        const { error } = await taskService.delete(id)
        if (error) { fetchTareas(); throw error }
    }

    return { tareas, loading, conectado, crearTarea, actualizarTarea, eliminarTarea }
}
