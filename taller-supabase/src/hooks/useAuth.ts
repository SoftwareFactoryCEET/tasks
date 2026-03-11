// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { authService } from '../services/authService'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
    const [user,    setUser]    = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Obtener sesión actual al cargar la app
        authService.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Escuchar cambios de sesión (login, logout, refresh de token)
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
