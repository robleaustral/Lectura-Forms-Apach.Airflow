# Aplicación de Prácticas Iniciales y Profesionales

Este proyecto es una aplicación web construida con Next.js que permite a los usuarios visualizar y seleccionar prácticas iniciales y profesionales. Incluye una interfaz de inicio y un menú interactivo donde se presentan las opciones disponibles. Además, utiliza Prisma como ORM para gestionar la base de datos.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- Node.js (versión 14 o superior)
- npm o yarn
- Docker (opcional, si deseas usar un contenedor para la base de datos)

## Instalación

1. Clona este repositorio:

   ```bash
   git clone <URL-del-repositorio>
   cd <nombre-del-repositorio>
   ```

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   # o si usas yarn
   yarn install
   ```

3. Configura las variables de entorno:

   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```env
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_de_datos"
   ```

   Ajusta `DATABASE_URL` según tu configuración de base de datos.

## Configuración de Prisma

Este proyecto utiliza Prisma como ORM. Para configurarlo:

1. Si la base de datos ya está creada, sincroniza el esquema con Prisma:

   ```bash
   npx prisma db pull
   ```

2. Genera el cliente de Prisma:

   ```bash
   npx prisma generate
   ```

3. (Opcional) Para visualizar y gestionar la base de datos, usa Prisma Studio:

   ```bash
   npx prisma studio
   ```

## Ejecución del proyecto

Para ejecutar la aplicación en modo de desarrollo:

```bash
npm run dev
# o con yarn
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Estructura de la aplicación

- **Página de inicio**: Interfaz principal de la aplicación.
- **Menú de opciones**: Permite seleccionar y ver las prácticas disponibles.
- **API**: Incluye los endpoints:
  - `/api/getPractica/[id]`: Obtiene información detallada de una práctica específica.

## Despliegue

Para desplegar la aplicación en un entorno de producción, puedes usar Docker o un servicio de hosting compatible con Next.js (como Vercel o AWS):

### Usando Docker

1. Construye la imagen:

   ```bash
   docker build -t nextjs-practicas .
   ```

2. Ejecuta el contenedor:

   ```bash
   docker run -p 3000:3000 nextjs-practicas
   ```

