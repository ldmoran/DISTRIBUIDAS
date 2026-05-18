# Guia rapida para la exposicion: I/O vs CPU en Node.js

## 1) Objetivo de la tarea
Demostrar con pruebas de estres la diferencia entre:
- Concurrencia de I/O (no bloquea el Event Loop)
- Bloqueo por CPU (si bloquea el Event Loop)

## 2) Que se implemento en el chat
Se agregaron dos endpoints al servidor existente:
- GET /io-test: lectura asincrona de package.json (I/O no bloqueante).
- GET /cpu-block: calculo sincronico Fibonacci(40) (CPU bloqueante).

Estas rutas sirven como "conejillos de indias" para medir latencia y Req/Sec.

## 3) Como ejecutar
1. Instalar dependencias:
   npm install
2. Iniciar servidor:
   npm start
3. Probar en otra terminal con autocannon:
   npx autocannon -c 10 -d 10 http://localhost:3000/io-test
   npx autocannon -c 10 -d 10 http://localhost:3000/cpu-block

## 4) Resultados obtenidos (ejemplo real)
| Endpoint   | Latencia Avg | Req/Sec Avg |
|-----------|--------------|-------------|
| /io-test  | 1.37 ms      | 5159.3      |
| /cpu-block| 5399.64 ms   | 1.11        |

Interpretacion rapida:
- /io-test responde rapido y maneja miles de peticiones por segundo.
- /cpu-block se vuelve lento y solo procesa ~1 peticion por segundo.

## 5) Explicacion tecnica corta (para decirla en clase)
- Node.js tiene un solo hilo principal con un Event Loop.
- Cuando se hace I/O asincrono (fs.readFile), Node delega al SO y el Event Loop sigue libre.
- Cuando se hace un calculo sincronico pesado (Fibonacci), el Event Loop se bloquea.
- Si el Event Loop esta bloqueado, todo el servidor se congela (chat, rutas, etc).

## 6) Demostracion en vivo (guion de 5-7 min)
1. Contexto (1 min): objetivo de la prueba (I/O vs CPU).
2. Mostrar codigo (1 min): endpoints /io-test y /cpu-block.
3. Ejecutar tests (3 min):
   - Autocannon contra /io-test (latencia baja, muchas req/s).
   - Autocannon contra /cpu-block (latencia alta, pocas req/s).
   - Mientras corre /cpu-block, abrir http://localhost:3000/ y ver que se congela.
4. Analisis y cierre (2 min):
   - I/O asincrono no bloquea.
   - CPU pesado bloquea el Event Loop.
   - Recomendacion: evitar CPU pesado en hilo principal.

## 7) Conclusiones para mencionar
- Evitar tareas CPU intensivas en el hilo principal.
- Alternativas: Worker Threads, procesos separados, microservicios o colas de trabajo.

## 8) Frases cortas para explicar
- "I/O asincrono libera el Event Loop, por eso responde rapido."
- "CPU sincronica bloquea el Event Loop, por eso se congela el servidor."
- "Node.js es single-thread para JavaScript, por eso este efecto es fuerte."
