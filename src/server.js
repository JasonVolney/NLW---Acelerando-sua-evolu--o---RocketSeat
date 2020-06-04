const express = require("express")
const server = express()


//configurar pasta pública
server.use(express.static("public"))


//Utilizado template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server, 
    noCache: true
} )



//configurar caminhos da minha aplicação
//pagina inicial
//req: Requisição
//res: Resposta
server.get("/", (req, res) => {
    return res.render("index.html", {title: "Seu marketplace de coleta de resíduos"})
})

//res: Resposta
server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})

server.get("/search", (req, res) => {
    return res.render("search-results.html")
})

//Modelo (era assim)
// server.get("/search-results", (req, res) => {
//     res.sendFile(__dirname + "/views/search-results.html")
// })
//ligar o servidor
server.listen(3000)
