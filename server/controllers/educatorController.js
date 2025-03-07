import {clerkClient} from "@clerk/express";
import Course from "../models/Course.js";
import {v2 as cloudinary} from 'cloudinary'
import {Purchase} from "../models/Purchase.js";
import User from "../models/User.js";

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

// Add New Course
export const addCourse = async (req, res)=>{
    try {
        const {courseData} = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        if(!imageFile){
            return res.json({success: false, message: 'Thumbnail Not Attached'})
        }
        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({success: true, message: 'Course Added'})



    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// get educator courses
export const getEducatorCourses = async (req, res)=>{
    try {
        const educator = req.auth.userId
        const courses = await Course.find({educator})
        res.json({success:true, courses})
    }  catch (error){
        res.json({success: false, message: error.message})
    }
}

// get dashboard data
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);
        // calculate total earnings
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });
        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // collect unique enrolled students ids
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: course.enrolledStudents
            }, 'name ImageUrl' );

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

//  get enrolled studendts with puchsed data
 export const getEnrolledStudentsData = async (req, res)=>{
     try {
         const educator = req.auth.userId;
         const courses = await Course.find({ educator });

         const courseIds = courses.map(course => course._id);
         const purchases = await Purchase.find({
             courseId: {$in: courseIds},
             status: 'completed'
         }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

         const enrolledStudents = purchases.map(purchase => ({
             student: purchase.userId,
             courseTitle: purchase.courseId.courseTitle,
             purchaseDate: purchase.createdAt
         }));

         res.json({success: true, enrolledStudents})

     } catch (error) {
         res.json({success: false, message: error.message})
     }
 }
















