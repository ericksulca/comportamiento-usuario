import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import http from 'http'

// Importando configuraciones de la BD
import configDB from './libs/configDB'

const PORT = process.env.PORT || 3000
let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// CONEXION A BASE DE DATOS
mongoose.connect(configDB.url + configDB.database, configDB.params)
  .then(() => {
    console.log('Conexion a base de datos exitosa')
  })
  .catch(err => {
    console.error('Error en la conexion a la base de datos', err)
  })

let db = mongoose.connection


// Importando rutas
import rutaHome from './routes/home'
import rutaCliente from './routes/cliente'
import rutaClienteWS from './routes/clienteWS'

// RUTAS
rutaHome(app)
rutaCliente(app)

let server = http.Server(app)

// WEB SOCKETS SERVER CLIENTE
rutaClienteWS(app, server)

// server listening
server.listen(PORT, () => {
  console.log("Aplicacion corriendo en puerto:", PORT)
})
