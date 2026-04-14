import 'dotenv/config'
import express from 'express'
import bootstrap from './app.controller.js'
import { runIo } from './modules/chat/chat.socket.js'



const app = express();

const startServer = async () => {
    try {
        
        await bootstrap(app, express);
        console.log("Database and Middlewares are ready.");

        
        const httpServer = app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        }).on('error', (err) => {
            console.error("Server failed to start:", err.message);
        });

        
        runIo(httpServer);

    } catch (error) {
        
        console.error("CRITICAL ERROR DURING BOOTSTRAP:");
        console.error(error.message);
        process.exit(1)
    }
};

startServer();