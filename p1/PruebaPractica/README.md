# ESPE-Alert — Sistema de Alertas de Emergencia

Proyecto final para Desarrollo de Aplicaciones en Red. Arquitectura basada en ESPEChat (Node/Express/Socket/Cookies) aplicada a un sistema de alertas en tiempo real.

## Resumen del proyecto
- Los usuarios se identifican una sola vez en el registro.
- Se guarda `username` en cookie.
- El panel de alertas esta protegido por middleware.
- Las alertas se transmiten en tiempo real a todos los clientes con emisor, hora y tipo.

## Estructura y ubicacion de cada parte
- Servidor Express + HTTP: [src/index.js](src/index.js)
- Rutas del sistema: [src/routes/index.js](src/routes/index.js)
- Middleware de acceso: [src/middleware/isLoggedIn.js](src/middleware/isLoggedIn.js)
- Servidor de sockets: [src/realTimeServer.js](src/realTimeServer.js)
- Vista del panel: [src/views/index.html](src/views/index.html)
- Vista de registro: [src/views/register.html](src/views/register.html)
- Cliente Socket (panel): [src/public/js/dashboard.js](src/public/js/dashboard.js)
- Logica de registro: [src/public/js/register.js](src/public/js/register.js)
- Tema claro/oscuro: [src/public/js/theme.js](src/public/js/theme.js)
- Estilos base: [src/public/css/base.css](src/public/css/base.css)
- Estilos dashboard: [src/public/css/dashboard.css](src/public/css/dashboard.css)
- Estilos registro: [src/public/css/register.css](src/public/css/register.css)

## Flujo de uso (demo rapida)
1. Iniciar el servidor con `npm start`.
2. Abrir `http://localhost:3000`.
3. Si no hay cookie, redirige a `/register`.
4. Ingresar nombre de emisor y entrar al panel.
5. Enviar una alerta: aparece en todas las ventanas al instante.

## Cumplimiento del enunciado
### Paso 1: Middleware de Acceso Restringido
- Se valida `username` en cookie.
- Si no existe, redirige a `/register`.
- Implementado en [src/middleware/isLoggedIn.js](src/middleware/isLoggedIn.js).

### Paso 2: Registro de Identidad
- Captura nombre del emisor y guarda cookie.
- Redirige automaticamente al panel.
- Implementado en [src/public/js/register.js](src/public/js/register.js) y [src/views/register.html](src/views/register.html).

### Paso 3: Servidor de Alertas en Tiempo Real
- Escucha evento `alert`.
- Lee emisor desde cookie y retransmite a todos con hora.
- Implementado en [src/realTimeServer.js](src/realTimeServer.js).

### Paso 4: Panel de Control e IA
- Dashboard visual con colores de alerta (rojo/amarillo/blanco).
- Lista dinamica de alertas en tiempo real.
- Implementado en [src/views/index.html](src/views/index.html), [src/public/js/dashboard.js](src/public/js/dashboard.js) y estilos en [src/public/css/dashboard.css](src/public/css/dashboard.css).
- Modo claro/oscuro en [src/public/js/theme.js](src/public/js/theme.js) y [src/public/css/base.css](src/public/css/base.css).

## Puntos de la rubrica (mapeo rapido)
- Seguridad de rutas: middleware activo y redireccion correcta.
- Gestion de identidad: cookie `username` usada tanto en vistas como en sockets.
- Sincronizacion de alertas: Socket.IO broadcast instantaneo con metadata.
- Interfaz de emergencia: panel responsivo con estetica de centro de control.

## Notas para la exposicion
- El backend (rutas, sockets, cookies) es de autoria propia.
- La IA solo asistio en la estetica y estructura base del HTML/CSS.
- La arquitectura replica ESPEChat y se adapta al contexto de alertas.
