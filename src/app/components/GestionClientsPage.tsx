import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import DktIcon from './DktIcon';
import { COUNTRY_FLAG_FONT_FAMILY, getCountryDisplayPartsFromName } from './countryUtils';

type ClientStatus = 'validated' | 'pending_business' | 'rejected' | 'archived';
type SearchMode = 'name' | 'id';

interface Client {
  id: string;
  nom: string;
  dateCreation: string;
  dateMaj: string;
  pays: string;
  status: ClientStatus;
}

const statusConfig: Record<ClientStatus, { label: string; icon: string; bg: string; border: string; color: string }> = {
  validated: { label: 'Validated', icon: 'check-circle', bg: '#F6FFED', border: '#B7EB8F', color: '#389E0D' },
  pending_business: { label: 'Pending Business', icon: 'bank', bg: '#FFFBE6', border: '#FFE58F', color: '#D4B106' },
  rejected: { label: 'Rejected', icon: 'close-circle', bg: '#FFF1F0', border: '#FFA39E', color: '#CF1322' },
  archived: { label: 'Archived', icon: 'folder', bg: '#F5F5F5', border: '#D9D9D9', color: '#595959' },
};

const mockClients: Client[] = [
  { id: '200001', nom: 'SportMaster International', dateCreation: '3 Mars 2026 à 16h34', dateMaj: '4 Mars 2026 à 16h34', pays: 'France', status: 'validated' },
  { id: '200002', nom: 'FitLife Distribution', dateCreation: '3 Mars 2026 à 16h34', dateMaj: '4 Mars 2026 à 16h34', pays: 'Belgique', status: 'pending_business' },
  { id: '200003', nom: 'Alpine Sports GmbH', dateCreation: '3 Mars 2026 à 16h34', dateMaj: '4 Mars 2026 à 16h34', pays: 'Allemagne', status: 'rejected' },
  { id: '200004', nom: 'Mediterranean Outdoor SL', dateCreation: '3 Mars 2026 à 16h34', dateMaj: '4 Mars 2026 à 16h34', pays: 'Espagne', status: 'archived' },
];

const isAuditor = false;

const searchModes: { id: SearchMode; label: string }[] = [
  { id: 'name', label: 'Recherche par nom' },
  { id: 'id', label: 'Recherche par ID' },
];

const searchByName = (clients: Client[], query: string) => {
  const lower = query.toLowerCase();
  return clients.filter(client => client.nom.toLowerCase().includes(lower));
};

const searchById = (clients: Client[], query: string) => {
  return clients.filter(client => client.id === query);
};

