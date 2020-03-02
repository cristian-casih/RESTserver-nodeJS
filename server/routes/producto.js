const express = require("express")
let {
  verificaToken,
  vericaAdmin_Role
} = require("../middlewares/autenticacion")
let app = express()
let Producto = require("../models/producto")