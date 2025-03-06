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

const app = express();

// Ensure raw body is preserved for Stripe webhooks
app.use((req, res, next) => {
    req.rawBody = '';
    req.on('data', chunk => {
        req.rawBody += chunk;
    });
    req.on('end', () => {
        next();
    });
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url, "Authorization:", req.headers.authorization);
    next();
});
app.use(clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
}));

(async () => {
    try {
        await connectDB();
        await connectCloudinary();
        console.log("Connected to MongoDB and Cloudinary");
    } catch (err) {
        console.error("Startup error:", err);
    }
})();

app.get("/", (req, res) => res.send("API Working"));
app.post("/clerk", clerkWebhooks);
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use('/api/user', userRouter);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

export default app;