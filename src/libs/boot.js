module.exports = app => {
  app.listen(app.get('port'), () => {
    console.log('app listening on port', app.get('port'))
  })
  return app
}