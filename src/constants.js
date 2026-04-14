export const CURRENT_YEAR = new Date().getFullYear()

export const YEAR_TAGS = [
  { label: 'All Time', value: null },
  ...Array.from({ length: 5 }, (_, i) => {
    const y = CURRENT_YEAR - i
    return { label: String(y), value: y }
  }),
]
