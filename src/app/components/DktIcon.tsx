import svgPaths from '../../imports/svg-cczzfufkef';

// Map of icon names to their SVG path keys from the Decathlon icon set
const iconMap: Record<string, { paths: string[]; fill?: boolean; stroke?: boolean }> = {
  // Navigation & Actions
  search:       { paths: ['p1ace1280'], stroke: true },
  filter:       { paths: ['p17405480'], stroke: true },
  plus:         { paths: ['p27ff2600'], stroke: true },
  'plus-circle': { paths: ['p27ff2600'], stroke: true },
  close:        { paths: ['p146227f0'], stroke: true },
  'close-circle': { paths: ['p3207a500'], stroke: true },
  check:        { paths: ['p2cc3fd80'], stroke: true },
  'check-circle': { paths: ['p32c39b00'], stroke: true },
  menu:         { paths: ['p138dca00'], stroke: true },
  'menu-left':  { paths: ['p1a17480'], stroke: true },
  'arrow-left': { paths: ['p13230180'], stroke: true },
  'arrow-right': { paths: ['p2acd0d80'], stroke: true },
  'arrow-up':   { paths: ['p19222b00'], stroke: true },
  'arrow-down': { paths: ['p370c0440'], stroke: true },
  'chevron-up': { paths: ['p2e152310'], stroke: true },
  'chevron-down': { paths: ['p2badc180'], stroke: true },
  'chevron-left-right': { paths: ['p2badc180'], stroke: true },
  'external-link': { paths: ['p189fa60'], stroke: true },
  download:     { paths: ['p18fb1700'], stroke: true },
  upload:       { paths: ['p2ac28460'], stroke: true },
  refresh:      { paths: ['p1419bc00'], stroke: true },
  'sort-vertical': { paths: ['p15aa7d00'], stroke: true },
  swap:         { paths: ['p1ae35780'], stroke: true },

  // Content & Files
  home:         { paths: ['p10c09bc0'], stroke: true },
  user:         { paths: ['p20ef7a00'], stroke: true },
  users:        { paths: ['p169590f0'], stroke: true },
  document:     { paths: ['p1361500'], stroke: true },
  'document-text': { paths: ['p2a171900'], stroke: true },
  folder:       { paths: ['p245fe500'], stroke: true },
  clipboard:    { paths: ['p37444680'], stroke: true },
  'clipboard-check': { paths: ['p214afd00'], stroke: true },
  edit:         { paths: ['p122ccd80'], stroke: true },
  'edit-square': { paths: ['p1ff10300'], stroke: true },
  trash:        { paths: ['p1c76eb00'], stroke: true },
  save:         { paths: ['p140a3e00'], stroke: true },
  copy:         { paths: ['p214afd00'], stroke: true },

  // Communication
  mail:         { paths: ['p189e3100'], stroke: true },
  phone:        { paths: ['p2f35b500'], stroke: true },
  chat:         { paths: ['p2240d800'], stroke: true },
  'chat-edit':  { paths: ['p255b43c0'], stroke: true },
  notification: { paths: ['p28307e80'], stroke: true },

  // Business & Finance
  bank:         { paths: ['p2b084d00'], stroke: true },
  money:        { paths: ['p301d0f80'], stroke: true },
  chart:        { paths: ['p15c57952'], stroke: true },
  'chart-bar':  { paths: ['p1ff5cc80'], stroke: true },
  briefcase:    { paths: ['p1242e380'], stroke: true },
  tag:          { paths: ['p16404200'], stroke: true },
  gift:         { paths: ['p12ec7d00'], stroke: true },
  cart:         { paths: ['p32f81200'], stroke: true },
  store:        { paths: ['p12046f80'], stroke: true },
  receipt:      { paths: ['p2a171900'], stroke: true },
  truck:        { paths: ['p35903400'], stroke: true },

  // Status & Info
  eye:          { paths: ['p1a98f900'], stroke: true },
  'eye-off':    { paths: ['p2d0d56c8'], stroke: true },
  info:         { paths: ['p246a8200'], stroke: true },
  warning:      { paths: ['p11552880'], stroke: true },
  'question-circle': { paths: ['p255aa1c0'], stroke: true },
  clock:        { paths: ['p25e40e80'], stroke: true },
  calendar:     { paths: ['p19370780'], stroke: true },
  'calendar-check': { paths: ['p291a0a00'], stroke: true },
  lock:         { paths: ['p1c3ee880'], stroke: true },
  unlock:       { paths: ['p2367880'], stroke: true },
  shield:       { paths: ['p24d0b500'], stroke: true },
  'shield-check': { paths: ['p2ad9f380'], stroke: true },

  // UI Elements
  settings:     { paths: ['p2e306700'], stroke: true },
  'settings-gear': { paths: ['p2e306700'], stroke: true },
  star:         { paths: ['p2a080200'], stroke: true },
  'star-filled': { paths: ['p2589c140'], stroke: true },
  heart:        { paths: ['p19442fc0'], stroke: true },
  sun:          { paths: ['p22461000'], stroke: true },
  moon:         { paths: ['p18526c40'], stroke: true },
  globe:        { paths: ['p1663aa00'], stroke: true },
  cloud:        { paths: ['p29736ef0'], stroke: true },
  'cloud-rain': { paths: ['p2b67a880'], stroke: true },
  wifi:         { paths: ['p33156400'], stroke: true },
  laptop:       { paths: ['p172dd500'], stroke: true },
  monitor:      { paths: ['p298d0800'], stroke: true },
  mobile:       { paths: ['p30af9400'], stroke: true },
  camera:       { paths: ['p1d401780'], stroke: true },
  image:        { paths: ['p26705c00'], stroke: true },
  video:        { paths: ['p24c99d00'], stroke: true },
  music:        { paths: ['p21176400'], stroke: true },
  speaker:      { paths: ['p1d207d00'], stroke: true },
  'speaker-x':  { paths: ['p25a58480'], stroke: true },
  microphone:   { paths: ['p2b22e00'], stroke: true },
  grid:         { paths: ['p34f2c900'], stroke: true },
  'qr-code':    { paths: ['p2217de80'], stroke: true },
  map:          { paths: ['p35f77300'], stroke: true },
  compass:      { paths: ['p121a1d80'], stroke: true },
  link:         { paths: ['p1f29e000'], stroke: true },
  code:         { paths: ['p1ecf9390'], stroke: true },
  terminal:     { paths: ['p1b6eb700'], stroke: true },
  database:     { paths: ['p1b0e48d8'], stroke: true },
  key:          { paths: ['p1f4302f2'], stroke: true },
  tool:         { paths: ['p2ebaa180'], stroke: true },
  'tool-wrench': { paths: ['p1f4302f2'], stroke: true },
  scissors:     { paths: ['p17b38d80'], stroke: true },
  printer:      { paths: ['p12a82500'], stroke: true },
  thermometer:  { paths: ['p24458400'], stroke: true },
  droplet:      { paths: ['p1e9af500'], stroke: true },
  fire:         { paths: ['p1eae1580'], stroke: true },
  accessibility: { paths: ['p36adee00'], stroke: true },
  'tree-structure': { paths: ['p169590f0'], stroke: true },

  // Smiley / Status faces
  'smile':      { paths: ['p16580800'], stroke: true },
  'frown':      { paths: ['p16b79640'], stroke: true },
  'meh':        { paths: ['p14342e00'], stroke: true },

  // Others
  paperclip:    { paths: ['p2b1fd697'], stroke: true },
  layers:       { paths: ['p1a525700'], stroke: true },
  diamond:      { paths: ['p162b16c0'], stroke: true },
  medal:        { paths: ['p2c01c400'], stroke: true },
  target:       { paths: ['p121a1d80'], stroke: true },
  'log-out':    { paths: ['p17773500'], stroke: true },
  expand:       { paths: ['p2643d6e0'], stroke: true },
  collapse:     { paths: ['p18dacf80'], stroke: true },
  bookmark:     { paths: ['p140a3e00'], stroke: true },
  flag:         { paths: ['p26ee8280'], stroke: true },
  'sidebar-left': { paths: ['p1a17480'], stroke: true },
  'sidebar-right': { paths: ['p366e5c96'], stroke: true },
  umbrella:     { paths: ['p1c9fae50'], stroke: true },

  // Dots (more)
  'more-h':     { paths: ['p35f0e580'], stroke: true },
  'more-v':     { paths: ['p29d31480', 'p11ef9200', 'p1fe2a400'], stroke: true },
};

interface DktIconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function DktIcon({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  className = '',
  style,
}: DktIconProps) {
  const icon = iconMap[name];
  if (!icon) {
    // Fallback: render nothing
    return <span className={className} style={{ display: 'inline-block', width: size, height: size, ...style }} />;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
    >
      {icon.paths.map((key, i) => {
        const d = (svgPaths as Record<string, string>)[key];
        if (!d) return null;
        return icon.fill ? (
          <path key={i} d={d} fill={color} />
        ) : (
          <path
            key={i}
            d={d}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      })}
    </svg>
  );
}

// Export the icon map keys for reference
export const iconNames = Object.keys(iconMap);
