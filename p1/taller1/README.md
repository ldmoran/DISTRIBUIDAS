
# ESPEChat
# link del video: https://youtu.be/ybjHkR1Y1Jo
## Descripcion
Yo implemente un chat en tiempo real con soporte de usuarios, fotos de perfil y persistencia en MongoDB. Incluye indicador de escritura, edicion y eliminacion de mensajes, y modo oscuro en el frontend.

## Funcionalidades
- Registro con nombre de usuario y foto (JPG/PNG).
- Foto de perfil actualizable desde el chat.
- Chat en tiempo real con Socket.IO.
- Indicador de "esta escribiendo" debajo de los mensajes.
- Mensajes guardados en MongoDB y carga inicial de historial.
- Edicion y eliminacion de mensajes propios con doble clic.
- Eliminacion en tiempo real para todos.
- Modo oscuro con toggle en el header.

## Tecnologias
- Node.js, Express
- Socket.IO
- MongoDB, Mongoose
- Multer para uploads
- SweetAlert2 para el menu de acciones

## Configuracion
1. Instalar dependencias:
	- npm install
2. Tener MongoDB corriendo en localhost:27017.
3. Si quieres, puedes definir la variable de entorno:
	- MONGO_URI=mongodb://localhost:27017/espechat

## Ejecutar
- npm start
- Abrir http://localhost:3000

## Notas de uso
- El historial carga los ultimos 50 mensajes.
- Solo el autor puede editar o eliminar sus mensajes.
- Las fotos se guardan en /public/uploads y se asocian al usuario.
