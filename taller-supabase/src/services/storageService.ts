// src/services/storageService.ts
// Abstracción sobre Supabase Storage para dos buckets:
//   - "avatars":         foto de perfil de cada usuario
//   - "archivos-tareas": adjuntos asociados a una tarea específica
import { supabase } from '../lib/supabaseClient'

const AVATARS_BUCKET  = 'avatars'
const ARCHIVOS_BUCKET = 'archivos-tareas'

export const storageService = {

    avatars: {
        // Sube (o reemplaza) el avatar del usuario.
        // Se usa una ruta FIJA "{userId}/avatar" con upsert:true para siempre sobrescribir
        // el mismo archivo, evitando acumulación de versiones en el bucket.
        // cacheControl:'0' impide que Supabase CDN cachee el archivo.
        upload: (userId: string, file: File) =>
            supabase.storage
                .from(AVATARS_BUCKET)
                .upload(`${userId}/avatar`, file, { upsert: true, cacheControl: '0' }),

        // Devuelve la URL pública con un cache-buster (?t=timestamp).
        // El parámetro ?t fuerza al navegador a descartar su caché y pedir la imagen fresca.
        getPublicUrl: (userId: string) => {
            const { data } = supabase.storage
                .from(AVATARS_BUCKET)
                .getPublicUrl(`${userId}/avatar`)
            return `${data.publicUrl}?t=${Date.now()}`
        },

        // Lista el directorio del usuario y verifica si existe el archivo "avatar"
        exists: async (userId: string) => {
            const { data } = await supabase.storage.from(AVATARS_BUCKET).list(userId)
            return (data ?? []).some(f => f.name === 'avatar')
        },
    },

    archivos: {
        // Sube un adjunto vinculado a una tarea.
        // La ruta incluye un timestamp para evitar colisiones si se sube el mismo nombre de archivo.
        upload: (tareaId: string, file: File) => {
            const path = `${tareaId}/${Date.now()}-${file.name}`
            return supabase.storage.from(ARCHIVOS_BUCKET).upload(path, file)
        },
        // Lista todos los archivos adjuntos de una tarea
        list: (tareaId: string) =>
            supabase.storage.from(ARCHIVOS_BUCKET).list(tareaId),
        // Genera una URL firmada temporal (por defecto 1 hora) para descargar el archivo de forma segura
        getSignedUrl: (path: string, expiresIn = 3600) =>
            supabase.storage.from(ARCHIVOS_BUCKET).createSignedUrl(path, expiresIn),
        delete: (path: string) =>
            supabase.storage.from(ARCHIVOS_BUCKET).remove([path]),
    }
}
