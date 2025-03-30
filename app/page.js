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
    setTimeout(() => setInfoPopup(''), 300); // Delay to allow animation to complete
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
      console.log('Contract submitted:', formData);
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
    <span
      onClick={() => showPopup(text)}
      style={{ marginLeft: '8px', color: 'gray', cursor: 'pointer' }}
    >
      <FaInfoCircle />
    </span>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("/dj-background.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '2rem',
    }}>
      <Script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places" strategy="beforeInteractive" />

      <main style={{
        fontFamily: 'Montserrat, sans-serif',
        maxWidth: '600px',
        margin: '40px auto',
        background: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '12px',
        padding: '2rem',
        color: '#000',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <style>{`
          .popup-box {
            transition: all 0.3s ease-in-out;
            transform: scale(1);
            opacity: 1;
          }
          .popup-box.hide {
            transform: scale(0.8);
            opacity: 0;
          }
        `}</style>

        {infoPopup && (
          <div className={`popup-box ${showPopupBox ? '' : 'hide'}`} style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            backgroundColor: '#fff',
            color: '#000',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            zIndex: 999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <strong>Info:</strong>
            <p>{infoPopup}</p>
            <button onClick={hidePopup} style={{ marginTop: '10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>Close</button>
          </div>
        )}

        {/* Rest of the form UI remains unchanged */}
        {/* ... */}
      </main>
    </div>
  );
}
