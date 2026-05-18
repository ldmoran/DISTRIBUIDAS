function obtenerPokemon(id) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then
    if (response.ok) {
        throw new Error(`Error al obtener el Pokémon con ID`);
    } else {
        return response.json();
    }
    obtenerPokemon(1).then(pokemon => {
        console.log(pokemon);
    }).catch(error => {
        console.error(error);
    });
}