//middleware sirve para verificar si el usuario está logueado o no, si no lo está, lo redirige a la página de registro
//en si validaciones, autenticación, autorización, manejo de errores, etc
module.exports = (req, res, next) => {
    if (req.cookies.username) {
        next();//pasa al paso siguiente, que es la función que maneja la ruta
    } else {
        res.redirect("/register");//si no hay usuarios, redirige a la página de registro
    }
}