import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import {clerkWebhooks} from "./configs/webhooks.js";


// initialize Express

const app = express()

// connect to db
await connectDB()


// MiddleWares
app.use(cors())


//Routes
app.get('/', (req, res)=> res.send('API Working'))
app.post('/clerk', express.json(), clerkWebhooks)


// port

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})