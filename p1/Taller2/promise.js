const promesa = new Promise((resolve, reject) => {
    // Lógica asíncrona
    setTimeout(() => {
        const exito = true; // o false
        if (exito) {
            resolve("Operación exitosa");
        } else {
            reject("Operación fallida");
        }
    }, 1000);
});
console.log(promesa); // Imprime el estado de la promesa (pendiente)