import { useState, useRef, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Alert, App, Button, Checkbox, Collapse, Form, Input, Modal, Popconfirm, Select, Tag, Upload } from 'antd';
import {
  BankOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  DollarOutlined,
  FileTextOutlined,
  GlobalOutlined,
  HomeOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import DktIcon from './DktIcon';
import ProgressSidebar from './ProgressSidebar';
import type { FormSection } from './types';
import CountryFlag from './CountryFlag';
import { maskIban, useRoleAccess } from './RoleAccess';

const { Dragger } = Upload;

type FormStatus = 'draft' | 'pending_business' | null;
type HistoryAction = 'Update' | 'Validate' | 'Reject';

interface HistoryEntry {
  id: string;
  date: string;
  user: string;
  action: HistoryAction;
  field: string;
  oldValue: string;
  newValue: string;
}

const mockHistoryByTier: Record<string, Omit<HistoryEntry, 'id'>[]> = {
  '100001': [
    { date: '15/12 10:00', user: 'Chadi Martin', action: 'Update', field: 'IBAN', oldValue: 'FR7612345678901234567890189', newValue: 'FR7645678901234567890189123' },
    { date: '14/12 15:42', user: 'Sofia Bernard', action: 'Update', field: 'Status', oldValue: 'DRAFT', newValue: 'PENDING BUSINESS' },
    { date: '13/12 09:18', user: 'Admin LIFT', action: 'Validate', field: 'Status', oldValue: 'PENDING BUSINESS', newValue: 'VALIDATED' },
  ],
  '100002': [
    { date: '12/12 11:12', user: 'Martin Dupuis', action: 'Update', field: 'Tax ID', oldValue: 'BE0123456789', newValue: 'BE1123456789' },
    { date: '12/12 11:05', user: 'Martin Dupuis', action: 'Update', field: 'General Email', oldValue: 'contact.old@decathlon.com', newValue: 'contact.be@decathlon.com' },
    { date: '12/12 10:50', user: 'Admin LIFT', action: 'Reject', field: 'Status', oldValue: 'PENDING BUSINESS', newValue: 'REJECTED' },
  ],
  default: [
    { date: '11/12 16:20', user: 'Admin LIFT', action: 'Update', field: 'Status', oldValue: 'DRAFT', newValue: 'PENDING BUSINESS' },
    { date: '11/12 16:05', user: 'Admin LIFT', action: 'Update', field: 'IBAN', oldValue: 'FR7611111111111111111111111', newValue: 'FR7622222222222222222222222' },
  ],
};

type PrefillRecord = {
  legalName: string;
  country: string;
  taxId: string;
  phone: string;
  email: string;
  addressNumber: string;
  addressStreet: string;
  postalCode: string;
  city: string;
  iban: string;
  swift: string;
  bankName: string;
};

const countryCatalog = [
  { value: 'FR', name: 'France' },
  { value: 'BE', name: 'Belgique' },
  { value: 'ES', name: 'Espagne' },
  { value: 'DE', name: 'Allemagne' },
  { value: 'IT', name: 'Italie' },
  { value: 'GB', name: 'Royaume-Uni' },
  { value: 'US', name: 'États-Unis' },
  { value: 'CN', name: 'Chine' },
];

const countryOptions = countryCatalog.map((country) => ({
  value: country.value,
  searchLabel: country.name.toLowerCase(),
  label: (
    <span className="inline-flex items-center gap-1.5">
      <CountryFlag code={country.value} size={14} />
      <span>{country.name}</span>
    </span>
  ),
}));

const countryOptionFilter = (input: string, option?: any) =>
  ((option?.searchLabel || '').toLowerCase().includes(input.toLowerCase()));

const natureOptions = [
  { value: 'retail', label: 'Retail' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'logistics', label: 'Logistique' },
  { value: 'services', label: 'Services' },
];

const currencyOptions = [
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' },
  { value: 'GBP', label: 'GBP' },
  { value: 'CHF', label: 'CHF' },
];

const vatRateOptions = [
  { value: '20', label: '20%' },
  { value: '10', label: '10%' },
  { value: '5.5', label: '5.5%' },
  { value: '0', label: '0%' },
];

const withholdingTaxByCountry: Record<string, { value: string; label: string }[]> = {
  FR: [
    { value: 'none', label: 'Aucune retenue' },
    { value: 'service_3', label: 'Service 3%' },
  ],
  BE: [
    { value: 'none', label: 'Aucune retenue' },
    { value: 'royalty_15', label: 'Royalty 15%' },
  ],
  DE: [
    { value: 'none', label: 'Aucune retenue' },
    { value: 'consulting_5', label: 'Consulting 5%' },
  ],
  ES: [
    { value: 'none', label: 'Aucune retenue' },
    { value: 'service_7', label: 'Service 7%' },
  ],
  default: [{ value: 'none', label: 'Aucune retenue' }],
};

const mockTierById: Record<string, PrefillRecord> = {
  '100001': {
    legalName: 'Decathlon France SAS',
    country: 'FR',
    taxId: 'FR12345678901',
    phone: '+33 1 23 45 67 89',
    email: 'contact.fr@decathlon.com',
    addressNumber: '4',
    addressStreet: 'Boulevard de Mons',
    postalCode: '59650',
    city: "Villeneuve-d'Ascq",
    iban: 'FR7630006000011234567890189',
    swift: 'AGRIFRPP',
    bankName: 'bnp_fr',
  },
  '100002': {
    legalName: 'Decathlon Belgium NV',
    country: 'BE',
    taxId: 'BE0123456789',
    phone: '+32 2 345 67 89',
    email: 'contact.be@decathlon.com',
    addressNumber: '32',
    addressStreet: 'Chaussée de Charleroi',
    postalCode: '1060',
    city: 'Bruxelles',
    iban: 'BE62510007547061',
    swift: 'GEBABEBB',
    bankName: 'ing_be',
  },
};

const formSections: FormSection[] = [
  {
    id: 'identite',
    title: 'Identité (Golden Record)',
    shortTitle: 'Identité',
    description: 'Données principales et fiscales du tiers',
    icon: <DktIcon name="user" size={18} color="currentColor" />,
    subsections: [
      { id: 'infos-principales', label: 'Informations principales', fields: ['sapId', 'legalName', 'tierCountry', 'tierType', 'nature'] },
      { id: 'identifiants-fiscaux', label: 'Identifiants fiscaux', fields: ['taxId', 'vatNumber', 'sirenSiret', 'ean13', 'vatSubject'] },
      { id: 'donnees-bancaires', label: 'Données bancaires', fields: ['bankName', 'bankCountry', 'swift', 'iban', 'bankCurrency'] },
      { id: 'adresse-siege', label: 'Adresse siège', fields: ['addressNumber', 'addressStreet', 'postalCode', 'city'] },
      { id: 'contacts-generaux', label: 'Contacts généraux', fields: ['generalPhone', 'generalEmail'] },
    ],
  },
  {
    id: 'roles',
    title: 'Rôles & Périmètre',
    shortTitle: 'Rôles',
    description: 'Dispatcher AP/AR et pays opérationnels',
    icon: <DktIcon name="users" size={18} color="currentColor" />,
    subsections: [
      { id: 'roles-actifs', label: 'Rôles actifs', fields: ['apRole', 'arRole'] },
      { id: 'selecteur-pays', label: 'Sélecteur de pays', fields: ['operationCountries'] },
    ],
  },
  {
    id: 'finance',
    title: 'Finance & Spécificités locales',
    shortTitle: 'Finance',
    description: 'Paramètres AP par pays activés',
    icon: <DktIcon name="money" size={18} color="currentColor" />,
    subsections: [{ id: 'accordeons-pays', label: 'Accordéons pays', fields: ['financeByCountry'] }],
  },
  {
    id: 'justificatifs',
    title: 'Justificatifs',
    shortTitle: 'Documents',
    description: 'Pièces jointes du dossier',
    icon: <DktIcon name="clipboard" size={18} color="currentColor" />,
    subsections: [{ id: 'documents', label: 'Pièces jointes', fields: ['documents'] }],
  },
];

const localFinanceRequiredSuffixes = [
  'localAccountingEmail',
  'localBusinessEmail',
  'localPaymentName',
  'localCurrency',
  'localVatRate',
  'localWithholdingTax',
  'localGlKey',
];

const getCountryLabel = (code?: string) => countryCatalog.find(country => country.value === code)?.name || '-';

const formatHistoryDate = (date: Date) => {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${day}/${month} ${hours}:${minutes}`;
};

const isSensitiveHistoryField = (field: string) => field.trim().toLowerCase() === 'iban';

const maskHistoryValue = (field: string, value: string) => {
  if (!value) return '-';
  if (!isSensitiveHistoryField(field)) return value;

  const compact = value.replace(/\s+/g, '');
  if (compact.length <= 7) return `${compact.slice(0, 4)}...`;
  return `${compact.slice(0, 4)} ${compact.slice(4, 7)}...`;
};

const getWithholdingOptions = (countryCode: string) =>
  withholdingTaxByCountry[countryCode] || withholdingTaxByCountry.default;

const needsCustomsFields = (countryCode: string) => ['US', 'CN', 'GB'].includes(countryCode);

const getLocalFieldName = (countryCode: string, suffix: string) => `${countryCode}_${suffix}`;

const isFieldValueComplete = (value: unknown) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'boolean') return true;
  if (value && typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0;
  return value !== undefined && value !== null && `${value}`.trim() !== '';
};

const statusConfig: Record<Exclude<FormStatus, null>, { label: string; color: string; bg: string; border: string }> = {
  draft: {
    label: 'DRAFT',
    color: '#595959',
    bg: '#f5f5f5',
    border: '#d9d9d9',
  },
  pending_business: {
    label: 'PENDING BUSINESS',
    color: '#d4b106',
    bg: '#fffbe6',
    border: '#ffe58f',
  },
};

export default function TierFormPage() {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { permissions } = useRoleAccess();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [generatedTierId] = useState(() => `10${Math.floor(Math.random() * 100000)}`);

  const tierId = searchParams.get('tierId') || generatedTierId;
  const mode = searchParams.get('mode') === 'view' ? 'view' : 'edit';
  const canEditTier = permissions.canCreateTiers || permissions.isAdmin;
  const readOnly = mode === 'view' || !canEditTier;

  const [activeSection, setActiveSection] = useState<string>('identite');
  const [activeSubsection, setActiveSubsection] = useState<string>('infos-principales');
  const [completedFields, setCompletedFields] = useState<Set<string>>(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({
    identite: true,
    roles: true,
    finance: true,
    justificatifs: true,
  });
  const [status, setStatus] = useState<FormStatus>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);

  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newBankCountry, setNewBankCountry] = useState('FR');
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countryToAdd, setCountryToAdd] = useState<string | null>(null);
  const [bankOptions, setBankOptions] = useState([
    { value: 'bnp_fr', label: 'BNP Paribas (FR)' },
    { value: 'ing_be', label: 'ING Belgium (BE)' },
    { value: 'db_de', label: 'Deutsche Bank (DE)' },
  ]);

  const contentRef = useRef<HTMLDivElement>(null);
  const isManualScrollRef = useRef(false);

  const selectedCountries = (Form.useWatch('operationCountries', form) as string[] | undefined) || [];
  const legalName = Form.useWatch('legalName', form) as string | undefined;
  const bankCountry = Form.useWatch('bankCountry', form) as string | undefined;
  const bankCurrency = Form.useWatch('bankCurrency', form) as string | undefined;
  const generalEmail = Form.useWatch('generalEmail', form) as string | undefined;
  const iban = Form.useWatch('iban', form) as string | undefined;
  const apRole = Form.useWatch('apRole', form) as boolean | undefined;
  const arRole = Form.useWatch('arRole', form) as boolean | undefined;
  const canViewHistory = readOnly && permissions.canViewTierHistory;
  const displayedIban = permissions.canSeeBankDetails ? (iban || '-') : maskIban(iban);
  const canValidateBusiness = permissions.canValidateBusinessTiers || permissions.isAdmin;
  const canValidateTreasury = permissions.canValidateTreasuryTiers;
  const availableOperationCountries = useMemo(
    () => countryOptions.filter(option => !selectedCountries.includes(option.value)),
    [selectedCountries],
  );

  const computeCompletedFields = useCallback((values: Record<string, unknown>) => {
    const next = new Set<string>();
    const mark = (fieldName: string) => {
      if (isFieldValueComplete(values[fieldName])) next.add(fieldName);
    };

    [
      'sapId',
      'legalName',
      'tierCountry',
      'tierType',
      'nature',
      'taxId',
      'vatNumber',
      'ean13',
      'vatSubject',
      'bankName',
      'bankCountry',
      'swift',
      'iban',
      'bankCurrency',
      'addressNumber',
      'addressStreet',
      'postalCode',
      'city',
      'generalPhone',
      'generalEmail',
      'apRole',
      'arRole',
      'operationCountries',
    ].forEach(mark);

    if (values.tierCountry === 'FR') mark('sirenSiret');
    else next.add('sirenSiret');

    const countries = Array.isArray(values.operationCountries) ? (values.operationCountries as string[]) : [];
    const financeComplete = countries.length > 0 && countries.every(countryCode =>
      localFinanceRequiredSuffixes.every((suffix) =>
        isFieldValueComplete(values[getLocalFieldName(countryCode, suffix)]),
      ),
    );
    if (financeComplete) next.add('financeByCountry');

    if (Array.isArray(values.documents) && values.documents.length > 0) next.add('documents');

    return next;
  }, []);

  const isCountryFinanceComplete = useCallback((countryCode: string) => {
    const values = form.getFieldsValue(true) as Record<string, unknown>;
    return localFinanceRequiredSuffixes.every((suffix) =>
      isFieldValueComplete(values[getLocalFieldName(countryCode, suffix)]),
    );
  }, [form]);

  const appendHistoryEntry = useCallback((entry: Omit<HistoryEntry, 'id' | 'date'> & { date?: string }) => {
    setHistoryEntries(previous => [
      {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        date: entry.date || formatHistoryDate(new Date()),
        user: entry.user,
        action: entry.action,
        field: entry.field,
        oldValue: entry.oldValue,
        newValue: entry.newValue,
      },
      ...previous,
    ]);
  }, []);

  useEffect(() => {
    const prefill = mockTierById[tierId] || {
      legalName: 'Nouveau tiers SAP',
      country: 'FR',
      taxId: 'FR00000000000',
      phone: '+33 1 00 00 00 00',
      email: 'contact@tiers.local',
      addressNumber: '1',
      addressStreet: 'Rue de la Maquette',
      postalCode: '59000',
      city: 'Lille',
      iban: 'FR7630006000011234567890189',
      swift: 'AGRIFRPP',
      bankName: 'bnp_fr',
    };

    form.setFieldsValue({
      sapId: tierId,
      legalName: prefill.legalName,
      tierCountry: prefill.country,
      tierType: 'Tiers Interne',
      nature: 'retail',
      taxId: prefill.taxId,
      vatNumber: prefill.taxId,
      sirenSiret: prefill.country === 'FR' ? '12345678900013' : '',
      ean13: '3017620422003',
      vatSubject: true,
      bankName: prefill.bankName,
      bankCountry: prefill.country,
      swift: prefill.swift,
      iban: prefill.iban,
      bankCurrency: prefill.country === 'US' ? 'USD' : 'EUR',
      addressNumber: prefill.addressNumber,
      addressStreet: prefill.addressStreet,
      addressLine2: '',
      postalCode: prefill.postalCode,
      city: prefill.city,
      generalPhone: prefill.phone,
      generalEmail: prefill.email,
      apRole: true,
      arRole: true,
      operationCountries: [prefill.country],
      documents: [],
    });

    setFiles([]);
    setStatus(null);
    const initialHistory = (mockHistoryByTier[tierId] || mockHistoryByTier.default).map((entry, index) => ({
      id: `init-${index}`,
      ...entry,
    }));
    setHistoryEntries(initialHistory);
    setCompletedFields(computeCompletedFields(form.getFieldsValue(true) as Record<string, unknown>));
  }, [computeCompletedFields, form, tierId]);

  useEffect(() => {
    if (!selectedCountries.length) return;

    const patch: Record<string, unknown> = {};
    selectedCountries.forEach(countryCode => {
      const defaultWithholding = getWithholdingOptions(countryCode)[0]?.value || 'none';

      const paymentNameKey = getLocalFieldName(countryCode, 'localPaymentName');
      const accountingEmailKey = getLocalFieldName(countryCode, 'localAccountingEmail');
      const businessEmailKey = getLocalFieldName(countryCode, 'localBusinessEmail');
      const currencyKey = getLocalFieldName(countryCode, 'localCurrency');
      const paymentTermsKey = getLocalFieldName(countryCode, 'localPaymentTerms');
      const paymentModeKey = getLocalFieldName(countryCode, 'localPaymentMode');
      const paymentPlaceKey = getLocalFieldName(countryCode, 'localPaymentPlace');
      const vatTypeKey = getLocalFieldName(countryCode, 'localVatType');
      const vatRateKey = getLocalFieldName(countryCode, 'localVatRate');
      const withholdingKey = getLocalFieldName(countryCode, 'localWithholdingTax');

      if (!form.getFieldValue(paymentNameKey) && legalName) patch[paymentNameKey] = legalName;
      if (!form.getFieldValue(accountingEmailKey) && generalEmail) patch[accountingEmailKey] = generalEmail;
      if (!form.getFieldValue(businessEmailKey) && generalEmail) patch[businessEmailKey] = generalEmail;
      if (!form.getFieldValue(currencyKey)) patch[currencyKey] = bankCurrency || 'EUR';
      if (!form.getFieldValue(paymentTermsKey)) patch[paymentTermsKey] = '45 DAYS NET';
      if (!form.getFieldValue(paymentModeKey)) patch[paymentModeKey] = 'Transfert bancaire';
      if (!form.getFieldValue(paymentPlaceKey)) patch[paymentPlaceKey] = getCountryLabel(bankCountry);
      if (!form.getFieldValue(vatTypeKey)) patch[vatTypeKey] = 'V';
      if (!form.getFieldValue(vatRateKey)) patch[vatRateKey] = '20';
      if (!form.getFieldValue(withholdingKey)) patch[withholdingKey] = defaultWithholding;
    });

    if (Object.keys(patch).length > 0) {
      form.setFieldsValue(patch);
      const mergedValues = { ...(form.getFieldsValue(true) as Record<string, unknown>), ...patch };
      setCompletedFields(computeCompletedFields(mergedValues));
    }
  }, [selectedCountries, legalName, generalEmail, bankCountry, bankCurrency, form, computeCompletedFields]);

  useEffect(() => {
    if (!isCountryModalOpen) return;
    if (countryToAdd && availableOperationCountries.some(option => option.value === countryToAdd)) return;
    setCountryToAdd(availableOperationCountries[0]?.value || null);
  }, [availableOperationCountries, countryToAdd, isCountryModalOpen]);

  const scrollToId = useCallback((targetId: string) => {
    const element = document.getElementById(targetId);
    if (element && contentRef.current) {
      isManualScrollRef.current = true;
      contentRef.current.scrollTo({ top: element.offsetTop - 20, behavior: 'smooth' });
      setTimeout(() => {
        isManualScrollRef.current = false;
      }, 900);
    }
  }, []);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isManualScrollRef.current) return;
      const scrollPosition = container.scrollTop + 150;

      for (let i = formSections.length - 1; i >= 0; i -= 1) {
        const sectionElement = document.getElementById(formSections[i].id);
        if (sectionElement && sectionElement.offsetTop <= scrollPosition) {
          setActiveSection(formSections[i].id);

          const subsections = formSections[i].subsections;
          let foundSubsection = subsections[0]?.id || '';
          for (let j = subsections.length - 1; j >= 0; j -= 1) {
            const subsectionElement = document.getElementById(subsections[j].id);
            if (subsectionElement && subsectionElement.offsetTop <= scrollPosition) {
              foundSubsection = subsections[j].id;
              break;
            }
          }

          setActiveSubsection(foundSubsection);
          break;
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCompletion = useMemo(() => {
    const allFields = formSections.flatMap(section => section.subsections.flatMap(subsection => subsection.fields));
    const completedCount = allFields.filter(fieldName => completedFields.has(fieldName)).length;
    return allFields.length > 0 ? Math.round((completedCount / allFields.length) * 100) : 0;
  }, [completedFields]);

  const updateOperationCountries = useCallback((countries: string[]) => {
    form.setFieldValue('operationCountries', countries);
    const values = { ...(form.getFieldsValue(true) as Record<string, unknown>), operationCountries: countries };
    setCompletedFields(computeCompletedFields(values));
  }, [computeCompletedFields, form]);

  const openCountryModal = useCallback(() => {
    if (readOnly || availableOperationCountries.length === 0) return;
    setCountryToAdd(availableOperationCountries[0].value);
    setIsCountryModalOpen(true);
  }, [availableOperationCountries, readOnly]);

  const handleAddCountry = useCallback(() => {
    if (!countryToAdd) return;
    const nextCountries = Array.from(new Set([...selectedCountries, countryToAdd]));
    updateOperationCountries(nextCountries);
    setIsCountryModalOpen(false);
    setCountryToAdd(null);
  }, [countryToAdd, selectedCountries, updateOperationCountries]);

  const handleRemoveCountry = useCallback((countryCode: string) => {
    const nextCountries = selectedCountries.filter(currentCountry => currentCountry !== countryCode);
    updateOperationCountries(nextCountries);
  }, [selectedCountries, updateOperationCountries]);

  const handleValuesChange = (_changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => {
    setCompletedFields(computeCompletedFields(allValues));
  };

  const handleUploadChange = (info: any) => {
    const nextFiles = info.fileList || [];
    setFiles(nextFiles);
    form.setFieldValue('documents', nextFiles);
    const values = { ...(form.getFieldsValue(true) as Record<string, unknown>), documents: nextFiles };
    setCompletedFields(computeCompletedFields(values));
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    fileList: files,
    onChange: handleUploadChange,
    beforeUpload: () => false as const,
    accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  };

  const handleCreateBank = () => {
    const trimmedName = newBankName.trim();
    if (!trimmedName) {
      message.warning('Veuillez saisir un nom de banque.');
      return;
    }

    const generatedValue = `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${newBankCountry.toLowerCase()}`;
    if (bankOptions.some(option => option.value === generatedValue)) {
      message.info('Cette banque existe déjà.');
      form.setFieldValue('bankName', generatedValue);
      setBankModalOpen(false);
      setNewBankName('');
      return;
    }

    const generatedLabel = `${trimmedName} (${newBankCountry})`;
    const nextBankOptions = [...bankOptions, { value: generatedValue, label: generatedLabel }];
    setBankOptions(nextBankOptions);
    form.setFieldValue('bankName', generatedValue);
    setBankModalOpen(false);
    setNewBankName('');
    message.success('Banque ajoutée.');
  };

  const handleSaveDraft = () => {
    if (readOnly) return;
    const previousStatus = status ? statusConfig[status].label : 'IN_EDIT';
    setStatus('draft');
    appendHistoryEntry({
      user: 'Current User',
      action: 'Update',
      field: 'Status',
      oldValue: previousStatus,
      newValue: 'DRAFT',
    });
    message.success('Dossier sauvegarde avec le statut DRAFT.');
  };

  const handleSubmit = async () => {
    if (readOnly) return;
    if (selectedCountries.length === 0) {
      message.error("Veuillez ajouter au moins un pays d'opération.");
      return;
    }
    try {
      await form.validateFields();
      const previousStatus = status ? statusConfig[status].label : 'DRAFT';
      setStatus('pending_business');
      appendHistoryEntry({
        user: 'Current User',
        action: 'Validate',
        field: 'Status',
        oldValue: previousStatus,
        newValue: 'PENDING BUSINESS',
      });
      message.success('Dossier soumis. Statut : PENDING BUSINESS.');
    } catch {
      message.error('Veuillez compléter les champs requis avant soumission.');
    }
  };

  const handleBusinessValidation = (action: 'Validate' | 'Reject') => {
    const previousStatus = status ? statusConfig[status].label : 'PENDING BUSINESS';
    const nextStatus = action === 'Validate' ? 'VALIDATED' : 'REJECTED';

    appendHistoryEntry({
      user: 'Business Validator',
      action,
      field: 'Status',
      oldValue: previousStatus,
      newValue: nextStatus,
    });

    message.success(
      action === 'Validate'
        ? 'Validation Business effectuée (mock).'
        : 'Rejet Business effectué (mock).',
    );
  };

  const handleTreasuryValidation = (action: 'Validate' | 'Reject') => {
    appendHistoryEntry({
      user: 'Trésorerie Validator',
      action,
      field: 'BANK_WALLET',
      oldValue: 'PENDING TRESORERIE',
      newValue: action === 'Validate' ? 'APPROVED' : 'REJECTED',
    });

    message.success(
      action === 'Validate'
        ? 'BANK_WALLET approuvé (mock).'
        : 'BANK_WALLET rejeté (mock).',
    );
  };

  const fc = (fieldName: string) => (completedFields.has(fieldName) ? 'field-completed' : '');
  const doneIcon = (fieldName: string) =>
    completedFields.has(fieldName) ? <CheckCircleFilled style={{ color: '#52c41a' }} /> : undefined;

  const ls = { fontFamily: 'var(--font-family-text)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' as const };
  const req = <span style={{ color: 'var(--destructive)', marginLeft: '2px' }}>*</span>;

  const getSectionStats = useCallback((sectionId: string) => {
    const section = formSections.find(currentSection => currentSection.id === sectionId);
    if (!section) return { done: 0, total: 0, pct: 0 };

    const allFields = section.subsections.flatMap(subsection => subsection.fields);
    const doneCount = allFields.filter(fieldName => completedFields.has(fieldName)).length;
    const pct = allFields.length > 0 ? Math.round((doneCount / allFields.length) * 100) : 0;
    return { done: doneCount, total: allFields.length, pct };
  }, [completedFields]);

  const Card = ({ children, title, subtitle, icon, id }: { children: ReactNode; title: string; subtitle?: string; icon: ReactNode; id?: string }) => (
    <div
      id={id}
      className="mb-5 form-section"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
      }}
    >
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
          style={{ backgroundColor: 'rgba(54, 67, 186, 0.07)' }}
        >
          {icon}
        </div>
        <div>
          <h4
            className="m-0"
            style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--foreground)',
              lineHeight: '1.3',
            }}
          >
            {title}
          </h4>
          {subtitle && (
            <p
              className="m-0"
              style={{
                fontFamily: 'var(--font-family-text)',
                fontSize: '13px',
                color: 'var(--muted-foreground)',
                lineHeight: '1.3',
                marginTop: '1px',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const SectionBanner = ({ index, title, description, sectionId }: { index: number; title: string; description: string; sectionId: string }) => {
    const stats = getSectionStats(sectionId);
    const isComplete = stats.pct === 100;
    return (
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style={{
            backgroundColor: isComplete ? '#52c41a' : 'var(--primary)',
            boxShadow: isComplete ? '0 2px 8px rgba(82,196,26,0.3)' : '0 2px 8px rgba(54,67,186,0.25)',
            transition: 'all 0.3s ease',
          }}
        >
          {isComplete ? (
            <CheckCircleFilled style={{ fontSize: '18px', color: 'white' }} />
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'white',
              }}
            >
              {index}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3
              className="m-0"
              style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--foreground)',
                lineHeight: '1.2',
              }}
            >
              {title}
            </h3>
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full shrink-0"
              style={{
                backgroundColor: isComplete ? 'rgba(82,196,26,0.08)' : 'rgba(54,67,186,0.06)',
                border: `1px solid ${isComplete ? 'rgba(82,196,26,0.2)' : 'rgba(54,67,186,0.12)'}`,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-family-text)',
                  fontSize: '12px',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: isComplete ? '#52c41a' : 'var(--primary)',
                }}
              >
                {stats.done}/{stats.total}
              </span>
              <div
                style={{
                  width: '32px',
                  height: '3px',
                  borderRadius: '2px',
                  backgroundColor: isComplete ? 'rgba(82,196,26,0.15)' : 'rgba(54,67,186,0.1)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${stats.pct}%`,
                    borderRadius: '2px',
                    backgroundColor: isComplete ? '#52c41a' : 'var(--primary)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>
          <p
            className="m-0"
            style={{
              fontFamily: 'var(--font-family-text)',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted-foreground)',
              lineHeight: '1.4',
            }}
          >
            {description}
          </p>
        </div>
      </div>
    );
  };

  const toggleAccordionSection = (sectionId: 'identite' | 'roles' | 'finance' | 'justificatifs') => {
    setAccordionOpen(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const SectionAccordionToggle = ({ sectionId }: { sectionId: 'identite' | 'roles' | 'finance' | 'justificatifs' }) => (
    <button
      onClick={() => toggleAccordionSection(sectionId)}
      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
      style={{
        border: '1px solid var(--border)',
        backgroundColor: 'var(--card)',
        cursor: 'pointer',
        marginTop: '6px',
      }}
      title={accordionOpen[sectionId] ? 'Réduire' : 'Déplier'}
    >
      <DktIcon
        name={accordionOpen[sectionId] ? 'chevron-up' : 'chevron-down'}
        size={16}
        color="var(--muted-foreground)"
      />
    </button>
  );

  const currentStatus = status ? statusConfig[status] : null;
  const canShowClientLink = !!apRole && !!arRole && permissions.canAccessClients;

  return (
    <>
      <div className="flex" style={{ height: 'calc(100vh - 88px)' }}>
        <aside
          className="shrink-0 flex flex-col overflow-hidden"
          style={{
            width: sidebarCollapsed ? '60px' : '300px',
            backgroundColor: 'var(--primary)',
            transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <button
            onClick={() => setSidebarCollapsed(prev => !prev)}
            className="shrink-0 flex items-center justify-center w-full py-2"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            {sidebarCollapsed ? (
              <DktIcon name="menu" size={16} color="rgba(255,255,255,0.7)" />
            ) : (
              <DktIcon name="menu-left" size={16} color="rgba(255,255,255,0.7)" />
            )}
          </button>

          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-1 py-3 flex-1 overflow-y-auto">
              {formSections.map(section => {
                const isActive = activeSection === section.id;
                const allFields = section.subsections.flatMap(subsection => subsection.fields);
                const done = allFields.filter(fieldName => completedFields.has(fieldName)).length;
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
          ) : (
            <>
              <div className="px-5 pt-4 pb-3 shrink-0 overflow-hidden">
                <button
                  onClick={() => navigate('/tiers')}
                  className="flex items-center gap-1.5 mb-4"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'var(--font-family-text)',
                    fontSize: '13px',
                  }}
                >
                  <DktIcon name="arrow-left" size={12} color="rgba(255,255,255,0.6)" />
                  Retour à la liste
                </button>
                <h2
                  className="m-0 mb-1"
                  style={{
                    fontFamily: 'var(--font-family-display)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'white',
                    lineHeight: '1.3',
                  }}
                >
                  Fiche Tiers LIFT
                </h2>
                <p
                  className="m-0 mb-4"
                  style={{
                    fontFamily: 'var(--font-family-text)',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: '1.4',
                  }}
                >
                  Formulaire import / création
                </p>
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        fontFamily: 'var(--font-family-text)',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      Progression
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-family-display)',
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'white',
                      }}
                    >
                      {totalCompletion}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${totalCompletion}%`,
                        borderRadius: '2px',
                        backgroundColor: totalCompletion === 100 ? '#52c41a' : 'white',
                        transition: 'width 0.5s ease',
                      }}
                    />
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

        <main ref={contentRef} className="flex-1 overflow-y-auto" style={{ backgroundColor: '#f6f6f5' }}>
          <div className="max-w-4xl mx-auto px-10 py-8">
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              requiredMark={false}
              onValuesChange={handleValuesChange}
              disabled={readOnly}
            >
              <div
                className="mb-8 p-5 rounded-lg flex items-center justify-between"
                style={{ backgroundColor: 'rgba(54,67,186,0.05)', border: '1px solid rgba(54,67,186,0.15)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-lg"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    <UserOutlined style={{ fontSize: '22px', color: 'white' }} />
                  </div>
                  <div>
                    <div
                      style={{
                        ...ls,
                        fontSize: '12px',
                        color: 'var(--muted-foreground)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      ID Tiers LIFT
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-family-display)',
                        fontSize: 'var(--text-xl)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--foreground)',
                      }}
                    >
                      {tierId}
                    </div>
                  </div>
                </div>
                {currentStatus ? (
                  <Tag
                    style={{
                      margin: 0,
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-button)',
                      color: currentStatus.color,
                      backgroundColor: currentStatus.bg,
                      border: `1px solid ${currentStatus.border}`,
                      fontFamily: 'var(--font-family-text)',
                      fontSize: '12px',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {currentStatus.label}
                  </Tag>
                ) : (
                  <Tag
                    color={readOnly ? 'default' : 'blue'}
                    style={{
                      margin: 0,
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-family-text)',
                      borderRadius: 'var(--radius-button)',
                      border: 'none',
                    }}
                  >
                    {readOnly ? 'CONSULTATION' : 'ÉDITION'}
                  </Tag>
                )}
              </div>

              <Alert
                showIcon
                icon={<InfoCircleOutlined />}
                message="Les données ont été pré-remplies depuis le référentiel SAP. Vous ne pourrez pas modifier les champs verrouillés."
                type="info"
                style={{
                  marginBottom: '22px',
                  border: '1px solid rgba(24,144,255,0.25)',
                  backgroundColor: 'rgba(24,144,255,0.07)',
                }}
              />

              <Form.Item name="operationCountries" hidden>
                <Select mode="multiple" options={countryOptions} />
              </Form.Item>

              <section id="identite" className="form-section mb-14">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <SectionBanner
                      index={1}
                      title="Identité (Général - Golden Record)"
                      description="Informations principales, fiscales, bancaires et contacts du tiers"
                      sectionId="identite"
                    />
                  </div>
                  <SectionAccordionToggle sectionId="identite" />
                </div>

                {accordionOpen.identite && (
                  <>
                <Card
                  id="infos-principales"
                  title="Informations principales"
                  subtitle="Base identitaire du tiers"
                  icon={<UserOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Form.Item
                        label={<span style={ls}>ID SAP {req}</span>}
                        name="sapId"
                        className={fc('sapId')}
                      >
                        <Input size="large" disabled suffix={doneIcon('sapId')} />
                      </Form.Item>
                      <Form.Item
                        label={<span style={ls}>Type de tiers {req}</span>}
                        name="tierType"
                        className={fc('tierType')}
                      >
                        <Input size="large" disabled suffix={doneIcon('tierType')} />
                      </Form.Item>
                    </div>
                    <Form.Item
                      label={<span style={ls}>Nom légal {req}</span>}
                      name="legalName"
                      rules={[{ required: true, message: 'Champ requis' }]}
                      className={fc('legalName')}
                    >
                        <Input size="large" placeholder="Nom légal du tiers" suffix={doneIcon('legalName')} />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-6">
                      <Form.Item
                        label={<span style={ls}>Pays du tiers {req}</span>}
                        name="tierCountry"
                        rules={[{ required: true, message: 'Champ requis' }]}
                        className={fc('tierCountry')}
                      >
                        <Select size="large" placeholder="Sélectionnez" options={countryOptions} showSearch filterOption={countryOptionFilter} />
                      </Form.Item>
                      <Form.Item
                        label={<span style={ls}>Nature {req}</span>}
                        name="nature"
                        rules={[{ required: true, message: 'Champ requis' }]}
                        className={fc('nature')}
                      >
                        <Select size="large" placeholder="Sélectionnez" options={natureOptions} />
                      </Form.Item>
                    </div>
                  </div>
                </Card>

                <Card
                  id="identifiants-fiscaux"
                  title="Identifiants fiscaux"
                  subtitle="TVA, tax ID et références légales"
                  icon={<SafetyOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Form.Item
                        label={<span style={ls}>Tax ID {req}</span>}
                        name="taxId"
                        rules={[{ required: true, message: 'Champ requis' }]}
                        className={fc('taxId')}
                      >
                        <Input size="large" placeholder="Ex: FR12345678901" suffix={doneIcon('taxId')} />
                      </Form.Item>
                      <Form.Item
                        label={<span style={ls}>Numéro TVA {req}</span>}
                        name="vatNumber"
                        normalize={(value) => value?.replace(/\s+/g, '').toUpperCase()}
                        rules={[
                          { required: true, message: 'Champ requis' },
                          { pattern: /^[A-Z]{2}[A-Z0-9]{8,14}$/, message: 'Format TVA invalide' },
                        ]}
                        className={fc('vatNumber')}
                      >
                        <Input size="large" placeholder="Ex: FR12345678901" suffix={doneIcon('vatNumber')} />
                      </Form.Item>
                    </div>

                    <Form.Item noStyle shouldUpdate={(prev, current) => prev.tierCountry !== current.tierCountry}>
                      {({ getFieldValue }) =>
                        getFieldValue('tierCountry') === 'FR' ? (
                          <Form.Item
                            label={<span style={ls}>SIREN / SIRET {req}</span>}
                            name="sirenSiret"
                            rules={[
                              { required: true, message: 'Champ requis pour la France' },
                              { pattern: /^\d{9}(\d{5})?$/, message: '9 ou 14 chiffres attendus' },
                            ]}
                            className={fc('sirenSiret')}
                          >
                            <Input size="large" placeholder="Ex: 123456789 ou 12345678900013" suffix={doneIcon('sirenSiret')} />
                          </Form.Item>
                        ) : null
                      }
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-6">
                      <Form.Item
                        label={<span style={ls}>EAN13</span>}
                        name="ean13"
                        rules={[{ pattern: /^\d{13}$/, message: 'EAN13 invalide (13 chiffres)' }]}
                        className={fc('ean13')}
                      >
                        <Input size="large" placeholder="Ex: 3017620422003" suffix={doneIcon('ean13')} />
                      </Form.Item>
                      <div>
                        <label className="block mb-3" style={{ ...ls, color: 'var(--foreground)' }}>
                          Assujetti à la TVA
                        </label>
                        <Form.Item
                          name="vatSubject"
                          valuePropName="checked"
                          className={fc('vatSubject')}
                          style={{ marginBottom: 0 }}
                        >
                          <Checkbox>Oui</Checkbox>
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card
                  id="donnees-bancaires"
                  title="Données bancaires"
                  subtitle="Sélection de banque et références bancaires"
                  icon={<BankOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}
                >
                  <div className="space-y-6">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Form.Item
                          label={<span style={ls}>Banque {req}</span>}
                          name="bankName"
                          rules={[{ required: true, message: 'Champ requis' }]}
                          className={fc('bankName')}
                        >
                          <Select size="large" placeholder="Sélectionnez une banque" options={bankOptions} showSearch />
                        </Form.Item>
                      </div>
                      <Button
                        onClick={() => setBankModalOpen(true)}
                        disabled={readOnly}
                        style={{ height: '40px', borderRadius: 'var(--radius-button)' }}
                      >
                        + Ajouter
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Form.Item
                        label={<span style={ls}>Pays banque {req}</span>}
                        name="bankCountry"
                        rules={[{ required: true, message: 'Champ requis' }]}
                        className={fc('bankCountry')}
                      >
                        <Select size="large" placeholder="Sélectionnez" options={countryOptions} showSearch filterOption={countryOptionFilter} />
                      </Form.Item>
                      <Form.Item
                        label={<span style={ls}>Clé SWIFT {req}</span>}
                        name="swift"
                        normalize={(value) => value?.replace(/\s+/g, '').toUpperCase()}
                        rules={[
                          { required: true, message: 'Champ requis' },
                          { pattern: /^[A-Z0-9]{8}([A-Z0-9]{3})?$/, message: 'Format SWIFT invalide' },
                        ]}
                        className={fc('swift')}
                      >
                        <Input size="large" placeholder="Ex: AGRIFRPP" suffix={doneIcon('swift')} />
                      </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <Form.Item
                        label={<span style={ls}>IBAN {req}</span>}
                        name="iban"
                        normalize={(value) => value?.replace(/\s+/g, '').toUpperCase()}
                        rules={[
                          { required: true, message: 'Champ requis' },
                          { pattern: /^[A-Z]{2}[0-9A-Z]{13,34}$/, message: 'Format IBAN invalide' },
                        ]}
                        className={fc('iban')}
                        extra={<span style={{ ...ls, fontSize: '12px', color: 'var(--muted-foreground)' }}>Valeur chiffrée en back-end (mock)</span>}
                      >
                        {permissions.canSeeBankDetails ? (
                          <Input size="large" placeholder="Ex: FR7630006000011234567890189" suffix={doneIcon('iban')} />
                        ) : (
                          <Input.Password
                            size="large"
                            placeholder="IBAN masqué"
                            visibilityToggle={false}
                            autoComplete="new-password"
                          />
                        )}
                      </Form.Item>
                      <Form.Item
                        label={<span style={ls}>Devise {req}</span>}
                        name="bankCurrency"
                        rules={[{ required: true, message: 'Champ requis' }]}
                        className={fc('bankCurrency')}
                      >
                        <Select size="large" placeholder="Sélectionnez" options={currencyOptions} />
                      </Form.Item>
                    </div>
                  </div>
                </Card>

                <Card
                  id="adresse-siege"
                  title="Adresse siège"
                  subtitle="Adresse principale de l'entité"
                  icon={<HomeOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <Form.Item
                        label={<span style={ls}>N° Rue {req}</span>}
                        name="addressNumber"
                        rules={[{ required: true, message: 'Champ requis' }]}
                        className={fc('addressNumber')}
                      >
                        <Input size="large" placeholder="12" suffix={doneIcon('addressNumber')} />
                      </Form.Item>
                      <Form.Item
                        label={<span style={ls}>Adresse complète {req}</span>}
                        name="addressStreet"
                        rules={[{ required: true, message: 'Champ requis' }]}
                        className={`${fc('addressStreet')} col-span-3`}
                      >
                        <Input size="large" placeholder="Nom de rue / avenue" suffix={doneIcon('addressStreet')} />
                      </Form.Item>
                    </div>
                    <Form.Item
                      label={<span style={ls}>Complément</span>}
                      name="addressLine2"
                      className={fc('addressLine2')}
                    >
                        <Input size="large" placeholder="Bâtiment, étage..." />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-6">
                      <Form.Item
                        label={<span style={ls}>Code postal {req}</span>}
                        name="postalCode"
                        rules={[{ required: true, message: 'Champ requis' }]}
                        className={fc('postalCode')}
                      >
                        <Input size="large" placeholder="59000" suffix={doneIcon('postalCode')} />
                      </Form.Item>
                      <Form.Item
                        label={<span style={ls}>Ville {req}</span>}
                        name="city"
                        rules={[{ required: true, message: 'Champ requis' }]}
                        className={fc('city')}
                      >
                        <Input size="large" placeholder="Lille" suffix={doneIcon('city')} />
                      </Form.Item>
                    </div>
                  </div>
                </Card>

                <Card
                  id="contacts-generaux"
                  title="Contacts généraux"
                  subtitle="Canaux de contact globaux"
                  icon={<PhoneOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}
                >
                  <div className="grid grid-cols-2 gap-6">
                    <Form.Item
                      label={<span style={ls}>Téléphone {req}</span>}
                      name="generalPhone"
                      rules={[{ required: true, message: 'Champ requis' }]}
                      className={fc('generalPhone')}
                    >
                      <Input
                        size="large"
                        placeholder="+33 1 23 45 67 89"
                        prefix={<PhoneOutlined style={{ color: 'var(--muted-foreground)' }} />}
                        suffix={doneIcon('generalPhone')}
                      />
                    </Form.Item>
                    <Form.Item
                      label={<span style={ls}>Email générique {req}</span>}
                      name="generalEmail"
                      normalize={(value) => value?.toLowerCase()}
                      rules={[
                        { required: true, message: 'Champ requis' },
                        { type: 'email', message: 'Email invalide' },
                      ]}
                      className={fc('generalEmail')}
                    >
                      <Input
                        size="large"
                        placeholder="contact@societe.com"
                        prefix={<MailOutlined style={{ color: 'var(--muted-foreground)' }} />}
                        suffix={doneIcon('generalEmail')}
                      />
                    </Form.Item>
                  </div>
                </Card>
                  </>
                )}
              </section>

              <section id="roles" className="form-section mb-14">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <SectionBanner
                      index={2}
                      title="Rôles & Périmètre (Dispatcher)"
                      description="Activation des rôles et génération des pays opérationnels"
                      sectionId="roles"
                    />
                  </div>
                  <SectionAccordionToggle sectionId="roles" />
                </div>

                {accordionOpen.roles && (
                  <>
                <Card
                  id="roles-actifs"
                  title="Rôles actifs"
                  subtitle="Account Payable / Account Receivable"
                  icon={<GlobalOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}
                >
                  <div className="space-y-4">
                    <Form.Item name="apRole" valuePropName="checked" className={fc('apRole')} style={{ marginBottom: 0 }}>
                      <Checkbox>
                        <span style={{ ...ls, fontWeight: 'var(--font-weight-semibold)' as const }}>
                          Account Payable (Fournisseur)
                        </span>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item name="arRole" valuePropName="checked" className={fc('arRole')} style={{ marginBottom: 0 }}>
                      <Checkbox>
                        <span style={{ ...ls, fontWeight: 'var(--font-weight-semibold)' as const }}>
                          Account Receivable (Client)
                        </span>
                      </Checkbox>
                    </Form.Item>
                    <div className="pl-7 flex items-start gap-2">
                      <InfoCircleOutlined style={{ color: 'var(--primary)', fontSize: '14px', marginTop: '2px' }} />
                      <p
                        className="m-0"
                        style={{
                          ...ls,
                          fontSize: '13px',
                          fontWeight: 'var(--font-weight-normal)',
                          color: 'var(--muted-foreground)',
                          lineHeight: '1.5',
                        }}
                      >
                        En conservant ce rôle, ce tiers sera également synchronisé dans le référentiel Client avec le même identifiant.
                      </p>
                    </div>
                  </div>
                </Card>

                <div
                  id="selecteur-pays"
                  className="mb-5 form-section"
                  style={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-card)',
                    overflow: 'hidden',
                  }}
                >
                  <div className="flex items-center justify-between gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                        style={{ backgroundColor: 'rgba(54, 67, 186, 0.07)' }}
                      >
                        <GlobalOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />
                      </div>
                      <div>
                        <h4
                          className="m-0"
                          style={{
                            fontFamily: 'var(--font-family-display)',
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--foreground)',
                            lineHeight: '1.3',
                          }}
                        >
                          Pays d'opération
                        </h4>
                        <p
                          className="m-0"
                          style={{
                            fontFamily: 'var(--font-family-text)',
                            fontSize: '13px',
                            color: 'var(--muted-foreground)',
                            lineHeight: '1.3',
                            marginTop: '1px',
                          }}
                        >
                          Ajoutez et configurez les pays d'opération
                        </p>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      icon={<GlobalOutlined />}
                      onClick={openCountryModal}
                      disabled={readOnly || availableOperationCountries.length === 0}
                      style={{ borderRadius: 'var(--radius-button)' }}
                    >
                      Ajouter un pays
                    </Button>
                  </div>

                  <div className="p-5">
                    {selectedCountries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12" style={{ opacity: 0.5 }}>
                        <GlobalOutlined style={{ fontSize: '48px', color: 'var(--muted-foreground)' }} />
                        <p style={{ ...ls, color: 'var(--muted-foreground)', marginTop: '12px', marginBottom: 0 }}>
                          Aucun pays configuré
                        </p>
                        <p style={{ ...ls, fontSize: '13px', color: 'var(--muted-foreground)', marginTop: '4px', marginBottom: 0 }}>
                          Cliquez sur "Ajouter un pays" pour commencer
                        </p>
                      </div>
                    ) : (
                      <Collapse
                        defaultActiveKey={[selectedCountries[0]]}
                        expandIconPosition="end"
                        style={{ backgroundColor: 'transparent', border: 'none' }}
                        items={selectedCountries.map(countryCode => {
                          const countryLabel = getCountryLabel(countryCode);
                          return {
                            key: countryCode,
                            label: (
                              <div className="flex items-center justify-between pr-4" style={{ width: '100%' }}>
                                <div className="flex items-center gap-3">
                                  <CountryFlag code={countryCode} size={24} />
                                  <div>
                                    <h5
                                      className="m-0"
                                      style={{
                                        fontFamily: 'var(--font-family-display)',
                                        fontSize: 'var(--text-base)',
                                        fontWeight: 'var(--font-weight-semibold)',
                                        color: 'var(--foreground)',
                                      }}
                                    >
                                      {countryLabel}
                                    </h5>
                                    <p className="m-0" style={{ ...ls, fontSize: '12px', color: 'var(--muted-foreground)' }}>
                                      Configuration financiere locale
                                    </p>
                                  </div>
                                </div>
                                <Popconfirm
                                  title="Supprimer ce pays ?"
                                  description={
                                    <div>
                                      <p style={{ ...ls, marginBottom: '4px' }}>
                                        Êtes-vous sûr de vouloir supprimer {countryLabel} ?
                                      </p>
                                      <p style={{ ...ls, fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: 0 }}>
                                        Toutes les configurations associées seront perdues.
                                      </p>
                                    </div>
                                  }
                                  onConfirm={(event) => {
                                    event?.stopPropagation();
                                    handleRemoveCountry(countryCode);
                                  }}
                                  onCancel={(event) => event?.stopPropagation()}
                                  okText="Oui, supprimer"
                                  cancelText="Annuler"
                                  okButtonProps={{ danger: true }}
                                  disabled={readOnly}
                                >
                                  <Button
                                    danger
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={(event) => event.stopPropagation()}
                                    style={{ borderRadius: 'var(--radius-button)' }}
                                    disabled={readOnly}
                                  />
                                </Popconfirm>
                              </div>
                            ),
                            children: (
                              <div className="space-y-4 pt-2">
                                <div
                                  className="p-3 rounded-lg"
                                  style={{
                                    backgroundColor: 'rgba(54,67,186,0.04)',
                                    border: '1px solid rgba(54,67,186,0.12)',
                                  }}
                                >
                                  <p className="m-0" style={{ ...ls, fontSize: '13px', color: 'var(--muted-foreground)' }}>
                                    Ce pays est activé. Vous pouvez maintenant renseigner ses paramètres dans le bloc Finance & Spécificités locales.
                                  </p>
                                </div>
                              </div>
                            ),
                            style: {
                              marginBottom: '12px',
                              backgroundColor: 'var(--card)',
                              borderRadius: 'var(--radius)',
                              border: '1px solid var(--border)',
                              overflow: 'hidden',
                            },
                          };
                        })}
                      />
                    )}

                    {selectedCountries.length > 0 && availableOperationCountries.length > 0 && (
                      <Alert
                        title={<span style={ls}>Pays disponibles</span>}
                        description={
                          <span style={{ ...ls, fontWeight: 'var(--font-weight-normal)' as const }}>
                            Vous pouvez ajouter {availableOperationCountries.length} pays supplémentaires
                          </span>
                        }
                        type="info"
                        showIcon
                        style={{
                          backgroundColor: 'rgba(24,144,255,0.05)',
                          border: '1px solid rgba(24,144,255,0.12)',
                          borderRadius: 'var(--radius)',
                          marginTop: '16px',
                        }}
                      />
                    )}
                  </div>
                </div>
                  </>
                )}
              </section>

              <section id="finance" className="form-section mb-14">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <SectionBanner
                      index={3}
                      title="Finance & Spécificités locales"
                      description="Un accordéon par pays activé avec les paramètres AP"
                      sectionId="finance"
                    />
                  </div>
                  <SectionAccordionToggle sectionId="finance" />
                </div>

                {accordionOpen.finance && (
                  <>
                <Card
                  id="accordeons-pays"
                  title="Accordéons Fournisseur par pays"
                  subtitle="Contacts locaux, fiscalité et comptabilité"
                  icon={<DollarOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}
                >
                  {selectedCountries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12" style={{ opacity: 0.6 }}>
                      <GlobalOutlined style={{ fontSize: '46px', color: 'var(--muted-foreground)' }} />
                      <p style={{ ...ls, marginTop: '12px', marginBottom: 0, color: 'var(--muted-foreground)' }}>
                        Aucun pays activé
                      </p>
                      <p
                        style={{
                          ...ls,
                          fontSize: '13px',
                          marginTop: '4px',
                          marginBottom: 0,
                          fontWeight: 'var(--font-weight-normal)',
                          color: 'var(--muted-foreground)',
                        }}
                      >
                        Sélectionnez des pays dans le bloc Rôles & Périmètre.
                      </p>
                    </div>
                  ) : (
                    <Collapse
                      defaultActiveKey={[selectedCountries[0]]}
                      expandIconPosition="end"
                      style={{ backgroundColor: 'transparent', border: 'none' }}
                      items={selectedCountries.map(countryCode => {
                        const localComplete = isCountryFinanceComplete(countryCode);
                        const localPrefix = getLocalFieldName(countryCode, '');
                        return {
                          key: countryCode,
                          label: (
                            <div className="flex items-center justify-between pr-4" style={{ width: '100%' }}>
                              <div>
                                <h5
                                  className="m-0"
                                  style={{
                                    fontFamily: 'var(--font-family-display)',
                                    fontSize: 'var(--text-base)',
                                    fontWeight: 'var(--font-weight-semibold)',
                                    color: 'var(--foreground)',
                                  }}
                                >
                                  {getCountryLabel(countryCode)}
                                </h5>
                                <p
                                  className="m-0"
                                  style={{
                                    ...ls,
                                    fontSize: '12px',
                                    fontWeight: 'var(--font-weight-normal)',
                                    color: 'var(--muted-foreground)',
                                  }}
                                >
                                  IBAN: {displayedIban}
                                </p>
                              </div>
                              <Tag
                                style={{
                                  margin: 0,
                                  borderRadius: 'var(--radius-button)',
                                  border: `1px solid ${localComplete ? '#b7eb8f' : '#ffe58f'}`,
                                  backgroundColor: localComplete ? '#f6ffed' : '#fffbe6',
                                  color: localComplete ? '#389e0d' : '#d4b106',
                                  fontFamily: 'var(--font-family-text)',
                                  fontSize: '12px',
                                  fontWeight: 'var(--font-weight-medium)',
                                }}
                              >
                                {localComplete ? 'Complet' : 'À compléter'}
                              </Tag>
                            </div>
                          ),
                          children: (
                            <div className="p-5">
                              <div className="space-y-6">
                                <div>
                                  <h6
                                    className="m-0 mb-3"
                                    style={{
                                      fontFamily: 'var(--font-family-display)',
                                      fontSize: 'var(--text-base)',
                                      fontWeight: 'var(--font-weight-semibold)',
                                      color: 'var(--foreground)',
                                    }}
                                  >
                                    A. Contacts locaux
                                  </h6>
                                  <div className="grid grid-cols-2 gap-6">
                                    <Form.Item
                                      label={<span style={ls}>Email comptable {req}</span>}
                                      name={`${localPrefix}localAccountingEmail`}
                                      normalize={(value) => value?.toLowerCase()}
                                      rules={[{ required: true, message: 'Champ requis' }, { type: 'email', message: 'Email invalide' }]}
                                      className={fc(`${localPrefix}localAccountingEmail`)}
                                    >
                                      <Input size="large" placeholder="compta@societe.com" suffix={doneIcon(`${localPrefix}localAccountingEmail`)} />
                                    </Form.Item>
                                    <Form.Item
                                      label={<span style={ls}>Email business {req}</span>}
                                      name={`${localPrefix}localBusinessEmail`}
                                      normalize={(value) => value?.toLowerCase()}
                                      rules={[{ required: true, message: 'Champ requis' }, { type: 'email', message: 'Email invalide' }]}
                                      className={fc(`${localPrefix}localBusinessEmail`)}
                                    >
                                      <Input size="large" placeholder="business@societe.com" suffix={doneIcon(`${localPrefix}localBusinessEmail`)} />
                                    </Form.Item>
                                  </div>
                                  <div className="grid grid-cols-2 gap-6">
                                    <Form.Item
                                      label={<span style={ls}>Payment Name {req}</span>}
                                      name={`${localPrefix}localPaymentName`}
                                      rules={[{ required: true, message: 'Champ requis' }]}
                                      className={fc(`${localPrefix}localPaymentName`)}
                                    >
                                      <Input size="large" placeholder="Nom pour paiement" suffix={doneIcon(`${localPrefix}localPaymentName`)} />
                                    </Form.Item>
                                    <Form.Item label={<span style={ls}>Rappel IBAN</span>}>
                                      <Input size="large" value={displayedIban} readOnly />
                                    </Form.Item>
                                  </div>
                                </div>

                                <div>
                                  <h6
                                    className="m-0 mb-3"
                                    style={{
                                      fontFamily: 'var(--font-family-display)',
                                      fontSize: 'var(--text-base)',
                                      fontWeight: 'var(--font-weight-semibold)',
                                      color: 'var(--foreground)',
                                    }}
                                  >
                                    B. Paramètres Account Payable
                                  </h6>
                                  <div className="grid grid-cols-2 gap-6">
                                    <Form.Item
                                      label={<span style={ls}>Devise {req}</span>}
                                      name={`${localPrefix}localCurrency`}
                                      rules={[{ required: true, message: 'Champ requis' }]}
                                      className={fc(`${localPrefix}localCurrency`)}
                                    >
                                      <Select size="large" options={currencyOptions} placeholder="Sélectionnez" />
                                    </Form.Item>
                                    <Form.Item label={<span style={ls}>Conditions de paiement</span>} name={`${localPrefix}localPaymentTerms`}>
                                      <Input size="large" readOnly />
                                    </Form.Item>
                                  </div>
                                  <div className="grid grid-cols-2 gap-6">
                                    <Form.Item label={<span style={ls}>Mode de paiement</span>} name={`${localPrefix}localPaymentMode`}>
                                      <Input size="large" readOnly />
                                    </Form.Item>
                                    <Form.Item label={<span style={ls}>Lieu de paiement</span>} name={`${localPrefix}localPaymentPlace`}>
                                      <Input size="large" readOnly />
                                    </Form.Item>
                                  </div>
                                  <div className="grid grid-cols-2 gap-6">
                                    <Form.Item name={`${localPrefix}paymentBlocked`} valuePropName="checked">
                                      <Checkbox>Payment Blocked</Checkbox>
                                    </Form.Item>
                                    <Form.Item name={`${localPrefix}grirClearing`} valuePropName="checked">
                                      <Checkbox>GR/IR Clearing</Checkbox>
                                    </Form.Item>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <Form.Item label={<span style={ls}>VAT Type</span>} name={`${localPrefix}localVatType`}>
                                      <Input size="large" readOnly />
                                    </Form.Item>
                                    <Form.Item
                                      label={<span style={ls}>VAT Rate {req}</span>}
                                      name={`${localPrefix}localVatRate`}
                                      rules={[{ required: true, message: 'Champ requis' }]}
                                      className={fc(`${localPrefix}localVatRate`)}
                                    >
                                      <Select size="large" options={vatRateOptions} />
                                    </Form.Item>
                                    <Form.Item
                                      label={<span style={ls}>Withholding tax {req}</span>}
                                      name={`${localPrefix}localWithholdingTax`}
                                      rules={[{ required: true, message: 'Champ requis' }]}
                                      className={fc(`${localPrefix}localWithholdingTax`)}
                                    >
                                      <Select size="large" options={getWithholdingOptions(countryCode)} />
                                    </Form.Item>
                                  </div>
                                  <Form.Item
                                    label={<span style={ls}>GL Key {req}</span>}
                                    name={`${localPrefix}localGlKey`}
                                    rules={[{ required: true, message: 'Champ requis' }]}
                                    className={fc(`${localPrefix}localGlKey`)}
                                  >
                                    <Input size="large" placeholder="Ex: 409100" suffix={doneIcon(`${localPrefix}localGlKey`)} />
                                  </Form.Item>
                                </div>

                                {needsCustomsFields(countryCode) && (
                                  <div>
                                    <h6
                                      className="m-0 mb-3"
                                      style={{
                                        fontFamily: 'var(--font-family-display)',
                                        fontSize: 'var(--text-base)',
                                        fontWeight: 'var(--font-weight-semibold)',
                                        color: 'var(--foreground)',
                                      }}
                                    >
                                      C. Spécificités douanières
                                    </h6>
                                    <div className="grid grid-cols-2 gap-6">
                                      <Form.Item
                                        label={<span style={ls}>Code douanier</span>}
                                        name={`${localPrefix}customsCode`}
                                      >
                                        <Input size="large" placeholder="Ex: 85369010" />
                                      </Form.Item>
                                      <Form.Item
                                        label={<span style={ls}>Incoterm</span>}
                                        name={`${localPrefix}incoterm`}
                                      >
                                        <Input size="large" placeholder="Ex: DDP" />
                                      </Form.Item>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ),
                          style: {
                            marginBottom: '12px',
                            backgroundColor: 'var(--card)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            overflow: 'hidden',
                          },
                        };
                      })}
                    />
                  )}
                </Card>
                  </>
                )}
              </section>

              <section id="justificatifs" className="form-section mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <SectionBanner
                      index={4}
                      title="Justificatifs"
                      description="Pièces jointes de consolidation du dossier"
                      sectionId="justificatifs"
                    />
                  </div>
                  <SectionAccordionToggle sectionId="justificatifs" />
                </div>

                {accordionOpen.justificatifs && (
                  <>
                <Card
                  id="documents"
                  title="Pièces jointes"
                  subtitle="RIB, Kbis, documents légaux"
                  icon={<FileTextOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}
                >
                  <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ color: 'var(--primary)', fontSize: '42px' }} />
                    </p>
                    <p
                      style={{
                        ...ls,
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--foreground)',
                        margin: '10px 0 4px',
                      }}
                    >
                      Glissez-déposez vos fichiers ici
                    </p>
                    <p
                      style={{
                        ...ls,
                        color: 'var(--muted-foreground)',
                        margin: 0,
                        fontSize: '13px',
                        fontWeight: 'var(--font-weight-normal)',
                      }}
                    >
                      PDF, JPG, PNG, DOC, DOCX (max 10 MB)
                    </p>
                  </Dragger>
                  {files.length > 0 && (
                    <div
                      className="mt-4 p-3 rounded-lg flex items-center gap-2"
                      style={{
                        backgroundColor: 'rgba(82,196,26,0.06)',
                        border: '1px solid rgba(82,196,26,0.2)',
                      }}
                    >
                      <CheckCircleFilled style={{ color: '#52c41a', fontSize: '18px' }} />
                      <span style={{ ...ls, fontWeight: 'var(--font-weight-semibold)' }}>
                        {files.length} fichier(s) ajouté(s)
                      </span>
                    </div>
                  )}
                </Card>
                  </>
                )}
              </section>

              {canViewHistory && (
                <section id="historique-modifications" className="form-section mb-8">
                  <Card
                    id="historique-table"
                    title="Historique des modifications"
                    subtitle="Traçabilité des actions effectuées sur la fiche tiers"
                    icon={<FileTextOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}
                  >
                    {historyEntries.length === 0 ? (
                      <div
                        className="p-4 rounded-lg"
                        style={{
                          backgroundColor: 'var(--input-background)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <p
                          className="m-0"
                          style={{
                            ...ls,
                            fontWeight: 'var(--font-weight-normal)',
                            color: 'var(--muted-foreground)',
                          }}
                        >
                          Aucun historique disponible pour le moment.
                        </p>
                      </div>
                    ) : (
                      <div
                        style={{
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          className="grid px-4 py-3"
                          style={{
                            gridTemplateColumns: '120px 170px 110px 140px 1fr 1fr',
                            backgroundColor: 'var(--input-background)',
                            borderBottom: '1px solid var(--border)',
                          }}
                        >
                          {['Date', 'User', 'Action', 'Champ', 'Ancienne Valeur', 'Nouvelle Valeur'].map(column => (
                            <span
                              key={column}
                              style={{
                                ...ls,
                                fontSize: '12px',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--muted-foreground)',
                              }}
                            >
                              {column}
                            </span>
                          ))}
                        </div>

                        {historyEntries.map((entry, index) => {
                          const sensitiveField = isSensitiveHistoryField(entry.field);
                          const oldValue = maskHistoryValue(entry.field, entry.oldValue);
                          const newValue = maskHistoryValue(entry.field, entry.newValue);
                          const actionColor =
                            entry.action === 'Validate'
                              ? '#389E0D'
                              : entry.action === 'Reject'
                              ? '#CF1322'
                              : '#3643ba';

                          return (
                            <div
                              key={entry.id}
                              className="grid px-4 py-3 items-center"
                              style={{
                                gridTemplateColumns: '120px 170px 110px 140px 1fr 1fr',
                                borderBottom: index === historyEntries.length - 1 ? 'none' : '1px solid var(--border)',
                              }}
                            >
                              <span style={{ ...ls, fontSize: '13px', color: 'var(--foreground)' }}>{entry.date}</span>
                              <span style={{ ...ls, fontSize: '13px', color: 'var(--foreground)' }}>{entry.user}</span>
                              <span
                                className="px-2 py-0.5 rounded inline-flex items-center w-fit"
                                style={{
                                  backgroundColor: `${actionColor}14`,
                                  border: `1px solid ${actionColor}33`,
                                  ...ls,
                                  fontSize: '12px',
                                  fontWeight: 'var(--font-weight-medium)',
                                  color: actionColor,
                                }}
                              >
                                {entry.action}
                              </span>
                              <span style={{ ...ls, fontSize: '13px', color: 'var(--foreground)' }}>{entry.field}</span>
                              <span
                                style={{
                                  ...ls,
                                  fontSize: '13px',
                                  color: sensitiveField ? 'var(--muted-foreground)' : 'var(--foreground)',
                                  fontFamily: sensitiveField ? 'var(--font-family-display)' : 'var(--font-family-text)',
                                }}
                              >
                                {oldValue}
                              </span>
                              <span
                                style={{
                                  ...ls,
                                  fontSize: '13px',
                                  color: sensitiveField ? 'var(--muted-foreground)' : 'var(--foreground)',
                                  fontFamily: sensitiveField ? 'var(--font-family-display)' : 'var(--font-family-text)',
                                }}
                              >
                                {newValue}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                </section>
              )}
            </Form>

            <div
              className="flex items-center justify-between pt-5 pb-6 mt-10 sticky bottom-0"
              style={{ backgroundColor: '#f6f6f5', borderTop: '1px solid var(--border)' }}
            >
              {canShowClientLink ? (
                <button
                  onClick={() => navigate(`/clients/new?tierId=${tierId}`)}
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
                  Aller vers la fiche Client
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3 ml-auto">
                {canValidateBusiness && (
                  <>
                    <button
                      onClick={() => handleBusinessValidation('Validate')}
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
                      onClick={() => handleBusinessValidation('Reject')}
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

                {canValidateTreasury && (
                  <>
                    <button
                      onClick={() => handleTreasuryValidation('Validate')}
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
                      Approuver BANK_WALLET
                    </button>
                    <button
                      onClick={() => handleTreasuryValidation('Reject')}
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
                      Rejeter BANK_WALLET
                    </button>
                  </>
                )}

                {canEditTier && (
                  <>
                    <button
                      onClick={handleSaveDraft}
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
                      Save as Draft
                    </button>
                    <button
                      onClick={handleSubmit}
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
                      Submit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Modal
        title="Ajouter un pays d'opération"
        open={isCountryModalOpen}
        onOk={handleAddCountry}
        onCancel={() => {
          setIsCountryModalOpen(false);
          setCountryToAdd(null);
        }}
        okText="Ajouter"
        cancelText="Annuler"
        style={{ top: 20 }}
      >
        <p style={{ ...ls, color: 'var(--foreground)' }}>Veuillez sélectionner le pays que vous souhaitez ajouter :</p>
        <Select
          placeholder="Sélectionnez un pays"
          size="large"
          showSearch
          filterOption={countryOptionFilter}
          value={countryToAdd}
          onChange={value => setCountryToAdd(value)}
          options={availableOperationCountries}
          style={{ width: '100%' }}
        />
      </Modal>

      <Modal
        title="Ajouter une banque"
        open={bankModalOpen}
        onOk={handleCreateBank}
        onCancel={() => {
          setBankModalOpen(false);
          setNewBankName('');
        }}
        okText="Ajouter"
        cancelText="Annuler"
      >
        <div className="space-y-4">
          <Form layout="vertical">
            <Form.Item label="Nom de la banque">
              <Input
                value={newBankName}
                onChange={event => setNewBankName(event.target.value)}
                placeholder="Ex: Credit Agricole"
              />
            </Form.Item>
            <Form.Item label="Pays banque">
              <Select value={newBankCountry} onChange={setNewBankCountry} options={countryOptions} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
}


