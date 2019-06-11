import mongoose from 'mongoose'

const PermitidoSchema = new mongoose.Schema({
  type: { type: String, default: "FeatureCollection" },
  features: [
    {
      type: { type: String, default: "Feature" },
      properties: {
        'NOMBDIST': String,
        'NOMBPROV': String,
        'NOMBDEP': String,
        'marker-color': String,
        'name': { type: String, default: "No disponible en esta zona"}
      },
      geometry: {
        type: { type: String },
        coordinates: [[[ Number ]]]
      }
    }
  ]
})

const Permitido = mongoose.model('Permitido', PermitidoSchema)

export default Permitido