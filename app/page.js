'use client';

import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useState } from 'react';
import db from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Home() {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    paymentMethod: '',
    lighting: false,
    photography: false,
    videoVisuals: false
  });

  const BASE_PRICE = 350;
  const LIGHTING_PRICE = 100;
  const PHOTO_PRICE = 150;
  const VIDEO_PRICE = 100;

  const calculateTotal = () => {
    let total = BASE_PRICE;
    if (formData.lighting) total += LIGHTING_PRICE;
    if (formData.photography) total += PHOTO_PRICE;
    if (formData.videoVisuals) total += VIDEO_PRICE;
    return total;
  };

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'contracts'), formData);
      setSubmitted(true);
      console.log('Contract submitted:', formData);
    } catch (error) {
      console.error('Error saving contract:', error);
      alert('Error submitting form. Please check console for details.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/dj-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '2rem',
      }}
    >
      <main
        style={{
          fontFamily: 'Montserrat, sans-serif',
          maxWidth: '600px',
          margin: '40px auto',
          background: 'rgba(0, 0, 0, 0.6)', // translucent to show background
          borderRadius: '12px',
          padding: '2rem',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
          Live City DJ Contract
        </h1>
        <p style={{ marginBottom: '2rem', textAlign: 'center' }}>
          Please complete the form below to reserve your event date.
        </p>

        {submitted ? (
          <div>
            <h2>✅ Contract submitted successfully!</h2>
            <p>Please send your payment to confirm the booking:</p>
            <ul>
              <li>💸 <strong>Venmo:</strong> @djBobbyDrake</li>
              <li>💵 <strong>Cash App:</strong> $djBobbyDrake</li>
              <li>🍎 <strong>Apple Pay:</strong> (203) 694-9388</li>
            </ul>
            <p><strong>Total Due:</strong> ${calculateTotal()}</p>
            <p>A $100 deposit is required to reserve your event date.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Client Name:</label><br />
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #4b5563',
                backgroundColor: '#1f2937',
                color: '#ffffff',
                fontSize: '16px'
              }}
            />

<label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
<input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  required
  style={{
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #4b5563',
    backgroundColor: '#1f2937',
    color: '#ffffff',
    fontSize: '16px',
    marginBottom: '1rem'
  }}
/>


<label>Event Date:</label>
<div style={{ position: 'relative', marginBottom: '1rem' }}>
  <input
    type="date"
    name="eventDate"
    value={formData.eventDate}
    onChange={handleChange}
    required
    style={{
      width: '100%',
      padding: '10px 40px 10px 10px',
      borderRadius: '6px',
      border: '1px solid #4b5563',
      backgroundColor: '#1f2937',
      color: '#ffffff',
      fontSize: '16px'
    }}
  />
  <FaCalendarAlt style={{
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'white',
    pointerEvents: 'none'
  }} />
</div>


            <label>Start Time:</label>
            <div style={{ position: 'relative' }}>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 10px',
                  borderRadius: '6px',
                  border: '1px solid #4b5563',
                  backgroundColor: '#1f2937',
                  color: '#ffffff',
                  fontSize: '16px'
                }}
              />
              <FaClock style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                pointerEvents: 'none'
              }} />
            </div>

            <label>End Time:</label>
            <div style={{ position: 'relative' }}>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px 40px 10px 10px',
                  borderRadius: '6px',
                  border: '1px solid #4b5563',
                  backgroundColor: '#1f2937',
                  color: '#ffffff',
                  fontSize: '16px'
                }}
              />
              <FaClock style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                pointerEvents: 'none'
              }} />
            </div>

            <label>Payment Method:</label><br />
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              style={{
                padding: '10px',
                border: 'none',
                borderBottom: '1px solid #ccc',
                borderRadius: '0',
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontSize: '16px',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: 'none',
                outline: 'none'
              }}
            >
              <option value="">Select</option>
              <option value="Venmo">Venmo</option>
              <option value="Cash App">Cash App</option>
              <option value="Apple Pay">Apple Pay</option>
              <option value="Cash">Cash</option>
            </select>

            <h3>Optional Add-Ons</h3>
            <label>
              <input
                type="checkbox"
                name="lighting"
                checked={formData.lighting}
                onChange={handleChange}
              />
              Event Lighting (+$100)
            </label><br />

            <label>
              <input
                type="checkbox"
                name="photography"
                checked={formData.photography}
                onChange={handleChange}
              />
              Event Photography (+$150)
            </label><br />

            <label>
              <input
                type="checkbox"
                name="videoVisuals"
                checked={formData.videoVisuals}
                onChange={handleChange}
              />
              Video Visuals (+$100)
            </label><br /><br />

            <h3>Total Price: ${calculateTotal()}</h3><br />
            <button type="submit">Submit Contract</button>
          </form>
        )}
      </main>
    </div>
  );
}
