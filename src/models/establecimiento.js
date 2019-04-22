import mongoose from 'mongoose'

const EstablecimientoSchema = new mongoose.Schema({
  id: Number,
  horarioRespuesta: [
    {
      horaInicio: String,
      horaFin: String,
      tiempoRespuesta: Number
    }
  ]
})

const Establecimiento = mongoose.model('Establecimiento', EstablecimientoSchema)

export default Establecimiento