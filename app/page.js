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

  const [submitted, setSubmitted] = useState(false);

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

    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(formData.contactPhone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!formData.agreeToTerms) {
      alert('You must agree to the terms and conditions before submitting.');
      return;
    }

    try {
      await addDoc(collection(db, 'contracts'), formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error saving contract:', error);
      alert('Error submitting form. Please check console for details.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #4b5563',
    backgroundColor: '#1f2937',
    color: '#ffffff',
    fontSize: '16px',
    marginBottom: '1rem'
  };

  const iconInputStyle = {
    ...inputStyle,
    paddingRight: '40px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '1rem'
  };

  const popupIcon = (text) => (
    <span onClick={() => showPopup(text)} style={{ marginLeft: '8px', color: 'gray', cursor: 'pointer' }}>
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
      position: 'relative'
    }}>
      <Script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places" strategy="beforeInteractive" />

      <style>{`
        .popup-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 9998;
        }
        .popup-box {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          transition: all 0.3s ease-in-out;
          background-color: #fff;
          color: #000;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          z-index: 9999;
          max-width: 90%;
          max-height: 70vh;
          overflow-y: auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .popup-box.hide {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
        }
        .popup-box p {
          white-space: pre-wrap;
        }
      `}</style>

      {infoPopup && (
        <>
          <div className="popup-backdrop" onClick={hidePopup} />
          <div className={`popup-box ${showPopupBox ? '' : 'hide'}`}>
            <strong>Info:</strong>
            <p>{infoPopup}</p>
            <button onClick={hidePopup} style={{
              marginTop: '10px',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>Close</button>
          </div>
        </>
      )}

      <main style={{
        fontFamily: 'Montserrat, sans-serif',
        maxWidth: '600px',
        margin: '40px auto',
        background: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '12px',
        padding: '2rem',
        color: '#000',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
          Live City DJ Contract
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Contact Information:<br />
          📞 (203) 694-9388<br />
          📧 therealdjbobbydrake@gmail.com
        </p>
        <p style={{ marginBottom: '2rem', textAlign: 'center' }}>
          Please complete the form below to reserve your event date.
        </p>

        {submitted ? (
          <div>
            <h2>✅ Contract submitted successfully!</h2>
            <p>Please send your payment to confirm the booking:</p>
            <ul>
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
              <FaCalendarAlt style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'black' }} />
            </div>

            <label>Start Time:</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required style={iconInputStyle} />
              <FaClock style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'black' }} />
            </div>

            <label>End Time:</label>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required style={iconInputStyle} />
              <FaClock style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'black' }} />
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
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required style={{ ...inputStyle, appearance: 'none', backgroundImage: 'none' }}>
              <option value="">Select</option>
              <option value="Venmo">Venmo</option>
              <option value="Cash App">Cash App</option>
              <option value="Apple Pay">Apple Pay</option>
              <option value="Cash">Cash</option>
            </select>

            <label>
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required /> I agree to the Terms & Conditions
              {popupIcon(termsText)}
            </label>

            <h3>Total Price: ${calculateTotal()}</h3><br />
            <button type="submit" style={buttonStyle}>Submit Contract</button>
          </form>
        )}
      </main>
    </div>
  );
}
