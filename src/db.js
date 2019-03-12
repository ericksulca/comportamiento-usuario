import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'

let db = null

module.exports = app => {
  const config = app.libs.config

  if (!db) {
    mongoose.connect(config.url + config.database, { useNewUrlParser: true })
    mongoose.Promise = global.Promise
    let connection = mongoose.connection

    connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

    db = {
      connection,
      mongoose
    }

    const dir = path.join(__dirname, 'models')

    fs.readdirSync(dir)
      .forEach(filename => {
        const modelDir = path.join(dir, filename)
        console.log(modelDir)
        let imported = (require(modelDir).default) ?
          require(modelDir).default :
          require(modelDir)
        
        console.log(imported)
        
        if (typeof imported.modelName !== 'undefined') {
          db.models[imported.modelName] = imported
        }
      })
    
  }
}