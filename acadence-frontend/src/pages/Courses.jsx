import React from "react";
import { FaBookOpen } from "react-icons/fa";
import pythonImg from "../assets/python.png";
import devImg from "../assets/dev.png";
import dsaImg from "../assets/dsa.png";
import completeImg from "../assets/complete.png";

export default function Courses() {
  const courses = [
    {
      id: 1,
      title: "The Complete Full-Stack Web Development Bootcamp",
      image: devImg,
      progress: 60,
      link: "https://www.udemy.com/course/the-complete-web-development-bootcamp/learn/lecture/41780544?start=0#overview"
    },
    {
      id: 2,
      title: "Mastering Data Structures & Algorithms using C and C++",
      image: dsaImg,
      progress: 40,
      link: "https://www.udemy.com/course/datastructurescncpp/learn/lecture/13319372?start=15#overview",
    },
    {
      id: 3,
      title: "Complete Placement Preparation",
      image: completeImg,
      progress: 20,
    },
  ];

  return (
    <div className="pt-24 p-8 text-white">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
          <FaBookOpen className="text-blue-300" /> My Courses
        </h1>
        <p className="text-gray-300 text-lg">
          Track your enrolled courses and continue learning
        </p>
      </header>

      {/* Course Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-gradient-to-br from-indigo-700 to-blue-900 rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <div className="w-full bg-slate-700 h-3 rounded-full mb-2">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <p className="text-sm text-indigo-200 mb-4">
                {course.progress}% completed
              </p>

              {/* Continue Button */}
              {course.link ? (
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium text-center"
                >
                  Continue
                </a>
              ) : (
                <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium">
                  Continue
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
