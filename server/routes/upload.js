const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')

app.use(fileUpload({ useTempFiles: true }))

app.put('/upload/:tipo/:id', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No files were uploaded.'
      }
    })
  }
  let tipo = req.params.tipo
  let id = req.params.id
  let archivo = req.files.archivo
  let nombreCortado = archivo.name.split('.')
  let extension = nombreCortado[nombreCortado.length - 1]

  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']
  let tiposValidos = ['productos', 'usuarios']

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          'Las extensiones permitidas son ' + extensionesValidas.join(', ')
      },
      ext: extension
    })
  }
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Las tipos permitidos son ' + tiposValidos.join(', ')
      }
    })
  }
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (tipo === 'productos') {
      imagenProducto(id, res, nombreArchivo)
    } else {
      imagenUsuario(id, res, nombreArchivo)
    }
  })
  function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
      if (err) {
        borrarAchivo(nombreArchivo, 'usuarios')
        return res.status(500).json({
          ok: false,
          err
        })
      }
      if (!usuarioDB) {
        borrarAchivo(nombreArchivo, 'usuarios')
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Usuario no existe '
          }
        })
      }
      borrarAchivo(usuarioDB.img, 'usuarios')
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
  function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
      if (err) {
        borrarAchivo(nombreArchivo, 'productos')
        return res.status(500).json({
          ok: false,
          err
        })
      }
      if (!productoDB) {
        borrarAchivo(nombreArchivo, 'productos')
        return res.status(400).json({
          ok: false,
          err: {
            message: 'EL producto no existe '
          }
        })
      }
      borrarAchivo(productoDB.img, 'productos')
      productoDB.img = nombreArchivo

      productoDB.save((err, productoGuardado) => {
        res.status(200).json({
          ok: true,
          producto: productoGuardado,
          img: nombreArchivo
        })
      })
    })
  }
  function borrarAchivo(nombreArchivo, tipo) {
    let pathImagen = path.resolve(
      __dirname,
      `../../uploads/${tipo}/${nombreArchivo}`
    )
    if (fs.existsSync(pathImagen)) {
      //devuelve un boolean si existe o no
      fs.unlinkSync(pathImagen) //unlinkSync borra el archivo
    }
  }
})
module.exports = app
