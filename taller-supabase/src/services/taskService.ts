// src/services/taskService.ts
import { supabase } from '../lib/supabaseClient'
import type { TablesInsert, TablesUpdate } from '../types/database'

type TareaInsert = TablesInsert<'Tareas'>
type TareaUpdate = TablesUpdate<'Tareas'>

export const taskService = {

    // ─── READ ───────────────────────────────────────────────
    getAll: () =>
        supabase
            .from('Tareas')
            .select('*')
            .order('created_at', { ascending: false }),

    getById: (id: string) =>
        supabase.from('Tareas').select('*').eq('id', id).single(),

    getByStatus: (completada: boolean) =>
        supabase
            .from('Tareas')
            .select('*')
            .eq('completada', completada)
            .order('created_at', { ascending: false }),

    search: (texto: string) =>
        supabase
            .from('Tareas')
            .select('*')
            .ilike('titulo', `%${texto}%`)  // Búsqueda sin distinguir mayúsculas
            .order('created_at', { ascending: false }),

    // ─── CREATE ─────────────────────────────────────────────
    create: (tarea: TareaInsert) =>
        supabase.from('Tareas').insert(tarea).select().single(),

    // ─── UPDATE ─────────────────────────────────────────────
    update: (id: string, cambios: TareaUpdate) =>
        supabase.from('Tareas').update(cambios).eq('id', id).select().single(),

    toggleCompletada: (id: string, estadoActual: boolean) =>
        supabase
            .from('Tareas')
            .update({ completada: !estadoActual })
            .eq('id', id)
            .select()
            .single(),

    // ─── DELETE ─────────────────────────────────────────────
    delete: (id: string) =>
        supabase.from('Tareas').delete().eq('id', id),

    deleteCompleted: () =>
        supabase.from('Tareas').delete().eq('completada', true),
}
