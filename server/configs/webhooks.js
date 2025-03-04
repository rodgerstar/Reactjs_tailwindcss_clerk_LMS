import { Webhook } from "svix";
import User from "../models/User.js";

// API controller function to manage Clerk webhooks and DB
export const clerkWebhooks = async (req, res) => {
    try {
        console.log("Webhook received:", req.body); // Log incoming payload

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify webhook signature
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });
        console.log("Webhook verified successfully");

        const { data, type } = req.body;
        console.log("Event type:", type); // Log event type

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`, // Cleaner concatenation
                    imageUrl: data.image_url,
                };
                console.log("Creating user with data:", userData); // Log data to be saved
                const newUser = await User.create(userData);
                console.log("User created:", newUser); // Log the created user
                return res.status(200).json({ success: true, message: "User created" });
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address, // Fixed typo
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url,
                };
                console.log("Updating user with ID:", data.id, "and data:", userData);
                const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
                console.log("User updated:", updatedUser);
                return res.status(200).json({ success: true, message: "User updated" });
            }

            case "user.deleted": {
                console.log("Deleting user with ID:", data.id);
                const deletedUser = await User.findByIdAndDelete(data.id);
                console.log("User deleted:", deletedUser);
                return res.status(200).json({ success: true, message: "User deleted" });
            }

            default:
                console.log("Unhandled event type:", type);
                return res.status(200).json({ success: true, message: "Event type not handled" });
        }
    } catch (error) {
        console.error("Webhook error:", error.message); // Log the error
        return res.status(400).json({ success: false, message: error.message });
    }
};