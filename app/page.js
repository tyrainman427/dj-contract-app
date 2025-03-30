'use client';

import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useState } from 'react';
import db from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Script from 'next/script';

export default function Home() {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    contactPhone: '',
    eventType: '',
    guestCount: '',
    venueLocation: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    paymentMethod: '',
    lighting: false,
    photography: false,
    videoVisuals: false,
    additionalHours: 0
  });

  const BASE_PRICE = 350;
  const LIGHTING_PRICE = 100;
  const PHOTO_PRICE = 150;
  const VIDEO_PRICE = 100;
  const ADDITIONAL_HOUR_PRICE = 75;

  const calculateTotal = () => {
    let total = BASE_PRICE;
    if (formData.lighting) total += LIGHTING_PRICE;
    if (formData.photography) total += PHOTO_PRICE;
    if (formData.videoVisuals) total += VIDEO_PRICE;
    total += formData.additionalHours * ADDITIONAL_HOUR_PRICE;
    return total;
  };

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(formData.contactPhone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      await addDoc(collection(db, 'contracts'), formData);
      setSubmitted(true);
      console.log('Contract submitted:', formData);
    } catch (error) {
      console.error('Error saving contract:', error);
      alert('Error submitting form. Please check console for details.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #4b5563',
    backgroundColor: '#1f2937',
    color: '#ffffff',
    fontSize: '16px',
    marginBottom: '1rem'
  };

  const iconInputStyle = {
    ...inputStyle,
    paddingRight: '40px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("/dj-background.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '2rem',
    }}>
      <Script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places" strategy="beforeInteractive" />

      <main style={{
        fontFamily: 'Montserrat, sans-serif',
        maxWidth: '600px',
        margin: '40px auto',
        background: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '12px',
        padding: '2rem',
        color: '#000',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}>
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
            <label>Client Name:</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required style={inputStyle} />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />

            <label>Contact Phone:</label>
            <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required placeholder="1234567890" style={inputStyle} />

            <label>Type of Event:</label>
            <input type="text" name="eventType" value={formData.eventType} onChange={handleChange} required style={inputStyle} />

            <label>Number of Guests:</label>
            <input type="number" name="guestCount" value={formData.guestCount} onChange={handleChange} required style={inputStyle} />

            <label>Venue Name/Location:</label>
            <input type="text" name="venueLocation" id="autocomplete" value={formData.venueLocation} onChange={handleChange} required style={inputStyle} />

            <label>Event Date:</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required style={iconInputStyle} />
              <FaCalendarAlt style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'black', pointerEvents: 'none' }} />
            </div>

            <label>Start Time:</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required style={iconInputStyle} />
              <FaClock style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'black', pointerEvents: 'none' }} />
            </div>

            <label>End Time:</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required style={iconInputStyle} />
              <FaClock style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'black', pointerEvents: 'none' }} />
            </div>

            <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>Event Add-Ons:</p>
            <label><input type="checkbox" name="lighting" checked={formData.lighting} onChange={handleChange} /> Event Lighting (+$100)</label><br />
            <label><input type="checkbox" name="photography" checked={formData.photography} onChange={handleChange} /> Event Photography (+$150)</label><br />
            <label><input type="checkbox" name="videoVisuals" checked={formData.videoVisuals} onChange={handleChange} /> Video Visuals (+$100)</label><br /><br />

            <label>Additional Hours ($75/hr):</label>
            <input type="number" name="additionalHours" value={formData.additionalHours} onChange={handleChange} min="0" style={inputStyle} />

            <label>Payment Method:</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', backgroundImage: 'none' }}>
              <option value="">Select</option>
              <option value="Venmo">Venmo</option>
              <option value="Cash App">Cash App</option>
              <option value="Apple Pay">Apple Pay</option>
              <option value="Cash">Cash</option>
            </select>

            <h3>Total Price: ${calculateTotal()}</h3><br />
            <button type="submit" style={buttonStyle}>Submit Contract</button>
          </form>
        )}
      </main>
    </div>
  );
}
