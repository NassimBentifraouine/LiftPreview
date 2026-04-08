import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import DktIcon from './DktIcon';

type DraftType = 'client' | 'tier';
type SortMode = 'updated_desc' | 'progress_desc' | 'progress_asc';
type TypeFilter = 'all' | DraftType;

interface DraftRecord {
  id: string;
  type: DraftType;
  name: string;
  updatedAt: string;
  updatedAtMs: number;
  progress: number;
  nextStep: string;
  owner: string;
}

const mockDrafts: DraftRecord[] = [
  {
    id: '20000451',
    type: 'client',
    name: 'SportMaster International',
    updatedAt: '08 Avril 2026 à 10h22',
    updatedAtMs: new Date('2026-04-08T10:22:00').getTime(),
    progress: 84,
    nextStep: 'Compléter les justificatifs',
    owner: 'N. Hadef',
  },
  {
    id: '10000792',
    type: 'tier',
    name: 'Decathlon Portugal Lda',
    updatedAt: '08 Avril 2026 à 09h14',
    updatedAtMs: new Date('2026-04-08T09:14:00').getTime(),
    progress: 72,
    nextStep: 'Vérifier les paramètres locaux',
    owner: 'M. Chadi',
  },
  {
    id: '20000449',
    type: 'client',
    name: 'FitLife Distribution',
    updatedAt: '07 Avril 2026 à 17h45',
    updatedAtMs: new Date('2026-04-07T17:45:00').getTime(),
    progress: 58,
    nextStep: 'Renseigner les données fiscales',
    owner: 'A. Martin',
  },
  {
    id: '10000784',
    type: 'tier',
    name: 'Decathlon Italia SRL',
    updatedAt: '07 Avril 2026 à 11h09',
    updatedAtMs: new Date('2026-04-07T11:09:00').getTime(),
    progress: 41,
    nextStep: "Ajouter un pays d'opération",
    owner: 'N. Hadef',
  },
  {
    id: '20000442',
    type: 'client',
    name: 'Alpine Sports GmbH',
    updatedAt: '06 Avril 2026 à 15h52',
    updatedAtMs: new Date('2026-04-06T15:52:00').getTime(),
    progress: 29,
    nextStep: "Renseigner l'identité légale",
    owner: 'S. Leroy',
  },
  {
    id: '10000763',
    type: 'tier',
    name: 'Decathlon UK Ltd',
    updatedAt: '05 Avril 2026 à 14h18',
    updatedAtMs: new Date('2026-04-05T14:18:00').getTime(),
    progress: 92,
    nextStep: 'Prêt à soumettre',
    owner: 'M. Chadi',
  },
  {
    id: '20000411',
    type: 'client',
    name: 'Mediterranean Outdoor SL',
    updatedAt: '04 Avril 2026 à 09h03',
    updatedAtMs: new Date('2026-04-04T09:03:00').getTime(),
    progress: 65,
    nextStep: 'Compléter les paramètres finance',
    owner: 'A. Martin',
  },
];

const typeFilterOptions: { id: TypeFilter; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: 'client', label: 'Clients' },
  { id: 'tier', label: 'Tiers' },
];

const sortOptions: { id: SortMode; label: string }[] = [
  { id: 'updated_desc', label: 'Dernière maj' },
  { id: 'progress_desc', label: 'Progression décroissante' },
  { id: 'progress_asc', label: 'Progression croissante' },
];

const PAGE_SIZE = 5;

