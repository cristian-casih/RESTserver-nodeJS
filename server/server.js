require("./config/config")

const express = require("express")
const moongose = require("mongoose")

const app = express()

const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(require("./routes/usuario"))

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
