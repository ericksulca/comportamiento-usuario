import Cliente from '../models/cliente'


export default app => {
  app.route('/cliente-comportamiento/')
    .get((req, res) => {
      Cliente.find()
    })
    .post((req) => {
      let cliente = new Cliente();
      cliente.id = req.body.id
      cliente.nombre = req.body.nombre
      cliente.clicks = req.body.clicks
      cliente.tags = req.body.tags
    })
}