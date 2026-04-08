import { useMemo, useState } from 'react';
import { App, Popover, Select } from 'antd';
import { useNavigate } from 'react-router';
import DktIcon from './DktIcon';
import CountryFlag from './CountryFlag';
import { getCountryDisplayPartsFromName } from './countryUtils';
import { useRoleAccess } from './RoleAccess';

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
  validated: { label: 'Validé', icon: 'check-circle', bg: '#F6FFED', border: '#B7EB8F', color: '#389E0D' },
  pending_business: { label: 'En attente métier', icon: 'bank', bg: '#FFFBE6', border: '#FFE58F', color: '#D4B106' },
  rejected: { label: 'Rejeté', icon: 'close-circle', bg: '#FFF1F0', border: '#FFA39E', color: '#CF1322' },
  archived: { label: 'Archivé', icon: 'folder', bg: '#F5F5F5', border: '#D9D9D9', color: '#595959' },
};

const mockClients: Client[] = [
  { id: '200001', nom: 'SportMaster International', dateCreation: '3 Mars 2026 à 16h34', dateMaj: '4 Mars 2026 à 16h34', pays: 'France', status: 'validated' },
  { id: '200002', nom: 'FitLife Distribution', dateCreation: '3 Mars 2026 à 16h34', dateMaj: '4 Mars 2026 à 16h34', pays: 'Belgique', status: 'pending_business' },
  { id: '200003', nom: 'Alpine Sports GmbH', dateCreation: '3 Mars 2026 à 16h34', dateMaj: '4 Mars 2026 à 16h34', pays: 'Allemagne', status: 'rejected' },
  { id: '200004', nom: 'Mediterranean Outdoor SL', dateCreation: '3 Mars 2026 à 16h34', dateMaj: '4 Mars 2026 à 16h34', pays: 'Espagne', status: 'archived' },
];

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

const ID_FULL_LENGTH = 6;

