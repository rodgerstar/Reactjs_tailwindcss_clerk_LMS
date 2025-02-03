import React from "react";
import Hero from "../../Components/student/Hero.jsx";
import Companies from "../../Components/student/Companies.jsx";
import CoursesSection from "../../Components/student/CoursesSection.jsx";
import TestimonialSection from "../../Components/student/TestimonialSection.jsx";
import CallToAction from "../../Components/student/CallToAction.jsx";


const Home = () => {
    return (
        <div className='flex flex-col items-center space-y-7
        text-center'>
            <Hero/>
            <Companies/>
            <CoursesSection/>
            <TestimonialSection/>
            <CallToAction/>
        </div>
    )
}

export default Home