import consign from 'consign'
import express from 'express'

const app = express()

consign({
  cwd: __dirname
})
  .include('./libs/middleware.js')
  .then('routes')
  .then('./libs/boot.js')
  .into(app)