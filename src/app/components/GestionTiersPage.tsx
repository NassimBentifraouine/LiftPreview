import { useState, useMemo, useCallback } from 'react';
import { App, Popover, Select } from 'antd';
import { useNavigate } from 'react-router';
import DktIcon from './DktIcon';
import CountryFlag from './CountryFlag';
import { getCountryDisplayPartsFromName } from './countryUtils';
import { useRoleAccess } from './RoleAccess';

type TierStatus =
  | 'draft'
  | 'pending_business'
  | 'pending_treasury'
  | 'validated'
  | 'validated_business'
  | 'validated_treasury'
  | 'rejected'
  | 'sap_rejected'
  | 'archived';
type SearchMode = 'name' | 'id';

interface Tier {
  id: string;
  nom: string;
  dateCreation: string;
  dateMaj: string;
  pays: string;
  status: TierStatus;
  createdAt: number;
  updatedAt: number;
}

const statusConfig: Record<TierStatus, { label: string; icon: string; bg: string; border: string; color: string }> = {
  draft: { label: 'BROUILLON', icon: 'document-text', bg: '#F5F5F5', border: '#D9D9D9', color: '#595959' },
  pending_business: { label: 'EN ATTENTE MÉTIER', icon: 'clock', bg: '#FFF7E6', border: '#FFD591', color: '#D46B08' },
  pending_treasury: { label: 'EN ATTENTE TRÉSORERIE', icon: 'bank', bg: '#E6F4FF', border: '#91CAFF', color: '#1677FF' },
  validated: { label: 'VALIDÉ', icon: 'check-circle', bg: '#F6FFED', border: '#B7EB8F', color: '#389E0D' },
  validated_business: { label: 'VALIDÉ MÉTIER', icon: 'check-circle', bg: '#F6FFED', border: '#B7EB8F', color: '#389E0D' },
  validated_treasury: { label: 'VALIDÉ TRÉSORERIE', icon: 'check-circle', bg: '#E6F4FF', border: '#91CAFF', color: '#1677FF' },
  rejected: { label: 'REJETÉ', icon: 'close-circle', bg: '#FFF1F0', border: '#FFA39E', color: '#CF1322' },
  sap_rejected: { label: 'REJET SAP', icon: 'warning', bg: '#FFF1F0', border: '#FFA39E', color: '#CF1322' },
  archived: { label: 'ARCHIVÉ', icon: 'folder', bg: '#F5F5F5', border: '#D9D9D9', color: '#595959' },
};

const liftDatabase: Record<string, { nom: string; status: TierStatus; pays: string }> = {
  '100001': { nom: 'Decathlon France SAS', status: 'validated', pays: 'France' },
  '100002': { nom: 'Decathlon Belgium NV', status: 'pending_business', pays: 'Belgique' },
  '100003': { nom: 'Decathlon España S.A.', status: 'pending_treasury', pays: 'Espagne' },
  '100004': { nom: 'Decathlon Italia SRL', status: 'draft', pays: 'Italie' },
  '100005': { nom: 'Decathlon Deutschland GmbH', status: 'validated_business', pays: 'Allemagne' },
  '100006': { nom: 'Decathlon UK Ltd', status: 'archived', pays: 'Royaume-Uni' },
  '100007': { nom: 'Decathlon Portugal Lda', status: 'sap_rejected', pays: 'Portugal' },
  '100008': { nom: 'Decathlon Poland Sp. z o.o.', status: 'validated_treasury', pays: 'Pologne' },
};

const mockTiers: Tier[] = Object.entries(liftDatabase).map(([id, data]) => {
  const index = Number(id.slice(-2));
  const createdAt = new Date(2026, 2, 1 + (index % 9), 9 + (index % 5), 12).getTime();
  const updatedAt = createdAt + (index % 5 + 1) * 24 * 60 * 60 * 1000;

  const formatDate = (timestamp: number) =>
    new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp)).replace(',', ' à');

  return {
    id,
    nom: data.nom,
    dateCreation: formatDate(createdAt),
    dateMaj: formatDate(updatedAt),
    pays: data.pays,
    status: data.status,
    createdAt,
    updatedAt,
  };
});

const searchModes: { id: SearchMode; label: string }[] = [
  { id: 'name', label: 'Recherche par nom' },
  { id: 'id', label: 'Recherche par ID' },
];

type ImportError =
  | null
  | { type: 'not_found'; message: string }
  | { type: 'already_validated'; message: string }
  | { type: 'pending'; message: string };

