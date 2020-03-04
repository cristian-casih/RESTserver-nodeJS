const express = require('express')
const fs = require('fs')
const path = require('path')
let app = express()
const { verificaTokenImg } = require('../middlewares/autenticacion')

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
  let pathImg = path.resolve(
    __dirname,
    `../../uploads/${req.params.tipo}/${req.params.img}`
  )

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg)
  } else {
    let noImagePath = path.resolve(__dirname, '../../assets/no-image.jpg')
    res.sendFile(noImagePath)
  }
})
module.exports = app
