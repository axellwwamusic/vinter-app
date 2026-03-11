export const MONTHS = [
  "JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO",
  "JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"
]
export const MONTHS_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

export function brl(v) {
  const n = +v || 0
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function pct(v) {
  return ((+v || 0) * 100).toFixed(1) + '%'
}

export function newShow() {
  return {
    id: crypto.randomUUID(),
    dia: '', evento: '', cidade: '', estado: '', pais: 'BR',
    cacheBruto: '', videomaker: '', jonathan: '',
    extra01: '', extra02: '', extra03: '',
  }
}

export function newFolha() {
  return { marketing: '', ads: '', impostos: '', contador: '', outros01: '', outros02: '', outros03: '', outros04: '' }
}

export function newMonthData() {
  return { shows: [newShow()], folha: newFolha() }
}

export function initAllData() {
  const months = {}
  MONTHS.forEach(m => { months[m] = newMonthData() })
  return { months }
}

export function calcShow(s) {
  const bruto = +s.cacheBruto || 0
  const agencia = bruto * 0.15
  const liquido = bruto - agencia
  const management = bruto * 0.10
  const videomaker = +s.videomaker || 0
  const jonathan = +s.jonathan || 0
  const extra01 = +s.extra01 || 0
  const extra02 = +s.extra02 || 0
  const extra03 = +s.extra03 || 0
  const despesasGig = extra01 + extra02 + extra03
  const remanescente = liquido - management - videomaker - jonathan - despesasGig
  return { bruto, agencia, liquido, management, videomaker, jonathan, extra01, extra02, extra03, despesasGig, remanescente }
}

export function calcMonthTotals(monthData) {
  const shows = monthData?.shows || []
  const folha = monthData?.folha || newFolha()

  const agg = shows.reduce((acc, s) => {
    const c = calcShow(s)
    return {
      bruto: acc.bruto + c.bruto,
      agencia: acc.agencia + c.agencia,
      liquido: acc.liquido + c.liquido,
      management: acc.management + c.management,
      videomaker: acc.videomaker + c.videomaker,
      jonathan: acc.jonathan + c.jonathan,
      despesasGig: acc.despesasGig + c.despesasGig,
    }
  }, { bruto: 0, agencia: 0, liquido: 0, management: 0, videomaker: 0, jonathan: 0, despesasGig: 0 })

  const totalFolha =
    agg.management + agg.jonathan + agg.videomaker + agg.despesasGig +
    (+folha.marketing || 0) + (+folha.ads || 0) +
    (+folha.impostos || 0) + (+folha.contador || 0) +
    (+folha.outros01 || 0) + (+folha.outros02 || 0) +
    (+folha.outros03 || 0) + (+folha.outros04 || 0)

  const faturamentoLimpo = agg.liquido - totalFolha

  return {
    ...agg,
    folha,
    marketing: +folha.marketing || 0,
    ads: +folha.ads || 0,
    impostos: +folha.impostos || 0,
    contador: +folha.contador || 0,
    outros: (+folha.outros01||0)+(+folha.outros02||0)+(+folha.outros03||0)+(+folha.outros04||0),
    totalFolha,
    faturamentoLimpo,
    showCount: shows.filter(s => s.evento || s.cacheBruto).length,
  }
}

export function calcAnnualTotals(allData) {
  return MONTHS.map(m => ({
    month: m,
    ...calcMonthTotals(allData?.months?.[m])
  }))
}
