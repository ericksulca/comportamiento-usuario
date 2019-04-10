import mongoose from 'mongoose'

const SuperusuarioSchema = new mongoose.Schema({
  idObj: Number,
  superusuarios: [{ id: Number }]
})

const Superusuarios = mongoose.model('Superusuarios', SuperusuarioSchema)

export default Superusuarios