// src/context/AuthContext.tsx
/* eslint-disable react-refresh/only-export-components */
// Patrón Context + Hook: expone el estado de autenticación a toda la app
// sin necesidad de "prop drilling". AuthProvider envuelve la app en App.tsx.
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

// El tipo del contexto se infiere directamente del hook useAuth para evitar duplicación
type AuthContextType = ReturnType<typeof useAuth>

// Valor inicial undefined — useAuthContext lanza error si se usa fuera del Provider
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Proveedor: instancia useAuth una sola vez y comparte su estado con todos los hijos
export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth()
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// Hook de acceso seguro al contexto — lanza error descriptivo si se usa fuera del árbol correcto
export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>')
    return ctx
}
