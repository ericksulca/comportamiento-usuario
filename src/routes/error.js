import ErrorLog from '../models/error'
import establecimiento from './establecimiento';

export default app => {
  app.route('/error/')
    .get((req, res) => {
    ErrorLog.find({}).exec()
      .then(result => res.json(result))
      .catch(err => res.status(412).json({ msg: err.message }))
  })

  app.route('/error/:codigo')
    .get((req, res) => {
      const codigo = req.params.codigo
      let errorLog = new ErrorLog({
        codigoError: codigo
      })
      errorLog.save()
        .then(() => res.status(200).json({ msg: 'exito' }))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
}