export default function BrouillonsPage() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<DraftRecord[]>(mockDrafts);
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [onlyPriority, setOnlyPriority] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('updated_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredDraftId, setHoveredDraftId] = useState<string | null>(null);

  const searchValue = searchInput.trim().toLowerCase();

  const filteredDrafts = useMemo(() => {
    const bySearch = drafts.filter((draft) => {
      const matchesSearch = !searchValue
        || draft.name.toLowerCase().includes(searchValue)
        || draft.id.includes(searchValue);
      const matchesType = typeFilter === 'all' || draft.type === typeFilter;
      const matchesPriority = !onlyPriority || draft.progress >= 80;
      return matchesSearch && matchesType && matchesPriority;
    });

    return [...bySearch].sort((a, b) => {
      if (sortMode === 'progress_desc') return b.progress - a.progress;
      if (sortMode === 'progress_asc') return a.progress - b.progress;
      return b.updatedAtMs - a.updatedAtMs;
    });
  }, [drafts, searchValue, typeFilter, onlyPriority, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filteredDrafts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageItems = filteredDrafts.slice(pageStart, pageStart + PAGE_SIZE);

  const stats = useMemo(() => {
    const total = drafts.length;
    const clients = drafts.filter((draft) => draft.type === 'client').length;
    const tiers = drafts.filter((draft) => draft.type === 'tier').length;
    const ready = drafts.filter((draft) => draft.progress >= 80).length;
    return { total, clients, tiers, ready };
  }, [drafts]);

  const ls = { fontFamily: 'var(--font-family-text)' };
  const hasActiveFilters = searchValue.length > 0 || typeFilter !== 'all' || onlyPriority || sortMode !== 'updated_desc';

  const activeFilterChips = useMemo(() => {
    const chips: string[] = [];
    if (typeFilter === 'client') chips.push('Type: Clients');
    if (typeFilter === 'tier') chips.push('Type: Tiers');
    if (onlyPriority) chips.push('Prioritaires');
    if (searchValue) chips.push(`Recherche: ${searchInput.trim()}`);
    if (sortMode !== 'updated_desc') {
      const sortLabel = sortOptions.find((option) => option.id === sortMode)?.label;
      if (sortLabel) chips.push(`Tri: ${sortLabel}`);
    }
    return chips;
  }, [typeFilter, onlyPriority, searchValue, searchInput, sortMode]);

  const openDraft = (draft: DraftRecord) => {
    if (draft.type === 'client') {
      navigate(`/clients/new?clientId=${draft.id}`);
      return;
    }
    navigate(`/tiers/new?tierId=${draft.id}`);
  };

  const removeDraft = (id: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.id !== id));
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: TypeFilter) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: SortMode) => {
    setSortMode(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
  };

  const togglePriorityFilter = () => {
    setOnlyPriority((prev) => !prev);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchInput('');
    setTypeFilter('all');
    setOnlyPriority(false);
    setSortMode('updated_desc');
    setCurrentPage(1);
  };

  return (
    <div style={{ backgroundColor: 'rgba(245,244,245,0.7)', minHeight: 'calc(100vh - 180px)' }}>
      <div className="max-w-[1440px] mx-auto px-16 pt-6 pb-6">
        <div className="flex items-center justify-between mb-4">
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
              Mes brouillons
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
              Reprenez vos fiches Client et Tiers en cours de saisie.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/clients/new')}
              className="flex items-center gap-2 px-4 py-2"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-button)',
                cursor: 'pointer',
                fontFamily: 'var(--font-family-text)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              <DktIcon name="user" size={16} color="var(--primary)" />
              Nouveau client
            </button>
            <button
              onClick={() => navigate('/tiers/new')}
              className="flex items-center gap-2 px-4 py-2"
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
              <DktIcon name="briefcase" size={16} color="white" />
              Nouveau tiers
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {[
            { label: 'Brouillons totaux', value: stats.total, icon: 'document-text', tone: 'var(--primary)' },
            { label: 'Brouillons clients', value: stats.clients, icon: 'user', tone: '#007DBC' },
            { label: 'Brouillons tiers', value: stats.tiers, icon: 'briefcase', tone: '#D46B08' },
            { label: 'Prêts à soumettre', value: stats.ready, icon: 'check-circle', tone: '#389E0D' },
          ].map((card) => (
            <div
              key={card.label}
              className="px-3 py-2 inline-flex items-center gap-2"
              style={{
                backgroundColor: 'var(--card)',
                borderRadius: 'var(--radius-button)',
                border: '1px solid var(--border)',
              }}
            >
              <DktIcon name={card.icon} size={14} color={card.tone} />
              <span
                style={{
                  ...ls,
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--muted-foreground)',
                }}
              >
                {card.label}
              </span>
              <span
                style={{
                  ...ls,
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--foreground)',
                }}
              >
                {card.value}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            backgroundColor: 'var(--card)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          <div className="px-6 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div
                className="inline-flex items-center p-1"
                style={{
                  backgroundColor: 'var(--input-background)',
                  border: '1px solid var(--border)',
                  borderRadius: '999px',
                  gap: '4px',
                }}
              >
                {typeFilterOptions.map((option) => {
                  const active = option.id === typeFilter;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleTypeFilterChange(option.id)}
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
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={togglePriorityFilter}
                  className="flex items-center gap-1.5 px-3 py-2"
                  style={{
                    borderRadius: 'var(--radius-button)',
                    border: `1px solid ${onlyPriority ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: onlyPriority ? 'rgba(54,67,186,0.08)' : 'transparent',
                    color: onlyPriority ? 'var(--primary)' : 'var(--muted-foreground)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family-text)',
                    fontSize: '12px',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  <DktIcon name="star" size={14} color={onlyPriority ? 'var(--primary)' : 'var(--muted-foreground)'} />
                  Prioritaires
                </button>
                <select
                  value={sortMode}
                  onChange={(event) => handleSortChange(event.target.value as SortMode)}
                  className="px-3 py-2"
                  style={{
                    minWidth: '190px',
                    backgroundColor: 'var(--input-background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-button)',
                    color: 'var(--foreground)',
                    fontFamily: 'var(--font-family-text)',
                    fontSize: '13px',
                    fontWeight: 'var(--font-weight-medium)',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative w-full max-w-[460px] mt-2">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <DktIcon name="search" size={18} color="var(--muted-foreground)" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un brouillon par nom ou ID"
                value={searchInput}
                onChange={(event) => handleSearchChange(event.target.value)}
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
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                >
                  <DktIcon name="close" size={16} color="var(--muted-foreground)" />
                </button>
              )}
            </div>

            <p
              className="m-0 mt-2"
              style={{
                ...ls,
                fontSize: '12px',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--muted-foreground)',
              }}
            >
              {filteredDrafts.length} brouillon{filteredDrafts.length > 1 ? 's' : ''} trouvé{filteredDrafts.length > 1 ? 's' : ''}
            </p>

            {hasActiveFilters && (
              <div className="mt-1.5 flex items-center justify-between gap-3 flex-wrap">
                <span
                  style={{
                    ...ls,
                    fontSize: '11px',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--primary)',
                  }}
                >
                  {activeFilterChips.length} filtre{activeFilterChips.length > 1 ? 's' : ''} actif{activeFilterChips.length > 1 ? 's' : ''}
                </span>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-button)',
                    cursor: 'pointer',
                    ...ls,
                    fontSize: '12px',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  <DktIcon name="refresh" size={13} color="var(--muted-foreground)" />
                  Réinitialiser
                </button>
              </div>
            )}
          </div>

          {pageItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14">
              <DktIcon name="document-text" size={64} color="var(--muted-foreground)" style={{ opacity: 0.3 }} />
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
                Aucun brouillon correspondant
              </p>
              <p
                style={{
                  ...ls,
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: 'var(--muted-foreground)',
                  margin: '4px 0 0',
                }}
              >
                Ajustez vos filtres ou lancez une nouvelle fiche.
              </p>
              <div className="flex items-center gap-2 mt-4">
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 px-4 py-2"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-button)',
                      cursor: 'pointer',
                      ...ls,
                      fontSize: '12px',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    <DktIcon name="refresh" size={14} color="var(--muted-foreground)" />
                    Réinitialiser les filtres
                  </button>
                )}
                <button
                  onClick={() => navigate('/clients/new')}
                  className="flex items-center gap-1.5 px-4 py-2"
                  style={{
                    backgroundColor: 'var(--primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-button)',
                    cursor: 'pointer',
                    ...ls,
                    fontSize: '12px',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'white',
                  }}
                >
                  <DktIcon name="plus" size={14} color="white" />
                  Créer une fiche
                </button>
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: '1150px' }}>
                <div
                  className="grid px-6 py-3"
                  style={{
                    gridTemplateColumns: '110px 110px 1.3fr 170px 170px 200px 150px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {['Type', 'ID', 'Nom', 'Mise à jour', 'Progression', 'Prochaine étape', 'Actions'].map((header) => (
                    <span
                      key={header}
                      style={{
                        ...ls,
                        fontSize: '13px',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      {header}
                    </span>
                  ))}
                </div>

                {pageItems.map((draft) => {
                  const typeLabel = draft.type === 'client' ? 'Client' : 'Tiers';
                  const typeColor = draft.type === 'client' ? 'var(--primary)' : '#D46B08';
                  const isReady = draft.progress >= 80;
                  return (
                    <div
                      key={draft.id}
                      onClick={() => openDraft(draft)}
                      onMouseEnter={() => setHoveredDraftId(draft.id)}
                      onMouseLeave={() => setHoveredDraftId(null)}
                      className="grid px-6 py-2.5 items-center"
                      style={{
                        gridTemplateColumns: '110px 110px 1.3fr 170px 170px 200px 150px',
                        borderBottom: '1px solid var(--border)',
                        cursor: 'pointer',
                        backgroundColor: hoveredDraftId === draft.id ? 'rgba(54,67,186,0.03)' : 'transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <span
                        className="px-2.5 py-1 rounded-full inline-flex items-center gap-1 w-fit"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.03)',
                          border: '1px solid var(--border)',
                          ...ls,
                          fontSize: '12px',
                          fontWeight: 'var(--font-weight-medium)',
                          color: typeColor,
                        }}
                      >
                        <DktIcon name={draft.type === 'client' ? 'user' : 'briefcase'} size={14} color={typeColor} />
                        {typeLabel}
                      </span>

                      <span
                        className="px-2 py-0.5 rounded inline-block w-fit"
                        style={{
                          backgroundColor: 'rgba(54,67,186,0.08)',
                          ...ls,
                          fontSize: '12px',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--primary)',
                        }}
                      >
                        {draft.id}
                      </span>

                      <div className="leading-[1.3]">
                        <p
                          className="m-0"
                          style={{
                            ...ls,
                            fontSize: 'var(--text-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--foreground)',
                          }}
                        >
                          {draft.name}
                        </p>
                        <p
                          className="m-0"
                          style={{
                            ...ls,
                            fontSize: '12px',
                            fontWeight: 'var(--font-weight-normal)',
                            color: 'var(--muted-foreground)',
                          }}
                        >
                          Owner: {draft.owner}
                        </p>
                      </div>

                      <span style={{ ...ls, fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
                        {draft.updatedAt}
                      </span>

                      <div className="pr-4 leading-[1.3]">
                        <div
                          className="w-full rounded-full"
                          style={{ height: '6px', backgroundColor: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}
                        >
                          <div
                            style={{
                              width: `${draft.progress}%`,
                              height: '100%',
                              borderRadius: '999px',
                              backgroundColor: draft.progress >= 80 ? '#389E0D' : 'var(--primary)',
                            }}
                          />
                        </div>
                        <p
                          className="m-0 mt-1"
                          style={{
                            ...ls,
                            fontSize: '12px',
                            fontWeight: 'var(--font-weight-medium)',
                            color: draft.progress >= 80 ? '#389E0D' : 'var(--muted-foreground)',
                          }}
                        >
                          {draft.progress}%
                        </p>
                      </div>

                      <div>
                        <p className="m-0" style={{ ...ls, fontSize: '13px', color: 'var(--foreground)' }}>
                          {draft.nextStep}
                        </p>
                        {isReady && (
                          <span
                            className="mt-1 px-2 py-0.5 rounded-full inline-flex items-center gap-1 w-fit"
                            style={{
                              backgroundColor: '#F6FFED',
                              border: '1px solid #B7EB8F',
                              ...ls,
                              fontSize: '11px',
                              fontWeight: 'var(--font-weight-medium)',
                              color: '#389E0D',
                            }}
                          >
                            <DktIcon name="check-circle" size={12} color="#389E0D" />
                            Prêt à soumettre
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            openDraft(draft);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-button)',
                            cursor: 'pointer',
                            ...ls,
                            fontSize: '12px',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--primary)',
                          }}
                        >
                          <DktIcon name="edit" size={14} color="var(--primary)" />
                          Reprendre
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            removeDraft(draft.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                          }}
                        >
                          <DktIcon name="trash" size={15} color="var(--destructive)" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {filteredDrafts.length > 0 && (
          <div className="flex items-center justify-end gap-1 mt-4">
            <span
              className="mr-2"
              style={{
                ...ls,
                fontSize: '12px',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--muted-foreground)',
              }}
            >
              Page {safePage}/{totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: safePage === 1 ? 'not-allowed' : 'pointer',
                opacity: safePage === 1 ? 0.35 : 1,
              }}
            >
              <DktIcon name="arrow-left" size={16} color="var(--foreground)" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 flex items-center justify-center rounded-full"
                style={{
                  backgroundColor: safePage === page ? 'var(--primary)' : 'transparent',
                  color: safePage === page ? 'white' : 'var(--foreground)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family-text)',
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: safePage === totalPages ? 'not-allowed' : 'pointer',
                opacity: safePage === totalPages ? 0.35 : 1,
              }}
            >
              <DktIcon name="arrow-right" size={16} color="var(--foreground)" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
