//============================
//Puerto
//============================
process.env.PORT = process.env.PORT || 3000

//============================
//Entorno
//============================
process.env.NODE_ENV = process.env.NODE_ENV || "dev"

//============================
//Vencimiento del token
//============================
// 60 seg
// 60 min
// 24 hs
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//============================
//SEED de autenticacion
//============================
process.env.SEED = process.env.SEED || "este-es-el-seed-desarollo"
//============================
//Base de Datos
//============================
let urlDB

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe"
} else {
  urlDB = process.env.MONGO_URI
}
process.env.URLDB = urlDB

//============================
//Google CLient ID
//============================

process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "857627881717-di4uars0dtkd56mb1ch9ts8tmtta2qsg.apps.googleusercontent.com"