const searchByName = (tiers: Tier[], query: string) => {
  const lower = query.toLowerCase();
  return tiers.filter(tier => tier.nom.toLowerCase().includes(lower));
};

const searchById = (tiers: Tier[], query: string) => {
  return tiers.filter(tier => tier.id === query);
};

const ID_FULL_LENGTH = 6;
type SortField = 'createdAt' | 'updatedAt';
type SortOrder = 'asc' | 'desc';

export default function GestionTiersPage() {
  const { message } = App.useApp();
  const { permissions } = useRoleAccess();
  const navigate = useNavigate();
  const [tiers] = useState<Tier[]>(mockTiers);
  const [searchMode, setSearchMode] = useState<SearchMode>('name');
  const [searchInput, setSearchInput] = useState('');
  const [committedIdQuery, setCommittedIdQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<TierStatus[]>([]);
  const [countryFilters, setCountryFilters] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importNumber, setImportNumber] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<ImportError>(null);

  const canCreateTier = permissions.canCreateTiers || permissions.isAdmin;
  const canOpenArchived = permissions.canOpenArchivedTiers || permissions.isAdmin;

  const trimmedInput = searchInput.trim();
  const isNameSearchActive = searchMode === 'name' && trimmedInput.length >= 3;
  const isIdSearchActive = searchMode === 'id' && committedIdQuery.length > 0;
  const isSearchActive = isNameSearchActive || isIdSearchActive || statusFilters.length > 0 || countryFilters.length > 0;

  const searchedTiers = useMemo(() => {
    if (searchMode === 'name') {
      if (!isNameSearchActive) return tiers;
      return searchByName(tiers, trimmedInput);
    }

    if (!isIdSearchActive) return tiers;
    return searchById(tiers, committedIdQuery);
  }, [searchMode, isNameSearchActive, isIdSearchActive, trimmedInput, committedIdQuery, tiers]);

  const filtered = useMemo(() => {
    let next = [...searchedTiers];

    if (statusFilters.length > 0) {
      next = next.filter(tier => statusFilters.includes(tier.status));
    }
    if (countryFilters.length > 0) {
      next = next.filter(tier => countryFilters.includes(tier.pays));
    }

    next.sort((a, b) => {
      const delta = a[sortField] - b[sortField];
      return sortOrder === 'asc' ? delta : -delta;
    });

    return next;
  }, [searchedTiers, statusFilters, countryFilters, sortField, sortOrder]);

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
    if (e.key === 'Enter' && searchMode === 'id') {
      setCommittedIdQuery(searchInput.trim());
      setCurrentPage(1);
    }
  };

  const clearSearchInput = () => {
    setSearchInput('');
    setCommittedIdQuery('');
    setCurrentPage(1);
  };

  const clearSearchAndFilters = () => {
    setSearchInput('');
    setCommittedIdQuery('');
    setStatusFilters([]);
    setCountryFilters([]);
    setCurrentPage(1);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(previous => (previous === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleOpenTier = (tier: Tier) => {
    const isArchivedLocked = tier.status === 'archived' && !canOpenArchived;
    if (isArchivedLocked) return;
    navigate(`/tiers/new?tierId=${tier.id}&mode=view`);
  };

  const openImportModal = useCallback(() => {
    if (!canCreateTier) {
      message.warning('Ce rôle ne peut pas créer de tiers.');
      return;
    }
    setImportNumber('');
    setImportError(null);
    setImportLoading(false);
    setImportModalOpen(true);
  }, [canCreateTier, message]);

  const closeImportModal = useCallback(() => {
    setImportModalOpen(false);
    setImportNumber('');
    setImportError(null);
    setImportLoading(false);
  }, []);

  const handleImportConfirm = useCallback(() => {
    if (!canCreateTier) return;
    const trimmed = importNumber.trim();

    if (!trimmed) {
      setImportError({ type: 'not_found', message: 'Veuillez saisir un numéro de tiers.' });
      return;
    }

    setImportLoading(true);
    setImportError(null);

    setTimeout(() => {
      const found = liftDatabase[trimmed];

      if (!found) {
        setImportError({ type: 'not_found', message: 'Tiers introuvable. Veuillez vérifier le numéro.' });
        setImportLoading(false);
        return;
      }

      if (found.status === 'validated' || found.status === 'validated_business' || found.status === 'validated_treasury') {
        setImportError({ type: 'already_validated', message: 'Existe déjà.' });
        setImportLoading(false);
        return;
      }

      if (found.status === 'pending_business' || found.status === 'pending_treasury') {
        setImportError({ type: 'pending', message: 'Tiers en cours de validation.' });
        setImportLoading(false);
        return;
      }

      setImportLoading(false);
      closeImportModal();
      navigate(`/tiers/new?tierId=${trimmed}`);
    }, 600);
  }, [importNumber, closeImportModal, navigate, canCreateTier]);

  const getErrorIcon = (error: ImportError) => {
    if (!error) return null;
    switch (error.type) {
      case 'not_found':
        return 'close-circle';
      case 'already_validated':
        return 'check-circle';
      case 'pending':
        return 'clock';
      default:
        return 'warning';
    }
  };

  const ls = { fontFamily: 'var(--font-family-text)' };
  const statusFilterOptions = useMemo(
    () => Object.entries(statusConfig).map(([value, cfg]) => ({ value, label: cfg.label })),
    [],
  );
  const countryFilterOptions = useMemo(() => {
    const countries = Array.from(new Set(tiers.map(tier => tier.pays))).sort((a, b) => a.localeCompare(b));
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
  }, [tiers]);
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
          setStatusFilters(values as TierStatus[]);
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
            <h1
              className="m-0"
              style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: '28px',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
                lineHeight: '42px',
              }}
            >
              Gestion des tiers
            </h1>
            <p
              className="m-0"
              style={{
                ...ls,
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--muted-foreground)',
              }}
            >
              Consultez et gérez tous vos tiers internes
            </p>
          </div>
          {canCreateTier && (
            <button
              onClick={openImportModal}
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
              <DktIcon name="download" size={16} color="white" />
              Importer un tiers
            </button>
          )}

        </div>

        <div
          style={{
            backgroundColor: 'var(--card)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
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

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative w-full max-w-[480px]">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <DktIcon name="search" size={18} color="var(--muted-foreground)" />
                </div>
                <input
                  type="text"
                  placeholder={searchMode === 'name' ? 'Rechercher un tiers par nom' : 'Rechercher un tiers par ID'}
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
                    onClick={clearSearchInput}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                  >
                    <DktIcon name="close" size={16} color="var(--muted-foreground)" />
                  </button>
                )}
              </div>
            </div>

            <p
              className="m-0 mt-2"
              style={{
                fontFamily: 'var(--font-family-text)',
                fontSize: '12px',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--muted-foreground)',
              }}
            >
              {searchMode === 'name'
                ? 'La recherche se lance automatiquement à partir de 3 caractères'
                : `La recherche se lance à ${ID_FULL_LENGTH} caractères ou en appuyant sur Entrée`}
            </p>

            {searchMode === 'id' && searchInput.trim() && searchInput.trim() !== committedIdQuery && (
              <p
                className="m-0 mt-1"
                style={{
                  fontFamily: 'var(--font-family-text)',
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--primary)',
                }}
              >
                Appuyez sur Entrée ou saisissez {ID_FULL_LENGTH} caractères pour lancer cette recherche.
              </p>
            )}

            {isSearchActive && (
              <div className="flex items-center gap-2 mt-2">
                <p
                  className="m-0"
                  style={{
                    fontFamily: 'var(--font-family-text)',
                    fontSize: '12px',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <DktIcon name="search" size={64} color="var(--muted-foreground)" style={{ opacity: 0.3 }} />
              <p
                className="mt-4"
                style={{
                  ...ls,
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--muted-foreground)',
                  margin: '16px 0 0',
                }}
              >
                {isSearchActive ? 'Aucun tiers trouvé pour cette recherche' : 'Aucun tiers'}
              </p>
              {isSearchActive && (
                <p
                  style={{
                    ...ls,
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                    color: 'var(--muted-foreground)',
                    margin: '4px 0 0',
                  }}
                >
                  Vérifiez l'orthographe ou essayez avec un autre terme.
                </p>
              )}
              {isSearchActive && (
                <button
                  onClick={clearSearchAndFilters}
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
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: '980px' }}>
              <div
                className="grid px-6 py-3 items-center"
                style={{
                  gridTemplateColumns: '96px minmax(260px,1.4fr) 180px 220px 190px 190px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span
                  style={{ ...ls, fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}
                >
                  ID
                </span>
                <span
                  style={{ ...ls, fontSize: '13px', fontWeight: 'var(--font-weight-medium)', color: 'var(--muted-foreground)' }}
                >
                  Nom du tiers
                </span>
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
                    Statut {statusFilters.length > 0 ? `(${statusFilters.length})` : ''}
                    <DktIcon name="filter" size={13} color={statusFilters.length > 0 ? 'var(--primary)' : 'var(--muted-foreground)'} />
                  </button>
                </Popover>
                <button
                  onClick={() => toggleSort('createdAt')}
                  className="flex items-center gap-1 p-0 bg-transparent border-0 w-fit"
                  style={{
                    cursor: 'pointer',
                    ...ls,
                    fontSize: '13px',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Création {sortIndicator('createdAt')}
                </button>
                <button
                  onClick={() => toggleSort('updatedAt')}
                  className="flex items-center gap-1 p-0 bg-transparent border-0 w-fit"
                  style={{
                    cursor: 'pointer',
                    ...ls,
                    fontSize: '13px',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  Mise à jour {sortIndicator('updatedAt')}
                </button>
              </div>

              {filtered.map((tier, i) => {
                const cfg = statusConfig[tier.status];
                const isArchivedLocked = tier.status === 'archived' && !canOpenArchived;
                const country = getCountryDisplayPartsFromName(tier.pays);

                return (
                  <div
                    key={`${tier.id}-${i}`}
                    onClick={() => handleOpenTier(tier)}
                    className="grid px-6 py-3 items-center"
                    style={{
                      gridTemplateColumns: '96px minmax(260px,1.4fr) 180px 220px 190px 190px',
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: isArchivedLocked ? '#F5F5F5' : 'transparent',
                      opacity: isArchivedLocked ? 0.62 : 1,
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
                      {tier.id}
                    </span>
                    <span
                      style={{
                        ...ls,
                        fontSize: 'var(--text-sm)',
                        color: isArchivedLocked ? 'var(--muted-foreground)' : 'var(--foreground)',
                      }}
                    >
                      {tier.nom}
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5"
                      style={{
                        ...ls,
                        fontSize: 'var(--text-sm)',
                        color: isArchivedLocked ? 'var(--muted-foreground)' : 'var(--primary)',
                      }}
                    >
                      {country.code && <CountryFlag code={country.code} size={14} />}
                      {country.name}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full inline-flex items-center gap-1.5 w-fit"
                      style={{
                        backgroundColor: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        fontFamily: 'var(--font-family-text)',
                        fontSize: '12px',
                        fontWeight: 'var(--font-weight-medium)',
                        color: cfg.color,
                      }}
                    >
                      <DktIcon name={cfg.icon} size={14} color={cfg.color} />
                      {cfg.label}
                    </span>
                    <span
                      style={{
                        ...ls,
                        fontSize: 'var(--text-sm)',
                        color: isArchivedLocked ? 'var(--muted-foreground)' : 'var(--foreground)',
                      }}
                    >
                      {tier.dateCreation}
                    </span>
                    <span
                      style={{
                        ...ls,
                        fontSize: 'var(--text-sm)',
                        color: isArchivedLocked ? 'var(--muted-foreground)' : 'var(--foreground)',
                      }}
                    >
                      {tier.dateMaj}
                    </span>
                  </div>
                );
              })}
              </div>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="flex items-center justify-end gap-1 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            >
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
            <button
              onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <DktIcon name="arrow-right" size={16} color="var(--foreground)" />
            </button>
          </div>
        )}
      </div>

      {importModalOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={e => {
            if (e.target === e.currentTarget && !importLoading) closeImportModal();
          }}
        >
          <div
            className="relative w-full max-w-[520px] mx-4"
            style={{
              backgroundColor: 'var(--card)',
              borderRadius: 'var(--radius-card)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            <div className="flex items-start justify-between px-8 pt-8 pb-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'rgba(54,67,186,0.08)' }}
                >
                  <DktIcon name="download" size={22} color="var(--primary)" />
                </div>
                <div>
                  <h2
                    className="m-0"
                    style={{
                      fontFamily: 'var(--font-family-display)',
                      fontSize: 'var(--text-xl)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--foreground)',
                      lineHeight: '1.3',
                    }}
                  >
                    Importer un tiers
                  </h2>
                  <p
                    className="m-0 mt-0.5"
                    style={{
                      fontFamily: 'var(--font-family-text)',
                      fontSize: '13px',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--muted-foreground)',
                      lineHeight: '1.4',
                    }}
                  >
                    depuis SAP vers L.I.F.T
                  </p>
                </div>
              </div>
              <button
                onClick={closeImportModal}
                disabled={importLoading}
                className="flex items-center justify-center w-8 h-8 rounded-full mt-0.5"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: importLoading ? 'not-allowed' : 'pointer',
                  opacity: importLoading ? 0.4 : 1,
                }}
              >
                <DktIcon name="close" size={18} color="var(--muted-foreground)" />
              </button>
            </div>

            <div className="mx-8 my-5" style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            <div className="px-8 pb-2">
              <p
                className="m-0 mb-5"
                style={{
                  fontFamily: 'var(--font-family-text)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: 'var(--foreground)',
                  lineHeight: '1.6',
                }}
              >
                Saisissez le numéro du tiers SAP que vous souhaitez importer dans L.I.F.T.
                Le système vérifiera automatiquement son existence et son éligibilité.
              </p>

              <label
                className="block mb-2"
                style={{
                  fontFamily: 'var(--font-family-text)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                }}
              >
                Saisissez le numéro du tiers <span style={{ color: 'var(--destructive)' }}>*</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex : 100001"
                  value={importNumber}
                  onChange={e => {
                    setImportNumber(e.target.value);
                    if (importError) setImportError(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !importLoading) handleImportConfirm();
                  }}
                  disabled={importLoading}
                  className="w-full px-4 py-3"
                  style={{
                    fontFamily: 'var(--font-family-text)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-weight-normal)',
                    color: 'var(--foreground)',
                    backgroundColor: 'var(--input-background)',
                    border: importError ? '1.5px solid var(--destructive)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  autoFocus
                />
                {importLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ animation: 'spin 1s linear infinite' }}>
                    <DktIcon name="refresh" size={18} color="var(--primary)" />
                  </div>
                )}
              </div>

              {importError ? (
                <div
                  className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-lg"
                  style={{
                    backgroundColor:
                      importError.type === 'already_validated'
                        ? 'rgba(56,158,13,0.06)'
                        : importError.type === 'pending'
                        ? '#FFFBE6'
                        : 'rgba(227,38,47,0.06)',
                    border:
                      importError.type === 'already_validated'
                        ? '1px solid rgba(56,158,13,0.2)'
                        : importError.type === 'pending'
                        ? '1px solid #FFE58F'
                        : '1px solid rgba(227,38,47,0.2)',
                  }}
                >
                  <DktIcon
                    name={getErrorIcon(importError)}
                    size={16}
                    color={
                      importError.type === 'already_validated'
                        ? '#389E0D'
                        : importError.type === 'pending'
                        ? '#D4B106'
                        : 'var(--destructive)'
                    }
                    className="shrink-0 mt-0.5"
                  />
                  <div>
                    <p
                      className="m-0"
                      style={{
                        fontFamily: 'var(--font-family-text)',
                        fontSize: '13px',
                        fontWeight: 'var(--font-weight-medium)',
                        color:
                          importError.type === 'already_validated'
                            ? '#389E0D'
                            : importError.type === 'pending'
                            ? '#D4B106'
                            : 'var(--destructive)',
                        lineHeight: '1.4',
                      }}
                    >
                      {importError.message}
                    </p>
                  </div>
                </div>
              ) : (
                <p
                  className="m-0 mt-2"
                  style={{
                    fontFamily: 'var(--font-family-text)',
                    fontSize: '12px',
                    fontWeight: 'var(--font-weight-normal)',
                    color: 'var(--muted-foreground)',
                    lineHeight: '1.4',
                  }}
                >
                  Le numéro doit correspondre à un tiers existant dans SAP
                </p>
              )}
            </div>

            <div className="mx-8 mt-5 mb-0" style={{ height: '1px', backgroundColor: 'var(--border)' }} />

            <div className="flex items-center justify-end gap-3 px-8 py-5">
              <button
                onClick={closeImportModal}
                disabled={importLoading}
                className="px-5 py-2.5"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-button)',
                  cursor: importLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-family-text)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--foreground)',
                  opacity: importLoading ? 0.5 : 1,
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleImportConfirm}
                disabled={importLoading || !importNumber.trim()}
                className="flex items-center gap-2 px-5 py-2.5"
                style={{
                  backgroundColor: importLoading || !importNumber.trim() ? 'rgba(54,67,186,0.5)' : 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-button)',
                  cursor: importLoading || !importNumber.trim() ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-family-text)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  transition: 'background-color 0.2s',
                }}
              >
                {importLoading ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
                      <DktIcon name="refresh" size={16} color="white" />
                    </span>
                    Vérification...
                  </>
                ) : (
                  <>
                    Confirmer
                    <DktIcon name="arrow-right" size={16} color="white" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

