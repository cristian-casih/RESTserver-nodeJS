const express = require("express")
let {
  verificaToken,
  vericaAdmin_Role
} = require("../middlewares/autenticacion")
let app = express()
let Categorias = require("../models/categoria")

app.get("/categoria", verificaToken, (req, res) => {
  Categorias.find({})
    .populate("usuario")
    .sort("description")
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: true,
          message: err
        })
      }
      if (!categorias) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No existen categorias"
          }
        })
      }
      res.status(200).json({
        categorias
      })
    })
})
app.post("/categoria", verificaToken, (req, res) => {
  let body = req.body
  let newCategoria = new Categorias({
    description: body.description,
    usuario: req.usuario._id
  })

  newCategoria.save((err, categoria) => {
    if (err) {
      return res.status(500).json({
        ok: true,
        err
      })
    }
    if (!categoria) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No existe la categoria"
        }
      })
    }
    res.status(200).json({
      ok: true,
      categoria
    })
  })
})
app.get("/categoria/:id", (req, res) => {
  Categorias.findById(req.params.id, (err, categoria) => {
    if (err) {
      return res.status(500).json({
        ok: true,
        message: "Error al buscar la categoria"
      })
    }
    if (!categoria) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No existe la categoria"
        }
      })
    }
    res.status(200).json({
      ok: true,
      categoria
    })
  })
})
app.put("/categoria/:id", verificaToken, (req, res) => {
  let id = req.params.id
  let body = req.body
  let desCategoria = {
    description: body.description
  }
  Categorias.findByIdAndUpdate(
    id,
    desCategoria,
    { new: true, runValidators: true },
    (err, categoria) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        })
      }
      if (!categoria) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "No existe la categoria"
          }
        })
      }
      res.json({
        ok: true,
        messagge: "categoria actualizada",
        categoria
      })
    }
  )
})
app.delete("/categoria/:id", [verificaToken, vericaAdmin_Role], (req, res) => {
  Categorias.findOneAndDelete(req.params.id, (err, categoria) => {
    if (err) {
      return res.status(404).json({
        ok: true,
        message: err
      })
    }
    if (!categoria) {
      return res.status(404).json({
        ok: false,
        err: {
          message: "No existe la categoria"
        }
      })
    }
    res.status(200).json({
      err: false,
      messagge: "Categoria eliminada"
    })
  })
})
module.exports = app
