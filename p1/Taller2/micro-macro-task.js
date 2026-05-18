//setTimeout(() => console.log('timeout 1'), 0);
//setInterval(() => console.log('interval 1'), 1000);

//document.addEventListener('click', () => console.log('click event 1'));//evento de clic 1
//setImmediate(() => console.log("Immediate 1"));
//inmediato 1 que hace que se ejecute después de que 
// se hayan ejecutado todas las tareas pendientes en la cola de microtareas

console.log("inicio");
//promesa 1 que se ejecuta después de que se hayan ejecutado 
// todas las tareas pendientes en la cola de microtareas
setTimeout(() => console.log('timeout 1'), 100);
Promise.resolve().then(() => console.log('promise 1'));
console.log("Fin");
