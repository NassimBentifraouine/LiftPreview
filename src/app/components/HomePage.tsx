import { useNavigate } from 'react-router';
import DktIcon from './DktIcon';
import accueilSvg from '../../imports/Accueil/svg-qy6k6ylg0m';
import { canAccessPath, useRoleAccess } from './RoleAccess';

function ArrowIcon() {
  return (
    <svg width="13" height="10" viewBox="0 0 13.0404 10.0404" fill="none">
      <path clipRule="evenodd" d={accueilSvg.p20326f40} fill="white" fillRule="evenodd" />
    </svg>
  );
}

const cards = [
  {
    icon: 'briefcase',
    title: 'Gestion des tiers',
    desc: 'Gérez vos tiers internes',
    path: '/tiers',
  },
  {
    icon: 'user',
    title: 'Gestion des clients',
    desc: 'Gérez votre base clients B2B',
    path: '/clients',
  },
  {
    icon: 'document-text',
    title: 'Mes brouillons',
    desc: 'Retrouvez vos brouillons',
    path: '/brouillons',
  },
  {
    icon: 'download',
    title: 'Exporter de la donnée',
    desc: 'Exportez vos données',
    path: '/export',
  },
  {
    icon: 'settings',
    title: 'Administration',
    desc: 'Paramètres réservés aux administrateurs',
    path: '/administration',
  },

];

