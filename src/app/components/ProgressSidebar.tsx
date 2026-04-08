import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import type { FormSection } from './types';

interface Props {
  sections: FormSection[];
  activeSection: string;
  activeSubsection: string;
  completedFields: Set<string>;
  onSectionClick: (id: string) => void;
  onSubsectionClick: (id: string) => void;
}

export default function ProgressSidebar({
  sections,
  activeSection,
  activeSubsection,
  completedFields,
  onSectionClick,
  onSubsectionClick,
}: Props) {

  const getSectionPct = (section: FormSection) => {
    const all = section.subsections.flatMap(s => s.fields);
    const done = all.filter(f => completedFields.has(f)).length;
    return all.length > 0 ? Math.round((done / all.length) * 100) : 0;
  };

  const isSubDone = (fields: string[]) => fields.length > 0 && fields.every(f => completedFields.has(f));

  return (
    <div className="space-y-1">
      {sections.map((section, idx) => {
        const isActive = activeSection === section.id;
        const pct = getSectionPct(section);
        const done = pct === 100;

        return (
          <div key={section.id}>
            {/* ── Section row ── */}
            <button
              onClick={() => onSectionClick(section.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
              style={{
                backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = isActive ? 'rgba(255,255,255,0.12)' : 'transparent'; }}
            >
              {/* Circle with number or check */}
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: done ? '#52c41a' : isActive ? 'white' : 'rgba(255,255,255,0.15)',
                  color: done ? 'white' : isActive ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                  fontFamily: 'var(--font-family-display)', fontSize: '13px',
                  fontWeight: 'var(--font-weight-semibold)',
                  transition: 'all 0.25s ease',
                }}
              >
                {done ? <CheckCircleFilled style={{ fontSize: '15px' }} /> : idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div
                  className="truncate"
                  style={{
                    fontFamily: 'var(--font-family-text)', fontSize: 'var(--text-sm)',
                    fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                    color: 'white', lineHeight: '1.3',
                  }}
                >
                  {section.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-family-text)', fontSize: '12px',
                  color: done ? 'rgba(82,196,26,0.85)' : 'rgba(255,255,255,0.5)',
                  lineHeight: '1.3', marginTop: '1px',
                }}>
                  {done ? 'Complété' : `${pct}%`}
                </div>
              </div>
            </button>

            {/* ── Subsections (always visible for active section) ── */}
            {isActive && (
              <div className="ml-5 mt-0.5 mb-1">
                {/* Vertical line + items */}
                <div style={{ borderLeft: '1.5px solid rgba(255,255,255,0.15)', marginLeft: '8px', paddingLeft: '0' }}>
                  {section.subsections.map(sub => {
                    const subDone = isSubDone(sub.fields);
                    const subActive = activeSubsection === sub.id;
                    const completedCount = sub.fields.filter(f => completedFields.has(f)).length;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => onSubsectionClick(sub.id)}
                        className="w-full flex items-center gap-2.5 py-1.5 pl-3 pr-2 rounded-r transition-all"
                        style={{
                          backgroundColor: subActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                          borderLeft: subActive ? '1.5px solid white' : '1.5px solid transparent',
                          marginLeft: '-1.5px',
                        }}
                        onMouseEnter={e => { if (!subActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { if (!subActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {/* Dot or check */}
                        <div
                          className="shrink-0"
                          style={{
                            width: subDone ? '14px' : '6px',
                            height: subDone ? '14px' : '6px',
                            borderRadius: '50%',
                            backgroundColor: subDone ? '#52c41a' : subActive ? 'white' : 'rgba(255,255,255,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {subDone && <CheckCircleFilled style={{ fontSize: '14px', color: '#52c41a' }} />}
                        </div>

                        <span
                          className="truncate flex-1"
                          style={{
                            fontFamily: 'var(--font-family-text)', fontSize: '13px',
                            fontWeight: subActive ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
                            color: subActive ? 'white' : subDone ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
                            lineHeight: '1.3',
                          }}
                        >
                          {sub.label}
                        </span>

                        <span style={{
                          fontFamily: 'var(--font-family-text)', fontSize: '11px',
                          color: 'rgba(255,255,255,0.4)',
                        }}>
                          {completedCount}/{sub.fields.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Spacer between sections */}
            {idx < sections.length - 1 && !isActive && <div style={{ height: '2px' }} />}
            {idx < sections.length - 1 && isActive && <div style={{ height: '6px' }} />}
          </div>
        );
      })}
    </div>
  );
}