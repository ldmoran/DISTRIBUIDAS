# Tarea Autónoma: Pruebas de Estrés en Node.js - I/O vs. CPU

**Asignatura:** Aplicaciones Distribuidas

**Docente:** Ing. Paulo César Galarza Sánchez, Mgs.

## 1. Título

Demostrar mediante pruebas de estrés la diferencia operativa entre la concurrencia de E/S ($I/O$ Concurrency) y el paralelismo de CPU, analizando el impacto del bloqueo del Event Loop en la latencia.

## 2. Objetivo de Aprendizaje

El estudiante será capaz de:

* Implementar y diferenciar una tarea asíncrona (ligada a $I/O$) y una tarea síncrona (ligada a CPU) en una aplicación Node.js existente.
* Utilizar una herramienta de pruebas de estrés para medir el rendimiento (latencia y peticiones por segundo) de ambos tipos de tareas.
* Analizar y explicar con datos concretos cómo un cómputo intensivo en CPU puede bloquear el Event Loop, degradando el rendimiento de toda la aplicación, en contraste con operaciones de $I/O$ que no lo hacen.
* Conectar los resultados prácticos con los conceptos teóricos de Event Loop, macro-tasks y non-blocking $I/O$.

---

## 3. Metodología y Desarrollo (Paso a Paso)

Para esta actividad, modificarán el proyecto del chat que han desarrollado. Añadirán dos nuevos endpoints o rutas que nos servirán como "conejillos de indias" para nuestros experimentos.

### Paso 1: Preparación del Entorno

Necesitamos una herramienta para simular la carga de muchos usuarios (pruebas de estrés). Usaremos **autocannon**, que es muy sencilla y efectiva.

1. Abran una terminal en la raíz de su proyecto.
2. Instalen autocannon como una dependencia de desarrollo:
```bash
npm install --save-dev autocannon

```



### Paso 2: Creación del Endpoint de Concurrencia de $I/O$

Este endpoint simulará una operación común y no bloqueante, como leer un archivo del disco.

1. Abran el archivo de rutas: `src/routes/index.js`.
2. Añadan el siguiente código para crear una ruta `/io-test`. Esta ruta leerá de forma asíncrona el archivo `package.json` y lo devolverá como respuesta.

```javascript
// Dentro de src/routes/index.js, añadan esto al final del archivo
const fs = require('fs');
const path = require('path');

// (el código existente de router.get('/', ...) y router.get('/register', ...) debe permanecer)

/**
 * @route GET /io-test
 * @description Endpoint para demostrar la concurrencia de I/O.
 * Lee un archivo de forma asíncrona sin bloquear el Event Loop.
 */
router.get('/io-test', (req, res) => {
    // Obtenemos la ruta absoluta al package.json
    const filePath = path.join(__dirname, '', '', 'package.json');
    
    // fs.readFile es una operación de I/O asíncrona.
    // Node.js delega la lectura al sistema operativo y el callback
    // se encolará en la Macrotask Queue cuando la lectura termine.
    // Mientras tanto, el Event Loop sigue libre para atender otras peticiones.
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al leer el archivo.');
        }
        res.type('json').send(data);
    });
});

```

---

### Paso 3: Creación del Endpoint de Bloqueo de CPU

Ahora, crearemos una ruta que simule un cálculo matemático pesado. Esta operación será síncrona y mantendrá ocupada la CPU, bloqueando el Event Loop.

1. En el mismo archivo `src/routes/index.js`, añadan esta otra ruta debajo de la ruta `/io-test`:

```javascript
/**
 * @route GET /cpu-block
 * @description Endpoint para demostrar el bloqueo del Event Loop.
 * Realiza un cálculo síncrono intensivo que acapara la CPU.
 */
router.get('/cpu-block', (req, res) => {
    // Esta función es síncrona y pesada.
    // Mientras se ejecuta, el Event Loop está completamente bloqueado
    // y no puede procesar NINGUNA otra petición (ni del chat, ni de I/O, etc).
    const resultado = calcularFibonacci(40); // Usamos un número alto para que tarde lo suficiente
    res.send(`El resultado del cálculo intensivo es: ${resultado}`);
});

// Función auxiliar para simular trabajo de CPU
function calcularFibonacci(num) {
    if (num <= 1) return 1;
    return calcularFibonacci(num - 1) + calcularFibonacci(num - 2);
}

```

---

### Paso 4: La Prueba de Fuego - Stress Testing

Ahora vamos a bombardear nuestros endpoints y a comparar los resultados.

1. Asegúrense de que su servidor esté corriendo. En la terminal, ejecuten:
```bash
node src/index.js

```


2. Abran OTRA terminal.
3. **Prueba 1: Bombardeo al endpoint de $I/O$.** Ejecuten el siguiente comando. Simulará 10 conexiones concurrentes durante 10 segundos.
```bash
npx autocannon -c 10 -d 10 http://localhost:3000/io-test

```


