const express = require('express')
const fs = require('fs')
const path = require('path')
let app = express()

app.get('/imagen/:tipo/:img', (req, res) => {
  let pathImg = `./uploads/${req.params.tipo}/${req.params.img}`
  let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')
  res.sendFile(noImagePath)
})
module.exports = app
