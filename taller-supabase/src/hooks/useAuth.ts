// src/hooks/useAuth.ts
// Hook que gestiona el ciclo de vida de la sesión del usuario.
// Es consumido por AuthContext para compartir el estado globalmente.
import { useState, useEffect } from 'react'
import { authService } from '../services/authService'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
    const [user,    setUser]    = useState<User | null>(null)
    const [loading, setLoading] = useState(true)  // true hasta que se verifique la sesión inicial

    useEffect(() => {
        // Al montar: recupera la sesión persistida en localStorage (si el usuario ya había iniciado sesión)
        authService.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Suscripción reactiva: actualiza el usuario ante login, logout, refresh de token, etc.
        // El cleanup cancela la suscripción al desmontar para evitar memory leaks
        const { data: { subscription } } = authService.onAuthStateChange(
            async (_event, session) => setUser(session?.user ?? null)
        )
        return () => subscription.unsubscribe()
    }, [])

    const signUp = async (email: string, password: string) => {
        const { data, error } = await authService.signUp(email, password)
        if (error) throw error
        return data
    }
    const signIn = async (email: string, password: string) => {
        const { data, error } = await authService.signIn(email, password)
        if (error) throw error
        return data
    }
    const signOut = async () => {
        const { error } = await authService.signOut()
        if (error) throw error
    }

    return { user, loading, signUp, signIn, signOut }
}
