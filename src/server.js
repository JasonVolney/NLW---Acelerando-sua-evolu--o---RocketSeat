const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db")


//configurar pasta pública
server.use(express.static("public"))

// habilitar o uso do req.body da nossa aplicação
server.use(express.urlencoded({extended: true}))

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

    //req.query:Query Strings da nossa url
    // console.log(req.query)
      
    return res.render("create-point.html") //testando
})

server.post("/savepoint", (req, res) => {

    //req.body: O corpo do nosso formulário
    // console.log(req.body)  

    //inserir dados no banco de dados
    const query = `
    INSERT INTO places (
        id,               
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (NULL,?,?,?,?,?,?,?);
` 
    
    const values = [        
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items         

    ]
             
    
      
    function afterInsertData(err){
        if(err){
            console.log(err)
            return res.render("create-point.html") 
        }           


        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html")
    }
    db.run(query, values, afterInsertData)


    
})

server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }



    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city = '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }
        console.log("Aqui estão seus registros: ")
        console.log(rows)

        const total = rows.length

        //mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total: total})
    })
})

// server.get("/search", (req, res) => {
    
// })

//Modelo (era assim)
// server.get("/search-results", (req, res) => {
//     res.sendFile(__dirname + "/views/search-results.html")
// })
//ligar o servidor
server.listen(3000)
