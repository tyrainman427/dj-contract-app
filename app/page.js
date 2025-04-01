// DJContractForm.js — FIXED Venue Location display and working autocomplete

'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { collection, addDoc } from 'firebase/firestore';
import db from '../lib/firebase';
import confetti from 'canvas-confetti';
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
  const autocompleteWrapperRef = useRef(null);

  useEffect(() => {
    const setupAutocomplete = async () => {
      try {
        const { PlaceAutocompleteElement } = await window.google.maps.importLibrary('places');
        if (!customElements.get('place-autocomplete')) {
          customElements.define('place-autocomplete', PlaceAutocompleteElement);
        }

        const autocomplete = document.createElement('place-autocomplete');
        autocomplete.setAttribute('placeholder', 'Enter venue address');
        autocomplete.style.width = '100%';
        autocomplete.style.padding = '12px';
        autocomplete.style.border = '1px solid #ccc';
        autocomplete.style.borderRadius = '8px';
        autocomplete.style.marginBottom = '1rem';
        autocomplete.style.backgroundColor = 'rgba(255,255,255,0.85)';
        autocomplete.style.fontSize = '16px';

        autocomplete.addEventListener('placechanged', () => {
          setFormData(prev => ({ ...prev, venueLocation: autocomplete.value }));
        });

        if (autocompleteWrapperRef.current) {
          autocompleteWrapperRef.current.innerHTML = ''; // clear old content
          autocompleteWrapperRef.current.appendChild(autocomplete);
        }
      } catch (err) {
        console.error('Google Autocomplete setup failed:', err);
      }
    };

    if (window.google) setupAutocomplete();
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

  const tooltip = (text) => (
    <Tippy
      placement="bottom"
      interactive
      offset={[0, 10]}
      render={() => (
        <motion.div
          style={{
            maxWidth: '320px',
            padding: '1rem',
            backgroundColor: '#1f2937',
            color: '#fff',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0,0,0,0.3)',
            textAlign: 'center',
            zIndex: 9999,
          }}
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
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=beta`}
        strategy="beforeInteractive"
      />

      <div style={{
        minHeight: '100vh',
        padding: '2rem',
        backgroundImage: "url('/dj-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: 'Helvetica Neue, Segoe UI, Roboto, sans-serif'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
          <h1 style={{ textAlign: 'center', fontSize: '2.25rem', color: '#000' }}>🎧 Live City DJ Contract</h1>

          <p style={{ textAlign: 'center', color: '#111', marginBottom: '0.5rem' }}>
            Please complete the contract form below to reserve your event date.
          </p>

          <p style={{ textAlign: 'center', color: '#111', marginBottom: '1.5rem' }}>
            📞 <a href="tel:+12036949388" style={{ color: '#0070f3' }}>(203) 694-9388</a> ·
            📧 <a href="mailto:therealdjbobbydrake@gmail.com" style={{ color: '#0070f3' }}>therealdjbobbydrake@gmail.com</a>
          </p>

          {/* Form content goes here... */}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={labelStyle}>Venue Name:</label>
            <input name="venueName" value={formData.venueName} onChange={handleChange} required style={inputStyle} />

            <label style={labelStyle}>Venue Location:</label>
            <div ref={autocompleteWrapperRef}></div>

            {/* Continue with rest of form... */}
          </form>
        </div>
      </div>
    </>
  );
}
