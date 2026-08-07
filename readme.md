## Express + Prisma + TypeScript Boilerplate

Un **Starter Template** (Boilerplate) backend moderno, escalable y listo para producción, construido con **Express.js**, **TypeScript**, **Prisma ORM** y **PostgreSQL**.

Incluye autenticación segura basada en **JWT + Cookies HttpOnly**, validaciones con **Zod**, manejo de **CORS** y **Vane CLI**, una herramienta de comandos rápida para autogenerar módulos, controladores, servicios y middlewares al estilo `php artisan`.

## Tecnologías y Librerías

*   **Entorno / Lenguaje:** Node.js, TypeScript
*   **Framework:** Express.js
*   **ORM / Base de datos:** Prisma ORM, PostgreSQL
*   **Gestor de paquetes / Runner:** pnpm, `tsx`
*   **Autenticación:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser`
*   **Seguridad & Red:** `cors` (Soporte con credentials/cookies)
*   **Validación:** Zod

## Estructura del Proyecto

```plaintext
.
├── cli/                        # Herramienta CLI personalizada (Vane)
│   └── vane.ts
├── prisma/                     # Esquema y migraciones de la base de datos
│   ├── schema.prisma
│   └── migrations/
├── lib/                     	# Funciones y utilidades
│   ├── prisma.ts				# Inicializador de prisma
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
```

## Requisitos previos

Asegúrate de tener instalado:

*   Node.js (v18 o superior)
*   PostgreSQL corriendo localmente o en un contenedor Docker
*   pnpm instalado globalmente (npm i -g pnpm)

## Clonar e Instalar dependencias

```
# Clonar el repositorio
git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
cd tu-repositorio

# Instalar dependencias
pnpm install
```
## Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto copiando el archivo `.env.example` y configura las variables:

```
cp .env.example .env
```

Configura tus variables en el archivo .env:
```
DATABASE_URL="postgresql://usuario:password@localhost:5432/tu_base_datos?schema=public"
FRONTEND_URL="http://localhost:5173,http://localhost:3000"
JWT_SECRET="tu_clave_secreta_super_segura"
NODE_ENV="development" # o "production"
PORT=3000
```

## Migraciones y Base de Datos

Aplica las migraciones de Prisma para crear la estructura de tablas y generar los tipos de TypeScript:

```plaintext
pnpm prisma migrate dev --name init
```

Para generar solo los tipos sin aplicar migraciones:

```plaintext
pnpm prisma generate
```

## Levantar servidor

```plaintext
pnpm dev
```

Markdown
## 🛠️ **Vane CLI (Generador de Código)** 

El proyecto incluye **Vane**, una herramienta de CLI que automatiza la creación de componentes y arquitectura por módulos. Inspecciona tu `prisma/schema.prisma` para generar esquemas de validación de **Zod** dinámicos y listos para usar.

### Tabla de Comandos

| Comando | Descripción |
| --- | --- |
| `pnpm vane <Modelo>` | Alias para `make:all`. Lee el modelo en `schema.prisma` y genera el módulo completo en `src/modules/<modelo>/` (Schema Zod, Controller, Service y Routes). |
| `pnpm vane make:all <Modelo>` | Genera el módulo completo con Zod dinámico a partir de un modelo de Prisma. |
| `pnpm vane make:controller <Nombre>` | Genera un archivo de controlador en `src/controllers/` (o en subcarpetas). |
| `pnpm vane make:service <Nombre>` | Genera un archivo de servicio en `src/services/` (o en subcarpetas). |
| `pnpm vane make:routes <Nombre>` | Genera un archivo de rutas en `src/routes/` (o en subcarpetas). |
| `pnpm vane make:middleware <Nombre>` | Genera un middleware personalizado en `src/middlewares/`. |

---

### 💡 Ejemplos de Uso

#### 1. Módulo completo basado en Prisma (Recomendado)
Asegúrate de tener definido tu modelo en `prisma/schema.prisma` y ejecuta:

```bash
pnpm vane Producto
# o también:
pnpm vane make:all Producto
```
Resultado: Crea la carpeta src/modules/producto/ con:

```bash
producto.schema.ts (con validaciones de Zod basadas en las columnas reales de tu modelo).

producto.controller.ts

producto.service.ts

producto.routes.ts (con esquemas de Zod vinculados a POST y PUT).
```

## Comandos individuales por defecto
Genera un archivo aislado en la carpeta global correspondiente:

```bash
pnpm vane make:controller Auth
# Crea -> src/controllers/auth.controller.ts
```

```bash
pnpm vane make:service Auth
# Crea -> src/services/auth.service.ts
```

### Notación por puntos (Subcarpetas)
Puedes organizar controladores, servicios o rutas dentro de subcarpetas separando la ruta con puntos (.):

```bash
pnpm vane make:controller admin.reports.sales
# Crea -> src/controllers/admin/reports/sales.controller.ts
```

### Bandera -m / --module (Estructura modular personalizada)
Si deseas crear un controlador, servicio o ruta individual dentro de la carpeta de módulos (src/modules/), añade la bandera -m:

```bash
pnpm vane make:controller libro.libro -m
# Crea -> src/modules/libro/libro.controller.ts
```

🔐 **Autenticación & Seguridad**

*   **Login / Registro**: `/api/auth/register` y `/api/auth/login`.
*   **Cookies HttpOnly**: El JWT se almacena y transporta de forma segura mediante **cookies HttpOnly**, mitigando ataques XSS.  
    Rutas Protegidas: Incluye authMiddleware para resguardar endpoints privados validando la firma del token.  
    Validaciones: Esquemas Zod para la verificación estricta de payloads.  
    📜 Scripts Disponibles
*   `pnpm dev`: Ejecuta la app en modo desarrollo con hot-reload (tsx).
*   `pnpm build`: Compila el código de TypeScript a JavaScript en la carpeta dist/.
*   `pnpm start`: Ejecuta el código compilado en producción (node dist/src/server.js).
*   `pnpm vane`: Ejecuta la herramienta de línea de comandos de Vane.  
    📄 LicenciaEste proyecto está bajo la Licencia MIT.