import React, { useState } from 'react';
import contactStyles from './Contact.module.css';
import { contactBg as bg } from '../assets/assets';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLinkedinIn, FaInstagram, FaGithub, FaCode } from 'react-icons/fa';
import { User, Mail, Phone, MessageSquare, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error("VITE_API_URL is missing in frontend .env file! Connection requires a valid backend URL.");
      }
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={contactStyles.contactPage} style={{ backgroundImage: `url(${bg})` }}>
      <div className={contactStyles.contentWrapper}>

        {/* Left Column - Contact Info */}
        <div className={contactStyles.leftColumn}>
          <div className={contactStyles.headerSection}>
            <div className={contactStyles.numberBadge}>
              <div className={contactStyles.numberLine}></div>
              <span className={contactStyles.numberText}>06</span>
            </div>
            <h1 className={contactStyles.title}>Contact Me</h1>
            <p className={contactStyles.subtitle}>
              Have a question, opportunity, or just want to say hello?<br />
              I'd love to hear from you. Let's connect!
            </p>
          </div>

          <div className={contactStyles.contactInfoList}>
            {/* Phone - opens dialer */}
            <a href="tel:+917439892210" className={contactStyles.infoItemLink}>
              <div className={contactStyles.infoItem}>
                <div className={contactStyles.iconWrapper}>
                  <FaPhoneAlt />
                </div>
                <div className={contactStyles.infoContent}>
                  <h4>Phone</h4>
                  <p>+91 74398 92210</p>
                </div>
              </div>
            </a>

            {/* Email - opens mail client */}
            <a href="mailto:mondalsubhodeep49@gmail.com" className={contactStyles.infoItemLink}>
              <div className={contactStyles.infoItem}>
                <div className={contactStyles.iconWrapper}>
                  <FaEnvelope />
                </div>
                <div className={contactStyles.infoContent}>
                  <h4>Email</h4>
                  <p>mondalsubhodeep49@gmail.com</p>
                </div>
              </div>
            </a>

            {/* Location */}
            <div className={contactStyles.infoItem}>
              <div className={contactStyles.iconWrapper}>
                <FaMapMarkerAlt />
              </div>
              <div className={contactStyles.infoContent}>
                <h4>Location</h4>
                <p>Kolkata, West Bengal, India</p>
              </div>
            </div>

            {/* Social Networks */}
            <div className={contactStyles.infoItem}>
              <div className={contactStyles.iconWrapper} style={{ border: 'none', width: '60px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </div>
              <div className={contactStyles.infoContent}>
                <h4>Social Network</h4>
                <div className={contactStyles.socialIcons}>
                  <a href="https://www.linkedin.com/in/subhodeep-mondal-a3a2762b5" target="_blank" rel="noreferrer" className={contactStyles.socialIcon}><FaLinkedinIn /></a>
                  <a href="https://www.instagram.com/shadowlegend847/" target="_blank" rel="noreferrer" className={contactStyles.socialIcon}><FaInstagram /></a>
                  <a href="https://github.com/ShadowLegend007" target="_blank" rel="noreferrer" className={contactStyles.socialIcon}><FaGithub /></a>
                  <a href="https://www.hackerrank.com/profile/mondalsubhodeep1" target="_blank" rel="noreferrer" className={contactStyles.socialIcon}><FaCode /></a>
                </div>
              </div>
            </div>
          </div>

          <div className={contactStyles.quote}>
            "The best way to predict the future<br />is to create it."
          </div>
        </div>

        {/* Right Column - Form */}
        <div className={contactStyles.rightColumn}>
          <div className={contactStyles.formCard}>
            <div className={contactStyles.formHeader}>
              SEND A MESSAGE
              <span className={contactStyles.flowerAcc}>🌸</span>
            </div>

            <form className={contactStyles.formGrid} onSubmit={handleSubmit}>
              <div className={contactStyles.inputGroup}>
                <User className={contactStyles.inputIcon} size={18} />
                <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Your Name" className={contactStyles.inputField} required />
              </div>

              <div className={contactStyles.inputGroup}>
                <Mail className={contactStyles.inputIcon} size={18} />
                <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Your E-mail" className={contactStyles.inputField} required />
              </div>

              <div className={`${contactStyles.inputGroup} ${contactStyles.fullWidth}`}>
                <Phone className={contactStyles.inputIcon} size={18} />
                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Phone Number" className={contactStyles.inputField} />
              </div>

              <div className={`${contactStyles.inputGroup} ${contactStyles.fullWidth}`} style={{ alignItems: 'flex-start' }}>
                <MessageSquare className={contactStyles.inputIcon} size={18} style={{ marginTop: '15px' }} />
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" className={contactStyles.textareaField} required></textarea>
              </div>

              <div className={contactStyles.fullWidth}>
                <button type="submit" className={contactStyles.submitBtn} disabled={status === 'sending'}>
                  {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'} <Send size={16} />
                </button>
                <div className={contactStyles.footerText}>
                  {status === 'success' && '✅ Message sent! I\'ll get back to you soon.'}
                  {status === 'error' && '❌ Failed to send. Please try again.'}
                  {status === 'idle' && '🌸 I\'ll get back to you as soon as possible.'}
                  {status === 'sending' && '⏳ Sending your message...'}
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
