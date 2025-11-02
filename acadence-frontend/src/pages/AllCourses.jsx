// src/pages/Courses.jsx
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import devImg from "../assets/dev.png";
import completeImg from "../assets/complete.png";
import dsaImg from "../assets/dsa.png";
import webdev from "../assets/webdev.png";
import art from "../assets/art.png";
import it from "../assets/it.png";
import jobs from "../assets/jobs.png";
import cyber from "../assets/cyber.png";
import ui from "../assets/ui.png";
import aws from "../assets/aws.png";
import datasci from "../assets/datasci.png";
import python1 from "../assets/python1.png";

export default function Courses() {
  const allCourses = [
    {
      id: 1,
      title: "Python for Beginners",
      description: "Master Python basics and start coding right away.",
      image: python1,
      rating: 4.6,
      learners: "49.9M",
      price: "₹499",
      oldPrice: "₹2,499",
      link: "https://www.udemy.com/course/complete-python-bootcamp/?couponCode=IND21PM",
    },
    {
      id: 2,
      title: "Complete Web Development Course",
      description: "Learn React, Node, MongoDB and build real-world apps.",
      image: webdev,
      rating: 4.7,
      learners: "22M",
      price: "₹679",
      oldPrice: "₹3,949",
      link: "https://www.udemy.com/course/web-dev-master/?couponCode=IND21PM",
    },
    {
      id: 3,
      title: "Data Science & Machine Learning",
      description: "Become a data wizard with ML models, Pandas, NumPy, and more.",
      image: datasci,
      rating: 4.5,
      learners: "8M",
      price: "₹579",
      oldPrice: "₹829",
      link: "https://www.udemy.com/course/complete-machine-learning-nlp-bootcamp-mlops-deployment/?couponCode=IND21PM",
    },
    {
      id: 4,
      title: "Artificial Intelligence & Deep Learning",
      description: "Understand AI and build neural networks from scratch.",
      image: art,
      rating: 4.8,
      learners: "12M",
      price: "₹599",
      oldPrice: "₹859",
      link: "https://www.udemy.com/course/artificial-intelligence-with-machine-learning-deep-learning/?couponCode=IND21PM",
    },
    {
      id: 5,
      title: "Cloud Computing with AWS",
      description: "Master AWS cloud services and deploy scalable apps.",
      image: aws,
      rating: 4.6,
      learners: "6.5M",
      price: "₹699",
      oldPrice: "₹2,199",
      link: "https://www.udemy.com/course/introduction-to-cloud-computing-on-amazon-aws-for-beginners/?couponCode=IND21PM",
    },
    {
      id: 6,
      title: "Cybersecurity Fundamentals",
      description: "Learn ethical hacking, firewalls, and network security.",
      image: cyber,
      rating: 4.4,
      learners: "4M",
      price: "₹499",
      oldPrice: "₹1,799",
      tag: "New",
      link: "https://www.udemy.com/course/cybersecurity-from-beginner-to-expert/?couponCode=IND21PM",
    },
    {
      id: 7,
      title: "UI/UX Design Masterclass",
      description: "Design user-friendly interfaces with Figma and Adobe XD.",
      image: ui,
      rating: 4.7,
      learners: "5M",
      price: "₹799",
      oldPrice: "₹2,999",
      link: "https://www.udemy.com/course/learn-figma-uiux-design-masterclass-from-beginner-to-pro/?couponCode=IND21PM",
    },
    {
      id: 8,
      title: "DevOps & CI/CD Pipeline",
      description: "Learn Docker, Kubernetes, and automate deployments.",
      image: devImg,
      rating: 4.5,
      learners: "3M",
      price: "₹899",
      oldPrice: "₹3,499",
      tag: "Trending",
      link: "https://www.udemy.com/course/jenkins-ci-cd-pipelines-devops-for-beginners/?couponCode=IND21PM",
    },
    {
      id: 9,
      title: "IT & Networking Basics",
      description: "Understand IT systems, servers, and network management.",
      image: it,
      rating: 4.3,
      learners: "2.5M",
      price: "₹459",
      oldPrice: "₹1,299",
      link: "https://www.udemy.com/course/it-fundamentals-for-beginners/?couponCode=IND21PM",
    },
    {
      id: 10,
      title: "Mastering Data Structures & Algorithms using C and C++",
      description: "Learn DSA with C/C++ and sharpen problem-solving skills.",
      image: dsaImg,
      rating: 4.7,
      learners: "22M",
      price: "₹679",
      oldPrice: "₹3,949",
      link: "https://www.udemy.com/home/my-courses/learning/",
    },
  ];

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
    <div className="bg-slate-900 min-h-screen text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-indigo-400">All Courses</h1>
        <p className="text-gray-400 mb-10">
          Browse from our top-rated courses and start learning 🚀
        </p>

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

                <div className="flex items-center gap-2 mt-2 text-yellow-400">
                  {renderStars(course.rating)}
                  <span className="text-sm text-gray-300 ml-2">
                    {course.rating} • {course.learners} learners
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <span className="text-indigo-400 font-bold">{course.price}</span>
                  <span className="text-gray-500 line-through text-sm">
                    {course.oldPrice}
                  </span>
                </div>

                <a
                  href={course.link ? course.link : "#"}
                  target={course.link ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="w-full mt-auto py-2 bg-indigo-500 rounded-lg font-semibold hover:bg-indigo-600 text-center block"
                >
                  Enroll Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
