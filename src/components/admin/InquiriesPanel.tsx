import React, { useEffect, useState } from 'react';
import { fetchInquiries, updateInquiry, deleteInquiry } from '../../lib/firebase';

export default function InquiriesPanel() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries()
      .then(setInquiries)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const markDone = async (id: string) => {
    await updateInquiry(id, { status: 'Afgehandeld' });
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'Afgehandeld' } : i)));
  };

  const remove = async (id: string) => {
    if (!confirm('Deze aanvraag verwijderen?')) return;
    await deleteInquiry(id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) return <p className="text-sm text-earth-muted">Aanvragen laden…</p>;
  if (inquiries.length === 0) return <p className="text-sm text-earth-muted">Nog geen aanvragen ontvangen.</p>;

  return (
    <div className="space-y-3 max-w-3xl">
      {inquiries.map((i) => (
        <div key={i.id} className="p-5 rounded-2xl bg-white border border-sand-dark/40">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif font-bold text-earth-dark">{i.name}</p>
              <p className="text-xs text-earth-muted">{i.email} · {i.phone}</p>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${i.status === 'Afgehandeld' ? 'bg-green-100 text-green-700' : 'bg-terracotta/10 text-terracotta'}`}>
              {i.status || 'Nieuw'}
            </span>
          </div>
          {i.projectType && <p className="text-xs text-earth-muted mt-2">Type: {i.projectType} {i.location ? `· ${i.location}` : ''}</p>}
          {i.message && <p className="text-sm text-earth-dark mt-2 whitespace-pre-line">{i.message}</p>}
          <div className="mt-3 flex gap-3 text-xs">
            {i.status !== 'Afgehandeld' && <button onClick={() => markDone(i.id)} className="text-terracotta font-bold">Markeer als afgehandeld</button>}
            <button onClick={() => remove(i.id)} className="text-red-500 font-bold">Verwijderen</button>
          </div>
        </div>
      ))}
    </div>
  );
}
