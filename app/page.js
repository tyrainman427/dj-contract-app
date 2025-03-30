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
    border: '1px solid rgba(255,255,255,0.3)',
    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    color: darkMode ? '#f9fafb' : '#111827',
    fontSize: '16px',
    marginBottom: '1.2rem',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.2s ease-in-out',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
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
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <canvas id="confetti" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <Script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places" strategy="beforeInteractive" />

      <style>{`
        .popup-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background-color: rgba(0,0,0,0.5);
          z-index: 9998;
        }

        .popup-box {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #ffffff;
          border-radius: 10px;
          padding: 1.5rem;
          width: 90%;
          max-width: 400px;
          max-height: 70vh;
          overflow-y: auto;
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          z-index: 9999;
        }

        .popup-box p {
          white-space: pre-wrap;
          font-size: 14px;
          color: #333;
        }

        .popup-box button {
          margin-top: 12px;
          padding: 8px 14px;
          background-color: #ef4444;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>

      <div style={{ textAlign: 'right', padding: '0.5rem 2rem', zIndex: 1000 }}>
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
      {infoPopup && (
        <>
          <div className="popup-backdrop" onClick={hidePopup} />
          <div className="popup-box">
            <strong>Info:</strong>
            <p>{infoPopup}</p>
            <button onClick={hidePopup}>Close</button>
          </div>
        </>
      )}

      <main style={{
        fontFamily: 'Montserrat, sans-serif',
        maxWidth: '600px',
        margin: '40px auto',
        background: darkMode ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.85)',
        borderRadius: '16px',
        padding: '2rem',
        color: darkMode ? '#f9fafb' : '#000',
        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(8px)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeIn 0.6s ease-in-out'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
          Live City DJ Contract
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
          📞 (203) 694-9388<br />
          📧 therealdjbobbydrake@gmail.com
        </p>
        <p style={{ marginBottom: '2rem', textAlign: 'center' }}>
          Please complete the form below to reserve your event date.
        </p>

        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <h2>✅ Contract submitted successfully!</h2>
            <p>Please send your payment to confirm the booking:</p>
            <ul style={{ textAlign: 'left' }}>
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

            <label>Venue Name:</label>
            <input type="text" name="venueName" value={formData.venueName} onChange={handleChange} required style={inputStyle} />

            <label>Venue Location:</label>
            <input type="text" name="venueLocation" value={formData.venueLocation} onChange={handleChange} required style={inputStyle} />

            <label>Event Date:</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required style={iconInputStyle} />
              <FaCalendarAlt style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: darkMode ? '#bbb' : '#555' }} />
            </div>

            <label>Start Time:</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required style={iconInputStyle} />
              <FaClock style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: darkMode ? '#bbb' : '#555' }} />
            </div>

            <label>End Time:</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required style={iconInputStyle} />
              <FaClock style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: darkMode ? '#bbb' : '#555' }} />
            </div>

            <label>
              <strong>Standard DJ Package 💰 $350.00</strong>
              {popupIcon('5 Hours (Includes professional DJ/EMCEE, high-quality sound system, wireless microphone, extensive music selection, setup & teardown)')}
            </label>

            <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>Event Add-Ons:</p>
            <label><input type="checkbox" name="lighting" checked={formData.lighting} onChange={handleChange} /> Event Lighting (+$100){popupIcon('Strobe/party lights. Requires venue access 2 hours before event')}</label><br />
            <label><input type="checkbox" name="photography" checked={formData.photography} onChange={handleChange} /> Event Photography (+$150){popupIcon('50 high-quality candid shots, delivered within 48 hours')}</label><br />
            <label><input type="checkbox" name="videoVisuals" checked={formData.videoVisuals} onChange={handleChange} /> Video Visuals (+$100){popupIcon('Slideshows, presentations, etc.')}</label><br /><br />

            <label>Additional Hours ($75/hr):</label>
            <input type="number" name="additionalHours" value={formData.additionalHours} onChange={handleChange} min="0" style={inputStyle} />

            <label>Payment Method:</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required style={inputStyle}>
              <option value="">Select</option>
              <option value="Venmo">Venmo</option>
              <option value="Cash App">Cash App</option>
              <option value="Apple Pay">Apple Pay</option>
              <option value="Cash">Cash</option>
            </select>

            <label>
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
              I agree to the Terms & Conditions {popupIcon(termsText)}
            </label>

            <h3 style={{ marginTop: '1.5rem' }}>Total Price: ${calculateTotal()}</h3>
            <button type="submit" style={buttonStyle}>Submit Contract</button>
          </form>
        )}
      </main>
    </div>
  );
}
