import { MONTHS, MONTHS_SHORT, brl, calcAnnualTotals, calcMonthTotals } from '../utils/calc'

export default function Annual({ data }) {
  const monthTotals = calcAnnualTotals(data)
  const grand = monthTotals.reduce((acc, m) => ({
    bruto: acc.bruto + m.bruto,
    agencia: acc.agencia + m.agencia,
    liquido: acc.liquido + m.liquido,
    management: acc.management + m.management,
    videomaker: acc.videomaker + m.videomaker,
    jonathan: acc.jonathan + m.jonathan,
    despesasGig: acc.despesasGig + m.despesasGig,
    marketing: acc.marketing + m.marketing,
    ads: acc.ads + m.ads,
    impostos: acc.impostos + m.impostos,
    contador: acc.contador + m.contador,
    outros: acc.outros + m.outros,
    totalFolha: acc.totalFolha + m.totalFolha,
    faturamentoLimpo: acc.faturamentoLimpo + m.faturamentoLimpo,
    showCount: acc.showCount + m.showCount,
  }), { bruto:0,agencia:0,liquido:0,management:0,videomaker:0,jonathan:0,
       despesasGig:0,marketing:0,ads:0,impostos:0,contador:0,outros:0,
       totalFolha:0,faturamentoLimpo:0,showCount:0 })

  return (
    <div>
      {/* KPI row */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Faturamento Bruto Anual</div>
          <div className="kpi-val def">{brl(grand.bruto)}</div>
          <div className="kpi-meta">{grand.showCount} show(s) no ano</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Faturamento Líquido Anual</div>
          <div className="kpi-val neu">{brl(grand.liquido)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Investimentos</div>
          <div className="kpi-val neg">{brl(grand.totalFolha)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Faturamento Limpo Anual</div>
          <div className={`kpi-val ${grand.faturamentoLimpo >= 0 ? 'pos' : 'neg'}`}>{brl(grand.faturamentoLimpo)}</div>
          <div className="kpi-meta">Líquido − todos os investimentos</div>
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div className="card">
        <div className="card-head">
          <div className="card-title">Resultado por Mês — 2026</div>
        </div>
        <div className="card-body p0">
          <div className="tbl-wrap" style={{borderRadius:'0 0 12px 12px', border:'none', borderTop:'1px solid var(--border)'}}>
            <table>
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Shows</th>
                  <th>Cachê Bruto</th>
                  <th>Agência</th>
                  <th>Cachê Líquido</th>
                  <th>Total Investimentos</th>
                  <th>Fat. Limpo</th>
                </tr>
              </thead>
              <tbody>
                {monthTotals.map((m, i) => (
                  <tr key={m.month} style={{opacity: m.bruto === 0 ? 0.4 : 1}}>
                    <td style={{fontWeight:500}}>{MONTHS_SHORT[i]}</td>
                    <td style={{color:'var(--text2)'}}>{m.showCount}</td>
                    <td className="mono">{brl(m.bruto)}</td>
                    <td className="neg">{brl(m.agencia)}</td>
                    <td className="neu mono">{brl(m.liquido)}</td>
                    <td className="neg">{brl(m.totalFolha)}</td>
                    <td className={m.faturamentoLimpo >= 0 ? 'pos' : 'neg'}>{brl(m.faturamentoLimpo)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>TOTAL ANUAL</td>
                  <td>{grand.showCount}</td>
                  <td>{brl(grand.bruto)}</td>
                  <td>{brl(grand.agencia)}</td>
                  <td>{brl(grand.liquido)}</td>
                  <td>{brl(grand.totalFolha)}</td>
                  <td>{brl(grand.faturamentoLimpo)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed closing */}
      <div className="annual-section">
        <div className="annual-section-title">Fechamento Anual Detalhado</div>
        <div className="summary-grid">
          <div className="card">
            <div className="card-head"><div className="card-title">Receitas</div></div>
            <div className="card-body">
              <div className="summary-row"><span className="summary-label">Faturamento Bruto</span><span className="summary-value">{brl(grand.bruto)}</span></div>
              <div className="summary-row"><span className="summary-label">Faturamento Agência</span><span className="summary-value" style={{color:'var(--red)'}}>{brl(grand.agencia)}</span></div>
              <div className="summary-row"><span className="summary-label">Faturamento Líquido</span><span className="summary-value" style={{color:'var(--blue)'}}>{brl(grand.liquido)}</span></div>
              <div className="summary-total" style={{marginTop:12}}>
                <span className="label">Faturamento Limpo Anual</span>
                <span className="value" style={{color: grand.faturamentoLimpo >= 0 ? '#4ade80' : '#f87171'}}>{brl(grand.faturamentoLimpo)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><div className="card-title">Investimentos & Despesas</div></div>
            <div className="card-body">
              <div className="summary-row"><span className="summary-label">Faturamento Axell (Management)</span><span className="summary-value" style={{color:'var(--red)'}}>{brl(grand.management)}</span></div>
              <div className="summary-row"><span className="summary-label">Investimento Videomaker</span><span className="summary-value" style={{color:'var(--red)'}}>{brl(grand.videomaker)}</span></div>
              <div className="summary-row"><span className="summary-label">Faturamento Jonathan</span><span className="summary-value" style={{color:'var(--red)'}}>{brl(grand.jonathan)}</span></div>
              <div className="summary-row"><span className="summary-label">Despesas Extras em Gig</span><span className="summary-value" style={{color:'var(--red)'}}>{brl(grand.despesasGig)}</span></div>
              <div className="summary-row"><span className="summary-label">Investimento em Marketing</span><span className="summary-value" style={{color:'var(--red)'}}>{brl(grand.marketing)}</span></div>
              <div className="summary-row"><span className="summary-label">Investimento em ADS</span><span className="summary-value" style={{color:'var(--red)'}}>{brl(grand.ads)}</span></div>
              <div className="summary-row"><span className="summary-label">Impostos</span><span className="summary-value" style={{color:'var(--red)'}}>{brl(grand.impostos)}</span></div>
              <div className="summary-row"><span className="summary-label">Contabilidade</span><span className="summary-value" style={{color:'var(--red)'}}>{brl(grand.contador)}</span></div>
              <div className="summary-row"><span className="summary-label">Outros Investimentos</span><span className="summary-value" style={{color:'var(--red)'}}>{brl(grand.outros)}</span></div>
              <div className="summary-total" style={{marginTop:12}}>
                <span className="label">Total de Investimentos</span>
                <span className="value">{brl(grand.totalFolha)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
