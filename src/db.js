import mongoose from 'mongoose'
import path from 'path'

let db = null

module.exports = app => {
  const config = app.libs.config

  if (!db) {
    mongoose.connect(config.url + config.database)
    mongoose.Promise = global.Promise
    db = mongoose.connection

    db.on('error', console.error.bind(console, 'MongoDB connection error:'))
  }
}