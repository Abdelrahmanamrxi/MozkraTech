import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import errorHandler from './middleware/errorHandler.js'
import cookieParser from 'cookie-parser'
import limiter from './middleware/rateLimiter.js'
import connectToDB from './config/databaseConfig.js'
import notFound from './middleware/notFound.js'




const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(morgan('dev'))


app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}))

app.use(limiter)

{/** Testing api */}
app.get('/api/v1',async(req,res,next)=>{
    res.status(200).json({message:'OK',status:200})
})

app.use(errorHandler)
app.use(notFound)

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

StartServer()