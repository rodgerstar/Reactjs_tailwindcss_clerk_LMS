import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./configs/webhooks.js";
import educatorRouter from "./routes/educatorRoute.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();

// Connect to DB
(async () => {
    await connectDB();
    await connectCloudinary()

    // Middlewares
    app.use(cors());
    app.use((req, res, next) => {
        console.log("Incoming Request:", req.method, req.url, "Authorization:", req.headers.authorization);
        next();
    });
    app.use(clerkMiddleware({
        secretKey: process.env.CLERK_SECRET_KEY, // Explicitly pass the secret key
    }));

    // Routes
    app.get("/", (req, res) => res.send("API Working"));
    app.post("/clerk", express.json(), clerkWebhooks);
    app.use("/api/educator", express.json(), educatorRouter);

    // Port
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();