import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AppRole =
  | 'lift-user-third'
  | 'lift-user-cust'
  | 'lift-auditeur-third'
  | 'lift-auditeur-cust'
  | 'lift-demandeur-third'
  | 'lift-demandeur-cust'
  | 'lift-validateur-business-third'
  | 'lift-validateur-business-cust'
  | 'lift-validateur-tresorerie-third'
  | 'lift-admin';

export interface RolePermissions {
  role: AppRole;
  label: string;
  shortLabel: string;
  ldap: string;
  isReadOnly: boolean;
  isAdmin: boolean;
  canAccessTiers: boolean;
  canAccessClients: boolean;
  canAccessDrafts: boolean;
  canAccessExport: boolean;
  canAccessAdministration: boolean;
  canCreateTiers: boolean;
  canCreateClients: boolean;
  canValidateBusinessTiers: boolean;
  canValidateBusinessClients: boolean;
  canValidateTreasuryTiers: boolean;
  canViewArchivedTiers: boolean;
  canViewArchivedClients: boolean;
  canOpenArchivedTiers: boolean;
  canOpenArchivedClients: boolean;
  canViewTierHistory: boolean;
  canSeeBankDetails: boolean;
}

type RoleConfig = Omit<RolePermissions, 'role'> & { role: AppRole };

const ROLE_STORAGE_KEY = 'lift.preview.activeRole';
const DEFAULT_ROLE: AppRole = 'lift-demandeur-third';

