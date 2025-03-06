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

// Buffer raw body for Stripe webhooks
app.use((req, res, next) => {
    if (req.url === '/stripe' && req.method === 'POST') {
        req.rawBody = '';
        req.on('data', chunk => {
            req.rawBody += chunk;
        });
        req.on('end', () => {
            next();
        });
    } else {
        next();
    }
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
    await connectDB();
    await connectCloudinary();
})();

app.get("/", (req, res) => res.send("API Working"));
app.post("/clerk", clerkWebhooks);
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use('/api/user', userRouter);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Export for Vercel serverless
export default app;

// Keep app.listen for local dev (optional, ignored by Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}