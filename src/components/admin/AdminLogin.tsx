import React, { useState } from 'react';
import { adminSignIn } from '../../lib/firebase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminSignIn(email, password);
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setError('Ongeldig e-mailadres of wachtwoord.');
      } else if (code === 'auth/user-not-found') {
        setError('Geen account gevonden met dit e-mailadres. Is het aangemaakt in Firebase Console → Authentication → Users?');
      } else if (code === 'auth/unauthorized-domain') {
        setError('Dit domein is niet toegelaten voor inloggen. Voeg het toe in Firebase Console → Authentication → Settings → Authorized domains.');
      } else if (code === 'auth/network-request-failed') {
        setError('Geen internetverbinding met Firebase. Controleer uw netwerk en probeer opnieuw.');
      } else if (code === 'auth/too-many-requests') {
        setError('Te veel mislukte pogingen. Probeer het later opnieuw.');
      } else {
        setError(`Inloggen mislukt${code ? ` (${code})` : ''}. Zie README.md, sectie "Login werkt niet?" voor de meest voorkomende oorzaken.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-earth-dark p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-sand-light rounded-3xl p-8 shadow-2xl">
        <h1 className="font-serif text-2xl font-bold text-earth-dark mb-1">Beheerders-login</h1>
        <p className="text-sm text-earth-muted mb-6">Key-Design Architects</p>

        <label className="block text-xs font-bold text-earth-dark mb-1.5">E-mailadres</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-sand-dark/60 focus:border-terracotta focus:outline-none text-sm mb-4"
          autoFocus
        />

        <label className="block text-xs font-bold text-earth-dark mb-1.5">Wachtwoord</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-sand-dark/60 focus:border-terracotta focus:outline-none text-sm mb-4"
        />

        {error && <p className="text-xs text-red-600 font-medium mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-colors"
        >
          {loading ? 'Bezig…' : 'Inloggen'}
        </button>

        <p className="text-[11px] text-earth-muted mt-5 leading-relaxed">
          Wachtwoord vergeten? Beheer uw account rechtstreeks in de Firebase Console onder Authentication.
        </p>
      </form>
    </div>
  );
}
