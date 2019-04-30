const fs = require('fs')

const fetch = require('node-fetch')
const jsonexport = require('jsonexport')

const url = 'http://localhost:8003/cliente-comportamiento/'

fetch(url)
  .then(res => res.json())
  .then(data => {
    const dataCurada = data.map(cliente => {
      const clienteId = cliente.id
      const productos = cliente.productos.map(producto => {
        return {
          clienteId: clienteId,
          productoId: producto.productoId,
          puntuacion: producto.puntuacion
        }
      })
      return productos 
   })
    jsonexport(dataCurada, (err, csv) => {
      err ? console.log(err) : console.log('csv')
      fs.writeFile('producto-puntuacion.csv', csv, err => {
        err ? console.log(err) : console.log('data guardada')
      })
    })
  })
  .catch(err => console.log(err))
