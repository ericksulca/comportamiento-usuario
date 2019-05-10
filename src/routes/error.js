import ErrorLog from '../models/error'
import establecimiento from './establecimiento';

export default app => {
  app.route('/error/')
    .get((req, res) => {
    ErrorLog.find({}).exec()
      .then(result => res.json(result))
      .catch(err => res.status(412).json({ msg: err.message }))
    })
    .post((req, res) => {
      const { mensaje } = req.body
      let errorLog = new ErrorLog({
        mensaje: mensaje
      })
      errorLog.save()
        .then(() => res.status(200).json({ msg: 'error guardado'}))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
}