Observen y anoten los resultados: presten especial atención a la latencia media (*Latency Avg*) y al número de peticiones por segundo (*Req/Sec Avg*).
4. **Prueba 2: Bombardeo al endpoint de CPU.** Ahora, hagan lo mismo pero apuntando a la ruta que bloquea la CPU.
```bash
npx autocannon -c 10 -d 10 http://localhost:3000/cpu-block

```


Observen y comparen: ¿Qué pasó con la latencia? ¿Y con las peticiones por segundo? La diferencia debería ser drástica.

### Paso 5: Análisis y Reflexión

Este es el núcleo de la tarea. Con los datos de autocannon en mano, deben responder a las siguientes preguntas en su informe o presentación:

1. ¿Cuáles fueron los resultados (latencia y Req/Sec) para `/io-test` y para `/cpu-block`? Presenten una tabla comparativa.
2. ¿Por qué el endpoint `/io-test` pudo manejar tantas peticiones con baja latencia? Expliquen el rol del `fs.readFile` como operación asíncrona y cómo el Event Loop delega este trabajo.
3. ¿Por qué el endpoint `/cpu-block` tuvo un rendimiento tan pobre? Expliquen qué significa que el "Event Loop está bloqueado" en el contexto de la función `calcularFibonacci`.
4. Si mientras se ejecuta la prueba de estrés contra `/cpu-block`, intentan abrir la página del chat (`http://localhost:3000/`) en su navegador, ¿qué ocurre? ¿Por qué? *(Pista: Hagan el intento).*
5. Concluyan con una recomendación para otros desarrolladores de Node.js: ¿Qué tipo de tareas se deben evitar a toda costa en el hilo principal y qué alternativas existen? *(No es necesario implementar las alternativas, solo mencionarlas teóricamente).*

---

## 4. Estructura de la Presentación (Demostración en Vivo)

Deberán realizar una demostración en vivo (**5-7 minutos**) donde demuestren sus hallazgos. La estructura debe ser:

1. **Contexto (1 min):** Breve recordatorio del objetivo de la tarea: demostrar el impacto del bloqueo del Event Loop.
2. **Demostración del Código (1 min):** Muestren rápidamente las dos rutas (`/io-test` y `/cpu-block`) y expliquen su propósito (una es asíncrona/I/O, la otra es síncrona/CPU).
3. **Ejecución en Vivo (3 min):**
* Ejecuten la prueba de autocannon contra `/io-test`. Muestren los resultados en la terminal y destaquen la baja latencia y el alto número de peticiones.
* Ejecuten la prueba contra `/cpu-block`. Muestren los resultados y enfaticen el dramático aumento de la latencia y la caída en las peticiones.
* Mientras la prueba de CPU está corriendo, intenten cargar la página principal para demostrar que todo el servidor está "congelado".


4. **Análisis y Conclusiones (2 min):** Expliquen verbalmente por qué ocurrieron esas diferencias, usando los conceptos de Event Loop, non-blocking $I/O$ y single-thread. Finalicen con su recomendación principal para el desarrollo en Node.js.

> **Nota:** No es necesario un informe escrito extenso, pero sí deben tener preparados los comandos y una idea clara de lo que van a explicar. Su análisis verbal durante la demostración será clave para la evaluación.

---

## 5. Rúbrica de Calificación

| Criterio de Evaluación | Nivel 1: Insuficiente (1 Pts) | Nivel 2: Suficiente (3 Pts) | Nivel 3: Destacado (5 Pts) |
| --- | --- | --- | --- |
| **1. Implementación Técnica** | No implementa las rutas o el código contiene errores que impiden su funcionamiento. | Implementa correctamente ambas rutas (`/io-test` y `/cpu-block`) y estas son funcionales. | Implementa las rutas de forma limpia, añadiendo comentarios que explican claramente la naturaleza (asíncrona/síncrona) de cada una. |
| **2. Ejecución de Pruebas** | No logra ejecutar las pruebas de estrés o no presenta los resultados obtenidos. | Ejecuta las pruebas de estrés con autocannon en ambos endpoints y muestra los resultados numéricos (latencia, Req/Sec). | Ejecuta las pruebas y, además, demuestra en vivo el bloqueo del servidor al intentar acceder a otra ruta durante la prueba de CPU. |
| **3. Análisis y Argumentación** | Presenta los datos pero no logra explicar la causa de las diferencias de rendimiento. | Explica correctamente que la ruta de CPU bloquea el servidor, pero la conexión con la teoría del Event Loop es superficial. | Articula con claridad y precisión cómo el Event Loop es bloqueado por la tarea de CPU síncrona, y cómo es liberado por la operación de $I/O$ asíncrona, demostrando un dominio conceptual sólido. |
| **4. Claridad y Conclusiones** | La presentación es desorganizada y las conclusiones son inexistentes o incorrectas. | La presentación sigue la estructura solicitada y finaliza con una conclusión válida sobre evitar tareas de CPU en Node.js. | La presentación es fluida, profesional, y la conclusión no solo es correcta, sino que también sugiere alternativas teóricas (ej. Worker Threads, microservicios) para manejar cómputo pesado. |