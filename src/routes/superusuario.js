import Superusuarios from '../models/superusuario'

export default app => {
  app.route('/superusuario/')
    .get((req, res) => {
      Superusuarios.find({}).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    .post((req, res) => {
      const idObj = req.body.idObj
      const id = req.body.id
      let superusuarios = new Superusuarios({
        idObj: idObj,
        superusuarios: [{ id: id }]
      })
      superusuarios.save()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))      
    })

  app.route('/superusuario/:idSuperusuario')
    .get((req, res) => {
      Superusuarios.find({ idObj: req.params.idSuperusuario }).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    .post((req, res) => {
      const idObj = req.params.idSuperusuario
      const id = req.body
      Superusuarios.findOne({
        "idObj": idObj
      }).exec()
        .then(result => {
          if (result) {
            Superusuarios.updateOne(
              { "idObj": idObj },
              { $push: { superusuarios: id } }
            ).exec()
              .then(result => res.json(result))
              .catch(err => res.status(412).json({ msg: err.message }))
          } else {
            superusuario = new Superusuarios({
              idObj: idObj,
              superusuarios: [{ id: id }]
            })
          }
        })

    })
}