export default function GestionClientsPage() {
  const navigate = useNavigate();
  const [searchMode, setSearchMode] = useState<SearchMode>('name');
  const [searchInput, setSearchInput] = useState('');
  const [committedIdQuery, setCommittedIdQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const trimmedInput = searchInput.trim();
  const isNameSearchActive = searchMode === 'name' && trimmedInput.length >= 3;
  const isIdSearchActive = searchMode === 'id' && committedIdQuery.length > 0;
  const isSearchActive = isNameSearchActive || isIdSearchActive;

  const filtered = useMemo(() => {
    if (searchMode === 'name') {
      if (!isNameSearchActive) return mockClients;
      return searchByName(mockClients, trimmedInput);
    }

    if (!isIdSearchActive) return mockClients;
    return searchById(mockClients, committedIdQuery);
  }, [searchMode, isNameSearchActive, isIdSearchActive, trimmedInput, committedIdQuery]);

  const handleModeChange = (mode: SearchMode) => {
    if (mode === searchMode) return;
    setSearchMode(mode);
    setSearchInput('');
    setCommittedIdQuery('');
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchMode === 'name') setCurrentPage(1);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (searchMode === 'id') {
      setCommittedIdQuery(searchInput.trim());
      setCurrentPage(1);
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setCommittedIdQuery('');
    setCurrentPage(1);
  };

  const handleOpenClient = (client: Client) => {
    const isArchivedLocked = client.status === 'archived' && !isAuditor;
    if (isArchivedLocked) return;
    navigate(`/clients/new?clientId=${client.id}&mode=view`);
  };

  const ls = { fontFamily: 'var(--font-family-text)' };

  return (
    <div style={{ backgroundColor: 'rgba(245,244,245,0.7)', minHeight: 'calc(100vh - 180px)' }}>
      <div className="max-w-[1440px] mx-auto px-16 pt-10 pb-8">
        {/* Title + Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="m-0" style={{ fontFamily: 'var(--font-family-display)', fontSize: '28px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: '42px' }}>
              Gestion des clients
            </h1>
            <p className="m-0" style={{ ...ls, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>
              Consultez et gérez tous les clients
            </p>
          </div>
          <button
            onClick={() => navigate('/clients/new')}
            className="flex items-center gap-2 px-6 py-2.5 shrink-0"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-button)',
              cursor: 'pointer',
              fontFamily: 'var(--font-family-text)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            Créer un client
            <DktIcon name="plus" size={16} color="white" />
          </button>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Search bar */}
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div
              className="inline-flex items-center p-1 mb-3"
              style={{
                backgroundColor: 'var(--input-background)',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                gap: '4px',
              }}
            >
              {searchModes.map(mode => {
                const active = mode.id === searchMode;
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className="px-4 py-1.5"
                    style={{
                      border: 'none',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      backgroundColor: active ? 'var(--primary)' : 'transparent',
                      color: active ? 'white' : 'var(--muted-foreground)',
                      fontFamily: 'var(--font-family-text)',
                      fontSize: '13px',
                      fontWeight: active ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                    }}
                  >
                    {mode.label}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full max-w-[480px]">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <DktIcon name="search" size={18} color="var(--muted-foreground)" />
              </div>
              <input
                type="text"
                placeholder={searchMode === 'name' ? 'Rechercher un client par nom' : 'Rechercher un client par ID'}
                value={searchInput}
                onChange={e => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-10 pr-10 py-2.5"
                style={{
                  fontFamily: 'var(--font-family-text)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-button)',
                  outline: 'none',
                }}
              />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                >
                  <DktIcon name="close" size={16} color="var(--muted-foreground)" />
                </button>
              )}
            </div>

            <p className="m-0 mt-2" style={{ fontFamily: 'var(--font-family-text)', fontSize: '12px', fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>
              {searchMode === 'name'
                ? 'La recherche se lance automatiquement à partir de 3 caractères'
                : 'La recherche se lance en appuyant sur Entrée'}
            </p>

            {searchMode === 'id' && searchInput.trim() && searchInput.trim() !== committedIdQuery && (
              <p className="m-0 mt-1" style={{ fontFamily: 'var(--font-family-text)', fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: 'var(--primary)' }}>
                Appuyez sur Entrée pour lancer cette recherche.
              </p>
            )}

            {isSearchActive && (
              <p className="m-0 mt-2" style={{ fontFamily: 'var(--font-family-text)', fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>
                {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
              </p>
            )}
            {filtered.some(client => client.status === 'archived') && !isAuditor && (
              <p className="m-0 mt-1" style={{ fontFamily: 'var(--font-family-text)', fontSize: '12px', fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>
                Les clients archivés sont visibles mais verrouillés.
              </p>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <DktIcon name="search" size={64} color="var(--muted-foreground)" style={{ opacity: 0.3 }} />
              <p className="mt-4" style={{ ...ls, fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)', margin: '16px 0 0' }}>
                {isSearchActive ? 'Aucun client trouvé pour cette recherche' : 'Aucun client'}
              </p>
              {isSearchActive && (
                <>
                  <p style={{ ...ls, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)', margin: '4px 0 0' }}>
                    Vérifiez l'orthographe ou essayez avec un autre terme.
                  </p>
                  <button
                    onClick={clearSearch}
                    className="flex items-center gap-1.5 mt-4 px-4 py-2"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-button)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-family-text)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--primary)',
                    }}
                  >
                    <DktIcon name="close" size={14} color="var(--primary)" />
                    Effacer la recherche
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid px-6 py-3" style={{ gridTemplateColumns: '80px 1fr 1fr 1fr 100px 180px 80px', borderBottom: '1px solid var(--border)' }}>
                {['ID', 'Nom du client', 'Date de création ↓', 'Date de mise à jour ↓', 'Pays', 'État', 'Actions'].map(h => (
                  <span key={h} style={{ ...ls, fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>{h}</span>
                ))}
              </div>
              {filtered.map((client, i) => {
                const cfg = statusConfig[client.status];
                const isArchivedLocked = client.status === 'archived' && !isAuditor;
                return (
                  <div
                    key={`${client.id}-${i}`}
                    onClick={() => handleOpenClient(client)}
                    className="grid px-6 py-3 items-center"
                    style={{
                      gridTemplateColumns: '80px 1fr 1fr 1fr 100px 180px 80px',
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: isArchivedLocked ? '#f6f6f6' : 'transparent',
                      opacity: isArchivedLocked ? 0.6 : 1,
                      cursor: isArchivedLocked ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <span
                      className="px-2 py-0.5 rounded inline-block w-fit"
                      style={{
                        backgroundColor: isArchivedLocked ? 'rgba(0,0,0,0.06)' : 'rgba(54,67,186,0.08)',
                        fontFamily: 'var(--font-family-text)',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-medium)',
                        color: isArchivedLocked ? 'var(--muted-foreground)' : 'var(--primary)',
                      }}
                    >
                      {client.id}
                    </span>
                    <span style={{ ...ls, fontSize: 'var(--text-sm)', color: isArchivedLocked ? 'var(--muted-foreground)' : 'var(--foreground)' }}>{client.nom}</span>
                    <span style={{ ...ls, fontSize: 'var(--text-sm)', color: isArchivedLocked ? 'var(--muted-foreground)' : 'var(--foreground)' }}>{client.dateCreation}</span>
                    <span style={{ ...ls, fontSize: 'var(--text-sm)', color: isArchivedLocked ? 'var(--muted-foreground)' : 'var(--foreground)' }}>{client.dateMaj}</span>
                    <span style={{ ...ls, fontSize: 'var(--text-sm)', color: isArchivedLocked ? 'var(--muted-foreground)' : 'var(--primary)' }}>
                      {(() => {
                        const country = getCountryDisplayPartsFromName(client.pays);
                        return (
                          <>
                            {country.flag && <span style={{ fontFamily: COUNTRY_FLAG_FONT_FAMILY, marginRight: '6px' }}>{country.flag}</span>}
                            {country.name}
                          </>
                        );
                      })()}
                    </span>
                    <span className="px-3 py-1 rounded-full inline-flex items-center gap-1.5 w-fit" style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, fontFamily: 'var(--font-family-text)', fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: cfg.color }}>
                      <DktIcon name={cfg.icon} size={14} color={cfg.color} />
                      {cfg.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={isArchivedLocked}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenClient(client);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: isArchivedLocked ? 'not-allowed' : 'pointer',
                          padding: '4px',
                          opacity: isArchivedLocked ? 0.5 : 1,
                        }}
                      >
                        <DktIcon name="eye" size={18} color="var(--muted-foreground)" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-end gap-1 mt-6">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
              <DktIcon name="arrow-left" size={16} color="var(--foreground)" />
            </button>
            {[1, 2].map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className="w-8 h-8 flex items-center justify-center rounded-full"
                style={{
                  backgroundColor: currentPage === p ? 'var(--primary)' : 'transparent',
                  color: currentPage === p ? 'white' : 'var(--foreground)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family-text)',
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(2, currentPage + 1))} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
              <DktIcon name="arrow-right" size={16} color="var(--foreground)" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
