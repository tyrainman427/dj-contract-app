'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import { collection, addDoc } from 'firebase/firestore';
import db from '../lib/firebase';
import confetti from 'canvas-confetti';

export default function DJContractForm() {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    contactPhone: '',
    eventType: '',
    guestCount: '',
    venueName: '',
    venueLocation: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    paymentMethod: '',
    lighting: false,
    photography: false,
    videoVisuals: false,
    standardPackage: true,
    agreeToTerms: false,
    additionalHours: 0,
  });

  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const autocompleteInputRef = useRef(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const initAutocomplete = () => {
    if (!window.google || !autocompleteInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
      types: ['geocode'],
      fields: ['formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        setFormData((prev) => ({ ...prev, venueLocation: place.formatted_address }));
      }
    });
  };

  useEffect(() => {
    if (submitted) {
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const colors = ['#bb0000', '#ffffff'];

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });

        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      }, 250);
    }
  }, [submitted]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return alert('Enter a valid email.');
    if (!validatePhone(formData.contactPhone)) return alert('Enter a valid phone number.');
    if (!formData.agreeToTerms) return alert('Please agree to the terms.');

    try {
      await addDoc(collection(db, 'contracts'), formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong.');
    }
  };

  const BASE = 350, LIGHTING = 100, PHOTO = 150, VIDEO = 100, EXTRA_HOUR = 75;
  const calculateTotal = () => {
    let total = BASE;
    if (formData.lighting) total += LIGHTING;
    if (formData.photography) total += PHOTO;
    if (formData.videoVisuals) total += VIDEO;
    total += formData.additionalHours * EXTRA_HOUR;
    return total;
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: darkMode ? '1px solid #ccc' : '1px solid #333',
    backgroundColor: darkMode ? 'rgba(20,20,20,0.85)' : 'rgba(255, 255, 255, 0.85)',
    color: darkMode ? '#fff' : '#000',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  };

  const pageStyle = {
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'sans-serif',
    backgroundImage: `url('/dj-background.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: darkMode ? '#000' : '#f3f4f6',
    transition: 'background-color 0.3s ease-in-out'
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={initAutocomplete}
      />

      <div style={pageStyle}>
        <button
          onClick={toggleDarkMode}
          style={{
            float: 'right',
            marginBottom: '1rem',
            padding: '8px 16px',
            backgroundColor: darkMode ? '#f3f4f6' : '#111',
            color: darkMode ? '#111' : '#f3f4f6',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <h1 style={{ textAlign: 'center', color: darkMode ? '#fff' : '#111' }}>🎧 DJ Contract Form</h1>

        {submitted ? (
          <div style={{ textAlign: 'center', marginTop: '2rem', color: darkMode ? '#fff' : '#111' }}>
            <h2>✅ Submitted!</h2>
            <p>Total Due: <strong>${calculateTotal()}</strong></p>
            <p>Send payment to confirm your booking:</p>
            <p>Venmo: @Bobby-Martin-64</p>
            <p>Cash App: $LiveCity</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '2rem auto', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '10px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: darkMode ? '#fff' : '#111' }}>
            <label>Client Name:</label>
            <input name="clientName" required style={inputStyle} value={formData.clientName} onChange={handleChange} />

            <label>Email:</label>
            <input type="email" name="email" required style={inputStyle} value={formData.email} onChange={handleChange} />

            <label>Phone:</label>
            <input name="contactPhone" required style={inputStyle} value={formData.contactPhone} onChange={handleChange} />

            <label>Event Type:</label>
            <input name="eventType" required style={inputStyle} value={formData.eventType} onChange={handleChange} />

            <label>Guest Count:</label>
            <input type="number" name="guestCount" required style={inputStyle} value={formData.guestCount} onChange={handleChange} />

            <label>Venue Name:</label>
            <input name="venueName" required style={inputStyle} value={formData.venueName} onChange={handleChange} />

            <label>Venue Location:</label>
            <input
              name="venueLocation"
              ref={autocompleteInputRef}
              style={inputStyle}
              value={formData.venueLocation}
              onChange={handleChange}
              placeholder="Enter venue address"
              required
            />

            <label>Event Date:</label>
            <input type="date" name="eventDate" required style={inputStyle} value={formData.eventDate} onChange={handleChange} />

            <label>Start Time:</label>
            <input type="time" name="startTime" required style={inputStyle} value={formData.startTime} onChange={handleChange} />

            <label>End Time:</label>
            <input type="time" name="endTime" required style={inputStyle} value={formData.endTime} onChange={handleChange} />

            <label>Payment Method:</label>
            <select name="paymentMethod" required style={inputStyle} value={formData.paymentMethod} onChange={handleChange}>
              <option value="">Choose one</option>
              <option value="Venmo - @Bobby-Martin-64">Venmo</option>
              <option value="Cash App - $LiveCity">Cash App</option>
              <option value="Cash">Cash</option>
            </select>

            <label>
              <input type="checkbox" name="lighting" checked={formData.lighting} onChange={handleChange} /> Event Lighting (+$100)
            </label><br />

            <label>
              <input type="checkbox" name="photography" checked={formData.photography} onChange={handleChange} /> Photography (+$150)
            </label><br />

            <label>
              <input type="checkbox" name="videoVisuals" checked={formData.videoVisuals} onChange={handleChange} /> Video Visuals (+$100)
            </label><br />

            <label>Additional Hours ($75/hr):</label>
            <input type="number" name="additionalHours" min="0" style={inputStyle} value={formData.additionalHours} onChange={handleChange} />

            <label>
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
              I agree to the terms & conditions.
            </label>

            <h3>Total: ${calculateTotal()}</h3>
            <button type="submit" style={{ ...inputStyle, backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer' }}>
              Submit Contract
            </button>
          </form>
        )}
      </div>
    </>
  );
}