const roleConfigs: RoleConfig[] = [
  {
    role: 'lift-user-third',
    shortLabel: 'User Third',
    label: 'Profil de base Tiers (lecture seule)',
    ldap: 'lift-user-third',
    isReadOnly: true,
    isAdmin: false,
    canAccessTiers: true,
    canAccessClients: false,
    canAccessDrafts: false,
    canAccessExport: false,
    canAccessAdministration: false,
    canCreateTiers: false,
    canCreateClients: false,
    canValidateBusinessTiers: false,
    canValidateBusinessClients: false,
    canValidateTreasuryTiers: false,
    canViewArchivedTiers: false,
    canViewArchivedClients: false,
    canOpenArchivedTiers: false,
    canOpenArchivedClients: false,
    canViewTierHistory: false,
    canSeeBankDetails: false,
  },
  {
    role: 'lift-user-cust',
    shortLabel: 'User Cust',
    label: 'Profil de base Clients (lecture seule)',
    ldap: 'lift-user-cust',
    isReadOnly: true,
    isAdmin: false,
    canAccessTiers: false,
    canAccessClients: true,
    canAccessDrafts: false,
    canAccessExport: false,
    canAccessAdministration: false,
    canCreateTiers: false,
    canCreateClients: false,
    canValidateBusinessTiers: false,
    canValidateBusinessClients: false,
    canValidateTreasuryTiers: false,
    canViewArchivedTiers: false,
    canViewArchivedClients: false,
    canOpenArchivedTiers: false,
    canOpenArchivedClients: false,
    canViewTierHistory: false,
    canSeeBankDetails: false,
  },
  {
    role: 'lift-auditeur-third',
    shortLabel: 'Auditeur Third',
    label: 'Auditeur Tiers (lecture + archives + historique)',
    ldap: 'lift-auditeur-third',
    isReadOnly: true,
    isAdmin: false,
    canAccessTiers: true,
    canAccessClients: false,
    canAccessDrafts: false,
    canAccessExport: false,
    canAccessAdministration: false,
    canCreateTiers: false,
    canCreateClients: false,
    canValidateBusinessTiers: false,
    canValidateBusinessClients: false,
    canValidateTreasuryTiers: false,
    canViewArchivedTiers: true,
    canViewArchivedClients: false,
    canOpenArchivedTiers: true,
    canOpenArchivedClients: false,
    canViewTierHistory: true,
    canSeeBankDetails: false,
  },
  {
    role: 'lift-auditeur-cust',
    shortLabel: 'Auditeur Cust',
    label: 'Auditeur Clients (lecture + archives)',
    ldap: 'lift-auditeur-cust',
    isReadOnly: true,
    isAdmin: false,
    canAccessTiers: false,
    canAccessClients: true,
    canAccessDrafts: false,
    canAccessExport: false,
    canAccessAdministration: false,
    canCreateTiers: false,
    canCreateClients: false,
    canValidateBusinessTiers: false,
    canValidateBusinessClients: false,
    canValidateTreasuryTiers: false,
    canViewArchivedTiers: false,
    canViewArchivedClients: true,
    canOpenArchivedTiers: false,
    canOpenArchivedClients: true,
    canViewTierHistory: false,
    canSeeBankDetails: false,
  },
  {
    role: 'lift-demandeur-third',
    shortLabel: 'Demandeur Third',
    label: 'Demandeur Tiers (création + brouillons)',
    ldap: 'lift-demandeur-third',
    isReadOnly: false,
    isAdmin: false,
    canAccessTiers: true,
    canAccessClients: false,
    canAccessDrafts: true,
    canAccessExport: false,
    canAccessAdministration: false,
    canCreateTiers: true,
    canCreateClients: false,
    canValidateBusinessTiers: false,
    canValidateBusinessClients: false,
    canValidateTreasuryTiers: false,
    canViewArchivedTiers: false,
    canViewArchivedClients: false,
    canOpenArchivedTiers: false,
    canOpenArchivedClients: false,
    canViewTierHistory: true,
    canSeeBankDetails: false,
  },
  {
    role: 'lift-demandeur-cust',
    shortLabel: 'Demandeur Cust',
    label: 'Demandeur Clients (création + brouillons)',
    ldap: 'lift-demandeur-cust',
    isReadOnly: false,
    isAdmin: false,
    canAccessTiers: false,
    canAccessClients: true,
    canAccessDrafts: true,
    canAccessExport: false,
    canAccessAdministration: false,
    canCreateTiers: false,
    canCreateClients: true,
    canValidateBusinessTiers: false,
    canValidateBusinessClients: false,
    canValidateTreasuryTiers: false,
    canViewArchivedTiers: false,
    canViewArchivedClients: false,
    canOpenArchivedTiers: false,
    canOpenArchivedClients: false,
    canViewTierHistory: false,
    canSeeBankDetails: false,
  },
  {
    role: 'lift-validateur-business-third',
    shortLabel: 'Valid. Biz Third',
    label: 'Validateur Business Tiers',
    ldap: 'lift-validateur-business-third',
    isReadOnly: true,
    isAdmin: false,
    canAccessTiers: true,
    canAccessClients: false,
    canAccessDrafts: false,
    canAccessExport: false,
    canAccessAdministration: false,
    canCreateTiers: false,
    canCreateClients: false,
    canValidateBusinessTiers: true,
    canValidateBusinessClients: false,
    canValidateTreasuryTiers: false,
    canViewArchivedTiers: false,
    canViewArchivedClients: false,
    canOpenArchivedTiers: false,
    canOpenArchivedClients: false,
    canViewTierHistory: true,
    canSeeBankDetails: false,
  },
  {
    role: 'lift-validateur-business-cust',
    shortLabel: 'Valid. Biz Cust',
    label: 'Validateur Business Clients',
    ldap: 'lift-validateur-business-cust',
    isReadOnly: true,
    isAdmin: false,
    canAccessTiers: false,
    canAccessClients: true,
    canAccessDrafts: false,
    canAccessExport: false,
    canAccessAdministration: false,
    canCreateTiers: false,
    canCreateClients: false,
    canValidateBusinessTiers: false,
    canValidateBusinessClients: true,
    canValidateTreasuryTiers: false,
    canViewArchivedTiers: false,
    canViewArchivedClients: false,
    canOpenArchivedTiers: false,
    canOpenArchivedClients: false,
    canViewTierHistory: false,
    canSeeBankDetails: false,
  },
  {
    role: 'lift-validateur-tresorerie-third',
    shortLabel: 'Trésorerie Third',
    label: 'Validateur Trésorerie Tiers',
    ldap: 'lift-validateur-tresorerie-third',
    isReadOnly: true,
    isAdmin: false,
    canAccessTiers: true,
    canAccessClients: false,
    canAccessDrafts: false,
    canAccessExport: false,
    canAccessAdministration: false,
    canCreateTiers: false,
    canCreateClients: false,
    canValidateBusinessTiers: false,
    canValidateBusinessClients: false,
    canValidateTreasuryTiers: true,
    canViewArchivedTiers: false,
    canViewArchivedClients: false,
    canOpenArchivedTiers: false,
    canOpenArchivedClients: false,
    canViewTierHistory: true,
    canSeeBankDetails: true,
  },
  {
    role: 'lift-admin',
    shortLabel: 'Admin',
    label: 'Administrateur',
    ldap: 'lift-admin',
    isReadOnly: false,
    isAdmin: true,
    canAccessTiers: true,
    canAccessClients: true,
    canAccessDrafts: true,
    canAccessExport: true,
    canAccessAdministration: true,
    canCreateTiers: true,
    canCreateClients: true,
    canValidateBusinessTiers: true,
    canValidateBusinessClients: true,
    canValidateTreasuryTiers: false,
    canViewArchivedTiers: true,
    canViewArchivedClients: true,
    canOpenArchivedTiers: true,
    canOpenArchivedClients: true,
    canViewTierHistory: true,
    canSeeBankDetails: false,
  },
];

