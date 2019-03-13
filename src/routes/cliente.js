import Cliente from '../models/cliente'

export default app => {
  app.route('/cliente-comportamiento/')
    .get((req, res) => {
      Cliente.find({}).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    .post((req, res) => {
      const { id, nombre, clicks, tags } = req.body
      let cliente = new Cliente({
        id: id,
        nombre: nombre,
        clicks: clicks,
        tags: tags
      })
      cliente.save()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })

  app.route('/cliente-comportamiento/:id')
    .get((req, res) => {
      const { id } = req.params
      Cliente.findOne({ id: id }).exec()
        .then(result => res.json(result))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
    /*
    * Solo se puede recibir request con un solo objeto "tags" 
    * y/o con un solo objeto "clicks" 
    */
    .put((req, res) => {
      const id = req.params.id
      const clicksObj = req.body.clicks
      const tagsObj = req.body.tags

      if (clicksObj && !tagsObj) {
        const { nombreObjeto, cantidad } = clicksObj[0]
        Cliente.findOne({
          "id": id,
          "clicks.nombreObjeto": nombreObjeto
        }).exec()
          .then(result => {
            if (result) {
              Cliente.update(
                { "id": id , "clicks.nombreObjeto": nombreObjeto },
                { $inc: { "clicks.$.cantidad": cantidad } }
              ).exec()
                .then(result => res.json(result))
                .catch(err => res.status(412).json({ msg: err.message }))
            } else {
              Cliente.update(
                { "id": id },
                { $push: { clicks: clicksObj } }
              ).exec()
                .then(result => res.json(result))
                .catch(err => res.status(412).json({ msg: err.message }))
            }
          })
      } else if (!clicksObj && tagsObj) {
        const { nombreTag, puntuacion } = tagsObj[0]
        Cliente.findOne({
          "id": id,
          "tags.nombreTag": nombreTag
        }).exec()
          .then(result => {
            if (result) {
              Cliente.update(
                { "id": req.params.id, "tags.nombreTag": nombreTag },
                { $set: { "tags.$.puntuacion": puntuacion }}
              ).exec()
                .then(result => res.json(result))
                .catch(err => res.status(412).json({ msg: err.message }))
            } else {
              Cliente.update(
                { "id": id },
                { $push: { tags: tagsObj } }
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
      const { id } = req.params
      Cliente.deleteOne({ id: id }).exec()
        .then(() => res.sendStatus(204))
        .catch(err => res.status(412).json({ msg: err.message }))
    })
}