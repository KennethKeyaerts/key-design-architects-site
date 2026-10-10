import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { saveInquiry } from '../lib/firebase';

const EMAILJS_PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID || '';

interface Props {
  preFilledType?: string;
  preFilledMessage?: string;
  lang?: 'nl' | 'en';
}

const PROJECT_TYPES_NL = ['Nieuwbouw', 'Totaalrenovatie', 'Interieur & Maatwerk', 'Regularisatie', 'Andere'];
const PROJECT_TYPES_EN = ['New-build', 'Full Renovation', 'Interior & Custom Work', 'Regularisation', 'Other'];

export default function ContactForm({ preFilledType, preFilledMessage, lang = 'nl' }: Props) {
  const en = lang === 'en';
  const PROJECT_TYPES = en ? PROJECT_TYPES_EN : PROJECT_TYPES_NL;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [projectType, setProjectType] = useState(preFilledType || PROJECT_TYPES[0]);
  const [message, setMessage] = useState(preFilledMessage || '');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Pages are static, so a query string (e.g. from the feasibility
  // calculator's "discuss this result" link) is read client-side on mount
  // rather than passed in as a build-time prop.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    const msg = params.get('message');
    if (type) setProjectType(type);
    if (msg) setMessage(msg);
  }, []);

  const validate = () => {
    if (!name.trim()) return en ? 'Please enter your name.' : 'Vul uw naam in.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return en ? 'Please enter a valid email address.' : 'Vul een geldig e-mailadres in.';
    if (phone.trim().length < 8) return en ? 'Please enter a valid phone number.' : 'Vul een geldig telefoonnummer in.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setIsSending(true);

    const payload = { name, email, phone, location, projectType, message };

    // 1. Email straight to Kenneth via EmailJS — works from a static site with
    //    no backend involved, so this can never silently fail the way the old
    //    server-only Nodemailer route did on Netlify.
    let emailOk = true;
    if (EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: name,
            from_email: email,
            phone,
            location,
            project_type: projectType,
            message,
          },
          { publicKey: EMAILJS_PUBLIC_KEY }
        );
      } catch (err) {
        console.error('EmailJS send failed:', err);
        emailOk = false;
      }
    } else {
      emailOk = false;
    }

    // 2. Keep a copy in Firestore so it shows up in the admin dashboard, even
    //    if the email step above ever fails.
    let firestoreOk = true;
    try {
      await saveInquiry(payload);
    } catch (err) {
      console.error('Saving inquiry to Firestore failed:', err);
      firestoreOk = false;
    }

    setIsSending(false);
    if (emailOk || firestoreOk) {
      setSuccess(true);
    } else {
      setError(
        en
          ? 'Something went wrong while sending. Please try again or email kennethkeyaerts@icloud.com directly.'
          : 'Er ging iets mis bij het versturen. Probeer het opnieuw of mail rechtstreeks naar kennethkeyaerts@icloud.com.'
      );
    }
  };

  if (success) {
    return (
      <div className="p-8 bg-white text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-terracotta/10 flex items-center justify-center text-2xl mb-4">✓</div>
        <h3 className="font-serif text-xl font-bold text-earth-dark mb-2">
          {en ? `Request sent, ${name}!` : `Aanvraag verstuurd, ${name}!`}
        </h3>
        <p className="text-sm text-earth-muted">
          {en
            ? 'Thank you for your interest. Kenneth will personally get in touch with you within 24 hours.'
            : 'Bedankt voor uw interesse. Kenneth neemt binnen 24 uur persoonlijk contact met u op.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="block text-xs font-bold text-earth-dark mb-1.5">{en ? 'Your Name *' : 'Uw Naam *'}</label>
          <input
            value={name}
            id="cf-name" autoComplete="name"
            onChange={(e) => setName(e.target.value)}
            placeholder={en ? 'e.g. John Smith' : 'bijv. Jan Janssens'}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-earth-dark/25 focus:border-terracotta focus:outline-none text-sm"
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="block text-xs font-bold text-earth-dark mb-1.5">{en ? 'Email Address *' : 'E-mailadres *'}</label>
          <input
            type="email"
            id="cf-email" autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={en ? 'e.g. john@domain.com' : 'bijv. jan@domein.be'}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-earth-dark/25 focus:border-terracotta focus:outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-phone" className="block text-xs font-bold text-earth-dark mb-1.5">{en ? 'Phone Number *' : 'Telefoonnummer *'}</label>
          <input
            value={phone}
            id="cf-phone" type="tel" autoComplete="tel"
            onChange={(e) => setPhone(e.target.value)}
            placeholder={en ? '+32 470 12 34 56' : '0470 12 34 56'}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-earth-dark/25 focus:border-terracotta focus:outline-none text-sm"
          />
        </div>
        <div>
          <label htmlFor="cf-location" className="block text-xs font-bold text-earth-dark mb-1.5">{en ? 'Project Location' : 'Locatie project'}</label>
          <input
            value={location}
            id="cf-location"
            onChange={(e) => setLocation(e.target.value)}
            placeholder={en ? 'e.g. Lier, Antwerp...' : 'bijv. Lier, Antwerpen...'}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-earth-dark/25 focus:border-terracotta focus:outline-none text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-type" className="block text-xs font-bold text-earth-dark mb-1.5">{en ? 'Project Type' : 'Type Project'}</label>
        <select
          value={projectType}
            id="cf-type"
          onChange={(e) => setProjectType(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border-2 border-earth-dark/25 focus:border-terracotta focus:outline-none text-sm bg-white"
        >
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-xs font-bold text-earth-dark mb-1.5">
          {en ? 'Briefly describe your wishes & ideas' : 'Beschrijf kort uw wensen & ideeën'}
        </label>
        <textarea
          value={message}
            id="cf-message"
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder={
            en
              ? `Briefly describe your specific wishes for your ${projectType.toLowerCase()}...`
              : `Beschrijf kort uw specifieke wensen voor uw ${projectType.toLowerCase()}...`
          }
          className="w-full px-4 py-2.5 rounded-xl border-2 border-earth-dark/25 focus:border-terracotta focus:outline-none text-sm resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      <button
        type="submit"
        disabled={isSending}
        className="btn-cartoon-primary w-full py-3.5 disabled:opacity-60 text-sm font-bold uppercase tracking-wider"
      >
        {isSending ? (en ? 'Sending…' : 'Bezig met versturen…') : (en ? 'Send Request' : 'Verstuur Aanvraag')}
      </button>
    </form>
  );
}
