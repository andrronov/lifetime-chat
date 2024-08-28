class ConnectionController {
   constructor(){
      this.connections = new Map()
   }

   addConnection(aWss, ws, message){
      ws.id = message.user.id
      this.connections.set(ws.id, message.user)
      const messageAPI = {
         method: 'connection',
         user: message.user
      }
      this.broadcastEvent(aWss, ws, messageAPI)
   }

   broadcastEvent(aWss, ws, message){
      aWss.clients.forEach(client => {
         if(client.id === ws.id) client.send(JSON.stringify(message))
      })
   }

   handleMessage(aWss, ws, msg){
      const message = JSON.parse(msg)
      switch (message.method) {
         case 'connection':
            this.addConnection(aWss, ws, message)
            break;

         case 'users':
            ws.send(JSON.stringify({
               method: 'users',
               users: Object.fromEntries(this.connections.entries())
            }))
            break;
      
         default:
            break;
      }
   }
}

export default new ConnectionController()