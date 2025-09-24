import React from "react";

export default function Feedbacks() {
  const feedbacks = [
    {
      name: "Riya Sharma",
      role: "Student | Web Dev Course",
      text: "The courses are really well-structured and easy to follow. I loved the hands-on projects which made learning practical.",
    },
    {
      name: "Amit Verma",
      role: "Student | Data Science",
      text: "The chatbot is amazing! It instantly answered my questions and cleared my doubts while I was stuck.",
    },
    {
      name: "Priya Nair",
      role: "Student | Python Beginner",
      text: "The progress tracking system helped me stay consistent. It motivated me to complete lessons on time.",
    },
  ];

  return (
    <section className="py-16 px-6 lg:px-20 bg-gray-100 text-gray-900">
      <h2 className="text-3xl font-bold text-center mb-12">
        What Our Learners Say
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {feedbacks.map((fb, i) => (
          <div
            key={i}
            className="bg-gray-100 border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <span className="text-4xl text-indigo-500 font-serif">“</span>
            <p className="mt-4 text-gray-700">{fb.text}</p>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-900">{fb.name}</h4>
              <p className="text-sm text-indigo-600">{fb.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
