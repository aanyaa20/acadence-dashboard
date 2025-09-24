import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaClock,
  FaBookOpen,
  FaCertificate,
  FaMedal,
  FaChartLine,
} from "react-icons/fa";

export default function Progress() {
  const { user } = useContext(AuthContext);

  const stats = [
    {
      id: 1,
      title: "Hours Spent",
      value: "126h",
      icon: <FaClock />,
      desc: "Total learning time",
    },
    {
      id: 2,
      title: "Lessons Completed",
      value: "42",
      icon: <FaBookOpen />,
      desc: "Chapters finished so far",
    },
    {
      id: 3,
      title: "Certificates Earned",
      value: "3",
      icon: <FaCertificate />,
      desc: "Achievements unlocked",
    },
  ];

  // ✅ Only Dev & Complete Prep courses (no images)
  const courses = [
    {
      id: 1,
      title: "The Complete Full-Stack Web Development Bootcamp",
      progress: 60,
    },
    {
      id: 2,
      title: "Complete Placement Preparation",
      progress: 20,
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "First 10 Lessons",
      icon: <FaMedal className="text-yellow-400" />,
    },
    {
      id: 2,
      title: "100 Hours of Learning",
      icon: <FaMedal className="text-indigo-400" />,
    },
    {
      id: 3,
      title: "Completed 3 Courses",
      icon: <FaMedal className="text-green-400" />,
    },
  ];

  return (
    <div className="p-8 text-white">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
          <FaChartLine className="text-blue-300" /> Your Progress
        </h1>
        <p className="text-gray-300 text-lg">
          Keep going {user?.name || "Learner"}! Here’s how far you’ve come 🚀
        </p>
      </header>

      {/* StatCards */}
      <section className="grid md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-gradient-to-br from-indigo-700 to-blue-900 p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:scale-[1.02] transition"
          >
            <div className="p-4 bg-white/10 rounded-full text-2xl">
              {stat.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">{stat.value}</h3>
              <p className="text-sm text-indigo-200">{stat.title}</p>
              <p className="text-xs text-gray-400">{stat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Course Progress */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaBookOpen className="text-blue-300" /> Course Progress
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700"
            >
              <h3 className="font-semibold mb-3">{course.title}</h3>
              <div className="w-full bg-slate-700 h-3 rounded-full">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <p className="text-sm text-indigo-300 mt-2">
                {course.progress}% completed
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaMedal className="text-yellow-400" /> Achievements
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-gradient-to-br from-indigo-800 to-blue-900 p-6 rounded-2xl shadow-lg flex items-center gap-4"
            >
              <div className="text-3xl">{ach.icon}</div>
              <h3 className="font-semibold">{ach.title}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
