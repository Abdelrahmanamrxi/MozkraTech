import 'dotenv/config'
import express from 'express'
import connectToDB from './DB/connectionDB.js'
import bootstrap from './app.controller.js'




const app = express()
bootstrap(app, express);



async function StartServer(){
    try{
        await connectToDB()
        app.listen(process.env.PORT,()=>{
            console.log(`[CONNECTED]: Server is Listening on ${process.env.PORT}`)
        })
    }
    catch(err){
        console.log(`[ERROR]:${err.message}`)
    }
}

StartServer();