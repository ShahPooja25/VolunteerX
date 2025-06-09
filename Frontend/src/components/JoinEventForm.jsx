import React, { useState } from 'react';

export default function JoinEventForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/v1/event-join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Form submitted successfully!');
        setFormData({ name: '', email: '', phoneNumber: '' }); // Clear form
      } else {
        alert('Error submitting form: ' + data.message);
      }
    } catch (err) {
      console.error('Form submission failed:', err);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="mt-10 bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Join Event</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Your Name"
          onChange={handleInputChange}
          className="w-full p-3 border rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email Address"
          onChange={handleInputChange}
          className="w-full p-3 border rounded-md"
          required
        />
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          placeholder="Phone Number"
          onChange={handleInputChange}
          className="w-full p-3 border rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