export default function GestionClientsPage() {
  const { message } = App.useApp();
  const { permissions } = useRoleAccess();
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchMode, setSearchMode] = useState<SearchMode>('name');
  const [searchInput, setSearchInput] = useState('');
  const [committedIdQuery, setCommittedIdQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<ClientStatus[]>([]);
  const [countryFilters, setCountryFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const canCreateClient = permissions.canCreateClients || permissions.isAdmin;
  const canValidateBusiness = permissions.canValidateBusinessClients || permissions.isAdmin;
  const canOpenArchived = permissions.canOpenArchivedClients || permissions.isAdmin;

  const trimmedInput = searchInput.trim();
  const isNameSearchActive = searchMode === 'name' && trimmedInput.length >= 3;
  const isIdSearchActive = searchMode === 'id' && committedIdQuery.length > 0;
  const isSearchActive = isNameSearchActive || isIdSearchActive || statusFilters.length > 0 || countryFilters.length > 0;

  const filtered = useMemo(() => {
    let next = clients;

    if (searchMode === 'name') {
      if (isNameSearchActive) {
        next = searchByName(next, trimmedInput);
      }
    } else if (isIdSearchActive) {
      next = searchById(next, committedIdQuery);
    }

    if (statusFilters.length > 0) {
      next = next.filter(client => statusFilters.includes(client.status));
    }
    if (countryFilters.length > 0) {
      next = next.filter(client => countryFilters.includes(client.pays));
    }

    return next;
  }, [
    searchMode,
    isNameSearchActive,
    isIdSearchActive,
    trimmedInput,
    committedIdQuery,
    clients,
    statusFilters,
    countryFilters,
  ]);

  const handleModeChange = (mode: SearchMode) => {
    if (mode === searchMode) return;
    setSearchMode(mode);
    setSearchInput('');
    setCommittedIdQuery('');
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchMode === 'name') {
      setCurrentPage(1);
      return;
    }

    const normalized = value.trim();
    if (normalized.length === ID_FULL_LENGTH) {
      setCommittedIdQuery(normalized);
      setCurrentPage(1);
    }
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
    const isArchivedLocked = client.status === 'archived' && !canOpenArchived;
    if (isArchivedLocked) return;
    navigate(`/clients/new?clientId=${client.id}&mode=view`);
  };

  const handleBusinessDecision = (clientId: string, status: ClientStatus) => {
    setClients(previous => previous.map(client => (
      client.id === clientId ? { ...client, status } : client
    )));

    message.success(
      status === 'validated'
        ? `Client ${clientId} validé (mock).`
        : `Client ${clientId} rejeté (mock).`,
    );
  };

  const ls = { fontFamily: 'var(--font-family-text)' };
  const statusFilterOptions = useMemo(
    () => Object.entries(statusConfig).map(([value, cfg]) => ({ value, label: cfg.label })),
    [],
  );
  const countryFilterOptions = useMemo(() => {
    const countries = Array.from(new Set(clients.map(client => client.pays))).sort((a, b) => a.localeCompare(b));
    return countries.map(countryName => {
      const country = getCountryDisplayPartsFromName(countryName);
      return {
        value: countryName,
        label: (
          <span className="inline-flex items-center gap-1.5">
            {country.code && <CountryFlag code={country.code} size={14} />}
            <span>{country.name}</span>
          </span>
        ),
      };
    });
  }, [clients]);
  const statusFilterPanel = (
    <div className="w-[300px]">
      <p
        className="m-0 mb-1"
        style={{
          fontFamily: 'var(--font-family-text)',
          fontSize: '12px',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--muted-foreground)',
        }}
      >
        Filtrer par statut
      </p>
      <Select
        mode="multiple"
        allowClear
        maxTagCount="responsive"
        value={statusFilters}
        onChange={(values) => {
          setStatusFilters(values as ClientStatus[]);
          setCurrentPage(1);
        }}
        options={statusFilterOptions}
        placeholder="Sélectionnez un ou plusieurs statuts"
        style={{ width: '100%' }}
      />
      <div className="flex justify-end mt-3">
        <button
          onClick={() => {
            setStatusFilters([]);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-button)',
            cursor: 'pointer',
            fontFamily: 'var(--font-family-text)',
            fontSize: '12px',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--foreground)',
          }}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
  const countryFilterPanel = (
    <div className="w-[300px]">
      <p
        className="m-0 mb-1"
        style={{
          fontFamily: 'var(--font-family-text)',
          fontSize: '12px',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--muted-foreground)',
        }}
      >
        Filtrer par pays
      </p>
      <Select
        mode="multiple"
        allowClear
        maxTagCount="responsive"
        value={countryFilters}
        onChange={(values) => {
          setCountryFilters(values as string[]);
          setCurrentPage(1);
        }}
        options={countryFilterOptions}
        placeholder="Sélectionnez un ou plusieurs pays"
        style={{ width: '100%' }}
      />
      <div className="flex justify-end mt-3">
        <button
          onClick={() => {
            setCountryFilters([]);
            setCurrentPage(1);
          }}
          className="px-3 py-1.5"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-button)',
            cursor: 'pointer',
            fontFamily: 'var(--font-family-text)',
            fontSize: '12px',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--foreground)',
          }}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: 'rgba(245,244,245,0.7)', minHeight: '100%' }}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 pt-8 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="m-0" style={{ fontFamily: 'var(--font-family-display)', fontSize: '28px', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: '42px' }}>
              Gestion des clients
            </h1>
            <p className="m-0" style={{ ...ls, fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-normal)', color: 'var(--muted-foreground)' }}>
              Consultez et gérez tous les clients
            </p>
          </div>
          {canCreateClient && (
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
          )}
        </div>

        <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', overflow: 'hidden' }}>
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
                : `La recherche se lance à ${ID_FULL_LENGTH} caractères ou en appuyant sur Entrée`}
            </p>

            {searchMode === 'id' && searchInput.trim() && searchInput.trim() !== committedIdQuery && (
              <p className="m-0 mt-1" style={{ fontFamily: 'var(--font-family-text)', fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: 'var(--primary)' }}>
                Appuyez sur Entrée ou saisissez {ID_FULL_LENGTH} caractères pour lancer cette recherche.
              </p>
            )}

            {isSearchActive && (
              <p className="m-0 mt-2" style={{ fontFamily: 'var(--font-family-text)', fontSize: '12px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>
                {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
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
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: '1080px' }}>
                <div className="grid px-6 py-3 items-center" style={{ gridTemplateColumns: '80px 1fr 1fr 1fr 140px 180px 140px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ ...ls, fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>ID</span>
                  <span style={{ ...ls, fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>Nom du client</span>
                  <span style={{ ...ls, fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>Date de création</span>
                  <span style={{ ...ls, fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>Date de mise à jour</span>
                  <Popover trigger="click" placement="bottomLeft" content={countryFilterPanel}>
                    <button
                      className="flex items-center gap-1.5 p-0 bg-transparent border-0 w-fit"
                      style={{
                        cursor: 'pointer',
                        ...ls,
                        fontSize: '13px',
                        fontWeight: 'var(--font-weight-medium)',
                        color: countryFilters.length > 0 ? 'var(--primary)' : 'var(--muted-foreground)',
                      }}
                    >
                      Pays {countryFilters.length > 0 ? `(${countryFilters.length})` : ''}
                      <DktIcon name="filter" size={13} color={countryFilters.length > 0 ? 'var(--primary)' : 'var(--muted-foreground)'} />
                    </button>
                  </Popover>
                  <Popover trigger="click" placement="bottomLeft" content={statusFilterPanel}>
                    <button
                      className="flex items-center gap-1.5 p-0 bg-transparent border-0 w-fit"
                      style={{
                        cursor: 'pointer',
                        ...ls,
                        fontSize: '13px',
                        fontWeight: 'var(--font-weight-medium)',
                        color: statusFilters.length > 0 ? 'var(--primary)' : 'var(--muted-foreground)',
                      }}
                    >
                      État {statusFilters.length > 0 ? `(${statusFilters.length})` : ''}
                      <DktIcon name="filter" size={13} color={statusFilters.length > 0 ? 'var(--primary)' : 'var(--muted-foreground)'} />
                    </button>
                  </Popover>
                  <span style={{ ...ls, fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}>Actions</span>
                </div>
                {filtered.map((client, i) => {
                  const cfg = statusConfig[client.status];
                  const isArchivedLocked = client.status === 'archived' && !canOpenArchived;
                  return (
                    <div
                      key={`${client.id}-${i}`}
                      onClick={() => handleOpenClient(client)}
                      className="grid px-6 py-3 items-center"
                      style={{
                        gridTemplateColumns: '80px 1fr 1fr 1fr 140px 180px 140px',
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
                              {country.code && <CountryFlag code={country.code} size={14} style={{ marginRight: '6px' }} />}
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
                        {canValidateBusiness && client.status === 'pending_business' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBusinessDecision(client.id, 'validated');
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                              title="Valider"
                            >
                              <DktIcon name="check-circle" size={18} color="#389E0D" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBusinessDecision(client.id, 'rejected');
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                              title="Rejeter"
                            >
                              <DktIcon name="close-circle" size={18} color="#CF1322" />
                            </button>
                          </>
                        )}

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
                          title="Consulter"
                        >
                          <DktIcon name="eye" size={18} color="var(--muted-foreground)" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

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
