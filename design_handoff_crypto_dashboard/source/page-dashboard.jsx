// Dashboard page
function Dashboard({ prices, holdings, onNav }) {
  const { fmtUSD, fmtCompact, fmtPct, Coin, Delta, Spark, Donut, Ticker, genSeries } = window.UI;
  const { TRADES, GOALS, COIN_COLORS } = window.MOCK;

  const positions = holdings.map((h) => ({ ...h, price: prices[h.sym], value: prices[h.sym] * h.qty, cost: h.avg * h.qty }));
  const totalValue = positions.reduce((s, p) => s + p.value, 0);
  const totalCost  = positions.reduce((s, p) => s + p.cost, 0);
  const change24Pct = 2.34;
  const change24Usd = totalValue * 0.0234;
  const allTimePnl = totalValue - totalCost;
  const allTimePnlPct = (allTimePnl / totalCost) * 100;

  const donutData = positions
    .filter((p) => p.sym !== 'USDT')
    .map((p) => ({ key: p.sym, value: p.value, color: COIN_COLORS[p.sym], label: p.sym }))
    .sort((a, b) => b.value - a.value);
  const cashValue = positions.find((p) => p.sym === 'USDT')?.value || 0;
  donutData.push({ key: 'USDT', value: cashValue, color: COIN_COLORS.USDT, label: 'USDT' });

  const [hovered, setHovered] = React.useState(null);
  const heroSpark = React.useMemo(() => genSeries(7, 60, totalValue * 0.94, 0.012, 0.0008), []);

  const monthlyIncome = 6203.80;
  const monthlyExpense = 2399.00;
  const net = monthlyIncome - monthlyExpense;

  return (
    <div className="content">
      <div className="page-title">
        <h1>Ana Sayfa</h1>
        <span className="sub">Hoş geldin Emre — bugün portföyün <Delta value={change24Pct} /> hareketinde.</span>
      </div>

      {/* Top row: hero + portfolio split */}
      <div className="grid dash-grid">
        <div className="card hero-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="hero-meta">Toplam Portföy Değeri · USD</div>
              <div className="hero-value mono"><Ticker value={totalValue} format={(v) => '$' + v.toLocaleString('en-US', { maximumFractionDigits: 0 })} /></div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                <span style={{ background: '#ffffff20', padding: '2px 8px', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                  +${change24Usd.toFixed(0)}
                </span>
                <span className="mono">{fmtPct(change24Pct)} <span style={{ opacity: .7 }}>· 24s</span></span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="hero-pill"><span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px #fff' }} />Binance · Live</div>
              <div style={{ marginTop: 10, fontSize: 11, opacity: .85 }}>Last sync · 2s ago</div>
            </div>
          </div>

          <div style={{ marginTop: 14, marginBottom: 6, marginLeft: -18, marginRight: -18 }}>
            <Spark data={heroSpark} color="#ffffff" height={60} fill={true} strokeW={2} />
          </div>

          <div className="hero-foot">
            <div>
              <div style={{ fontSize: 11, opacity: .8 }}>Tüm Zaman P&L</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>
                +${allTimePnl.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span style={{ fontSize: 11, opacity: .8 }}>{fmtPct(allTimePnlPct, 1)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: .8 }}>Aylık Net</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>+${net.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: .8 }}>Maliyet</div>
              <div className="mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>${totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
            </div>
            <button className="btn" style={{ background: '#ffffff15', borderColor: '#ffffff20', color: '#fff', backdropFilter: 'blur(8px)' }} onClick={() => onNav('portfolio')}>
              Cüzdana Git <window.I.arrowR size={12} />
            </button>
          </div>
        </div>

        {/* Allocation donut */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Varlık Dağılımı</div>
              <div className="card-sub">{positions.length} pozisyon</div>
            </div>
            <button className="btn ghost sm" onClick={() => onNav('portfolio')}>Detay</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Donut data={donutData} size={150} thick={22} hoveredKey={hovered} onHover={setHovered} />
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none', textAlign: 'center' }}>
                {hovered ? (
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>{hovered}</div>
                    <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{((donutData.find(d => d.key === hovered).value / totalValue) * 100).toFixed(1)}%</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>Toplam</div>
                    <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{fmtCompact(totalValue)}</div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              {donutData.slice(0, 5).map((d) => (
                <div key={d.key} onMouseEnter={() => setHovered(d.key)} onMouseLeave={() => setHovered(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer', opacity: hovered && hovered !== d.key ? 0.5 : 1, transition: 'opacity .15s ease' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                  <span style={{ fontWeight: 500 }}>{d.label}</span>
                  <span className="mono" style={{ marginLeft: 'auto', color: 'var(--text-dim)' }}>
                    {((d.value / totalValue) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid bento-row">
        {[
          { label: 'En İyi Performer', value: 'SOL', delta: +5.84, sub: '+$782.34 · 24s' },
          { label: 'En Kötü Performer', value: 'AVAX', delta: -2.11, sub: '-$52.40 · 24s' },
          { label: 'Bu Ay İşlem', value: '24', sub: '12 alış · 12 satış', delta: null },
          { label: 'Vergiye Tabi Kâr', value: '$2.41K', sub: '2026 yılı · %20 oranı', delta: null },
        ].map((k, i) => (
          <div key={i} className="card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <div className="mono" style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>{k.value}</div>
              {k.delta != null && <Delta value={k.delta} />}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Bottom row: Goals + Recent + Cash */}
      <div className="grid" style={{ gridTemplateColumns: '1.4fr 1.6fr 1fr' }}>
        {/* Goals */}
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Aktif Hedefler</div>
              <div className="card-sub">{GOALS.length} hedef · 1 risk altında</div>
            </div>
            <button className="btn ghost sm" onClick={() => onNav('goals')}>Tümü</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {GOALS.slice(0, 3).map((g) => {
              const pct = (g.current / g.target) * 100;
              const isWarn = g.id === 'g2';
              return (
                <div key={g.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{g.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>
                        Hedef: <span className="mono">${g.target.toLocaleString()}</span> · {g.deadline}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{pct.toFixed(0)}%</div>
                      {isWarn && <span className="badge warn"><window.I.alert size={9} />Risk</span>}
                    </div>
                  </div>
                  <div className={`progress ${isWarn ? 'warn' : ''}`}><span style={{ width: pct + '%' }} /></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent trades */}
        <div className="card" style={{ padding: 0 }}>
          <div className="card-head" style={{ padding: '18px 18px 0' }}>
            <div>
              <div className="card-title">Son İşlemler</div>
              <div className="card-sub">Son 5 hareket</div>
            </div>
            <button className="btn ghost sm" onClick={() => onNav('trades')}>Tümü</button>
          </div>
          <table className="tbl" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>Coin</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>P&L</th>
              </tr>
            </thead>
            <tbody>
              {TRADES.slice(0, 5).map((t) => (
                <tr key={t.id}>
                  <td><Coin sym={t.coin} sub={t.exchange} /></td>
                  <td><span className={`badge ${t.type}`}>{t.type === 'buy' ? 'Alış' : 'Satış'}</span></td>
                  <td className="num" style={{ textAlign: 'right' }}>{t.qty}</td>
                  <td style={{ textAlign: 'right' }}><Delta value={t.pnl} format="usd" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Income/expense + quicknav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Aylık Net</div>
                <div className="card-sub">Mayıs 2026</div>
              </div>
              <window.I.bar size={14} style={{ color: 'var(--text-mute)' }} />
            </div>
            <div className="mono" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
              +${net.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 12 }}>
              <div>
                <div style={{ color: 'var(--text-mute)', fontSize: 11 }}>Gelir</div>
                <div className="mono" style={{ color: 'var(--gain)', fontWeight: 600 }}>${monthlyIncome.toFixed(0)}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-mute)', fontSize: 11 }}>Gider</div>
                <div className="mono" style={{ color: 'var(--loss)', fontWeight: 600 }}>${monthlyExpense.toFixed(0)}</div>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <window.UI.BarSet
                height={56}
                data={[
                  { label: 'Şub', income: 5400, expense: 2700 },
                  { label: 'Mar', income: 5800, expense: 2900 },
                  { label: 'Nis', income: 5200, expense: 2200 },
                  { label: 'May', income: 6200, expense: 2400 },
                ]}
              />
            </div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div className="card-title" style={{ marginBottom: 10 }}>Hızlı Erişim</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { id: 'watchlist', label: 'Varlıklar', icon: 'list' },
                { id: 'trades', label: 'Yeni İşlem', icon: 'plus' },
                { id: 'tax', label: 'Vergi', icon: 'receipt' },
                { id: 'calendar', label: 'Takvim', icon: 'calendar' },
              ].map((q) => {
                const Ic = window.I[q.icon];
                return (
                  <button key={q.id} className="btn" style={{ justifyContent: 'flex-start', padding: '10px' }} onClick={() => onNav(q.id)}>
                    <Ic size={14} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: 12 }}>{q.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.Dashboard = Dashboard;
