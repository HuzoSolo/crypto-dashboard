// Reusable bits

// Tabular currency formatting
const fmtUSD = (v, dec = 2) => (v < 0 ? '-' : '') + '$' + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtNum = (v, dec = 2) => v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmtCompact = (v) => {
  if (Math.abs(v) >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
  if (Math.abs(v) >= 1e3) return '$' + (v / 1e3).toFixed(1) + 'K';
  return fmtUSD(v);
};
const fmtPct = (v, dec = 2) => (v >= 0 ? '+' : '') + v.toFixed(dec) + '%';

// Coin "logo" — a colored disc with the ticker
function CoinLogo({ sym, size = 28 }) {
  const c = window.MOCK.COIN_COLORS[sym] || '#666';
  const initial = sym[0];
  return (
    <div
      className="coin-logo"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${c}, ${c}cc)`, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}

function Coin({ sym, sub }) {
  return (
    <div className="coin">
      <CoinLogo sym={sym} />
      <div>
        <div className="coin-name">{window.MOCK.COIN_NAMES[sym] || sym}</div>
        <div className="coin-sym">{sub || sym + '/USDT'}</div>
      </div>
    </div>
  );
}

function Delta({ value, format = 'pct', size = 'sm' }) {
  const cls = value > 0 ? 'gain' : value < 0 ? 'loss' : 'neutral';
  const ic = value > 0 ? '▲' : value < 0 ? '▼' : '·';
  let out;
  if (format === 'pct') out = fmtPct(value);
  else if (format === 'usd') out = (value >= 0 ? '+' : '−') + '$' + Math.abs(value).toFixed(2);
  else out = fmtNum(value);
  return (
    <span className={`delta ${cls}`} style={{ fontSize: size === 'lg' ? 13 : 12 }}>
      <span style={{ fontSize: 8 }}>{ic}</span>{out}
    </span>
  );
}

// Sparkline — simple line, optionally filled. Animates draw on mount.
function Spark({ data, color = '#22c55e', height = 32, fill = true, strokeW = 1.5 }) {
  const ref = React.useRef(null);
  const [w, setW] = React.useState(120);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(() => { if (ref.current) setW(ref.current.clientWidth); });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, height - 4 - ((v - min) / range) * (height - 8)]);
  const path = pts.map(([x, y], i) => (i ? `L${x.toFixed(1)} ${y.toFixed(1)}` : `M${x.toFixed(1)} ${y.toFixed(1)}`)).join(' ');
  const fillPath = `${path} L${w} ${height} L0 ${height} Z`;
  const id = React.useId();
  return (
    <div ref={ref} style={{ width: '100%', height }}>
      <svg className="spark" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`sp-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {fill && <path d={fillPath} fill={`url(#sp-${id})`} stroke="none" />}
        <path d={path} fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Donut/Pie chart with hover. Each slice has color.
function Donut({ data, size = 180, thick = 26, onHover, hoveredKey }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2;
  const inner = r - thick;
  let acc = 0;
  const slices = data.map((d) => {
    const start = acc / total;
    const end   = (acc + d.value) / total;
    acc += d.value;
    const a0 = start * Math.PI * 2 - Math.PI / 2;
    const a1 = end   * Math.PI * 2 - Math.PI / 2;
    const large = end - start > 0.5 ? 1 : 0;
    const x0 = r + r * Math.cos(a0), y0 = r + r * Math.sin(a0);
    const x1 = r + r * Math.cos(a1), y1 = r + r * Math.sin(a1);
    const xi0 = r + inner * Math.cos(a0), yi0 = r + inner * Math.sin(a0);
    const xi1 = r + inner * Math.cos(a1), yi1 = r + inner * Math.sin(a1);
    return {
      ...d,
      d: `M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1} L${xi1} ${yi1} A${inner} ${inner} 0 ${large} 0 ${xi0} ${yi0} Z`,
    };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      {slices.map((s) => (
        <path
          key={s.key}
          d={s.d}
          fill={s.color}
          opacity={hoveredKey == null || hoveredKey === s.key ? 1 : 0.32}
          style={{ transition: 'opacity .2s ease, transform .2s ease', cursor: 'pointer', transformOrigin: `${r}px ${r}px`, transform: hoveredKey === s.key ? 'scale(1.04)' : 'scale(1)' }}
          onMouseEnter={() => onHover && onHover(s.key)}
          onMouseLeave={() => onHover && onHover(null)}
        />
      ))}
    </svg>
  );
}

// Bar chart for income/expense
function BarSet({ data, height = 180 }) {
  const max = Math.max(...data.flatMap((d) => [d.income, d.expense]));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height, padding: '8px 0' }}>
      {data.map((d) => (
        <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: height - 28 }}>
            <div title={`Income: $${d.income}`} style={{
              width: 14, height: `${(d.income / max) * 100}%`,
              background: 'linear-gradient(180deg, var(--gain), color-mix(in srgb, var(--gain) 60%, transparent))',
              borderRadius: '4px 4px 1px 1px', transition: 'height .8s cubic-bezier(.2,.8,.2,1)',
            }} />
            <div title={`Expense: $${d.expense}`} style={{
              width: 14, height: `${(d.expense / max) * 100}%`,
              background: 'linear-gradient(180deg, var(--loss), color-mix(in srgb, var(--loss) 60%, transparent))',
              borderRadius: '4px 4px 1px 1px', transition: 'height .8s cubic-bezier(.2,.8,.2,1)',
            }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-mute)', fontFamily: 'JetBrains Mono, monospace' }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// Animated counter
function Ticker({ value, format = (v) => v.toFixed(2), duration = 600 }) {
  const [v, setV] = React.useState(value);
  const prev = React.useRef(value);
  React.useEffect(() => {
    const start = prev.current;
    const end = value;
    const t0 = performance.now();
    let raf;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - k, 3);
      setV(start + (end - start) * e);
      if (k < 1) raf = requestAnimationFrame(step);
      else prev.current = end;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className="mono">{format(v)}</span>;
}

// Synthetic random walk price feed
function usePriceFeed(initial, volatility = 0.0015) {
  const [prices, setPrices] = React.useState(initial);
  React.useEffect(() => {
    const id = setInterval(() => {
      setPrices((p) => {
        const np = { ...p };
        for (const k of Object.keys(np)) {
          const drift = (Math.random() - 0.5) * 2 * volatility;
          np[k] = Math.max(0.0001, np[k] * (1 + drift));
        }
        return np;
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);
  return prices;
}

// Generate sparkline series
function genSeries(seed, n = 30, base = 100, vol = 0.04, trend = 0.002) {
  let s = seed;
  const rng = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const out = [base];
  for (let i = 1; i < n; i++) {
    const r = (rng() - 0.5) * 2 * vol + trend;
    out.push(Math.max(0.01, out[i - 1] * (1 + r)));
  }
  return out;
}

window.UI = { fmtUSD, fmtNum, fmtCompact, fmtPct, CoinLogo, Coin, Delta, Spark, Donut, BarSet, Ticker, usePriceFeed, genSeries };
