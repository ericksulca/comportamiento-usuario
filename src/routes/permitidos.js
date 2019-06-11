import Permitido from '../models/permitidos'

export default app => {
  app.route('/permitido/')
    .get((req, res) => {
      Permitido.findOne({}).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({
          msg: err.message
        }))
    })
    .post((req, res) => {
      const data = req.body
      const { features } = data

      Permitido.updateOne(
        {},
        { $push: { 'features':  features } }
      ).exec()
      .then(result => res.json(result))
      .catch(err => res.status(412).json({
        msg: err.message
      }))
    })

  app.route('/permitido-esp/')
    .get((req, res) => {
      Permitido.find({}).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({
          msg: err.message
        }))
    })
    .post((req, res) => {
      const data = req.body
      const {
        features
      } = data

      let permitido = new Permitido({
        features: features
      })
      permitido.save()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({
          msg: err.message
        }))
    })
    .delete((req, res) => {
      Permitido.deleteMany({}).exec()
        .then(() => res.sendStatus(204))
        .catch(err => res.status(412).json({
          msg: err.message
        }))
    })

  app.route('/permitido/:id')
    .get((req, res) => {
      Permitido.findOne({
          _id: req.params.id
        })
        .then(result => res.json(result))
        .catch(err => res.status(412).json({
          msg: err.message
        }))
    })
    .put((req, res) => {

    })
    .delete((req, res) => {
      const id = req.params.id
      Permitido.deleteOne({
          _id: id
        }).exec()
        .then(() => res.sendStatus(204))
        .catch(err => res.status(412).json({
          msg: err.message
        }))
    })

}