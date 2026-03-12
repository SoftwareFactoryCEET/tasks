// src/pages/Register.tsx
// Página de registro de nueva cuenta.
// Valida en el cliente que las contraseñas coincidan y tengan al menos 6 caracteres
// antes de llamar a Supabase, para dar feedback inmediato sin consumir el límite de solicitudes.
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function Register() {
    const { signUp }  = useAuthContext()
    const navigate    = useNavigate()
    const [email,    setEmail]    = useState('')
    const [password, setPassword] = useState('')
    const [confirm,  setConfirm]  = useState('')  // segundo campo para confirmar la contraseña
    const [error,    setError]    = useState('')
    const [loading,  setLoading]  = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Validaciones previas al envío — evitan llamadas innecesarias a la API
        if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
        if (password.length < 6)  { setError('La contraseña debe tener al menos 6 caracteres'); return }
        setError(''); setLoading(true)
        try {
            await signUp(email, password)
            navigate('/')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al registrarse')
        } finally { setLoading(false) }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">SENA</span>
                    <h1 className="auth-title">Crear cuenta</h1>
                    <p className="auth-subtitle">Gestión de Tareas</p>
                </div>

                {error && <p className="form-error">{error}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email" type="email" placeholder="tu@correo.com"
                            value={email} onChange={e => setEmail(e.target.value)} required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
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
                        {loading ? 'Registrando...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className="auth-footer">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </div>
        </div>
    )
}
