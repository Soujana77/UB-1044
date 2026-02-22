import React, { useState } from "react";
import { MOCK_COUNSELORS } from "../constants";
import { Counselor } from "../types";

const Booking = () => {
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (!selectedCounselor || !selectedSlot) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  // ================= SUCCESS SCREEN =================
  if (success && selectedCounselor) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Appointment Confirmed ✅
          </h2>

          <p className="text-gray-600 mb-6">
            Your appointment with <strong>{selectedCounselor.name}</strong> at{" "}
            <strong>{selectedSlot}</strong> has been booked.
          </p>

          <button
            onClick={() => {
              setSuccess(false);
              setSelectedCounselor(null);
              setSelectedSlot("");
            }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-10">Book an Appointment</h1>

      {/* ================= COUNSELOR CARDS ================= */}
      <div className="grid md:grid-cols-2 gap-8">
        {MOCK_COUNSELORS.map((counselor) => (
          <div
            key={counselor.id}
            onClick={() => {
              setSelectedCounselor(counselor);
              setSelectedSlot("");
            }}
            className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedCounselor?.id === counselor.id
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-5">
              {/* Profile Image */}
              <img
                src={counselor.imageUrl}
                alt={counselor.name}
                className="w-20 h-20 rounded-full object-cover"
              />

              <div>
                <h3 className="text-lg font-semibold">{counselor.name}</h3>
                <p className="text-sm text-gray-500">
                  {counselor.specialty}
                </p>

                {/* Rating */}
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        counselor.rating >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {counselor.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= SLOT SELECTION ================= */}
      {selectedCounselor && (
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6">
            Booking with {selectedCounselor.name}
          </h2>

          <div className="flex flex-wrap gap-4 mb-8">
            {selectedCounselor.availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-5 py-2 rounded-xl border transition ${
                  selectedSlot === slot
                    ? "bg-indigo-600 text-white"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          <button
            disabled={!selectedSlot || loading}
            onClick={handleConfirm}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl disabled:opacity-50 hover:opacity-90 transition"
          >
            {loading ? "Processing..." : "Confirm Appointment"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Booking;