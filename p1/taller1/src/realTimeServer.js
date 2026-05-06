module.exports = httpServer => {
    const {Server}= require("socket.io");
    const io = new Server(httpServer);
//que es un socket? es una conexión entre el cliente y el servidor, que permite la comunicación en tiempo real entre ambos.
    io.on("connection", socket => {
        console.log(socket.id);
    });

}