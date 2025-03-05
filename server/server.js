import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./configs/webhooks.js";
import educatorRouter from "./routes/educatorRoute.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();

// Middlewares (applied globally)
app.use(cors());
app.use(express.json()); // Moved up to parse JSON for all routes
app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url, "Authorization:", req.headers.authorization);
    next();
});
app.use(clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
}));

// Connect to DB and start server
(async () => {
    await connectDB();
    await connectCloudinary();

    // Routes
    app.get("/", (req, res) => res.send("API Working"));
    app.post("/clerk", clerkWebhooks); // No need for express.json() again
    app.use("/api/educator", educatorRouter);
    app.use("/api/course", courseRouter);
    app.use('/api/user', userRouter);

    // Port
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();