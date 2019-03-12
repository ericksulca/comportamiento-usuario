module.exports = app => {

  app.route('/')
    .get((req, res) => {
      res.json({'msj': 'Hola desde express'})
    })
}