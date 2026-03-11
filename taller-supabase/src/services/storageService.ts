// src/services/storageService.ts
import { supabase } from '../lib/supabaseClient'

const AVATARS_BUCKET  = 'avatars'
const ARCHIVOS_BUCKET = 'archivos-tareas'

export const storageService = {

    avatars: {
        // Nombre único por subida → el CDN nunca tiene este path en caché
        upload: (userId: string, file: File) => {
            const ext  = file.name.split('.').pop()
            const path = `${userId}/avatar-${Date.now()}.${ext}`
            return supabase.storage
                .from(AVATARS_BUCKET)
                .upload(path, file, { upsert: false, cacheControl: '3600' })
        },
        // Construye la URL pública desde la ruta exacta devuelta por upload()
        getPublicUrlFromPath: (path: string) => {
            const { data } = supabase.storage
                .from(AVATARS_BUCKET)
                .getPublicUrl(path)
            return data.publicUrl
        },
        // Lista los archivos en la carpeta del usuario
        list: (userId: string) =>
            supabase.storage.from(AVATARS_BUCKET).list(userId),
        // Elimina todos los avatares anteriores (limpieza antes de subir nuevo)
        deleteAll: (userId: string) =>
            supabase.storage
                .from(AVATARS_BUCKET)
                .list(userId)
                .then(({ data }) => {
                    if (!data?.length) return
                    return supabase.storage
                        .from(AVATARS_BUCKET)
                        .remove(data.map(f => `${userId}/${f.name}`))
                }),
    },

    archivos: {
        // Adjuntar archivo a una tarea — ruta: tareaId/timestamp-nombre
        upload: (tareaId: string, file: File) => {
            const path = `${tareaId}/${Date.now()}-${file.name}`
            return supabase.storage.from(ARCHIVOS_BUCKET).upload(path, file)
        },
        list: (tareaId: string) =>
            supabase.storage.from(ARCHIVOS_BUCKET).list(tareaId),
        getSignedUrl: (path: string, expiresIn = 3600) =>
            supabase.storage.from(ARCHIVOS_BUCKET).createSignedUrl(path, expiresIn),
        delete: (path: string) =>
            supabase.storage.from(ARCHIVOS_BUCKET).remove([path]),
    }
}
