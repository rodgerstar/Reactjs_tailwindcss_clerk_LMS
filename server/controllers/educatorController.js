import { clerkClient } from "@clerk/express";

export const updateRoleToEducator = async (req, res) => {
    try {
        console.log("req.auth:", req.auth); // Log what clerkMiddleware provides
        const userId = req.auth?.userId; // Safely access userId

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No valid user ID found in request",
            });
        }

        console.log("Updating userId:", userId);
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator",
            },
        });

        res.json({ success: true, message: "You Can Publish a Course Now!" });
    } catch (error) {
        console.error("Error in updateRoleToEducator:", error.message);
        res.json({ success: false, message: error.message });
    }
};