const roleConfigMap = roleConfigs.reduce<Record<AppRole, RoleConfig>>((acc, config) => {
  acc[config.role] = config;
  return acc;
}, {} as Record<AppRole, RoleConfig>);

interface RoleAccessContextValue {
  role: AppRole;
  setRole: (role: AppRole) => void;
  roleOptions: RoleConfig[];
  permissions: RolePermissions;
}

const RoleAccessContext = createContext<RoleAccessContextValue | null>(null);

const isAppRole = (value: string): value is AppRole => value in roleConfigMap;

export function RoleAccessProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AppRole>(() => {
    if (typeof window === 'undefined') return DEFAULT_ROLE;
    const saved = window.localStorage.getItem(ROLE_STORAGE_KEY);
    return saved && isAppRole(saved) ? saved : DEFAULT_ROLE;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ROLE_STORAGE_KEY, role);
  }, [role]);

  const permissions = useMemo<RolePermissions>(() => {
    const config = roleConfigMap[role];
    return { ...config };
  }, [role]);

  const value = useMemo<RoleAccessContextValue>(() => ({
    role,
    setRole,
    roleOptions: roleConfigs,
    permissions,
  }), [role, permissions]);

  return (
    <RoleAccessContext.Provider value={value}>
      {children}
    </RoleAccessContext.Provider>
  );
}

export function useRoleAccess() {
  const context = useContext(RoleAccessContext);
  if (!context) {
    throw new Error('useRoleAccess must be used inside a RoleAccessProvider');
  }
  return context;
}

export function canAccessPath(pathname: string, permissions: RolePermissions) {
  if (pathname.startsWith('/tiers')) return permissions.canAccessTiers;
  if (pathname.startsWith('/clients')) return permissions.canAccessClients;
  if (pathname.startsWith('/brouillons')) return permissions.canAccessDrafts;
  if (pathname.startsWith('/export')) return permissions.canAccessExport;
  if (pathname.startsWith('/administration')) return permissions.canAccessAdministration;
  return true;
}

export function getFirstAllowedPath(permissions: RolePermissions) {
  if (permissions.canAccessTiers) return '/tiers';
  if (permissions.canAccessClients) return '/clients';
  if (permissions.canAccessDrafts) return '/brouillons';
  if (permissions.canAccessExport) return '/export';
  if (permissions.canAccessAdministration) return '/administration';
  return '/';
}

export function maskIban(rawValue?: string | null) {
  if (!rawValue) return '-';
  const compact = rawValue.replace(/\s+/g, '');
  if (compact.length <= 8) return compact;
  const prefix = compact.slice(0, 4);
  const suffix = compact.slice(-4);
  return `${prefix} **** **** ${suffix}`;
}