export default function HomePage() {
  const navigate = useNavigate();
  const { permissions } = useRoleAccess();

  return (
    <div className="relative min-h-full overflow-hidden" style={{ backgroundColor: '#f5f5f6' }}>
      <div className="pointer-events-none absolute inset-0">
        <div
          style={{
            position: 'absolute',
            left: '-8%',
            top: 0,
            width: '58%',
            minWidth: '520px',
            height: '115%',
            backgroundColor: 'rgba(145,146,255,0.18)',
            borderBottomRightRadius: '420px',
            borderTopRightRadius: '18px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-22%',
            bottom: '-44%',
            width: '72%',
            minWidth: '700px',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            backgroundColor: 'rgba(145,146,255,0.16)',
          }}
        />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 2xl:px-16 pt-10 md:pt-12 pb-12 md:pb-16">
        <div className="flex flex-col xl:flex-row xl:items-start gap-10 xl:gap-6">
          <div className="w-full xl:max-w-[820px]">
            <h1
              className="m-0 whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: 'clamp(42px, 6vw, 68px)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--primary)',
                lineHeight: '1.05',
              }}
            >
              Bienvenue Nassim
            </h1>
            <p
              className="m-0 mt-2 mb-8 md:mb-10"
              style={{
                fontFamily: 'var(--font-family-text)',
                fontSize: 'clamp(18px, 1.8vw, 22px)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--foreground)',
                lineHeight: '1.35',
              }}
            >
              Le référentiel des Tiers internes et des Clients B2B
            </p>

            <div className="grid grid-cols-2 gap-5">
              {cards
                .filter(card => canAccessPath(card.path, permissions))
                .map((card) => (
                  <div
                    key={card.path}
                    className="flex flex-col justify-between"
                    style={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '14px',
                      minHeight: '132px',
                    }}
                  >
                    <div className="flex items-start gap-2.5 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(54,67,186,0.1)' }}
                      >
                        <DktIcon name={card.icon} size={20} color="var(--primary)" />
                      </div>
                      <div>
                        <p
                          className="m-0"
                          style={{
                            fontFamily: 'var(--font-family-display)',
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--foreground)',
                            lineHeight: '1.1',
                          }}
                        >
                          {card.title}
                        </p>
                        <p
                          className="m-0 mt-1"
                          style={{
                            fontFamily: 'var(--font-family-text)',
                            fontSize: '13px',
                            fontWeight: 'var(--font-weight-normal)',
                            color: 'var(--foreground)',
                            lineHeight: '1.35',
                          }}
                        >
                          {card.desc}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(card.path)}
                      className="flex items-center justify-center gap-1 w-full py-2 px-4 mt-auto"
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family-text)',
                        fontSize: '13px',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      Accéder <ArrowIcon />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className="hidden xl:flex flex-1 items-center justify-end min-w-0 pr-0 xl:pt-24">
            <svg width="576" height="466" viewBox="0 0 575.838 466.017" fill="none" className="w-full h-auto max-w-[620px]">
              <path d={accueilSvg.p2d180ef0} fill="#E5E5FF" />
              <path d={accueilSvg.p19741b00} fill="#E5E5FF" />
              <path d={accueilSvg.pd31ae20} fill="#E5E5FF" />
              <path d={accueilSvg.p1944df0} fill="#9192FF" />
              <path d={accueilSvg.p2166eaf0} fill="#9192FF" />
              <path d={accueilSvg.p3bc94080} fill="#9192FF" />
              <path d={accueilSvg.p2c3a900} fill="#9192FF" />
              <path d={accueilSvg.p155c8b00} fill="white" />
              <path d={accueilSvg.p1cf7fe80} fill="#9192FF" />
              <path d={accueilSvg.p2a23fcf0} fill="white" />
              <path d={accueilSvg.p2c572b80} fill="#9192FF" />
              <path d={accueilSvg.p23b72d00} fill="#3643BA" />
              <path d={accueilSvg.p2315a180} fill="#3643BA" />
              <path d={accueilSvg.p29499000} fill="#9192FF" />
              <path d={accueilSvg.p6d67f00} fill="#9192FF" />
              <path d={accueilSvg.p57f6000} fill="#9192FF" />
              <path d={accueilSvg.pf876480} fill="white" />
              <path d={accueilSvg.p3d9f300} fill="white" />
              <path d={accueilSvg.p14e91580} fill="white" />
              <path d={accueilSvg.p1292e300} fill="#9192FF" />
              <path d={accueilSvg.p13fd5f00} fill="#D1D1FF" />
              <path d={accueilSvg.p2b009d00} fill="#D1D1FF" />
              <path d={accueilSvg.pb75100} fill="#D1D1FF" />
              <path d={accueilSvg.pa75d00} fill="#D1D1FF" />
              <path d={accueilSvg.p3e409f00} fill="#D1D1FF" />
              <path d={accueilSvg.p1c80ee80} fill="#D1D1FF" />
              <path d={accueilSvg.p151801c0} fill="#D1D1FF" />
              <path d={accueilSvg.p9507f00} fill="#D1D1FF" />
              <path d={accueilSvg.p22deb900} fill="#D1D1FF" />
              <path d={accueilSvg.pcd43680} fill="#EBEBFF" />
              <path d={accueilSvg.p8426000} fill="#7AFFA6" />
              <path d={accueilSvg.p127341f0} fill="#EBEBFF" />
              <path d={accueilSvg.p31b8db80} fill="white" />
              <path d={accueilSvg.p1b42aa00} fill="white" />
              <path d={accueilSvg.p2361cc40} fill="#EBEBFF" />
              <path d={accueilSvg.p122d7970} fill="white" />
              <path d={accueilSvg.pcc1d100} fill="#EBEBFF" />
              <path d={accueilSvg.p1cfaf330} fill="#EBEBFF" />
              <path d={accueilSvg.p86c9580} fill="white" />
              <path d={accueilSvg.p3812d980} fill="#9192FF" />
              <path d={accueilSvg.p19f97b80} fill="white" />
              <path d={accueilSvg.p1d367eb0} fill="#9192FF" />
              <path d={accueilSvg.p13432800} fill="#9192FF" />
              <path d={accueilSvg.p39506c00} fill="#9192FF" />
              <path d={accueilSvg.p2750e400} fill="#9192FF" />
              <path d={accueilSvg.p3b30c080} fill="#9192FF" />
              <path d={accueilSvg.pb99300} fill="#9192FF" />
              <path d={accueilSvg.p1ff82600} fill="#9192FF" />
              <path d={accueilSvg.pafd4c00} fill="#D1D1FF" />
              <path d={accueilSvg.p54d5480} fill="#D1D1FF" />
              <path d={accueilSvg.p607cb70} fill="#D1D1FF" />
              <path d={accueilSvg.p3bfd9000} fill="white" />
              <path d={accueilSvg.p1b273f80} fill="#9192FF" />
              <path d={accueilSvg.p307df800} fill="#D1D1FF" />
              <path d={accueilSvg.p2deb7d00} fill="#1B1B43" />
              <path d={accueilSvg.p9b97500} fill="#1B1B43" />
              <path d={accueilSvg.p2e0c5880} fill="#D1D1FF" />
              <path d={accueilSvg.p7dbfd00} fill="#1B1B43" />
              <path d={accueilSvg.p36c9cb00} fill="#1B1B43" />
              <path d={accueilSvg.p97df200} fill="#E8E8FF" />
              <path d={accueilSvg.p308f6680} fill="#E8E8FF" />
              <path d={accueilSvg.p20107a00} fill="#9192FF" />
              <path d={accueilSvg.p10bb4180} fill="#FFBC96" />
              <path d={accueilSvg.p1bc52200} fill="#3643BA" />
              <path d={accueilSvg.p18748000} fill="#3643BA" />
              <path d={accueilSvg.p238584b0} fill="#FFBC96" />
              <path d={accueilSvg.pf802780} fill="#3643BA" />
              <path d={accueilSvg.p3a245e80} fill="#D1D1FF" />
              <path d={accueilSvg.p2fc43700} fill="#1B1B43" />
              <path d={accueilSvg.p32e5e2f0} fill="#D28572" />
              <path d={accueilSvg.pf7c1100} fill="#FFBC96" />
              <path d={accueilSvg.p7006b80} fill="#1B1B43" />
              <path d={accueilSvg.p821f200} fill="#FFBC96" />
              <path d={accueilSvg.p1c5ee17e} fill="#1B1B43" />
              <path d={accueilSvg.p19a67f00} fill="#FFBC96" />
              <path d={accueilSvg.p38e02c00} fill="#1B1B43" />
              <path d={accueilSvg.p630b110} fill="#1B1B43" />
              <path d={accueilSvg.p25558600} fill="#1B1B43" />
              <path d={accueilSvg.p3d78a100} fill="#1B1B43" />
              <path d={accueilSvg.p1baeea00} fill="#1B1B43" />
              <path d={accueilSvg.p31b05f00} fill="#1B1B43" />
              <path d={accueilSvg.p10d36a00} fill="#1B1B43" />
              <path d={accueilSvg.p3569a780} fill="#FE5B52" />
              <path d={accueilSvg.p5f6b000} fill="#FE5B52" />
              <path d={accueilSvg.p632ae00} fill="#9192FF" />
              <path d={accueilSvg.p57d1100} fill="white" />
              <path d={accueilSvg.p39f2fcc0} fill="#9192FF" />
              <path d={accueilSvg.p1e61e280} fill="#EBEBFF" />
              <path d={accueilSvg.p3c7b35f0} fill="#1B1B43" />
              <path d={accueilSvg.p279b68f0} fill="#D1D1FF" />
              <path d={accueilSvg.p1b0f0200} fill="#1B1B43" />
              <path d={accueilSvg.p25b96500} fill="#D1D1FF" />
              <path d={accueilSvg.p2c7b14f1} fill="#D1D1FF" />
              <path d={accueilSvg.p2debd00} fill="#D28572" />
              <path d={accueilSvg.p1363a80} fill="#FFBC96" />
              <path d={accueilSvg.p1447ec80} fill="#1B1B43" />
              <path d={accueilSvg.p155b5b00} fill="#FFBC96" />
              <path d={accueilSvg.p739eb00} fill="#1B1B43" />
              <path d={accueilSvg.p2c4840f0} fill="#FFBC96" />
              <path d={accueilSvg.p1a73c100} fill="#1B1B43" />
              <path d={accueilSvg.p27074180} fill="#1B1B43" />
              <path d={accueilSvg.p3ed5d700} fill="#FE5B52" />
              <path d={accueilSvg.p33891800} fill="#E8E8FF" />
              <path d={accueilSvg.p2eb1ed00} fill="#FFBC96" />
              <path d={accueilSvg.p219fc3d2} fill="#26289C" />
              <path d={accueilSvg.p169d01f0} fill="#E8E8FF" />
              <path d={accueilSvg.p704a780} fill="#26289C" />
              <path d={accueilSvg.p18fde00} fill="#26289C" />
              <path d={accueilSvg.p17884a00} fill="#D1D1FF" />
              <path d={accueilSvg.p3d1d8f00} fill="#1B1B43" />
              <path d={accueilSvg.p3b788d00} fill="#26289C" />
              <path d={accueilSvg.pe3cad80} fill="#D1D1FF" />
              <path d={accueilSvg.p16ef9f80} fill="#1B1B43" />
              <path d={accueilSvg.p1c32c600} fill="#3643BA" />
              <path d={accueilSvg.pff7c0f0} fill="#1B1B43" />
              <path d={accueilSvg.p3d765b00} fill="#1B1B43" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
