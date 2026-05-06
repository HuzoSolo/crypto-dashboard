// Watchlist page
function Watchlist({ prices, prevPrices }) {
  const { Coin, Delta, Spark, fmtUSD, fmtPct, genSeries } = window.UI;
  const { WATCHLIST, COIN_COLORS } = window.MOCK;
  const [interval_, setInterval_] = React.useState('5s');
  const [source, setSource] = React.useState('binance');

  const sparks = React.useMemo(() => {
    const out = {};
    WATCHLIST.forEach((s, i) => { out[s] = genSeries(i + 1, 28, prices[s], 0.025, (i % 2 ? 0.0015 : -0.0008)); });
    return out;
  }, []);

  return (
    <div className="content">
      <div className="page-title">
        <h1>Varlık Listesi</h1>
        <span className="sub">Canlı fiyat takibi · {WATCHLIST.length} sembol</span>
      </div>

      <div className="card" style={{ padding: 14 }}>
        <div className="toolbar">
          <span className="badge live"><span className="dot" />Live</span>
          <span style={{ fontSize: 11, color: 'var(--text-mute)' }}>Yenileme:</span>
          {['2s', '5s', '15s', '60s'].map((i) => (
            <button key={i} className={`chip ${interval_ === i ? 'active' : ''}`} onClick={() => setInterval_(i)}>{i}</button>
          ))}
          <span style={{ fontSize: 11, color: 'var(--text-mute)', marginLeft: 12 }}>Kaynak:</span>
          <button className={`chip ${source === 'binance' ? 'active' : ''}`} onClick={() => setSource('binance')}>Binance</button>
          <button className={`chip ${source === 'coingecko' ? 'active' : ''}`} onClick={() => setSource('coingecko')}>CoinGecko</button>
          <span className="spacer" />
          <button className="btn"><window.I.refresh size={13} />Yenile</button>
          <button className="btn primary"><window.I.plus size={13} />Sembol Ekle</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Sembol</th>
              <th style={{ textAlign: 'right' }}>Fiyat (USDT)</th>
              <th style={{ textAlign: 'right' }}>24s Değişim</th>
              <th>30g Trend</th>
              <th style={{ textAlign: 'right' }}>Hacim 24s</th>
              <th>Kaynak</th>
              <th style={{ width: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {WATCHLIST.map((sym, i) => {
              const p = prices[sym];
              const prev = prevPrices?.[sym] ?? p;
              const flash = p > prev ? 'flash-up' : p < prev ? 'flash-dn' : '';
              const change = (Math.sin(i * 1.7) * 4.2);
              const vol = (Math.abs(Math.sin(i)) * 18 + 2).toFixed(1);
              return (
                <tr key={sym}>
                  <td><Coin sym={sym} /></td>
                  <td className={`num ${flash}`} style={{ textAlign: 'right', fontWeight: 600 }}>
                    ${p < 1 ? p.toFixed(4) : p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'right' }}><Delta value={change} /></td>
                  <td><Spark data={sparks[sym]} color={change >= 0 ? '#22c55e' : '#f43f5e'} height={32} /></td>
                  <td className="num" style={{ textAlign: 'right', color: 'var(--text-dim)' }}>${vol}B</td>
                  <td><span className="badge info">{source === 'binance' ? 'Binance' : 'CoinGecko'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="btn icon ghost" title="Edit"><window.I.edit size={13} /></button>
                      <button className="btn icon ghost" title="Remove" style={{ color: 'var(--loss)' }}><window.I.trash size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
window.Watchlist = Watchlist;

// Portfolio page
function Portfolio({ prices, holdings, setHoldings }) {
  const { Coin, Delta, Donut, fmtUSD, Spark, genSeries } = window.UI;
  const { COIN_COLORS } = window.MOCK;

  const positions = holdings.map((h) => ({
    ...h, price: prices[h.sym], value: prices[h.sym] * h.qty, cost: h.avg * h.qty,
    pnl: (prices[h.sym] - h.avg) * h.qty, pnlPct: ((prices[h.sym] - h.avg) / h.avg) * 100,
  }));
  const total = positions.reduce((s, p) => s + p.value, 0);
  const totalCost = positions.reduce((s, p) => s + p.cost, 0);

  const donut = positions.map((p) => ({ key: p.sym, value: p.value, color: COIN_COLORS[p.sym] }));
  const [hovered, setHovered] = React.useState(null);

  const sparks = React.useMemo(() => {
    const out = {};
    holdings.forEach((h, i) => { out[h.sym] = genSeries(i * 7 + 3, 24, h.avg, 0.02, 0.001 * (i % 3 - 1)); });
    return out;
  }, []);

  const updateQty = (sym, qty) => {
    setHoldings((arr) => arr.map((h) => (h.sym === sym ? { ...h, qty: parseFloat(qty) || 0 } : h)));
  };

  return (
    <div className="content">
      <div className="page-title">
        <h1>Cüzdan</h1>
        <span className="sub">{positions.length} pozisyon · maliyet ${totalCost.toFixed(0)}</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        <div className="card hero-card">
          <div className="hero-meta">Toplam Cüzdan Değeri</div>
          <div className="hero-value mono">${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12, marginTop: 6 }}>
            <div>
              <div style={{ opacity: .8 }}>Maliyet</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>${totalCost.toFixed(0)}</div>
            </div>
            <div>
              <div style={{ opacity: .8 }}>Açık P&L</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>+${(total - totalCost).toFixed(0)} ({(((total - totalCost) / totalCost) * 100).toFixed(1)}%)</div>
            </div>
            <div>
              <div style={{ opacity: .8 }}>Pozisyon</div>
              <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{positions.length}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title">Dağılım</div>
            <span style={{ fontSize: 11, color: 'var(--text-mute)' }}>USDT dahil</span>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Donut data={donut} size={140} thick={20} hoveredKey={hovered} onHover={setHovered} />
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none', textAlign: 'center' }}>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>
                  {hovered ? ((donut.find(d => d.key === hovered).value / total) * 100).toFixed(1) + '%' : positions.length + ' coin'}
                </div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
              {donut.map((d) => (
                <div key={d.key} onMouseEnter={() => setHovered(d.key)} onMouseLeave={() => setHovered(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: hovered && hovered !== d.key ? 0.4 : 1, transition: 'opacity .15s ease' }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: d.color }} />
                  <span style={{ fontWeight: 500 }}>{d.key}</span>
                  <span className="mono" style={{ marginLeft: 'auto', color: 'var(--text-dim)' }}>{((d.value / total) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Asset cards */}
      <div className="grid bento-3">
        {positions.map((p) => (
          <div key={p.sym} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <Coin sym={p.sym} />
              <Delta value={p.pnlPct} />
            </div>
            <Spark data={sparks[p.sym]} color={p.pnl >= 0 ? '#22c55e' : '#f43f5e'} height={36} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-mute)' }}>Adet</div>
                <input
                  className="input mono"
                  value={p.qty}
                  onChange={(e) => updateQty(p.sym, e.target.value)}
                  style={{ width: '100%', marginTop: 2, fontSize: 13, padding: '5px 8px' }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-mute)' }}>Fiyat</div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>
                  ${p.price < 1 ? p.price.toFixed(4) : p.price.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-mute)' }}>Toplam Değer</div>
                <div className="mono" style={{ fontSize: 16, fontWeight: 600 }}>${p.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'var(--text-mute)' }}>Açık P&L</div>
                <div className="mono" style={{ fontSize: 13, fontWeight: 600, color: p.pnl >= 0 ? 'var(--gain)' : 'var(--loss)' }}>
                  {p.pnl >= 0 ? '+' : '−'}${Math.abs(p.pnl).toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
window.Portfolio = Portfolio;
