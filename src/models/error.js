import mongoose from 'mongoose'

const ErrorLogSchema = new mongoose.Schema({
  codigoError: Number,
  fecha: { type: Date, default: Date.now }
})

const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema)

export default ErrorLog