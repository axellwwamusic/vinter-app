import { useState } from 'react'
import { MONTHS, MONTHS_SHORT, brl, calcMonthTotals, newMonthData } from '../utils/calc'

function FolhaRow({ label, value, onChange, isFormula = false }) {
  return (
    <div className="summary-row">
      <span className="summary-label">{label}</span>
      {isFormula
        ? <span className="summary-value">{brl(value)}</span>
        : (
          <div className="input-prefix" style={{width:140}}>
            <span className="prefix">R$</span>
            <input
              className="form-input mono"
              style={{textAlign:'right', paddingLeft:28, paddingRight:8, width:140, fontSize:13}}
              type="number" min="0" placeholder="0,00"
              value={value === '' ? '' : value}
              onChange={e => onChange(e.target.value)}
            />
          </div>
        )
      }
    </div>
  )
}

export default function Monthly({ data, onChange }) {
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())

  const monthKey = MONTHS[activeMonth]
  const monthData = data.months?.[monthKey] || newMonthData()
  const folha = monthData.folha || {}
  const totals = calcMonthTotals(monthData)

  function updateFolha(field, value) {
    const updated = {
      ...data,
      months: {
        ...data.months,
        [monthKey]: {
          ...monthData,
          folha: { ...folha, [field]: value }
        }
      }
    }
    onChange(updated)
  }

  const filledMonths = MONTHS.filter(m => {
    const t = calcMonthTotals(data.months?.[m])
    return t.bruto > 0
  })

  return (
    <div>
      {/* Month tabs */}
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

      <div className="summary-grid">

        {/* ── FECHAMENTO MENSAL ─────────────────────────────────── */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Fechamento Mensal</div>
          </div>
          <div className="card-body">
            <div className="summary-row">
              <span className="summary-label">Faturamento Bruto</span>
              <span className="summary-value">{brl(totals.bruto)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Faturamento Líquido</span>
              <span className="summary-value" style={{color:'var(--blue)'}}>{brl(totals.liquido)}</span>
            </div>

            <div style={{height:12}} />
            <div className="summary-total">
              <span className="label">Faturamento Limpo</span>
              <span className="value" style={{color: totals.faturamentoLimpo >= 0 ? '#4ade80' : '#f87171'}}>
                {brl(totals.faturamentoLimpo)}
              </span>
            </div>

            <div style={{height:16}} />
            <div style={{fontSize:11, color:'var(--text3)', lineHeight:1.6}}>
              <div>Faturamento Bruto → soma dos cachês brutos</div>
              <div>Faturamento Líquido → bruto menos agência</div>
              <div>Faturamento Limpo → líquido menos total de investimentos</div>
            </div>
          </div>
        </div>

        {/* ── FOLHA DE PAGAMENTO ───────────────────────────────── */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Folha de Pagamento Mensal</div>
          </div>
          <div className="card-body">
            <FolhaRow label="Management (10%)" value={totals.management} isFormula />
            <FolhaRow label="Jonathan" value={totals.jonathan} isFormula />
            <FolhaRow label="Videomaker" value={totals.videomaker} isFormula />
            <FolhaRow label="Despesas Extras em Gigs" value={totals.despesasGig} isFormula />
            <FolhaRow label="Marketing"  value={folha.marketing  ?? ''} onChange={v => updateFolha('marketing', v)} />
            <FolhaRow label="ADS"        value={folha.ads        ?? ''} onChange={v => updateFolha('ads', v)} />
            <FolhaRow label="Impostos"   value={folha.impostos   ?? ''} onChange={v => updateFolha('impostos', v)} />
            <FolhaRow label="Contador"   value={folha.contador   ?? ''} onChange={v => updateFolha('contador', v)} />
            <FolhaRow label="Outros 01"  value={folha.outros01   ?? ''} onChange={v => updateFolha('outros01', v)} />
            <FolhaRow label="Outros 02"  value={folha.outros02   ?? ''} onChange={v => updateFolha('outros02', v)} />
            <FolhaRow label="Outros 03"  value={folha.outros03   ?? ''} onChange={v => updateFolha('outros03', v)} />
            <FolhaRow label="Outros 04"  value={folha.outros04   ?? ''} onChange={v => updateFolha('outros04', v)} />

            <div className="summary-total" style={{marginTop:12}}>
              <span className="label">Total de Investimentos</span>
              <span className="value">{brl(totals.totalFolha)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
