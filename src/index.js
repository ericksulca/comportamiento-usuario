import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import ws from 'ws'

import url from 'url'
import http from 'http'

// Importando configuraciones de la BD
import configDB from './libs/configDB'

// Importando rutas
import rutaHome from './routes/home'
import rutaCliente from './routes/cliente'

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

// RUTAS
rutaHome(app)
rutaCliente(app)

// WEB SOCKETS SERVER
let server = http.Server(app)

let wssClient = new ws.Server({
  server: server,
  path: '/client'
})

function noop() {}
function heartbeat() {
  this.isAlive = true
}
const clientInterval = setInterval(function ping() {
  wssClient.clients.forEach(ws => {
    if (ws.isAlive === false) return ws.terminate()
    ws.isAlive = false
    ws.ping(noop)
  })
}, 30000)

let userSockets = {}

wssClient.on('connection', (socket, request) => {
  socket.isAlive = true
  socket.on('pong', heartbeat)

  const parameters = url.parse(request.url, true)
  const userId = parameters.query.user_id
  userSockets[userId] = socket
  console.log('Conexion establecida para usuario', userId)
})

// server listening
server.listen(PORT, () => {
  console.log("Aplicacion corriendo en puerto:", PORT)
})
