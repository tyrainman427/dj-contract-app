import React, { useState } from "react";
import emailjs from "emailjs-com";
import Confetti from "react-confetti";
import { Switch } from "@/components/ui/switch";

export default function DJContractForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    eventDate: "",
    eventType: "",
    guests: "",
    phone: "",
    venue: "",
    additionalHours: 0,
  });

  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const totalCost = 500 + formData.additionalHours * 75;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "additionalHours" ? parseInt(value || 0) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      ...formData,
      totalCost,
    };

    emailjs
      .send(
        "service_9z9konq",
        "template_p87ey1j",
        templateParams,
        "NdEqZMAfDI3DOObLT"
      )
      .then(() => {
        setSubmitted(true);
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
      });
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {submitted && <Confetti />}

      <div className="absolute top-4 right-4">
        <span className="mr-2">Dark Mode</span>
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
      </div>

      <div className="backdrop-blur-md bg-white/80 dark:bg-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-xl z-10">
        {submitted ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">
              🎉 Congratulations on successfully booking your event!
            </h2>
            <p className="text-lg">
              Please submit your deposit or full payment to reserve your date.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center drop-shadow">
              DJ Contract Form
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md shadow"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md shadow"
              />
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md shadow"
              />
              <input
                type="text"
                name="eventType"
                placeholder="Type of Event"
                value={formData.eventType}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md shadow"
              />
              <input
                type="number"
                name="guests"
                placeholder="Number of Guests"
                value={formData.guests}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md shadow"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Contact Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md shadow"
              />
              <input
                type="text"
                name="venue"
                placeholder="Venue Location"
                value={formData.venue}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md shadow"
              />
              <input
                type="number"
                name="additionalHours"
                placeholder="Additional Hours ($75/hr)"
                value={formData.additionalHours}
                onChange={handleChange}
                className="w-full p-2 rounded-md shadow"
              />
              <div className="text-right font-semibold">
                Total: ${totalCost}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Submit Booking
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
