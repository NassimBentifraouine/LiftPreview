import { Form, Input, Select, Switch, Checkbox, Button, Upload, App, Alert, Tag, Tooltip, Collapse, Modal, Popconfirm } from 'antd';
import { InboxOutlined, CheckCircleOutlined, InfoCircleOutlined, UserOutlined, SafetyOutlined, HomeOutlined, PhoneOutlined, MailOutlined, DollarOutlined, FileTextOutlined, FolderOpenOutlined, LockOutlined, CheckCircleFilled, BankOutlined, GlobalOutlined, DeleteOutlined } from '@ant-design/icons';
import { motion } from 'motion/react';
import type { FormSection } from './types';
import { useState, useRef, useCallback, type ReactNode } from 'react';
import DktIcon from './DktIcon';
import { COUNTRY_FLAG_FONT_FAMILY, getCountryFlagFromCode } from './countryUtils';

const { TextArea } = Input;
const { Dragger } = Upload;

const countryCatalog = [
  { value: 'FR', name: 'France' },
  { value: 'BE', name: 'Belgique' },
  { value: 'ES', name: 'Espagne' },
  { value: 'DE', name: 'Allemagne' },
  { value: 'IT', name: 'Italie' },
  { value: 'GB', name: 'Royaume-Uni' },
  { value: 'NL', name: 'Pays-Bas' },
  { value: 'PT', name: 'Portugal' },
  { value: 'PL', name: 'Pologne' },
  { value: 'CH', name: 'Suisse' },
  { value: 'LU', name: 'Luxembourg' },
  { value: 'AT', name: 'Autriche' },
  { value: 'DK', name: 'Danemark' },
  { value: 'SE', name: 'Suede' },
  { value: 'NO', name: 'Norvege' },
  { value: 'FI', name: 'Finlande' },
  { value: 'IE', name: 'Irlande' },
  { value: 'GR', name: 'Grece' },
];

const paysOptions = countryCatalog.map((country) => ({
  value: country.value,
  name: country.name,
  searchLabel: country.name.toLowerCase(),
  label: (
    <span className="inline-flex items-center gap-1.5">
      <span style={{ fontFamily: COUNTRY_FLAG_FONT_FAMILY }}>{getCountryFlagFromCode(country.value)}</span>
      <span>{country.name}</span>
    </span>
  ),
}));

const countryOptionFilter = (input: string, option?: any) =>
  ((option?.searchLabel || '').toLowerCase().includes(input.toLowerCase()));

const typeClientOptions = [
  { value: 'b2c', label: 'B2C' },
  { value: 'clubs', label: 'Clubs & Entities' },
  { value: 'franchise', label: 'Franchise' },
  { value: 'reseller', label: 'Reseller' },
  { value: 'factory', label: 'Factory' },
  { value: 'interco', label: 'Interco' },
];

const customerGroupOptions = [
  { value: 'premium', label: 'Premium' },
  { value: 'standard', label: 'Standard' },
  { value: 'vip', label: 'VIP' },
];

const natureOptions = [
  { value: 'retail', label: 'Commerce de dÃ©tail' },
  { value: 'wholesale', label: 'Commerce de gros' },
  { value: 'manufacturer', label: 'Fabricant' },
  { value: 'services', label: 'Services' },
];

const deviseOptions = [
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dollar (USD)' },
  { value: 'GBP', label: 'Livre Sterling (GBP)' },
  { value: 'CHF', label: 'Franc Suisse (CHF)' },
  { value: 'NOK', label: 'Couronne Norvegienne (NOK)' },
  { value: 'SEK', label: 'Couronne Suedoise (SEK)' },
  { value: 'DKK', label: 'Couronne Danoise (DKK)' },
];

const vatRateOptions = [
  { value: '20', label: '20%' },
  { value: '10', label: '10%' },
  { value: '5.5', label: '5.5%' },
  { value: '2.1', label: '2.1%' },
];

const statusTVAOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'reduced', label: 'RÃ©duit' },
  { value: 'exempt', label: 'ExonÃ©rÃ©' },
  { value: 'reverse_charge', label: 'Autoliquidation' },
];

const modePaiementOptions = [
  { value: 'virement', label: 'Virement bancaire' },
  { value: 'prelevement', label: 'PrÃ©lÃ¨vement' },
  { value: 'cheque', label: 'ChÃ¨que' },
  { value: 'carte', label: 'Carte bancaire' },
];

const delaiPaiementOptions = [
  { value: '15', label: '15 jours' },
  { value: '30', label: '30 jours' },
  { value: '45', label: '45 jours' },
  { value: '60', label: '60 jours' },
];

interface ClientFormProps {
  sections: FormSection[];
  completedFields: Set<string>;
  touchedFields: Set<string>;
  onFieldComplete: (fieldName: string, isComplete: boolean) => void;
  onFieldTouch: (fieldName: string) => void;
  onAccountReceivableChange: (hasAR: boolean) => void;
}

