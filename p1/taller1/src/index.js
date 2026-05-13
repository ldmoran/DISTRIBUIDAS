const express = require("express");
const { createServer } = require("http");
const realTimeServer = require("./realTimeServer");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();
const httpServer = createServer(app);

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/espechat";
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error MongoDB:", err));

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(require("./routes"));

app.use(express.static(path.join(__dirname, "public")));

httpServer.listen(app.get("port"), () => {
  console.log("La aplicación esta corriendo en el puerto ", app.get("port"));
});

const io = realTimeServer(httpServer);
app.set("io", io);