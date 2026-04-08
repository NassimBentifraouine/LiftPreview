import { Outlet, useLocation, useNavigate } from 'react-router';
import svgPaths from '../../imports/GestionDesClientsIdentiteLegaleCommerciale/svg-1u2yb8hdjl';
import vectorSvg from '../../imports/Vector/svg-rrze67tj7b';
import imgIdentityAccess from '../../imports/GestionDesClientsIdentiteLegaleCommerciale/da8e68b134895af709a262e8dd58767788d0542c.png';
import DktIcon from './DktIcon';

const tabs = [
  { id: 'tiers', label: 'Gestion des tiers', path: '/tiers' },
  { id: 'clients', label: 'Gestion des clients', path: '/clients' },
  { id: 'brouillons', label: 'Mes brouillons', path: '/brouillons' },
  { id: 'export', label: 'Exporter de la donnée', path: '/export' },
];

export default function SharedLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isFormPage = location.pathname.includes('/clients/new') || location.pathname.includes('/tiers/new');

  // Determine active tab
  const activeTab = tabs.find(t => location.pathname.startsWith(t.path))?.id || '';

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* ═══ HEADER ═══ */}
      <header className="shrink-0 z-50" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between px-16 py-6">
          {/* Logo area */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            {/* Decathlon logo */}
            <svg className="w-[187px] h-[28px]" fill="none" preserveAspectRatio="none" viewBox="0 0 186.16 28">
              <g>
                <path d={svgPaths.p1c8976a0} fill="var(--primary)" />
                <path d={svgPaths.p2f960740} fill="var(--primary)" />
              </g>
            </svg>
            {/* Divider */}
            <div
              className="flex items-center justify-center mx-2"
              style={{ transform: 'rotate(90deg)' }}
            >
              <div style={{ width: '21px', height: '1px', backgroundColor: 'var(--primary)' }} />
            </div>
            {/* Lift logo */}
            <svg className="w-[75px] h-[27px]" fill="none" preserveAspectRatio="none" viewBox="0 0 74.5315 27">
              <path d={vectorSvg.p37bc1440} fill="var(--primary)" />
              <path d={vectorSvg.p33194580} fill="var(--primary)" />
              <path d={vectorSvg.p31402500} fill="var(--primary)" />
              <path d={vectorSvg.p355b2680} fill="var(--primary)" />
              <path d={vectorSvg.p2ecbcc40} fill="var(--primary)" />
              <path d={vectorSvg.p276ff300} fill="var(--primary)" />
              <path d={vectorSvg.p3723a380} fill="#7AFFA6" />
            </svg>
          </div>
          {/* Right actions */}
          <div className="flex items-center gap-1">
            <img src={imgIdentityAccess} alt="Identity Access" className="h-[22px] w-auto object-contain mr-2" />
            <button
              className="rounded-full w-12 h-12 flex items-center justify-center"
              style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                <path d={svgPaths.p36ff6200} fill="var(--foreground)" />
              </svg>
            </button>
            <button
              className="rounded-full w-12 h-12 flex items-center justify-center"
              style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <svg className="w-[15.5px] h-[19.95px]" fill="none" viewBox="0 0 15.5 19.95">
                <path clipRule="evenodd" d={svgPaths.p1ac0e600} fill="var(--foreground)" fillRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation tabs (not on home or form page) */}
        {!isHome && !isFormPage && (
          <div className="flex justify-center" style={{ borderTop: '1px solid var(--border)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="px-6 py-3"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family-text)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: activeTab === tab.id ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ═══ CONTENT ═══ */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer
        className="shrink-0 flex items-center justify-center gap-5 px-8 py-4"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <p style={{
          fontFamily: 'var(--font-family-text)',
          fontSize: '12px',
          fontWeight: 'var(--font-weight-normal)',
          color: 'white',
          margin: 0,
        }}>
          LIFT évolue ! Cette application est en cours de développement (MVP). Vos retours sont précieux pour nous aider à l'améliorer.
        </p>
        <p style={{
          fontFamily: 'var(--font-family-text)',
          fontSize: '12px',
          fontWeight: 'var(--font-weight-normal)',
          color: 'white',
          margin: 0,
        }}>
          V0.0
        </p>
      </footer>
    </div>
  );
}
