import express from 'express'
import expressWs from 'express-ws'
import ConnectionController from './controllers/connection.controller.js';

const app = express()
const { getWss, app: wsApp } = expressWs(app)
const aWss = getWss()

// app.use(express.static('dist'))

wsApp.ws('/', (ws, res) => {
   ws.on('message', (msg) => {
      ConnectionController.handleMessage(aWss, ws, msg)
   })
})

app.listen('5172', () => console.log('works on 5172'))