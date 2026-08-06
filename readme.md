# Express + Prisma + TypeScript Boilerplate

Un **Starter Template** (Boilerplate) backend moderno, escalable y listo para producción, construido con **Express.js**, **TypeScript**, **Prisma ORM** y **PostgreSQL**.

Incluye autenticación segura basada en **JWT + Cookies HttpOnly**, validaciones con **Zod**, manejo de **CORS** y **Vane CLI**, una herramienta de comandos rápida para autogenerar módulos, controladores, servicios y middlewares al estilo `php artisan`.

---

## Tecnologías y Librerías

- **Entorno / Lenguaje:** Node.js, TypeScript
- **Framework:** Express.js
- **ORM / Base de datos:** Prisma ORM, PostgreSQL
- **Gestor de paquetes / Runner:** pnpm, `tsx`
- **Autenticación:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser`
- **Seguridad & Red:** `cors` (Soporte con credentials/cookies)
- **Validación:** Zod

---

## Estructura del Proyecto

```text
.
├── cli/                        # Herramienta CLI personalizada (Vane)
│   └── vane.ts
├── prisma/                     # Esquema y migraciones de la base de datos
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/                 # Configuraciones globales
│   ├── middlewares/            # Middlewares reutilizables (Auth, Validate, etc.)
│   ├── routes/                 # Centralizador de rutas de la API
│   │   └── index.ts
│   ├── modules/                # Arquitectura modular de la aplicación
│   │   ├── auth/               # Módulo de Autenticación (Login / Register)
│   │   └── user/               # Módulo de Usuarios
│   ├── app.ts                  # Configuración de Express (Middlewares, CORS, Rutas)
│   └── server.ts               # Punto de entrada y arranque del servidor HTTP
├── .env.example                # Variables de entorno de plantilla
├── tsconfig.json
└── package.json

## Requisitos previos

Asegúrate de tener instalado:

- Node.js (v18 o superior)
- PostgreSQL corriendo localmente o en un contenedor Docker
- pnpm instalado globalmente (npm i -g pnpm)

## Clonar e Instalar dependencias

```bash
# Clonar el repositorio
git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
cd tu-repositorio

# Instalar dependencias
pnpm install
```

## Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto basado en `.env.example` y configura las siguientes variables:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/postgres"
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="tu_clave_secreta_super_segura"
NODE_ENV="development" # o "production"
PORT=3000
```

## Migraciones y Base de Datos
Aplica las migraciones de Prisma para crear la estructura de tablas y generar los tipos de TypeScript:

```bash
pnpm prisma migrate dev --name init
```

Para generar solo los tipos sin aplicar migraciones:

```bash
pnpm prisma generate
```

## Levantar servidor

```bash
pnpm dev
```

🛠️ **Vane CLI (Generador de Código)**El proyecto incluye Vane, un generador de código que automatiza la creación de componentes para agilizar el desarrollo:

| Comando | Descripción |
|---------|-------------|
| `pnpm vane <Nombre>` o `pnpm vane make:all <Nombre>` | Genera un módulo completo (service, controller, routes) dentro de `src/modules/<nombre>/` |
| `pnpm vane make:middleware <Nombre>` | Crea un nuevo Middleware en `src/middlewares/` |
| `pnpm vane make:controller <Nombre>` | Crea un Controller individual en `src/controllers/` |
| `pnpm vane make:service <Nombre>` | Crea un Service individual en `src/services/` |
| `pnpm vane make:routes <Nombre>` | Crea un archivo de rutas en `src/routes/` |

Ejemplos:

```bash
# Crear el módulo completo para Libro
pnpm vane make:all Libro

# Crear un middleware para validar roles
pnpm vane make:middleware CheckRole
```

🔐 **Autenticación & Seguridad**
- **Login / Registro**: `/api/auth/register` y `/api/auth/login`.
- **Cookies HttpOnly**: El JWT se almacena y transporta de forma segura mediante **cookies HttpOnly**, mitigando ataques XSS.
Rutas Protegidas: Incluye authMiddleware para resguardar endpoints privados validando la firma del token.
Validaciones: Esquemas Zod para la verificación estricta de payloads.
📜 Scripts Disponibles
- `pnpm dev`: Ejecuta la app en modo desarrollo con hot-reload (tsx).
- `pnpm build`: Compila el código de TypeScript a JavaScript en la carpeta dist/.
- `pnpm start`: Ejecuta el código compilado en producción (node dist/src/server.js).
- `pnpm vane`: Ejecuta la herramienta de línea de comandos de Vane.
📄 LicenciaEste proyecto está bajo la Licencia MIT.

### Tip rápido antes de subir a GitHub:
Asegúrate de tener un archivo **`.gitignore`** en la raíz para que no subas información sensible ni archivos innecesarios. Debe incluir como mínimo:

```text
node_modules/
dist/
.env
*.log
Y crea un archivo .env.example con las variables sin datos sensibles para que los usuarios sepan qué completar al clonar.