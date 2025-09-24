// src/pages/Courses.jsx
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import devImg from "../assets/dev.png";
import completeImg from "../assets/complete.png";
import dsaImg from "../assets/dsa.png";

export default function Courses() {
  const allCourses = [
    {
      id: 1,
      title: "Python for Beginners",
      description: "Master Python basics and start coding right away.",
      image: "https://www.python.org/static/community_logos/python-logo.png",
      rating: 4.6,
      learners: "49.9M",
      price: "₹499",
      oldPrice: "₹2,499",
    },
    {
      id: 2,
      title: "Full-Stack Web Development Bootcamp",
      description: "Learn React, Node, MongoDB and build real-world apps.",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      rating: 4.7,
      learners: "22M",
      price: "₹679",
      oldPrice: "₹3,949",
    },
    {
      id: 3,
      title: "Data Science & Machine Learning",
      description:
        "Become a data wizard with ML models, Pandas, NumPy, and more.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg",
      rating: 4.5,
      learners: "8M",
      price: "₹579",
      oldPrice: "₹829",
    },
    {
      id: 4,
      title: "Artificial Intelligence & Deep Learning",
      description: "Understand AI and build neural networks from scratch.",
      image:
        "https://miro.medium.com/v2/resize:fit:640/1*o5FmjKTPdJTbhGE2MIjo6w.png",
      rating: 4.8,
      learners: "12M",
      price: "₹599",
      oldPrice: "₹859",
    },
{
  id: 5,
  title: "Cloud Computing with AWS",
  description: "Master AWS cloud services and deploy scalable apps.",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  rating: 4.6,
  learners: "6.5M",
  price: "₹699",
  oldPrice: "₹2,199",
},
{
  id: 6,
  title: "Cybersecurity Fundamentals",
  description: "Learn ethical hacking, firewalls, and network security.",
  image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  rating: 4.4,
  learners: "4M",
  price: "₹499",
  oldPrice: "₹1,799",
  tag: "New",
},
{
  id: 7,
  title: "UI/UX Design Masterclass",
  description: "Design user-friendly interfaces with Figma and Adobe XD.",
  image: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  rating: 4.7,
  learners: "5M",
  price: "₹799",
  oldPrice: "₹2,999",
},
{
  id: 8,
  title: "DevOps & CI/CD Pipeline",
  description: "Learn Docker, Kubernetes, and automate deployments.",
  image: "https://cdn.iconscout.com/icon/free/png-512/free-docker-226091.png?f=webp&w=256",
  rating: 4.5,
  learners: "3M",
  price: "₹899",
  oldPrice: "₹3,499",
  tag: "Trending",
},

    {
      id: 10,
      title: "Complete Placement Preparation",
      description:
        "Master DSA, problem solving, aptitude, and interview prep for top tech companies.",
      image: completeImg,
      rating: 4.8,
      learners: "15M",
      price: "₹899",
      oldPrice: "₹3,499",
    },
    {
      id: 11,
      title: "Mastering Data Structures & Algorithms using C and C++",
      description: "Learn DSA with C/C++ and sharpen problem-solving skills",
      image: dsaImg,
      rating: 4.7,
      learners: "22M",
      price: "₹679",
      oldPrice: "₹3,949",
    },
    
  ];

  // helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} />);
      else stars.push(<FaRegStar key={i} />);
    }
    return stars;
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-2 text-indigo-400">All Courses</h1>
        <p className="text-gray-400 mb-10">
          Browse from our top-rated courses and start learning 🚀
        </p>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allCourses.map((course) => (
            <div
              key={course.id}
              className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transform transition flex flex-col h-full"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-contain bg-white"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/300x150?text=Course+Image")
                }
              />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {course.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 text-yellow-400">
                  {renderStars(course.rating)}
                  <span className="text-sm text-gray-300 ml-2">
                    {course.rating} • {course.learners} learners
                  </span>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-indigo-400 font-bold">
                    {course.price}
                  </span>
                  <span className="text-gray-500 line-through text-sm">
                    {course.oldPrice}
                  </span>
                </div>

                {/* Button sticks bottom */}
                <button className="w-full mt-auto py-2 bg-indigo-500 rounded-lg font-semibold hover:bg-indigo-600">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
