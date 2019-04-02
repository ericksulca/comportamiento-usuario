const fs = require('fs')

const parse = require('csv-parse')
const fetch = require('node-fetch')

let csvData = []
let url = "http://localhost:8000/producto/api/puntuacion/"

fs.createReadStream('./producto-mean.csv')
  .pipe(parse())
  .on('data', (csvrow) => {
    if(csvrow[0] !== 'productoId') {
      let [productoId, puntuacion] = csvrow
      puntuacion = Math.round(puntuacion)
      const urlMandarPuntuacion = url + productoId
      const data = { puntuacion: puntuacion }

      fetch(urlMandarPuntuacion, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log('error', err))

      csvData.push(csvrow)
    }

  })
  .on('end', () => {
  })
