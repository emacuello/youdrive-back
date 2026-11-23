# YouDrive API

Backend de YouDrive, app de alquiler de autos entre personas. Proyecto final del Grupo 3 de Henry (FT-48). Sale de la carpeta `backend/` del monorepo [maccari78/PM6-grupo3](https://github.com/maccari78/PM6-grupo3) (rama `emanuelcuello`) y conserva su historial.

NestJS 12 (ESM) + TypeORM + PostgreSQL, Socket.IO para el chat (namespace `/chat`), Stripe, Cloudinary, AWS Rekognition y Swagger en `/api`. Node 24 y pnpm.

```bash
pnpm install
cp .env.example .env        # completar DB_* y el resto
pnpm start:dev              # TypeORM crea el esquema; si no hay usuarios, carga datos de demo
```

`pnpm build`, `pnpm lint` (oxlint) y `pnpm test` (Jest en modo ESM).

Usuarios de demo (contraseña `password123`): `admin@youdrive.demo`, `lucia@youdrive.demo` y `martin@youdrive.demo`.

## Deploy

Corre en el VPS de `emacuello/infra` (`apps/youdrive/`) en `https://api-youdrive.emacuello.dev`. Un push a `main` ejecuta `.github/workflows/main.yml`, que entra por SSH con una clave restringida a `/opt/infra/deploy.sh`; el server clona `main`, construye el `Dockerfile` y reinicia el contenedor.
