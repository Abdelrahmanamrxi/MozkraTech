import 'dotenv/config'
import express from 'express'
import bootstrap from './app.controller.js'
import { runIo } from './modules/chat/chat.socket.js'


const app = express()
bootstrap(app, express);



const httpServer = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})


runIo(httpServer);