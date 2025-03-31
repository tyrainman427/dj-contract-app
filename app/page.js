'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import emailjs from '@emailjs/browser'; // 📩 Add EmailJS
import db from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

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

  const locationRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [infoPopup, setInfoPopup] = useState('');
  const [showPopupBox, setShowPopupBox] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  const sendEmailConfirmation = async () => {
    const templateParams = {
      clientName: formData.clientName,
      email: formData.email,
      venueName: formData.venueName,
      venueLocation: formData.venueLocation,
      eventDate: formData.eventDate,
      total: calculateTotal(),
    };

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      );
      console.log('✅ Email sent');
    } catch (error) {
      console.error('❌ Failed to send email:', error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.contactPhone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!formData.agreeToTerms) {
      alert('You must agree to the terms and conditions before submitting.');
      return;
    }

    try {
      // Save to Firestore
      await addDoc(collection(db, 'contracts'), {
        ...formData,
        total: calculateTotal(),
        createdAt: Timestamp.now(),
        eventTimestamp: Timestamp.fromDate(new Date(formData.eventDate))
      });

      // Send confirmation email
      await sendEmailConfirmation();

      // Mark as submitted
      setSubmitted(true);
      console.log('✅ Contract submitted and email sent:', formData);
    } catch (error) {
      console.error('❌ Error submitting form or sending email:', error);
      alert('Something went wrong while submitting the form.');
    }
  };
  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />

      <div
        style={{
          minHeight: '100vh',
          backgroundImage: 'url("/dj-background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'hidden'
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
            pointerEvents: 'none'
          }}
        />

        {submitted ? (
          <main
            style={{
              fontFamily: 'Montserrat, sans-serif',
              maxWidth: '640px',
              margin: '40px auto',
              background: 'rgba(255,255,255,0.92)',
              borderRadius: '20px',
              padding: '2rem',
              color: '#111',
              boxShadow: '0 12px 50px rgba(0,0,0,0.25)',
              position: 'relative',
              zIndex: 1,
              textAlign: 'center'
            }}
          >
            <h2>✅ Contract submitted successfully!</h2>
            <p>We've emailed you a confirmation with event and balance details.</p>
            <p>To secure your booking, please send your deposit using:</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '10px' }}>
              <Image src="/venmo.svg" alt="Venmo" width={24} height={24} />
              <strong>@Bobby-Martin-64</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
              <Image src="/cashapp.svg" alt="Cash App" width={24} height={24} />
              <strong>$LiveCity</strong>
            </div>

            <p style={{ marginTop: '1rem' }}><strong>Total Due:</strong> ${calculateTotal()}</p>
            <p>A $100 deposit is required to reserve your event date.</p>
          </main>
        ) : (
          // 👇 Form continues here in next chunk
          <form onSubmit={handleSubmit} style={{
            fontFamily: 'Montserrat, sans-serif',
            maxWidth: '640px',
            margin: '40px auto',
            background: 'rgba(255,255,255,0.92)',
            borderRadius: '20px',
            padding: '2rem',
            color: '#111',
            boxShadow: '0 12px 50px rgba(0,0,0,0.25)',
            position: 'relative',
            zIndex: 1
          }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>
              Live City DJ Contract
            </h1>

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
            <input
              type="text"
              name="venueLocation"
              ref={locationRef}
              placeholder="Enter address..."
              required
              style={inputStyle}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
              <div style={{ flex: '1 1 100%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Event Date:</label>
                <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 48%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Start Time:</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 48%' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>End Time:</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required style={inputStyle} />
              </div>
            </div>

            <label><strong>Standard DJ Package 💰 $350.00</strong></label>

            <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>Event Add-Ons:</p>

            <label>
              <input type="checkbox" name="lighting" checked={formData.lighting} onChange={handleChange} />
              Event Lighting (+$100)
            </label><br />

            <label>
              <input type="checkbox" name="photography" checked={formData.photography} onChange={handleChange} />
              Event Photography (+$150)
            </label><br />

            <label>
              <input type="checkbox" name="videoVisuals" checked={formData.videoVisuals} onChange={handleChange} />
              Video Visuals (+$100)
            </label><br /><br />

            <label>Additional Hours ($75/hr):</label>
            <input type="number" name="additionalHours" value={formData.additionalHours} onChange={handleChange} min="0" style={inputStyle} />

            <label>Payment Method:</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required style={inputStyle}>
              <option value="">Select</option>
              <option value="Venmo - @Bobby-Martin-64">Venmo - @Bobby-Martin-64</option>
              <option value="Cash App - $LiveCity">Cash App - $LiveCity</option>
              <option value="Cash">Cash</option>
            </select>

            <label>
              <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} required />
              I agree to the Terms & Conditions
            </label>

            <h3 style={{ marginTop: '1.5rem' }}>Total Price: ${calculateTotal()}</h3>
            <button type="submit" style={buttonStyle}>Submit Contract</button>
          </form>
        )}
      </div>
    </>
  );
}
