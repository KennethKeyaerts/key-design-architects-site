import React, { useState } from 'react';

// Works with any host's deploy hook (Cloudflare Pages, Netlify, ...). The old
// Netlify variable name keeps working.
const BUILD_HOOK_URL = import.meta.env.PUBLIC_BUILD_HOOK || import.meta.env.PUBLIC_NETLIFY_BUILD_HOOK || '';

export default function PublishPanel() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handlePublish = async () => {
    if (!BUILD_HOOK_URL) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      await fetch(BUILD_HOOK_URL, { method: 'POST', mode: 'no-cors' });
      setStatus('sent');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-xl p-6 rounded-2xl bg-white border border-sand-dark/40">
      <h2 className="font-serif text-lg font-bold text-earth-dark mb-2">Wijzigingen publiceren</h2>
      <p className="text-sm text-earth-muted leading-relaxed mb-4">
        Teksten en projecten worden meteen opgeslagen in de database, maar de <strong>publieke website</strong> bestaat
        uit vooraf gebouwde pagina's (dit is wat de site snel en goed vindbaar maakt). Klik hieronder om een nieuwe
        build te starten. Na ongeveer 1 tot 2 minuten staan uw wijzigingen live.
      </p>
      <button
        onClick={handlePublish}
        disabled={status === 'sending'}
        className="py-3 px-8 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white text-sm font-bold uppercase tracking-wider rounded-xl"
      >
        {status === 'sending' ? 'Bezig met publiceren…' : 'Publiceer wijzigingen'}
      </button>
      {status === 'sent' && <p className="text-xs text-green-700 mt-3">Publicatie gestart ✓. De site wordt nu opnieuw opgebouwd.</p>}
      {status === 'error' && (
        <div className="text-xs text-red-700 mt-3 leading-relaxed space-y-2">
          <p><strong>De automatische publiceerknop is nog niet ingesteld.</strong> Dat is een eenmalige stap. Intussen kunt u gewoon handmatig publiceren:</p>
          <ol className="list-decimal ml-4 space-y-1">
            <li>Open het dashboard van uw hosting (zie de gids \"publiceerknop-instellen\") en ga naar uw site.</li>
            <li>Start daar een nieuwe deploy (bij Netlify: <strong>Deploys</strong>, dan <strong>Trigger deploy</strong>).</li>
            <li>Wacht 1 tot 2 minuten. Uw wijzigingen staan dan online.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
