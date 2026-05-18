const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const User = require("../models/User");
const Message = require("../models/Message");
const isLoggedIn = require("../middleware/isLoggedIn");
const views = path.join(__dirname, "/../views");
const uploadsDir = path.join(__dirname, "../public/uploads");
const defaultAvatar = "/img/avatar-default.svg";

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype === "image/png" || file.mimetype === "image/jpeg";
    cb(isImage ? null : new Error("Formato invalido"), isImage);
  },
});

router.get("/", isLoggedIn, (req, res) => {
  res.sendFile(views + "/index.html");
});

router.get("/register", (req, res) => {
  res.sendFile(views + "/register.html");
});

router.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const username = (req.body.username || "").trim();
    if (!username) {
      return res.status(400).send("Nombre requerido");
    }

    const avatarUrl = req.file ? `/uploads/${req.file.filename}` : defaultAvatar;

    await User.findOneAndUpdate(
      { username },
      { username, avatarUrl },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.cookie("username", username, { httpOnly: false });
    return res.redirect("/");
  } catch (error) {
    return res.status(500).send("Error al registrar");
  }
});

router.get("/api/me", async (req, res) => {
  const username = req.cookies.username;
  if (!username) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  return res.json({ username: user.username, avatarUrl: user.avatarUrl });
});

router.post("/profile/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const username = req.cookies.username;
    if (!username) {
      return res.status(401).json({ error: "No autenticado" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Archivo requerido" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findOneAndUpdate(
      { username },
      { avatarUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await Message.updateMany({ user: username }, { avatarUrl });
    req.app.get("io")?.emit("avatarUpdated", { username, avatarUrl });
    return res.json({ username, avatarUrl });
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar" });
  }
});

/**
 * @route GET /io-test
 * @description Endpoint para demostrar la concurrencia de I/O.
 * Lee un archivo de forma asincrona sin bloquear el Event Loop.
 */
router.get("/io-test", (req, res) => {
  const filePath = path.join(__dirname, "..", "..", "package.json");

  // I/O asincrona: el Event Loop queda libre mientras el SO lee el archivo.
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al leer el archivo.");
    }
    res.type("json").send(data);
  });
});

/**
 * @route GET /cpu-block
 * @description Endpoint para demostrar el bloqueo del Event Loop.
 * Realiza un calculo sincrono intensivo que acapara la CPU.
 */
router.get("/cpu-block", (req, res) => {
  // CPU sincrona: el Event Loop se bloquea hasta terminar.
  const resultado = calcularFibonacci(40);
  res.send(`El resultado del calculo intensivo es: ${resultado}`);
});

function calcularFibonacci(num) {
  if (num <= 1) return 1;
  return calcularFibonacci(num - 1) + calcularFibonacci(num - 2);
}

module.exports = router;