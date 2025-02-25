
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import { assets, dummyDashboardData } from "../../assets/assets.js";
import Loading from "../../Components/student/Loading.jsx";

const Dashboard = () => {
  const { currency } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-md border border-blue-500 p-4 w-56 h-24 rounded-md bg-white">
            <img src={assets.patients_icon} alt="" className="w-10 h-10" />
            <div className="flex-1">
              <p className="text-2xl font-medium text-gray-600 truncate">
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className="text-base text-gray-500">Total Enrollments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-md border border-blue-500 p-4 w-56 h-24 rounded-md bg-white">
            <img src={assets.appointments_icon} alt="" className="w-10 h-10" />
            <div className="flex-1">
              <p className="text-2xl font-medium text-gray-600 truncate">
                {dashboardData.totalCourses}
              </p>
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-md border border-blue-500 p-4 w-56 h-24 rounded-md bg-white">
            <img src={assets.earning_icon} alt="" className="w-10 h-10" />
            <div className="flex-1">
              <p className="text-2xl font-medium text-gray-600 truncate">
                {dashboardData.totalEarnings}
              </p>
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;