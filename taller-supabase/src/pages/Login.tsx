// src/pages/Login.tsx
// Página de inicio de sesión con email y contraseña.
// Tras autenticarse exitosamente, redirige a la página principal (/).
// Incluye enlaces a registro y recuperación de contraseña.
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function Login() {
    const { signIn }  = useAuthContext()
    const navigate    = useNavigate()
    const [email,    setEmail]    = useState('')
    const [password, setPassword] = useState('')
    const [error,    setError]    = useState('')
    const [loading,  setLoading]  = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            await signIn(email, password)
            navigate('/')  // redirige al home tras login exitoso
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Credenciales incorrectas')
        } finally { setLoading(false) }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">SENA</span>
                    <h1 className="auth-title">Iniciar sesión</h1>
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
                            id="password" type="password" placeholder="••••••••"
                            value={password} onChange={e => setPassword(e.target.value)} required
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <p className="auth-footer">
                    <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                </p>
                <p className="auth-footer">
                    ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    )
}
