// src/lib/supabaseClient.ts
// Crea y exporta la única instancia del cliente Supabase (patrón Singleton).
// Todos los servicios y hooks importan este objeto para comunicarse con el backend.
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

// Las variables de entorno se definen en el archivo .env (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)
const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Falla rápido en tiempo de ejecución si las variables no están configuradas
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Faltan las variables de entorno de Supabase')
}

// El genérico <Database> habilita autocompletado y tipado estricto en todas las consultas
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
