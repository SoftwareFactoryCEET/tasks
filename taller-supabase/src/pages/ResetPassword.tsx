// src/pages/ResetPassword.tsx
// Flujo de recuperación de contraseña — paso 2 de 2.
// El usuario llega aquí desde el enlace del email (redirectTo configurado en authService).
// Supabase procesa el token del URL y emite el evento PASSWORD_RECOVERY en onAuthStateChange.
// Solo cuando ese evento llega se muestra el formulario; antes se muestra un estado de espera.
// Tras actualizar la contraseña, redirige al login automáticamente después de 3 segundos.
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase }    from '../lib/supabaseClient'
import { authService } from '../services/authService'

export function ResetPassword() {
    const navigate = useNavigate()
    const [listo,    setListo]    = useState(false)   // true cuando Supabase confirma el token de recovery
    const [password, setPassword] = useState('')
    const [confirm,  setConfirm]  = useState('')
    const [loading,  setLoading]  = useState(false)
    const [error,    setError]    = useState('')
    const [exito,    setExito]    = useState(false)   // true tras actualizar contraseña exitosamente

    // Escucha el evento PASSWORD_RECOVERY que Supabase emite al procesar el token del URL
    // Mientras no llegue, se muestra "Verificando enlace de recuperación..."
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') setListo(true)
        })
        return () => subscription.unsubscribe()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
        if (password.length < 6)  { setError('La contraseña debe tener al menos 6 caracteres'); return }
        setError(''); setLoading(true)
        try {
            const { error } = await authService.updatePassword(password)
            if (error) throw error
            setExito(true)
            setTimeout(() => navigate('/login'), 3000)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al actualizar la contraseña')
        } finally { setLoading(false) }
    }

    if (!listo) return (
        <div className="auth-wrapper">
            <div className="auth-card" style={{ textAlign:'center' }}>
                <span className="auth-logo">SENA</span>
                <p style={{ marginTop:'1.5rem', color:'#64748b' }}>
                    Verificando enlace de recuperación...
                </p>
            </div>
        </div>
    )

    if (exito) return (
        <div className="auth-wrapper">
            <div className="auth-card" style={{ textAlign:'center' }}>
                <span className="auth-logo">SENA</span>
                <p style={{ fontSize:'2.5rem', margin:'1rem 0 0.5rem' }}>✅</p>
                <p style={{ fontWeight:600 }}>¡Contraseña actualizada!</p>
                <p style={{ color:'#64748b', fontSize:'0.9rem' }}>
                    Redirigiendo al inicio de sesión...
                </p>
            </div>
        </div>
    )

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">SENA</span>
                    <h1 className="auth-title">Nueva contraseña</h1>
                    <p className="auth-subtitle">Elige una contraseña segura</p>
                </div>

                {error && <p className="form-error">{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">Nueva contraseña</label>
                        <input
                            id="password" type="password" placeholder="Mínimo 6 caracteres"
                            value={password} onChange={e => setPassword(e.target.value)} required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm">Confirmar contraseña</label>
                        <input
                            id="confirm" type="password" placeholder="Repite la contraseña"
                            value={confirm} onChange={e => setConfirm(e.target.value)} required
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar contraseña'}
                    </button>
                </form>
            </div>
        </div>
    )
}