export default function ClientForm({
  sections,
  completedFields,
  touchedFields,
  onFieldComplete,
  onFieldTouch,
  onAccountReceivableChange,
}: ClientFormProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [filesByType, setFilesByType] = useState<Record<string, any[]>>({});
  const [customerId, setCustomerId] = useState<string>('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [countryToAdd, setCountryToAdd] = useState<string | null>(null);
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({
    identite: true,
    finance: true,
    justificatifs: true,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate auto customer ID on mount
  useState(() => {
    const id = `${Math.floor(Math.random() * 10000000) + 10000000}`;
    setCustomerId(id);
  });

  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    onFieldTouch(fieldName);
    const isComplete = value !== undefined && value !== null && value !== '';
    if (Array.isArray(value)) onFieldComplete(fieldName, value.length > 0);
    else if (typeof value === 'boolean') onFieldComplete(fieldName, true);
    else onFieldComplete(fieldName, isComplete);
  }, [onFieldComplete, onFieldTouch]);

  const handleUploadChange = (info: any) => {
    setFilesByType({ documents: info.fileList });
    handleFieldChange('documents', info.fileList);
  };

  const handleFormValuesChange = useCallback((changedValues: any) => {
    // Debounce field tracking to avoid re-renders on every keystroke
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      Object.keys(changedValues).forEach(fieldName => {
        const value = changedValues[fieldName];
        handleFieldChange(fieldName, value);
      });
    }, 300);
  }, [handleFieldChange]);

  const uploadProps = {
    name: 'file',
    multiple: true,
    fileList: filesByType.documents || [],
    onChange: handleUploadChange,
    beforeUpload: () => false as const,
    accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  };

  const fc = (fieldName: string) => {
    if (completedFields.has(fieldName)) return 'field-completed';
    if (touchedFields.has(fieldName)) return 'field-touched';
    return '';
  };

  const doneIcon = (fieldName: string) =>
    completedFields.has(fieldName) ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : undefined;

  // â”€â”€ Shared styles â”€â”€
  const ls = { fontFamily: 'var(--font-family-text)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-medium)' as const };
  const req = <span style={{ color: 'var(--destructive)', marginLeft: '2px' }}>*</span>;

  // â”€â”€ Card wrapper â”€â”€
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
          <h4 className="m-0" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: '1.3' }}>
            {title}
          </h4>
          {subtitle && (
            <p className="m-0" style={{ fontFamily: 'var(--font-family-text)', fontSize: '13px', color: 'var(--muted-foreground)', lineHeight: '1.3', marginTop: '1px' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  // â”€â”€ Section header (the big numbered badge) â”€â”€
  const getSectionStats = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return { done: 0, total: 0, pct: 0 };
    const all = section.subsections.flatMap(s => s.fields);
    const done = all.filter(f => completedFields.has(f)).length;
    return { done, total: all.length, pct: all.length > 0 ? Math.round((done / all.length) * 100) : 0 };
  };

  const SectionBanner = ({ index, title, description, sectionId }: { index: number; title: string; description: string; sectionId: string }) => {
    const stats = getSectionStats(sectionId);
    const isComplete = stats.pct === 100;
    return (
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style={{ backgroundColor: isComplete ? '#52c41a' : 'var(--primary)', boxShadow: isComplete ? '0 2px 8px rgba(82,196,26,0.3)' : '0 2px 8px rgba(54,67,186,0.25)', transition: 'all 0.3s ease' }}
        >
          {isComplete ? (
            <CheckCircleFilled style={{ fontSize: '18px', color: 'white' }} />
          ) : (
            <span style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'white' }}>
              {index}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="m-0" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: '1.2' }}>
              {title}
            </h3>
            {/* Field counter pill */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full shrink-0"
              style={{
                backgroundColor: isComplete ? 'rgba(82,196,26,0.08)' : 'rgba(54,67,186,0.06)',
                border: `1px solid ${isComplete ? 'rgba(82,196,26,0.2)' : 'rgba(54,67,186,0.12)'}`,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-family-text)', fontSize: '12px',
                fontWeight: 'var(--font-weight-semibold)',
                color: isComplete ? '#52c41a' : 'var(--primary)',
              }}>
                {stats.done}/{stats.total}
              </span>
              {/* Mini inline bar */}
              <div style={{ width: '32px', height: '3px', borderRadius: '2px', backgroundColor: isComplete ? 'rgba(82,196,26,0.15)' : 'rgba(54,67,186,0.1)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stats.pct}%`, borderRadius: '2px', backgroundColor: isComplete ? '#52c41a' : 'var(--primary)', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          </div>
          <p className="m-0" style={{ fontFamily: 'var(--font-family-text)', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', lineHeight: '1.4' }}>
            {description}
          </p>
        </div>
      </div>
    );
  };

  const toggleAccordionSection = (sectionId: 'identite' | 'finance' | 'justificatifs') => {
    setAccordionOpen(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const SectionAccordionToggle = ({ sectionId }: { sectionId: 'identite' | 'finance' | 'justificatifs' }) => (
    <button
      onClick={() => toggleAccordionSection(sectionId)}
      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
      style={{
        border: '1px solid var(--border)',
        backgroundColor: 'var(--card)',
        cursor: 'pointer',
        marginTop: '6px',
      }}
      title={accordionOpen[sectionId] ? 'RÃ©duire' : 'DÃ©plier'}
    >
      <DktIcon
        name={accordionOpen[sectionId] ? 'chevron-up' : 'chevron-down'}
        size={16}
        color="var(--muted-foreground)"
      />
    </button>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      autoComplete="off"
      requiredMark={false}
      className="client-form"
      initialValues={{ assujettTVA: true, delaiPaiement: '45', accountReceivable: true }}
      onValuesChange={handleFormValuesChange}
    >
      {/* â•â•â•â•â•â•â•â•â•â• HEADER - ID CLIENT â•â•â•â•â•â•â•â•â•â• */}
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
            <div style={{ ...ls, fontSize: '12px', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ID Client LIFT
            </div>
            <div style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
              {customerId || 'â€”'}
            </div>
          </div>
        </div>
        <Tag color="green" style={{ margin: 0, padding: '6px 14px', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-family-text)', borderRadius: 'var(--radius-button)', border: 'none' }}>
          Auto-gÃ©nÃ©rÃ©
        </Tag>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â• BLOC 1 : IDENTITÃ‰ LÃ‰GALE & COMMERCIALE â•â•â•â•â•â•â•â•â•â• */}
      <section id="identite" className="form-section mb-14">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <SectionBanner index={1} title="IdentitÃ© LÃ©gale & Commerciale" description="Informations lÃ©gales et commerciales du client" sectionId="identite" />
          </div>
          <SectionAccordionToggle sectionId="identite" />
        </div>

        {accordionOpen.identite && (
          <>
        <Card id="identite-generale" title="IdentitÃ© GÃ©nÃ©rale" subtitle="Raison sociale et classification" icon={<UserOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}>
          <div className="space-y-6">
            <Form.Item label={<span style={ls}>Raison Sociale {req}</span>} name="raisonSociale" rules={[{ required: true, message: 'Champ requis' }]} className={fc('raisonSociale')}>
              <Input placeholder="Ex: DECATHLON FRANCE SAS" size="large" suffix={doneIcon('raisonSociale')} />
            </Form.Item>
            <div className="grid grid-cols-2 gap-6">
              <Form.Item label={<span style={ls}>Pays d'immatriculation {req}</span>} name="paysImmatriculation" rules={[{ required: true, message: 'Champ requis' }]} className={fc('paysImmatriculation')}>
                <Select placeholder="SÃ©lectionnez un pays" size="large" showSearch filterOption={countryOptionFilter} options={paysOptions} />
              </Form.Item>
              <Form.Item label={<span style={ls}>Customer Group {req}</span>} name="customerGroup" rules={[{ required: true, message: 'Champ requis' }]} className={fc('customerGroup')}>
                <Select placeholder="SÃ©lectionnez" size="large" options={customerGroupOptions} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Form.Item label={<span style={ls}>Type de Client {req}</span>} name="typeClient" rules={[{ required: true, message: 'Champ requis' }]} className={fc('typeClient')}>
                <Select placeholder="SÃ©lectionnez" size="large" options={typeClientOptions} />
              </Form.Item>
              <Form.Item label={<span style={ls}>Nature (ActivitÃ©) {req}</span>} name="nature" rules={[{ required: true, message: 'Champ requis' }]} className={fc('nature')}>
                <Select placeholder="SÃ©lectionnez" size="large" options={natureOptions} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Form.Item label={<span style={ls}>TÃ©lÃ©phone principal {req}</span>} name="telephone" rules={[{ required: true, message: 'Champ requis' }]} className={fc('telephone')}>
                <Input placeholder="+33 6 12 34 56 78" size="large" prefix={<PhoneOutlined style={{ color: 'var(--muted-foreground)' }} />} suffix={doneIcon('telephone')} />
              </Form.Item>
              <Form.Item label={<span style={ls}>Email client {req}</span>} name="email" normalize={(value) => value?.toLowerCase()} rules={[{ required: true, message: 'Champ requis' }, { type: 'email', message: 'Email invalide' }]} className={fc('email')}>
                <Input placeholder="contact@entreprise.fr" size="large" type="email" prefix={<MailOutlined style={{ color: 'var(--muted-foreground)' }} />} suffix={doneIcon('email')} />
              </Form.Item>
            </div>
          </div>
        </Card>

        <Card id="identifiants-fiscaux" title="Identifiants Fiscaux" subtitle="NumÃ©ros fiscaux et lÃ©gaux" icon={<SafetyOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-3" style={{ ...ls, color: 'var(--foreground)' }}>Assujetti Ã  la TVA {req}</label>
                <Form.Item name="assujettTVA" valuePropName="checked" className={fc('assujettTVA')} style={{ marginBottom: 0 }}>
                  <Switch checkedChildren="Oui" unCheckedChildren="Non" />
                </Form.Item>
              </div>
              <Form.Item label={<span style={ls}>Legal ID (SIREN, etc.) {req}</span>} name="legalId" rules={[{ required: true, message: 'Champ requis' }]} className={fc('legalId')} style={{ marginBottom: 0 }} extra={<span style={{ ...ls, color: 'var(--muted-foreground)', fontSize: '12px' }}>Format selon le pays d'immatriculation</span>}>
                <Input placeholder="Ex: 310 762 904" size="large" suffix={doneIcon('legalId')} />
              </Form.Item>
            </div>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.assujettTVA !== cur.assujettTVA}>
              {({ getFieldValue }) =>
                getFieldValue('assujettTVA') ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <Form.Item label={<span style={ls}>NumÃ©ro de TVA intracommunautaire {req}</span>} name="numeroTVA" normalize={(value) => value?.toUpperCase()} rules={[{ required: true, message: 'Champ requis' }]} className={fc('numeroTVA')} extra={<span style={{ ...ls, color: 'var(--muted-foreground)' }}>ContrÃ´le API VIES pour les pays de l'UE</span>}>
                      <Input placeholder="Ex: FR12345678901" size="large" suffix={doneIcon('numeroTVA')} />
                    </Form.Item>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <Form.Item label={<span style={ls}>NÂ° d'inscription au journal officiel {req}</span>} name="numeroInscription" rules={[{ required: true, message: 'Champ requis' }]} className={fc('numeroInscription')}>
                      <Input placeholder="NumÃ©ro d'inscription" size="large" suffix={doneIcon('numeroInscription')} />
                    </Form.Item>
                  </motion.div>
                )
              }
            </Form.Item>
          </div>
        </Card>

        <Card id="adresse-principale" title="Adresse Principale" subtitle="Adresse du siÃ¨ge social" icon={<HomeOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}>
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Form.Item label={<span style={ls}>NÂ° Rue {req}</span>} name="adresseNumero" rules={[{ required: true, message: 'Requis' }]} className={fc('adresseNumero')}>
                <Input placeholder="123" size="large" suffix={doneIcon('adresseNumero')} />
              </Form.Item>
              <Form.Item label={<span style={ls}>Voie {req}</span>} name="adresseVoie" rules={[{ required: true, message: 'Requis' }]} className={`${fc('adresseVoie')} col-span-3`}>
                <Input placeholder="Rue de la RÃ©publique" size="large" suffix={doneIcon('adresseVoie')} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Form.Item label={<span style={ls}>Code Postal {req}</span>} name="adresseCP" rules={[{ required: true, message: 'Requis' }]} className={fc('adresseCP')}>
                <Input placeholder="75001" size="large" suffix={doneIcon('adresseCP')} />
              </Form.Item>
              <Form.Item label={<span style={ls}>Ville {req}</span>} name="adresseVille" rules={[{ required: true, message: 'Requis' }]} className={fc('adresseVille')}>
                <Input placeholder="Paris" size="large" suffix={doneIcon('adresseVille')} />
              </Form.Item>
            </div>
            
            {/* OK/KO ICO */}
            <Alert
              title={<span style={ls}>VÃ©rification ICO (Intra-Community Operator)</span>}
              description={
                <div className="flex items-center gap-3 mt-2">
                  <Form.Item name="icoStatus" style={{ marginBottom: 0 }}>
                    <Select
                      placeholder="Statut de vÃ©rification"
                      size="large"
                      style={{ width: '200px' }}
                      options={[
                        { value: 'ok', label: 'âœ“ OK - VÃ©rifiÃ©' },
                        { value: 'ko', label: 'âœ— KO - Non vÃ©rifiÃ©' },
                        { value: 'pending', label: 'â³ En attente' },
                      ]}
                    />
                  </Form.Item>
                  <span style={{ ...ls, color: 'var(--muted-foreground)', fontSize: '13px' }}>
                    Statut de vÃ©rification ICO auprÃ¨s des autoritÃ©s
                  </span>
                </div>
              }
              type="info"
              showIcon
              style={{ backgroundColor: 'rgba(24,144,255,0.05)', border: '1px solid rgba(24,144,255,0.12)', borderRadius: 'var(--radius)' }}
            />
          </div>
        </Card>

        <Card id="adresse-livraison" title="Adresse de Livraison" subtitle="Lieu de livraison des marchandises" icon={<GlobalOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}>
          <div className="space-y-6">
            <Form.Item label={<span style={ls}>Identifiant de livraison</span>} name="identifiantLivraison" className={fc('identifiantLivraison')} extra={<span style={{ ...ls, color: 'var(--muted-foreground)' }}>NÂ° TVA du lieu de livraison (si diffÃ©rent)</span>}>
              <Input placeholder="NÂ° TVA du lieu de livraison" size="large" suffix={doneIcon('identifiantLivraison')} />
            </Form.Item>
            <Form.Item name="adresseLivraisonDifferente" valuePropName="checked" className={fc('adresseLivraisonDifferente')}>
              <Checkbox>
                <span style={ls}>L'adresse de livraison est diffÃ©rente de l'adresse principale</span>
              </Checkbox>
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.adresseLivraisonDifferente !== cur.adresseLivraisonDifferente}>
              {({ getFieldValue }) =>
                getFieldValue('adresseLivraisonDifferente') ? (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-lg" style={{ backgroundColor: 'rgba(255,205,78,0.05)', border: '1px dashed var(--accent)' }}>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <Form.Item label={<span style={ls}>NÂ° Rue {req}</span>} name="livraisonNumero" rules={[{ required: true, message: 'Requis' }]} className={fc('livraisonNumero')}>
                        <Input placeholder="123" size="large" suffix={doneIcon('livraisonNumero')} />
                      </Form.Item>
                      <Form.Item label={<span style={ls}>Voie {req}</span>} name="livraisonVoie" rules={[{ required: true, message: 'Requis' }]} className={`${fc('livraisonVoie')} col-span-3`}>
                        <Input placeholder="Rue de la Livraison" size="large" suffix={doneIcon('livraisonVoie')} />
                      </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <Form.Item label={<span style={ls}>Code Postal {req}</span>} name="livraisonCP" rules={[{ required: true, message: 'Requis' }]} className={fc('livraisonCP')}>
                        <Input placeholder="75001" size="large" suffix={doneIcon('livraisonCP')} />
                      </Form.Item>
                      <Form.Item label={<span style={ls}>Ville {req}</span>} name="livraisonVille" rules={[{ required: true, message: 'Requis' }]} className={fc('livraisonVille')}>
                        <Input placeholder="Paris" size="large" suffix={doneIcon('livraisonVille')} />
                      </Form.Item>
                    </div>
                  </motion.div>
                ) : null
              }
            </Form.Item>
          </div>
        </Card>
          </>
        )}
      </section>

      {/* â•â•â•â•â•â•â•â•â•â• BLOC 2 : PARAMÃˆTRES FINANCIERS & COMPTABLES â•â•â•â•â•â•â•â•â•â• */}
      <section id="finance" className="form-section mb-14">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <SectionBanner index={2} title="ParamÃ¨tres Financiers & Comptables" description="Configuration financiÃ¨re et comptable" sectionId="finance" />
          </div>
          <SectionAccordionToggle sectionId="finance" />
        </div>

        {accordionOpen.finance && (
          <>
        <Card id="entite-facturante" title="EntitÃ© Facturante" subtitle="Informations de facturation" icon={<BankOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Form.Item label={<span style={ls}>Pays Facturant {req}</span>} name="paysFacturant" rules={[{ required: true, message: 'Champ requis' }]} className={fc('paysFacturant')} extra={<span style={{ ...ls, color: 'var(--muted-foreground)', fontSize: '12px' }}>Remplace la notion E-one Environment</span>}>
                <Select placeholder="SÃ©lectionnez le pays" size="large" showSearch filterOption={countryOptionFilter} options={paysOptions} />
              </Form.Item>
              <Form.Item label={<span style={ls}>Ship From (Tax ID Pays Client)</span>} name="shipFrom" normalize={(value) => value?.toUpperCase()} className={fc('shipFrom')} extra={<span style={{ ...ls, color: 'var(--muted-foreground)', fontSize: '12px' }}>Identifiant fiscal du pays d'expÃ©dition</span>}>
                <Input placeholder="Tax ID pays du client" size="large" suffix={doneIcon('shipFrom')} />
              </Form.Item>
            </div>
            
            <Form.Item label={<span style={ls}>Nom de l'entitÃ© facturante {req}</span>} name="nomEntiteFacturante" rules={[{ required: true, message: 'Champ requis' }]} className={fc('nomEntiteFacturante')}>
              <Input placeholder="Nom de l'entitÃ©" size="large" suffix={doneIcon('nomEntiteFacturante')} />
            </Form.Item>
            
            <Alert
              title={<span style={ls}>Adresse structurÃ©e de l'entitÃ© facturante</span>}
              description={<span style={{ ...ls, fontWeight: 'var(--font-weight-normal)' as const }}>Saisissez l'adresse complÃ¨te avec des champs sÃ©parÃ©s (finies les Address Line 1, 2, 3)</span>}
              type="info"
              showIcon
              style={{ backgroundColor: 'rgba(24,144,255,0.05)', border: '1px solid rgba(24,144,255,0.12)', borderRadius: 'var(--radius)' }}
            />

            <div className="grid grid-cols-4 gap-4">
              <Form.Item label={<span style={ls}>NÂ° {req}</span>} name="facturantNumero" rules={[{ required: true, message: 'Requis' }]} className={fc('facturantNumero')}>
                <Input placeholder="123" size="large" suffix={doneIcon('facturantNumero')} />
              </Form.Item>
              <Form.Item label={<span style={ls}>Voie {req}</span>} name="facturantVoie" rules={[{ required: true, message: 'Requis' }]} className={`${fc('facturantVoie')} col-span-3`}>
                <Input placeholder="Rue de Commerce" size="large" suffix={doneIcon('facturantVoie')} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Form.Item label={<span style={ls}>Code Postal {req}</span>} name="facturantCP" rules={[{ required: true, message: 'Requis' }]} className={fc('facturantCP')}>
                <Input placeholder="75001" size="large" suffix={doneIcon('facturantCP')} />
              </Form.Item>
              <Form.Item label={<span style={ls}>Ville {req}</span>} name="facturantVille" rules={[{ required: true, message: 'Requis' }]} className={fc('facturantVille')}>
                <Input placeholder="Paris" size="large" suffix={doneIcon('facturantVille')} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Form.Item label={<span style={ls}>TÃ©lÃ©phone local</span>} name="telephoneLocal" className={fc('telephoneLocal')}>
                <Input placeholder="+33 6 12 34 56 78" size="large" prefix={<PhoneOutlined style={{ color: 'var(--muted-foreground)' }} />} suffix={doneIcon('telephoneLocal')} />
              </Form.Item>
              <Form.Item label={<span style={ls}>Email facturation/compta {req}</span>} name="emailFacturation" normalize={(value) => value?.toLowerCase()} rules={[{ required: true, message: 'Champ requis' }, { type: 'email', message: 'Email invalide' }]} className={fc('emailFacturation')} extra={<span style={{ ...ls, color: 'var(--muted-foreground)', fontSize: '12px' }}>Obligatoire pour la facturation Ã©lectronique</span>}>
                <Input placeholder="facturation@entreprise.fr" size="large" type="email" prefix={<MailOutlined style={{ color: 'var(--muted-foreground)' }} />} suffix={doneIcon('emailFacturation')} />
              </Form.Item>
            </div>
          </div>
        </Card>

        <Card id="parametres-comptables" title="ParamÃ¨tres Comptables" subtitle="Configuration comptable et de paiement" icon={<DollarOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}>
          <div className="space-y-6">
            <Form.Item name="accountReceivable" valuePropName="checked" className={fc('accountReceivable')}>
              <Checkbox onChange={(e) => { handleFieldChange('accountReceivable', e.target.checked); onAccountReceivableChange(e.target.checked); }}>
                <div className="flex items-center gap-2">
                  <span style={{ ...ls, fontWeight: 'var(--font-weight-semibold)' as const }}>Account Receivable</span>
                  <Tooltip title="S'affiche uniquement si c'est aussi un Fournisseur">
                    <InfoCircleOutlined style={{ fontSize: '13px', color: 'var(--muted-foreground)' }} />
                  </Tooltip>
                </div>
              </Checkbox>
            </Form.Item>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item label={<span style={ls}>Devise {req}</span>} name="devise" rules={[{ required: true, message: 'Champ requis' }]} className={fc('devise')} extra={<span style={{ ...ls, color: 'var(--muted-foreground)', fontSize: '12px' }}>PossibilitÃ© d'en avoir plusieurs pour 1 environnement</span>}>
                <Select placeholder="SÃ©lectionnez" size="large" options={deviseOptions} />
              </Form.Item>
              <Form.Item label={<span style={ls}>Taux de TVA {req}</span>} name="tauxTVA" rules={[{ required: true, message: 'Champ requis' }]} className={fc('tauxTVA')}>
                <Select placeholder="SÃ©lectionnez" size="large" options={vatRateOptions} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Form.Item label={<span style={ls}>Status de TVA {req}</span>} name="statusTVA" rules={[{ required: true, message: 'Champ requis' }]} className={fc('statusTVA')}>
                <Select placeholder="SÃ©lectionnez" size="large" options={statusTVAOptions} />
              </Form.Item>
              <Form.Item label={<span style={ls}>Mode de Paiement du client {req}</span>} name="modePaiement" rules={[{ required: true, message: 'Champ requis' }]} className={fc('modePaiement')}>
                <Select placeholder="SÃ©lectionnez" size="large" options={modePaiementOptions} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Form.Item label={<span style={ls}>DÃ©lai de paiement du client {req}</span>} name="delaiPaiement" rules={[{ required: true, message: 'Champ requis' }]} className={fc('delaiPaiement')} extra={<span style={{ ...ls, color: 'var(--muted-foreground)', fontSize: '12px' }}>45 jours par dÃ©faut, modifiable</span>}>
                <Select placeholder="SÃ©lectionnez" size="large" options={delaiPaiementOptions} />
              </Form.Item>
              <Form.Item label={<span style={ls}>ClÃ© comptable (GL Key)</span>} name="glKey" className={fc('glKey')} extra={<span style={{ ...ls, color: 'var(--muted-foreground)', fontSize: '12px' }}>Optionnel, Ã  valider par le mÃ©tier</span>}>
                <Input placeholder="ClÃ© comptable" size="large" suffix={doneIcon('glKey')} />
              </Form.Item>
            </div>
          </div>
        </Card>

        {/* Carte d'ajout de pays d'opÃ©ration */}
        <div
          className="mb-5"
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
                <h4 className="m-0" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)', lineHeight: '1.3' }}>
                  Pays d'OpÃ©ration
                </h4>
                <p className="m-0" style={{ fontFamily: 'var(--font-family-text)', fontSize: '13px', color: 'var(--muted-foreground)', lineHeight: '1.3', marginTop: '1px' }}>
                  Ajoutez et configurez les pays d'opÃ©ration
                </p>
              </div>
            </div>
            <Button 
              type="primary" 
              icon={<GlobalOutlined />}
              onClick={() => {
                const availableCountries = paysOptions.filter(p => !selectedCountries.includes(p.value));
                if (availableCountries.length > 0) {
                  setCountryToAdd(availableCountries[0].value);
                  setIsCountryModalOpen(true);
                }
              }}
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
                  Aucun pays configurÃ©
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
                items={selectedCountries.map((countryCode) => {
                  const country = paysOptions.find(p => p.value === countryCode);
                  if (!country) return null;
                  
                  return {
                    key: countryCode,
                    label: (
                      <div className="flex items-center justify-between pr-4" style={{ width: '100%' }}>
                        <div className="flex items-center gap-3">
                          <span style={{ fontSize: '28px' }}>{getCountryFlagFromCode(country.value)}</span>
                          <div>
                            <h5 className="m-0" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--foreground)' }}>
                              {country.name}
                            </h5>
                            <p className="m-0" style={{ ...ls, fontSize: '12px', color: 'var(--muted-foreground)' }}>
                              Configuration financiÃ¨re locale
                            </p>
                          </div>
                        </div>
                        <Popconfirm
                          title="Supprimer ce pays ?"
                          description={
                            <div>
                              <p style={{ ...ls, marginBottom: '4px' }}>Etes-vous sur de vouloir supprimer {country.name} ?</p>
                              <p style={{ ...ls, fontSize: '13px', color: 'var(--muted-foreground)', marginBottom: 0 }}>Toutes les configurations associÃ©es seront perdues.</p>
                            </div>
                          }
                          onConfirm={(e) => {
                            e?.stopPropagation();
                            setSelectedCountries(selectedCountries.filter(c => c !== countryCode));
                          }}
                          onCancel={(e) => e?.stopPropagation()}
                          okText="Oui, supprimer"
                          cancelText="Annuler"
                          okButtonProps={{ danger: true }}
                        >
                          <Button 
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                            style={{ borderRadius: 'var(--radius-button)' }}
                          />
                        </Popconfirm>
                      </div>
                    ),
                    children: (
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <Form.Item label={<span style={ls}>Devise locale</span>} name={`${countryCode}_devise`}>
                            <Select placeholder="SÃ©lectionnez" size="large" options={deviseOptions} />
                          </Form.Item>
                          <Form.Item label={<span style={ls}>Taux TVA local</span>} name={`${countryCode}_tauxTVA`}>
                            <Select placeholder="SÃ©lectionnez" size="large" options={vatRateOptions} />
                          </Form.Item>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Form.Item label={<span style={ls}>Status TVA</span>} name={`${countryCode}_statusTVA`}>
                            <Select placeholder="SÃ©lectionnez" size="large" options={statusTVAOptions} />
                          </Form.Item>
                          <Form.Item label={<span style={ls}>Mode de paiement</span>} name={`${countryCode}_modePaiement`}>
                            <Select placeholder="SÃ©lectionnez" size="large" options={modePaiementOptions} />
                          </Form.Item>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Form.Item label={<span style={ls}>DÃ©lai de paiement</span>} name={`${countryCode}_delaiPaiement`}>
                            <Select placeholder="SÃ©lectionnez" size="large" options={delaiPaiementOptions} />
                          </Form.Item>
                          <Form.Item label={<span style={ls}>GL Key</span>} name={`${countryCode}_glKey`}>
                            <Input placeholder="ClÃ© comptable" size="large" />
                          </Form.Item>
                        </div>

                        <Form.Item label={<span style={ls}>Email comptable local</span>} name={`${countryCode}_emailComptable`}>
                          <Input placeholder="comptabilite@entreprise.fr" size="large" type="email" prefix={<MailOutlined style={{ color: 'var(--muted-foreground)' }} />} />
                        </Form.Item>
                      </div>
                    ),
                    style: { 
                      marginBottom: '12px', 
                      backgroundColor: 'var(--card)', 
                      borderRadius: 'var(--radius)', 
                      border: '1px solid var(--border)', 
                      overflow: 'hidden' 
                    },
                  };
                }).filter(Boolean) as any[]}
              />
            )}
            
            {selectedCountries.length > 0 && selectedCountries.length < paysOptions.length && (
              <Alert
                title={<span style={ls}>Pays disponibles</span>}
                description={<span style={{ ...ls, fontWeight: 'var(--font-weight-normal)' as const }}>Vous pouvez ajouter {paysOptions.length - selectedCountries.length} pays supplÃ©mentaires</span>}
                type="info"
                showIcon
                style={{ backgroundColor: 'rgba(24,144,255,0.05)', border: '1px solid rgba(24,144,255,0.12)', borderRadius: 'var(--radius)', marginTop: '16px' }}
              />
            )}
          </div>
        </div>

        {/* Modal d'ajout de pays */}
        <Modal
          title="Ajouter un pays d'opÃ©ration"
          open={isCountryModalOpen}
          onOk={() => {
            if (countryToAdd) {
              setSelectedCountries([...selectedCountries, countryToAdd]);
            }
            setIsCountryModalOpen(false);
          }}
          onCancel={() => setIsCountryModalOpen(false)}
          okText="Ajouter"
          cancelText="Annuler"
          style={{ top: 20 }}
        >
          <p style={{ ...ls, color: 'var(--foreground)' }}>Veuillez sÃ©lectionner le pays que vous souhaitez ajouter :</p>
          <Select
            placeholder="SÃ©lectionnez un pays"
            size="large"
            showSearch
            filterOption={countryOptionFilter}
            value={countryToAdd}
            onChange={(v) => setCountryToAdd(v)}
            options={paysOptions.filter(p => !selectedCountries.includes(p.value))}
            style={{ width: '100%' }}
          />
        </Modal>
          </>
        )}
      </section>

      {/* â•â•â•â•â•â•â•â•â•â• BLOC 3 : JUSTIFICATIFS & VALIDATION â•â•â•â•â•â•â•â•â•â• */}
      <section id="justificatifs" className="form-section mb-8">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <SectionBanner index={3} title="Justificatifs & Validation" description="Documents et commentaires de validation" sectionId="justificatifs" />
          </div>
          <SectionAccordionToggle sectionId="justificatifs" />
        </div>

        {accordionOpen.justificatifs && (
          <>
        <Card id="documents" title="PiÃ¨ces Jointes" subtitle="RIB, Kbis, Statuts, etc." icon={<FolderOpenOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: 'var(--primary)', fontSize: '42px' }} /></p>
            <p style={{ ...ls, fontWeight: 'var(--font-weight-semibold)' as const, color: 'var(--foreground)', margin: '10px 0 4px' }}>Cliquez ou glissez-dÃ©posez vos fichiers ici</p>
            <p style={{ ...ls, color: 'var(--muted-foreground)', margin: 0, fontSize: '13px' }}>PDF, JPG, PNG, DOC, DOCX (max 10 MB)</p>
          </Dragger>
          {filesByType.documents && filesByType.documents.length > 0 && (
            <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(82,196,26,0.06)', border: '1px solid rgba(82,196,26,0.2)' }}>
              <CheckCircleFilled style={{ color: '#52c41a', fontSize: '18px' }} />
              <span style={{ ...ls, fontWeight: 'var(--font-weight-semibold)' as const }}>{filesByType.documents.length} fichier(s) ajoutÃ©(s)</span>
            </div>
          )}
        </Card>

        <Card id="commentaires" title="Commentaires" subtitle="Justification de la demande" icon={<FileTextOutlined style={{ fontSize: '18px', color: 'var(--primary)' }} />}>
          <Form.Item label={<span style={ls}>Commentaires {req}</span>} name="commentaires" rules={[{ required: true, message: 'Les commentaires sont obligatoires' }]} className={fc('commentaires')} extra={<span style={{ ...ls, color: 'var(--muted-foreground)' }}>Expliquez le contexte et les raisons de cette crÃ©ation/modification</span>}>
            <TextArea placeholder="DÃ©crivez le contexte de cette demande..." rows={5} showCount maxLength={1000} />
          </Form.Item>
          
          <Alert
            title={<span style={ls}>Routage automatique</span>}
            description={<span style={{ ...ls, fontWeight: 'var(--font-weight-normal)' as const }}>LIFT routera automatiquement le ticket au bon groupe de validation. Le champ "Validateur" a Ã©tÃ© supprimÃ©.</span>}
            type="success"
            showIcon
            style={{ backgroundColor: 'rgba(82,196,26,0.05)', border: '1px solid rgba(82,196,26,0.12)', borderRadius: 'var(--radius)', marginTop: '16px' }}
          />
        </Card>
          </>
        )}
      </section>
    </Form>
  );
}

