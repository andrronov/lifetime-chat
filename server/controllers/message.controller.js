class MessageController {
   constructor(){
      this.messages = new Map()
   }

   handleMessage(aWss, ws, message){
      const msg = JSON.parse(message)
      switch (msg.method) {
         case 'getMessages':
            const msgs = Object.fromEntries(this.messages.entries())
            ws.send(JSON.stringify({
               method: 'chatMessages',
               msgs
            }))
            break;
         case 'sendMessage':
            const chatMessages = this.messages.get(msg.chatId)
            if(!chatMessages){
               let msgArray = []
               this.setMessageAndBroadcast(msg, msgArray, aWss)
            } else {
               this.setMessageAndBroadcast(msg, chatMessages, aWss)
            }
            break;
         case 'typing':
            this.broadcastMessage(aWss, ws, {method: 'typing'}, [Number(msg.user)])
         break;
      
         default:
            break;
      }
   }

   getMessages(){
      return Object.fromEntries(this.messages)
   }

   setMessageAndBroadcast(data, msgArray, aWss){
      msgArray.push({userId: data.userId, message: data.input})
      this.messages.set(data.chatId, msgArray)
      const messageAPI = {
         method: 'sentMsg',
         data: {
            newMessage: data.input,
            author: data.userId,
         },
         chatId: data.chatId
      }
      this.broadcastMessage(aWss, null, messageAPI, data.users)
   }

   broadcastMessage(aWss, ws, message, users){
      aWss.clients.forEach(client => {
         if(users.find(user => user == client.id)) client.send(JSON.stringify(message))
      })
   }
}

export default new MessageController();