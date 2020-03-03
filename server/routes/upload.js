const express = require("express")
const fileUpload = require("express-fileupload")
const app = express()
const Usuario = require("../models/usuario")

app.use(fileUpload({ useTempFiles: true }))

app.put("/upload/:tipo/:id", function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No files were uploaded."
      }
    })
  }
  let tipo = req.params.tipo
  let id = req.params.id
  let archivo = req.files.archivo
  let nombreCortado = archivo.name.split(".")
  let extension = nombreCortado[nombreCortado.length - 1]

  let extensionesValidas = ["png", "jpg", "gif", "jpeg"]
  let tiposValidos = ["productos", "usuarios"]

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          "Las extensiones permitidas son " + extensionesValidas.join(", ")
      },
      ext: extension
    })
  }
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Las tipos permitidos son " + tiposValidos.join(", ")
      }
    })
  }
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
    if (err)
      return res.status(500).json({
        ok: false,
        err
      })
    imagenUsuario(id, res)
  })
  function imagenUsuario(id, res) {
    Usuario.findById(id, (err, usuarioDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      if (!usuarioDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario no existe "
          }
        })
      }
      usuarioDB.img = nombreArchivo

      usuarioDB.save((err, usuarioGuardado) => {
        res.status(200).json({
          ok: true,
          usuario: usuarioGuardado,
          img: nombreArchivo
        })
      })
    })
  }
})
module.exports = app
