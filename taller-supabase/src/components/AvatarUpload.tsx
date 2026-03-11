// src/components/AvatarUpload.tsx
import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { storageService } from '../services/storageService'
import { useAuthContext }  from '../context/AuthContext'

export function AvatarUpload() {
    const { user }           = useAuthContext()
    const [url, setUrl]      = useState<string | null>(null)
    const [uploading, setUp] = useState(false)

    // Restaurar el avatar más reciente al montar el componente
    useEffect(() => {
        if (!user) return
        storageService.avatars.list(user.id).then(({ data }) => {
            if (!data?.length) return
            // El nombre incluye el timestamp → ordenar por nombre desc = más reciente primero
            const latest = [...data].sort((a, b) => b.name.localeCompare(a.name))[0]
            const path = `${user.id}/${latest.name}`
            setUrl(storageService.avatars.getPublicUrlFromPath(path))
        })
    }, [user])

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
            return alert('Solo JPG, PNG o WebP')
        if (file.size > 2 * 1024 * 1024)
            return alert('Máximo 2 MB')

        setUp(true)
        try {
            // Borrar avatares anteriores para no acumular archivos en el bucket
            await storageService.avatars.deleteAll(user.id)
            const { data, error } = await storageService.avatars.upload(user.id, file)
            if (error) { alert(error.message); return }
            // URL única por nombre → el CDN nunca la ha servido antes
            setUrl(storageService.avatars.getPublicUrlFromPath(data.path))
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
