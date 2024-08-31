class ConnectionController {
   constructor(){
      this.connections = new Map()
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
            
         case 'disconnection':
            this.deleteConnection(aWss, ws, message)
            break;
      
         default:
            break;
      }
   }

   addConnection(aWss, ws, message){
      ws.id = message.user.id
      // Проверяем, занят ли юзер
      if(this.connections.get(ws.id) && (this.connections.get(ws.id)).pin !== message.pin){
         ws.send(JSON.stringify({method: 'abort', msg: "Пользователь уже занят"}))
         return ws.close()
      }
      const connectionCode = message.pin || Math.floor(Math.random()*1000).toString()
      message.user.pin = connectionCode
      this.connections.set(ws.id, message.user)
      const messageAPI = {
         method: 'connection',
         user: message.user,
         pin: connectionCode,
         users: Object.values(Object.fromEntries(this.connections)).map(user => user.id)
      }
      this.broadcastEvent(aWss, ws, messageAPI)
   }

   deleteConnection(aWss, ws, message){
      ws.id = null
      this.connections.delete(message.user.id)
      const messageAPI = {
         method: 'disconnection',
         users: Object.values(Object.fromEntries(this.connections)).map(user => user.id)
      }
      this.broadcastEvent(aWss, ws, messageAPI)
   }

   broadcastEvent(aWss, ws, message){
      aWss.clients.forEach(client => {
         client.send(JSON.stringify(message))
      })
   }
}

export default new ConnectionController()