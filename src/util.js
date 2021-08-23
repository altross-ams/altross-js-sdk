export const dlv = (obj, key, def, p, undef) => {
  key = key.split ? key.split(".") : key
  for (p = 0; p < key.length; p++) {
    obj = obj ? obj[key[p]] : undef
  }
  return obj === undef ? def : obj
}
export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    Number(value) === -1 ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  )
}
export const isNumeric = (str) => {
  if (typeof str != "string") return false
  return !isNaN(str) && !isNaN(parseFloat(str))
}

export const replaceChar = (origString, replaceChar, index) => {
  let firstPart = origString.substr(0, index)
  let lastPart = origString.substr(index + 1)

  let newString = firstPart + replaceChar + lastPart
  return newString
}
