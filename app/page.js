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
    alignItems: 'center'
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
              <p>Total Due: <strong>${calculateTotal()}</strong></p>
              <p>Send payment to confirm your booking:</p>
              <p>Venmo: @Bobby-Martin-64</p>
              <p>Cash App: $LiveCity</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}><FaUser style={{ marginRight: 8 }} /> Client Name:</label>
              <input name="clientName" required style={inputStyle} value={formData.clientName} onChange={handleChange} />

              <label style={labelStyle}>Email:</label>
              <input type="email" name="email" required style={inputStyle} value={formData.email} onChange={handleChange} />

              <label style={labelStyle}>Phone:</label>
              <input name="contactPhone" required style={inputStyle} value={formData.contactPhone} onChange={handleChange} />

              <label style={labelStyle}>Event Type:</label>
              <input name="eventType" required style={inputStyle} value={formData.eventType} onChange={handleChange} />

              <label style={labelStyle}>Guest Count:</label>
              <input type="number" name="guestCount" required style={inputStyle} value={formData.guestCount} onChange={handleChange} />

              <label style={labelStyle}><FaMapMarkerAlt style={{ marginRight: 8 }} /> Venue Name:</label>
              <input name="venueName" required style={inputStyle} value={formData.venueName} onChange={handleChange} />

              <label style={labelStyle}><FaMapMarkerAlt style={{ marginRight: 8 }} /> Venue Location:</label>
              <input
                name="venueLocation"
                ref={autocompleteInputRef}
                style={inputStyle}
                value={formData.venueLocation}
                onChange={handleChange}
                placeholder="Enter venue address"
                required
              />

              <label style={labelStyle}><FaCalendarAlt style={{ marginRight: 8 }} /> Event Date:</label>
              <input type="date" name="eventDate" required style={inputStyle} value={formData.eventDate} onChange={handleChange} />

              <label style={labelStyle}><FaClock style={{ marginRight: 8 }} /> Start Time:</label>
              <input type="time" name="startTime" required style={inputStyle} value={formData.startTime} onChange={handleChange} />

              <label style={labelStyle}><FaClock style={{ marginRight: 8 }} /> End Time:</label>
              <input type="time" name="endTime" required style={inputStyle} value={formData.endTime} onChange={handleChange} />

              <label style={labelStyle}>Payment Method:</label>
              <select name="paymentMethod" required style={inputStyle} value={formData.paymentMethod} onChange={handleChange}>
                <option value="">Choose one</option>
                <option value="Venmo - @Bobby-Martin-64">Venmo</option>
                <option value="Cash App - $LiveCity">Cash App</option>
                <option value="Cash">Cash</option>
              </select>

              <label style={labelStyle}><FaLightbulb style={{ marginRight: 8 }} /> Lighting ${LIGHTING}{infoIcon('Includes setup 2 hours early and party lighting for a better dance floor experience.')}</label>
              <input type="checkbox" name="lighting" checked={formData.lighting} onChange={handleChange} />

              <label style={labelStyle}><FaCamera style={{ marginRight: 8 }} /> Photography ${PHOTO}{infoIcon('Includes 50 high-quality candid shots delivered within 48 hours.')}</label>
              <input type="checkbox" name="photography" checked={formData.photography} onChange={handleChange} />

              <label style={labelStyle}><FaVideo style={{ marginRight: 8 }} /> Video Visuals ${VIDEO}{infoIcon('Includes HD visuals like slideshows or presentations projected during event.')}</label>
              <input type="checkbox" name="videoVisuals" checked={formData.videoVisuals} onChange={handleChange} />

              <label style={labelStyle}>Additional Hours ($75/hr):</label>
              <input type="number" name="additionalHours" min="0" style={inputStyle} value={formData.additionalHours} onChange={handleChange} />

              <label style={labelStyle}>Terms & Conditions {infoIcon('Non-refundable $100 deposit required. Remaining balance due 2 weeks before event. Cancellations within 30 days require full payment.')}</label>
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />

              <h3 style={{ textAlign: 'center' }}>💰 Total: ${calculateTotal()}</h3>
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
