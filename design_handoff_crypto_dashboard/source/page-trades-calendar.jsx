// Trades + Calendar pages

function Trades({ trades, addTrade, deleteTrade }) {
  const { Coin, Delta } = window.UI;
  const [filter, setFilter] = React.useState('all');
  const [showForm, setShowForm] = React.useState(false);

  const filtered = trades.filter((t) => filter === 'all' || t.type === filter);
  const totalPnl = filtered.reduce((s, t) => s + t.pnl, 0);

  return (
    <div className="content">
      <div className="page-title">
        <h1>İşlemler</h1>
        <span className="sub">{trades.length} işlem · Toplam P&L <Delta value={totalPnl} format="usd" size="lg" /></span>
      </div>

      <div className="card" style={{ padding: 14 }}>
        <div className="toolbar">
          <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tümü ({trades.length})</button>
          <button className={`chip ${filter === 'buy' ? 'active' : ''}`} onClick={() => setFilter('buy')}>Alış ({trades.filter(t => t.type === 'buy').length})</button>
          <button className={`chip ${filter === 'sell' ? 'active' : ''}`} onClick={() => setFilter('sell')}>Satış ({trades.filter(t => t.type === 'sell').length})</button>
          <span style={{ fontSize: 11, color: 'var(--text-mute)', marginLeft: 12 }}>Coin:</span>
          <select className="select" defaultValue="">
            <option value="">Tümü</option>
            {[...new Set(trades.map(t => t.coin))].map(c => <option key={c}>{c}</option>)}
          </select>
          <input className="input" type="date" defaultValue="2026-04-01" />
          <span style={{ color: 'var(--text-mute)', fontSize: 11 }}>→</span>
          <input className="input" type="date" defaultValue="2026-05-05" />
          <span className="spacer" />
          <button className="btn"><window.I.download size={13} />CSV</button>
          <button className="btn primary" onClick={() => setShowForm(true)}><window.I.plus size={13} />Yeni İşlem</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Coin</th>
              <th>Tip</th>
              <th style={{ textAlign: 'right' }}>Adet</th>
              <th style={{ textAlign: 'right' }}>Fiyat</th>
              <th style={{ textAlign: 'right' }}>Toplam</th>
              <th>Borsa</th>
              <th>Not</th>
              <th style={{ textAlign: 'right' }}>P&L</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td className="num" style={{ color: 'var(--text-dim)' }}>{t.date}</td>
                <td><Coin sym={t.coin} /></td>
                <td><span className={`badge ${t.type}`}>{t.type === 'buy' ? '↗ Alış' : '↘ Satış'}</span></td>
                <td className="num" style={{ textAlign: 'right' }}>{t.qty}</td>
                <td className="num" style={{ textAlign: 'right' }}>${t.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                <td className="num" style={{ textAlign: 'right', fontWeight: 600 }}>${(t.qty * t.price).toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                <td><span className="badge">{t.exchange}</span></td>
                <td style={{ color: 'var(--text-dim)', fontSize: 12, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.note || '—'}</td>
                <td style={{ textAlign: 'right' }}><Delta value={t.pnl} format="usd" /></td>
                <td>
                  <button className="btn icon ghost" onClick={() => deleteTrade(t.id)} style={{ color: 'var(--loss)' }}><window.I.trash size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <TradeForm onClose={() => setShowForm(false)} onSubmit={(t) => { addTrade(t); setShowForm(false); }} />}
    </div>
  );
}

function TradeForm({ onClose, onSubmit }) {
  const [form, setForm] = React.useState({
    date: '2026-05-05', coin: 'BTC', type: 'buy', qty: '', price: '', exchange: 'Binance', note: '',
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      id: 't' + Date.now(),
      ...form,
      qty: parseFloat(form.qty) || 0,
      price: parseFloat(form.price) || 0,
      pnl: (Math.random() * 200 - 50),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Yeni İşlem</h2>
            <div className="sub">Manuel olarak işlem kaydı ekle</div>
          </div>
          <button type="button" className="btn ghost icon" onClick={onClose}><window.I.x size={16} /></button>
        </div>

        <div className="field-row">
          <div className="field"><label>Tarih</label><input className="input" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></div>
          <div className="field"><label>Coin</label>
            <select className="select" value={form.coin} onChange={(e) => set('coin', e.target.value)}>
              {Object.keys(window.MOCK.INITIAL_PRICES).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="field"><label>Tip</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => set('type', 'buy')} className={`btn ${form.type === 'buy' ? 'primary' : ''}`} style={{ flex: 1, justifyContent: 'center' }}>↗ Alış</button>
            <button type="button" onClick={() => set('type', 'sell')} className="btn" style={{ flex: 1, justifyContent: 'center', background: form.type === 'sell' ? 'var(--loss)' : '', color: form.type === 'sell' ? '#fff' : '', borderColor: form.type === 'sell' ? 'var(--loss)' : '' }}>↘ Satış</button>
          </div>
        </div>

        <div className="field-row">
          <div className="field"><label>Adet</label><input className="input mono" required placeholder="0.00" value={form.qty} onChange={(e) => set('qty', e.target.value)} /></div>
          <div className="field"><label>Fiyat (USD)</label><input className="input mono" required placeholder="0.00" value={form.price} onChange={(e) => set('price', e.target.value)} /></div>
        </div>

        <div className="field"><label>Borsa</label>
          <select className="select" value={form.exchange} onChange={(e) => set('exchange', e.target.value)}>
            <option>Binance</option><option>Coinbase</option><option>Kraken</option><option>OKX</option><option>Bybit</option>
          </select>
        </div>

        <div className="field"><label>Not (opsiyonel)</label>
          <textarea className="input" rows="2" value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Strateji, sinyal, gözlem…" />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <button type="button" className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>İptal</button>
          <button type="submit" className="btn primary" style={{ flex: 1, justifyContent: 'center' }}>Kaydet</button>
        </div>
      </form>
    </div>
  );
}

// Calendar
function Calendar({ trades }) {
  const [month, setMonth] = React.useState(4); // May (0-idx)
  const year = 2026;
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const dow = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = 5; // hard-coded "today" = May 5

  const events = {};
  trades.forEach((t) => {
    const d = new Date(t.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      events[day] = events[day] || [];
      events[day].push({ type: t.type, label: `${t.type === 'buy' ? 'Alış' : 'Satış'} ${t.coin}`, qty: t.qty });
    }
  });
  // Custom notes
  events[8] = (events[8] || []).concat([{ type: 'note', label: 'BTC ETF kararı' }]);
  events[14] = (events[14] || []).concat([{ type: 'note', label: 'CPI verisi' }]);
  events[20] = (events[20] || []).concat([{ type: 'note', label: 'FOMC tutanak' }]);

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);

  const [picked, setPicked] = React.useState(null);
  const [showNew, setShowNew] = React.useState(false);

  return (
    <div className="content">
      <div className="page-title">
        <h1>Takvim</h1>
        <span className="sub">İşlemler ve etkinlikler · {monthNames[month]} {year}</span>
      </div>

      <div className="card" style={{ padding: 14 }}>
        <div className="toolbar">
          <button className="btn icon" onClick={() => setMonth((m) => (m + 11) % 12)}><window.I.chevL size={14} /></button>
          <div style={{ minWidth: 140, textAlign: 'center', fontWeight: 600 }}>{monthNames[month]} {year}</div>
          <button className="btn icon" onClick={() => setMonth((m) => (m + 1) % 12)}><window.I.chevR size={14} /></button>
          <button className="btn sm" onClick={() => setMonth(4)}>Bugün</button>
          <span className="spacer" />
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-mute)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent)' }} />Alış</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--loss)' }} />Satış</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--info)' }} />Etkinlik</span>
          </div>
          <button className="btn primary" onClick={() => setShowNew(true)}><window.I.plus size={13} />Etkinlik Ekle</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="cal-grid">
          {dow.map((d) => <div key={d} className="cal-head">{d}</div>)}
          {cells.map((d, i) => (
            <div key={i} className={`cal-day ${d == null ? 'muted' : ''} ${d === today && month === 4 ? 'today' : ''}`} onClick={() => d && setPicked(d)}>
              {d != null && <div className="dnum">{d}</div>}
              {d != null && (events[d] || []).slice(0, 3).map((e, j) => (
                <div key={j} className={`cal-evt ${e.type === 'sell' ? 'sell' : e.type === 'note' ? 'note' : ''}`}>{e.label}</div>
              ))}
              {d != null && (events[d] || []).length > 3 && (
                <div style={{ fontSize: 10, color: 'var(--text-mute)' }}>+{(events[d] || []).length - 3} daha</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {(picked != null) && (
        <div className="modal-backdrop" onClick={() => setPicked(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h2>{picked} {monthNames[month]} {year}</h2>
                <div className="sub">{(events[picked] || []).length} etkinlik</div>
              </div>
              <button className="btn ghost icon" onClick={() => setPicked(null)}><window.I.x size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(events[picked] || []).map((e, i) => (
                <div key={i} className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={`badge ${e.type === 'sell' ? 'sell' : e.type === 'note' ? 'info' : 'buy'}`}>
                    {e.type === 'note' ? 'Etkinlik' : e.type === 'buy' ? 'Alış' : 'Satış'}
                  </span>
                  <span style={{ fontWeight: 500 }}>{e.label}</span>
                  {e.qty && <span className="mono" style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-dim)' }}>{e.qty}</span>}
                </div>
              ))}
              {(!events[picked] || events[picked].length === 0) && (
                <div style={{ color: 'var(--text-mute)', fontSize: 13, padding: 12 }}>Bu güne ait kayıt yok.</div>
              )}
            </div>
            <button className="btn primary" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
              <window.I.plus size={13} />Bu güne etkinlik ekle
            </button>
          </div>
        </div>
      )}

      {showNew && (
        <div className="modal-backdrop" onClick={() => setShowNew(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Yeni Etkinlik</h2>
            <div className="sub">Hatırlatma, haber veya not ekle</div>
            <div className="field"><label>Başlık</label><input className="input" placeholder="Örn: BTC halving" /></div>
            <div className="field-row">
              <div className="field"><label>Tarih</label><input className="input" type="date" defaultValue="2026-05-15" /></div>
              <div className="field"><label>Kategori</label>
                <select className="select"><option>Haber</option><option>Hatırlatma</option><option>Etkinlik</option></select>
              </div>
            </div>
            <div className="field"><label>Notlar</label><textarea className="input" rows="3" /></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowNew(false)}>İptal</button>
              <button className="btn primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowNew(false)}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.Trades = Trades;
window.Calendar = Calendar;
