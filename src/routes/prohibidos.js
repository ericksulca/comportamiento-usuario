import Prohibido from '../models/prohibidos'

export default app => {
  app.route('/prohibido/')
    .get((req, res) => {
      Prohibido.find({}).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    .post((req, res) => {
      const data = req.body
      const { features } = data
      const geometry = features[0].geometry

      let prohibido = new Prohibido(
        {
          'features': [
            {
              'geometry': {
                'type': geometry.type,
                'coordinates': geometry.coordinates
              }
            }
          ]
        }
      )
      prohibido.save()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
  
  app.route('/prohibido/:id')
    .get((req, res) => {
      Prohibido.findOne({ _id: req.params.id })
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    .put((req, res) => {

    })
    .delete((req, res) => {
      const id = req.params.id
      Prohibido.deleteOne({ _id: id }).exec()
        .then(() => res.sendStatus(204))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    
}