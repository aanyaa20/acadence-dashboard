// src/pages/Payments.jsx
import React, { useState } from "react";

export default function Payments() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = () => {
    alert(
      `✅ Payment of ₹${selectedPlan.price}/month using ${paymentMethod.toUpperCase()} was successful!`
    );
  };

  const plans = [
    {
      id: "starter",
      name: "Starter",
      desc: "Access to 10 courses",
      price: 699,
    },
    {
      id: "pro",
      name: "Pro",
      desc: "All courses + certificate",
      price: 1999,
    },
  ];

  return (
    <div className="p-8 pt-24 text-white">
      {/* Title */}
      <h1 className="text-3xl font-extrabold mb-6">💳 Payments & Billing</h1>
      <p className="text-gray-300 mb-8">
        Buy premium courses and subscriptions securely.
      </p>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br from-indigo-700 to-blue-900 text-white hover:scale-[1.02] transition-transform duration-300 cursor-pointer ${
              selectedPlan?.id === plan.id ? "ring-4 ring-blue-400" : ""
            }`}
            onClick={() => handleSubscribe(plan)}
          >
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <p className="text-indigo-200 mb-4">{plan.desc}</p>
            <div className="text-2xl font-extrabold mb-4">
              ₹{plan.price} / month
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg">
              Select
            </button>
          </div>
        ))}
      </div>

      {/* Payment Options */}
      {selectedPlan && (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg max-w-xl">
          <h2 className="text-xl font-bold mb-4">
            Selected Plan: {selectedPlan.name}
          </h2>
          <p className="text-indigo-200 mb-4">
            Amount: ₹{selectedPlan.price} / month
          </p>

          <h3 className="text-lg font-semibold mb-2">Choose Payment Method:</h3>
          <div className="flex flex-wrap gap-4 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Card (Credit/Debit)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="emi"
                checked={paymentMethod === "emi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              EMI
            </label>
          </div>

          <button
            onClick={handlePayment}
            className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg font-semibold"
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}
