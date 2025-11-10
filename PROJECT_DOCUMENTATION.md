# Brainy Command Center

Sistema completo de gestión de marketing, creatividad y operaciones para agencias y marcas. Desarrollado con React, TypeScript, Supabase y Tailwind CSS.

## 🚀 Características Principales

### Sistema de Roles y Permisos
- **Roles Globales**: Admin, Moderator, User
- **Roles Organizacionales**: Owner, Admin, Editor, Viewer, Member
- Control granular de permisos para CRUD de organizaciones, marcas y proyectos
- Validación tanto en cliente como en servidor (RLS policies)

### Gestión de Organizaciones
- Crear, editar y eliminar organizaciones
- Sistema de membresías con roles
- Gestión de equipos y miembros
- Validación con Zod schemas
- Confirmación de eliminación con AlertDialog

### Gestión de Marcas
- Crear, editar y eliminar marcas dentro de organizaciones
- Upload de logos con Supabase Storage
- Preview de imágenes antes de guardar
- Validación de tamaño (máx 5MB) y tipo de archivo
- Slugs únicos por organización

### Gestión de Proyectos
- Crear, editar y eliminar proyectos
- Estados: Planning, Active, On Hold, Completed, Cancelled
- Asociación con marcas
- Fechas de inicio y fin
- Descripción y seguimiento

### Storage de Archivos
- Buckets separados para logos de organizaciones y marcas
- Políticas RLS para acceso seguro
- Preview en tiempo real
- Validación de archivos

### Autenticación
- Email/Password
- Google OAuth
- Manejo robusto de sesiones
- Rutas protegidas
- Auto-redirect según estado de autenticación

## 🏗️ Arquitectura

### Frontend
```
src/
├── components/
│   ├── layout/
│   │   └── AppHeader.tsx          # Navegación global
│   ├── ui/                         # Componentes shadcn
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── image-upload.tsx       # Upload de imágenes
│   │   └── ...
│   └── auth/
│       └── ProtectedRoute.tsx     # HOC para rutas protegidas
├── hooks/
│   ├── usePermissions.ts          # Hook de permisos
│   └── useUserOrganizations.ts    # Hook para cargar organizaciones
├── pages/
│   ├── AuthPage.tsx
│   ├── LandingPage.tsx
│   ├── DashboardPage.tsx
│   ├── OrganizationsPage.tsx
│   ├── CreateOrganizationPage.tsx
│   ├── EditOrganizationPage.tsx
│   ├── BrandsPage.tsx
│   ├── CreateBrandPage.tsx
│   ├── EditBrandPage.tsx
│   ├── ProjectsPage.tsx
│   ├── CreateProjectPage.tsx
│   ├── EditProjectPage.tsx
│   └── OrganizationMembersPage.tsx
├── lib/
│   └── validations.ts             # Schemas Zod
└── utils/
    └── auth.ts                     # Utilidades de autenticación
```

### Backend (Supabase)

#### Tablas
- `organizations` - Organizaciones con RLS
- `organization_members` - Membresías con roles
- `brands` - Marcas asociadas a organizaciones
- `projects` - Proyectos asociados a marcas
- `profiles` - Perfiles de usuarios
- `user_roles` - Roles globales de usuarios
- `plans` - Planes de suscripción
- `subscriptions` - Suscripciones activas
- `brand_kits` - Kits de marca (colores, fuentes, etc.)

#### Storage Buckets
- `organization-logos` - Logos de organizaciones (público)
- `brand-logos` - Logos de marcas (público)

#### Funciones
- `has_role()` - Verifica rol global de usuario (SECURITY DEFINER)
- `is_organization_member()` - Verifica membresía en organización
- `is_organization_owner()` - Verifica propiedad de organización
- `handle_new_user()` - Trigger para crear perfil al registrarse
- `update_updated_at_column()` - Trigger para actualizar timestamps

## 🔒 Seguridad

### Row Level Security (RLS)
Todas las tablas tienen RLS habilitado con políticas específicas:

**Organizations:**
- Admins pueden gestionar sus organizaciones
- Miembros pueden ver organizaciones a las que pertenecen

**Brands:**
- Owners pueden gestionar marcas
- Miembros pueden ver marcas de su organización

**Projects:**
- Miembros pueden crear proyectos
- Miembros pueden ver proyectos de su organización

**Storage:**
- Logos son públicos para lectura
- Solo usuarios autenticados pueden subir/modificar

### Validación de Inputs
- Client-side: Zod schemas con validación en tiempo real
- Server-side: RLS policies y constraints de base de datos
- Sanitización de URLs y slugs
- Límites de longitud y formato

### Permisos Jerárquicos
```
Organización:
  Owner → puede todo
  Admin → puede editar y gestionar miembros
  Editor → puede crear/editar marcas y proyectos
  Viewer → solo lectura
  Member → acceso básico

Global:
  Admin → acceso total al sistema
  Moderator → gestión de contenidos
  User → acceso estándar
```

## 🎨 Diseño

