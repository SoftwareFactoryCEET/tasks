// src/services/authService.ts
import { supabase } from '../lib/supabaseClient'

export const authService = {

    getSession: () =>
        supabase.auth.getSession(),

    getUser: () =>
        supabase.auth.getUser(),

    signUp: (email: string, password: string) =>
        supabase.auth.signUp({ email, password }),

    signIn: (email: string, password: string) =>
        supabase.auth.signInWithPassword({ email, password }),

    // Login con proveedor OAuth: Google, GitHub, Discord...
    signInWithProvider: (provider: 'google' | 'github' | 'discord') =>
        supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.origin }
        }),

    // Magic Link: login sin contraseña, solo con email
    signInWithMagicLink: (email: string) =>
        supabase.auth.signInWithOtp({ email }),

    signOut: () =>
        supabase.auth.signOut(),

    updatePassword: (newPassword: string) =>
        supabase.auth.updateUser({ password: newPassword }),

    onAuthStateChange: (
        callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
    ) => supabase.auth.onAuthStateChange(callback),
}
