interface CountryFlagProps {
  code?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const isIsoCountryCode = (value: string) => /^[A-Z]{2}$/.test(value);

function stripeVertical(colors: [string, string, string]) {
  return (
    <>
      <rect x="0" y="0" width="8" height="18" fill={colors[0]} />
      <rect x="8" y="0" width="8" height="18" fill={colors[1]} />
      <rect x="16" y="0" width="8" height="18" fill={colors[2]} />
    </>
  );
}

function stripeHorizontal(colors: [string, string, string]) {
  return (
    <>
      <rect x="0" y="0" width="24" height="6" fill={colors[0]} />
      <rect x="0" y="6" width="24" height="6" fill={colors[1]} />
      <rect x="0" y="12" width="24" height="6" fill={colors[2]} />
    </>
  );
}

function gbFlag() {
  return (
    <>
      <rect x="0" y="0" width="24" height="18" fill="#012169" />
      <path d="M0 0L9 0L24 11V18L15 18L0 7V0Z" fill="#FFFFFF" />
      <path d="M24 0L15 0L0 11V18L9 18L24 7V0Z" fill="#FFFFFF" />
      <path d="M0 0L0 2L20 18L24 18L24 16L4 0Z" fill="#C8102E" />
      <path d="M24 0L24 2L4 18L0 18L0 16L20 0Z" fill="#C8102E" />
      <rect x="9" y="0" width="6" height="18" fill="#FFFFFF" />
      <rect x="0" y="6" width="24" height="6" fill="#FFFFFF" />
      <rect x="10" y="0" width="4" height="18" fill="#C8102E" />
      <rect x="0" y="7" width="24" height="4" fill="#C8102E" />
    </>
  );
}

function dkFlag() {
  return (
    <>
      <rect x="0" y="0" width="24" height="18" fill="#C60C30" />
      <rect x="7" y="0" width="3" height="18" fill="#FFFFFF" />
      <rect x="0" y="7" width="24" height="3" fill="#FFFFFF" />
    </>
  );
}

function seFlag() {
  return (
    <>
      <rect x="0" y="0" width="24" height="18" fill="#006AA7" />
      <rect x="7" y="0" width="3.5" height="18" fill="#FECC00" />
      <rect x="0" y="7" width="24" height="3.5" fill="#FECC00" />
    </>
  );
}

function noFlag() {
  return (
    <>
      <rect x="0" y="0" width="24" height="18" fill="#BA0C2F" />
      <rect x="6.5" y="0" width="4.5" height="18" fill="#FFFFFF" />
      <rect x="0" y="6.5" width="24" height="4.5" fill="#FFFFFF" />
      <rect x="7.5" y="0" width="2.5" height="18" fill="#00205B" />
      <rect x="0" y="7.5" width="24" height="2.5" fill="#00205B" />
    </>
  );
}

function fiFlag() {
  return (
    <>
      <rect x="0" y="0" width="24" height="18" fill="#FFFFFF" />
      <rect x="7" y="0" width="4" height="18" fill="#003580" />
      <rect x="0" y="7" width="24" height="4" fill="#003580" />
    </>
  );
}

function chFlag() {
  return (
    <>
      <rect x="0" y="0" width="24" height="18" fill="#DA291C" />
      <rect x="10" y="4" width="4" height="10" fill="#FFFFFF" />
      <rect x="7" y="7" width="10" height="4" fill="#FFFFFF" />
    </>
  );
}

function grFlag() {
  return (
    <>
      <rect x="0" y="0" width="24" height="18" fill="#0D5EAF" />
      <rect x="0" y="2" width="24" height="2" fill="#FFFFFF" />
      <rect x="0" y="6" width="24" height="2" fill="#FFFFFF" />
      <rect x="0" y="10" width="24" height="2" fill="#FFFFFF" />
      <rect x="0" y="14" width="24" height="2" fill="#FFFFFF" />
      <rect x="0" y="0" width="10" height="10" fill="#0D5EAF" />
      <rect x="4" y="0" width="2" height="10" fill="#FFFFFF" />
      <rect x="0" y="4" width="10" height="2" fill="#FFFFFF" />
    </>
  );
}

function usFlag() {
  return (
    <>
      <rect x="0" y="0" width="24" height="18" fill="#FFFFFF" />
      {[0, 2.77, 5.54, 8.31, 11.08, 13.85, 16.62].map((y, index) => (
        <rect key={index} x="0" y={y} width="24" height="1.38" fill="#B22234" />
      ))}
      <rect x="0" y="0" width="10.4" height="9.6" fill="#3C3B6E" />
      {[1.3, 3.3, 5.3, 7.3].map((y, row) =>
        [1.3, 3.3, 5.3, 7.3, 9.3].map((x, col) => (
          <circle key={`${row}-${col}`} cx={x} cy={y} r="0.35" fill="#FFFFFF" />
        )),
      )}
    </>
  );
}

function cnFlag() {
  return (
    <>
      <rect x="0" y="0" width="24" height="18" fill="#DE2910" />
      <polygon points="4.5,3 5.3,5.3 7.8,5.3 5.8,6.7 6.6,9 4.5,7.6 2.4,9 3.2,6.7 1.2,5.3 3.7,5.3" fill="#FFDE00" />
      <circle cx="10.2" cy="3.4" r="0.8" fill="#FFDE00" />
      <circle cx="11.5" cy="5.1" r="0.8" fill="#FFDE00" />
      <circle cx="11.2" cy="7.2" r="0.8" fill="#FFDE00" />
      <circle cx="9.6" cy="8.6" r="0.8" fill="#FFDE00" />
    </>
  );
}

function renderFlagContent(code: string) {
  switch (code) {
    case 'FR':
      return stripeVertical(['#0055A4', '#FFFFFF', '#EF4135']);
    case 'BE':
      return stripeVertical(['#000000', '#FFD90C', '#EF3340']);
    case 'ES':
      return stripeHorizontal(['#AA151B', '#F1BF00', '#AA151B']);
    case 'DE':
      return stripeHorizontal(['#000000', '#DD0000', '#FFCE00']);
    case 'IT':
      return stripeVertical(['#009246', '#FFFFFF', '#CE2B37']);
    case 'GB':
      return gbFlag();
    case 'PT':
      return (
        <>
          <rect x="0" y="0" width="10" height="18" fill="#006600" />
          <rect x="10" y="0" width="14" height="18" fill="#FF0000" />
          <circle cx="10" cy="9" r="2.8" fill="#FFCC00" />
        </>
      );
    case 'NL':
      return stripeHorizontal(['#AE1C28', '#FFFFFF', '#21468B']);
    case 'PL':
      return (
        <>
          <rect x="0" y="0" width="24" height="9" fill="#FFFFFF" />
          <rect x="0" y="9" width="24" height="9" fill="#DC143C" />
        </>
      );
    case 'CH':
      return chFlag();
    case 'LU':
      return stripeHorizontal(['#EF3340', '#FFFFFF', '#6AD1F5']);
    case 'AT':
      return stripeHorizontal(['#ED2939', '#FFFFFF', '#ED2939']);
    case 'DK':
      return dkFlag();
    case 'SE':
      return seFlag();
    case 'NO':
      return noFlag();
    case 'FI':
      return fiFlag();
    case 'IE':
      return stripeVertical(['#169B62', '#FFFFFF', '#FF883E']);
    case 'GR':
      return grFlag();
    case 'US':
      return usFlag();
    case 'CN':
      return cnFlag();
    default:
      return <rect x="0" y="0" width="24" height="18" fill="#D9D9D9" />;
  }
}

export default function CountryFlag({ code, size = 16, className, style }: CountryFlagProps) {
  const upperCode = (code || '').toUpperCase();
  if (!isIsoCountryCode(upperCode)) return null;

  const width = Math.max(14, size);
  const height = Math.round(width * 0.75);

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 18"
      aria-hidden
      focusable="false"
      style={{
        display: 'inline-block',
        borderRadius: '3px',
        overflow: 'hidden',
        flexShrink: 0,
        ...style,
      }}
    >
      {renderFlagContent(upperCode)}
    </svg>
  );
}

