import '@babel/polyfill'
import express from 'express'
import mongoose from 'mongoose'

import http from 'http'

// Importando configuraciones de la BD y middleware
import configDB from './libs/configDB'
import middleware from './libs/middleware'

const PORT = process.env.PORT || 8003
let app = express()

middleware(app)

// CONEXION A BASE DE DATOS
mongoose.connect(configDB.url + configDB.database, configDB.params)
  .then(() => {
    console.log('Conexion a base de datos exitosa')
  })
  .catch(err => {
    console.error('Error en la conexion a la base de datos', err)
  })

// Importando rutas
import rutaHome from './routes/home'
import rutaCliente from './routes/cliente'
import rutaClienteWS from './routes/clienteWS'
import rutaSuperusuario from './routes/superusuario'

// RUTAS
rutaHome(app)
rutaCliente(app)
rutaSuperusuario(app)

let server = http.Server(app)

// WEB SOCKETS SERVER CLIENTE
rutaClienteWS(app, server)

// server listening
server.listen(PORT, () => {
  console.log("Aplicacion corriendo en puerto:", PORT)
})
