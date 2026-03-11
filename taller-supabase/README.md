# SENA — Gestión de Tareas

> Aplicación web de gestión de tareas construida con **React + TypeScript + Vite + Supabase**, desarrollada como taller práctico de integración frontend-backend.

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Demo de la Aplicación](#demo-de-la-aplicación)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Estructura de Archivos](#estructura-de-archivos)
- [Modelo de Datos](#modelo-de-datos)
- [Flujo de Datos](#flujo-de-datos)
- [Funcionalidades](#funcionalidades)
- [Instalación y Configuración](#instalación-y-configuración)
- [Configuración de Supabase](#configuración-de-supabase)
- [Scripts Disponibles](#scripts-disponibles)
- [Documentación de Capas](#documentación-de-capas)
- [Convenciones y Buenas Prácticas](#convenciones-y-buenas-prácticas)
- [Próximas Funcionalidades](#próximas-funcionalidades)

---

## Descripción General

**SENA Gestión de Tareas** es una aplicación CRUD completa que permite crear, visualizar, actualizar y eliminar tareas almacenadas en una base de datos PostgreSQL gestionada por **Supabase**. El proyecto demuestra una arquitectura limpia por capas: tipos → cliente → servicio → hook → componente.

### Objetivos del Taller

- Integrar un cliente de Supabase tipado con TypeScript
- Implementar operaciones CRUD a través de una capa de servicios
- Gestionar estado asíncrono con hooks personalizados
- Construir componentes React desacoplados y reutilizables
- Aplicar estilos con paleta de marca (SENA verde)

---

## Demo de la Aplicación

```
┌─────────────────────────────────────────────────────────┐
│            SENA — Gestión de Tareas                     │
├─────────────────────────────────────────────────────────┤
│  Nueva Tarea                                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Título *                                         │  │
│  │  [________________________]                       │  │
│  │  Descripción (opcional)                           │  │
│  │  [________________________]                       │  │
│  │                    [ Agregar Tarea ]              │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Tareas  2 / 3 completadas                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │ ☑  ~~Revisar documentación~~              [🗑️]    │  │
│  │ ☑  ~~Instalar dependencias~~              [🗑️]    │  │
│  │ ☐  Conectar Supabase                     [🗑️]    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Estados visuales:**
- `☑` + tachado = Tarea completada
- `☐` = Tarea pendiente
- Opacidad reducida al eliminar (feedback visual)
- Texto "Guardando..." durante el envío del formulario

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| UI Library | React | 19.2.0 |
| Lenguaje | TypeScript | ~5.9.3 |
| Build Tool | Vite | 7.3.1 |
| Backend / DB | Supabase JS | 2.99.0 |
| Base de Datos | PostgreSQL | 14.1 |
| Routing | React Router DOM | 7.13.1 |
| Graficos | Recharts | 3.8.0 |
| Linting | ESLint | 9.39.1 |

> **Nota:** React Router DOM y Recharts están instalados y preparados para la siguiente fase del taller (rutas múltiples y visualización de estadísticas).

---

## Arquitectura del Proyecto

El proyecto implementa una **arquitectura limpia en capas** donde cada capa tiene una única responsabilidad:

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER / UI                        │
├─────────────────────────────────────────────────────────┤
│  Pages (Contenedores de Página)                         │
│  └── Home.tsx  ←  Orquesta el layout completo           │
├─────────────────────────────────────────────────────────┤
│  Components (UI Reutilizable)                           │
│  ├── TaskForm.tsx  ←  Formulario de creación            │
│  └── TaskItem.tsx  ←  Elemento de lista                 │
├─────────────────────────────────────────────────────────┤
│  Hooks (Estado + Lógica de Negocio)                     │
│  └── useTasks.ts  ←  Estado global de tareas            │
├─────────────────────────────────────────────────────────┤
│  Services (Capa de API)                                 │
│  └── taskService.ts  ←  Todas las llamadas a Supabase   │
├─────────────────────────────────────────────────────────┤
│  Lib (Infraestructura)                                  │
│  └── supabaseClient.ts  ←  Singleton del cliente        │
├─────────────────────────────────────────────────────────┤
│  Types (Contratos de Datos)                             │
│  └── database.ts  ←  Tipos generados por Supabase       │
├─────────────────────────────────────────────────────────┤
│                   SUPABASE / PostgreSQL                 │
└─────────────────────────────────────────────────────────┘
```

**Flujo de dependencias (unidireccional):**
```
Pages → Components → Hooks → Services → lib/supabaseClient → Supabase API
```

---

## Estructura de Archivos

```
taller-supabase/
│
├── .env                          # Variables de entorno (VITE_SUPABASE_*)
├── .gitignore                    # Archivos excluidos de git
├── index.html                    # Punto de entrada HTML
├── package.json                  # Dependencias y scripts
├── vite.config.ts                # Configuración de Vite + React plugin
├── tsconfig.json                 # Configuración raíz de TypeScript
├── tsconfig.app.json             # TypeScript para el código de app
├── tsconfig.node.json            # TypeScript para scripts de Node
├── eslint.config.js              # Reglas de linting (flat config)
│
├── public/
│   └── vite.svg                  # Icono estático
│
└── src/
    ├── main.tsx                  # Punto de entrada React (ReactDOM.render)
    ├── App.tsx                   # Componente raíz, header SENA
    ├── App.css                   # Estilos del componente App y tarjetas
    ├── index.css                 # Estilos globales, paleta de colores SENA
    │
    ├── assets/
    │   └── react.svg             # Logo de React
    │
    ├── types/
    │   └── database.ts           # ★ Tipos TypeScript de la BD (Supabase CLI)
    │
    ├── lib/
    │   └── supabaseClient.ts     # ★ Cliente Supabase (patrón Singleton)
    │
    ├── services/
    │   └── taskService.ts        # ★ Operaciones CRUD contra Supabase
    │
    ├── hooks/
    │   └── useTasks.ts           # ★ Hook personalizado de estado de tareas
    │
    ├── components/
    │   ├── TaskForm.tsx           # ★ Formulario de nueva tarea
    │   └── TaskItem.tsx           # ★ Ítem de tarea (toggle + eliminar)
    │
    └── pages/
        └── Home.tsx              # ★ Página principal, compone todo
```

> Los archivos marcados con ★ son los archivos clave del taller.

---

## Modelo de Datos

### Tabla `tareas` en PostgreSQL / Supabase

```sql
CREATE TABLE tareas (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT        NOT NULL,
  descripcion TEXT,
  completada  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id     UUID        REFERENCES auth.users(id)
);
```

### Tipos TypeScript generados (`src/types/database.ts`)

```typescript
// Tipo completo de una fila
type Tarea = Database['public']['Tables']['tareas']['Row'];
// {
//   id: string
//   titulo: string
//   descripcion: string | null
//   completada: boolean
//   created_at: string
//   user_id: string | null
// }

// Para insertar (id y created_at son opcionales)
type TareaInsert = Database['public']['Tables']['tareas']['Insert'];

// Para actualizar (todos los campos son opcionales)
type TareaUpdate = Database['public']['Tables']['tareas']['Update'];

// Helpers de acceso directo
type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
```

---

## Flujo de Datos

### Crear una Tarea

```
Usuario escribe título/descripción
         │
         ▼
   TaskForm.tsx
   handleSubmit()
   → valida título no vacío
   → llama onCrear(titulo, descripcion)
         │
         ▼
   useTasks.ts
   crearTarea(titulo, descripcion)
   → llama taskService.create()
         │
         ▼
   taskService.ts
   create({ titulo, descripcion })
   → supabase.from('tareas').insert([...])
         │
         ▼
   Supabase / PostgreSQL
   INSERT INTO tareas ...
         │
         ▼ (respuesta con nueva fila)
   useTasks.ts
   → agrega tarea al estado local (optimista)
         │
         ▼
   React re-render
   TaskItem nuevo aparece en la lista
```

### Toggle de Completada

```
Usuario hace clic en checkbox
         │
         ▼
   TaskItem.tsx → onActualizar({ completada: !tarea.completada })
         │
         ▼
   useTasks.ts → actualizarTarea(id, { completada })
         │
         ▼
   taskService.ts → supabase.from('tareas').update(...).eq('id', id)
         │
         ▼
   Estado local actualizado → re-render inmediato
```

---

## Funcionalidades

### Implementadas

| Funcionalidad | Descripción | Archivo |
|---------------|-------------|---------|
| Listar tareas | Carga todas las tareas al montar | `useTasks.ts`, `Home.tsx` |
| Crear tarea | Formulario con título (requerido) y descripción | `TaskForm.tsx` |
| Completar/descompletar | Checkbox con toggle visual (tachado) | `TaskItem.tsx` |
| Eliminar tarea | Botón con confirmación del navegador | `TaskItem.tsx` |
| Contador de progreso | "X / Y completadas" en tiempo real | `Home.tsx` |
| Estado de carga | Spinner / texto "Cargando..." | `useTasks.ts`, `Home.tsx` |
| Manejo de errores | Mensajes de error visibles en pantalla | `useTasks.ts`, `Home.tsx` |
| Feedback de formulario | "Guardando..." al enviar | `TaskForm.tsx` |

### En el Servicio (disponibles para usar)

| Método | Descripción |
|--------|-------------|
| `taskService.getAll()` | Trae todas las tareas ordenadas por fecha |
| `taskService.getById(id)` | Busca una tarea por UUID |
| `taskService.getByStatus(completada)` | Filtra por estado de completado |
| `taskService.search(query)` | Búsqueda case-insensitive por título |
| `taskService.create(data)` | Crea nueva tarea |
| `taskService.update(id, data)` | Actualiza campos de una tarea |
| `taskService.toggleCompletada(id, actual)` | Invierte el estado de completado |
| `taskService.delete(id)` | Elimina una tarea por ID |
| `taskService.deleteCompleted()` | Elimina todas las completadas |

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
# Editar .env con tus credenciales de Supabase

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## Configuración de Supabase

### 1. Crear proyecto en Supabase

1. Ir a [app.supabase.com](https://app.supabase.com)
2. Crear nuevo proyecto
3. Anotar la **URL** y la **anon key** del proyecto

### 2. Crear la tabla `tareas`

En el **SQL Editor** de Supabase, ejecutar:

```sql
-- Crear tabla de tareas
CREATE TABLE tareas (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT        NOT NULL,
  descripcion TEXT,
  completada  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id     UUID        REFERENCES auth.users(id)
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;

-- Política permisiva para acceso anónimo (modo taller)
CREATE POLICY "Acceso público a tareas"
  ON tareas FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 3. Configurar variables de entorno

Crear o editar el archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Importante:** El prefijo `VITE_` es requerido por Vite para exponer variables al cliente. Nunca uses la `service_role` key en el frontend.

### 4. Verificar la conexión

El cliente valida las variables al arrancar (`src/lib/supabaseClient.ts`):

```typescript
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno VITE_SUPABASE_*');
}
```

Si hay un error, aparecerá en la consola del navegador.

---

## Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo con HMR en localhost:5173
npm run build     # Compilar TypeScript + bundle de producción (dist/)
npm run preview   # Servir la build de producción localmente
npm run lint      # Analizar código con ESLint
```

---

## Documentación de Capas

### `src/lib/supabaseClient.ts` — Cliente Singleton

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Una sola instancia compartida en toda la app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

**Por qué Singleton:** Evita crear múltiples conexiones WebSocket innecesarias. Una instancia es suficiente para toda la aplicación.

---

### `src/services/taskService.ts` — Capa de Servicio

Centraliza TODAS las llamadas a Supabase. Los componentes nunca importan `supabase` directamente.

```typescript
// Ejemplo: obtener todas las tareas
export const taskService = {
  getAll: () =>
    supabase
      .from('tareas')
      .select('*')
      .order('created_at', { ascending: false }),

  create: (data: { titulo: string; descripcion?: string }) =>
    supabase.from('tareas').insert([data]).select().single(),

  toggleCompletada: (id: string, actual: boolean) =>
    supabase
      .from('tareas')
      .update({ completada: !actual })
      .eq('id', id)
      .select()
      .single(),

  delete: (id: string) =>
    supabase.from('tareas').delete().eq('id', id),
};
```

---

### `src/hooks/useTasks.ts` — Hook Personalizado

Gestiona el estado de la lista de tareas y expone métodos para los componentes.

```typescript
export function useTasks() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga inicial automática
  useEffect(() => { fetchTareas(); }, []);

  const crearTarea = async (titulo: string, descripcion?: string) => {
    const { data, error } = await taskService.create({ titulo, descripcion });
    if (data) setTareas(prev => [data, ...prev]); // Actualización optimista
  };

  return { tareas, loading, error, crearTarea, actualizarTarea, eliminarTarea };
}
```

**Actualización optimista:** El estado local se actualiza inmediatamente sin esperar confirmación de la API, dando una experiencia fluida.

---

### `src/components/TaskForm.tsx` — Formulario

Componente controlado que gestiona su propio estado local del formulario:

```typescript
interface TaskFormProps {
  onCrear: (titulo: string, descripcion: string) => Promise<void>;
}
```

- Estado: `titulo`, `descripcion`, `guardando`
- Validación: título no puede estar vacío
- Reset automático tras creación exitosa
- Botón deshabilitado durante el envío

---

### `src/components/TaskItem.tsx` — Elemento de Lista

Representa una tarea individual con acciones:

```typescript
interface TaskItemProps {
  tarea: Tarea;
  onActualizar: (id: string, data: Partial<Tarea>) => Promise<void>;
  onEliminar: (id: string) => Promise<void>;
}
```

- Checkbox para toggle de `completada`
- Texto tachado (`text-decoration: line-through`) si completada
- Botón eliminar con `window.confirm()` como guarda
- Estado `eliminando` para feedback visual (opacidad reducida)

---

### `src/pages/Home.tsx` — Página Principal

Orquesta todos los componentes:

```typescript
export default function Home() {
  const { tareas, loading, error, crearTarea, actualizarTarea, eliminarTarea } = useTasks();

  const completadas = tareas.filter(t => t.completada).length;

  return (
    <>
      <TaskForm onCrear={crearTarea} />
      <p>{completadas} / {tareas.length} completadas</p>
      {tareas.map(tarea => (
        <TaskItem
          key={tarea.id}
          tarea={tarea}
          onActualizar={actualizarTarea}
          onEliminar={eliminarTarea}
        />
      ))}
    </>
  );
}
```

---

## Convenciones y Buenas Prácticas

### Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `TaskForm`, `TaskItem` |
| Hooks | camelCase con prefijo `use` | `useTasks` |
| Servicios | camelCase con sufijo `Service` | `taskService` |
| Tipos/Interfaces | PascalCase | `Tarea`, `TareaInsert` |
| Variables/Funciones | camelCase | `crearTarea`, `fetchTareas` |
| Archivos de componentes | PascalCase.tsx | `TaskForm.tsx` |
| Archivos de hooks/servicios | camelCase.ts | `useTasks.ts` |

### Patrones Aplicados

- **Singleton** — Un solo cliente de Supabase en toda la app
- **Service Layer** — Abstracción de la API separada de la UI
- **Custom Hook** — Lógica de estado separada de los componentes
- **Controlled Components** — Formularios manejados por estado React
- **Props drilling mínimo** — El hook provee los datos, páginas pasan props a hijos directos

### TypeScript Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## Paleta de Colores SENA

```css
--color-primary:     #39A900;   /* Verde SENA principal */
--color-dark:        #007A33;   /* Verde oscuro (hover) */
--color-light:       #E8F5E0;   /* Verde claro (fondos) */
--color-text:        #1B2E1B;   /* Texto oscuro */
--color-danger:      #D32F2F;   /* Rojo para eliminar */
```

---

## Próximas Funcionalidades

El proyecto tiene dependencias instaladas que habilitan las siguientes extensiones:

### React Router DOM — Múltiples Páginas
```
/           →  Home (lista de tareas)
/estadisticas →  Dashboard con gráficos
/perfil     →  Configuración de usuario
```

### Recharts — Visualización de Datos
```
Tareas completadas vs pendientes  →  PieChart
Tareas creadas por día            →  BarChart / LineChart
Progreso semanal                  →  AreaChart
```

### Supabase Auth — Autenticación
```typescript
// La columna user_id ya existe en la tabla tareas
// Solo se necesita activar el proveedor de Auth en Supabase
const { data: { user } } = await supabase.auth.getUser();
const { data } = await supabase
  .from('tareas')
  .select('*')
  .eq('user_id', user.id);  // Tareas por usuario
```

### Supabase Realtime — Actualizaciones en Vivo
```typescript
// Suscripción a cambios en la tabla
supabase
  .channel('tareas-realtime')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'tareas' }, payload => {
    // Actualizar estado automáticamente cuando otro usuario hace cambios
  })
  .subscribe();
```

---

## Recursos de Aprendizaje

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [React Hooks — Documentación oficial](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vite Guide](https://vitejs.dev/guide/)

---

## Licencia

Proyecto de uso educativo — SENA, Colombia.

---

*Taller desarrollado como práctica de integración React + Supabase con arquitectura limpia por capas.*