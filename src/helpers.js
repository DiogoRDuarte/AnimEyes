export function arabicToKanji(number) {
  const kanjiNumerals = ["一","二","三","四","五","六","七","八","九"]
  const tenKanji = "十"
  const hundredKanji = "百"
  const arabicDigits = number.toString().split("")

  if (arabicDigits.length === 1) {
    return kanjiNumerals[parseInt(arabicDigits[0]) - 1]
  } else if (arabicDigits.length === 2) {
    const firstDigit = parseInt(arabicDigits[0])
    const secondDigit = parseInt(arabicDigits[1])
    const kanjiRepresentation = []
    if (firstDigit > 1) kanjiRepresentation.push(kanjiNumerals[firstDigit - 1])
    kanjiRepresentation.push(tenKanji)
    if (secondDigit > 0) kanjiRepresentation.push(kanjiNumerals[secondDigit - 1])
    return kanjiRepresentation.join("")
  } else if (arabicDigits.length === 3 && parseInt(number) === 100) {
    return hundredKanji
  }
  return "Unsupported"
}
