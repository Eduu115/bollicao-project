# Bollicao Project

Este proyecto es una aplicación web completa desarrollada con Angular en el frontend y Node.js/Express en el backend.

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Node.js](https://nodejs.org/) (Versión LTS recomendada, v18 o superior)
- [MongoDB](https://www.mongodb.com/) (Instancia local o cluster en MongoDB Atlas)

## Instalación

Sigue estos pasos para configurar el proyecto en tu entorno local:

1. **Clonar el repositorio**

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd bollicao-project
   ```

2. **Instalar dependencias**

   Ejecuta el siguiente comando en la raíz del proyecto para instalar todas las librerías necesarias:

   ```bash
   npm install
   ```

3. **Configuración de Variables de Entorno**

   Crea un archivo `.env` en la raíz del proyecto tomando como referencia el archivo `.env.example`.

   Windows (PowerShell):
   ```powershell
   copy .env.example .env
   ```

   Linux / Mac:
   ```bash
   cp .env.example .env
   ```

   Edita el archivo `.env` y asegúrate de que la cadena de conexión a MongoDB sea correcta:

   ```env
   MONGO_URI=mongodb://localhost:27017/bollicao
   ```

## Ejecución

El proyecto consta de dos partes principales que deben ejecutarse: el backend (API) y el frontend (Angular).

### 1. Inicialización de Datos (Seed)

Si es la primera vez que configuras el proyecto (SOLO SI ES LA PRIMERA VEZ, ¡¡ELIMINA TODOS LOS DATOS SI YA HAY Y CREA NUEVOS DE EJEMPLO, CUIDADO!!), puedes ejecutar el siguiente comando para poblar la base de datos con datos de prueba:

```bash
npm run seed
```

### 2. Iniciar el Backend

Para levantar el servidor de desarrollo (con recarga automática):

```bash
npm run api
```

### 3. Iniciar el Frontend

En una nueva terminal, inicia la aplicación de Angular:

```bash
npm start
```

Una vez compilado, abre tu navegador y navega a `http://localhost:4200/`.

## Despliegue (Build)

Para generar la versión de producción de la aplicación, optimizada para el despliegue:

```bash
npm run build
```

Esto generará los archivos estáticos en la carpeta `dist/`. El contenido de esta carpeta es lo que debe subirse a tu servidor web o servicio de hosting.
