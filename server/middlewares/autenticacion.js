const jwt = require('jsonwebtoken')
//============================
// Verificacion de Token
//============================

let verificaToken = (req, res, next) => {
  let token = req.get('token') // Authorization

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no valido'
        }
      })
    }
    req.usuario = decoded.usuario
    next()
  })
}
//============================
// Verificacion de Rol Admin
//============================

let vericaAdmin_Role = (req, res, next) => {
  let usuario = req.usuario

  if (usuario.role === 'ADMIN_ROLE') {
    next()
  } else {
    return res.json({
      ok: false,
      err: {
        message: 'El usuario no es Administrador'
      }
    })
  }
}
//============================
// Verificacion token para imagenes
//============================
let verificaTokenImg = (req, res, next) => {
  let token = req.query.token
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: 'Token no valido'
        }
      })
    }
    req.usuario = decoded.usuario
    next()
  })
  
}
module.exports = {
  verificaToken,
  vericaAdmin_Role,
  verificaTokenImg
}
