import {createContext, useEffect, useState} from "react";
import {dummyCourses} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import {useAuth, useUser} from "@clerk/clerk-react";


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate()

    const {getToken} = useAuth()
    const {user} = useUser()

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState([true]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    // Fetch all Courses
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    };

    // calculate average rating of course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return totalRating / course.courseRatings.length
    }

    const calculateChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }

    const calculateCourseDuration = (course) => {
        let time = 0

        course.courseContent.map((chapter) => chapter.chapterContent.map(
            (lecture) => time += lecture.lectureDuration
        ))
        return humanizeDuration(time * 60 * 1000, {units: ["h", "m"]})
    }

    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;

        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length
            }
        });
        return totalLectures
    }

    // fetch user course data
    const fetchUserEnrolledCourses = async () => {
        setEnrolledCourses(dummyCourses)
    }

    useEffect(() => {
        fetchAllCourses()
        fetchUserEnrolledCourses()
    }, []);

    const logToken = async () => {
        const token = await getToken();
        console.log("Token:", token); // Log the token explicitly
        if (!token) console.log("No token returned from getToken()");
    };

    useEffect(() => {
    if (user) {
        logToken();
    } else {
        console.log("User is not loaded yet");
    }
}, [user]);

    const value = {
        currency,
        allCourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateNoOfLectures,
        calculateCourseDuration,
        calculateChapterTime,
        enrolledCourses,
        fetchUserEnrolledCourses
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
