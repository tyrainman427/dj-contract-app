'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import db from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Home() {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    contactPhone: '',
    eventType: '',
    guestCount: '',
    venueName: '',
    // Plain text input for venue location.
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

  const [infoPopup, setInfoPopup] = useState('');
  const [showPopupBox, setShowPopupBox] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Confetti effect (unchanged)
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
      tiltAngle: 0,
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

  const showPopup = (text) => {
    setInfoPopup(text);
    setShowPopupBox(true);
  };

  const hidePopup = () => {
    setShowPopupBox(false);
    setTimeout(() => setInfoPopup(''), 300);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

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
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) =>
    /^[0-9]{10}$/.test(phone.replace(/\D/g, ''));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email))
      return alert('Please enter a valid email address.');
    if (!validatePhone(formData.contactPhone))
      return alert('Please enter a valid phone number.');
    if (!formData.agreeToTerms)
      return alert('You must agree to the terms before submitting.');

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
    border: darkMode
      ? '1px solid rgba(255,255,255,0.2)'
      : '1px solid rgba(0,0,0,0.15)',
    backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : '#ffffff',
    color: darkMode ? '#f9fafb' : '#111827',
    fontSize: '16px',
    marginBottom: '1.2rem',
    transition: 'all 0.3s ease-in-out',
    outline: 'none',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
  };

  const buttonStyle = {
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.5)',
  };

  const popupIcon = (text) => (
    <span
      onClick={() => showPopup(text)}
      style={{
        marginLeft: '8px',
        color: darkMode ? '#ccc' : '#555',
        cursor: 'pointer',
      }}
    >
      ℹ️
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
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/dj-background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <canvas
        id="confetti"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {infoPopup && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 9998,
            }}
            onClick={hidePopup}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              color: '#111',
              borderRadius: '10px',
              padding: '1.5rem',
              maxWidth: '90%',
              maxHeight: '70vh',
              overflowY: 'auto',
              zIndex: 9999,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              fontSize: '15px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
            }}
          >
            <strong>Info:</strong>
            <p style={{ marginTop: '10px' }}>{infoPopup}</p>
            <button
              onClick={hidePopup}
              style={{
                marginTop: '14px',
                padding: '8px 16px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </>
      )}

      <div
        style={{
          textAlign: 'right',
          padding: '1rem 2rem',
          zIndex: 1000,
          position: 'relative',
        }}
      >
        <button
          onClick={toggleDarkMode}
          style={{
            padding: '6px 12px',
            fontSize: '14px',
            backgroundColor: darkMode ? '#f3f4f6' : '#111827',
            color: darkMode ? '#111827' : '#f3f4f6',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      <main
        style={{
          fontFamily: 'Montserrat, sans-serif',
          maxWidth: '640px',
          margin: '40px auto',
          background: darkMode
            ? 'rgba(17, 17, 17, 0.88)'
            : 'rgba(255, 255, 255, 0.92)',
          borderRadius: '20px',
          padding: '2rem',
          color: darkMode ? '#f9fafb' : '#111',
          boxShadow: '0 12px 50px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          Live City DJ Contract
        </h1>

        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
          📞{' '}
          <a
            href="tel:2036949388"
            style={{ color: '#2563eb', textDecoration: 'none' }}
          >
            (203) 694-9388
          </a>
          <br />
          📧{' '}
          <a
            href="mailto:therealdjbobbydrake@gmail.com"
            style={{ color: '#2563eb', textDecoration: 'none' }}
          >
            therealdjbobbydrake@gmail.com
          </a>
        </p>

        <p style={{ marginBottom: '2rem', textAlign: 'center' }}>
          Please complete the form below to reserve your event date.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <h2>✅ Contract submitted successfully!</h2>
            <p>Please send your payment to confirm the booking:</p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'center',
                marginBottom: '10px',
              }}
            >
              <Image src="/venmo.svg" alt="Venmo" width={24} height={24} />
              <strong>@Bobby-Martin-64</strong>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              <Image src="/cashapp.svg" alt="Cash App" width={24} height={24} />
              <strong>$LiveCity</strong>
            </div>

            <p style={{ marginTop: '1rem' }}>
              <strong>Total Due:</strong> ${calculateTotal()}
            </p>
            <p>A $100 deposit is required to reserve your event date.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Client Name:</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label>Contact Phone:</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              required
              placeholder="1234567890"
              style={inputStyle}
            />

            <label>Type of Event:</label>
            <input
              type="text"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label>Number of Guests:</label>
            <input
              type="number"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <label>Venue Name:</label>
            <input
              type="text"
              name="venueName"
              value={formData.venueName}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            {/* Venue Location is now a plain text field */}
            <label>Venue Location:</label>
            <input
              type="text"
              name="venueLocation"
              value={formData.venueLocation}
              onChange={handleChange}
              placeholder="Enter venue location"
              style={inputStyle}
            />

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.2rem',
              }}
            >
              <div style={{ flex: '1 1 100%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Event Date:
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: '1 1 48%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Start Time:
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: '1 1 48%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  End Time:
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <label style={{ fontWeight: 'bold' }}>
                Standard DJ Package 💰 $350.00
              </label>
              {popupIcon(
                '5 Hours (Includes professional DJ/EMCEE, high-quality sound system, wireless microphone, extensive music selection, setup & teardown)'
              )}
            </div>
            <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>
              Event Add-Ons:
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <label>
                <input
                  type="checkbox"
                  name="lighting"
                  checked={formData.lighting}
                  onChange={handleChange}
                />
                Event Lighting (+$100)
              </label>
              {popupIcon(
                'Strobe/party lights. Requires venue access 2 hours before event'
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <label>
                <input
                  type="checkbox"
                  name="photography"
                  checked={formData.photography}
                  onChange={handleChange}
                />
                Event Photography (+$150)
              </label>
              {popupIcon(
                '50 high-quality candid shots, delivered within 48 hours'
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <label>
                <input
                  type="checkbox"
                  name="videoVisuals"
                  checked={formData.videoVisuals}
                  onChange={handleChange}
                />
                Video Visuals (+$100)
              </label>
              {popupIcon('Slideshows, presentations, etc.')}
            </div>

            <br />
            <label>Additional Hours ($75/hr):</label>
            <input
              type="number"
              name="additionalHours"
              value={formData.additionalHours}
              onChange={handleChange}
              min="0"
              style={inputStyle}
            />

            <label>Payment Method:</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="Venmo - @Bobby-Martin-64">
                Venmo - @Bobby-Martin-64
              </option>
              <option value="Cash App - $LiveCity">
                Cash App - $LiveCity
              </option>
              <option value="Cash">Cash</option>
            </select>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <label>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
                I agree to the Terms & Conditions
              </label>
              {popupIcon(termsText)}
            </div>

            <h3 style={{ marginTop: '1.5rem' }}>
              Total Price: ${calculateTotal()}
            </h3>
            <button type="submit" style={buttonStyle}>
              Submit Contract
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
