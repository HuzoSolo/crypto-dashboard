// Lightweight inline icons (Lucide-style outline). 16px default.
const Icon = ({ children, size = 16, stroke = 1.75, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    {children}
  </svg>
);

const I = {
  home: (p) => (<Icon {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></Icon>),
  list: (p) => (<Icon {...p}><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><circle cx="3.5" cy="6" r="1" /><circle cx="3.5" cy="12" r="1" /><circle cx="3.5" cy="18" r="1" /></Icon>),
  wallet: (p) => (<Icon {...p}><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1" /><path d="M16 12h5v4h-5a2 2 0 1 1 0-4z" /></Icon>),
  swap: (p) => (<Icon {...p}><path d="M7 4v16" /><path d="M3 8l4-4 4 4" /><path d="M17 20V4" /><path d="M21 16l-4 4-4-4" /></Icon>),
  calendar: (p) => (<Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 3v4" /><path d="M16 3v4" /></Icon>),
  target: (p) => (<Icon {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></Icon>),
  bar: (p) => (<Icon {...p}><path d="M3 21h18" /><rect x="5" y="11" width="3" height="8" /><rect x="11" y="6" width="3" height="13" /><rect x="17" y="14" width="3" height="5" /></Icon>),
  receipt: (p) => (<Icon {...p}><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3z" /><path d="M9 8h6" /><path d="M9 12h6" /><path d="M9 16h4" /></Icon>),
  search: (p) => (<Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>),
  bell: (p) => (<Icon {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" /><path d="M10 21a2 2 0 0 0 4 0" /></Icon>),
  settings: (p) => (<Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.4 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.6 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></Icon>),
  sun: (p) => (<Icon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Icon>),
  moon: (p) => (<Icon {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></Icon>),
  plus: (p) => (<Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>),
  trash: (p) => (<Icon {...p}><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></Icon>),
  edit: (p) => (<Icon {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></Icon>),
  arrowUp: (p) => (<Icon {...p}><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></Icon>),
  arrowDn: (p) => (<Icon {...p}><path d="M12 5v14" /><path d="M19 12l-7 7-7-7" /></Icon>),
  arrowR: (p) => (<Icon {...p}><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></Icon>),
  refresh: (p) => (<Icon {...p}><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></Icon>),
  download: (p) => (<Icon {...p}><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M5 21h14" /></Icon>),
  filter: (p) => (<Icon {...p}><path d="M3 5h18l-7 9v6l-4-2v-4L3 5z" /></Icon>),
  logout: (p) => (<Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></Icon>),
  grid: (p) => (<Icon {...p}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></Icon>),
  external: (p) => (<Icon {...p}><path d="M15 3h6v6" /><path d="M10 14L21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></Icon>),
  check: (p) => (<Icon {...p}><path d="M20 6L9 17l-5-5" /></Icon>),
  x: (p) => (<Icon {...p}><path d="M18 6L6 18M6 6l12 12" /></Icon>),
  bolt: (p) => (<Icon {...p}><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" /></Icon>),
  shield: (p) => (<Icon {...p}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" /></Icon>),
  chart: (p) => (<Icon {...p}><path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" /></Icon>),
  alert: (p) => (<Icon {...p}><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></Icon>),
  chevDn: (p) => (<Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>),
  chevL: (p) => (<Icon {...p}><path d="M15 18l-6-6 6-6" /></Icon>),
  chevR: (p) => (<Icon {...p}><path d="M9 18l6-6-6-6" /></Icon>),
  dots: (p) => (<Icon {...p}><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" /></Icon>),
  lock: (p) => (<Icon {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 1 1 8 0v4" /></Icon>),
  mail: (p) => (<Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Icon>),
  flame: (p) => (<Icon {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.5 0 3-1 3-3 0-2-2-3-2-5 0-3-2-5-2-5s-3 2-3 7c0 1.5.5 2.5 1.5 3.5z" /><path d="M12 22a7 7 0 0 0 7-7c0-3-2-5-3-7-1 4-3 5-5 5s-2-1-2-2c-1 2-4 4-4 8a7 7 0 0 0 7 3z" /></Icon>),
};
window.I = I;
