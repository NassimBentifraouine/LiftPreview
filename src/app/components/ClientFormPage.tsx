import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App } from 'antd';
import { useNavigate, useSearchParams } from 'react-router';
import ClientForm from './ClientForm';
import ProgressSidebar from './ProgressSidebar';
import DktIcon from './DktIcon';
import type { FormSection } from './types';
import { useRoleAccess } from './RoleAccess';
export type { FormSection };

const formSections: FormSection[] = [
  {
    id: 'identite',
    title: 'Identité légale & commerciale',
    shortTitle: 'Identité',
    description: 'Informations légales et commerciales du client',
    icon: <DktIcon name="user" size={18} color="currentColor" />,
    subsections: [
      { id: 'identite-generale', label: 'Identité générale', fields: ['raisonSociale', 'paysImmatriculation', 'customerGroup', 'typeClient', 'nature', 'telephone', 'email'] },
      { id: 'identifiants-fiscaux', label: 'Identifiants fiscaux', fields: ['assujettTVA', 'numeroTVA', 'legalId', 'numeroInscription'] },
      { id: 'adresse-principale', label: 'Adresse principale', fields: ['adresseNumero', 'adresseVoie', 'adresseVille', 'adresseCP'] },
      { id: 'adresse-livraison', label: 'Adresse de livraison', fields: ['paysLivraison', 'identifiantLivraison', 'adresseLivraisonDifferente', 'livraisonNumero', 'livraisonVoie', 'livraisonVille', 'livraisonCP'] },
    ],
  },
  {
    id: 'finance',
    title: 'Paramètres financiers & comptables',
    shortTitle: 'Finance',
    description: 'Configuration financière et comptable',
    icon: <DktIcon name="money" size={18} color="currentColor" />,
    subsections: [
      { id: 'entite-facturante', label: 'Entité facturante', fields: ['paysFacturant', 'nomEntiteFacturante', 'facturantNumero', 'facturantVoie', 'facturantCP', 'facturantVille', 'telephoneLocal', 'emailFacturation'] },
      { id: 'parametres-comptables', label: 'Paramètres comptables', fields: ['accountReceivable', 'devise', 'tauxTVA', 'statusTVA', 'modePaiement', 'delaiPaiement', 'glKey'] },
    ],
  },
  {
    id: 'justificatifs',
    title: 'Justificatifs & validation',
    shortTitle: 'Justificatifs',
    description: 'Documents et commentaires',
    icon: <DktIcon name="clipboard" size={18} color="currentColor" />,
    subsections: [
      { id: 'documents', label: 'Documents', fields: ['documents'] },
      { id: 'commentaires', label: 'Commentaires', fields: ['commentaires'] },
    ],
  },
];

