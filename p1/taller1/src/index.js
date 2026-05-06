const express = require('express');
const http = require('http');
const realTimeServer = require('./realTimeServer');
const path = require('path');

const app = express();
const httpserver = http.createServer(app);

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));

app.use(require('./routes'));

app.use(express.static(path.join(__dirname, 'public')));

httpserver.listen(app.get('port'), () => {
    console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});

realTimeServer(httpserver);