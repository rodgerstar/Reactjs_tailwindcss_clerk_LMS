import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./configs/webhooks.js";
import educatorRouter from "./routes/educatorRoute.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoute.js";


// initialize express
const app = express();

// connect database
await connectDB()
await connectCloudinary()

// middleware
app.use(cors())
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res)=> res.send("Api Working"))
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRouter )
app.use('/api/course', express.json(), courseRouter )
app.use('/api/user', express.json(), userRouter )
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)


//port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`)
})
// Buffer raw body for Stripe webhooks