### Sistema de Tokens
Colores semánticos definidos en `index.css`:
- `--primary`: Rosa Única.la (#E94980)
- `--secondary`: Morado claro
- `--accent`: Rosa acentuado
- `--muted`: Grises suaves
- `--destructive`: Rojo para acciones destructivas

### Gradientes
- `--gradient-hero`: Degradado morado-rosa-azul
- `--gradient-primary`: Degradado rosa

### Sombras
- `--shadow-glow`: Sombra con efecto glow rosa

### Componentes Reutilizables
Todos los componentes usan tokens semánticos, nunca colores directos.

## 📋 Validaciones

### CreateOrganizationSchema
```typescript
{
  name: string (1-100 chars),
  slug: string (formato slug, único),
  logo_url: URL opcional
}
```

### CreateBrandSchema
```typescript
{
  name: string (1-100 chars),
  slug: string (formato slug),
  industry: string opcional,
  website: URL opcional,
  logo_url: URL opcional
}
```

### CreateProjectSchema
```typescript
{
  name: string (1-150 chars),
  description: string opcional (max 1000),
  brand_id: UUID requerido,
  status: enum [planning, active, on_hold, completed, cancelled],
  start_date: date requerido,
  end_date: date opcional
}
```

## 🚦 Rutas

### Públicas
- `/` - Landing page
- `/auth` - Login/Signup

### Protegidas
- `/dashboard` - Dashboard principal
- `/organizations` - Lista de organizaciones
- `/organizations/new` - Crear organización
- `/organizations/:orgId/edit` - Editar organización
- `/organizations/:orgId/members` - Gestión de equipo
- `/organizations/:orgId/brands` - Lista de marcas
- `/organizations/:orgId/brands/new` - Crear marca
- `/organizations/:orgId/projects` - Lista de proyectos
- `/organizations/:orgId/projects/new` - Crear proyecto
- `/brands/:brandId/edit` - Editar marca
- `/projects/:projectId/edit` - Editar proyecto

## 🔄 Flujo de Trabajo

### Creación de Organización
1. Usuario autenticado va a `/organizations/new`
2. Completa formulario con validación Zod
3. Puede subir logo con preview
4. Sistema verifica slug único
5. Crea organización y asigna owner automáticamente
6. Redirect a lista de organizaciones

### Creación de Marca
1. Usuario con permisos (owner/admin/editor) en organización
2. Va a `/organizations/:orgId/brands/new`
3. Completa formulario con validación
4. Sube logo con preview
5. Sistema verifica slug único dentro de organización
6. Crea marca asociada a organización

### Creación de Proyecto
1. Usuario con permisos en organización
2. Selecciona marca de lista filtrada por organización
3. Completa datos del proyecto
4. Define estado y fechas
5. Sistema crea proyecto asociado a marca

### Eliminación con Confirmación
1. Usuario con permisos de eliminación
2. Click en botón "Eliminar" en zona de peligro
3. AlertDialog solicita confirmación
4. Al confirmar, se ejecuta eliminación en cascada
5. Redirect automático tras éxito

## 🛠️ Desarrollo

### Requisitos
- Node.js 18+
- Cuenta Supabase
- Proyecto Supabase configurado

### Variables de Entorno
Las credenciales están hardcodeadas en `src/integrations/supabase/client.ts`:
```typescript
SUPABASE_URL = "https://fynwkhlwdvezajlkodrs.supabase.co"
SUPABASE_ANON_KEY = "..."
```

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📦 Dependencias Principales
- React 18.3
- TypeScript
- Vite
- Supabase JS Client 2.56
- React Router DOM 6.26
- Zod 3.23 (validación)
- Tailwind CSS
- Shadcn UI
- Lucide React (iconos)
- Sonner (toasts)
- TanStack Query

## 🎯 Próximos Pasos Sugeridos

### Funcionalidades Pendientes
1. **Búsqueda y Filtros**: Implementar búsqueda en listas de organizaciones, marcas y proyectos
2. **Audit Log**: Registrar todas las acciones (crear, editar, eliminar) con usuario y timestamp
3. **Vista Detallada de Organización**: Tabs con información general, métricas, configuración
4. **Notificaciones**: Sistema de notificaciones para cambios importantes
5. **Dashboard Analytics**: Métricas y gráficos de proyectos activos
6. **Exportación de Datos**: Export a CSV/Excel de proyectos y métricas
7. **Búsqueda Global**: Buscar en toda la plataforma desde header
8. **Temas**: Dark mode completo
9. **Drag & Drop**: Para upload de archivos
10. **Múltiples archivos**: Galería de imágenes por marca/proyecto

### Mejoras Técnicas
1. **Testing**: Implementar tests unitarios y E2E
2. **i18n**: Internacionalización (español/inglés)
3. **PWA**: Soporte offline y app installable
4. **Optimización**: Code splitting y lazy loading
5. **Error Boundaries**: Manejo de errores global
6. **Logging**: Sistema de logs centralizado
7. **Performance**: Métricas y optimización de renders

## 📝 Notas de Implementación

### Permisos
El sistema de permisos usa funciones SECURITY DEFINER para evitar recursión en RLS. Siempre verifica permisos tanto en cliente (UX) como en servidor (seguridad).

### Storage
Los buckets son públicos para lectura pero requieren autenticación para escritura. Los archivos se nombran con timestamp + random para evitar colisiones.

### Validación
Todas las validaciones de cliente se replican en servidor vía RLS y constraints. Nunca confiar solo en validación de cliente.

### Estado de Loading
Todos los componentes manejan estados de loading, error y éxito. Se usa skeleton screens para mejor UX.

### Toasts
Sonner para notificaciones. Siempre notificar acciones exitosas y errores al usuario.

---

**Desarrollado para Única.LA**
Sistema de gestión integral para agencias creativas y marcas.
