// src/components/AvatarUpload.tsx
// Componente para mostrar y actualizar la foto de perfil del usuario.
// Usa el bucket "avatars" de Supabase Storage con ruta fija y cache-buster en la URL
// para garantizar que el navegador siempre muestre la versión más reciente.
import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { storageService } from '../services/storageService'
import { useAuthContext }  from '../context/AuthContext'

export function AvatarUpload() {
    const { user }           = useAuthContext()
    const [url, setUrl]      = useState<string | null>(null)
    const [uploading, setUp] = useState(false)

    // Al montar: verifica si ya existe un avatar guardado antes de intentar mostrarlo
    // (evita errores 404 si el usuario aún no ha subido ninguna foto)
    useEffect(() => {
        if (!user) return
        storageService.avatars.exists(user.id).then(tiene => {
            if (tiene) setUrl(storageService.avatars.getPublicUrl(user.id))
        })
    }, [user])

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        // Validaciones en el cliente para dar feedback rápido sin consumir ancho de banda
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
            return alert('Solo JPG, PNG o WebP')
        if (file.size > 2 * 1024 * 1024)
            return alert('Máximo 2 MB')

        setUp(true)
        try {
            // upsert:true → sobrescribe el archivo existente en la misma ruta fija
            const { error } = await storageService.avatars.upload(user.id, file)
            if (error) { alert(error.message); return }
            // Actualiza la URL con un nuevo timestamp para invalidar la caché del navegador
            setUrl(storageService.avatars.getPublicUrl(user.id))
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Error inesperado al subir')
        } finally { setUp(false) }
    }

    return (
        <div className="avatar-upload">
            <div className="avatar-preview">
                {url
                    ? <img src={url} alt="Avatar" className="avatar-img" />
                    : <div className="avatar-placeholder">{uploading ? '...' : '👤'}</div>
                }
            </div>
            <label className={`avatar-label${uploading ? ' avatar-label--disabled' : ''}`}>
                {uploading ? 'Subiendo...' : 'Cambiar foto'}
                <input
                    type="file" accept="image/*"
                    onChange={handleChange} disabled={uploading}
                    className="avatar-input-hidden"
                />
            </label>
            <p className="avatar-hint">JPG, PNG o WebP · máx. 2 MB</p>
        </div>
    )
}
