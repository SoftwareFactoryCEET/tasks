# SENA — Gestión de Tareas

> Aplicación web completa construida con **React + TypeScript + Vite + Supabase**: autenticación, CRUD de tareas, dashboard con estadísticas y subida de avatar al Storage de Supabase.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Demo de la Aplicación](#demo-de-la-aplicación)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Estructura de Archivos](#estructura-de-archivos)
- [Modelo de Datos](#modelo-de-datos)
- [Flujos Principales](#flujos-principales)
- [Funcionalidades](#funcionalidades)
- [Instalación y Configuración](#instalación-y-configuración)
- [Configuración de Supabase](#configuración-de-supabase)
- [Scripts Disponibles](#scripts-disponibles)
- [Documentación de Capas](#documentación-de-capas)
- [Convenciones y Buenas Prácticas](#convenciones-y-buenas-prácticas)
- [Paleta de Colores SENA](#paleta-de-colores-sena)

---

## Descripción General

**SENA Gestión de Tareas** es una aplicación full-stack que cubre el ciclo completo de desarrollo con Supabase:

- **Autenticación** con email/contraseña (Supabase Auth)
- **CRUD de tareas** sobre PostgreSQL con tipos generados automáticamente
- **Rutas protegidas** con redirección según sesión activa
- **Dashboard** con estadísticas y barra de progreso
- **Avatar upload** al bucket de Supabase Storage con RLS

### Objetivos del Taller

- Integrar un cliente Supabase tipado con TypeScript end-to-end
- Implementar autenticación completa (registro, login, sesión persistente)
- Gestionar rutas públicas y protegidas con React Router
- Operar Supabase Storage con políticas RLS correctas
- Aplicar arquitectura limpia por capas en una SPA real

---

## Demo de la Aplicación

### Pantalla de Login / Registro

```
┌────────────────────────────────────┐
│           [ SENA ]                 │
│      Iniciar sesión                │
│      Gestión de Tareas             │
│                                    │
│  Correo electrónico                │
│  [tu@correo.com____________]       │
│  Contraseña                        │
│  [••••••••__________________]      │
│                                    │
│  [        Entrar           ]       │
│                                    │
│  ¿No tienes cuenta?                │
│  Regístrate aquí                   │
└────────────────────────────────────┘
```

### Barra de Navegación (rutas protegidas)

```
┌─────────────────────────────────────────────────────────────┐
│ [SENA] Gestión de Tareas   Mis tareas  Dashboard            │
│                             usuario@email.com  [Cerrar sesión]│
└─────────────────────────────────────────────────────────────┘
```

### Home — Mis Tareas

```
┌─────────────────────────────────────────────────────────────┐
│  Nueva tarea                                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Título *  [________________________________]         │  │
│  │  Descripción (opcional)                               │  │
│  │  [________________________________]                   │  │
│  │                          [ + Agregar tarea ]          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Mis tareas                          2 / 3 completadas      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ☑  ~~Revisar documentación~~                  [🗑]    │  │
│  │ ☑  ~~Instalar dependencias~~                  [🗑]    │  │
│  │ ☐  Conectar Supabase Storage                  [🗑]    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  [ 👤 ]  Bienvenido, usuario@email.com                      │
│  [Cambiar foto]   Aquí tienes un resumen...                 │
├──────────┬──────────┬──────────┬──────────────────────────┤
│  Total   │Completad.│Pendientes│  Progreso                 │
│    3     │    2     │    1     │    67%                    │
├──────────┴──────────┴──────────┴──────────────────────────┤
│  Progreso general                                           │
│  ████████████████████████░░░░░░░░░░  67%                   │
│  2 de 3 tareas completadas                                  │
├─────────────────────────────────────────────────────────────┤
│  [         Ir a mis tareas          ]                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| UI Library | React | 19.2.0 |
| Lenguaje | TypeScript | ~5.9.3 |
| Build Tool | Vite | 7.3.1 |
| Backend / DB / Auth / Storage | Supabase JS | 2.99.0 |
| Base de Datos | PostgreSQL | 14.1 |
| Routing | React Router DOM | 7.13.1 |
| Gráficos | Recharts | 3.8.0 |
| Linting | ESLint | 9.39.1 |

---

## Arquitectura del Proyecto

El proyecto implementa una **arquitectura limpia en capas** donde cada capa tiene una única responsabilidad:

```
┌──────────────────────────────────────────────────────────────┐
│                        BROWSER / UI                          │
├──────────────────────────────────────────────────────────────┤
│  Pages (Contenedores de Página)                              │
│  ├── Login.tsx       ←  Formulario de acceso                 │
│  ├── Register.tsx    ←  Formulario de registro               │
│  ├── Home.tsx        ←  Lista y gestión de tareas            │
│  └── Dashboard.tsx   ←  Estadísticas + avatar               │
├──────────────────────────────────────────────────────────────┤
│  Components (UI Reutilizable)                                │
│  ├── NavBar.tsx       ←  Barra de navegación con logout      │
│  ├── PrivateRoute.tsx ←  Guard de rutas autenticadas         │
│  ├── TaskForm.tsx     ←  Formulario de nueva tarea           │
│  ├── TaskItem.tsx     ←  Ítem de tarea (toggle + eliminar)   │
│  └── AvatarUpload.tsx ←  Subida de foto al Storage           │
├──────────────────────────────────────────────────────────────┤
│  Context (Estado Global)                                     │
│  └── AuthContext.tsx  ←  Proveedor de sesión de usuario      │
├──────────────────────────────────────────────────────────────┤
│  Hooks (Estado + Lógica de Negocio)                          │
│  ├── useAuth.ts       ←  Sesión, signIn, signUp, signOut     │
│  └── useTasks.ts      ←  CRUD de tareas con estado local     │
├──────────────────────────────────────────────────────────────┤
│  Services (Capa de API — nunca importados desde UI)          │
│  ├── authService.ts    ←  Supabase Auth                      │
│  ├── taskService.ts    ←  Supabase DB (tabla Tareas)         │
│  └── storageService.ts ←  Supabase Storage (avatars)        │
├──────────────────────────────────────────────────────────────┤
│  Lib (Infraestructura)                                       │
│  └── supabaseClient.ts ←  Singleton tipado del cliente       │
├──────────────────────────────────────────────────────────────┤
│  Types                                                       │
│  └── database.ts      ←  Tipos generados por Supabase CLI    │
├──────────────────────────────────────────────────────────────┤
│              SUPABASE (Auth · PostgreSQL · Storage)          │
└──────────────────────────────────────────────────────────────┘
```

**Flujo de dependencias (unidireccional):**
```
Pages → Components → Context/Hooks → Services → supabaseClient → Supabase
```

### Flujo de Rutas

```
/login      ──→  Login.tsx        (pública)
/register   ──→  Register.tsx     (pública)
                      │
              PrivateRoute (guard)
              ┌────────────────┐
              │  NavBar        │
              │  <Outlet />    │
              └───────┬────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
/   →  Home.tsx            /dashboard → Dashboard.tsx
```

---

## Estructura de Archivos

```
taller-supabase/
│
├── .env                            # Variables de entorno (VITE_SUPABASE_*)
├── .gitignore
├── index.html                      # Punto de entrada HTML
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
│
└── src/
    ├── main.tsx                    # ReactDOM.createRoot
    ├── App.tsx                     # ★ Router + AuthProvider + rutas
    ├── App.css                     # Todos los estilos (navbar, auth, dashboard, avatar)
    ├── index.css                   # Variables CSS, reset, base
    │
    ├── types/
    │   └── database.ts             # ★ Tipos generados por Supabase CLI
    │
    ├── lib/
    │   └── supabaseClient.ts       # ★ Singleton createClient<Database>
    │
    ├── services/
    │   ├── authService.ts          # ★ signIn, signUp, signOut, onAuthStateChange
    │   ├── taskService.ts          # ★ getAll, create, update, delete, search
    │   └── storageService.ts       # ★ avatars.upload / getPublicUrlFromPath
    │
    ├── context/
    │   └── AuthContext.tsx         # ★ AuthProvider + useAuthContext
    │
    ├── hooks/
    │   ├── useAuth.ts              # ★ Estado de sesión + métodos auth
    │   └── useTasks.ts             # ★ Estado de tareas + CRUD
    │
    ├── components/
    │   ├── NavBar.tsx              # ★ Barra superior con links y logout
    │   ├── PrivateRoute.tsx        # ★ Guard: redirige a /login si no hay sesión
    │   ├── AvatarUpload.tsx        # ★ Input de imagen + upload a Storage
    │   ├── TaskForm.tsx            # Formulario controlado de nueva tarea
    │   └── TaskItem.tsx            # Ítem con checkbox y botón eliminar
    │
    └── pages/
        ├── Login.tsx               # ★ Formulario de inicio de sesión
        ├── Register.tsx            # ★ Formulario de registro con validación
        ├── Home.tsx                # ★ Lista de tareas
        └── Dashboard.tsx           # ★ Estadísticas + AvatarUpload
```

> Los archivos marcados con ★ son los archivos clave del taller.

---

## Modelo de Datos

### Tabla `Tareas` en PostgreSQL

```sql
CREATE TABLE "Tareas" (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT        NOT NULL,
  descripcion TEXT,
  completada  BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  user_id     UUID        REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE "Tareas" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso público a tareas"
  ON "Tareas" FOR ALL
  USING (true) WITH CHECK (true);
```

### Bucket `avatars` en Supabase Storage

```
avatars/
└── {user_id}/
    └── avatar.{ext}       ← un archivo por usuario, upsert: true
```

**Las 4 políticas RLS necesarias** para que `upsert: true` funcione:

```sql
-- 1. SELECT — detectar si el archivo ya existe
CREATE POLICY "Usuarios pueden ver objetos en avatars"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');

-- 2. INSERT — subir archivo nuevo
CREATE POLICY "Usuarios pueden subir su avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND name LIKE (auth.uid()::text || '/%')
);

-- 3. UPDATE — actualizar metadata
CREATE POLICY "Usuarios pueden actualizar su avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars'
  AND name LIKE (auth.uid()::text || '/%')
);

-- 4. DELETE — reemplazar el archivo anterior
CREATE POLICY "Usuarios pueden eliminar su avatar"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars'
  AND name LIKE (auth.uid()::text || '/%')
);
```

> **Por qué 4 políticas:** `upsert: true` ejecuta internamente SELECT → DELETE → INSERT. Sin las 4, la operación falla con *"new row violates row-level security policy"*.

### Tipos TypeScript (`src/types/database.ts`)

```typescript
type Tarea       = Tables<'Tareas'>          // fila completa
type TareaInsert = TablesInsert<'Tareas'>     // para INSERT
type TareaUpdate = TablesUpdate<'Tareas'>     // para UPDATE (todo opcional)
```

---

## Flujos Principales

### Autenticación

```
Usuario abre /login
       │
       ▼
Login.tsx → signIn(email, password)
       │
       ▼
useAuth.ts → authService.signIn()
       │
       ▼
supabase.auth.signInWithPassword()
       │
       ▼ (JWT almacenado en localStorage)
onAuthStateChange dispara → setUser(session.user)
       │
       ▼
PrivateRoute detecta user !== null → renderiza <Outlet />
       │
       ▼
navigate('/') → Home.tsx
```

### Subida de Avatar

```
Usuario selecciona imagen en AvatarUpload
       │
       ▼ validar tipo (jpg/png/webp) y tamaño (≤ 2 MB)
       │
       ▼
storageService.avatars.upload(user.id, file)
       │  path: `{userId}/avatar.{ext}`, upsert: true
       ▼
Supabase Storage: SELECT → DELETE → INSERT
(requiere las 4 políticas RLS)
       │
       ▼ { data.path, error }
       │
       ▼ si error → throw → alert
       │
       ▼
storageService.avatars.getPublicUrlFromPath(data.path)
+ `?t=${Date.now()}`  ← cache-buster
       │
       ▼
setUrl(url) → <img src={url} /> se actualiza
```

### Crear Tarea

```
TaskForm → onCrear(titulo, descripcion)
       │
       ▼
useTasks.crearTarea() → taskService.create()
       │
       ▼
supabase.from('Tareas').insert(tarea).select().single()
       │
       ▼
setTareas(prev => [data, ...prev])   ← actualización optimista
```

---

## Funcionalidades

### Autenticación

| Funcionalidad | Archivo |
|---|---|
| Registro con email y contraseña | `Register.tsx`, `authService.ts` |
| Login y redirección automática | `Login.tsx`, `useAuth.ts` |
| Sesión persistente (localStorage) | `supabaseClient.ts` |
| Cierre de sesión desde NavBar | `NavBar.tsx`, `authService.ts` |
| Guard de rutas protegidas | `PrivateRoute.tsx`, `AuthContext.tsx` |

### Gestión de Tareas

| Funcionalidad | Archivo |
|---|---|
| Listar tareas (más recientes primero) | `Home.tsx`, `useTasks.ts` |
| Crear tarea (título requerido + descripción) | `TaskForm.tsx` |
| Marcar como completada / pendiente | `TaskItem.tsx` |
| Eliminar con confirmación | `TaskItem.tsx` |
| Contador de progreso en tiempo real | `Home.tsx` |

### Dashboard y Perfil

| Funcionalidad | Archivo |
|---|---|
| Estadísticas: total, completadas, pendientes, % | `Dashboard.tsx` |
| Barra de progreso animada | `Dashboard.tsx` |
| Subida y visualización de avatar | `AvatarUpload.tsx`, `storageService.ts` |

### Métodos disponibles en servicios

```typescript
// taskService
taskService.getAll()                     // todas las tareas
taskService.getById(id)                  // por UUID
taskService.getByStatus(completada)      // filtrar por estado
taskService.search(texto)                // búsqueda case-insensitive
taskService.create(tarea)               // nueva tarea
taskService.update(id, cambios)          // actualizar campos
taskService.toggleCompletada(id, estado) // invertir completada
taskService.delete(id)                   // eliminar por ID
taskService.deleteCompleted()            // eliminar todas las completadas

// authService
authService.getSession()                 // sesión actual
authService.signUp(email, password)      // registro
authService.signIn(email, password)      // login
authService.signInWithProvider(provider) // OAuth (Google, GitHub...)
authService.signInWithMagicLink(email)   // login sin contraseña
authService.signOut()                    // cerrar sesión
authService.updatePassword(newPassword)  // cambiar contraseña
authService.onAuthStateChange(callback)  // escuchar cambios de sesión

// storageService
storageService.avatars.upload(userId, file)           // subir avatar
storageService.avatars.getPublicUrl(userId, ext)      // URL pública
storageService.avatars.getPublicUrlFromPath(path)     // URL desde path real
storageService.avatars.delete(userId, ext)            // eliminar avatar
storageService.archivos.upload(tareaId, file)         // adjunto de tarea
storageService.archivos.list(tareaId)                 // listar adjuntos
storageService.archivos.getSignedUrl(path, expiresIn) // URL firmada
storageService.archivos.delete(path)                  // eliminar adjunto
```

---

## Instalación y Configuración

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Cuenta en [supabase.com](https://supabase.com) (gratuita)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd taller-supabase

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales del proyecto Supabase

# 4. Iniciar servidor de desarrollo
npm run dev
```

Disponible en `http://localhost:5173`

---

## Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ir a [app.supabase.com](https://app.supabase.com)
2. Nuevo proyecto → anotar **URL** y **anon key**

### 2. Variables de entorno

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> El prefijo `VITE_` es obligatorio para que Vite exponga la variable al cliente. Nunca uses la `service_role` key en el frontend.

### 3. Crear tabla `Tareas`

```sql
CREATE TABLE "Tareas" (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT        NOT NULL,
  descripcion TEXT,
  completada  BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  user_id     UUID        REFERENCES auth.users(id)
);

ALTER TABLE "Tareas" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso público a tareas"
  ON "Tareas" FOR ALL
  USING (true) WITH CHECK (true);
```

### 4. Crear bucket `avatars`

1. Supabase → **Storage → New bucket**
2. Nombre: `avatars` · marcar **Public bucket**
3. Ejecutar en SQL Editor:

```sql
CREATE POLICY "Usuarios pueden ver objetos en avatars"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Usuarios pueden subir su avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND name LIKE (auth.uid()::text || '/%'));

CREATE POLICY "Usuarios pueden actualizar su avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND name LIKE (auth.uid()::text || '/%'));

CREATE POLICY "Usuarios pueden eliminar su avatar"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND name LIKE (auth.uid()::text || '/%'));
```

### 5. Activar Auth por Email

Supabase → **Authentication → Providers → Email** → habilitado por defecto.

---

## Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo HMR en localhost:5173
npm run build     # Compilar TypeScript + bundle de producción (dist/)
npm run preview   # Previsualizar la build de producción
npm run lint      # Analizar código con ESLint
```

---

## Documentación de Capas

### `src/lib/supabaseClient.ts` — Singleton

```typescript
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

Una sola instancia tipada con el esquema de la BD. Todos los servicios la importan.

---

### `src/context/AuthContext.tsx` — Proveedor de Auth

```typescript
// El tipo se infiere del hook — siempre sincronizado automáticamente
type AuthContextType = ReturnType<typeof useAuth>

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth()
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>')
    return ctx
}
```

---

### `src/hooks/useAuth.ts` — Estado de Sesión

```typescript
export function useAuth() {
    const [user, setUser]     = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Recuperar sesión guardada en localStorage
        authService.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })
        // Escuchar login/logout/token refresh en tiempo real
        const { data: { subscription } } = authService.onAuthStateChange(
            async (_event, session) => setUser(session?.user ?? null)
        )
        return () => subscription.unsubscribe()
    }, [])

    return { user, loading, signUp, signIn, signOut }
}
```

---

### `src/components/PrivateRoute.tsx` — Guard de Rutas

```typescript
export function PrivateRoute() {
    const { user, loading } = useAuthContext()
    if (loading) return <div className="estado-cargando">Cargando...</div>
    if (!user)   return <Navigate to='/login' replace />
    return (
        <>
            <NavBar />
            <main className="app-main"><Outlet /></main>
        </>
    )
}
```

---

### `src/components/AvatarUpload.tsx` — Subida de Imagen

Puntos clave de implementación:

```typescript
const { data, error } = await storageService.avatars.upload(user.id, file)
if (error) throw error   // Supabase NO lanza excepciones — hay que verificar

// Usar data.path (ruta real confirmada) + cache-buster para forzar recarga
const base = storageService.avatars.getPublicUrlFromPath(data.path)
setUrl(`${base}?t=${Date.now()}`)
```

> **Errores comunes:**
> - Sin `if (error) throw error` → el upload falla silenciosamente y `setUrl` recibe una URL que apunta a un archivo inexistente.
> - Sin `?t=Date.now()` → el navegador sirve la imagen anterior desde caché (CDN con `cacheControl: '3600'`).

---

## Convenciones y Buenas Prácticas

### Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `TaskForm`, `NavBar`, `AvatarUpload` |
| Hooks | `use` + camelCase | `useTasks`, `useAuth` |
| Servicios | camelCase + `Service` | `taskService`, `authService` |
| Tipos | PascalCase | `Tarea`, `TareaInsert` |
| Archivos de componentes | `PascalCase.tsx` | `TaskItem.tsx` |
| Archivos de hooks/servicios | `camelCase.ts` | `useTasks.ts` |

### Patrones Aplicados

| Patrón | Dónde |
|---|---|
| **Singleton** | `supabaseClient.ts` — una sola conexión |
| **Context + Custom Hook** | `AuthContext` + `useAuth` — estado global de sesión |
| **Service Layer** | `*Service.ts` — los componentes nunca llaman a `supabase` directamente |
| **Guard / Protected Route** | `PrivateRoute.tsx` — redirige si no hay sesión |
| **Optimistic Update** | `useTasks.ts` — estado local actualiza antes de confirmar la API |
| **Cache Busting** | `AvatarUpload.tsx` — `?t=timestamp` en URL de Storage |

### TypeScript Strict

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

Todos los `catch` usan `err: unknown` con `instanceof Error` — sin `any`.

---

## Paleta de Colores SENA

```css
:root {
  --sena-green:        #39A900;   /* Verde SENA principal */
  --sena-dark-green:   #007A33;   /* Verde oscuro — hover, navbar */
  --sena-light-green:  #E8F5E0;   /* Verde claro — fondos, badges */
  --sena-white:        #FFFFFF;
  --sena-gray-bg:      #F4F7F4;   /* Fondo de página */
  --sena-gray-border:  #C8DEC8;   /* Bordes de inputs y tarjetas */
  --sena-text:         #1B2E1B;   /* Texto principal */
  --sena-text-muted:   #5A7A5A;   /* Texto secundario */
  --sena-danger:       #D32F2F;   /* Rojo — eliminar, errores */
  --sena-danger-hover: #B71C1C;
}
```

---

## Recursos de Aprendizaje

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Storage — RLS](https://supabase.com/docs/guides/storage/security/access-control)
- [Supabase Auth — Email](https://supabase.com/docs/guides/auth/auth-email)
- [React Router v7](https://reactrouter.com/start/library/routing)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## Licencia

Proyecto de uso educativo — SENA, Colombia.

---

*Taller de integración React + Supabase: Auth · PostgreSQL · Storage · RLS.*