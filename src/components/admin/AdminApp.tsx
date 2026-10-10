import React, { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAdminAuthChange, adminSignOut, fetchSiteSettings, fetchProjects, fetchHeroSlides } from '../../lib/firebase';
import AdminLogin from './AdminLogin';
import SiteTextsPanel from './SiteTextsPanel';
import ProjectsPanel from './ProjectsPanel';
import InquiriesPanel from './InquiriesPanel';
import PublishPanel from './PublishPanel';
import HeroPanel from './HeroPanel';
import BrandPanel from './BrandPanel';

const TABS = ['Hero', 'Projecten', 'Logo en foto\'s', 'Site teksten', 'Aanvragen', 'Publiceren'] as const;

export default function AdminApp() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Hero');
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => onAdminAuthChange(setUser), []);

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    Promise.all([fetchSiteSettings(), fetchProjects(), fetchHeroSlides()])
      .then(([s, p, h]) => {
        setSettings(s);
        setProjects(p);
        setHeroSlides(h);
      })
      .finally(() => setLoadingData(false));
  }, [user]);

  if (user === undefined) {
    return <div className="min-h-screen flex items-center justify-center text-earth-muted text-sm">Laden…</div>;
  }
  if (!user) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-sand-light">
      <header className="bg-white border-b border-sand-dark/40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-serif font-bold text-earth-dark">Key-Design Beheerdersdashboard</p>
            <p className="text-xs text-earth-muted">Ingelogd als {user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-xs text-earth-muted hover:text-terracotta">← Naar de website</a>
            <button onClick={() => adminSignOut()} className="text-xs font-bold text-terracotta">Uitloggen</button>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-6 flex gap-1 -mb-px">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? 'border-terracotta text-terracotta' : 'border-transparent text-earth-muted hover:text-earth-dark'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {loadingData ? (
          <p className="text-sm text-earth-muted">Gegevens laden…</p>
        ) : (
          <>
            {tab === 'Hero' && <HeroPanel settings={settings} onSettingsSaved={setSettings} slides={heroSlides} onSlidesChanged={setHeroSlides} projects={projects} />}
            {tab === 'Site teksten' && <SiteTextsPanel settings={settings} onSaved={setSettings} />}
            {tab === 'Projecten' && <ProjectsPanel projects={projects} onChanged={setProjects} slides={heroSlides} onSlidesChanged={setHeroSlides} />}
            {tab === "Logo en foto's" && <BrandPanel settings={settings} onSaved={setSettings} />}
            {tab === 'Aanvragen' && <InquiriesPanel />}
            {tab === 'Publiceren' && <PublishPanel />}
          </>
        )}
      </main>
    </div>
  );
}