export default function ClientFormPage() {
  const { message } = App.useApp();
  const { permissions } = useRoleAccess();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeSection, setActiveSection] = useState<string>('identite');
  const [activeSubsection, setActiveSubsection] = useState<string>('identite-generale');
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [hasAccountReceivable, setHasAccountReceivable] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isManualScrollRef = useRef(false);

  const requestedViewMode = searchParams.get('mode') === 'view';
  const linkedTierId = searchParams.get('tierId');
  const canEditClient = permissions.canCreateClients || permissions.isAdmin;
  const readOnly = !canEditClient;
  const canValidateBusiness = permissions.canValidateBusinessClients || permissions.isAdmin;
  const canGoToLinkedTier = !!linkedTierId && permissions.canAccessTiers;

  const handleFieldComplete = (fieldName: string, isComplete: boolean) => {
    setCompletedFields(prev => {
      const newSet = new Set(prev);
      if (isComplete) newSet.add(fieldName);
      else newSet.delete(fieldName);
      return newSet;
    });
  };

  const handleFieldTouch = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  };

  const scrollToId = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (el && contentRef.current) {
      isManualScrollRef.current = true;
      const top = el.offsetTop - 20;
      contentRef.current.scrollTo({ top, behavior: 'smooth' });
      setTimeout(() => { isManualScrollRef.current = false; }, 900);
    }
  }, []);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isManualScrollRef.current) return;
      const scrollPos = container.scrollTop + 150;
      for (let i = formSections.length - 1; i >= 0; i -= 1) {
        const el = document.getElementById(formSections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(formSections[i].id);
          const subs = formSections[i].subsections;
          let foundSub = subs[0]?.id || '';
          for (let j = subs.length - 1; j >= 0; j -= 1) {
            const subEl = document.getElementById(subs[j].id);
            if (subEl && subEl.offsetTop <= scrollPos) {
              foundSub = subs[j].id;
              break;
            }
          }
          setActiveSubsection(foundSub);
          break;
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCompletion = useMemo(() => {
    const allFields = formSections.flatMap(s => s.subsections.flatMap(sub => sub.fields));
    const count = allFields.filter(f => completedFields.has(f)).length;
    return allFields.length > 0 ? Math.round((count / allFields.length) * 100) : 0;
  }, [completedFields]);

  return (
    <div className="flex h-full min-h-0">
      <aside
        className="shrink-0 flex flex-col overflow-hidden"
        style={{
          width: sidebarCollapsed ? '60px' : '300px',
          backgroundColor: 'var(--primary)',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {sidebarCollapsed ? (
          <>
            <div className="shrink-0 px-3 pt-3 pb-2 flex justify-center">
              <button
                onClick={() => setSidebarCollapsed(prev => !prev)}
                className="flex items-center justify-center w-9 h-9 rounded-lg"
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.78)' }}
                aria-label="Ouvrir la navigation latérale"
                title="Ouvrir la navigation latérale"
              >
                <DktIcon name="menu" size={16} color="rgba(255,255,255,0.78)" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-1 py-3 flex-1 overflow-y-auto">
              {formSections.map((section) => {
                const isActive = activeSection === section.id;
                const allFields = section.subsections.flatMap(s => s.fields);
                const done = allFields.filter(f => completedFields.has(f)).length;
                const pct = allFields.length > 0 ? Math.round((done / allFields.length) * 100) : 0;
                const isComplete = pct === 100;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToId(section.id)}
                    title={section.title}
                    className="flex items-center justify-center w-10 h-10 rounded-lg"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: isComplete ? '#52c41a' : isActive ? 'white' : 'rgba(255,255,255,0.5)',
                      position: 'relative',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{section.icon}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="px-5 pt-4 pb-3 shrink-0 overflow-hidden">
              <div className="flex items-center justify-between gap-3 mb-4">
                <button
                  onClick={() => navigate('/clients')}
                  className="flex items-center gap-1.5"
                  style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-family-text)', fontSize: '13px' }}
                >
                  <DktIcon name="arrow-left" size={12} color="rgba(255,255,255,0.6)" />
                  Retour à la liste
                </button>
                <button
                  onClick={() => setSidebarCollapsed(prev => !prev)}
                  className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.78)' }}
                  aria-label="Réduire la navigation latérale"
                  title="Réduire la navigation latérale"
                >
                  <DktIcon name="menu-left" size={16} color="rgba(255,255,255,0.78)" />
                </button>
              </div>
              <h2 className="m-0 mb-1" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'white', lineHeight: '1.3' }}>
                Fiche Client LIFT
              </h2>
              <p className="m-0 mb-4" style={{ fontFamily: 'var(--font-family-text)', fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                Formulaire création / consultation
              </p>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontFamily: 'var(--font-family-text)', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Progression</span>
                  <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'white' }}>{totalCompletion}%</span>
                </div>
                <div style={{ height: '4px', borderRadius: '2px', backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${totalCompletion}%`, borderRadius: '2px', backgroundColor: totalCompletion === 100 ? '#52c41a' : 'white', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            </div>
            <div className="shrink-0" style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 20px' }} />
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <ProgressSidebar
                sections={formSections}
                activeSection={activeSection}
                activeSubsection={activeSubsection}
                completedFields={completedFields}
                onSectionClick={scrollToId}
                onSubsectionClick={scrollToId}
              />
            </div>
          </>
        )}
      </aside>

      <main className="flex-1 flex flex-col" style={{ backgroundColor: '#f6f6f5' }}>
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-10 pt-8 pb-10">
          {readOnly && (
            <div
              className="mb-4 px-4 py-3 rounded-lg"
              style={{ backgroundColor: 'rgba(54,67,186,0.08)', border: '1px solid rgba(54,67,186,0.15)' }}
            >
              <p className="m-0" style={{ fontFamily: 'var(--font-family-text)', fontSize: '13px', color: 'var(--foreground)' }}>
                Cette fiche est en lecture seule pour le rôle {permissions.ldap}.
              </p>
            </div>
          )}
          {!readOnly && requestedViewMode && (
            <div
              className="mb-4 px-4 py-3 rounded-lg"
              style={{ backgroundColor: 'rgba(82,196,26,0.08)', border: '1px solid rgba(82,196,26,0.2)' }}
            >
              <p className="m-0" style={{ fontFamily: 'var(--font-family-text)', fontSize: '13px', color: 'var(--foreground)' }}>
                Mode consultation détecté, mais ce rôle peut éditer: vous pouvez enregistrer et soumettre.
              </p>
            </div>
          )}

          <div style={{ pointerEvents: readOnly ? 'none' : 'auto' }}>
            <ClientForm
              sections={formSections}
              completedFields={completedFields}
              touchedFields={touchedFields}
              onFieldComplete={handleFieldComplete}
              onFieldTouch={handleFieldTouch}
              onAccountReceivableChange={setHasAccountReceivable}
            />
          </div>
          </div>
        </div>

        <div
          className="shrink-0"
          style={{
            backgroundColor: '#f6f6f5',
            borderTop: '1px solid var(--border)',
            boxShadow: '0 -8px 20px rgba(15, 23, 42, 0.06)',
          }}
        >
          <div className="max-w-4xl mx-auto px-10 py-4 flex items-center justify-between gap-3 flex-wrap">
            {canGoToLinkedTier ? (
              <button
                onClick={() => navigate(`/tiers/new?tierId=${linkedTierId}&mode=view`)}
                className="flex items-center gap-2 px-5 py-2.5"
                style={{
                  backgroundColor: 'transparent',
                  border: '1.5px solid var(--primary)',
                  borderRadius: 'var(--radius-button)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family-text)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--primary)',
                }}
              >
                Aller vers la fiche Tiers
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3 ml-auto flex-wrap justify-end">
              {canValidateBusiness && (
                <>
                  <button
                    onClick={() => message.success('Validation Business client effectuée (mock).')}
                    className="px-5 py-2.5"
                    style={{
                      backgroundColor: '#F6FFED',
                      border: '1px solid #B7EB8F',
                      borderRadius: 'var(--radius-button)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-family-text)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: '#389E0D',
                    }}
                  >
                    Valider Business
                  </button>
                  <button
                    onClick={() => message.success('Rejet Business client effectué (mock).')}
                    className="px-5 py-2.5"
                    style={{
                      backgroundColor: '#FFF1F0',
                      border: '1px solid #FFA39E',
                      borderRadius: 'var(--radius-button)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-family-text)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: '#CF1322',
                    }}
                  >
                    Rejeter Business
                  </button>
                </>
              )}

              {canEditClient && (
                <>
                  <button
                    disabled={readOnly}
                    className="px-5 py-2.5"
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-button)',
                      cursor: readOnly ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--font-family-text)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--foreground)',
                      opacity: readOnly ? 0.6 : 1,
                    }}
                  >
                    Enregistrer le brouillon
                  </button>
                  <button
                    disabled={readOnly}
                    className="px-7 py-2.5"
                    style={{
                      backgroundColor: 'var(--primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-button)',
                      cursor: readOnly ? 'not-allowed' : 'pointer',
                      fontFamily: 'var(--font-family-text)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(54,67,186,0.3)',
                      opacity: readOnly ? 0.6 : 1,
                    }}
                  >
                    Soumettre la fiche
                  </button>
                  </>
                )}
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
