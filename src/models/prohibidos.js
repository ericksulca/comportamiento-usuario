import mongoose from 'mongoose'

const ProhibidoSchema = new mongoose.Schema({
  type: { type: String, default: "FeatureCollection" },
  features: [
    {
      type: { type: String },
      properties: { 
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

const Prohibido = mongoose.model('Prohibido', ProhibidoSchema)

export default Prohibido