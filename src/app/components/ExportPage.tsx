export default function ExportPage() {
  return (
    <div style={{ backgroundColor: 'rgba(245,244,245,0.7)', minHeight: 'calc(100vh - 180px)' }}>
      <div className="max-w-[1440px] mx-auto px-16 pt-10 pb-8">
        <h1 className="m-0 mb-2" style={{ fontFamily: 'var(--font-family-display)', fontSize: '28px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
          Exporter de la donnée
        </h1>
        <p className="m-0 mb-8" style={{ fontFamily: 'var(--font-family-text)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>
          Exportez vos données
        </p>
        <div
          className="flex flex-col items-center justify-center py-20"
          style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)' }}
        >
          <p style={{ fontFamily: 'var(--font-family-text)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)', margin: 0 }}>
            Fonctionnalité à venir
          </p>
          <p style={{ fontFamily: 'var(--font-family-text)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)', margin: '4px 0 0' }}>
            L'export de données sera disponible prochainement.
          </p>
        </div>
      </div>
    </div>
  );
}
