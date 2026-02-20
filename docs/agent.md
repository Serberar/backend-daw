# Guía del proyecto — HexAuth API

API REST de usuarios construida en **Node.js + JavaScript**, con **arquitectura hexagonal**, JWT, verificación de email y todo dockerizado.

---

## Qué hace este proyecto

- Registro de usuario con **verificación de email** obligatoria (enlace enviado por correo)
- Login con **JWT** (2h de duración)
- Consulta y actualización de los datos del propio usuario
- Rutas protegidas mediante middleware de autenticación Bearer

---

## Prerequisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Node.js ≥ 18 (solo si quieres ejecutar fuera de Docker)

---

## Cómo arrancar

### Con Docker (recomendado)

```bash
# 1. Entrar en la carpeta
cd "Proyecto intermodular"

# 2. Levantar todo (PostgreSQL + Mailpit + App)
docker compose up -d

# 3. Ver logs de la app
docker compose logs -f app
```

Docker se encarga de levantar PostgreSQL, ejecutar las migraciones de Prisma y arrancar la app con nodemon.

**URLs disponibles:**

| Servicio | URL |
|----------|-----|
| API | http://localhost:3000 |
| Mailpit (ver emails) | http://localhost:8025 |

### Sin Docker (local)

```bash
cp .env.example .env      # Editar .env con tus valores
npm install
npx prisma db push
npm run dev
```

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `APP_URL` | URL base (para links en emails) | `http://localhost:3000` |
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://...` |
| `JWT_ACCESS_SECRET` | Secreto para firmar los JWT | string largo y aleatorio |
| `SMTP_HOST` | Servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Puerto SMTP | `587` |
| `SMTP_USER` | Usuario SMTP (email de Gmail) | `tucuenta@gmail.com` |
| `SMTP_PASS` | Contraseña de aplicación de Gmail | `xxxx xxxx xxxx xxxx` |

> Para Gmail hay que generar una **contraseña de aplicación** en: Google Account → Seguridad → Verificación en dos pasos → Contraseñas de aplicaciones.

---

## Endpoints de la API

Todos bajo el prefijo `/api/user`.

### Públicos

| Método | Ruta | Body / Query | Descripción |
|--------|------|--------------|-------------|
| `POST` | `/api/user/register` | `{ firstName, lastName, dni, phone, address, email, password }` | Crea el usuario y envía email de verificación |
| `POST` | `/api/user/login` | `{ email, password }` | Devuelve `{ token }` |
| `GET`  | `/api/user/verify-email` | `?token=...` | Verifica el email con el token del enlace |

### Protegidos (requieren `Authorization: Bearer <token>`)

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| `GET`  | `/api/user/me` | — | Devuelve los datos del usuario autenticado |
| `PATCH`| `/api/user/me` | `{ firstName?, lastName?, phone?, address? }` | Actualiza los datos del usuario (campos opcionales) |

### Ejemplo de flujo

```bash
# 1. Registrar
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ana","lastName":"García","dni":"12345678A","phone":"600000000","address":"Calle Mayor 1","email":"ana@test.com","password":"secret123"}'

# 2. Abrir http://localhost:8025 y clicar el enlace del email

# 3. Login
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@test.com","password":"secret123"}'
# → { "token": "eyJ..." }

# 4. Consultar perfil
curl http://localhost:3000/api/user/me \
  -H "Authorization: Bearer <token>"

# 5. Actualizar perfil
curl -X PATCH http://localhost:3000/api/user/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"phone":"611111111"}'
```

---

## Estructura del proyecto

```
.
├── Dockerfile
├── docker-compose.yml
├── package.json
├── prisma/
│   └── schema.prisma              # Modelo User
├── docs/
│   └── agent.md                   # Esta guía
└── src/
    ├── main.js                    # Arranque del servidor
    ├── config.js                  # Lee .env y exporta la configuración
    │
    ├── domain/                    # Lógica de negocio pura, sin dependencias externas
    │   └── User.js                # Entidad: create(), verifyEmail(), updateProfile()
    │
    ├── application/
    │   └── use-cases/
    │       └── user/              # Un fichero por caso de uso
    │           ├── register.js
    │           ├── login.js
    │           ├── verifyEmail.js
    │           └── updateUser.js
    │
    └── infrastructure/
        ├── db/
        │   ├── client.js          # Instancia única de PrismaClient
        │   └── userRepo.js        # Acceso a la BD (findById, create, update...)
        ├── email/
        │   ├── emailService.js    # send(to, template, data) — servicio genérico
        │   └── templates/
        │       └── verifyEmail.js # Plantilla: recibe { url }, devuelve { subject, html }
        ├── token/
        │   └── tokenService.js    # Firma y verificación de JWT
        └── http/
            ├── app.js             # Express: monta middlewares y rutas
            ├── authMiddleware.js  # Verifica el Bearer token e inyecta req.userId
            └── routes/
                └── userRoutes.js  # Rutas del dominio usuario
```

---

## Base de datos

Una sola tabla `users`:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK generada en el dominio |
| `firstName` | String | Nombre |
| `lastName` | String | Apellidos |
| `dni` | String unique | DNI |
| `phone` | String | Teléfono |
| `address` | String | Dirección |
| `email` | String unique | Normalizado a minúsculas |
| `passwordHash` | String | bcrypt con 12 rondas |
| `isEmailVerified` | Boolean | `false` hasta verificar |
| `emailVerificationToken` | String? | Token de 32 bytes en hex, expira en 24h |
| `createdAt / updatedAt` | DateTime | Gestionados por Prisma |

```bash
# Explorar la BD visualmente
npx prisma studio
```

---

## Cómo añadir nueva funcionalidad

1. Si hay nueva lógica de negocio → `src/domain/`
2. Si hay nuevo caso de uso → `src/application/use-cases/<dominio>/`
3. Si necesita acceso a BD → añadir método en `src/infrastructure/db/`
4. Exponer por HTTP → nueva ruta en `src/infrastructure/http/routes/`
5. Si es un dominio nuevo → crear `<dominio>Routes.js` y montarlo en `app.js`

### Añadir un nuevo email

1. Crear la plantilla en `src/infrastructure/email/templates/nombrePlantilla.js`:

```js
module.exports = ({ url, nombre }) => ({
  subject: 'Asunto del email',
  html: `<p>Hola ${nombre}, <a href="${url}">pulsa aquí</a>.</p>`,
});
```

2. Llamar al servicio desde el use case:

```js
await emailService.send(user.email, 'nombrePlantilla', { url, nombre: user.firstName });
```

---

## Seguridad

- **JWT de 2h de duración**: tiempo razonable sin refresh token
- **bcrypt con 12 rondas**: buen equilibrio seguridad/velocidad
- **Emails normalizados** (`toLowerCase().trim()`) para evitar duplicados por capitalización
- **Errores genéricos en login**: no se distingue "email no existe" de "contraseña incorrecta"
