const express = require("express")
let { verificaToken } = require("../middlewares/autenticacion")
let Producto = require("../models/producto")

let app = express()

app.get("/producto", verificaToken, (req, res) => {
  let desde = req.query.desde || 0
  desde = Number(desde)

  let limite = req.query.limite || 5
  limite = Number(limite)

  Producto.find({})
    .populate("Categoria")
    .populate("Usuario")
    .skip(desde)
    .limit(limite)
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: true,
          err: {
            message: "Error en la consulta de Productos"
          }
        })
      }
      if (!productos) {
        return res.status(404).json({
          ok: false,
          err: {
            message: "No existen productos"
          }
        })
      }
      res.status(200).json({
        productos
      })
    })
})
app.post("/producto", verificaToken, (req, res) => {
  let body = req.body
  let newProducto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
  })
  newProducto.save((err, producto) => {
    if (err) {
      return res.status(500).json({
        ok: true,
        err
      })
    }
    if (!producto) {
      return res.status(400).json({
        ok: false,
        err: {
          msg: "No existe la producto"
        }
      })
    }
    res.status(200).json({
      ok: true,
      producto
    })
  })
})
app.put("/producto/:id", verificaToken, (req, res) => {
  let id = req.params.id
  let body = req.body
  let desProducto = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
  }
  Producto.findByIdAndUpdate(
    id,
    desProducto,
    { new: true, runValidators: true },
    (err, producto) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.json({
        ok: true,
        messagge: "categoria actualizada",
        producto
      })
    }
  )
})
module.exports = app
