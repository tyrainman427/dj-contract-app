'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { collection, addDoc } from 'firebase/firestore';
import db from '../lib/firebase';
import confetti from 'canvas-confetti';
import 'tippy.js/dist/tippy.css';
import Tippy from '@tippyjs/react/headless';
import { motion } from 'framer-motion';
import { FaInfoCircle } from 'react-icons/fa';

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

  // ✅ Set up PlaceAutocompleteElement
  useEffect(() => {
    const setupAutocomplete = async () => {
      if ('customElements' in window && !customElements.get('place-autocomplete')) {
        const { PlaceAutocompleteElement } = await window.google.maps.importLibrary('places');
        customElements.define('place-autocomplete', PlaceAutocompleteElement);
      }

      const input = document.getElementById('autocomplete');
      if (input) {
        input.addEventListener('placechanged', () => {
          const value = input.value;
          setFormData(prev => ({ ...prev, venueLocation: value }));
        });
      }
    };

    if (window.google) {
      setupAutocomplete();
    }
  }, []);

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

  const tooltipContentStyle = {
    maxWidth: '320px',
    padding: '1rem',
    backgroundColor: '#1f2937',
    color: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
    textAlign: 'center',
    zIndex: 9999
  };

  const infoIcon = (text) => (
    <Tippy
      placement="bottom"
      interactive
      offset={[0, 10]}
      render={() => (
        <motion.div
          style={tooltipContentStyle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          {text}
        </motion.div>
      )}
    >
      <span style={{ color: '#0070f3', marginLeft: 8, cursor: 'pointer' }}>
        <FaInfoCircle />
      </span>
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
    fontFamily: 'Helvetica Neue, Segoe UI, Roboto, sans-serif',
    backgroundImage: `url('/dj-background.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const linkButtonStyle = {
    display: 'inline-block',
    margin: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2563eb',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: 'bold'
  };

  return (
    <>
      {/* ✅ Google Maps v=beta required for PlaceAutocompleteElement */}
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC-5o9YY4NS8y8F2ZTg8-zibHYRP_1dOEc&libraries=places&v=beta"
        strategy="beforeInteractive"
      />

      <div style={pageStyle}>
        <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
          <h1 style={{ textAlign: 'center', fontSize: '2.25rem', color: '#000' }}>🎧 Live City DJ Contract</h1>

          <p style={{ textAlign: 'center', color: '#111', marginBottom: '0.5rem' }}>
            Please complete the contract form below to reserve your event date.
          </p>

          <p style={{ textAlign: 'center', color: '#111', marginBottom: '1.5rem' }}>
            📞 <a href="tel:+12036949388" style={{ color: '#0070f3' }}>(203) 694-9388</a> ·
            📧 <a href="mailto:therealdjbobbydrake@gmail.com" style={{ color: '#0070f3' }}>therealdjbobbydrake@gmail.com</a>
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              {["clientName", "email", "contactPhone", "eventType", "guestCount", "venueName", "eventDate", "startTime", "endTime"].map((field) => (
                <div key={field}>
                  <label style={labelStyle}>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                  <input
                    name={field}
                    type={field.includes('Date') ? 'date' : field.includes('Time') ? 'time' : field.includes('guest') ? 'number' : 'text'}
                    required
                    style={inputStyle}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </div>
              ))}

              {/* ✅ Replaced old autocomplete with new one */}
              <div>
                <label style={labelStyle}>Venue Location:</label>
                <place-autocomplete
                  id="autocomplete"
                  placeholder="Enter venue address"
                  style={inputStyle}
                />
              </div>

              {[{
                name: "lighting",
                label: "Event Lighting (+$100)",
                description: "Includes setup 2 hours early and dance floor lighting."
              }, {
                name: "photography",
                label: "Photography (+$150)",
                description: "Includes 50 high-quality candid shots delivered within 48 hours."
              }, {
                name: "videoVisuals",
                label: "Video Visuals (+$100)",
                description: "Includes slideshow or music video projections."
              }].map(({ name, label, description }) => (
                <div key={name}>
                  <label style={labelStyle}>{label}{infoIcon(description)}</label>
                  <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} />
                </div>
              ))}

              <div>
                <label style={labelStyle}>Additional Hours ($75/hr):</label>
                <input type="number" name="additionalHours" min="0" style={inputStyle} value={formData.additionalHours} onChange={handleChange} />
              </div>

              <div>
                <label style={labelStyle}>Payment Method:{infoIcon('Select your preferred payment method for booking confirmation.')}</label>
                <select name="paymentMethod" required style={inputStyle} value={formData.paymentMethod} onChange={handleChange}>
                  <option value="">Choose one</option>
                  <option value="Venmo - @Bobby-Martin-64">Venmo</option>
                  <option value="Cash App - $LiveCity">Cash App</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Terms & Conditions {infoIcon('Non-refundable $100 deposit required. Remaining balance due 2 weeks before event. Cancellations within 30 days require full payment.')}</label>
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
              </div>

              {itemizedTotal()}
              <button type="submit" style={{ ...inputStyle, backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer' }}>
                Submit Contract
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', color: '#000' }}
            >
              <h2>✅ Submitted!</h2>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem' }}>
                🎉 Congratulations on successfully booking your event. Please submit your deposit or full payment to reserve your date.
              </p>
              {itemizedTotal()}
              <p>Send payment to confirm your booking:</p>
              <a href="https://venmo.com/Bobby-Martin-64" target="_blank" rel="noopener noreferrer" style={linkButtonStyle}>Pay with Venmo</a>
              <a href="https://cash.app/$LiveCity" target="_blank" rel="noopener noreferrer" style={linkButtonStyle}>Pay with Cash App</a>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
