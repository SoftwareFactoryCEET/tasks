// src/App.tsx
// Punto de entrada de la aplicación. Define el árbol de rutas y proveedores globales.
//
// Estructura de rutas:
//   Públicas  → accesibles sin sesión (login, registro, recuperación de contraseña)
//   Protegidas → envueltas en <PrivateRoute>, redirigen a /login si no hay sesión activa
//
// AuthProvider envuelve todo el árbol para que cualquier componente pueda acceder
// al estado de autenticación mediante useAuthContext().
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import { PrivateRoute }  from './components/PrivateRoute'
import { Home }           from './pages/Home'
import { Login }          from './pages/Login'
import { Register }       from './pages/Register'
import { Dashboard }      from './pages/Dashboard'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword }  from './pages/ResetPassword'

function App() {
    return (
        // AuthProvider debe estar fuera de BrowserRouter para que los hooks de auth
        // estén disponibles en los guards de ruta (PrivateRoute)
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Rutas públicas — no requieren sesión */}
                    <Route path='/login'           element={<Login />} />
                    <Route path='/register'        element={<Register />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path='/reset-password'  element={<ResetPassword />} />

                    {/* Rutas protegidas — PrivateRoute verifica sesión y renderiza NavBar + Outlet */}
                    <Route element={<PrivateRoute />}>
                        <Route path='/'          element={<Home />} />
                        <Route path='/dashboard' element={<Dashboard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
