import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// Clerk webhook handler (unchanged)
export const clerkWebhooks = async (req, res) => {
    try {
        console.log("Webhook received:", req.body);
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });
        console.log("Webhook verified successfully");

        const { data, type } = req.body;
        console.log("Event type:", type);

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url,
                };
                console.log("Creating user with data:", userData);
                const newUser = await User.create(userData);
                console.log("User created:", newUser);
                return res.status(200).json({ success: true, message: "User created" });
            }
            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
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
        console.error("Webhook error:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(
            request.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            const { purchaseId } = session.metadata;

            if (!purchaseId) {
                console.error("Metadata missing purchaseId in session:", session.id);
                return response.status(400).json({ success: false, message: "Metadata missing purchaseId" });
            }

            const purchaseData = await Purchase.findById(purchaseId);
            if (!purchaseData) {
                console.error("Purchase not found for ID:", purchaseId);
                return response.status(404).json({ success: false, message: "Purchase not found" });
            }

            const userData = await User.findById(purchaseData.userId);
            const courseData = await Course.findById(purchaseData.courseId);

            if (!userData || !courseData) {
                console.error("User or Course not found:", {
                    userId: purchaseData.userId,
                    courseId: purchaseData.courseId
                });
                return response.status(404).json({ success: false, message: "User or Course not found" });
            }

            courseData.enrolledStudents.push(userData._id);
            await courseData.save();

            userData.enrolledCourses.push(courseData._id);
            await userData.save();

            purchaseData.status = 'completed';
            await purchaseData.save();

            console.log("Checkout session completed! Purchase updated:", purchaseData);
            break;
        }
        case 'checkout.session.expired': {
            const session = event.data.object;
            const { purchaseId } = session.metadata;

            if (!purchaseId) {
                console.error("Metadata missing purchaseId in expired session:", session.id);
                break;
            }

            const purchaseData = await Purchase.findById(purchaseId);
            if (purchaseData) {
                purchaseData.status = 'failed';
                await purchaseData.save();
                console.log("Checkout session expired! Purchase updated:", purchaseData);
            }
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
};