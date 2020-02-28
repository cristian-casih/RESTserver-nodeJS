require("./config/config")

const express = require("express")
const moongose = require("mongoose")
const path = require("path")

const app = express()

const bodyParser = require("body-parser")

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//parse aplication/json
app.use(bodyParser.json())

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, "../public")))

//Configuracion global de rutas
app.use(require("./routes/index"))

moongose.connect(
  process.env.URLDB,
  { useNewUrlParser: true, useCreateIndex: true },
  (err, res) => {
    if (err) throw err
    console.log("DB connect..")
  }
)

app.listen(process.env.PORT, () => {
  console.log("Escuchando el puerto: ", process.env.PORT)
})
