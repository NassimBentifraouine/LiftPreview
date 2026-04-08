import DktIcon from './DktIcon';

export default function AdministrationPage() {
  return (
    <div style={{ backgroundColor: 'rgba(245,244,245,0.7)', minHeight: '100%' }}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 pt-8 pb-8">
        <h1
          className="m-0 mb-2"
          style={{
            fontFamily: 'var(--font-family-display)',
            fontSize: '28px',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--foreground)',
          }}
        >
          Administration
        </h1>
        <p
          className="m-0 mb-8"
          style={{
            fontFamily: 'var(--font-family-text)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--muted-foreground)',
          }}
        >
          Espace réservé au rôle `lift-admin`
        </p>
        <div
          className="flex flex-col items-center justify-center py-20"
          style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)' }}
        >
          <DktIcon name="settings" size={44} color="var(--primary)" />
          <p
            style={{
              fontFamily: 'var(--font-family-text)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--foreground)',
              margin: '14px 0 0',
            }}
          >
            Paramètres d’administration (maquette)
          </p>
          <p
            style={{
              fontFamily: 'var(--font-family-text)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--muted-foreground)',
              margin: '4px 0 0',
            }}
          >
            Gestion des rôles, exports et configuration globale.
          </p>
        </div>
      </div>
    </div>
  );
}
