import React, { useContext } from "react";
import PropTypes from "prop-types"; // ✅ Import PropTypes
import { assets } from "../../assets/assets.js";
import { AppContext } from "../../context/AppContext.jsx";
import {Link} from "react-router-dom";

const CourseCard = ({ course }) => {
    const { currency, calculateRating } = useContext(AppContext);

    return (
        <Link to={'/course/' + course._id} onClick={()=> scrollTo(0,0)}
        className='border border-gray-500/30 gb-6 overflow-hidden rounded-lg'>
            <img
                className='w-full'
                src={course.courseThumbnail} alt="Course Thumbnail" />
            <div
            className='p-3 text-left'>
                <h3
                className='text-base font-semibold'
                >{course.courseTitle}</h3>
                <p
                className='text-gray-500'
                >{course.educator.name}</p>
                <div
                className='flex items-center space-x-2'
                >
                    <p>{calculateRating(course)}</p>
                    <div
                    className='flex'
                    >
                        {[...Array(5)].map((_, i) => (
                            <img
                                className='w-3.5 h-3.5'
                                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                                key={i}  alt="Star Rating" />
                        ))}
                    </div>
                    <p
                    className='text-gray-500'
                    >{course.courseRatings.length}</p>
                </div>
                <p
                className='text-base font-semibold text-gray-800'
                >
                    {currency}
                    {(
                        course.coursePrice -
                        (course.discount * course.coursePrice) / 100
                    ).toFixed(2)}
                </p>
            </div>
        </Link>
    );
};

// ✅ Define PropTypes for validation
CourseCard.propTypes = {
    course: PropTypes.shape({
        courseThumbnail: PropTypes.string.isRequired,
        courseTitle: PropTypes.string.isRequired,
        educator: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        coursePrice: PropTypes.number.isRequired,
        discount: PropTypes.number.isRequired,
    }).isRequired,
};

export default CourseCard;
