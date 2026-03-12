# SENA — Gestión de Tareas

> Aplicación web completa construida con **React + TypeScript + Vite + Supabase**: autenticación con recuperación de contraseña, CRUD de tareas en tiempo real con UI optimista, dashboard con gráficas interactivas, chat colaborativo con presencia, y subida de avatar al Storage de Supabase.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
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
- [Recursos de Aprendizaje](#recursos-de-aprendizaje)

---

## Descripción General

**SENA Gestión de Tareas** es una aplicación full-stack que cubre el ciclo completo de desarrollo con Supabase:

- **Autenticación** con email/contraseña, recuperación de contraseña vía email y sesión persistente
- **CRUD de tareas** en tiempo real con UI optimista y sincronización Realtime entre usuarios
- **Rutas protegidas** con redirección según sesión activa
- **Dashboard** con KPIs, gráfica de barras (actividad 7 días), gráfica de dona (distribución) y feed de actividad reciente — todo en tiempo real
- **Chat colaborativo** con mensajes públicos y privados, indicador de usuarios en línea y contador de mensajes no leídos
- **Avatar upload** al bucket de Supabase Storage con ruta fija, `upsert: true` y cache-busting de URL

### Objetivos del Taller

- Integrar un cliente Supabase tipado con TypeScript end-to-end
- Implementar autenticación completa (registro, login, sesión persistente, recuperación de contraseña)
- Gestionar rutas públicas y protegidas con React Router v7
- Aplicar Supabase Realtime: `postgres_changes`, `broadcast` y `presence` en un único canal
- Operar Supabase Storage con RLS y resolver problemas de caché de CDN
- Aplicar arquitectura limpia por capas con UI optimista en una SPA real

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| UI Library | React | 19.2.0 |
| Lenguaje | TypeScript | ~5.9.3 |
| Build Tool | Vite | 7.3.1 |
| Backend / DB / Auth / Storage / Realtime | Supabase JS | 2.99.0 |
| Base de Datos | PostgreSQL | 14.1 |
| Routing | React Router DOM | 7.13.1 |
| Gráficos | Recharts | 3.8.0 |
| Linting | ESLint | 9.39.1 |

---

## Arquitectura del Proyecto

El proyecto implementa una **arquitectura limpia en capas** donde cada capa tiene una única responsabilidad:

```
┌──────────────────────────────────────────────────────────────────┐
│                         BROWSER / UI                             │
├──────────────────────────────────────────────────────────────────┤
│  Pages (Contenedores de Página)                                  │
│  ├── Login.tsx          ← Formulario de acceso                   │
│  ├── Register.tsx       ← Formulario de registro                 │
│  ├── ForgotPassword.tsx ← Solicitud de recuperación de clave     │
│  ├── ResetPassword.tsx  ← Formulario nueva contraseña (post-link)│
│  ├── Home.tsx           ← Lista de tareas + chat                 │
│  └── Dashboard.tsx      ← KPIs + gráficas + avatar              │
├──────────────────────────────────────────────────────────────────┤
│  Components (UI Reutilizable)                                    │
│  ├── NavBar.tsx              ← Navegación con estado activo      │
│  ├── PrivateRoute.tsx        ← Guard de rutas autenticadas       │
│  ├── TaskForm.tsx            ← Formulario de nueva tarea         │
│  ├── TaskItem.tsx            ← Ítem con checkbox controlado      │
│  ├── AvatarUpload.tsx        ← Foto de perfil en Storage         │
│  ├── RealtimeIndicator.tsx   ← Pill verde/rojo de conexión       │
│  ├── Chat.tsx                ← Chat flotante público y privado   │
│  └── Dashboard/
│      ├── StatCard.tsx        ← Tarjeta KPI con color y valor     │
│      ├── TaskChart.tsx       ← BarChart últimos 7 días           │
│      ├── DonutChart.tsx      ← PieChart distribución completadas │
│      └── ActivityFeed.tsx    ← Feed de tareas recientes          │
├──────────────────────────────────────────────────────────────────┤
│  Context (Estado Global)                                         │
│  └── AuthContext.tsx    ← AuthProvider + useAuthContext          │
├──────────────────────────────────────────────────────────────────┤
│  Hooks (Estado + Lógica de Negocio)                              │
│  ├── useAuth.ts           ← Sesión, signIn, signUp, signOut      │
│  ├── useRealtimeTasks.ts  ← CRUD optimista + Realtime            │
│  ├── useDashboard.ts      ← Métricas en paralelo + Realtime      │
│  └── useRoom.ts           ← Presencia + Chat en un canal         │
├──────────────────────────────────────────────────────────────────┤
│  Services (Capa de API — los componentes no llaman a supabase)   │
│  ├── authService.ts      ← Auth: login, registro, recovery       │
│  ├── taskService.ts      ← CRUD tabla Tareas                     │
│  ├── dashboardService.ts ← Consultas de métricas (solo lectura)  │
│  └── storageService.ts   ← Avatars + adjuntos de tareas         │
├──────────────────────────────────────────────────────────────────┤
│  Lib (Infraestructura)                                           │
│  └── supabaseClient.ts  ← Singleton tipado del cliente           │
├──────────────────────────────────────────────────────────────────┤
│  Types                                                           │
│  └── database.ts        ← Tipos generados por Supabase CLI       │
├──────────────────────────────────────────────────────────────────┤
│        SUPABASE (Auth · PostgreSQL · Realtime · Storage)         │
└──────────────────────────────────────────────────────────────────┘
```

**Flujo de dependencias (unidireccional):**
```
Pages → Components → Context/Hooks → Services → supabaseClient → Supabase
```

### Flujo de Rutas

```
/login            ──→  Login.tsx           (pública)
/register         ──→  Register.tsx        (pública)
/forgot-password  ──→  ForgotPassword.tsx  (pública)
/reset-password   ──→  ResetPassword.tsx   (pública — llegada desde link de email)
                              │
                      PrivateRoute (guard)
                      ┌────────────────┐
                      │  NavBar        │
                      │  <Outlet />    │
                      └───────┬────────┘
                              │
              ┌───────────────┴──────────────┐
              ▼                              ▼
/   →  Home.tsx                   /dashboard → Dashboard.tsx
   (tareas + chat)                   (KPIs + gráficas + avatar)
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
    ├── main.tsx                    # ReactDOM.createRoot — StrictMode
    ├── App.tsx                     # ★ Router + AuthProvider + todas las rutas
    ├── App.css                     # Todos los estilos (navbar, auth, dashboard, chat, avatar)
    ├── index.css                   # Variables CSS, reset, base
    │
    ├── types/
    │   └── database.ts             # ★ Tipos generados por Supabase CLI
    │
    ├── lib/
    │   └── supabaseClient.ts       # ★ Singleton createClient<Database>
    │
    ├── services/
    │   ├── authService.ts          # ★ signIn, signUp, signOut, resetPassword, updatePassword
    │   ├── taskService.ts          # ★ getAll, create, update, delete, search
    │   ├── dashboardService.ts     # ★ getStats, getActivityByDay, getDistribution, getRecentActivity
    │   └── storageService.ts       # ★ avatars (upload/getPublicUrl/exists) + archivos (adjuntos)
    │
    ├── context/
    │   └── AuthContext.tsx         # ★ AuthProvider + useAuthContext
    │
    ├── hooks/
    │   ├── useAuth.ts              # ★ Estado de sesión + métodos auth
    │   ├── useRealtimeTasks.ts     # ★ CRUD optimista + canal postgres_changes
    │   ├── useDashboard.ts         # ★ Métricas paralelas + canal Realtime
    │   └── useRoom.ts              # ★ Canal único: presencia + broadcast (chat)
    │
    ├── components/
    │   ├── NavBar.tsx              # ★ Barra superior con enlace activo y logout
    │   ├── PrivateRoute.tsx        # ★ Guard: redirige a /login si no hay sesión
    │   ├── AvatarUpload.tsx        # ★ Input de imagen + upsert Storage + cache-buster
    │   ├── TaskForm.tsx            # Formulario controlado de nueva tarea
    │   ├── TaskItem.tsx            # Ítem con checkbox controlado y eliminar
    │   ├── RealtimeIndicator.tsx   # Pill de estado de conexión Realtime
    │   ├── Chat.tsx                # ★ Chat flotante público/privado con badge
    │   └── Dashboard/
    │       ├── StatCard.tsx        # KPI card con color y subtítulo
    │       ├── TaskChart.tsx       # BarChart Recharts — actividad 7 días
    │       ├── DonutChart.tsx      # PieChart dona — distribución tareas
    │       └── ActivityFeed.tsx    # Lista de tareas recientes con estado visual
    │
    └── pages/
        ├── Login.tsx               # ★ Formulario de inicio de sesión
        ├── Register.tsx            # ★ Formulario de registro con validación
        ├── ForgotPassword.tsx      # ★ Solicitud de recuperación por email
        ├── ResetPassword.tsx       # ★ Nueva contraseña tras evento PASSWORD_RECOVERY
        ├── Home.tsx                # ★ Mis tareas + indicador Realtime + Chat
        └── Dashboard.tsx           # ★ KPIs + gráficas + progreso + avatar
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

-- Habilitar RLS (requerido para políticas de seguridad)
ALTER TABLE "Tareas" ENABLE ROW LEVEL SECURITY;

-- Política para el taller (acceso libre para autenticados)
CREATE POLICY "Acceso público a tareas"
  ON "Tareas" FOR ALL
  USING (true) WITH CHECK (true);
```

> **Importante:** el nombre de la tabla es `"Tareas"` con **T mayúscula**. Así está definido en `src/types/database.ts` (generado por Supabase CLI). Usar `'tareas'` en minúscula provoca errores silenciosos.

### Bucket `avatars` en Supabase Storage

```
avatars/
└── {user_id}/
    └── avatar          ← ruta FIJA por usuario (upsert: true, sin extensión dinámica)
```

**Estrategia de persistencia del avatar:**
- Ruta fija `{userId}/avatar` → siempre se sobrescribe el mismo archivo con `upsert: true`
- `cacheControl: '0'` → deshabilita el cacheo en el CDN de Supabase
- URL pública con `?t=${Date.now()}` → invalida la caché del navegador en cada actualización

**Las 4 políticas RLS necesarias** (upsert internamente ejecuta SELECT → DELETE → INSERT):

```sql
CREATE POLICY "Usuarios pueden ver objetos en avatars"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Usuarios pueden subir su avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND name LIKE (auth.uid()::text || '/%')
);

CREATE POLICY "Usuarios pueden actualizar su avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars'
  AND name LIKE (auth.uid()::text || '/%')
);

CREATE POLICY "Usuarios pueden eliminar su avatar"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars'
  AND name LIKE (auth.uid()::text || '/%')
);
```

### Bucket `archivos-tareas` en Supabase Storage

```
archivos-tareas/
└── {tarea_id}/
    └── {timestamp}-{nombre_archivo}   ← timestamp evita colisiones de nombres
```

Acceso mediante **URLs firmadas** (`createSignedUrl`) con expiración configurable (por defecto 1 hora).

### Tipos TypeScript (`src/types/database.ts`)

```typescript
type Tarea       = Tables<'Tareas'>          // fila completa de la BD
type TareaInsert = TablesInsert<'Tareas'>     // campos para INSERT (id/created_at opcionales)
type TareaUpdate = TablesUpdate<'Tareas'>     // todos los campos opcionales para UPDATE
```

---

## Flujos Principales

### Autenticación (Login / Registro)

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
       ▼ (JWT almacenado en localStorage automáticamente)
onAuthStateChange dispara → setUser(session.user)
       │
       ▼
PrivateRoute detecta user !== null → renderiza NavBar + <Outlet />
       │
       ▼
navigate('/') → Home.tsx
```

### Recuperación de Contraseña

```
Usuario en /forgot-password ingresa su email
       │
       ▼
authService.resetPasswordForEmail(email, { redirectTo: '/reset-password' })
       │
       ▼ Supabase envía email con enlace mágico
       │
       ▼ Usuario hace clic en el enlace → llega a /reset-password
       │
       ▼
ResetPassword.tsx escucha onAuthStateChange
       │
       ▼ Supabase emite evento PASSWORD_RECOVERY → setListo(true)
       │
       ▼ Se muestra el formulario de nueva contraseña
       │
       ▼
authService.updatePassword(newPassword)
       │
       ▼ Contraseña actualizada → redirige a /login tras 3 segundos
```

### CRUD de Tareas con Realtime + UI Optimista

```
Acción del usuario (crear / actualizar / eliminar)
       │
       ▼ Optimistic Update: estado local cambia INMEDIATAMENTE
       │  → UI responde al instante sin esperar al servidor
       ▼
taskService.create/update/delete()
       │
       ▼ Si error → fetchTareas() revierte el estado
       │
       ▼ Si éxito → Supabase Realtime emite evento postgres_changes
       │
       ▼ Canal 'tareas-realtime' recibe INSERT/UPDATE/DELETE
       │  → deduplicación para INSERT (evita duplicado con optimistic update)
       ▼
setTareas() sincroniza con el estado real de la BD
(también sincroniza tareas de otros usuarios en tiempo real)
```

### Chat Colaborativo (useRoom)

```
Componente Home monta useRoom('home-room')
       │
       ▼ supabase.channel('home-room', { broadcast: { self: true } })
       │
       ▼ channel.on('presence', 'sync') → actualiza lista de usuarios online
       │
       ▼ channel.subscribe() → channel.track({ userId, email, online_at })
       │                          (registra presencia del usuario actual)
       │
Usuario envía mensaje
       │
       ▼ channelRef.current.send({ type: 'broadcast', event: 'mensaje', payload })
       │   payload incluye: texto, usuario, destinatario (null=público | email=privado)
       │
       ▼ Todos los suscriptores reciben el evento (incluyendo el remitente por self:true)
       │
       ▼ Filtrado en cliente:
       │   msg.destinatario === null → mensaje público (visible para todos)
       │   msg.destinatario === user.email → soy el destinatario
       │   msg.usuario === user.email → soy el remitente
       ▼
setMensajes() → Chat.tsx actualiza la conversación activa
```

### Subida de Avatar

```
Usuario selecciona imagen en AvatarUpload
       │
       ▼ Validación cliente: tipo (jpg/png/webp) y tamaño (≤ 2 MB)
       │
       ▼
storageService.avatars.upload(user.id, file)
       │  path fijo: `{userId}/avatar`, upsert: true, cacheControl: '0'
       ▼
Supabase Storage: SELECT → DELETE → INSERT (requiere 4 políticas RLS)
       │
       ▼
storageService.avatars.getPublicUrl(user.id)
       │  retorna: `{publicUrl}?t=${Date.now()}`  ← cache-buster
       ▼
setUrl(url) → <img src={url} /> muestra la imagen nueva
```

---

## Funcionalidades

### Autenticación

| Funcionalidad | Archivos clave |
|---|---|
| Registro con email y contraseña | `Register.tsx`, `authService.ts` |
| Validación de contraseñas (coincidencia + mínimo 6 chars) | `Register.tsx` |
| Login y redirección automática | `Login.tsx`, `useAuth.ts` |
| Sesión persistente (localStorage via Supabase) | `supabaseClient.ts` |
| Cierre de sesión desde NavBar | `NavBar.tsx`, `authService.ts` |
| Guard de rutas protegidas | `PrivateRoute.tsx`, `AuthContext.tsx` |
| Recuperación de contraseña por email | `ForgotPassword.tsx`, `authService.ts` |
| Restablecimiento de contraseña (evento PASSWORD_RECOVERY) | `ResetPassword.tsx` |

### Gestión de Tareas

| Funcionalidad | Archivos clave |
|---|---|
| Listar tareas en tiempo real (más recientes primero) | `Home.tsx`, `useRealtimeTasks.ts` |
| Crear tarea con UI optimista (aparece al instante) | `TaskForm.tsx`, `useRealtimeTasks.ts` |
| Marcar como completada / pendiente (checkbox controlado) | `TaskItem.tsx`, `useRealtimeTasks.ts` |
| Eliminar con confirmación y UI optimista | `TaskItem.tsx`, `useRealtimeTasks.ts` |
| Sincronización Realtime entre usuarios (postgres_changes) | `useRealtimeTasks.ts` |
| Indicador de conexión Realtime (verde/rojo) | `RealtimeIndicator.tsx` |
| Contador de progreso en cabecera | `Home.tsx` |

### Dashboard

| Funcionalidad | Archivos clave |
|---|---|
| KPIs: total, completadas, pendientes, progreso, creadas hoy | `Dashboard.tsx`, `useDashboard.ts`, `StatCard.tsx` |
| Barra de progreso animada con gradiente | `Dashboard.tsx` |
| Gráfica de barras — actividad últimos 7 días | `TaskChart.tsx`, `dashboardService.ts` |
| Gráfica de dona — distribución completadas/pendientes | `DonutChart.tsx`, `dashboardService.ts` |
| Feed de actividad reciente (últimas 10 tareas) | `ActivityFeed.tsx`, `dashboardService.ts` |
| Actualización automática Realtime al cambiar tareas | `useDashboard.ts` |
| Botón de refresco manual + timestamp de última actualización | `Dashboard.tsx` |
| Subida y visualización de avatar de perfil | `AvatarUpload.tsx`, `storageService.ts` |

### Chat Colaborativo

| Funcionalidad | Archivos clave |
|---|---|
| Canal único para presencia + chat (sin interferencias) | `useRoom.ts` |
| Indicador de usuarios en línea en tiempo real | `Home.tsx`, `useRoom.ts` |
| Chat flotante con botón en esquina inferior derecha | `Chat.tsx` |
| Badge de mensajes no leídos (contador dinámico) | `Chat.tsx` |
| Mensajes públicos (broadcast a todos) | `Chat.tsx`, `useRoom.ts` |
| Mensajes privados (filtrado por destinatario en cliente) | `Chat.tsx`, `useRoom.ts` |
| Selector de conversación con botones de usuario online | `Chat.tsx` |
| Auto-scroll al último mensaje | `Chat.tsx` |
| Recepción de propios mensajes en tiempo real (self: true) | `useRoom.ts` |

### Métodos disponibles en servicios

```typescript
// taskService
taskService.getAll()                      // todas las tareas del usuario
taskService.getById(id)                   // tarea por UUID
taskService.getByStatus(completada)       // filtrar por estado
taskService.search(texto)                 // búsqueda case-insensitive (ilike)
taskService.create(tarea)                 // nueva tarea → devuelve el registro creado
taskService.update(id, cambios)           // actualizar campos específicos
taskService.toggleCompletada(id, estado)  // invertir el campo completada
taskService.delete(id)                    // eliminar por ID
taskService.deleteCompleted()             // eliminar todas las completadas

// authService
authService.getSession()                  // sesión activa (desde localStorage)
authService.signUp(email, password)       // registro de nuevo usuario
authService.signIn(email, password)       // login con email/contraseña
authService.signInWithProvider(provider)  // OAuth: 'google' | 'github' | 'discord'
authService.signInWithMagicLink(email)    // login sin contraseña (OTP por email)
authService.signOut()                     // cerrar sesión
authService.resetPasswordForEmail(email)  // envía email de recuperación
authService.updatePassword(newPassword)   // actualiza contraseña del usuario autenticado
authService.onAuthStateChange(callback)   // suscripción a eventos de sesión

// dashboardService
dashboardService.getStats()               // KPIs: total, completadas, pendientes, %, hoy
dashboardService.getActivityByDay()       // actividad agrupada por día (últimos 7)
dashboardService.getDistribution()        // [{name, value, color}] para dona
dashboardService.getRecentActivity(limit) // últimas N tareas ordenadas por fecha

// storageService
storageService.avatars.upload(userId, file)            // upsert con ruta fija
storageService.avatars.getPublicUrl(userId)            // URL pública + ?t cache-buster
storageService.avatars.exists(userId)                  // comprueba si ya existe avatar
storageService.archivos.upload(tareaId, file)          // adjunto con timestamp en nombre
storageService.archivos.list(tareaId)                  // listar adjuntos de una tarea
storageService.archivos.getSignedUrl(path, expiresIn)  // URL firmada temporal (default 1h)
storageService.archivos.delete(path)                   // eliminar adjunto
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

> El prefijo `VITE_` es obligatorio para que Vite exponga la variable al cliente. **Nunca uses la `service_role` key en el frontend.**

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

### 4. Habilitar Realtime en la tabla `Tareas`

En Supabase → **Database → Replication → Supabase Realtime** → activar la tabla `Tareas`.

O por SQL:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE "Tareas";
```

### 5. Crear bucket `avatars`

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

### 6. Configurar URL de redirección para recuperación de contraseña

En Supabase → **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:5173` (desarrollo) o tu dominio de producción
- **Redirect URLs:** agregar `http://localhost:5173/reset-password`

Sin esta configuración, los enlaces de recuperación de contraseña no funcionarán.

### 7. Activar Auth por Email

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
// El genérico <Database> habilita tipado estricto y autocompletado en todas las consultas
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

Una sola instancia tipada con el esquema de la BD. Todos los servicios y hooks la importan.

---

### `src/context/AuthContext.tsx` — Proveedor de Auth

```typescript
// El tipo se infiere del hook — siempre sincronizado automáticamente
type AuthContextType = ReturnType<typeof useAuth>

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth()
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// Guard de uso: lanza error descriptivo si se usa fuera del árbol del Provider
export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>')
    return ctx
}
```

---

### `src/hooks/useRealtimeTasks.ts` — Tareas con Realtime + UI Optimista

Combina dos mecanismos para una experiencia fluida:

1. **UI Optimista:** el estado local cambia antes de confirmar con el servidor
2. **Supabase Realtime (`postgres_changes`):** sincroniza con cambios de otros usuarios

```typescript
// crearTarea: agrega el registro al estado local inmediatamente tras el INSERT
const crearTarea = async (t: TareaInsert) => {
    const { data, error } = await taskService.create(t)
    if (error) throw error
    if (data) setTareas(prev => [data, ...prev])
}

// actualizarTarea: aplica el cambio en UI, revierte si la BD falla
const actualizarTarea = async (id: string, c: TareaUpdate) => {
    setTareas(prev => prev.map(t => t.id === id ? { ...t, ...c } : t))
    const { error } = await taskService.update(id, c)
    if (error) { fetchTareas(); throw error }
}

// Canal Realtime con deduplicación: ignora INSERT si ya existe por el optimistic update
channel.on('postgres_changes', { event: 'INSERT', ... }, payload => {
    setTareas(prev =>
        prev.some(t => t.id === payload.new.id) ? prev : [payload.new, ...prev]
    )
})
```

---

### `src/hooks/useDashboard.ts` — Métricas en Paralelo

```typescript
// Promise.all ejecuta las 4 consultas al mismo tiempo → mínimo tiempo de carga
const [s, a, d, f] = await Promise.all([
    dashboardService.getStats(),
    dashboardService.getActivityByDay(),
    dashboardService.getDistribution(),
    dashboardService.getRecentActivity(10),
])

// Canal Realtime: recalcula todas las métricas al detectar cualquier cambio en Tareas
supabase.channel('dashboard-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'Tareas' },
        () => refresh()
    )
    .subscribe()
```

---

### `src/hooks/useRoom.ts` — Canal Único para Presencia + Chat

```
Arquitectura: UN solo canal por sala
  ├── Presencia (presence) → quién está online
  └── Chat (broadcast)     → mensajes público y privados

Ventaja: evita conflictos entre múltiples canales y simplifica el cleanup.
```

```typescript
// self: true → el remitente también recibe su propio mensaje de broadcast
const channel = supabase.channel(sala, {
    config: { broadcast: { self: true } },
})

// Presencia: sync se dispara en cada entrada/salida
channel.on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState<UserPresence>()
    setOnlineUsers(Object.values(state).flat())
})

// Broadcast: filtrado en cliente según destinatario
channel.on('broadcast', { event: 'mensaje' }, ({ payload }) => {
    const visible =
        msg.destinatario === null        ||   // público
        msg.destinatario === user.email  ||   // soy el destinatario
        msg.usuario      === user.email       // soy el remitente (por self:true)
    if (visible) setMensajes(prev => [...prev, msg])
})
```

---

### `src/components/AvatarUpload.tsx` — Foto de Perfil

Estrategia de persistencia correcta:

```typescript
// Ruta FIJA por usuario — siempre el mismo archivo, nunca acumulación
storageService.avatars.upload(user.id, file)
// → upload(`${userId}/avatar`, file, { upsert: true, cacheControl: '0' })

// URL con cache-buster → el navegador siempre descarga la versión actual
storageService.avatars.getPublicUrl(user.id)
// → `${publicUrl}?t=${Date.now()}`
```

> **Errores comunes resueltos:**
> - Sin ruta fija (nombres dinámicos) + `deleteAll` → condición de carrera; el avatar revierte a la primera foto tras el segundo cambio.
> - Sin `?t=Date.now()` → el navegador sirve la imagen anterior desde caché aunque el archivo ya fue reemplazado.
> - Sin las 4 políticas RLS → `upsert: true` falla silenciosamente en el paso DELETE interno.

---

## Convenciones y Buenas Prácticas

### Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `TaskForm`, `NavBar`, `AvatarUpload` |
| Hooks | `use` + camelCase | `useRealtimeTasks`, `useRoom`, `useDashboard` |
| Servicios | camelCase + `Service` | `taskService`, `authService`, `dashboardService` |
| Tipos | PascalCase | `Tarea`, `TareaInsert`, `UserPresence`, `Mensaje` |
| Archivos de componentes | `PascalCase.tsx` | `TaskItem.tsx`, `StatCard.tsx` |
| Archivos de hooks/servicios | `camelCase.ts` | `useRoom.ts`, `dashboardService.ts` |

### Patrones Aplicados

| Patrón | Dónde |
|---|---|
| **Singleton** | `supabaseClient.ts` — una sola conexión para toda la app |
| **Context + Custom Hook** | `AuthContext` + `useAuth` — estado global de sesión sin prop drilling |
| **Service Layer** | `*Service.ts` — los componentes/hooks nunca llaman a `supabase` directamente |
| **Guard / Protected Route** | `PrivateRoute.tsx` — redirige si no hay sesión |
| **Optimistic Update** | `useRealtimeTasks.ts` — estado local actualiza antes de confirmar la API |
| **Rollback on Error** | `useRealtimeTasks.ts` — `fetchTareas()` revierte si la mutación falla |
| **Cache Busting** | `storageService.ts` — `?t=timestamp` en URL del avatar |
| **Canal único** | `useRoom.ts` — presencia + broadcast en el mismo canal evitan interferencias |
| **Promise.all** | `useDashboard.ts` — 4 consultas de métricas en paralelo |
| **Deduplicación** | `useRealtimeTasks.ts` — guard en INSERT de Realtime para no duplicar optimistic |

### TypeScript Strict

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

- Todos los `catch` usan `err: unknown` con `instanceof Error` — sin `any`
- Tipos inferidos de la BD con `Tables<'Tareas'>`, `TablesInsert<'Tareas'>`, `TablesUpdate<'Tareas'>`
- Interfaces explícitas en lugar de `any[]` para todos los estados del dashboard

---

## Paleta de Colores SENA

```css
:root {
  --sena-green:        #39A900;   /* Verde SENA principal */
  --sena-dark-green:   #007A33;   /* Verde oscuro — hover, navbar, chat header */
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
- [Supabase Realtime — Channels](https://supabase.com/docs/guides/realtime/concepts)
- [Supabase Realtime — Presence](https://supabase.com/docs/guides/realtime/presence)
- [Supabase Realtime — Broadcast](https://supabase.com/docs/guides/realtime/broadcast)
- [Supabase Storage — RLS](https://supabase.com/docs/guides/storage/security/access-control)
- [Supabase Auth — Email](https://supabase.com/docs/guides/auth/auth-email)
- [Supabase Auth — Password Recovery](https://supabase.com/docs/guides/auth/passwords#resetting-a-users-password-forgot-password)
- [React Router v7](https://reactrouter.com/start/library/routing)
- [React Hooks](https://react.dev/reference/react)
- [Recharts](https://recharts.org/en-US/guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## Licencia

Proyecto de uso educativo — SENA, Colombia.

---

*Taller de integración React + Supabase: Auth · PostgreSQL · Realtime · Storage · RLS.*
