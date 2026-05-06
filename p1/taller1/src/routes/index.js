const express = require('express');
const router = express.Router();//módulo para manejar rutas
const path = require('path');//módulo para trabajar con rutas de archivos

const views = path.join(__dirname, '/../views');//ruta de la carpeta de vistas
router.get('/', (req, res) => {
    res.sendFile(views + "/index.html");//enviar el archivo index.html como respuesta a la ruta raíz
});
module.exports = router;//exportar el router para usarlo en el archivo principal