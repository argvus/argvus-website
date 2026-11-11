const europeanPortugueseReplacements: Array<[RegExp, string]> = [
  [/\busuários\b/gi, 'utilizadores'], [/\busuário\b/gi, 'utilizador'],
  [/\busuárias\b/gi, 'utilizadoras'], [/\busuária\b/gi, 'utilizadora'],
  [/\baplicativos\b/gi, 'aplicações'], [/\baplicativo\b/gi, 'aplicação'],
  [/\bônibus\b/gi, 'autocarro'], [/\bcelulares\b/gi, 'telemóveis'], [/\bcelular\b/gi, 'telemóvel'],
  [/\btela\b/gi, 'ecrã'], [/\btelas\b/gi, 'ecrãs'], [/\barquivos\b/gi, 'ficheiros'], [/\barquivo\b/gi, 'ficheiro'],
  [/\bmouse\b/gi, 'rato'], [/\bequipe\b/gi, 'equipa'], [/\bequipes\b/gi, 'equipas'],
  [/\bônibus\b/gi, 'autocarro'], [/\bbanheiro\b/gi, 'casa de banho'],
  [/\b(mais) fácil\b/gi, '$1 simples'], [/\bna sua máquina\b/gi, 'no seu computador'],
  [/\binstalado no primeiro uso\b/gi, 'instalado na primeira utilização'],
  [/\binstalação e primeiro uso\b/gi, 'instalação e primeira utilização'],
  [/\bVocê\b/g, 'Você'], [/\bseu\b/gi, 'seu'],
]

export function adaptEuropeanPortuguese<T>(value: T): T {
  if (typeof value === 'string') {
    return europeanPortugueseReplacements.reduce(
      (text, [pattern, replacement]) => text.replace(pattern, replacement),
      value,
    ) as T
  }
  if (Array.isArray(value)) return value.map((item) => adaptEuropeanPortuguese(item)) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, adaptEuropeanPortuguese(item)])) as T
  }
  return value
}
