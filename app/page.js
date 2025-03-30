'use client';

import { FaCalendarAlt, FaClock, FaInfoCircle } from 'react-icons/fa';
import { useState } from 'react';
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

  const showPopup = (text) => {
    setInfoPopup(text);
    setShowPopupBox(true);
  };

  const hidePopup = () => {
    setShowPopupBox(false);
    setTimeout(() => setInfoPopup(''), 300);
  };
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
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#000',
    fontSize: '16px',
    marginBottom: '1.2rem',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
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
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.5)'
  };
  const popupIcon = (text) => (
    <span onClick={() => showPopup(text)} style={{ marginLeft: '8px', color: '#555', cursor: 'pointer' }}>
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
      backgroundImage: 'url("/dj-background.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '2rem',
      animation: 'fadeIn 0.6s ease-in',
      position: 'relative'
    }}>
      <Script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places" strategy="beforeInteractive" />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

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
          transform: translate(-50%, -50%) scale(1);
          background: #ffffff;
          border-radius: 10px;
          padding: 1.5rem;
          width: 90%;
          max-width: 400px;
          max-height: 70vh;
          overflow-y: auto;
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          z-index: 9999;
          transition: all 0.3s ease-in-out;
        }

        .popup-box.hide {
          transform: translate(-50%, -50%) scale(0.9);
          opacity: 0;
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

        .fade-panel {
          animation: fadeIn 0.8s ease;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: #444;
        }
      `}</style>
      {infoPopup && (
        <>
          <div className="popup-backdrop" onClick={hidePopup} />
          <div className={`popup-box ${showPopupBox ? '' : 'hide'}`}>
            <strong>Info:</strong>
            <p>{infoPopup}</p>
            <button onClick={hidePopup}>Close</button>
          </div>
        </>
      )}

      <main className="fade-panel" style={{
        fontFamily: 'Montserrat, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '2rem',
        color: '#000',
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(8px)'
      }}>
        <div className="form-header">
          <h1>Live City DJ Contract</h1>
          <p>📞 (203) 694-9388<br />📧 therealdjbobbydrake@gmail.com</p>
          <p style={{ marginTop: '1rem' }}>Please complete the form below to reserve your event date.</p>
        </div>

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
              <FaCalendarAlt style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
            </div>

            <label>Start Time:</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required style={iconInputStyle} />
              <FaClock style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
            </div>

            <label>End Time:</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required style={iconInputStyle} />
              <FaClock style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
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
