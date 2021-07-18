const utils = {
  dlv(obj, key, def, p, undef) {
    key = key.split ? key.split(".") : key
    for (p = 0; p < key.length; p++) {
      obj = obj ? obj[key[p]] : undef
    }
    return obj === undef ? def : obj
  },
  isEmpty(value) {
    return (
      value === undefined ||
      value === null ||
      Number(value) === -1 ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0)
    )
  },
}

export default utils
