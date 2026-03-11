// src/App.tsx
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import { PrivateRoute }  from './components/PrivateRoute'
import { Home }          from './pages/Home'
import { Login }         from './pages/Login'
import { Register }      from './pages/Register'
import { Dashboard }     from './pages/Dashboard'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path='/login'    element={<Login />} />
                    <Route path='/register' element={<Register />} />

                    {/* Rutas protegidas — requieren sesión activa */}
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
