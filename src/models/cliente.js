import mongoose from 'mongoose'

const ClienteSchema = new mongoose.Schema({
  id: Number,
  nombre: String,
  clicks: [{ nombreObjeto: String, cantidad: Number, fecha: { type: Date, default: Date.now } }],
  tags: [{ nombreTag: String, puntuacion: Number, fechaModificacion: Date }],
  fechaCreacion: { type: Date, default: Date.now }
})

const Cliente = mongoose.model('Cliente', ClienteSchema)

export default Cliente