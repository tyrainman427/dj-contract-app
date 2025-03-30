'use client';

import { FaCalendarAlt, FaClock, FaInfoCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
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
    additionalHours: 0
  });

  const [infoPopup, setInfoPopup] = useState('');
  const [showPopupBox, setShowPopupBox] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const showPopup = (text) => {
    setInfoPopup(text);
    setShowPopupBox(true);
  };

  const hidePopup = () => {
    setShowPopupBox(false);
    setTimeout(() => setInfoPopup(''), 300);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  useEffect(() => {
    const canvas = document.getElementById('confetti');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let pieces = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 6 + 4,
      d: Math.random() * 50 + 10,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    }));

    const update = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pieces.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += Math.cos(p.d) + 1 + p.r / 2;
        p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        if (p.y > window.innerHeight) {
          p.x = Math.random() * window.innerWidth;
          p.y = -10;
        }
      });

      requestAnimationFrame(update);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    update();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      backgroundImage: 'url("/dj-background.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      overflow: 'hidden'
    }}>
      <canvas id="confetti" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
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
    if (!validateEmail(formData.email)) return alert('Please enter a valid email address.');
    if (!validatePhone(formData.contactPhone)) return alert('Please enter a valid phone number.');
    if (!formData.agreeToTerms) return alert('You must agree to the terms before submitting.');

    try {
      await addDoc(collection(db, 'contracts'), formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    color: darkMode ? '#f9fafb' : '#111827',
    fontSize: '16px',
    marginBottom: '1.2rem',
    backdropFilter: 'blur(6px)',
    transition: 'all 0.2s ease-in-out',
    boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.15)'
  };

  const iconInputStyle = {
    ...inputStyle,
    paddingRight: '40px'
  };

  const buttonStyle = {
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: darkMode ? '#4f46e5' : '#2563eb',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: darkMode
      ? '0 4px 14px rgba(99, 102, 241, 0.6)'
      : '0 4px 14px rgba(37, 99, 235, 0.5)'
  };
  const popupIcon = (text) => (
    <span onClick={() => showPopup(text)} style={{ marginLeft: '8px', color: darkMode ? '#ccc' : '#555', cursor: 'pointer' }}>
      <FaInfoCircle />
    </span>
  );

  const termsText = `
• DJ services can extend beyond the contracted time only with venue approval.
• If the event is canceled by the client, the advance payment deposit is non-refundable.
• Cancellations within 30 days of the event require full payment of the contracted amount.
• Cancellations must be submitted in writing via email or text message.
• LIVE CITY reserves the right to shut down equipment if there is any risk of harm to attendees or property.
• LIVE CITY cannot be held liable for any amount greater than the contracted fee.
• Outdoor events must provide access to electricity.
• Tipping is optional and at the discretion of the client.
`;

  return (
    <>
      {infoPopup && (
        <>
          <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9998
          }} onClick={hidePopup} />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            borderRadius: '10px',
            padding: '1.5rem',
            maxWidth: '90%',
            maxHeight: '70vh',
            overflowY: 'auto',
            zIndex: 9999,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <strong>Info:</strong>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>{infoPopup}</p>
            <button onClick={hidePopup} style={{
              marginTop: '14px',
              padding: '8px 16px',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>Close</button>
          </div>
        </>
      )}

      <div style={{ textAlign: 'right', padding: '1rem 2rem', zIndex: 1000, position: 'relative' }}>
        <button onClick={toggleDarkMode} style={{
          padding: '6px 12px',
          fontSize: '14px',
          backgroundColor: darkMode ? '#f3f4f6' : '#111827',
          color: darkMode ? '#111827' : '#f3f4f6',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <main style={{
        fontFamily: 'Montserrat, sans-serif',
        maxWidth: '600px',
        margin: '40px auto',
        background: darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255, 255, 255, 0.4)',
        borderRadius: '16px',
        padding: '2rem',
        color: darkMode ? '#f9fafb' : '#000',
        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* 💡 Insert full form JSX here (same as before, now with transparent styling applied) */}
