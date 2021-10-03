import { isEmpty } from "./utils/helpers"

export const OPERATOR_HASH = {
  Number: {
    10: {
      name: "equal",
      action: (recordValue, conditionValue) =>
        recordValue === Number(conditionValue),
    },
    11: {
      name: "notequal",
      action: (recordValue, conditionValue) =>
        recordValue !== Number(conditionValue),
    },
    12: {
      name: "greaterthan",
      action: (recordValue, conditionValue) => recordValue > conditionValue,
    },
    13: {
      name: "greaterthanequal",
      action: (recordValue, conditionValue) =>
        recordValue > conditionValue || recordValue === Number(conditionValue),
    },
    14: {
      name: "lesserthan",
      action: (recordValue, conditionValue) => recordValue < conditionValue,
    },
    15: {
      name: "lesserthanequal",
      action: (recordValue, conditionValue) =>
        recordValue < conditionValue || recordValue === Number(conditionValue),
    },
    16: {
      name: "empty",
      action: (recordValue) => isEmpty(recordValue),
    },
    17: {
      name: "notempty",
      action: (recordValue) => !isEmpty(recordValue),
    },
  },
  String: {
    20: {
      name: "equal",
      action: (recordValue, conditionValue) => recordValue === conditionValue,
    },
    21: {
      name: "notequal",
      action: (recordValue, conditionValue) => recordValue !== conditionValue,
    },
    22: {
      name: "contains",
      action: (recordValue, conditionValue) =>
        recordValue.includes(conditionValue),
    },
    23: {
      name: "notcontains",
      action: (recordValue, conditionValue) =>
        !recordValue.includes(conditionValue),
    },
    24: {
      name: "startswith",
      action: (recordValue, conditionValue) =>
        recordValue.startsWith(conditionValue),
    },
    25: {
      name: "endswith",
      action: (recordValue, conditionValue) =>
        recordValue.endsWith(conditionValue),
    },
    26: {
      name: "empty",
      action: (recordValue) => isEmpty(recordValue),
    },
    27: {
      name: "notempty",
      action: (recordValue) => !isEmpty(recordValue),
    },
  },
  Boolean: {
    30: {
      name: "empty",
      action: (recordValue) => isEmpty(recordValue),
    },
    31: {
      name: "notempty",
      action: (recordValue) => !isEmpty(recordValue),
    },
    32: {
      name: "true",
      action: (recordValue) => recordValue,
    },
    33: {
      name: "false",
      action: (recordValue) => !recordValue,
    },
  },
  Array: {
    40: {
      name: "empty",
      action: (recordValue) => isEmpty(recordValue),
    },
    41: {
      name: "notempty",
      action: (recordValue) => !isEmpty(recordValue),
    },
    42: {
      name: "equal",
      action: (recordValue, conditionValue) =>
        _.isEqual(recordValue, conditionValue),
    },
    43: {
      name: "notequal",
      action: (recordValue, conditionValue) =>
        !_.isEqual(recordValue, conditionValue),
    },
  },
}
