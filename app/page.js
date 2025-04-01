'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import { collection, addDoc } from 'firebase/firestore';
import db from '../lib/firebase';
import confetti from 'canvas-confetti';
import 'tippy.js/dist/tippy.css';
import Tippy from '@tippyjs/react/headless';
import { FaInfoCircle, FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt, FaCamera, FaVideo, FaLightbulb } from 'react-icons/fa';

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
  const autocompleteInputRef = useRef(null);

  const initAutocomplete = () => {
    if (!window.google || !autocompleteInputRef.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
      types: ['geocode'],
      fields: ['formatted_address'],
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        setFormData(prev => ({ ...prev, venueLocation: place.formatted_address }));
      }
    });
  };

  useEffect(() => {
    if (submitted) {
      confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
    }
  }, [submitted]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
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
    } catch (err) {
      console.error('Error submitting contract:', err);
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

  const tooltipContentStyle = {
    maxWidth: '320px',
    padding: '1rem',
    backgroundColor: 'white',
    color: '#000',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.25)',
    overflowY: 'auto',
    maxHeight: '250px',
    textAlign: 'center'
  };

  const infoIcon = (text) => (
    <Tippy placement="right" interactive render={() => <div style={tooltipContentStyle}>{text}</div>}>
      <span style={{ color: '#0070f3', marginLeft: 8, cursor: 'pointer' }}><FaInfoCircle /></span>
    </Tippy>
  );

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: 'rgba(255,255,255,0.85)',
    color: '#000',
    fontSize: '16px'
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#111',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const pageStyle = {
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'sans-serif',
    backgroundImage: `url('/dj-background.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const itemizedTotal = () => (
    <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: '#000' }}>
      <li>🎶 Base Package: ${BASE}</li>
      {formData.lighting && <li>💡 Lighting: ${LIGHTING}</li>}
      {formData.photography && <li>📸 Photography: ${PHOTO}</li>}
      {formData.videoVisuals && <li>📽️ Video Visuals: ${VIDEO}</li>}
      {formData.additionalHours > 0 && <li>⏱️ Additional Hours: ${formData.additionalHours * EXTRA_HOUR}</li>}
      <li><strong>Total: ${calculateTotal()}</strong></li>
    </ul>
  );

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={initAutocomplete}
      />

      <div style={pageStyle}>
        <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
          <h1 style={{ textAlign: 'center', fontSize: '2.25rem', color: '#000' }}>🎧 Live City DJ Contract</h1>

          <p style={{ textAlign: 'center', color: '#111', marginBottom: '1.5rem' }}>
            📞 <a href="tel:+12036949388" style={{ color: '#0070f3' }}>(203) 694-9388</a> ·
            📧 <a href="mailto:therealdjbobbydrake@gmail.com" style={{ color: '#0070f3' }}>therealdjbobbydrake@gmail.com</a>
          </p>

          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <h2>✅ Submitted!</h2>
              {itemizedTotal()}
              <p>Send payment to confirm your booking:</p>
              <p>Venmo: @Bobby-Martin-64</p>
              <p>Cash App: $LiveCity</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* ... form fields remain unchanged ... */}

              <label style={labelStyle}>Payment Method:{infoIcon('Select your preferred payment method for booking confirmation.')}</label>
              <select name="paymentMethod" required style={inputStyle} value={formData.paymentMethod} onChange={handleChange}>
                <option value="">Choose one</option>
                <option value="Venmo - @Bobby-Martin-64">Venmo</option>
                <option value="Cash App - $LiveCity">Cash App</option>
                <option value="Cash">Cash</option>
              </select>

              <label style={labelStyle}>Terms & Conditions {infoIcon('Non-refundable $100 deposit required. Remaining balance due 2 weeks before event. Cancellations within 30 days require full payment.')}</label>
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />

              {itemizedTotal()}
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
