import ws from 'ws'

import url from 'url'

// SE TIENE QUE VER EL CASO EN EL QUE EL SOCKET NO ESTA ABIERTO
export default (app, server) => {

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

  app.route('/notificacion/:user_id')
    .get((req, res) => {
      const userId = req.params.user_id
      let socket = userSockets[userId]
      console.log('get', userId)
      if (typeof(socket) !== 'undefined') {
        socket.send('mensaje de prueba')
      }
      res.status(204).json({ mensaje: 'exito' })
    })
    .post((req, res) => {
      const userId = req.params.user_id
      console.log("post", userId)
      let socket = userSockets[userId]
      console.log(typeof(socket))
      if (typeof(socket) !== 'undefined') {
        socket.send(JSON.stringify(req.body))
        console.log('si funciona')
      }
      res.status(204).json({ mensaje: 'exito' })
    })
}