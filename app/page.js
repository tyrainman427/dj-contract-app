'use client';

import { useState, useRef } from 'react';
import Script from 'next/script';
import { collection, addDoc } from 'firebase/firestore';
import db from '../lib/firebase';
import emailjs from '@emailjs/browser';

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
    agreeToTerms: false,
    additionalHours: 0,
  });

  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const autocompleteContainerRef = useRef(null);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const initAutocomplete = () => {
    if (
      autocompleteContainerRef.current &&
      window.google?.maps?.places?.PlaceAutocompleteElement
    ) {
      const placeAutocomplete = new window.google.maps.places.PlaceAutocompleteElement({
        fields: ['formatted_address'],
        types: ['geocode'],
      });

      placeAutocomplete.addEventListener('place_changed', () => {
        const place = placeAutocomplete.getPlace();
        if (place?.formatted_address) {
          setFormData((prev) => ({
            ...prev,
            venueLocation: place.formatted_address,
          }));
        }
      });

      autocompleteContainerRef.current.innerHTML = '';
      autocompleteContainerRef.current.appendChild(placeAutocomplete);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));

  const BASE = 350, LIGHTING = 100, PHOTO = 150, VIDEO = 100, EXTRA_HOUR = 75;
  const calculateTotal = () => {
    let total = BASE;
    if (formData.lighting) total += LIGHTING;
    if (formData.photography) total += PHOTO;
    if (formData.videoVisuals) total += VIDEO;
    total += formData.additionalHours * EXTRA_HOUR;
    return total;
  };

  const triggerConfetti = () => {
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then((module) => {
        const confetti = module.default;
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return alert('Enter a valid email.');
    if (!validatePhone(formData.contactPhone)) return alert('Enter a valid phone number.');
    if (!formData.agreeToTerms) return alert('Please agree to the terms.');

    try {
      await addDoc(collection(db, 'contracts'), formData);

      await emailjs.send(
        'service_9z9konq',
        'template_p87ey1j',
        {
          client_name: formData.clientName,
          client_email: formData.email,
          event_date: formData.eventDate,
          event_type: formData.eventType,
          total_due: `$${calculateTotal()}`,
        },
        'NdEqZMAfDI3DOObLT'
      );

      setSubmitted(true);
      triggerConfetti();
    } catch (err) {
      console.error('Submission error:', err);
      alert('Something went wrong.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: darkMode ? '1px solid #333' : '1px solid #ccc',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    color: '#111',
    boxShadow: '0 0 4px rgba(0,0,0,0.2)',
  };

  const labelStyle = {
    color: darkMode ? '#fff' : '#111',
    textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker&v=beta`}
        strategy="lazyOnload"
        onLoad={initAutocomplete}
      />

      <div style={{
        minHeight: '100vh',
        backgroundImage: "url('/bg-dj.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: darkMode ? '#111' : '#1a1a1a', // fallback if image fails
        padding: '2rem',
      }}>
        <div style={{
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: '1rem',
          padding: '2rem',
        }}>
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
              cursor: 'pointer',
            }}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>

          <h1 style={{ textAlign: 'center', color: '#fff', textShadow: '2px 2px 4px #000' }}>🎧 DJ Contract Form</h1>

          {submitted ? (
            <div style={{ textAlign: 'center', marginTop: '2rem', color: '#fff' }}>
              <h2>✅ Submitted!</h2>
              <p>Total Due: <strong>${calculateTotal()}</strong></p>
              <p>Send payment to confirm your booking:</p>
              <p>Venmo: @Bobby-Martin-64</p>
              <p>Cash App: $LiveCity</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '2rem auto' }}>
              <label style={labelStyle}>Client Name:</label>
              <input name="clientName" required style={inputStyle} value={formData.clientName} onChange={handleChange} />

              <label style={labelStyle}>Email:</label>
              <input type="email" name="email" required style={inputStyle} value={formData.email} onChange={handleChange} />

              <label style={labelStyle}>Phone:</label>
              <input name="contactPhone" required style={inputStyle} value={formData.contactPhone} onChange={handleChange} />

              <label style={labelStyle}>Event Type:</label>
              <input name="eventType" required style={inputStyle} value={formData.eventType} onChange={handleChange} />

              <label style={labelStyle}>Guest Count:</label>
              <input type="number" name="guestCount" required style={inputStyle} value={formData.guestCount} onChange={handleChange} />

              <label style={labelStyle}>Venue Name:</label>
              <input name="venueName" required style={inputStyle} value={formData.venueName} onChange={handleChange} />

              <label style={labelStyle}>Venue Location:</label>
              <div ref={autocompleteContainerRef} style={inputStyle} />

              <label style={labelStyle}>Event Date:</label>
              <input type="date" name="eventDate" required style={inputStyle} value={formData.eventDate} onChange={handleChange} />

              <label style={labelStyle}>Start Time:</label>
              <input type="time" name="startTime" required style={inputStyle} value={formData.startTime} onChange={handleChange} />

              <label style={labelStyle}>End Time:</label>
              <input type="time" name="endTime" required style={inputStyle} value={formData.endTime} onChange={handleChange} />

              <label style={labelStyle}>Payment Method:</label>
              <select name="paymentMethod" required style={inputStyle} value={formData.paymentMethod} onChange={handleChange}>
                <option value="">Choose one</option>
                <option value="Venmo - @Bobby-Martin-64">Venmo</option>
                <option value="Cash App - $LiveCity">Cash App</option>
                <option value="Cash">Cash</option>
              </select>

              <label style={labelStyle}>
                <input type="checkbox" name="lighting" checked={formData.lighting} onChange={handleChange} /> Event Lighting (+$100)
              </label><br />

              <label style={labelStyle}>
                <input type="checkbox" name="photography" checked={formData.photography} onChange={handleChange} /> Photography (+$150)
              </label><br />

              <label style={labelStyle}>
                <input type="checkbox" name="videoVisuals" checked={formData.videoVisuals} onChange={handleChange} /> Video Visuals (+$100)
              </label><br />

              <label style={labelStyle}>Additional Hours ($75/hr):</label>
              <input type="number" name="additionalHours" min="0" style={inputStyle} value={formData.additionalHours} onChange={handleChange} />

              <label style={{ ...labelStyle, display: 'block', marginTop: '1rem' }}>
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
                {' '}I agree to the terms & conditions.
              </label>

              <h3 style={{ color: '#fff', textShadow: '1px 1px 3px #000' }}>Total: ${calculateTotal()}</h3>
              <button type="submit" style={{
                ...inputStyle,
                backgroundColor: '#10b981',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}>
                Submit Contract
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
