const Message = require("./models/Message");
const User = require("./models/User");

module.exports = httpServer => {
    const { Server } = require("socket.io");

    const io = new Server(httpServer);

    // Un socket es una conexión entre el cliente y el servidor
    // que permite la comunicación en tiempo real entre ambos.

    const parseCookies = cookieHeader => {
        if (!cookieHeader) return {};
        return cookieHeader.split(";").reduce((acc, part) => {
            const [key, ...value] = part.trim().split("=");
            acc[key] = decodeURIComponent(value.join("="));
            return acc;
        }, {});
    };

    io.on("connection", socket => {
        (async () => {
            const messages = await Message.find({})
                .sort({ timeStamp: -1 })
                .limit(50)
                .lean();

            socket.emit("messages:init", messages.reverse());
        })();

        socket.on("message", async message => {
            const cookies = parseCookies(socket.handshake.headers.cookie || "");
            const user = cookies.username;
            if (!user) return;

            const userDoc = await User.findOne({ username: user });
            const avatarUrl = userDoc?.avatarUrl || "/img/avatar-default.svg";
            const timeStamp = new Date().getTime();

            const saved = await Message.create({
                user,
                avatarUrl,
                text: message,
                timeStamp,
            });

            io.emit("message", {
                id: saved._id.toString(),
                user,
                message,
                avatarUrl,
                timeStamp,
            });
        });

        socket.on("typing", () => {
            const cookies = parseCookies(socket.handshake.headers.cookie || "");
            const user = cookies.username;
            if (!user) return;

            socket.broadcast.emit("typing", { user });
        });

        socket.on("stopTyping", () => {
            const cookies = parseCookies(socket.handshake.headers.cookie || "");
            const user = cookies.username;
            if (!user) return;

            socket.broadcast.emit("stopTyping", { user });
        });

        socket.on("deleteMessage", async ({ id }) => {
            const cookies = parseCookies(socket.handshake.headers.cookie || "");
            const user = cookies.username;
            if (!user || !id) return;

            const msg = await Message.findById(id);
            if (!msg || msg.user !== user) return;

            await Message.deleteOne({ _id: id });
            io.emit("messageDeleted", { id });
        });

        socket.on("editMessage", async ({ id, text }) => {
            const cookies = parseCookies(socket.handshake.headers.cookie || "");
            const user = cookies.username;
            if (!user || !id || !text) return;

            const msg = await Message.findById(id);
            if (!msg || msg.user !== user) return;

            msg.text = text;
            await msg.save();
            io.emit("messageUpdated", { id, text });
        });
    });

    return io;
};