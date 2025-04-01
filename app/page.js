'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import { collection, addDoc } from 'firebase/firestore';
import db from '../lib/firebase';
import confetti from 'canvas-confetti';
import 'tippy.js/dist/tippy.css';
import Tippy from '@tippyjs/react/headless';

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
        setFormData(prev => ({ ...prev, venueLocation: place.formatted_address }));
      }
    });
  };

  useEffect(() => {
    if (submitted) {
      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
        zIndex: 9999,
      });
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
    border: '1px solid #ccc',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    color: '#000',
    fontSize: '16px',
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#111',
    marginBottom: '0.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'
  };

  const tooltipContentStyle = {
    maxWidth: '300px',
    padding: '1rem',
    backgroundColor: 'white',
    color: '#000',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    overflowY: 'auto',
    maxHeight: '250px',
    textAlign: 'center'
  };

  const infoIcon = (text) => (
    <Tippy
      interactive
      placement="right"
      render={() => <div style={tooltipContentStyle}>{text}</div>}
    >
      <span style={{ color: '#0070f3', marginLeft: 8, cursor: 'pointer' }}>ⓘ</span>
    </Tippy>
  );

  const pageStyle = {
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'sans-serif',
    backgroundImage: `url('/dj-background.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={initAutocomplete}
      />

      <div style={pageStyle}>
        <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.85)', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
          <h1 style={{ textAlign: 'center', fontSize: '2.25rem', color: '#000', marginBottom: '1rem' }}>Live City DJ Contract</h1>

          <div style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1rem', color: '#111' }}>
            <p>
              📞 <a href="tel:+12036949388" style={{ color: '#0070f3', textDecoration: 'none' }}>(203) 694-9388</a><br />
              📧 <a href="mailto:therealdjbobbydrake@gmail.com" style={{ color: '#0070f3', textDecoration: 'none' }}>therealdjbobbydrake@gmail.com</a>
            </p>
            <p>Please complete the form below to reserve your event date.</p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', marginTop: '2rem', color: '#000' }}>
              <h2>✅ Submitted!</h2>
              <p>Total Due: <strong>${calculateTotal()}</strong></p>
              <p>Send payment to confirm your booking:</p>
              <p>Venmo: @Bobby-Martin-64</p>
              <p>Cash App: $LiveCity</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Client Name:</label>
              <input name="clientName" required style={inputStyle} value={formData.clientName} onChange={handleChange} />

              <label style={labelStyle}>Email:</label>
              <input type="email" name="email" required style={inputStyle} value={formData.email} onChange={handleChange} />

              <label style={labelStyle}>Contact Phone:</label>
              <input name="contactPhone" required style={inputStyle} value={formData.contactPhone} onChange={handleChange} />

              <label style={labelStyle}>Type of Event:</label>
              <input name="eventType" required style={inputStyle} value={formData.eventType} onChange={handleChange} />

              <label style={labelStyle}>Number of Guests:</label>
              <input type="number" name="guestCount" required style={inputStyle} value={formData.guestCount} onChange={handleChange} />

              <label style={labelStyle}>Venue Name:</label>
              <input name="venueName" required style={inputStyle} value={formData.venueName} onChange={handleChange} />

              <label style={labelStyle}>Venue Location:</label>
              <input
                name="venueLocation"
                ref={autocompleteInputRef}
                style={inputStyle}
                value={formData.venueLocation}
                onChange={handleChange}
                placeholder="Enter venue address"
                required
              />

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
                Event Lighting (+$100)
                {infoIcon('Add lighting to enhance the dance floor atmosphere with party lights and uplighting.')}
              </label>
              <input type="checkbox" name="lighting" checked={formData.lighting} onChange={handleChange} />

              <label style={labelStyle}>
                Photography (+$150)
                {infoIcon('Includes professional photography coverage during your event.')}
              </label>
              <input type="checkbox" name="photography" checked={formData.photography} onChange={handleChange} />

              <label style={labelStyle}>
                Video Visuals (+$100)
                {infoIcon('Add a projector with visual loops, event slideshows, or video background.')}
              </label>
              <input type="checkbox" name="videoVisuals" checked={formData.videoVisuals} onChange={handleChange} />

              <label style={labelStyle}>Additional Hours ($75/hr):</label>
              <input type="number" name="additionalHours" min="0" style={inputStyle} value={formData.additionalHours} onChange={handleChange} />

              <label style={labelStyle}>
                I agree to the terms & conditions
                {infoIcon("By checking this box, you agree to Live City's DJ service agreement including payment terms and cancellation policy.")}
              </label>
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />

              <h3>Total: ${calculateTotal()}</h3>
              <button type="submit" style={{ ...inputStyle, backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer' }}>
                Submit Contract
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
