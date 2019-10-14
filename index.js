express = require("express")
bodyParser = require("body-parser")
fs = require("fs")
app = express()
port = process.env.PORT||3000
function server(res,req){
  if(res.url == "/"){
    fs.createReadStream("./index.html").pipe(req)
  }else if(res.url =="/script.js"){
    fs.createReadStream("./script.js").pipe(req)
  }else if(res.url == "/style.css"){
    req.writeHead(200,{"Content-Type":"text/css"})
    fs.createReadStream("./style.css").pipe(req)
  }else if(res.method == "GET"){
    fs.createReadStream("./notfound.html").pipe(req)
  }else if(res.method == "POST"){
    req.end("Oops! Page not found!")
  }
}
app.get('/blog/:id',(res,req)=>{
  fs.access(`Blogs/./${res.params.id}.html`,error =>{
    if(!error){
      fs.createReadStream(`Blogs/./${res.params.id}.html`).pipe(req)
    }else{
      req.write(`Blog ${res.params.id} was not found`)
      req.end()
    }
  })
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(server)
app.listen(port,(err)=>{
  if(err){
    throw err
  }
  console.log(`Listening on port ${port}`)
})