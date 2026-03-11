import { useState } from 'react'
import { MONTHS, MONTHS_SHORT, brl, calcShow, newShow, newMonthData } from '../utils/calc'

export default function Shows({ data, onChange }) {
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())

  const monthKey = MONTHS[activeMonth]
  const monthData = data.months?.[monthKey] || newMonthData()
  const shows = monthData.shows || []

  function updateShows(newShows) {
    const updated = {
      ...data,
      months: {
        ...data.months,
        [monthKey]: { ...monthData, shows: newShows }
      }
    }
    onChange(updated)
  }

  function updateShow(id, field, value) {
    updateShows(shows.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  function addShow() {
    updateShows([...shows, newShow()])
  }

  function removeShow(id) {
    const remaining = shows.filter(s => s.id !== id)
    updateShows(remaining.length ? remaining : [newShow()])
  }

  // Totals
  const totals = shows.reduce((acc, s) => {
    const c = calcShow(s)
    return {
      bruto: acc.bruto + c.bruto,
      agencia: acc.agencia + c.agencia,
      liquido: acc.liquido + c.liquido,
      management: acc.management + c.management,
      videomaker: acc.videomaker + c.videomaker,
      jonathan: acc.jonathan + c.jonathan,
      despesasGig: acc.despesasGig + c.despesasGig,
      remanescente: acc.remanescente + c.remanescente,
    }
  }, { bruto:0, agencia:0, liquido:0, management:0, videomaker:0, jonathan:0, despesasGig:0, remanescente:0 })

  const filledMonths = MONTHS.filter(m => {
    const shows = data.months?.[m]?.shows || []
    return shows.some(s => s.evento || +s.cacheBruto > 0)
  })

  return (
    <div>
      {/* Month selector */}
      <div className="month-tabs">
        {MONTHS.map((m, i) => (
          <div
            key={m}
            className={`month-tab ${i === activeMonth ? 'active' : ''} ${filledMonths.includes(m) && i !== activeMonth ? 'has-data' : ''}`}
            onClick={() => setActiveMonth(i)}
          >
            {MONTHS_SHORT[i]}
          </div>
        ))}
      </div>

      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Cachê Bruto</div>
          <div className="kpi-val def">{brl(totals.bruto)}</div>
          <div className="kpi-meta">{shows.filter(s=>s.evento||+s.cacheBruto>0).length} show(s)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Agência (15%)</div>
          <div className="kpi-val neg">{brl(totals.agencia)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Cachê Líquido</div>
          <div className="kpi-val neu">{brl(totals.liquido)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Management (10%)</div>
          <div className="kpi-val neg">{brl(totals.management)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Remanescente</div>
          <div className={`kpi-val ${totals.remanescente >= 0 ? 'pos' : 'neg'}`}>{brl(totals.remanescente)}</div>
        </div>
      </div>

      {/* Shows table */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">Shows — {monthKey} 2026</div>
          <button className="btn btn-primary btn-sm" onClick={addShow}>+ Novo Show</button>
        </div>

        <div className="card-body p0">
          {/* Desktop table */}
          <div className="tbl-wrap" style={{borderRadius:'0 0 12px 12px', border:'none', borderTop:'1px solid var(--border)'}}>
            <table>
              <thead>
                <tr>
                  <th style={{width:50}}>Dia</th>
                  <th>Evento</th>
                  <th>Cidade</th>
                  <th style={{width:60}}>Estado</th>
                  <th style={{width:50}}>País</th>
                  <th>Cachê Bruto</th>
                  <th>Agência 15%</th>
                  <th>Cachê Líquido</th>
                  <th>Management</th>
                  <th>Videomaker</th>
                  <th>Jonathan</th>
                  <th>Extra 01</th>
                  <th>Extra 02</th>
                  <th>Extra 03</th>
                  <th>Remanescente</th>
                  <th style={{width:40}}></th>
                </tr>
              </thead>
              <tbody>
                {shows.map(s => {
                  const c = calcShow(s)
                  return (
                    <tr key={s.id}>
                      <td><input className="tbl-input" style={{width:44}} placeholder="–" value={s.dia} onChange={e => updateShow(s.id,'dia',e.target.value)} /></td>
                      <td><input className="tbl-input" style={{minWidth:160}} placeholder="Nome do evento" value={s.evento} onChange={e => updateShow(s.id,'evento',e.target.value)} /></td>
                      <td><input className="tbl-input" style={{minWidth:110}} placeholder="Cidade" value={s.cidade} onChange={e => updateShow(s.id,'cidade',e.target.value)} /></td>
                      <td><input className="tbl-input" style={{width:54}} placeholder="SP" value={s.estado} onChange={e => updateShow(s.id,'estado',e.target.value.toUpperCase().slice(0,2))} /></td>
                      <td><input className="tbl-input" style={{width:46}} placeholder="BR" value={s.pais} onChange={e => updateShow(s.id,'pais',e.target.value.toUpperCase().slice(0,3))} /></td>
                      <td><input className="tbl-input mono" style={{width:120}} placeholder="0,00" type="number" min="0" value={s.cacheBruto} onChange={e => updateShow(s.id,'cacheBruto',e.target.value)} /></td>
                      <td className="neg" style={{whiteSpace:'nowrap'}}>{brl(c.agencia)}</td>
                      <td className="neu mono" style={{whiteSpace:'nowrap'}}>{brl(c.liquido)}</td>
                      <td className="neg" style={{whiteSpace:'nowrap'}}>{brl(c.management)}</td>
                      <td><input className="tbl-input mono" style={{width:100}} placeholder="0,00" type="number" min="0" value={s.videomaker} onChange={e => updateShow(s.id,'videomaker',e.target.value)} /></td>
                      <td><input className="tbl-input mono" style={{width:100}} placeholder="0,00" type="number" min="0" value={s.jonathan} onChange={e => updateShow(s.id,'jonathan',e.target.value)} /></td>
                      <td><input className="tbl-input mono" style={{width:90}} placeholder="0,00" type="number" min="0" value={s.extra01} onChange={e => updateShow(s.id,'extra01',e.target.value)} /></td>
                      <td><input className="tbl-input mono" style={{width:90}} placeholder="0,00" type="number" min="0" value={s.extra02} onChange={e => updateShow(s.id,'extra02',e.target.value)} /></td>
                      <td><input className="tbl-input mono" style={{width:90}} placeholder="0,00" type="number" min="0" value={s.extra03} onChange={e => updateShow(s.id,'extra03',e.target.value)} /></td>
                      <td className={c.remanescente >= 0 ? 'pos' : 'neg'} style={{whiteSpace:'nowrap'}}>{brl(c.remanescente)}</td>
                      <td>
                        <button className="btn btn-danger-soft btn-xs btn-icon" onClick={() => removeShow(s.id)} title="Remover">✕</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}>TOTAL</td>
                  <td>{brl(totals.bruto)}</td>
                  <td>{brl(totals.agencia)}</td>
                  <td>{brl(totals.liquido)}</td>
                  <td>{brl(totals.management)}</td>
                  <td>{brl(totals.videomaker)}</td>
                  <td>{brl(totals.jonathan)}</td>
                  <td colSpan={3}>{brl(totals.despesasGig)}</td>
                  <td>{brl(totals.remanescente)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
