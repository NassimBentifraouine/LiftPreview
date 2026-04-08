import { useMemo, useState } from 'react';

interface CountryFlagProps {
  code?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const isIsoCountryCode = (value: string) => /^[A-Z]{2}$/.test(value);

export default function CountryFlag({ code, size = 16, className, style }: CountryFlagProps) {
  const [imageError, setImageError] = useState(false);
  const upperCode = (code || '').toUpperCase();
  const valid = isIsoCountryCode(upperCode);

  const dimensions = useMemo(() => {
    const width = Math.max(14, size);
    const height = Math.round(width * 0.75);
    return { width, height };
  }, [size]);

  if (!valid) {
    return null;
  }

  if (imageError) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          border: '1px solid var(--border)',
          borderRadius: '3px',
          fontFamily: 'var(--font-family-text)',
          fontSize: '10px',
          color: 'var(--muted-foreground)',
          lineHeight: 1,
          ...style,
        }}
      >
        {upperCode}
      </span>
    );
  }

  return (
    <img
      className={className}
      src={`https://flagcdn.com/w40/${upperCode.toLowerCase()}.png`}
      width={dimensions.width}
      height={dimensions.height}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setImageError(true)}
      style={{
        display: 'inline-block',
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        borderRadius: '3px',
        objectFit: 'cover',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

