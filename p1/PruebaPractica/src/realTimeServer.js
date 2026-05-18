module.exports = (httpServer) => {
  const { Server } = require("socket.io");
  const io = new Server(httpServer);

  const getUserFromCookie = (cookieHeader) => {
    if (!cookieHeader) {
      return "Anon";// Si no hay cookies, asignamos un nombre genérico
    }

    const parts = cookieHeader.split(";").map((item) => item.trim());
    const userCookie = parts.find((item) => item.startsWith("username="));
    if (!userCookie) {
      return "Anon";// Si no se encuentra la cookie, devolvemos "Anon"
    }

    return decodeURIComponent(userCookie.split("=")[1] || "Anon");// Si no se encuentra el valor, devolvemos "Anon"
  };

  io.on("connection", (socket) => {
    socket.on("alert", ({ message, type }) => {
      const user = getUserFromCookie(socket.request.headers.cookie);

      io.emit("alert", {
        user,
        message,
        type,
        date: new Date().toLocaleTimeString(),
      });
    });
  });
};
