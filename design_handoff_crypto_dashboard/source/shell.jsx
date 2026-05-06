// Sidebar + Header + theme handling
const NAV = [
  { id: 'dashboard',     label: 'Ana Sayfa',      icon: 'home' },
  { id: 'watchlist',     label: 'Varlık Listesi', icon: 'list' },
  { id: 'portfolio',     label: 'Cüzdan',         icon: 'wallet' },
  { id: 'trades',        label: 'İşlemler',       icon: 'swap' },
  { id: 'calendar',      label: 'Takvim',         icon: 'calendar' },
  { id: 'goals',         label: 'Hedefler',       icon: 'target' },
  { id: 'income-expense',label: 'Gelir-Gider',    icon: 'bar' },
  { id: 'tax',           label: 'Vergi',          icon: 'receipt' },
];

function Sidebar({ active, onNav, totalValue, totalDelta }) {
  const { Coin: _, fmtUSD, Delta } = window.UI;
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">₿</div>
        <div className="brand-text">
          <div className="brand-name">Cryptolio</div>
          <div className="brand-sub">Personal tracker</div>
        </div>
      </div>

      <div className="nav-group-label">Genel</div>
      {NAV.slice(0, 5).map((item) => {
        const Ic = window.I[item.icon];
        return (
          <div
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <Ic className="nav-icon" />
            <span className="nav-label">{item.label}</span>
            {item.id === 'trades' && <span className="nav-badge">10</span>}
          </div>
        );
      })}

      <div className="nav-group-label">Finans</div>
      {NAV.slice(5).map((item) => {
        const Ic = window.I[item.icon];
        return (
          <div
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <Ic className="nav-icon" />
            <span className="nav-label">{item.label}</span>
            {item.id === 'goals' && <span className="nav-badge">4</span>}
          </div>
        );
      })}

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="label">Toplam Bakiye</span>
          <span className="pill"><span className="dot" />Live</span>
        </div>
        <div className="value mono">{fmtUSD(totalValue, 0)}</div>
        <div className="row extra">
          <span>24h</span>
          <Delta value={totalDelta} format="pct" />
        </div>
      </div>
    </aside>
  );
}

function Header({ pageTitle, onNav, theme, setTheme }) {
  return (
    <header className="header">
      <div className="header-title">
        <div className="grid-icon"><window.I.grid size={14} /></div>
        <span>{pageTitle}</span>
      </div>
      <div className="search">
        <window.I.search size={14} />
        <input placeholder="Ara: coin, işlem, etiket…" />
        <span style={{ fontSize: 10, color: 'var(--text-mute)', border: '1px solid var(--border-soft)', padding: '1px 5px', borderRadius: 4 }}>⌘K</span>
      </div>
      <div className="header-tools">
        <button className="icon-btn" title="Refresh"><window.I.refresh size={15} /></button>
        <button className="icon-btn" title="Notifications" style={{ position: 'relative' }}>
          <window.I.bell size={15} />
          <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: 'var(--loss)' }} />
        </button>
        <button className="icon-btn" title="Theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <window.I.sun size={15} /> : <window.I.moon size={15} />}
        </button>
        <button className="icon-btn" title="Settings"><window.I.settings size={15} /></button>
        <div className="user-chip">
          <div className="avatar">EK</div>
          <span className="uname">Emre K.</span>
          <span className="plan-badge"><window.I.check size={10} /></span>
          <window.I.chevDn size={12} style={{ color: 'var(--text-mute)', marginRight: 4 }} />
        </div>
      </div>
    </header>
  );
}

window.Shell = { Sidebar, Header, NAV };
