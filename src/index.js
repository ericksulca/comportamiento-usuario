import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

// Importando configuraciones de la BD
import configDB from './libs/configDB'

// Importando rutas
import rutaHome from './routes/home'
import rutaCliente from './routes/cliente'

const PORT = process.env.PORT || 8000
let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// CONEXION A BASE DE DATOS
mongoose.connect(configDB.url + configDB.database, configDB.params)
  .then(() => {
    console.log('Conexion a base de datos exitosa')
  })
  .catch(err => {
    console.error('Error en la conexion a la base de datos')
  })

let db = mongoose.connection

// RUTAS
rutaHome(app)
rutaCliente(app)

app.listen(PORT, () => {
  console.log("Aplicacion corriendo en puerto:", PORT)
})
