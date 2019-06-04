import Prohibido from '../models/prohibidos'

export default app => {
  app.route('/prohibido/')
    .get((req, res) => {
      Prohibido.find({}).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({
          msg: err.message
        }))
    })
    .post((req, res) => {
      const data = req.body
      const { features } = data

      Prohibido.updateOne(
        {},
        { $push: { 'features':  features } }
      ).exec()
      .then(result => res.json(result))
      .catch(err => res.status(412).json({
        msg: err.message
      }))
    })

  app.route('/prohibido-esp/')
    .get((req, res) => {
      Prohibido.find({}).exec()
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

      let prohibido = new Prohibido({
        features: features
      })
      prohibido.save()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({
          msg: err.message
        }))
    })
    .delete((req, res) => {
      Prohibido.deleteMany({}).exec()
        .then(() => res.sendStatus(204))
        .catch(err => res.status(412).json({
          msg: err.message
        }))
    })

  app.route('/prohibido/:id')
    .get((req, res) => {
      Prohibido.findOne({
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
      Prohibido.deleteOne({
          _id: id
        }).exec()
        .then(() => res.sendStatus(204))
        .catch(err => res.status(412).json({
          msg: err.message
        }))
    })

}