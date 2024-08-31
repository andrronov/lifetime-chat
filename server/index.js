import express from 'express'
import expressWs from 'express-ws'
import ConnectionController from './controllers/connection.controller.js';
import MessageController from './controllers/message.controller.js';

const PORT = process.env.PORT || 9999
const app = express()
const { getWss, app: wsApp } = expressWs(app)
const aWss = getWss()

app.use(express.static('dist'))

wsApp.ws('/', (ws, res) => {
   ws.on('message', (msg) => {
      switch (JSON.parse(msg).type) {
         case 'connection':
            ConnectionController.handleMessage(aWss, ws, msg)
            break;
         case 'msg':
            MessageController.handleMessage(aWss, ws, msg)
            break;
      
         default:
            break;
      }
   })
   ws.on('close', () => {
      ConnectionController.deleteConnection(aWss, ws, {user: {id: ws.id}})
   })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))