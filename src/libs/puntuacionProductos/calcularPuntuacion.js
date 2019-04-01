const fs = require('fs')
const path = require('path')

const fetch = require('node-fetch')
const parse = require('csv-parse')
const DataFrame = require('dataframe-js').DataFrame

const prodCSV = path.join(__dirname, 'producto-puntuacion.csv')
const prodMediana = path.join(__dirname, 'producto-mean.csv')

console.log(prodCSV)

DataFrame.fromCSV(prodCSV, true)
  .then(df => {
    df.groupBy('productoId')
      .aggregate(group => group.stat.mean('puntuacion'))
      .toCSV(true, prodMediana)
  })
