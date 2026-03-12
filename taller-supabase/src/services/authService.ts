// src/services/authService.ts
// Capa de acceso a la autenticación de Supabase.
// Centraliza todas las operaciones de auth para que los hooks no llamen directamente a supabase.auth.
import { supabase } from '../lib/supabaseClient'

export const authService = {

    // Obtiene la sesión activa al iniciar la app (persiste en localStorage)
    getSession: () =>
        supabase.auth.getSession(),

    getUser: () =>
        supabase.auth.getUser(),

    // Registro de nuevo usuario con email y contraseña
    signUp: (email: string, password: string) =>
        supabase.auth.signUp({ email, password }),

    // Login con email y contraseña
    signIn: (email: string, password: string) =>
        supabase.auth.signInWithPassword({ email, password }),

    // Login con proveedor OAuth: Google, GitHub, Discord...
    // Redirige al origen de la app tras autenticar
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

    // Envía un email con enlace de recuperación.
    // redirectTo apunta a /reset-password para que Supabase emita el evento PASSWORD_RECOVERY
    resetPasswordForEmail: (email: string) =>
        supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        }),

    // Actualiza la contraseña del usuario autenticado (usada en ResetPassword.tsx)
    updatePassword: (newPassword: string) =>
        supabase.auth.updateUser({ password: newPassword }),

    // Suscripción a cambios de sesión: LOGIN, LOGOUT, TOKEN_REFRESHED, PASSWORD_RECOVERY, etc.
    onAuthStateChange: (
        callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
    ) => supabase.auth.onAuthStateChange(callback),
}
