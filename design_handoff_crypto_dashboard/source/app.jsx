// Login + main App shell

function Login({ onLogin }) {
  const [email, setEmail] = React.useState('emre@cryptolio.app');
  const [pw, setPw] = React.useState('••••••••');
  const submit = (e) => { e.preventDefault(); onLogin(); };
  return (
    <div className="login-shell">
      <div className="login-side">
        <div className="lg-brand">
          <div className="brand-logo">₿</div>
          Cryptolio
        </div>
        <div>
          <div className="lg-headline">Tüm portföyün, tek bir sade panelde.</div>
          <div className="lg-sub">Canlı fiyatlar, işlem günlüğü, hedefler ve FIFO bazlı vergi hesabı — hepsi tek pencerede.</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
            {[
              { v: '$142K', l: 'Toplam Hacim' },
              { v: '8.4K', l: 'Aktif Kullanıcı' },
              { v: '%99.9', l: 'Uptime' },
            ].map((s) => (
              <div key={s.l}>
                <div className="mono" style={{ fontSize: 22, fontWeight: 600 }}>{s.v}</div>
                <div style={{ fontSize: 11, opacity: .7 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11, opacity: .5 }}>© 2026 Cryptolio · Personal use</div>
      </div>
      <div className="login-form-wrap">
        <form className="login-form" onSubmit={submit}>
          <h1>Hoş geldin</h1>
          <div className="sub">Devam etmek için hesabına giriş yap</div>
          <div className="field"><label>E-posta</label>
            <div className="input" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
              <window.I.mail size={14} style={{ color: 'var(--text-mute)' }} />
              <input style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)', padding: '9px 0', fontSize: 13 }}
                     value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="field"><label>Şifre</label>
            <div className="input" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
              <window.I.lock size={14} style={{ color: 'var(--text-mute)' }} />
              <input type="password" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)', padding: '9px 0', fontSize: 13 }}
                     value={pw} onChange={(e) => setPw(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" defaultChecked />Beni hatırla
            </label>
            <a href="#" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>Şifremi unuttum</a>
          </div>
          <button className="btn primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 14 }}>
            Giriş Yap <window.I.arrowR size={14} />
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-mute)', marginTop: 16 }}>
            Hesabın yok mu? <a href="#" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Kayıt ol</a>
          </div>
        </form>
      </div>
    </div>
  );
}

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  watchlist: 'Varlık Listesi',
  portfolio: 'Cüzdan',
  trades: 'İşlem Günlüğü',
  calendar: 'Takvim',
  goals: 'Hedefler',
  'income-expense': 'Gelir & Gider',
  tax: 'Vergi',
};

function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "theme": "dark",
    "accent": "emerald",
    "compact": false,
    "monoNumbers": true,
    "liveFeed": true
  }/*EDITMODE-END*/;

  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [loggedIn, setLoggedIn] = React.useState(true);
  const [route, setRoute] = React.useState('dashboard');
  const [holdings, setHoldings] = React.useState(window.MOCK.INITIAL_HOLDINGS);
  const [trades, setTrades] = React.useState(window.MOCK.TRADES);
  const [goals, setGoals] = React.useState(window.MOCK.GOALS);

  // Apply theme + accent
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    const accents = {
      emerald: { a: '#16a34a', b: '#0a6e34' },
      indigo:  { a: '#6366f1', b: '#4338ca' },
      amber:   { a: '#f59e0b', b: '#b45309' },
      rose:    { a: '#e11d48', b: '#9f1239' },
    };
    const ac = accents[tweaks.accent] || accents.emerald;
    document.documentElement.style.setProperty('--accent', ac.a);
    document.documentElement.style.setProperty('--accent-grad-1', ac.a);
    document.documentElement.style.setProperty('--accent-grad-2', ac.b);
    document.documentElement.style.setProperty('--accent-soft', ac.a + '22');
  }, [tweaks.theme, tweaks.accent]);

  // Live price feed
  const prevPricesRef = React.useRef(window.MOCK.INITIAL_PRICES);
  const prices = tweaks.liveFeed
    ? window.UI.usePriceFeed(window.MOCK.INITIAL_PRICES, 0.0018)
    : window.MOCK.INITIAL_PRICES;

  React.useEffect(() => { prevPricesRef.current = prices; }, [prices]);
  const prevPrices = prevPricesRef.current;

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  const totalValue = holdings.reduce((s, h) => s + prices[h.sym] * h.qty, 0);

  let page;
  if (route === 'dashboard')           page = <window.Dashboard prices={prices} holdings={holdings} onNav={setRoute} />;
  else if (route === 'watchlist')      page = <window.Watchlist prices={prices} prevPrices={prevPrices} />;
  else if (route === 'portfolio')      page = <window.Portfolio prices={prices} holdings={holdings} setHoldings={setHoldings} />;
  else if (route === 'trades')         page = <window.Trades trades={trades}
                                                              addTrade={(t) => setTrades([t, ...trades])}
                                                              deleteTrade={(id) => setTrades(trades.filter((x) => x.id !== id))} />;
  else if (route === 'calendar')       page = <window.Calendar trades={trades} />;
  else if (route === 'goals')          page = <window.Goals goals={goals} setGoals={setGoals} />;
  else if (route === 'income-expense') page = <window.IncomeExpense entries={window.MOCK.INCOME_EXPENSE} />;
  else if (route === 'tax')            page = <window.Tax lots={window.MOCK.TAX_LOTS} />;

  return (
    <div className="app" style={tweaks.compact ? { fontSize: 13 } : null}>
      <window.Shell.Sidebar
        active={route}
        onNav={setRoute}
        totalValue={totalValue}
        totalDelta={2.34}
      />
      <div className="main">
        <window.Shell.Header
          pageTitle={PAGE_TITLES[route]}
          onNav={setRoute}
          theme={tweaks.theme}
          setTheme={(t) => setTweak('theme', t)}
        />
        {/* re-mount on route change to fire fade animation */}
        <div key={route} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {page}
        </div>
      </div>

      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="Görünüm">
            <window.TweakRadio label="Tema" value={tweaks.theme} options={[{ value: 'dark', label: 'Koyu' }, { value: 'light', label: 'Açık' }]}
                               onChange={(v) => setTweak('theme', v)} />
            <window.TweakRadio label="Vurgu Rengi" value={tweaks.accent}
                               options={[
                                 { value: 'emerald', label: 'Yeşil' },
                                 { value: 'indigo',  label: 'Mor' },
                                 { value: 'amber',   label: 'Amber' },
                                 { value: 'rose',    label: 'Gül' },
                               ]}
                               onChange={(v) => setTweak('accent', v)} />
            <window.TweakToggle label="Kompakt yoğunluk" value={tweaks.compact} onChange={(v) => setTweak('compact', v)} />
          </window.TweakSection>
          <window.TweakSection title="Veri">
            <window.TweakToggle label="Canlı fiyat akışı" value={tweaks.liveFeed} onChange={(v) => setTweak('liveFeed', v)} />
            <window.TweakToggle label="Monospace sayılar" value={tweaks.monoNumbers} onChange={(v) => setTweak('monoNumbers', v)} />
          </window.TweakSection>
          <window.TweakSection title="Hesap">
            <window.TweakButton label="Çıkış yap" onClick={() => setLoggedIn(false)} />
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

window.App = App;
