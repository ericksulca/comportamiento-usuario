import ws from 'ws'

import url from 'url'

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
        // AGREGAR CODIGO PARA QUITAR AL SOCKET DE LA LISTA DE SOCKETS
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
    if (typeof(socket) != 'undefined') {
      socket.send(JSON.stringify({msg: 'notificacion prueba'}))
    }

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
      if (typeof(socket) !== 'undefined') {
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
      // console.log(typeof(socket))
      if (typeof(socket) !== 'undefined' && socket.readyState === ws.OPEN) {
        socket.send(JSON.stringify(req.body))
        console.log('si funciona')
        res.status(204).json({ mensaje: 'exito' })
      } else {
        res.status(404).json({ mensaje: 'fracaso' })
      }
    })

  app.route('/ubicacion-repartidores/')
    .post((req, res) => {
      const sockets = userSockets
      console.log(Object.keys(sockets))
      let result = Object.values(sockets)
      if (result) {
        result
          .filter(socket => typeof(socket) !== 'undefined')
          .map(validSocket => {
            console.log(req.body)
            validSocket.send(JSON.stringify(req.body))
            console.log('exito')
          })
          res.status(204).json({ mensaje: 'exito'})
      } else {
        console.log('fail')
        res.status(404).json({ mensaje: 'fracaso' })
      }
    })
}