export default app => {
  app.route('/')
    .get((req, res) => {
      res.json({'msj': 'claro q si camaron'})
    })
}
