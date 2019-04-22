import Establecimiento from '../models/establecimiento'
import Cliente from '../models/cliente';

export default app => {
  app.route('/establecimiento-respuesta/')
    .get((req, res) => {
      Establecimiento.find({}).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    .post((req, res) => {
      let establecimiento = new Establecimiento(req.body)
      establecimiento.save()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })

  app.route('/establecimiento-respuesta/:id')
    .get((req, res) => {
      Establecimiento.findOne({ id: req.params.id }).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    .put((req, res) => {
      const horarioRespuesta = req.body
      Establecimiento.updateOne(
        { "id": req.params.id },
        { $push: { horarioRespuesta: horarioRespuesta }}
      ).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    .delete((req, res) => {
      const id = req.params.id
      Establecimiento.deleteOne({ id: id }).exec()
        .then(() => res.sendStatus(204))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
}