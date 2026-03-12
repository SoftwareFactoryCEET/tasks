// src/services/taskService.ts
// CRUD completo para la tabla "Tareas" de Supabase.
// IMPORTANTE: el nombre de la tabla es "Tareas" con T mayúscula (definido en types/database.ts).
// Las RLS (Row Level Security) en Supabase garantizan que cada usuario solo ve sus propias tareas.
import { supabase } from '../lib/supabaseClient'
import type { TablesInsert, TablesUpdate } from '../types/database'

// Tipos inferidos del esquema generado — evitan errores de tipado en inserts y updates
type TareaInsert = TablesInsert<'Tareas'>
type TareaUpdate = TablesUpdate<'Tareas'>

export const taskService = {

    // ─── READ ───────────────────────────────────────────────
    // Devuelve todas las tareas del usuario ordenadas por fecha de creación (más recientes primero)
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
