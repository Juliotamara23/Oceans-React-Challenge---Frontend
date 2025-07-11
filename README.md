# Frontend del Sistema de Gestión de Restaurantes

Este proyecto es el frontend de un sistema de gestión para restaurantes, desarrollado con Next.js y TypeScript. Permite a los usuarios (administradores y meseros) gestionar productos y órdenes, y visualizar un resumen del negocio a través de un dashboard.

## Problema con la Autenticación (Login)

**Nota Importantes:** A pesar de varios intentos, no se logró hacer que el login funcionara bien debido a la falta de tiempo, decidí volver a una versión más estable del proyecto para poder mostrar el resto de la aplicación.

La pantalla de login tiene las credenciales de prueba para acceder, una vez a dentro para poder visualizar el dashboard y las funcionalidades de gestión de productos y órdenes se debe hacer login desde el backend y copiar el token de autenticación en `lib\api.ts`.

## 🚀 Cómo Correr el Proyecto

Sigue estos pasos para poner en marcha el frontend en tu entorno local.

### Prerequisitos

Antes de empezar, asegúrate de tener instalado lo siguiente:

* **Node.js**: Versión 18.x o superior.
* **npm** (Node Package Manager) o **Yarn**: Incluido con Node.js, o puedes instalar Yarn globalmente (`npm install -g yarn`).

### Pasos de Instalación y Ejecución

**Nota:** Si npm install no funciona se debe hacer un npm install --legacy-peer-deps (No alcanzé a investigar el porqué de este problema, pero parece ser un problema con las dependencias de Tailwind y Shadcn/ui).

1.  **Clonar el Repositorio (si aún no lo has hecho):**
    ```bash
    git clone <URL_DE_TU_REPOSITORIO_FRONTEND>
    cd nombre-del-repositorio-frontend
    ```

2.  **Instalar Dependencias:**
    Usa npm:
    ```bash
    npm install
    ```
    O si prefieres Yarn:
    ```bash
    yarn install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env.local` en la raíz de tu proyecto frontend.
    La URL del backend en este caso seria:
    ```
    NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
    ```

4.  **Iniciar el Servidor de Desarrollo:**
    Usa npm:
    ```bash
    npm run dev
    ```
    O si prefieres Yarn:
    ```bash
    yarn dev
    ```

5.  **Abrir en el Navegador:**
    Una vez que el servidor se inicie, abre tu navegador y ve a `http://localhost:3000` (o el puerto que te indique la consola).

    La aplicación debería iniciarse en la página de login.

## ⚙️ Tecnologías Usadas

Este frontend está construido sobre una pila de tecnologías modernas y robustas para el desarrollo web:

* **Next.js 14 (App Router)**: Un framework de React para construir aplicaciones web de alto rendimiento, con renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG) y API Routes. Se utiliza el nuevo App Router para una mayor flexibilidad y capacidades.
* **React**: La biblioteca principal para construir interfaces de usuario.
* **TypeScript**: Un superset de JavaScript que añade tipado estático, mejorando la robustez del código y facilitando el mantenimiento.
* **Tailwind CSS**: Un framework CSS "utility-first" que permite construir diseños personalizados rápidamente, directamente en tu marcado.
* **Shadcn/ui**: Una colección de componentes re-utilizables para React que se integra perfectamente con Tailwind CSS y proporciona una base sólida para la interfaz de usuario.
* **Axios**: Un cliente HTTP basado en promesas para el navegador y Node.js, utilizado para hacer las peticiones a la API del backend.
* **Zod**: Una biblioteca para la validación de esquemas de TypeScript-first. Se utiliza para validar los datos de los formularios.
* **React Hook Form**: Una librería popular para manejar formularios en React de manera eficiente y con menos código.
* **Sonner**: Una librería para mostrar notificaciones (toasts) de forma sencilla y estética.

## 🧑‍💻 Explicaciones Técnicas

### Estructura de Carpetas Clave

* `app/`: Contiene las rutas principales de Next.js y el `RootLayout`.
    * `app/layout.tsx`: Define la estructura global de la aplicación, incluyendo la importación y uso de los `Providers` (Auth, Restaurant) y el `AuthGuard`.
* `components/`: Almacena los componentes reutilizables de la interfaz de usuario.
    * `components/login-page.tsx`: Componente de la página de inicio de sesión.
    * `components/auth-guard.tsx`: Un componente que protege las rutas, redirigiendo a los usuarios no autenticados o manejando la carga de la sesión.
* `contexts/`: Aquí se definen los contextos de React para la gestión del estado global.
    * `contexts/auth-context.tsx`: Gestiona el estado de autenticación (usuario, token, sesión, login/logout). Utiliza `localStorage` para persistir la sesión.
    * `contexts/restaurant-context.tsx`: Gestiona el estado relacionado con los datos del restaurante, como productos y órdenes. Realiza llamadas a la API y expone los datos y estados de carga.
* `lib/`: Contiene utilidades y configuraciones.
    * `lib/api.ts`: Configuración de la instancia de Axios, incluyendo posibles interceptores para añadir el token de autenticación a las solicitudes.
    * `lib/auth-validations.ts`: Define los esquemas de validación con Zod para los formularios de autenticación.
* `types/`: Definiciones de tipos de TypeScript.

### Flujo de Autenticación (Diseño Original)

1.  **`AuthProvider` (contexts/auth-context.tsx)**:
    * Al cargar la aplicación, intenta restaurar la sesión desde `localStorage` (`useEffect` inicial).
    * Proporciona `isAuthenticated`, `isLoading`, `user`, `login` y `logout` a cualquier componente que use el `useAuth` hook.
    * La función `login` realiza una petición `POST` al backend (`/auth/login`), esperando recibir un `token` y un objeto `user`.
    * Si el login es exitoso, guarda el `token` y el `user` en `localStorage` y actualiza el estado del contexto.
    * Un `useEffect` monitorea cambios en `authToken` y `user` para configurar el encabezado `Authorization` de Axios (`api.defaults.headers.common`).

2.  **`AuthGuard` (components/auth-guard.tsx)**:
    * Se encarga de la protección de rutas.
    * Utiliza `isAuthenticated` y `isLoading` del `AuthContext`.
    * Si el contexto está cargando (`isLoading` es `true`), muestra un mensaje de "Cargando sesión..." para evitar "flashes" de contenido.
    * Si el usuario está autenticado y en una ruta pública (`/login`, `/register`), lo redirige al dashboard (`/`).
    * Si el usuario no está autenticado y en una ruta privada, lo redirige a la página de login (`/login`).

3.  **`LoginPage` (components/login-page.tsx)**:
    * Maneja el formulario de inicio de sesión.
    * Utiliza `useAuth` para acceder a la función `login` y al estado de autenticación.
    * Después de un intento de login, un `useEffect` monitorea el estado `isAuthenticated` para redirigir al usuario al dashboard si el login fue exitoso.

### Carga de Datos Protegidos

* **`RestaurantProvider` (contexts/restaurant-context.tsx)**:
    * Este contexto maneja la carga de datos como productos y órdenes.
    * Las funciones `fetchProducts` y `fetchOrders` están envueltas en `useCallback` y dependen de `isAuthenticated`.
    * Un `useEffect` en `RestaurantProvider` dispara estas funciones de `fetch` solo cuando el `AuthContext` ha terminado de cargar (`!isAuthLoading`) y el usuario está autenticado (`isAuthenticated`). Esto busca prevenir peticiones `401 Unauthorized` prematuras.

---