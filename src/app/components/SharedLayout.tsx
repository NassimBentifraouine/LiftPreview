import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import svgPaths from '../../imports/GestionDesClientsIdentiteLegaleCommerciale/svg-1u2yb8hdjl';
import vectorSvg from '../../imports/Vector/svg-rrze67tj7b';
import imgIdentityAccess from '../../imports/GestionDesClientsIdentiteLegaleCommerciale/da8e68b134895af709a262e8dd58767788d0542c.png';
import DktIcon from './DktIcon';
import { canAccessPath, type RolePermissions, useRoleAccess } from './RoleAccess';

const tabs: Array<{
  id: string;
  label: string;
  path: string;
  visible: (permissions: RolePermissions) => boolean;
}> = [
  { id: 'tiers', label: 'Gestion des tiers', path: '/tiers', visible: permissions => permissions.canAccessTiers },
  { id: 'clients', label: 'Gestion des clients', path: '/clients', visible: permissions => permissions.canAccessClients },
  { id: 'brouillons', label: 'Mes brouillons', path: '/brouillons', visible: permissions => permissions.canAccessDrafts },
  { id: 'export', label: 'Exports', path: '/export', visible: permissions => permissions.canAccessExport },
  { id: 'administration', label: 'Administration', path: '/administration', visible: permissions => permissions.canAccessAdministration },
];

export default function SharedLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, setRole, roleOptions, permissions } = useRoleAccess();

  const isHome = location.pathname === '/';
  const isFormPage = location.pathname.includes('/clients/new') || location.pathname.includes('/tiers/new');
  const canAccessCurrentRoute = canAccessPath(location.pathname, permissions);

  const visibleTabs = useMemo(
    () => tabs.filter(tab => tab.visible(permissions)),
    [permissions],
  );

  const activeTab = visibleTabs.find(tab => location.pathname.startsWith(tab.path))?.id || '';

  const roleHighlights = useMemo(() => {
    const chips: string[] = [];
    chips.push(permissions.isReadOnly ? 'Lecture seule' : 'Édition autorisée');
    if (permissions.canAccessDrafts) chips.push('Accès brouillons');
    if (permissions.canValidateBusinessTiers || permissions.canValidateBusinessClients) chips.push('Validation Business');
    if (permissions.canValidateTreasuryTiers) chips.push('Validation Trésorerie');
    if (permissions.canViewArchivedTiers || permissions.canViewArchivedClients) chips.push('Accès archives');
    chips.push(permissions.canSeeBankDetails ? 'IBAN en clair' : 'IBAN masqué');
    return chips;
  }, [permissions]);

  useEffect(() => {
    if (!canAccessCurrentRoute) {
      navigate('/', { replace: true });
    }
  }, [canAccessCurrentRoute, navigate]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <header className="shrink-0 z-50" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between px-4 md:px-8 xl:px-12 2xl:px-16 py-4 md:py-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <svg className="w-[187px] h-[28px]" fill="none" preserveAspectRatio="none" viewBox="0 0 186.16 28">
              <g>
                <path d={svgPaths.p1c8976a0} fill="var(--primary)" />
                <path d={svgPaths.p2f960740} fill="var(--primary)" />
              </g>
            </svg>
            <div className="flex items-center justify-center mx-2" style={{ transform: 'rotate(90deg)' }}>
              <div style={{ width: '21px', height: '1px', backgroundColor: 'var(--primary)' }} />
            </div>
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

        <div className="px-4 md:px-8 xl:px-12 2xl:px-16 pb-3 md:pb-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-start justify-between gap-4 pt-3 flex-wrap">
            <div>
              <p
                className="m-0"
                style={{ fontFamily: 'var(--font-family-text)', fontSize: '12px', color: 'var(--muted-foreground)' }}
              >
                Simulation des rôles LDAP (maquette front)
              </p>
              <p
                className="m-0 mt-1"
                style={{ fontFamily: 'var(--font-family-text)', fontSize: '13px', color: 'var(--foreground)', fontWeight: 'var(--font-weight-semibold)' }}
              >
                Rôle actif : {permissions.ldap}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end max-w-[940px]">
              {roleOptions.map(option => {
                const active = option.role === role;
                return (
                  <button
                    key={option.role}
                    onClick={() => {
                      setRole(option.role);
                      navigate('/', { replace: true });
                    }}
                    className="px-2.5 py-1.5 rounded-full"
                    style={{
                      border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: active ? 'rgba(54,67,186,0.08)' : 'var(--card)',
                      color: active ? 'var(--primary)' : 'var(--muted-foreground)',
                      fontFamily: 'var(--font-family-text)',
                      fontSize: '12px',
                      fontWeight: active ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                      cursor: 'pointer',
                    }}
                    title={option.label}
                  >
                    {option.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            {roleHighlights.map(chip => (
              <span
                key={chip}
                className="px-2 py-1 rounded-full inline-flex items-center gap-1"
                style={{
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-family-text)',
                  fontSize: '11px',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                <DktIcon name="shield" size={12} color="var(--muted-foreground)" />
                {chip}
              </span>
            ))}
          </div>
        </div>

        {!isHome && !isFormPage && visibleTabs.length > 0 && (
          <div className="flex justify-center overflow-x-auto" style={{ borderTop: '1px solid var(--border)' }}>
            {visibleTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="px-4 md:px-6 py-3 shrink-0"
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

      <main className={isFormPage ? 'flex-1 min-h-0 overflow-hidden' : 'flex-1 min-h-0 overflow-y-auto'}>
        {canAccessCurrentRoute ? <Outlet /> : null}
      </main>

      <footer
        className="shrink-0 flex items-center justify-center gap-3 md:gap-5 px-4 md:px-8 py-3 md:py-4 flex-wrap"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-family-text)',
            fontSize: '12px',
            fontWeight: 'var(--font-weight-normal)',
            color: 'white',
            margin: 0,
          }}
        >
          LIFT évolue. Cette application est en cours de développement (MVP). Vos retours sont précieux pour nous aider à l’améliorer.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-family-text)',
            fontSize: '12px',
            fontWeight: 'var(--font-weight-normal)',
            color: 'white',
            margin: 0,
          }}
        >
          V0.0
        </p>
      </footer>
    </div>
  );
}

