const getusu = require('./getApi')
const enviar = require('./mailer')
const http = require('http')
const fs = require('fs')
http
.createServer(function (req, res) {
    let datausuarioJSON = JSON.parse(fs.readFileSync("usuarios.json", "utf8"));
    let datapremioJSON = JSON.parse(fs.readFileSync("premio.json", "utf8"));
    let usuarios = datausuarioJSON.usuarios;
    let correos = []
    correos.push('christopher.aguilera.mad@gmail.com')
    if (req.url.startsWith('/') && req.method == "GET") {
        res.setHeader('content-type', 'text/html')
        fs.readFile('index.html', 'utf8', (err, data) => {
        if(err) throw err
        res.end(data)
        })
    }
    if ((req.url.startsWith('/usuario')) && req.method == "POST") {
        //asincrona
        getusu(correos, usuarios, datausuarioJSON, res)      
    }  
    if (req.url.startsWith('/usuarios') && req.method == "GET") {
        res.end(JSON.stringify(datausuarioJSON));
    }
    if (req.url.startsWith('/premio') && req.method == "GET") {
        res.end(JSON.stringify(datapremioJSON));
    }
    if (req.url.startsWith('/premio') && req.method == "PUT") {
        let body;
        req.on("data", (payload) => {
            body = JSON.parse(payload);
        });
        req.on("end", () => {
            fs.writeFileSync("premio.json", JSON.stringify(body));
            res.end();
        });
    }
    if (req.url.startsWith('/ganador') && req.method == "GET") {
        if (usuarios.length > 0){
            usuarios.forEach(element => {
                correos.push(element.correo)
            });
            const random = Math.floor(Math.random() * (usuarios.length));
            let ganador = usuarios[random]
            console.log(random)
            var myString = JSON.stringify(ganador);
            res.writeHead(200, { 'Content-Type': 'application/json' })
            let mensaje = `El ganador de ¿Quien ganara? fue ${ganador.nombre}, gracias a todos por participar`
            enviar(correos, mensaje)
            res.end(myString)
        }
        else{
            alert('ingrese usuarios')
        }
    }
})
.listen(3000, () => console.log('Escuchando el puerto 3000'))