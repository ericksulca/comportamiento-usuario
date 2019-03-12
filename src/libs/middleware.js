import bodyParser from 'body-parser'

module.exports = app => {
  app.set('port', process.env.PORT || 8000)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
      message: err.message,
      error: err
    })
  })
  // console.log(app.db.models)
}
