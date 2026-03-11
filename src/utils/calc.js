export const MONTHS = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO']
export const MONTHS_SHORT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export const brl = v => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(+v||0)
export const uid = () => Math.random().toString(36).slice(2,9)

export function newShow() {
  return { id: uid(), dia:'', evento:'', cidade:'', estado:'SP', pais:'BR', cacheBruto:0, videomaker:0, jonathan:0, extra01:0, extra02:0, extra03:0 }
}

export function newMonthData() {
  return { shows: [newShow()], salarios:{}, outros:{} }
}

export function calcShow(s) {
  const bruto   = +s.cacheBruto || 0
  const agencia = bruto * 0.15
  const liquido = bruto - agencia
  const management = liquido * 0.10
  const videomaker = +s.videomaker || 0
  const jonathan   = +s.jonathan   || 0
  const extra01    = +s.extra01    || 0
  const extra02    = +s.extra02    || 0
  const extra03    = +s.extra03    || 0
  const despesasGig = extra01 + extra02 + extra03
  const remanescente = liquido - management - videomaker - jonathan - despesasGig
  return { bruto, agencia, liquido, management, videomaker, jonathan, extra01, extra02, extra03, despesasGig, remanescente }
}

export function calcMonthTotals(monthData) {
  const shows = monthData?.shows || []
  return shows.reduce((acc, s) => {
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
}

export function calcAnnualTotals(allData) {
  return MONTHS.map(m => ({ month: m, ...calcMonthTotals(allData?.months?.[m]) }))
}
