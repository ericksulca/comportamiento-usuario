import ws from 'ws'

import url from 'url'

import fetch from 'node-fetch'

// SE TIENE QUE VER EL CASO EN EL QUE EL SOCKET NO ESTA ABIERTO
// SE PUEDE ESPERAR MENSAJES POR EL WEBSOCKET CON EL EVENTO:
// wssClient.on('message', callbackFunc)
export default (app, server) => {

  let wssClient = new ws.Server({
    server: server,
    path: '/client'
  })

  function noop() {}

  function heartbeat() {
    this.isAlive = true
  }

  setInterval(function ping() {
    wssClient.clients.forEach(ws => {
      if (!ws.isAlive) {
        let socketTodos = Object.values(userSockets)
        let arrIds = Object.keys(userSockets)
        let idx = socketTodos.indexOf(ws)
        let idxSocket = arrIds[idx]
        delete userSockets[idxSocket]
        console.log('socket con index ' + idx + 'fue quitado de userSockets ' + Object.keys(userSockets))
        return ws.terminate()
      }
      ws.isAlive = false
      ws.ping(noop)
    })
  }, 10000)

  let userSockets = {}

  wssClient.on('connection', (socket, request) => {
    socket.isAlive = true
    socket.on('pong', heartbeat)
    
    const parameters = url.parse(request.url, true)
    const userId = parameters.query.user_id
    userSockets[userId] = socket
    console.log('Conexion establecida para usuario', userId)
  })

  app.route('/notificacion/:user_id')
    .get((req, res) => {
      const userId = req.params.user_id
      let socket = userSockets[userId]
      console.log('get', userId)
      if (typeof (socket) !== 'undefined' && socket.readyState === ws.OPEN) {
        socket.send('mensaje de prueba')
      } else {
        res.status(204).json({ mensaje: 'exito' })
      }
    })
    .post((req, res) => {
      const userId = req.params.user_id
      console.log("post a usuario", userId)
      console.log(req.body)
      let socket = userSockets[userId]
      if (typeof(socket) !== 'undefined' && socket.readyState === ws.OPEN) {
        console.log('socket valido y abierto')
        socket.send(JSON.stringify(req.body))
        res.status(204).json({ mensaje: 'exito' })
      } else {
        console.log('socket inválido o no abierto')
        res.status(404).json({ mensaje: 'fracaso' })
      }
    })

  app.route('/ubicacion-repartidores/')
    .post((req, res) => {
      const url_superusuarios = 'http://localhost:8003/superusuario/1'
      fetchSuperusuarios(url_superusuarios)
        .then(superusuarios => {
          superusuarios
            .map(superusuarioId => userSockets[superusuarioId])
            .filter(socket => typeof (socket) !== 'undefined' && socket.readyState === ws.OPEN)
            .map(socketValido => {
              socketValido.send(JSON.stringify(req.body))
            })
        })
        .then(() => res.status(204).json({ mensaje: 'exito' }))
        .catch(err => res.status(412).json({ mensaje: err.message }))
    })

  app.route('/ubicacion-repartidor/:clienteId')
    .post((req, res) => {
      const clienteId = req.params.clienteId
      let socket = userSockets[clienteId]
      console.log('clienteId', clienteId)
      console.log(req.body)
      if (typeof (socket) !== 'undefined' && socket.readyState === ws.OPEN) {
        console.log('socket valido')
        socket.send(JSON.stringify(req.body))
        res.status(204).json({ mensaje: 'exito' })
      } else {
        console.log('socket inválido o cerrado')
        res.status(204).json({ mensaje: 'fracaso socket invalido o cerrado' })
      }
    })
}

const fetchSuperusuarios = async (url) => {
  let superusuarios = await fetch(url)
    .then(res => res.json())
    .catch(err => console.error(err))

  superusuarios = superusuarios[0].superusuarios
    .map(superusuario => superusuario.id)
  return superusuarios
}