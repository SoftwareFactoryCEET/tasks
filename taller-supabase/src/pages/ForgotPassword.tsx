// src/pages/ForgotPassword.tsx
// Flujo de recuperación de contraseña — paso 1 de 2.
// El usuario ingresa su email y Supabase envía un enlace mágico a /reset-password.
// Tras el envío exitoso, muestra una pantalla de confirmación en lugar del formulario.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService'

export function ForgotPassword() {
    const [email,   setEmail]   = useState('')
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState('')
    const [enviado, setEnviado] = useState(false)  // controla el cambio de vista formulario → confirmación

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            const { error } = await authService.resetPasswordForEmail(email)
            if (error) throw error
            setEnviado(true)  // cambia la vista al mensaje de éxito
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al enviar el correo')
        } finally { setLoading(false) }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">SENA</span>
                    <h1 className="auth-title">Recuperar contraseña</h1>
                    <p className="auth-subtitle">Te enviaremos un enlace a tu correo</p>
                </div>

                {enviado ? (
                    <div style={{ textAlign:'center', padding:'1rem 0' }}>
                        <p style={{ fontSize:'2.5rem', margin:'0 0 0.75rem' }}>📬</p>
                        <p style={{ fontWeight:600, marginBottom:'0.5rem' }}>
                            ¡Correo enviado!
                        </p>
                        <p style={{ color:'#64748b', fontSize:'0.9rem', marginBottom:'1.5rem' }}>
                            Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.
                        </p>
                        <Link to="/login" className="btn-primary btn-block">
                            Volver al inicio de sesión
                        </Link>
                    </div>
                ) : (
                    <>
                        {error && <p className="form-error">{error}</p>}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Correo electrónico</label>
                                <input
                                    id="email" type="email" placeholder="tu@correo.com"
                                    value={email} onChange={e => setEmail(e.target.value)} required
                                />
                            </div>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar enlace'}
                            </button>
                        </form>

                        <p className="auth-footer">
                            <Link to="/login">Volver al inicio de sesión</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}
