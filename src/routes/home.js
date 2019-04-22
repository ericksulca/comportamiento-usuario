export default app => {
  app.route('/')
    .get((req, res) => {
      res.status(200).json({'msj': 'claro q si camaron'})
    })
}
