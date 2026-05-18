const numeros = [1, 2, 3, 4, 5];
numeros.forEach(function(numero) { //función tradicional que recibe un número como argumento y lo imprime en la consola
    console.log(numero);
});
numeros.forEach(numero => console.log(numero));//arrow function que hace lo mismo que la función tradicional pero con una sintaxis más concisa

const dobles = numeros.map(numero => numero * 2); //map que recibe una función de flecha que multiplica cada número por 2 y devuelve un nuevo array con los resultados
console.log(dobles);
//elk filter es una función de orden superior que recibe una función de flecha como argumento y devuelve un nuevo array con los elementos que cumplen la condición especificada en la función de flecha. En este caso, la función de flecha multiplica cada número por 2, pero no devuelve un valor booleano para filtrar los elementos, por lo que el resultado es un array vacío. Para obtener el resultado esperado, se debería usar el método map en lugar de filter.
// y el calback seria numeros.map(numero => numero * 2) que devuelve un nuevo array con los números multiplicados por 2.

//calback asincronos
console.log("antes");
[1, 2, 3].forEach(n => console.log(n)); //función de flecha que recibe un número como argumento y lo imprime en la consola
console.log("después");
//el resultado de este código es "antes", luego los números 1, 2 y 3, y finalmente "después". Esto se debe a que el método forEach es síncrono, lo que significa que se ejecuta en orden y bloquea la ejecución del código hasta que se complete. Por lo tanto, "después" se imprime después de que se hayan impreso los números.{
//Asicrono:
console.log("inicio");
setTimeout(() => console.log('timeout 1'), 100); //función de flecha que se ejecuta después de un retraso de 100 milisegundos y imprime "timeout
