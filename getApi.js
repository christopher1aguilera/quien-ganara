const { default: Axios } = require("axios")
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const getApi = () =>{
    return Axios.get('https://randomuser.me/api')
        .then(response => response.data.results[0])
        .catch(error=> {console.error(error)})
}

async function getusu(correos, usuarios, datausuarioJSON, res) {
    getApi().then(datos =>{
        let nombre = `${datos.name.title} ${datos.name.first} ${datos.name.last}`
        let correo = `${datos.email}`
        correos = `${correos},${correo}`
        let pais = `${datos.location.country}`
        let imagen = `${datos.picture.thumbnail}`
        let ID = uuidv4().slice(0, 6)
        let info = {nombre: nombre, foto: imagen, pais: pais, correo: correo, id: ID}
        usuarios.push(info);
        fs.writeFileSync("usuarios.json",JSON.stringify(datausuarioJSON));
        if(err) throw err
        fs.readFile('usuarios.json', 'utf8', (err, data) => {
            if(err) throw err
            res.end(data)
        })
    });        
}
module.exports = getusu