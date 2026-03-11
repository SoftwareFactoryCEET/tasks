// src/pages/Login.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export function Login() {
    const { signIn }   = useAuthContext()
    const navigate     = useNavigate()
    const [email,    setEmail]    = useState('')
    const [password, setPassword] = useState('')
    const [error,    setError]    = useState('')
    const [loading,  setLoading]  = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(''); setLoading(true)
        try {
            await signIn(email, password)
            navigate('/')
        } catch (err: any) {
            setError(err.message || 'Credenciales incorrectas')
        } finally { setLoading(false) }
    }

    return (
        <div style={{ maxWidth:'400px', margin:'4rem auto', padding:'2rem' }}>
            <h1>Iniciar Sesión</h1>
            {error && <p style={{ color:'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type='email' placeholder='Email' value={email}
                       onChange={e => setEmail(e.target.value)} required />
                <input type='password' placeholder='Contraseña' value={password}
                       onChange={e => setPassword(e.target.value)} required />
                <button type='submit' disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            <p>¿No tienes cuenta? <Link to='/register'>Regístrate aquí</Link></p>
        </div>
    )
}
