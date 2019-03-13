import Cliente from '../models/cliente'


export default app => {
  app.route('/cliente-comportamiento/')
    .get((req, res) => {
      Cliente.find({}).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    .post((req, res) => {
      let cliente = new Cliente({
        id: req.body.id,
        nombre: req.body.nombre,
        clicks: req.body.clicks,
        tags: req.body.tags
      })
      cliente.save()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })

  app.route('/cliente-comportamiento/:id')
    .get((req, res) => {
      Cliente.findOne({ id: req.params.id }).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    /*
    * Solo se puede recibir request con un solo objeto "tags" 
    * y/o con un solo objeto "clicks" 
    */
    .put((req, res) => {
      if (req.body.clicks && !req.body.tags) {
        Cliente.findOne({
          "id": req.params.id,
          "clicks.nombreObjeto": req.body.clicks.nombreObjeto
        }).exec()
          .then(result => {
            // BUG no entra al if a pesar de que nombre objeto es correcto
            if (result) {
              Cliente.update(
                { "id": req.params.id , "clicks.nombreObjeto": req.body.clicks.nombreObjeto },
                { $inc: { "clicks.$.cantidad": req.body.clicks.cantidad } }
              ).exec()
                .then(result => res.json(result))
                .catch(err => res.status(412).json({ msg: err.message }))
            } else {
              Cliente.update(
                { "id": req.params.id },
                { $push: { clicks: req.body.clicks } }
              ).exec()
                .then(result => res.json(result))
                .catch(err => res.status(412).json({ msg: err.message }))
            }
          })
      } else if (!req.body.clicks && req.body.tags) {
        Cliente.findOne({
          "id": req.params.id,
          "tags.nombreTag": req.body.tags.nombreTag
        }).exec()
          .then(result => {
            if (result) {
              Cliente.update(
                { "id": req.params.id, "tags.nombreTag": req.body.tags.nombreTag },
                { $set: { "tags.$.puntuacion": req.body.tags.puntuacion }}
              ).exec()
                .then(result => res.json(result))
                .catch(err => res.status(412).json({ msg: err.message }))
            } else {
              Cliente.update(
                { "id": req.params.id },
                { $push: { tags: req.body.tags } }
              ).exec()
                .then(result => res.json(result))
                .catch(err => res.status(412).json({ msg: err.message }))
            }
          })
      }
      /* FALTA en caso de que haya clicks y tags al mismo tiempo
      *  se necesita refactorizar para mejorar la sintaxis de la funcion
      */
    })
    .delete((req, res) => {
      Cliente.deleteOne({ id: req.params.id }).exec()
        .then(() => res.sendStatus(204))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
}