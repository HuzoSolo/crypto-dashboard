// Goals + Income/Expense + Tax pages

function Goals({ goals, setGoals }) {
  const [showNew, setShowNew] = React.useState(false);

  const onTrack = (g) => {
    const dl = new Date(g.deadline);
    const now = new Date('2026-05-05');
    const total = (dl - new Date('2026-01-01')) / 86400000;
    const elapsed = (now - new Date('2026-01-01')) / 86400000;
    const expected = (elapsed / total) * 100;
    const actual = (g.current / g.target) * 100;
    return actual >= expected - 8;
  };

  return (
    <div className="content">
      <div className="page-title">
        <h1>Hedefler</h1>
        <span className="sub">{goals.length} aktif hedef · {goals.filter((g) => !onTrack(g)).length} risk altında</span>
      </div>

      <div className="card" style={{ padding: 14 }}>
        <div className="toolbar">
          <button className="chip active">Aktif ({goals.length})</button>
          <button className="chip">Tamamlanmış (2)</button>
          <button className="chip">Arşiv</button>
          <span className="spacer" />
          <button className="btn primary" onClick={() => setShowNew(true)}><window.I.plus size={13} />Yeni Hedef</button>
        </div>
      </div>

      <div className="grid bento-2">
        {goals.map((g) => {
          const pct = Math.min(100, (g.current / g.target) * 100);
          const ok = onTrack(g);
          return (
            <div key={g.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-mute)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                    <window.I.target size={11} />
                    Hedef · {g.priority === 'high' ? 'Yüksek' : g.priority === 'med' ? 'Orta' : 'Düşük'} öncelik
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 600, marginTop: 4, letterSpacing: '-0.01em' }}>{g.name}</div>
                </div>
                {ok ? <span className="badge live"><span className="dot" />Hedefe uygun</span>
                    : <span className="badge warn"><window.I.alert size={10} />Risk altında</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 18, whiteSpace: 'nowrap', flexWrap: 'nowrap' }}>
                <div className="mono" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
                  ${g.current.toLocaleString()}
                </div>
                <div className="mono" style={{ color: 'var(--text-mute)', fontSize: 13 }}>
                  / ${g.target.toLocaleString()}
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600 }} className="mono">
                  {pct.toFixed(0)}%
                </div>
              </div>

              <div className={`progress ${!ok ? 'warn' : ''}`} style={{ marginTop: 10, height: 8 }}>
                <span style={{ width: pct + '%' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 12, color: 'var(--text-dim)', gap: 12 }}>
                <div style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-mute)' }}>Son tarih</div>
                  <div className="mono" style={{ marginTop: 2, fontWeight: 500 }}>{g.deadline}</div>
                </div>
                <div style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-mute)' }}>Tahmini</div>
                  <div className="mono" style={{ marginTop: 2, fontWeight: 500 }}>
                    {ok ? '~' + new Date(new Date(g.deadline).getTime() - 12 * 86400000).toISOString().slice(0, 10) : 'Gecikme'}
                  </div>
                </div>
                <div style={{ whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-mute)' }}>Kalan</div>
                  <div className="mono" style={{ marginTop: 2, fontWeight: 500 }}>${(g.target - g.current).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn icon ghost"><window.I.edit size={13} /></button>
                  <button className="btn icon ghost" style={{ color: 'var(--loss)' }}><window.I.trash size={13} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Yeni Hedef</h2>
            <div className="sub">Bir kâr hedefi belirle ve ilerlemeyi takip et</div>
            <div className="field"><label>Hedef adı</label><input className="input" placeholder="Örn: 2026 Yıl Sonu Kâr" /></div>
            <div className="field-row">
              <div className="field"><label>Hedef miktar (USD)</label><input className="input mono" placeholder="10000" /></div>
              <div className="field"><label>Son tarih</label><input className="input" type="date" defaultValue="2026-12-31" /></div>
            </div>
            <div className="field"><label>Öncelik</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Yüksek', 'Orta', 'Düşük'].map((p) => <button key={p} type="button" className="chip" style={{ flex: 1 }}>{p}</button>)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowNew(false)}>İptal</button>
              <button className="btn primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowNew(false)}>Hedef Oluştur</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IncomeExpense({ entries }) {
  const [filter, setFilter] = React.useState('all');
  const filtered = entries.filter((e) => filter === 'all' || e.type === filter);
  const income = entries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const expense = entries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const net = income - expense;

  const cats = [...new Set(entries.map((e) => e.category))];
  const catTotals = cats.map((c) => ({
    cat: c,
    total: entries.filter((e) => e.category === c).reduce((s, e) => s + (e.type === 'expense' ? e.amount : 0), 0),
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="content">
      <div className="page-title">
        <h1>Gelir & Gider</h1>
        <span className="sub">Aylık takip · CSV dışa aktarım</span>
      </div>

      <div className="grid bento-row">
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>Toplam Gelir</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--gain)', marginTop: 4 }}>+${income.toFixed(2)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>Bu ay · 4 işlem</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>Toplam Gider</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--loss)', marginTop: 4 }}>-${expense.toFixed(2)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>Bu ay · 5 işlem</div>
        </div>
        <div className="card hero-card" style={{ padding: 18 }}>
          <div className="hero-meta">Aylık Net</div>
          <div className="mono" style={{ fontSize: 26, fontWeight: 600, marginTop: 4 }}>+${net.toFixed(0)}</div>
          <div style={{ fontSize: 11, opacity: .85, marginTop: 2 }}>Tasarruf oranı: %{((net / income) * 100).toFixed(0)}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>Yıllık Tahmin</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>+${(net * 12).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>12 aylık projeksiyon</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: 14, display: 'flex', gap: 8, alignItems: 'center', borderBottom: '1px solid var(--border-soft)' }}>
            <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tümü</button>
            <button className={`chip ${filter === 'income' ? 'active' : ''}`} onClick={() => setFilter('income')}>Gelir</button>
            <button className={`chip ${filter === 'expense' ? 'active' : ''}`} onClick={() => setFilter('expense')}>Gider</button>
            <span className="spacer" />
            <button className="btn"><window.I.download size={13} />CSV</button>
            <button className="btn primary"><window.I.plus size={13} />Yeni Kayıt</button>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Tip</th>
                <th>Kategori</th>
                <th>Açıklama</th>
                <th style={{ textAlign: 'right' }}>Miktar</th>
                <th>Para Birimi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td className="num" style={{ color: 'var(--text-dim)' }}>{e.date}</td>
                  <td><span className={`badge ${e.type === 'income' ? 'buy' : 'sell'}`}>{e.type === 'income' ? '↗ Gelir' : '↘ Gider'}</span></td>
                  <td>{e.category}</td>
                  <td style={{ color: 'var(--text-dim)' }}>{e.desc}</td>
                  <td className="num" style={{ textAlign: 'right', fontWeight: 600, color: e.type === 'income' ? 'var(--gain)' : 'var(--loss)' }}>
                    {e.type === 'income' ? '+' : '−'}${e.amount.toFixed(2)}
                  </td>
                  <td><span className="badge">{e.ccy}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Gider Kategorileri</div>
              <div className="card-sub">Bu ay</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {catTotals.map((c, i) => {
              const pct = (c.total / expense) * 100;
              return (
                <div key={c.cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{c.cat}</span>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--text-dim)' }}>${c.total.toFixed(0)} <span style={{ color: 'var(--text-mute)' }}>({pct.toFixed(0)}%)</span></span>
                  </div>
                  <div className="progress" style={{ height: 4 }}><span style={{ width: pct + '%' }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tax({ lots }) {
  const [rate, setRate] = React.useState(20);
  const realized = lots.reduce((s, l) => s + l.pnl, 0);
  const taxable = lots.filter((l) => l.pnl > 0).reduce((s, l) => s + l.pnl, 0);
  const tax = (taxable * rate) / 100;
  const losses = lots.filter((l) => l.pnl < 0).reduce((s, l) => s + l.pnl, 0);

  return (
    <div className="content">
      <div className="page-title">
        <h1>Vergi</h1>
        <span className="sub">FIFO bazlı gerçekleşmiş kâr/zarar · 2026 yılı</span>
      </div>

      <div className="grid bento-row">
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>Gerçekleşmiş P&L</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4, color: realized >= 0 ? 'var(--gain)' : 'var(--loss)' }}>
            {realized >= 0 ? '+' : '−'}${Math.abs(realized).toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>{lots.length} kapatılan pozisyon</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>Vergiye Tabi Kâr</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>${taxable.toFixed(2)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>Yalnızca pozitif lotlar</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>Mahsup Edilebilir Zarar</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--loss)', marginTop: 4 }}>${losses.toFixed(2)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>İleriye taşınabilir</div>
        </div>
        <div className="card hero-card">
          <div className="hero-meta">Tahmini Vergi</div>
          <div className="mono" style={{ fontSize: 26, fontWeight: 600, marginTop: 4 }}>${tax.toFixed(2)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 11, opacity: .85 }}>Oran:</span>
            <input
              type="range" min="0" max="50" step="1" value={rate}
              onChange={(e) => setRate(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: '#fff' }}
            />
            <span className="mono" style={{ fontWeight: 600 }}>%{rate}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: 14, display: 'flex', gap: 8, alignItems: 'center', borderBottom: '1px solid var(--border-soft)' }}>
          <span className="badge info">FIFO</span>
          <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>İlk giren ilk çıkar yöntemi · {lots.length} satılmış lot</span>
          <span className="spacer" />
          <select className="select"><option>2026</option><option>2025</option></select>
          <button className="btn"><window.I.download size={13} />CSV İndir</button>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Coin</th>
              <th style={{ textAlign: 'right' }}>Adet</th>
              <th style={{ textAlign: 'right' }}>Alış Fiyatı</th>
              <th style={{ textAlign: 'right' }}>Satış Fiyatı</th>
              <th style={{ textAlign: 'right' }}>P&L</th>
              <th style={{ textAlign: 'right' }}>Vergi (%{rate})</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((l, i) => {
              const taxLot = l.pnl > 0 ? (l.pnl * rate / 100) : 0;
              return (
                <tr key={i}>
                  <td className="num" style={{ color: 'var(--text-dim)' }}>{l.date}</td>
                  <td><window.UI.Coin sym={l.coin} /></td>
                  <td className="num" style={{ textAlign: 'right' }}>{l.qty}</td>
                  <td className="num" style={{ textAlign: 'right' }}>${l.buyP.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                  <td className="num" style={{ textAlign: 'right' }}>${l.sellP.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}><window.UI.Delta value={l.pnl} format="usd" /></td>
                  <td className="num" style={{ textAlign: 'right', fontWeight: 600, color: taxLot > 0 ? 'var(--text)' : 'var(--text-mute)' }}>
                    {taxLot > 0 ? '$' + taxLot.toFixed(2) : '—'}
                  </td>
                </tr>
              );
            })}
            <tr style={{ background: 'var(--bg-card-2)', fontWeight: 600 }}>
              <td colSpan="5" style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Toplam</td>
              <td style={{ textAlign: 'right' }}><window.UI.Delta value={realized} format="usd" /></td>
              <td className="num" style={{ textAlign: 'right' }}>${tax.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.Goals = Goals;
window.IncomeExpense = IncomeExpense;
window.Tax = Tax;
